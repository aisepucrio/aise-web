import { NextRequest, NextResponse } from "next/server";
import type { TeamMemberData } from "@/lib/types";

// Mock pra validar o front migrado. A leitura/escrita real no Postgres
// (via Prisma, hoje em packages/db/src/team.ts) entra nesta mesma rota
// numa etapa seguinte, fora do escopo deste passo.
// Valores respeitam as mesmas regras de src/lib/validations.ts (validateMemberData)
// pra passar na validação do formulário de edição sem precisar ajustar nada à mão.
const mockTeam: TeamMemberData[] = [
  {
    name: "Ada Lovelace",
    position: "PhD Student",
    is_alumni: false,
    university: "PUC-Rio",
    imageUrl: "/images/logos/logo.png",
    description:
      "Pesquisadora em IA e sistemas de recomendação de artigos acadêmicos.",
    email: "ada@aiselab.com",
    researchInterests: ["AI", "Math"],
    technologies: ["Python", "TypeScript", "FastAPI"],
    knowledge: ["Math"],
    birthday: "10/12/1990",
    socialLinks: { linkedin: "linkedin.com/in/ada" },
  },
  {
    name: "Alan Turing",
    position: "Laboratory Head",
    is_alumni: false,
    university: "PUC-Rio",
    imageUrl: "/images/logos/logo.png",
    description:
      "Orientador do laboratório AISE, com foco em segurança e computabilidade de sistemas de IA.",
    email: "alan@aiselab.com",
    researchInterests: ["Computability", "AI Safety"],
    technologies: ["Rust", "Python", "C++"],
    knowledge: ["Cryptography"],
    birthday: "23/06/1985",
    socialLinks: { googleScholar: "scholar.google.com/alan" },
  },
];

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ team: mockTeam });
}

export async function POST(request: NextRequest) {
  const member = await request.json();

  if (!member?.email || !member?.name) {
    return NextResponse.json(
      { error: "Nome e email são obrigatórios" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message: member.isNew ? "Membro adicionado (mock)" : "Membro atualizado (mock)",
  });
}
