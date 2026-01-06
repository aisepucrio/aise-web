/**
 * Tipos compartilhados para Google Sheets
 */

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
  pdf?: string;
  abstract?: string;
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
  links?: {
    webapp?: string;
    github?: string;
    api?: string;
    docs?: string;
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
