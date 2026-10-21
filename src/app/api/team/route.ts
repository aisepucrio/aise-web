import { NextRequest, NextResponse } from "next/server";
import { listTeamMembers, upsertTeamMember } from "@shared/db";
import { validateMemberBeforeUpdate } from "@/lib/validations";
import { getSession, requireUser } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";
import { signContentImages } from "@/lib/sign-content-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Rota compartilhada entre o site público e o editor: com sessão de admin,
// retorna todos os membros (inclusive inativos); sem sessão, só os ativos.
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const team = await listTeamMembers(
      session?.role === "admin" ? {} : { onlyActive: true },
    );
    return NextResponse.json(
      { team: await signContentImages(team) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: unknown) {
    console.error("Error reading team:", error);
    return NextResponse.json({ error: "Team data not found" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    await requireUser(request);

    const data = await request.json();
    const member = data.member || data;
    const isNew = data.isNew === true;
    const originalEmail = data.originalItemId || member.email;

    const validation = validateMemberBeforeUpdate(member);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(", ") }, { status: 400 });
    }

    await upsertTeamMember(member, isNew, originalEmail);

    return NextResponse.json({
      success: true,
      message: isNew ? "Membro adicionado" : "Membro atualizado",
    });
  } catch (error: unknown) {
    if (error instanceof NextResponse) return error;
    const message = error instanceof Error ? error.message : "Erro ao salvar membro";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
