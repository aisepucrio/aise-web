import { NextRequest, NextResponse } from "next/server";
import type { ToolData } from "@/lib/types";

// Mock pra validar o front migrado. A leitura/escrita real no Postgres
// (via Prisma, hoje em packages/db/src/tools.ts) entra nesta mesma rota
// numa etapa seguinte, fora do escopo deste passo.
const mockTools: ToolData[] = [
  {
    id: "tool-raise",
    name: "RAISE",
    tagline: "Sistema de recomendação de artigos usando IA",
    description:
      "Ferramenta completa para recomendação automática de publicações.",
    category: "AI",
    highlightImageUrl: "",
    galleryImagesUrl: [],
    duration: "Jan 2025 – presente",
    objectives: ["Recomendar artigos", "Facilitar pesquisa"],
    features: ["Busca semântica"],
    techStack: ["Python", "FastAPI", "Postgres"],
    team_relationships: [{ name: "Ada Lovelace", roles: ["Dev", "Design"] }],
    publication_relationships: ["RAISE: um sistema de recomendação"],
    links: { webapp: "", github: "github.com/aise/raise", api: "", docs: "" },
  },
];

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ tools: mockTools });
}

export async function POST(request: NextRequest) {
  const tool = await request.json();

  if (!tool?.name) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: tool.isNew ? "Tool criado (mock)" : "Tool atualizado (mock)",
  });
}
