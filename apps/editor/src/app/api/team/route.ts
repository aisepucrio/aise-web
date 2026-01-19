import { NextRequest, NextResponse } from "next/server";
import {
  readSheetData,
  parseSheetRows,
  updateTeamMember,
} from "@/lib/google-sheet-server-services";
import { validateMemberBeforeUpdate } from "@/lib/validations";
import { requireUser, requireAdmin } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireUser(request); // Auth check

    const sheetName = process.env.TEAM_SHEET_NAME || "Team";
    const rows = await readSheetData(sheetName);

    if (rows.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Planilha vazia" },
        { status: 404 },
      );
    }

    const team = parseSheetRows(rows, "team");
    return NextResponse.json({ team });
  } catch (error: any) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireCSRF(request); // CSRF check for mutations

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const data = await request.json();

    // External publish (admin only)
    if (token) {
      await requireAdmin(request);

      const team = Array.isArray(data) ? data : data.team;

      if (!Array.isArray(team)) {
        return NextResponse.json(
          { error: "Expected team array" },
          { status: 400 },
        );
      }

      for (const item of team) {
        if (!item.name || !item.position) {
          return NextResponse.json(
            { error: "Missing name or position" },
            { status: 400 },
          );
        }
      }

      return NextResponse.json({
        ok: true,
        count: team.length,
        message: `${team.length} team members published`,
      });
    }

    // Internal update (any authenticated user)
    await requireUser(request);

    const member = data.member || data;
    const isNew = data.isNew !== undefined ? data.isNew : false;

    const validation = validateMemberBeforeUpdate(member);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 },
      );
    }

    await updateTeamMember(member, isNew);

    return NextResponse.json({
      success: true,
      message: isNew ? "Membro adicionado" : "Membro atualizado",
    });
  } catch (error: any) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
