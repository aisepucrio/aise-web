import { NextRequest, NextResponse } from "next/server";
import {
  readSheetData,
  parseSheetRows,
  updateTeamMember,
} from "@/server/googleSheets.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lê membros do time do Google Sheets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const mode = searchParams.get("mode"); // 'simple' para lista resumida

    const sheetName = process.env.TEAM_SHEET_NAME || "Team";
    const rows = await readSheetData(sheetName);

    if (rows.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Planilha vazia" },
        { status: 404 }
      );
    }

    // Busca por email específico
    if (email) {
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row[5]?.toLowerCase() === email.toLowerCase()) {
          return NextResponse.json({ member: row, rowNumber: i + 1 });
        }
      }
      return NextResponse.json({ message: "not found" }, { status: 404 });
    }

    // Lista simplificada (nome, posição, email)
    if (mode === "simple") {
      const members = rows
        .slice(1)
        .filter((row) => row[0] && row[5])
        .map((row) => ({
          name: row[0],
          position: row[1] || "",
          email: row[5],
        }));
      return NextResponse.json({ members });
    }

    // Lista completa (padrão)
    const team = parseSheetRows(rows, "team");
    return NextResponse.json({ team });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Atualiza membro do time ou recebe dados para publicação externa
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const data = await request.json();

    // Fluxo 1: Publicação externa (com token)
    if (token === process.env.ADMIN_TOKEN) {
      const team = Array.isArray(data) ? data : data.team;

      if (!Array.isArray(team)) {
        return NextResponse.json(
          { error: "Expected team array" },
          { status: 400 }
        );
      }

      for (const item of team) {
        if (!item.name || !item.position) {
          return NextResponse.json(
            { error: "Missing name or position" },
            { status: 400 }
          );
        }
      }

      return NextResponse.json({
        ok: true,
        count: team.length,
        message: `${team.length} team members published`,
      });
    }

    // Fluxo 2: Atualização interna (sem token)
    // Aceita tanto { member, isNew } (formato antigo) quanto dados diretos (novo formato)
    const member = data.member || data;
    const isNew = data.isNew !== undefined ? data.isNew : false;

    console.log("[Team API] Recebido:", {
      hasEmail: !!member?.email,
      email: member?.email,
    });

    if (!member?.email || member.email === "exemplo@example.com") {
      console.error("[Team API] Validação falhou:", { email: member?.email });
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    await updateTeamMember(member, isNew);

    return NextResponse.json({
      success: true,
      message: isNew ? "Membro adicionado" : "Membro atualizado",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
