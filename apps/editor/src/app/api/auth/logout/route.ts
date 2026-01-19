import { NextRequest, NextResponse } from "next/server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Logs out user by clearing the HttpOnly session cookie
 */
export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    const response = NextResponse.json({ success: true });

    // Clear the auth cookie
    response.cookies.delete("auth-token");

    return response;
  } catch (error: any) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
