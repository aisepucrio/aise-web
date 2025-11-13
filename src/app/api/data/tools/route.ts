import { NextResponse } from "next/server";
import { readJson } from "@/lib/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await readJson("lab/tools.json");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading tools from Blob:", error);
    return NextResponse.json(
      { error: "Tools data not found" },
      { status: 404 }
    );
  }
}
