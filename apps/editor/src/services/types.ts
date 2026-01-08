/**
 * TypeScript interfaces para dados do Google Sheets (client-side)
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
  imageUrl: string;
  category: string;
  status: string;
  duration: string;
  techStack?: string[];
}

export interface MemberListItem {
  name: string;
  position: string;
  email: string;
}

export interface ToolConflicts {
  missingTeamMembers: string[];
  missingPublications: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
