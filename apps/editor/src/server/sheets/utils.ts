/**
 * Funções auxiliares para parsing e serialização
 */

import { SEPARATORS } from "./constants";

/**
 * Converte string separada por vírgula em array
 */
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

/**
 * Converte array em string separada por vírgula
 */
export function arrayToString(
  arr?: string[],
  separator: string = SEPARATORS.COMMA
): string {
  if (!arr || arr.length === 0) return "";
  return arr.join(`${separator} `);
}

/**
 * Parseia team relationships do formato "Nome (Role1; Role2), Nome2 (Role3)"
 */
export function parseTeamRelationships(
  str: string
): Array<{ name: string; roles: string[] }> {
  if (!str || str.trim() === "") return [];

  return str.split(SEPARATORS.COMMA).map((rel) => {
    const match = rel.trim().match(/^(.+?)\s*\((.+)\)$/);
    if (match) {
      return {
        name: match[1].trim(),
        roles: match[2]
          .split(SEPARATORS.SEMICOLON)
          .map((r) => r.trim())
          .filter(Boolean),
      };
    }
    return { name: rel.trim(), roles: [] };
  });
}

/**
 * Serializa team relationships para formato "Nome (Role1; Role2), Nome2"
 */
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

/**
 * Parseia projects do formato "Name|img|desc;;;Name2|img|desc"
 */
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

/**
 * Serializa projects para formato "Name|img|desc;;;Name2|img|desc"
 */
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

/**
 * Parseia links estruturados
 */
export function parseLinks(row: string[], startIndex: number): any {
  const links: any = {};
  if (row[startIndex]) links.webapp = row[startIndex];
  if (row[startIndex + 1]) links.github = row[startIndex + 1];
  if (row[startIndex + 2]) links.api = row[startIndex + 2];
  if (row[startIndex + 3]) links.docs = row[startIndex + 3];
  return Object.keys(links).length > 0 ? links : undefined;
}
