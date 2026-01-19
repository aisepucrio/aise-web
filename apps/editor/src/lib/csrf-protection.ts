// csrf.ts
/**
 * CSRF protection for cookie-based auth:
 * For state-changing methods, require same-origin via Origin/Referer.
 */

import { NextRequest, NextResponse } from "next/server";

const CSRF_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getExpectedOrigin(request: NextRequest): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) return new URL(appUrl).origin;

  const host = request.headers.get("host") || "";
  const proto = host.includes("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

function getActualOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin");
  if (origin) return origin;

  const referer = request.headers.get("referer");
  if (!referer) return null;

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

/** Throws a 403 response if CSRF check fails */
export function requireCSRF(request: NextRequest): void {
  const method = request.method.toUpperCase();
  if (!CSRF_METHODS.has(method)) return;

  const expected = getExpectedOrigin(request);
  const actual = getActualOrigin(request);

  if (!actual || actual !== expected) {
    throw NextResponse.json({ error: "CSRF blocked" }, { status: 403 });
  }
}
