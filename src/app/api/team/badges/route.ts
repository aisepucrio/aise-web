import { NextResponse } from "next/server";
import { listTeamMembers } from "@shared/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function capitalize(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Deriva os badges a partir dos membros ativos do time (sempre a visão
// pública, já que essa rota alimenta o site e não tem UI de admin própria).
export async function GET() {
  try {
    const team = await listTeamMembers({ onlyActive: true });

    const researchInterestsSet = new Set<string>();
    const technologiesSet = new Set<string>();
    const knowledgeSet = new Set<string>();

    team.forEach((member) => {
      member.researchInterests?.forEach((item) => researchInterestsSet.add(item.toLowerCase().trim()));
      member.technologies?.forEach((item) => technologiesSet.add(item.toLowerCase().trim()));
      member.knowledge?.forEach((item) => knowledgeSet.add(item.toLowerCase().trim()));
    });

    return NextResponse.json(
      {
        researchInterests: shuffle(Array.from(researchInterestsSet).map(capitalize)),
        technologies: shuffle(Array.from(technologiesSet).map(capitalize)),
        knowledge: shuffle(Array.from(knowledgeSet).map(capitalize)),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: unknown) {
    console.error("Error reading badges from team data:", error);
    return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 });
  }
}
