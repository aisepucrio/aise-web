import { prisma } from "./client";
import type {
  Team_Members,
  Team_Member_Editables,
  Team_Member_Items,
  TeamMemberItemType,
} from "@prisma/client";

// Mapeia entre as 3 tabelas normalizadas (Team_Members, Team_Member_Editables,
// Team_Member_Items) e o shape "achatado" que o front-end/editor já consomem
// (o mesmo shape que vinha do Google Sheets).
//
// Decisão de design: google_email (identidade/auth, Team_Members) e
// contact_email (Team_Member_Editables) são gravados com o MESMO valor —
// hoje a app só conhece um campo "email" só, então preservamos isso gravando
// nos dois lugares. Isso resolve o bug histórico de duas pessoas com o mesmo
// email (unique constraint no banco), mantendo o contrato externo idêntico.

export interface LegacyTeamMember {
  name: string;
  position: string;
  is_alumni?: boolean;
  university?: string;
  imageUrl: string;
  description: string;
  email: string;
  researchInterests: string[];
  technologies: string[];
  knowledge: string[];
  birthday?: string;
  socialLinks?: {
    lattes?: string;
    personalWebsite?: string;
    linkedin?: string;
    github?: string;
    googleScholar?: string;
    orcid?: string;
  };
}

type MemberWithRelations = Team_Members & {
  editable:
    | (Team_Member_Editables & { items: Team_Member_Items[] })
    | null;
};

/* ------------------------------ Datas (DD/MM/YYYY) ----------------------------- */

function parseBirthday(birthday?: string | null): Date | null {
  if (!birthday) return null;
  const match = birthday.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  return new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
}

function formatBirthday(date: Date | null): string {
  if (!date) return "";
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getUTCFullYear()}`;
}

/* --------------------------------- Read mapping --------------------------------- */

function itemsByType(items: Team_Member_Items[], type: TeamMemberItemType): string[] {
  return items
    .filter((i) => i.type === type)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((i) => i.value);
}

function toLegacy(row: MemberWithRelations): LegacyTeamMember {
  const editable = row.editable!;
  return {
    name: row.name ?? "",
    position: editable.position ?? "",
    is_alumni: editable.is_alumni,
    university: editable.university ?? "",
    imageUrl: editable.imageUrl ?? "",
    description: editable.description ?? "",
    email: row.google_email,
    researchInterests: itemsByType(editable.items, "research_interest"),
    technologies: itemsByType(editable.items, "technology"),
    knowledge: itemsByType(editable.items, "knowledge"),
    birthday: formatBirthday(row.birth_date),
    socialLinks: {
      lattes: editable.lattes ?? "",
      personalWebsite: editable.personalWebsite ?? "",
      linkedin: editable.linkedin ?? "",
      github: editable.github ?? "",
      googleScholar: editable.googleScholar ?? "",
      orcid: editable.orcid ?? "",
    },
  };
}

/* --------------------------------- Write mapping --------------------------------- */

function buildEditableData(member: LegacyTeamMember) {
  return {
    position: member.position || null,
    university: member.university || null,
    imageUrl: member.imageUrl || null,
    description: member.description || null,
    contact_email: member.email || null,
    lattes: member.socialLinks?.lattes || null,
    personalWebsite: member.socialLinks?.personalWebsite || null,
    linkedin: member.socialLinks?.linkedin || null,
    github: member.socialLinks?.github || null,
    googleScholar: member.socialLinks?.googleScholar || null,
    orcid: member.socialLinks?.orcid || null,
    is_alumni: !!member.is_alumni,
  };
}

function buildItems(member: LegacyTeamMember) {
  const items: { type: TeamMemberItemType; value: string; position: number }[] = [];
  (member.researchInterests || []).forEach((v, i) =>
    items.push({ type: "research_interest", value: v, position: i }),
  );
  (member.technologies || []).forEach((v, i) =>
    items.push({ type: "technology", value: v, position: i }),
  );
  (member.knowledge || []).forEach((v, i) =>
    items.push({ type: "knowledge", value: v, position: i }),
  );
  return items;
}

/* ----------------------------------- Reads ----------------------------------- */

export async function listTeamMembers(
  opts: { onlyActive?: boolean } = {},
): Promise<LegacyTeamMember[]> {
  const rows = await prisma.team_Members.findMany({
    where: opts.onlyActive ? { is_active: true } : undefined,
    include: { editable: { include: { items: true } } },
    orderBy: { id: "asc" },
  });
  return rows.filter((r): r is MemberWithRelations & { editable: NonNullable<MemberWithRelations["editable"]> } => !!r.editable).map(toLegacy);
}

/* -------------------------- Create/update (editor CRUD) -------------------------- */

/** Espelha updateTeamMember(member, isNew, originalEmail) do fluxo antigo. */
export async function upsertTeamMember(
  member: LegacyTeamMember,
  isNew: boolean,
  originalEmail: string = member.email,
): Promise<void> {
  const editableData = buildEditableData(member);
  const items = buildItems(member);
  const birth_date = parseBirthday(member.birthday);

  if (isNew) {
    const existing = await prisma.team_Members.findUnique({
      where: { google_email: member.email },
    });
    if (existing) {
      throw new Error("Já existe um membro cadastrado com este email");
    }

    await prisma.team_Members.create({
      data: {
        google_email: member.email,
        name: member.name || null,
        birth_date,
        editable: { create: { ...editableData, items: { create: items } } },
      },
    });
    return;
  }

  const existing = await prisma.team_Members.findUnique({
    where: { google_email: originalEmail },
  });
  if (!existing) {
    throw new Error("Membro não encontrado para atualização");
  }

  await prisma.$transaction(async (tx) => {
    await tx.team_Members.update({
      where: { id: existing.id },
      data: { google_email: member.email, name: member.name || null, birth_date },
    });

    const editable = await tx.team_Member_Editables.upsert({
      where: { team_member_id: existing.id },
      update: editableData,
      create: { team_member_id: existing.id, ...editableData },
    });

    await tx.team_Member_Items.deleteMany({
      where: { team_member_editable_id: editable.id },
    });
    if (items.length) {
      await tx.team_Member_Items.createMany({
        data: items.map((it) => ({ ...it, team_member_editable_id: editable.id })),
      });
    }
  });
}

/* ------------------------- Replace-all (publish do main) ------------------------- */

/**
 * Usado pelo POST de /api/team do apps/main (o alvo do "publicar").
 * Diferente de Publications: NÃO apaga e recria tudo, porque Team_Members
 * carrega identidade de login (google_email/role/is_active). Em vez disso:
 *  - faz upsert de cada membro do payload (cria ou atualiza o conteúdo)
 *  - quem não está mais no payload é marcado is_active=false (não é apagado,
 *    preserva histórico/identidade — só some da listagem pública)
 */
export async function replaceTeamMembers(members: LegacyTeamMember[]): Promise<void> {
  const emails = members.map((m) => m.email);

  await prisma.$transaction(async (tx) => {
    for (const member of members) {
      const editableData = buildEditableData(member);
      const items = buildItems(member);
      const birth_date = parseBirthday(member.birthday);

      const teamMember = await tx.team_Members.upsert({
        where: { google_email: member.email },
        update: { name: member.name || null, birth_date, is_active: true },
        create: { google_email: member.email, name: member.name || null, birth_date },
      });

      const editable = await tx.team_Member_Editables.upsert({
        where: { team_member_id: teamMember.id },
        update: editableData,
        create: { team_member_id: teamMember.id, ...editableData },
      });

      await tx.team_Member_Items.deleteMany({
        where: { team_member_editable_id: editable.id },
      });
      if (items.length) {
        await tx.team_Member_Items.createMany({
          data: items.map((it) => ({ ...it, team_member_editable_id: editable.id })),
        });
      }
    }

    await tx.team_Members.updateMany({
      where: { google_email: { notIn: emails } },
      data: { is_active: false },
    });
  });
}
