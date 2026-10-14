import { NextRequest, NextResponse } from "next/server";
import type { Publication } from "@/lib/types";

// Mock pra validar o front migrado. A leitura/escrita real no Postgres
// (via Prisma, hoje em packages/db/src/publications.ts) entra nesta
// mesma rota numa etapa seguinte, fora do escopo deste passo.
const mockPublications: Publication[] = [
  {
    title: "RAISE: um sistema de recomendação",
    link: "",
    authors_list: "Lovelace, A.; Turing, A.",
    publication_place: "",
    citation_number: 0,
    year: "2026",
    awards: "",
  },
];

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ publications: mockPublications });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!Array.isArray(body?.publications)) {
    return NextResponse.json(
      { error: "Lista de publicações é obrigatória" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Publicações salvas (mock)",
  });
}
