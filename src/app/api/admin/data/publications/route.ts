import { NextRequest, NextResponse } from "next/server";
import { PublicationsPayload } from "@/lib/schemas";
import { requireBearer } from "@/lib/auth";
import { saveJson } from "@/lib/blob";

export const runtime = "nodejs";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() });
}

async function savePublications(req: NextRequest) {
  if (!requireBearer(req.headers.get("authorization"))) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" }, 
      { status: 401, headers: corsHeaders() }
    );
  }

  try {
    const body = await req.json();
    
    // Aceita tanto array direto quanto objeto com chave "publications"
    const publicationsData = Array.isArray(body) ? body : body.publications;
    
    const parsed = PublicationsPayload.parse(publicationsData);
    
    // Salva com a estrutura { "publications": [...] } para manter compatibilidade
    const blob = await saveJson("lab/publications.json", { publications: parsed });
    
    return NextResponse.json({
      ok: true,
      count: parsed.length,
      message: `${parsed.length} publicações salvas com sucesso`,
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

export async function POST(req: NextRequest) {
  return savePublications(req);
}

export async function PUT(req: NextRequest) {
  return savePublications(req);
}
