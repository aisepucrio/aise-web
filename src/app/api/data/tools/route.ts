import { NextResponse } from "next/server";
import { readJson } from "@/lib/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Helper para converter strings CSV em arrays
function parseStringToArray(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim());
  }
  return [];
}

// Helper para parsear team_relationships
function parseTeamRelationships(value: any): Array<{ name: string; roles: string[] }> {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    // Formato: "Name (Role1, Role2), Name2 (Role3)"
    return value.split(",").map((item) => {
      const match = item.trim().match(/^(.+?)\s*\((.+?)\)$/);
      if (match) {
        return {
          name: match[1].trim(),
          roles: match[2].split(",").map((r) => r.trim()),
        };
      }
      return { name: item.trim(), roles: [] };
    });
  }
  return [];
}

// Helper para parsear links
function parseLinks(tool: any) {
  const links: Record<string, string> = {};
  if (tool.link_webapp) links.webapp = tool.link_webapp;
  if (tool.link_github) links.github = tool.link_github;
  if (tool.link_api) links.api = tool.link_api;
  if (tool.link_docs) links.docs = tool.link_docs;
  return Object.keys(links).length > 0 ? links : undefined;
}

export async function GET() {
  try {
    const data = await readJson("lab/tools.json");
    
    // Normaliza os dados: converte strings CSV em arrays
    if (data?.tools && Array.isArray(data.tools)) {
      data.tools = data.tools.map((tool: any) => ({
        ...tool,
        objectives: parseStringToArray(tool.objectives),
        features: parseStringToArray(tool.features),
        techStack: parseStringToArray(tool.techStack),
        galleryImagesUrl: parseStringToArray(tool.galleryImagesUrl),
        publication_relationships: parseStringToArray(tool.publication_relationships),
        team_relationships: parseTeamRelationships(tool.team_relationships),
        links: parseLinks(tool),
      }));
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading tools from Blob:", error);
    return NextResponse.json(
      { error: "Tools data not found" },
      { status: 404 }
    );
  }
}
