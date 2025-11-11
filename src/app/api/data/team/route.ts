import { NextResponse } from "next/server";
import { readJson } from "@/lib/blob";
import teamDataFallback from "@/../public/json/data/team-data.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // sempre dinâmico (não cachear)

// GET público: retorna dados de team do Blob (fallback para arquivo estático)
export async function GET() {
  try {
    // Tenta ler do Blob primeiro
    const blobData = await readJson("lab/team.json");
    
    if (blobData) {
      return NextResponse.json(blobData, {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    // Fallback: retorna arquivo estático
    return NextResponse.json(teamDataFallback, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("Erro ao buscar team data:", error);
    // Em caso de erro, retorna fallback
    return NextResponse.json(teamDataFallback, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}
