// auth-server.ts
/**
 * Server-side auth: validates Google ID tokens and checks permissions via sheet whitelist
 */

import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { readSheetData } from "@/lib/google-sheet-server-services";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// DEV MODE
const DEV_MODE = process.env.DEV_MODE === "true";

export interface UserSession {
  email: string;
  role: "user" | "admin";
  emailVerified: boolean;
}

interface LoginSheetRow {
  email: string;
  role: string;
}

/** In-memory cache for allowed users list */
let allowedUsersCache: LoginSheetRow[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

// Verify Google ID token and return user info
async function verifyGoogleToken(
  idToken: string,
): Promise<{ email: string; emailVerified: boolean } | null> {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) return null;

    return {
      email: payload.email,
      emailVerified: Boolean(payload.email_verified),
    };
  } catch (error) {
    console.error("Falha na verificação do token:", error);
    return null;
  }
}

// Load allowed users from Google Sheet with caching
async function getAllowedUsers(): Promise<LoginSheetRow[]> {
  const now = Date.now();
  if (allowedUsersCache && now - cacheTimestamp < CACHE_TTL_MS) {
    return allowedUsersCache;
  }

  const sheetName = process.env.LOGIN_SHEET_NAME || "Login";
  const rows = await readSheetData(sheetName);

  allowedUsersCache =
    rows.length >= 2
      ? rows.slice(1).map((row) => ({
          email: String(row[0] || "")
            .toLowerCase()
            .trim(),
          role: String(row[1] || "")
            .toLowerCase()
            .trim(),
        }))
      : [];

  cacheTimestamp = now;
  return allowedUsersCache;
}

// Validate user auth and return session or null
export async function validateUserAuth(
  idToken: string,
): Promise<UserSession | null> {
  if (!idToken) return null;

  const googleData = await verifyGoogleToken(idToken);
  if (!googleData || !googleData.emailVerified) return null;

  const email = googleData.email.toLowerCase();
  const allowedUsers = await getAllowedUsers();
  const match = allowedUsers.find((u) => u.email === email);
  if (!match) return null;

  return {
    email,
    role: match.role === "admin" ? "admin" : "user",
    emailVerified: true,
  };
}

function getAuthToken(request: NextRequest): string | null {
  return request.cookies.get("auth-token")?.value || null;
}

/** Requires authenticated user - returns session or throws 401 */
export async function requireUser(request: NextRequest): Promise<UserSession> {
  // DEV MODE
  if (DEV_MODE) {
    return {
      email: "debug@localhost",
      role: "admin",
      emailVerified: true,
    };
  }

  const token = getAuthToken(request);
  const session = token ? await validateUserAuth(token) : null;

  if (!session) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return session;
}

export async function requireAdmin(request: NextRequest): Promise<UserSession> {
  // DEV MODE
  if (DEV_MODE) {
    return {
      email: "debug@localhost",
      role: "admin",
      emailVerified: true,
    };
  }
  const session = await requireUser(request);

  if (session.role !== "admin") {
    throw NextResponse.json(
      { error: "Acesso de administrador necessário" },
      { status: 403 },
    );
  }

  return session;
}
