import { NextRequest, NextResponse } from "next/server";
import type { Publication } from "@/lib/types";

// Mock: devolve resultados fixos em vez de consultar a SerpAPI de verdade.
// O cliente real (hoje em apps/editor/src/lib/serpapi.ts) entra aqui numa
// etapa seguinte, fora do escopo deste passo.
export async function POST(request: NextRequest) {
  const { authorId, yearCutoff } = await request.json();

  if (!authorId || !yearCutoff) {
    return NextResponse.json(
      { error: "authorId e yearCutoff obrigatórios" },
      { status: 400 },
    );
  }

  const mockResults: Publication[] = [
    {
      title: "Attention Is All You Need",
      link: "https://arxiv.org/abs/1706.03762",
      authors_list: "Vaswani et al.",
      publication_place: "NeurIPS",
      citation_number: 100000,
      year: "2017",
      awards: "",
    },
  ];

  return NextResponse.json({ publications: mockResults });
}
