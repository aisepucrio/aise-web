import { NextRequest, NextResponse } from "next/server";
import { ToolsPayload } from "@/lib/schemas";
import { requireBearer } from "@/lib/auth";
import { saveJson } from "@/lib/blob";
import { normalizeImgboxInData } from "@/lib/imgbox";

export const runtime = "nodejs";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() });
}

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
    const normalized = normalizeImgboxInData(parsed);
    
    // Salva com a estrutura { "tools": [...] } para manter compatibilidade
    const blob = await saveJson("lab/tools.json", { tools: normalized });
    
    return NextResponse.json({
      ok: true,
      count: normalized.length,
      message: `${normalized.length} ferramentas publicadas com sucesso`,
      blob: { url: blob.url, pathname: blob.pathname },
    }, { headers: corsHeaders() });
    
  } catch (e: any) {
    const isValidation = !!e?.issues;
    return NextResponse.json({ 
      ok: false,
      error: isValidation ? "invalid payload" : e?.message || "error",
      details: e?.issues || e?.message,
    }, { 
      status: isValidation ? 400 : 500, 
      headers: corsHeaders() 
    });
  }
}
