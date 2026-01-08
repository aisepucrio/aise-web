import { NextRequest, NextResponse } from "next/server";
import {
  readSheetData,
  parseSheetRows,
  updateTool,
  type Tool,
} from "@/server/googleSheets.server";
import { validateToolBeforeUpdate } from "@/services/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lê tools do Google Sheets
export async function GET() {
  try {
    const sheetName = process.env.TOOLS_SHEET_NAME || "Tools";
    const rows = await readSheetData(sheetName);

    if (rows.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Planilha vazia" },
        { status: 404 }
      );
    }

    const tools = parseSheetRows(rows, "tools");
    return NextResponse.json({ tools });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Atualiza tool ou recebe dados para publicação externa
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const data = await request.json();

    // Fluxo 1: Publicação externa (com token)
    if (token === process.env.ADMIN_TOKEN) {
      const tools = Array.isArray(data) ? data : data.tools;

      if (!Array.isArray(tools)) {
        return NextResponse.json(
          { error: "Expected tools array" },
          { status: 400 }
        );
      }

      for (const item of tools) {
        if (!item.name || !item.id) {
          return NextResponse.json(
            { error: "Missing name or id in tool" },
            { status: 400 }
          );
        }
      }

      return NextResponse.json({
        ok: true,
        count: tools.length,
        message: `${tools.length} tools published`,
      });
    }

    // Fluxo 2: Atualização interna (sem token)
    const validation = validateToolBeforeUpdate(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    // Verifica se o tool já existe
    const sheetName = process.env.TOOLS_SHEET_NAME || "Tools";
    const rows = await readSheetData(sheetName);

    let isNew = true;
    let existingToolIndex = -1;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.id) {
        isNew = false;
        existingToolIndex = i;
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
