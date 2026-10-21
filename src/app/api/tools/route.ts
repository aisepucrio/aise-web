import { NextRequest, NextResponse } from "next/server";
import { listTools, upsertTool, toolExists, type LegacyTool } from "@shared/db";
import { validateToolBeforeUpdate } from "@/lib/validations";
import { getSession, requireUser } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";
import { signContentImages } from "@/lib/sign-content-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const tools = await listTools(
      session?.role === "admin" ? {} : { onlyActive: true },
    );
    return NextResponse.json(
      { tools: await signContentImages(tools) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: unknown) {
    console.error("Error reading tools:", error);
    return NextResponse.json({ error: "Tools data not found" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    await requireUser(request);

    const data = await request.json();
    const validation = validateToolBeforeUpdate(data);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(", ") }, { status: 400 });
    }

    const isNew = !(await toolExists(data.id));
    await upsertTool(data as LegacyTool, isNew);

    return NextResponse.json({
      success: true,
      message: isNew ? "Tool criado com sucesso" : "Tool atualizado com sucesso",
    });
  } catch (error: unknown) {
    if (error instanceof NextResponse) return error;
    const message = error instanceof Error ? error.message : "Erro ao salvar tool";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
