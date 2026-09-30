import { prisma } from "./client";
import type {
  Tools,
  Tool_Items,
  Tool_Gallery_Images,
  Tools_Team_Members,
  Tools_Publications,
  Team_Members,
  Publications,
  ToolItemType,
  Prisma,
} from "@prisma/client";

// Mapeia entre as 5 tabelas normalizadas (Tools, Tool_Items,
// Tool_Gallery_Images, Tools_Team_Members, Tools_Publications) e o shape
// "achatado" que o front-end/editor já consomem.
//
// Decisões de design:
// - Tool.id (legado) é uma slug de texto (ex: "tool-raise") -> mapeia pra
//   Tools.slug. O id interno (serial) do Postgres nunca é exposto pra fora.
// - team_relationships/publication_relationships eram guardados por
//   NOME/TÍTULO (sem integridade referencial nenhuma no Sheets). No Postgres
//   isso vira FK de verdade: ao gravar, resolvemos nome->Team_Members e
//   título->Publications; quando não encontra correspondência, a linha é
//   simplesmente ignorada (não tem como guardar uma referência "quebrada"
//   num FK real — a UI já sinalizava isso como "Conflito Detectado" antes).
// - Tools_Team_Members: uma linha por role (decisão já tomada no schema).
//   Na leitura, agrupamos de volta em {name, roles: string[]}.

export interface LegacyToolLinks {
  webapp: string;
  github: string;
  api: string;
  docs: string;
}

export interface LegacyTool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  category: string;
  highlightImageUrl: string;
  galleryImagesUrl?: string[];
  duration: string;
  objectives?: string[];
  features?: string[];
  techStack?: string[];
  team_relationships?: Array<{ name: string; roles: string[] }>;
  publication_relationships?: string[];
  links: LegacyToolLinks;
}

type ToolWithRelations = Tools & {
  items: Tool_Items[];
  gallery_images: Tool_Gallery_Images[];
  tools_team_members: (Tools_Team_Members & { team_member: Team_Members | null })[];
  tools_publications: (Tools_Publications & { publication: Publications | null })[];
};

const toolInclude = {
  items: true,
  gallery_images: true,
  tools_team_members: { include: { team_member: true } },
  tools_publications: { include: { publication: true } },
} satisfies Prisma.ToolsInclude;

/* --------------------------------- Read mapping --------------------------------- */

function itemsByType(items: Tool_Items[], type: ToolItemType): string[] {
  return items
    .filter((i) => i.type === type)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((i) => i.value);
}

function groupTeamRelationships(
  rows: (Tools_Team_Members & { team_member: Team_Members | null })[],
): Array<{ name: string; roles: string[] }> {
  const order: string[] = [];
  const roles = new Map<string, string[]>();

  for (const row of [...rows].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))) {
    const name = row.team_member?.name;
    if (!name) continue;
    if (!roles.has(name)) {
      roles.set(name, []);
      order.push(name);
    }
    if (row.role) roles.get(name)!.push(row.role);
  }

  return order.map((name) => ({ name, roles: roles.get(name)! }));
}

function toLegacy(row: ToolWithRelations): LegacyTool {
  return {
    id: row.slug,
    name: row.name ?? "",
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    longDescription: row.longDescription ?? "",
    category: row.category ?? "",
    highlightImageUrl: row.highlightImageUrl ?? "",
    galleryImagesUrl: [...row.gallery_images]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((g) => g.imageUrl),
    duration: row.duration ?? "",
    objectives: itemsByType(row.items, "objective"),
    features: itemsByType(row.items, "feature"),
    techStack: itemsByType(row.items, "tech_stack"),
    team_relationships: groupTeamRelationships(row.tools_team_members),
    publication_relationships: [...row.tools_publications]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((tp) => tp.publication?.title)
      .filter((t): t is string => !!t),
    links: {
      webapp: row.link_webapp ?? "",
      github: row.link_github ?? "",
      api: row.link_api ?? "",
      docs: row.link_docs ?? "",
    },
  };
}

/* ----------------------------------- Reads ----------------------------------- */

export async function toolExists(slug: string): Promise<boolean> {
  const found = await prisma.tools.findUnique({ where: { slug }, select: { id: true } });
  return !!found;
}

export async function listTools(
  opts: { onlyActive?: boolean } = {},
): Promise<LegacyTool[]> {
  const rows = await prisma.tools.findMany({
    where: opts.onlyActive ? { is_active: true } : undefined,
    include: toolInclude,
    orderBy: { id: "asc" },
  });
  return rows.map(toLegacy);
}

/* --------------------------------- Write mapping --------------------------------- */

function buildBaseData(tool: LegacyTool) {
  return {
    slug: tool.id,
    name: tool.name || null,
    tagline: tool.tagline || null,
    description: tool.description || null,
    longDescription: tool.longDescription || null,
    category: tool.category || null,
    highlightImageUrl: tool.highlightImageUrl || null,
    duration: tool.duration || null,
    link_webapp: tool.links?.webapp || null,
    link_github: tool.links?.github || null,
    link_api: tool.links?.api || null,
    link_docs: tool.links?.docs || null,
  };
}

type Tx = Prisma.TransactionClient;

async function syncToolRelations(tx: Tx, toolId: number, tool: LegacyTool): Promise<void> {
  // Objectives / Features / Tech stack
  await tx.tool_Items.deleteMany({ where: { tool_id: toolId } });
  const items = [
    ...(tool.objectives || []).map((value, position) => ({
      type: "objective" as ToolItemType,
      value,
      position,
    })),
    ...(tool.features || []).map((value, position) => ({
      type: "feature" as ToolItemType,
      value,
      position,
    })),
    ...(tool.techStack || []).map((value, position) => ({
      type: "tech_stack" as ToolItemType,
      value,
      position,
    })),
  ];
  if (items.length) {
    await tx.tool_Items.createMany({
      data: items.map((it) => ({ ...it, tool_id: toolId })),
    });
  }

  // Gallery
  await tx.tool_Gallery_Images.deleteMany({ where: { tool_id: toolId } });
  const gallery = (tool.galleryImagesUrl || []).map((imageUrl, position) => ({
    imageUrl,
    position,
    tool_id: toolId,
  }));
  if (gallery.length) await tx.tool_Gallery_Images.createMany({ data: gallery });

  // Team relationships (resolvidos por nome; uma linha por role)
  await tx.tools_Team_Members.deleteMany({ where: { tool_id: toolId } });
  const teamRows: { tool_id: number; team_member_id: number; role: string | null; position: number }[] = [];
  let pos = 0;
  for (const rel of tool.team_relationships || []) {
    const member = await tx.team_Members.findFirst({ where: { name: rel.name } });
    if (!member) continue; // nome sem correspondência -> descartado (referência quebrada)
    if (!rel.roles || rel.roles.length === 0) {
      teamRows.push({ tool_id: toolId, team_member_id: member.id, role: null, position: pos++ });
    } else {
      for (const role of rel.roles) {
        teamRows.push({ tool_id: toolId, team_member_id: member.id, role, position: pos++ });
      }
    }
  }
  if (teamRows.length) await tx.tools_Team_Members.createMany({ data: teamRows });

  // Publication relationships (resolvidos por título)
  await tx.tools_Publications.deleteMany({ where: { tool_id: toolId } });
  const pubRows: { tool_id: number; publication_id: number; position: number }[] = [];
  let ppos = 0;
  for (const title of tool.publication_relationships || []) {
    const pub = await tx.publications.findFirst({ where: { title } });
    if (!pub) continue;
    pubRows.push({ tool_id: toolId, publication_id: pub.id, position: ppos++ });
  }
  if (pubRows.length) await tx.tools_Publications.createMany({ data: pubRows });
}

/* -------------------------- Create/update (editor CRUD) -------------------------- */

/** Espelha updateTool(tool, isNew) do fluxo antigo — sem suporte a renomear slug. */
export async function upsertTool(tool: LegacyTool, isNew: boolean): Promise<void> {
  const baseData = buildBaseData(tool);

  await prisma.$transaction(async (tx) => {
    const existing = await tx.tools.findUnique({ where: { slug: tool.id } });
    let toolRow;

    if (isNew) {
      if (existing) throw new Error("Já existe um tool com este ID");
      toolRow = await tx.tools.create({ data: baseData });
    } else {
      if (!existing) throw new Error("Tool não encontrado");
      toolRow = await tx.tools.update({ where: { id: existing.id }, data: baseData });
    }

    await syncToolRelations(tx, toolRow.id, tool);
  });
}

/* ------------------------- Replace-all (publish do main) ------------------------- */

/**
 * Usado pelo POST de /api/tools do apps/main. Mesmo padrão do Team: upsert
 * por slug, e quem não está mais no payload vira is_active=false (não é
 * apagado — preserva relações existentes de outras entidades apontando pra
 * esse Tool).
 */
export async function replaceTools(tools: LegacyTool[]): Promise<void> {
  const slugs = tools.map((t) => t.id);

  await prisma.$transaction(async (tx) => {
    for (const tool of tools) {
      const baseData = { ...buildBaseData(tool), is_active: true };
      const existing = await tx.tools.findUnique({ where: { slug: tool.id } });

      const toolRow = existing
        ? await tx.tools.update({ where: { id: existing.id }, data: baseData })
        : await tx.tools.create({ data: baseData });

      await syncToolRelations(tx, toolRow.id, tool);
    }

    await tx.tools.updateMany({
      where: { slug: { notIn: slugs } },
      data: { is_active: false },
    });
  });
}
