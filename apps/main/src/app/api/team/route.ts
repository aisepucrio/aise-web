// Rota unificada para team: GET (público) e POST (admin com auth)

import { NextRequest, NextResponse } from "next/server";
import { TeamPayload } from "@/app/api/lib/schemas";
import { requireBearer } from "@/app/api/lib/auth";
import { listTeamMembers, replaceTeamMembers } from "@shared/db";
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

// GET - Leitura pública (só membros ativos)
export async function GET() {
  try {
    const team = await listTeamMembers({ onlyActive: true });
    return NextResponse.json(await signContentImages({ team }), { headers: { ...corsHeaders(), "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error reading team from Postgres:", error);
    return NextResponse.json(
      { error: "Team data not found" },
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

    // Aceita tanto array direto quanto objeto com chave "team"
    const teamData = Array.isArray(body) ? body : body.team;

    const parsed = TeamPayload.parse(teamData);

    // Upsert de quem está no payload; quem não está mais vira is_active=false
    // (não apaga — preserva a identidade de login desses membros)
    await replaceTeamMembers(parsed as any);

    return NextResponse.json(
      {
        ok: true,
        count: parsed.length,
        message: `${parsed.length} team members published successfully`,
        blob: { url: null, pathname: `postgres://team` },
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
