import { NextResponse } from "next/server";
import { readJson } from "@/lib/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const blobData = await readJson("lab/team.json");
    
    if (!blobData) {
      return NextResponse.json(
        { error: "Team data not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(blobData, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("Erro ao buscar team data:", error);
    return NextResponse.json(
      { error: "Failed to load team data" }, 
      { status: 500 }
    );
  }
}
