import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock: só confere se o cookie fake existe (ver /api/editor/auth/verify).
export async function GET(request: NextRequest) {
  const session = request.cookies.get("auth-token");

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ email: "mock@aiselab.com", role: "admin" });
}
