import { NextRequest, NextResponse } from "next/server";
import {
  readSheetData,
  parseSheetRows,
  updateResearch,
  type Research,
} from "@/lib/google-sheet-server-services";
import { validateResearchBeforeUpdate } from "@/lib/validations";
import { requireUser, requireAdmin } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireUser(request);

    const sheetName = process.env.RESEARCHES_SHEET_NAME || "Researches";
    const rows = await readSheetData(sheetName);

    if (rows.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Planilha vazia" },
        { status: 404 },
      );
    }

    const researches = parseSheetRows(rows, "researches");
    return NextResponse.json({ researches });
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

      const researches = Array.isArray(data) ? data : data.researches;

      if (!Array.isArray(researches)) {
        return NextResponse.json(
          { error: "Expected researches array" },
          { status: 400 },
        );
      }

      for (const item of researches) {
        if (!item.name || !item.id) {
          return NextResponse.json(
            { error: "Missing name or id in research" },
            { status: 400 },
          );
        }
      }

      return NextResponse.json({
        ok: true,
        count: researches.length,
        message: `${researches.length} researches published`,
      });
    }

    // Internal update
    await requireUser(request);

    const validation = validateResearchBeforeUpdate(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 },
      );
    }

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
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
