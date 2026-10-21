import { NextRequest, NextResponse } from "next/server";
import { listResearches, upsertResearch, researchExists, type LegacyResearch } from "@shared/db";
import { validateResearchBeforeUpdate } from "@/lib/validations";
import { requireUser } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";
import { signContentImages } from "@/lib/sign-content-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Research_Areas não tem is_active (nada referencia Research como FK
// obrigatória), então, diferente de Team/Tools, não existe filtro admin/público.
export async function GET() {
  try {
    const researches = await listResearches();
    return NextResponse.json(
      { researches: await signContentImages(researches) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: unknown) {
    console.error("Error reading researches:", error);
    return NextResponse.json({ error: "Researches data not found" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    await requireUser(request);

    const data = await request.json();
    const validation = validateResearchBeforeUpdate(data);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(", ") }, { status: 400 });
    }

    const isNew = !(await researchExists(data.id));
    await upsertResearch(data as LegacyResearch, isNew);

    return NextResponse.json({
      success: true,
      message: isNew ? "Research criada com sucesso" : "Research atualizada com sucesso",
    });
  } catch (error: unknown) {
    if (error instanceof NextResponse) return error;
    const message = error instanceof Error ? error.message : "Erro ao salvar research";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
