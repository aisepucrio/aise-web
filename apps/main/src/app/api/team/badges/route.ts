import { NextResponse } from "next/server";
import { getJsonByKey } from "@/app/api/lib/contentRepository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() });
}

export async function GET() {
  try {
    const data = await getJsonByKey("lab/team.json");

    if (!data || !data.team || !Array.isArray(data.team)) {
      return NextResponse.json(
        { error: "Team data not found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    const researchInterestsSet = new Set<string>();
    const technologiesSet = new Set<string>();
    const knowledgeSet = new Set<string>();

    // Scrape all team members
    data.team.forEach((member: any) => {
      if (Array.isArray(member.researchInterests)) {
        member.researchInterests.forEach((item: string) => {
          researchInterestsSet.add(item.toLowerCase().trim());
        });
      }
      if (Array.isArray(member.technologies)) {
        member.technologies.forEach((item: string) => {
          technologiesSet.add(item.toLowerCase().trim());
        });
      }
      if (Array.isArray(member.knowledge)) {
        member.knowledge.forEach((item: string) => {
          knowledgeSet.add(item.toLowerCase().trim());
        });
      }
    });

    // Convert to arrays and capitalize first letter of each word
    const capitalize = (str: string) =>
      str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    // Simple shuffle function
    const shuffle = <T>(array: T[]): T[] => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const result = {
      researchInterests: shuffle(
        Array.from(researchInterestsSet).map(capitalize)
      ),
      technologies: shuffle(Array.from(technologiesSet).map(capitalize)),
      knowledge: shuffle(Array.from(knowledgeSet).map(capitalize)),
    };

    return NextResponse.json(result, { headers: corsHeaders() });
  } catch (error) {
    console.error("Error reading badges from team data:", error);
    return NextResponse.json(
      { error: "Failed to fetch badges" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
