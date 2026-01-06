/**
 * Constantes e mapeamentos de colunas
 */

// Mapeamento de colunas para Team
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

// Mapeamento de colunas para Publications
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

// Mapeamento de colunas para Tools
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

// Mapeamento de colunas para Researches
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

// Separadores especiais
export const SEPARATORS = {
  COMMA: ",",
  PIPE: "|",
  SEMICOLON: ";",
  PROJECTS: ";;;", // Separador especial para projetos em researches
} as const;
