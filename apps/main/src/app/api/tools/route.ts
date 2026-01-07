// Rota unificada para tools: GET (público) e POST (admin com auth)

import { NextRequest, NextResponse } from "next/server";
import { ToolsPayload } from "@/app/api/lib/schemas";
import { requireBearer } from "@/app/api/lib/auth";
import { getJsonByKey, setJsonByKey } from "@/app/api/lib/contentRepository";

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

// GET - Leitura pública do Blob
export async function GET() {
  try {
    const data = await getJsonByKey("lab/tools.json");
    if (!data) {
      return NextResponse.json(
        { error: "Tools data not found" },
        { status: 404, headers: corsHeaders() }
      );
    }
    return NextResponse.json(data, { headers: corsHeaders() });
  } catch (error) {
    console.error("Error reading tools from Firestore:", error);
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

    // Salva no Firestore (mantendo contrato de resposta)
    await setJsonByKey("lab/tools.json", { tools: parsed });

    return NextResponse.json(
      {
        ok: true,
        count: parsed.length,
        message: `${parsed.length} tools published successfully`,
        blob: { url: null, pathname: `firestore://lab/tools.json` },
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
