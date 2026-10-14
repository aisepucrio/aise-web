import { NextRequest, NextResponse } from "next/server";
import type { ResearchData } from "@/lib/types";

// Mock pra validar o front migrado. A leitura/escrita real no Postgres
// (via Prisma, hoje em packages/db/src/research.ts) entra nesta mesma
// rota numa etapa seguinte, fora do escopo deste passo.
const mockResearches: ResearchData[] = [
  {
    id: "research-diversity",
    name: "Diversidade em IA",
    shortDescription: "Linha de pesquisa sobre diversidade em sistemas de IA",
    longDescription:
      "Descrição longa sobre os objetivos da linha de pesquisa, cobrindo desafios de representatividade e viés em sistemas de inteligência artificial aplicados ao contexto acadêmico.",
    highlightImageUrl: "/images/logos/logo.png",
    duration: "Jan 2025 – present",
    projects: [
      { name: "Projeto A", imageUrl: "", description: "Descrição do projeto A" },
    ],
    team_relationships: [{ name: "Ada Lovelace" }],
    publication_relationships: ["RAISE: um sistema de recomendação"],
    tool_relationships: ["tool-raise"],
  },
];

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ researches: mockResearches });
}

export async function POST(request: NextRequest) {
  const research = await request.json();

  if (!research?.name) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: research.isNew
      ? "Research adicionado (mock)"
      : "Research atualizado (mock)",
  });
}
