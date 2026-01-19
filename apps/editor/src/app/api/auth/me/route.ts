import { NextRequest, NextResponse } from "next/server";
import { validateUserAuth } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns current user session from HttpOnly cookie
 */
export async function GET(request: NextRequest) {
  try {
    // Read token from HttpOnly cookie
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Validate token server-side
    const session = await validateUserAuth(token);

    if (!session) {
      // Invalid token - clear the cookie
      const response = NextResponse.json(
        { error: "Invalid session" },
        { status: 401 },
      );
      response.cookies.delete("auth-token");
      return response;
    }

    // Return user session data
    return NextResponse.json({
      email: session.email,
      role: session.role,
    });
  } catch (error: any) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Session validation failed" },
      { status: 500 },
    );
  }
}
