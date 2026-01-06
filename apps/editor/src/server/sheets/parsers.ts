/**
 * Parsers: Google Sheets Row → Typed Objects
 */

import {
  TEAM_COLUMNS,
  PUBLICATION_COLUMNS,
  TOOL_COLUMNS,
  RESEARCH_COLUMNS,
} from "./constants";
import {
  stringToArray,
  parseTeamRelationships,
  parseProjects,
  parseLinks,
} from "./utils";
import type { TeamMemberData, Publication, Tool, Research } from "./types";

/**
 * Parseia linha do Google Sheets para TeamMemberData
 */
export function parseTeamRow(row: string[]): TeamMemberData {
  const C = TEAM_COLUMNS;

  return {
    name: row[C.NAME] || "",
    position: row[C.POSITION] || "",
    university:
      row[C.UNIVERSITY] && row[C.UNIVERSITY].trim() ? row[C.UNIVERSITY] : "",
    imageUrl: row[C.IMAGE_URL] || "",
    description: row[C.DESCRIPTION] || "",
    email: row[C.EMAIL] || "",
    researchInterests: row[C.RESEARCH_INTERESTS]
      ? row[C.RESEARCH_INTERESTS]
          .split(/[,|]/)
          .map((v) => v.trim())
          .filter(Boolean)
      : [],
    technologies: row[C.TECHNOLOGIES]
      ? row[C.TECHNOLOGIES]
          .split(/[,|]/)
          .map((v) => v.trim())
          .filter(Boolean)
      : [],
    knowledge: row[C.KNOWLEDGE]
      ? row[C.KNOWLEDGE]
          .split(/[,|]/)
          .map((v) => v.trim())
          .filter(Boolean)
      : [],
    socialLinks: {
      lattes: row[C.LATTES] || "",
      personalWebsite: row[C.PERSONAL_WEBSITE] || "",
      linkedin: row[C.LINKEDIN] || "",
      github: row[C.GITHUB] || "",
      googleScholar: row[C.GOOGLE_SCHOLAR] || "",
      orcid: row[C.ORCID] || "",
    },
  };
}

/**
 * Parseia linha do Google Sheets para Publication
 */
export function parsePublicationRow(row: string[]): Publication {
  const C = PUBLICATION_COLUMNS;

  return {
    title: row[C.TITLE] || "",
    authors: row[C.AUTHORS_LIST] || "",
    venue: row[C.PUBLICATION_PLACE] || "",
    year: row[C.YEAR] || "",
    doi: row[C.LINK] || "",
    citation_number: parseInt(row[C.CITATION_NUMBER] || "0", 10),
    awards: row[C.AWARDS] || "",
  } as any;
}

/**
 * Parseia linha do Google Sheets para Tool
 */
export function parseToolRow(row: string[]): Tool {
  const C = TOOL_COLUMNS;

  return {
    id: row[C.ID] || "",
    name: row[C.NAME] || "",
    tagline: row[C.TAGLINE] || "",
    description: row[C.DESCRIPTION] || "",
    longDescription: row[C.LONG_DESCRIPTION] || "",
    category: row[C.CATEGORY] || "",
    highlightImageUrl: row[C.HIGHLIGHT_IMAGE_URL] || "",
    galleryImagesUrl: stringToArray(row[C.GALLERY_IMAGES_URL] || ""),
    duration: row[C.DURATION] || "",
    objectives: stringToArray(row[C.OBJECTIVES] || ""),
    features: stringToArray(row[C.FEATURES] || ""),
    techStack: stringToArray(row[C.TECH_STACK] || ""),
    team_relationships: parseTeamRelationships(row[C.TEAM_RELATIONSHIPS] || ""),
    publication_relationships: stringToArray(
      row[C.PUBLICATION_RELATIONSHIPS] || ""
    ),
    links: parseLinks(row, C.LINK_WEBAPP),
  };
}

/**
 * Parseia linha do Google Sheets para Research
 */
export function parseResearchRow(row: string[]): Research {
  const C = RESEARCH_COLUMNS;

  return {
    id: row[C.ID] || "",
    name: row[C.NAME] || "",
    shortDescription: row[C.SHORT_DESCRIPTION] || "",
    longDescription: row[C.LONG_DESCRIPTION] || "",
    highlightImageUrl: row[C.HIGHLIGHT_IMAGE_URL] || "",
    duration: row[C.DURATION] || "",
    projects: parseProjects(row[C.PROJECTS] || ""),
    team_relationships: parseTeamRelationships(row[C.TEAM_RELATIONSHIPS] || ""),
    publication_relationships: stringToArray(
      row[C.PUBLICATION_RELATIONSHIPS] || ""
    ),
    tools_relationships: stringToArray(row[C.TOOLS_RELATIONSHIPS] || ""),
  };
}

/**
 * Parseia múltiplas linhas do Google Sheets
 */
export function parseSheetRows(
  rows: string[][],
  type: "team" | "publications" | "tools" | "researches"
): any[] {
  if (rows.length < 2) return [];

  const dataRows = rows.slice(1); // Remove header

  const parsers = {
    team: (row: string[]) =>
      row[TEAM_COLUMNS.NAME]?.trim() && row[TEAM_COLUMNS.EMAIL]?.trim()
        ? parseTeamRow(row)
        : null,
    publications: (row: string[]) =>
      row[PUBLICATION_COLUMNS.TITLE]?.trim() ? parsePublicationRow(row) : null,
    tools: (row: string[]) =>
      row[TOOL_COLUMNS.ID]?.trim() ? parseToolRow(row) : null,
    researches: (row: string[]) =>
      row[RESEARCH_COLUMNS.ID]?.trim() ? parseResearchRow(row) : null,
  };

  return dataRows
    .map((row) => parsers[type](row))
    .filter((item) => item !== null);
}
