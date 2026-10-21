import { NextRequest, NextResponse } from "next/server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Encerra a sessão limpando o cookie HttpOnly. */
export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    const response = NextResponse.json({ success: true });
    response.cookies.delete("auth-token");
    return response;
  } catch (error: unknown) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
