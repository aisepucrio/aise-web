// Rota unificada para publications: GET (público) e POST (admin com auth)

import { NextRequest, NextResponse } from "next/server";
import { PublicationsPayload } from "@/app/api/lib/schemas";
import { requireBearer } from "@/app/api/lib/auth";
import { listPublications, replacePublications } from "@shared/db";

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
    const publications = await listPublications();
    return NextResponse.json({ publications }, { headers: corsHeaders() });
  } catch (error) {
    console.error("Error reading publications from Postgres:", error);
    return NextResponse.json(
      { error: "Publications data not found" },
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

    // Aceita tanto array direto quanto objeto com chave "publications"
    const publicationsData = Array.isArray(body) ? body : body.publications;

    const parsed = PublicationsPayload.parse(publicationsData);

    // Substitui todo o conteúdo (mantendo contrato de resposta)
    await replacePublications(parsed);

    return NextResponse.json(
      {
        ok: true,
        count: parsed.length,
        message: `${parsed.length} publications published successfully`,
        blob: { url: null, pathname: `postgres://publications` },
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
