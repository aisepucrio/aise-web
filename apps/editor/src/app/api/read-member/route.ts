import { NextResponse } from "next/server";
import { readSheetData } from "@/server/googleSheets.server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const sheetName = process.env.TEAM_SHEET_NAME || "Team";
    const rows = await readSheetData(sheetName);

    // Procura membro por email (coluna F = índice 5)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[5]?.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json({ member: row, rowNumber: i + 1 });
      }
    }

    return NextResponse.json({ message: "not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
