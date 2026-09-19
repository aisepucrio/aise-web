// Rota unificada para tools: GET (público) e POST (admin com auth)

import { NextRequest, NextResponse } from "next/server";
import { ToolsPayload } from "@/app/api/lib/schemas";
import { requireBearer } from "@/app/api/lib/auth";
import { listTools, replaceTools } from "@shared/db";
import { signContentImages } from "@/app/api/lib/signContentImages";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() });
}

// GET - Leitura pública (só tools ativos)
export async function GET() {
  try {
    const tools = await listTools({ onlyActive: true });
    return NextResponse.json(await signContentImages({ tools }), { headers: { ...corsHeaders(), "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error reading tools from Postgres:", error);
    return NextResponse.json(
      { error: "Tools data not found" },
      { status: 404, headers: corsHeaders() }
    );
  }
}

// POST - Gravação protegida (admin apenas)
export async function POST(req: NextRequest) {
  if (!requireBearer(req.headers.get("authorization"))) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: corsHeaders() }
    );
  }

  try {
    const body = await req.json();

    // Aceita tanto array direto quanto objeto com chave "tools"
    const toolsData = Array.isArray(body) ? body : body.tools;

    const parsed = ToolsPayload.parse(toolsData);

    // Upsert por slug; quem sai do payload vira is_active=false
    await replaceTools(parsed as any);

    return NextResponse.json(
      {
        ok: true,
        count: parsed.length,
        message: `${parsed.length} tools published successfully`,
        blob: { url: null, pathname: `postgres://tools` },
      },
      { headers: corsHeaders() }
    );
  } catch (e: any) {
    const isValidation = !!e?.issues;
    return NextResponse.json(
      {
        ok: false,
        error: isValidation ? "invalid payload" : e?.message || "error",
        details: e?.issues || e?.message,
      },
      {
        status: isValidation ? 400 : 500,
        headers: corsHeaders(),
      }
    );
  }
}
