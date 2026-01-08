/**
 * Google Sheets: Client + Constants + Utils + Parsers + Serializers + CRUD
 */

import { google } from "googleapis";

// ============================================================================
// Types
// ============================================================================

export interface TeamMemberData {
  name: string;
  position: string;
  university?: string;
  imageUrl: string;
  description: string;
  email: string;
  researchInterests: string[];
  technologies: string[];
  knowledge: string[];
  socialLinks?: {
    lattes?: string;
    personalWebsite?: string;
    linkedin?: string;
    github?: string;
    googleScholar?: string;
    orcid?: string;
  };
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi?: string;

  // Sheet extras (used by the existing sheet model)
  citation_number?: number;
  awards?: string;
  link?: string;
  authors_list?: string;
  publication_place?: string;
}

export interface Tool {
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
  links: {
    webapp: string;
    github: string;
    api: string;
    docs: string;
  };
}

export interface Research {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  highlightImageUrl: string;
  duration: string;
  projects?: Array<{
    name: string;
    imageUrl: string;
    description: string;
  }>;
  team_relationships?: Array<{ name: string; roles: string[] }>;
  publication_relationships?: string[];
  tools_relationships?: string[];
}

export type SheetType = "team" | "publications" | "tools" | "researches";

// ============================================================================
// Constants
// ============================================================================

export const TEAM_COLUMNS = {
  NAME: 0,
  POSITION: 1,
  UNIVERSITY: 2,
  IMAGE_URL: 3,
  DESCRIPTION: 4,
  EMAIL: 5,
  RESEARCH_INTERESTS: 6,
  TECHNOLOGIES: 7,
  KNOWLEDGE: 8,
  LATTES: 9,
  PERSONAL_WEBSITE: 10,
  LINKEDIN: 11,
  GITHUB: 12,
  GOOGLE_SCHOLAR: 13,
  ORCID: 14,
} as const;

export const TEAM_RANGE = "A:O";

export const PUBLICATION_COLUMNS = {
  TITLE: 0,
  LINK: 1,
  AUTHORS_LIST: 2,
  PUBLICATION_PLACE: 3,
  CITATION_NUMBER: 4,
  YEAR: 5,
  AWARDS: 6,
} as const;

export const PUBLICATION_RANGE = "A:G";

export const TOOL_COLUMNS = {
  ID: 0,
  NAME: 1,
  TAGLINE: 2,
  DESCRIPTION: 3,
  LONG_DESCRIPTION: 4,
  CATEGORY: 5,
  HIGHLIGHT_IMAGE_URL: 6,
  GALLERY_IMAGES_URL: 7,
  DURATION: 8,
  OBJECTIVES: 9,
  FEATURES: 10,
  TECH_STACK: 11,
  TEAM_RELATIONSHIPS: 12,
  PUBLICATION_RELATIONSHIPS: 13,
  LINK_WEBAPP: 14,
  LINK_GITHUB: 15,
  LINK_API: 16,
  LINK_DOCS: 17,
} as const;

export const TOOL_RANGE = "A:R";

export const RESEARCH_COLUMNS = {
  ID: 0,
  NAME: 1,
  SHORT_DESCRIPTION: 2,
  LONG_DESCRIPTION: 3,
  HIGHLIGHT_IMAGE_URL: 4,
  DURATION: 5,
  PROJECTS: 6,
  TEAM_RELATIONSHIPS: 7,
  PUBLICATION_RELATIONSHIPS: 8,
  TOOLS_RELATIONSHIPS: 9,
} as const;

export const RESEARCH_RANGE = "A:J";

export const SEPARATORS = {
  COMMA: ",",
  PIPE: "|",
  SEMICOLON: ";",
  PROJECTS: ";;;",
} as const;

// ============================================================================
// Env helpers
// ============================================================================

function getRequiredEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`${key} não configurado`);
  return v;
}

function getSpreadsheetId(): string {
  return getRequiredEnv("GOOGLE_SHEETS_ID");
}

function getFixedPrivateKey(): string {
  const privateKey = getRequiredEnv("GOOGLE_PRIVATE_KEY");
  return privateKey.replace(/\\n/g, "\n");
}

// ============================================================================
// Google Sheets client
// ============================================================================

export function getAuthenticatedClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: getRequiredEnv("GOOGLE_CLIENT_EMAIL"),
      private_key: getFixedPrivateKey(),
    },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  return google.sheets({ version: "v4", auth });
}

export async function readSheetData(sheetName: string): Promise<string[][]> {
  const sheets = getAuthenticatedClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `${sheetName}!A1:Z`,
  });

  return (response.data.values as string[][]) || [];
}

export async function appendRow(
  sheetName: string,
  range: string,
  row: string[]
): Promise<void> {
  const sheets = getAuthenticatedClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(),
    range: `${sheetName}!${range}`,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
}

export async function updateRow(
  sheetName: string,
  rowNumber: number,
  range: string,
  row: string[]
): Promise<void> {
  const sheets = getAuthenticatedClient();
  const endCol = range.split(":")[1];

  await sheets.spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `${sheetName}!A${rowNumber}:${endCol}${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });
}

export async function clearRange(
  sheetName: string,
  range: string
): Promise<void> {
  const sheets = getAuthenticatedClient();

  await sheets.spreadsheets.values.clear({
    spreadsheetId: getSpreadsheetId(),
    range: `${sheetName}!${range}`,
  });
}

export async function findRowByField(
  sheetName: string,
  fieldIndex: number,
  value: string
): Promise<number | null> {
  const rows = await readSheetData(sheetName);
  const target = value.toLowerCase();

  for (let i = 1; i < rows.length; i++) {
    if ((rows[i][fieldIndex] || "").toLowerCase() === target) return i + 1;
  }

  return null;
}

// ============================================================================
// Utils (parsing/serialization helpers)
// ============================================================================

export function stringToArray(
  str: string,
  separator: string = SEPARATORS.COMMA
): string[] {
  if (!str || str.trim() === "") return [];
  return str
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function arrayToString(
  arr?: string[],
  separator: string = SEPARATORS.COMMA
): string {
  if (!arr || arr.length === 0) return "";
  return arr.join(`${separator} `);
}

function splitByCommaOrPipe(cell?: string): string[] {
  if (!cell) return [];
  return cell
    .split(/[,|]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

export function parseTeamRelationships(
  str: string
): Array<{ name: string; roles: string[] }> {
  if (!str || str.trim() === "") return [];

  return str.split(SEPARATORS.COMMA).map((rel) => {
    const match = rel.trim().match(/^(.+?)\s*\((.+)\)$/);
    if (!match) return { name: rel.trim(), roles: [] };

    return {
      name: match[1].trim(),
      roles: match[2]
        .split(SEPARATORS.SEMICOLON)
        .map((r) => r.trim())
        .filter(Boolean),
    };
  });
}

export function serializeTeamRelationships(
  relationships?: Array<{ name: string; roles: string[] }>
): string {
  if (!relationships || relationships.length === 0) return "";

  return relationships
    .map((rel) =>
      rel.roles.length > 0
        ? `${rel.name} (${rel.roles.join(`${SEPARATORS.SEMICOLON} `)})`
        : rel.name
    )
    .join(`${SEPARATORS.COMMA} `);
}

export function parseProjects(str: string): Array<{
  name: string;
  imageUrl: string;
  description: string;
}> {
  if (!str || str.trim() === "") return [];

  return str
    .split(SEPARATORS.PROJECTS)
    .map((proj) => {
      const parts = proj.trim().split(SEPARATORS.PIPE);
      return {
        name: parts[0]?.trim() || "",
        imageUrl: parts[1]?.trim() || "",
        description: parts[2]?.trim() || "",
      };
    })
    .filter((p) => p.name);
}

export function serializeProjects(
  projects?: Array<{
    name: string;
    imageUrl: string;
    description: string;
  }>
): string {
  if (!projects || projects.length === 0) return "";

  return projects
    .map(
      (p) =>
        `${p.name}${SEPARATORS.PIPE}${p.imageUrl}${SEPARATORS.PIPE}${p.description}`
    )
    .join(SEPARATORS.PROJECTS);
}

export function parseLinks(
  row: string[],
  startIndex: number
): Tool["links"] {
  return {
    webapp: row[startIndex] || "",
    github: row[startIndex + 1] || "",
    api: row[startIndex + 2] || "",
    docs: row[startIndex + 3] || "",
  };
}

// ============================================================================
// Parsers (Sheet row -> typed object)
// ============================================================================

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
    researchInterests: splitByCommaOrPipe(row[C.RESEARCH_INTERESTS]),
    technologies: splitByCommaOrPipe(row[C.TECHNOLOGIES]),
    knowledge: splitByCommaOrPipe(row[C.KNOWLEDGE]),
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
  };
}

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

export function parseSheetRows(
  rows: string[][],
  type: SheetType
): Array<TeamMemberData | Publication | Tool | Research> {
  if (rows.length < 2) return [];

  const dataRows = rows.slice(1);

  const parsers: Record<
    SheetType,
    (row: string[]) => TeamMemberData | Publication | Tool | Research | null
  > = {
    team: (row) =>
      row[TEAM_COLUMNS.NAME]?.trim() && row[TEAM_COLUMNS.EMAIL]?.trim()
        ? parseTeamRow(row)
        : null,
    publications: (row) =>
      row[PUBLICATION_COLUMNS.TITLE]?.trim() ? parsePublicationRow(row) : null,
    tools: (row) => (row[TOOL_COLUMNS.ID]?.trim() ? parseToolRow(row) : null),
    researches: (row) =>
      row[RESEARCH_COLUMNS.ID]?.trim() ? parseResearchRow(row) : null,
  };

  return dataRows.map(parsers[type]).filter((v): v is any => v !== null);
}

// ============================================================================
// Serializers (typed object -> sheet row)
// ============================================================================

export function serializeTeamRow(member: TeamMemberData): string[] {
  const C = TEAM_COLUMNS;
  const row = Array(15).fill("");

  // Keeps original behavior: empty university for "PUC-Rio" or missing
  const uniCell =
    !member.university || member.university === "PUC-Rio"
      ? ""
      : member.university;

  row[C.NAME] = member.name;
  row[C.POSITION] = member.position;
  row[C.UNIVERSITY] = uniCell;
  row[C.IMAGE_URL] = member.imageUrl;
  row[C.DESCRIPTION] = member.description;
  row[C.EMAIL] = member.email;
  row[C.RESEARCH_INTERESTS] = arrayToString(member.researchInterests);
  row[C.TECHNOLOGIES] = arrayToString(member.technologies);
  row[C.KNOWLEDGE] = arrayToString(member.knowledge);
  row[C.LATTES] = member.socialLinks?.lattes || "";
  row[C.PERSONAL_WEBSITE] = member.socialLinks?.personalWebsite || "";
  row[C.LINKEDIN] = member.socialLinks?.linkedin || "";
  row[C.GITHUB] = member.socialLinks?.github || "";
  row[C.GOOGLE_SCHOLAR] = member.socialLinks?.googleScholar || "";
  row[C.ORCID] = member.socialLinks?.orcid || "";

  return row;
}

export function serializePublicationRow(pub: any): string[] {
  const C = PUBLICATION_COLUMNS;
  const row = Array(7).fill("");

  row[C.TITLE] = pub.title;
  row[C.LINK] = pub.link || "";
  row[C.AUTHORS_LIST] = pub.authors_list || "";
  row[C.PUBLICATION_PLACE] = pub.publication_place || "";
  row[C.CITATION_NUMBER] = String(pub.citation_number || 0);
  row[C.YEAR] = pub.year || "";
  row[C.AWARDS] = pub.awards || "";

  return row;
}

export function serializeToolRow(tool: Tool): string[] {
  const C = TOOL_COLUMNS;
  const row = Array(18).fill("");

  row[C.ID] = tool.id;
  row[C.NAME] = tool.name;
  row[C.TAGLINE] = tool.tagline;
  row[C.DESCRIPTION] = tool.description;
  row[C.LONG_DESCRIPTION] = tool.longDescription || "";
  row[C.CATEGORY] = tool.category;
  row[C.HIGHLIGHT_IMAGE_URL] = tool.highlightImageUrl || "";
  row[C.GALLERY_IMAGES_URL] = arrayToString(tool.galleryImagesUrl);
  row[C.DURATION] = tool.duration;
  row[C.OBJECTIVES] = arrayToString(tool.objectives);
  row[C.FEATURES] = arrayToString(tool.features);
  row[C.TECH_STACK] = arrayToString(tool.techStack);
  row[C.TEAM_RELATIONSHIPS] = serializeTeamRelationships(
    tool.team_relationships
  );
  row[C.PUBLICATION_RELATIONSHIPS] = arrayToString(
    tool.publication_relationships
  );
  row[C.LINK_WEBAPP] = tool.links.webapp || "";
  row[C.LINK_GITHUB] = tool.links.github || "";
  row[C.LINK_API] = tool.links.api || "";
  row[C.LINK_DOCS] = tool.links.docs || "";

  return row;
}

export function serializeResearchRow(research: Research): string[] {
  const C = RESEARCH_COLUMNS;
  const row = Array(10).fill("");

  row[C.ID] = research.id;
  row[C.NAME] = research.name;
  row[C.SHORT_DESCRIPTION] = research.shortDescription;
  row[C.LONG_DESCRIPTION] = research.longDescription || "";
  row[C.HIGHLIGHT_IMAGE_URL] = research.highlightImageUrl || "";
  row[C.DURATION] = research.duration;
  row[C.PROJECTS] = serializeProjects(research.projects);
  row[C.TEAM_RELATIONSHIPS] = serializeTeamRelationships(
    research.team_relationships
  );
  row[C.PUBLICATION_RELATIONSHIPS] = arrayToString(
    research.publication_relationships
  );
  row[C.TOOLS_RELATIONSHIPS] = arrayToString(research.tools_relationships);

  return row;
}

// ============================================================================
// CRUD operations
// ============================================================================

export async function updateTeamMember(
  member: TeamMemberData,
  isNew: boolean
): Promise<void> {
  const sheetName = process.env.TEAM_SHEET_NAME || "Team";
  const row = serializeTeamRow(member);

  if (isNew) {
    await appendRow(sheetName, TEAM_RANGE, row);
    return;
  }

  const rowNumber = await findRowByField(
    sheetName,
    TEAM_COLUMNS.EMAIL,
    member.email
  );

  if (rowNumber === null) {
    await appendRow(sheetName, TEAM_RANGE, row);
    return;
  }

  await updateRow(sheetName, rowNumber, TEAM_RANGE, row);
}

export async function updatePublications(
  publications: any[],
  mode: "append" | "replace"
): Promise<void> {
  const sheetName = process.env.PUBLICATIONS_SHEET_NAME || "Publications";
  const rows = publications.map((pub) => serializePublicationRow(pub));

  if (mode === "replace") {
    // Keeps original behavior: clear data but preserve header
    await clearRange(sheetName, "A2:G");
  }

  for (const row of rows) {
    await appendRow(sheetName, PUBLICATION_RANGE, row);
  }
}

export async function updateTool(
  tool: Tool,
  isNew: boolean = false
): Promise<void> {
  const sheetName = process.env.TOOLS_SHEET_NAME || "Tools";
  const row = serializeToolRow(tool);

  if (isNew) {
    await appendRow(sheetName, TOOL_RANGE, row);
    return;
  }

  const rowNumber = await findRowByField(sheetName, TOOL_COLUMNS.ID, tool.id);
  if (rowNumber === null) throw new Error("Tool não encontrado");

  await updateRow(sheetName, rowNumber, TOOL_RANGE, row);
}

export async function updateResearch(
  research: Research,
  isNew: boolean = false
): Promise<void> {
  const sheetName = process.env.RESEARCHES_SHEET_NAME || "Researches";
  const row = serializeResearchRow(research);

  if (isNew) {
    await appendRow(sheetName, RESEARCH_RANGE, row);
    return;
  }

  const rowNumber = await findRowByField(
    sheetName,
    RESEARCH_COLUMNS.ID,
    research.id
  );
  if (rowNumber === null) throw new Error("Research não encontrado");

  await updateRow(sheetName, rowNumber, RESEARCH_RANGE, row);
}
