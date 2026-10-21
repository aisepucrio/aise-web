// Server-side auth: validates Google ID tokens and checks permissions via
// sheet whitelist ("Login" tab). Usado tanto pelas rotas exclusivas do editor
// quanto pelas rotas de conteúdo compartilhadas (que usam getSession pra
// decidir entre a visão de admin e a visão pública).

import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { readSheetData } from "@/lib/google-sheets";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const DEV_MODE = process.env.DEV_MODE === "true";
const DEV_SESSION: UserSession = {
  email: "debug@localhost",
  role: "admin",
  emailVerified: true,
};

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
          email: String(row[0] || "").toLowerCase().trim(),
          role: String(row[1] || "").toLowerCase().trim(),
        }))
      : [];

  cacheTimestamp = now;
  return allowedUsersCache;
}

/** Validates a raw Google ID token against the Login sheet whitelist. */
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

/** Resolves the current session from the request, or null if there isn't one. Never throws. */
export async function getSession(
  request: NextRequest,
): Promise<UserSession | null> {
  if (DEV_MODE) return DEV_SESSION;

  const token = getAuthToken(request);
  return token ? await validateUserAuth(token) : null;
}

/** Requires an authenticated session - returns it or throws 401. */
export async function requireUser(request: NextRequest): Promise<UserSession> {
  const session = await getSession(request);
  if (!session) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

/** Requires an admin session - returns it or throws 401/403. */
export async function requireAdmin(request: NextRequest): Promise<UserSession> {
  const session = await requireUser(request);
  if (session.role !== "admin") {
    throw NextResponse.json(
      { error: "Acesso de administrador necessário" },
      { status: 403 },
    );
  }
  return session;
}
