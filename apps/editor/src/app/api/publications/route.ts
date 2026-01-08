import { NextRequest, NextResponse } from "next/server";
import {
  readSheetData,
  parseSheetRows,
  updatePublications,
} from "@/server/googleSheets.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lê publicações do Google Sheets
export async function GET() {
  try {
    const sheetName = process.env.PUBLICATIONS_SHEET_NAME || "Publications";
    const rows = await readSheetData(sheetName);

    if (rows.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Planilha vazia" },
        { status: 404 }
      );
    }

    const publications = parseSheetRows(rows, "publications");
    return NextResponse.json({ publications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Atualiza publicações (modo append ou replace) ou recebe dados para publicação externa
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const data = await request.json();

    // Fluxo 1: Publicação externa (com token)
    if (token) {
      const publications = Array.isArray(data) ? data : data.publications;

      if (!Array.isArray(publications)) {
        return NextResponse.json(
          { error: "Expected publications array" },
          { status: 400 }
        );
      }

      for (const item of publications) {
        if (!item.title) {
          return NextResponse.json(
            { error: "Missing title in publication" },
            { status: 400 }
          );
        }
      }

      return NextResponse.json({
        ok: true,
        count: publications.length,
        message: `${publications.length} publications published`,
      });
    }

    // Fluxo 2: Atualização interna (sem token)
    const { publications, mode } = data;

    if (!Array.isArray(publications) || !["append", "replace"].includes(mode)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    await updatePublications(publications, mode);

    return NextResponse.json({
      ok: true,
      message: `${publications.length} publicações ${
        mode === "replace" ? "substituídas" : "adicionadas"
      }`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
