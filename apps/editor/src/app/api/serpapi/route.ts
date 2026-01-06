import { NextRequest, NextResponse } from "next/server";
import { fetchPublications } from "@/lib/serpapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST - Busca publicações via SerpAPI
export async function POST(request: NextRequest) {
  try {
    const { authorId, yearCutoff } = await request.json();

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "SERPAPI_KEY não configurada" },
        { status: 500 }
      );
    }

    if (!authorId || !yearCutoff) {
      return NextResponse.json(
        { error: "authorId e yearCutoff obrigatórios" },
        { status: 400 }
      );
    }

    const publications = await fetchPublications(authorId, yearCutoff, apiKey);

    return NextResponse.json({ publications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
