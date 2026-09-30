import { prisma } from "./client";
import type {
  Research_Areas,
  Research_Projects,
  Research_Areas_Team_Members,
  Research_Areas_Tools,
  Research_Areas_Publications,
  Team_Members,
  Tools,
  Publications,
  Prisma,
} from "@prisma/client";

// Mapeia entre Research_Areas + Research_Projects + as 3 junções de nível
// "área inteira" (Research_Areas_Team_Members/_Tools/_Publications) e o
// shape "achatado" que o front-end/editor já consomem.
//
// Decisões de design:
// - Research.id (legado) é slug de texto -> mapeia pra Research_Areas.slug.
// - team_relationships resolvido por NOME (igual Tools), uma linha por role.
// - tools_relationships resolvido por SLUG do Tool (é como o seletor de UI
//   já funciona — ToolRelationshipSelector guarda tool.id, não tool.name).
// - publication_relationships resolvido por TÍTULO (igual Tools).
// - Sem is_active aqui (Research_Areas não tem essa coluna no schema — nada
//   mais referencia uma Research como FK obrigatória, então "publicar"
//   pode apagar e recriar direto, sem risco de órfãos em outras tabelas).

export interface LegacyResearch {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  highlightImageUrl: string;
  duration: string;
  projects?: Array<{ name: string; imageUrl: string; description: string }>;
  team_relationships?: Array<{ name: string; roles: string[] }>;
  publication_relationships?: string[];
  tools_relationships?: string[];
}

type ResearchWithRelations = Research_Areas & {
  projects: Research_Projects[];
  research_areas_team_members: (Research_Areas_Team_Members & { team_member: Team_Members | null })[];
  research_areas_tools: (Research_Areas_Tools & { tool: Tools | null })[];
  research_areas_publications: (Research_Areas_Publications & { publication: Publications | null })[];
};

const researchInclude = {
  projects: true,
  research_areas_team_members: { include: { team_member: true } },
  research_areas_tools: { include: { tool: true } },
  research_areas_publications: { include: { publication: true } },
} satisfies Prisma.Research_AreasInclude;

/* --------------------------------- Read mapping --------------------------------- */

function groupTeamRelationships(
  rows: (Research_Areas_Team_Members & { team_member: Team_Members | null })[],
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

function toLegacy(row: ResearchWithRelations): LegacyResearch {
  return {
    id: row.slug,
    name: row.name ?? "",
    shortDescription: row.shortDescription ?? "",
    longDescription: row.longDescription ?? "",
    highlightImageUrl: row.highlightImageUrl ?? "",
    duration: row.duration ?? "",
    projects: [...row.projects]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((p) => ({
        name: p.name ?? "",
        imageUrl: p.imageUrl ?? "",
        description: p.description ?? "",
      })),
    team_relationships: groupTeamRelationships(row.research_areas_team_members),
    publication_relationships: [...row.research_areas_publications]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((rp) => rp.publication?.title)
      .filter((t): t is string => !!t),
    tools_relationships: [...row.research_areas_tools]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((rt) => rt.tool?.slug)
      .filter((s): s is string => !!s),
  };
}

/* ----------------------------------- Reads ----------------------------------- */

export async function researchExists(slug: string): Promise<boolean> {
  const found = await prisma.research_Areas.findUnique({ where: { slug }, select: { id: true } });
  return !!found;
}

export async function listResearches(): Promise<LegacyResearch[]> {
  const rows = await prisma.research_Areas.findMany({
    include: researchInclude,
    orderBy: { id: "asc" },
  });
  return rows.map(toLegacy);
}

/* --------------------------------- Write mapping --------------------------------- */

function buildBaseData(research: LegacyResearch) {
  return {
    slug: research.id,
    name: research.name || null,
    shortDescription: research.shortDescription || null,
    longDescription: research.longDescription || null,
    highlightImageUrl: research.highlightImageUrl || null,
    duration: research.duration || null,
  };
}

type Tx = Prisma.TransactionClient;

async function syncResearchRelations(
  tx: Tx,
  researchAreaId: number,
  research: LegacyResearch,
): Promise<void> {
  // Projects
  await tx.research_Projects.deleteMany({ where: { research_area_id: researchAreaId } });
  const projects = (research.projects || []).map((p, position) => ({
    name: p.name || null,
    imageUrl: p.imageUrl || null,
    description: p.description || null,
    position,
    research_area_id: researchAreaId,
  }));
  if (projects.length) await tx.research_Projects.createMany({ data: projects });

  // Team relationships (por nome; uma linha por role)
  await tx.research_Areas_Team_Members.deleteMany({ where: { research_area_id: researchAreaId } });
  const teamRows: { research_area_id: number; team_member_id: number; role: string | null; position: number }[] = [];
  let tpos = 0;
  for (const rel of research.team_relationships || []) {
    const member = await tx.team_Members.findFirst({ where: { name: rel.name } });
    if (!member) continue;
    if (!rel.roles || rel.roles.length === 0) {
      teamRows.push({ research_area_id: researchAreaId, team_member_id: member.id, role: null, position: tpos++ });
    } else {
      for (const role of rel.roles) {
        teamRows.push({ research_area_id: researchAreaId, team_member_id: member.id, role, position: tpos++ });
      }
    }
  }
  if (teamRows.length) await tx.research_Areas_Team_Members.createMany({ data: teamRows });

  // Tools relationships (por slug)
  await tx.research_Areas_Tools.deleteMany({ where: { research_area_id: researchAreaId } });
  const toolRows: { research_area_id: number; tool_id: number; position: number }[] = [];
  let toolPos = 0;
  for (const slug of research.tools_relationships || []) {
    const tool = await tx.tools.findUnique({ where: { slug } });
    if (!tool) continue;
    toolRows.push({ research_area_id: researchAreaId, tool_id: tool.id, position: toolPos++ });
  }
  if (toolRows.length) await tx.research_Areas_Tools.createMany({ data: toolRows });

  // Publication relationships (por título)
  await tx.research_Areas_Publications.deleteMany({ where: { research_area_id: researchAreaId } });
  const pubRows: { research_area_id: number; publication_id: number; position: number }[] = [];
  let pubPos = 0;
  for (const title of research.publication_relationships || []) {
    const pub = await tx.publications.findFirst({ where: { title } });
    if (!pub) continue;
    pubRows.push({ research_area_id: researchAreaId, publication_id: pub.id, position: pubPos++ });
  }
  if (pubRows.length) await tx.research_Areas_Publications.createMany({ data: pubRows });
}

/* -------------------------- Create/update (editor CRUD) -------------------------- */

/** Espelha updateResearch(research, isNew) do fluxo antigo — sem suporte a renomear slug. */
export async function upsertResearch(research: LegacyResearch, isNew: boolean): Promise<void> {
  const baseData = buildBaseData(research);

  await prisma.$transaction(async (tx) => {
    const existing = await tx.research_Areas.findUnique({ where: { slug: research.id } });
    let row;

    if (isNew) {
      if (existing) throw new Error("Já existe uma research com este ID");
      row = await tx.research_Areas.create({ data: baseData });
    } else {
      if (!existing) throw new Error("Research não encontrada");
      row = await tx.research_Areas.update({ where: { id: existing.id }, data: baseData });
    }

    await syncResearchRelations(tx, row.id, research);
  });
}

/* ------------------------- Replace-all (publish do main) ------------------------- */

/**
 * Usado pelo POST de /api/researches do apps/main. Diferente de Team/Tools:
 * Research_Areas não é referenciada como FK obrigatória por mais nada, então
 * apagar e recriar tudo (igual Publications) é seguro — não deixa órfãos.
 */
export async function replaceResearches(researches: LegacyResearch[]): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.research_Areas.deleteMany({});
    for (const research of researches) {
      const row = await tx.research_Areas.create({ data: buildBaseData(research) });
      await syncResearchRelations(tx, row.id, research);
    }
  });
}
