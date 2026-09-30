// Rota unificada para researches: GET (público) e POST (admin com auth)

import { NextRequest, NextResponse } from "next/server";
import { requireBearer } from "@/app/api/lib/auth";
import { listResearches, replaceResearches } from "@shared/db";
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

// GET - Leitura pública
export async function GET() {
  try {
    const researches = await listResearches();
    return NextResponse.json(await signContentImages({ researches }), { headers: { ...corsHeaders(), "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error reading researches from Postgres:", error);
    return NextResponse.json(
      { error: "Researches data not found" },
      { status: 404, headers: corsHeaders() }
    );
  }
}

// POST - Gravação protegida (admin apenas)
export async function POST(req: NextRequest) {
  // Autenticação
  if (!requireBearer(req.headers.get("authorization"))) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: corsHeaders() }
    );
  }

  try {
    const body = await req.json();

    // Aceita tanto array direto quanto objeto com chave "researches"
    const researchesData = Array.isArray(body) ? body : body.researches;

    // Apaga e recria tudo (Research_Areas não é referenciada como FK
    // obrigatória por mais nada, então isso é seguro)
    await replaceResearches(researchesData);

    return NextResponse.json(
      {
        ok: true,
        count: researchesData.length,
        message: `${researchesData.length} research lines published successfully`,
        blob: { url: null, pathname: `postgres://researches` },
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
