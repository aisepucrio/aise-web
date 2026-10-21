import { NextRequest, NextResponse } from "next/server";
import { fetchPublications } from "@/lib/serpapi";
import { requireUser } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Busca publicações via SerpAPI. A rota antiga não exigia login (qualquer um
// podia gastar a cota da API); agora exige sessão, já que estamos tocando
// nela mesmo.
export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    await requireUser(request);

    const { authorId, yearCutoff } = await request.json();

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "SERPAPI_KEY não configurada" }, { status: 500 });
    }
    if (!authorId || !yearCutoff) {
      return NextResponse.json({ error: "authorId e yearCutoff obrigatórios" }, { status: 400 });
    }

    const publications = await fetchPublications(authorId, yearCutoff, apiKey);
    return NextResponse.json({ publications });
  } catch (error: unknown) {
    if (error instanceof NextResponse) return error;
    const message = error instanceof Error ? error.message : "Falha ao buscar publicações";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
