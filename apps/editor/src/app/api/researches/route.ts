import { NextRequest, NextResponse } from "next/server";
import {
  readSheetData,
  parseSheetRows,
  updateResearch,
  type Research,
} from "@/services/googleSheetServerServices";
import { validateResearchBeforeUpdate } from "@/services/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lê researches do Google Sheets
export async function GET() {
  try {
    const sheetName = process.env.RESEARCHES_SHEET_NAME || "Researches";
    const rows = await readSheetData(sheetName);

    if (rows.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Planilha vazia" },
        { status: 404 }
      );
    }

    const researches = parseSheetRows(rows, "researches");
    return NextResponse.json({ researches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Atualiza research ou recebe dados para publicação externa
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const data = await request.json();

    // Fluxo 1: Publicação externa (com token)
    if (token) {
      const researches = Array.isArray(data) ? data : data.researches;

      if (!Array.isArray(researches)) {
        return NextResponse.json(
          { error: "Expected researches array" },
          { status: 400 }
        );
      }

      for (const item of researches) {
        if (!item.name || !item.id) {
          return NextResponse.json(
            { error: "Missing name or id in research" },
            { status: 400 }
          );
        }
      }

      return NextResponse.json({
        ok: true,
        count: researches.length,
        message: `${researches.length} researches published`,
      });
    }

    // Fluxo 2: Atualização interna (sem token)
    const validation = validateResearchBeforeUpdate(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    // Verifica se a research já existe
    const sheetName = process.env.RESEARCHES_SHEET_NAME || "Researches";
    const rows = await readSheetData(sheetName);

    let isNew = true;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.id) {
        isNew = false;
        break;
      }
    }

    await updateResearch(data as Research, isNew);

    return NextResponse.json({
      success: true,
      message: isNew
        ? "Research criada com sucesso"
        : "Research atualizada com sucesso",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
