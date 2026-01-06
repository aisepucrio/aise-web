import { NextResponse } from "next/server";
import { readSheetData } from "@/server/googleSheets.server";

export async function GET() {
  try {
    const sheetName = process.env.TEAM_SHEET_NAME || "Team";
    const rows = await readSheetData(sheetName);

    const members = rows
      .slice(1) // Pula header
      .filter((row) => row[0] && row[5]) // Nome e Email obrigatórios
      .map((row) => ({
        name: row[0],
        position: row[1] || "",
        email: row[5],
      }));

    return NextResponse.json({ members });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
