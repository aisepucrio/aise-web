/**
 * Chamadas de API para o Google Sheets (client-side)
 * Todas as funções fazem fetch para rotas de API Next.js
 */

import { TeamMemberData, MemberListItem, ToolConflicts } from "./types";
import { EXAMPLE_TEAM_MEMBER } from "./constants";

/**
 * Converte string separada por vírgula para array
 */
function stringToArray(str: string): string[] {
  if (!str || str.trim() === "") return [];
  return str
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Converte linha do Google Sheets para objeto TeamMemberData
 */
function rowToTeamMember(row: string[]): TeamMemberData {
  return {
    name: row[0] || "",
    position: row[1] || "",
    university: row[2] && row[2].trim() ? row[2] : "PUC-Rio",
    imageUrl: row[3] || "",
    description: row[4] || "",
    email: row[5] || "",
    researchInterests: stringToArray(row[6] || ""),
    technologies: stringToArray(row[7] || ""),
    knowledge: stringToArray(row[8] || ""),
    socialLinks: {
      lattes: row[9] || "",
      personalWebsite: row[10] || "",
      linkedin: row[11] || "",
      github: row[12] || "",
      googleScholar: row[13] || "",
      orcid: row[14] || "",
    },
  };
}

/**
 * Lista todos os membros cadastrados (nome, posição e email)
 */
export async function listAllMembers(): Promise<MemberListItem[]> {
  try {
    const res = await fetch("/api/team?mode=simple");
    if (!res.ok) {
      throw new Error("Erro ao buscar lista de membros");
    }
    const payload = await res.json();
    return payload.members || [];
  } catch (error) {
    console.error("Erro ao listar membros:", error);
    throw error;
  }
}

/**
 * Busca membro da equipe por email
 */
export async function getMemberByEmail(
  email: string
): Promise<TeamMemberData | null> {
  try {
    const encoded = encodeURIComponent(email);
    const res = await fetch(`/api/team?email=${encoded}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Erro ao buscar dados do Google Sheets");
    }

    const payload = await res.json();
    if (!payload || !payload.member) return null;
    const row: string[] = payload.member;
    return rowToTeamMember(row);
  } catch (error) {
    console.error("Erro ao buscar membro:", error);
    throw error;
  }
}

/**
 * Retorna os dados de exemplo fixos (não busca mais da planilha)
 */
export async function getExampleData(): Promise<TeamMemberData> {
  return EXAMPLE_TEAM_MEMBER;
}

/**
 * Atualiza ou cria um novo membro
 */
export async function saveMember(
  member: TeamMemberData,
  isNew: boolean = false
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        member,
        isNew,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao salvar dados");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Erro ao salvar membro:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Encontra a linha de um membro no Google Sheets
 */
export async function findMemberRow(email: string): Promise<number | null> {
  try {
    const encoded = encodeURIComponent(email);
    const res = await fetch(`/api/team?email=${encoded}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Erro ao buscar dados do Google Sheets");
    }
    const payload = await res.json();
    return payload.rowNumber || null;
  } catch (error) {
    console.error("Erro ao encontrar linha do membro:", error);
    throw error;
  }
}

/**
 * Verifica conflitos em relacionamentos de Tools
 */
export async function checkToolConflicts(
  team_relationships?: string,
  publication_relationships?: string
): Promise<ToolConflicts> {
  const conflicts: ToolConflicts = {
    missingTeamMembers: [],
    missingPublications: [],
  };

  try {
    // Verifica team members
    if (team_relationships) {
      const teamRes = await fetch("/api/team");
      if (teamRes.ok) {
        const teamData = await teamRes.json();
        const availableNames = teamData.team.map((m: any) => m.name);

        const relationshipNames = team_relationships.split("|").map((rel) => {
          const match = rel.trim().match(/^(.+?)\s*\(/);
          return match ? match[1].trim() : rel.trim();
        });

        conflicts.missingTeamMembers = relationshipNames.filter(
          (name) => name && !availableNames.includes(name)
        );
      }
    }

    // Verifica publications
    if (publication_relationships) {
      const pubRes = await fetch("/api/publications");
      if (pubRes.ok) {
        const pubData = await pubRes.json();
        const availableTitles = pubData.publications.map((p: any) => p.title);

        const relationshipTitles = publication_relationships
          .split("|")
          .map((t) => t.trim())
          .filter(Boolean);

        conflicts.missingPublications = relationshipTitles.filter(
          (title) => !availableTitles.includes(title)
        );
      }
    }
  } catch (error) {
    console.error("Erro ao verificar conflitos:", error);
  }

  return conflicts;
}
