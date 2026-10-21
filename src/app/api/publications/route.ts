import { NextRequest, NextResponse } from "next/server";
import { listPublications, appendPublications, replacePublications } from "@shared/db";
import { requireUser } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const publications = await listPublications();
    return NextResponse.json(
      { publications },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: unknown) {
    console.error("Error reading publications:", error);
    return NextResponse.json({ error: "Publications data not found" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    await requireUser(request);

    const { publications, mode } = await request.json();
    if (!Array.isArray(publications) || !["append", "replace"].includes(mode)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    if (mode === "replace") {
      await replacePublications(publications);
    } else {
      await appendPublications(publications);
    }

    return NextResponse.json({
      success: true,
      message: `${publications.length} publicações ${mode === "replace" ? "substituídas" : "adicionadas"}`,
    });
  } catch (error: unknown) {
    if (error instanceof NextResponse) return error;
    const message = error instanceof Error ? error.message : "Erro ao salvar publicações";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
