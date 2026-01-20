import { NextRequest, NextResponse } from "next/server";
import { validateUserAuth } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// DEV MODE
const DEV_MODE = process.env.DEV_MODE === "true";

/**
 * Verifies Google ID token and sets HttpOnly session cookie
 * Client sends the token once, server stores it securely
 */
export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    const { idToken } = await request.json();

    // DEV MODE
    // When in DEV MODE, accept a special token to bypass authentication
    if (DEV_MODE && idToken === "debug-token") {
      const response = NextResponse.json({
        email: "debug@localhost",
        role: "admin",
      });

      response.cookies.set("auth-token", "debug-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    if (!idToken) {
      return NextResponse.json({ error: "ID token required" }, { status: 400 });
    }

    const session = await validateUserAuth(idToken);

    if (!session) {
      return NextResponse.json(
        { error: "Invalid or unauthorized user" },
        { status: 401 },
      );
    }

    // Create response with session data
    const response = NextResponse.json({
      email: session.email,
      role: session.role,
    });

    // Set HttpOnly cookie with the validated token
    // HttpOnly prevents JavaScript access (XSS protection)
    // Secure requires HTTPS in production
    // SameSite=Strict prevents CSRF attacks (stricter than Lax)
    response.cookies.set("auth-token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
