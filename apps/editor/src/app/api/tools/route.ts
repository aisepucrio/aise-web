import { NextRequest, NextResponse } from "next/server";
import {
  readSheetData,
  parseSheetRows,
  updateTool,
  type Tool,
} from "@/lib/google-sheet-server-services";
import { validateToolBeforeUpdate } from "@/lib/validations";
import { requireUser, requireAdmin } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireUser(request);

    const sheetName = process.env.TOOLS_SHEET_NAME || "Tools";
    const rows = await readSheetData(sheetName);

    if (rows.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Planilha vazia" },
        { status: 404 },
      );
    }

    const tools = parseSheetRows(rows, "tools");
    return NextResponse.json({ tools });
  } catch (error: any) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const data = await request.json();

    // External publish (admin only)
    if (token) {
      await requireAdmin(request);

      const tools = Array.isArray(data) ? data : data.tools;

      if (!Array.isArray(tools)) {
        return NextResponse.json(
          { error: "Expected tools array" },
          { status: 400 },
        );
      }

      for (const item of tools) {
        if (!item.name || !item.id) {
          return NextResponse.json(
            { error: "Missing name or id in tool" },
            { status: 400 },
          );
        }
      }

      return NextResponse.json({
        ok: true,
        count: tools.length,
        message: `${tools.length} tools published`,
      });
    }

    // Internal update
    await requireUser(request);

    const validation = validateToolBeforeUpdate(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 },
      );
    }

    const sheetName = process.env.TOOLS_SHEET_NAME || "Tools";
    const rows = await readSheetData(sheetName);

    let isNew = true;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.id) {
        isNew = false;
        break;
      }
    }

    await updateTool(data as Tool, isNew);

    return NextResponse.json({
      success: true,
      message: isNew
        ? "Tool criado com sucesso"
        : "Tool atualizado com sucesso",
    });
  } catch (error: any) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
