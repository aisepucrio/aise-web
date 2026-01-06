/**
 * Serializers: Typed Objects → Google Sheets Row
 */

import {
  TEAM_COLUMNS,
  PUBLICATION_COLUMNS,
  TOOL_COLUMNS,
  RESEARCH_COLUMNS,
} from "./constants";
import {
  arrayToString,
  serializeTeamRelationships,
  serializeProjects,
} from "./utils";
import type { TeamMemberData, Publication, Tool, Research } from "./types";

/**
 * Serializa TeamMemberData para linha do Google Sheets
 */
export function serializeTeamRow(member: TeamMemberData): string[] {
  const C = TEAM_COLUMNS;
  const row = Array(15).fill("");

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

/**
 * Serializa Publication para linha do Google Sheets
 */
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

/**
 * Serializa Tool para linha do Google Sheets
 */
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
  row[C.LINK_WEBAPP] = tool.links?.webapp || "";
  row[C.LINK_GITHUB] = tool.links?.github || "";
  row[C.LINK_API] = tool.links?.api || "";
  row[C.LINK_DOCS] = tool.links?.docs || "";

  return row;
}

/**
 * Serializa Research para linha do Google Sheets
 */
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
