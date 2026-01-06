/**
 * Operações de CRUD para entidades
 */

import { appendRow, updateRow, clearRange, findRowByField } from "./client";
import {
  serializeTeamRow,
  serializePublicationRow,
  serializeToolRow,
  serializeResearchRow,
} from "./serializers";
import {
  TEAM_COLUMNS,
  TEAM_RANGE,
  PUBLICATION_RANGE,
  TOOL_COLUMNS,
  TOOL_RANGE,
  RESEARCH_COLUMNS,
  RESEARCH_RANGE,
} from "./constants";
import type { TeamMemberData, Publication, Tool, Research } from "./types";

/**
 * Atualiza ou adiciona um membro na planilha Team
 */
export async function updateTeamMember(
  member: TeamMemberData,
  isNew: boolean
): Promise<void> {
  const sheetName = process.env.TEAM_SHEET_NAME || "Team";
  const row = serializeTeamRow(member);

  if (isNew) {
    await appendRow(sheetName, TEAM_RANGE, row);
  } else {
    const rowNumber = await findRowByField(
      sheetName,
      TEAM_COLUMNS.EMAIL,
      member.email
    );

    if (rowNumber === null) {
      // Se não encontrou, adiciona no final
      await appendRow(sheetName, TEAM_RANGE, row);
    } else {
      await updateRow(sheetName, rowNumber, TEAM_RANGE, row);
    }
  }
}

/**
 * Atualiza ou sobrescreve publicações na planilha
 */
export async function updatePublications(
  publications: any[],
  mode: "append" | "replace"
): Promise<void> {
  const sheetName = process.env.PUBLICATIONS_SHEET_NAME || "Publications";
  const rows = publications.map((pub) => serializePublicationRow(pub));

  if (mode === "replace") {
    // Limpa dados antigos (mantém header)
    await clearRange(sheetName, "A2:G");

    // Adiciona novos dados
    for (const row of rows) {
      await appendRow(sheetName, PUBLICATION_RANGE, row);
    }
  } else {
    // Append: apenas adiciona no final
    for (const row of rows) {
      await appendRow(sheetName, PUBLICATION_RANGE, row);
    }
  }
}

/**
 * Atualiza ou adiciona um tool na planilha
 */
export async function updateTool(
  tool: Tool,
  isNew: boolean = false
): Promise<void> {
  const sheetName = process.env.TOOLS_SHEET_NAME || "Tools";
  const row = serializeToolRow(tool);

  if (isNew) {
    await appendRow(sheetName, TOOL_RANGE, row);
  } else {
    const rowNumber = await findRowByField(sheetName, TOOL_COLUMNS.ID, tool.id);

    if (rowNumber === null) {
      throw new Error("Tool não encontrado");
    }

    await updateRow(sheetName, rowNumber, TOOL_RANGE, row);
  }
}

/**
 * Atualiza ou adiciona uma research na planilha
 */
export async function updateResearch(
  research: Research,
  isNew: boolean = false
): Promise<void> {
  const sheetName = process.env.RESEARCHES_SHEET_NAME || "Researches";
  const row = serializeResearchRow(research);

  if (isNew) {
    await appendRow(sheetName, RESEARCH_RANGE, row);
  } else {
    const rowNumber = await findRowByField(
      sheetName,
      RESEARCH_COLUMNS.ID,
      research.id
    );

    if (rowNumber === null) {
      throw new Error("Research não encontrado");
    }

    await updateRow(sheetName, rowNumber, RESEARCH_RANGE, row);
  }
}
