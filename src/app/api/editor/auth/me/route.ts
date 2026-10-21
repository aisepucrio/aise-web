import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Retorna a sessão atual a partir do cookie HttpOnly (ou do bypass de DEV_MODE). */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      const response = NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      response.cookies.delete("auth-token");
      return response;
    }

    return NextResponse.json({ email: session.email, role: session.role });
  } catch (error: unknown) {
    console.error("Session check error:", error);
    return NextResponse.json({ error: "Session validation failed" }, { status: 500 });
  }
}
