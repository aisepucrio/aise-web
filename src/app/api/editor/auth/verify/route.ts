import { NextRequest, NextResponse } from "next/server";

// Mock: aceita qualquer idToken e cria uma sessão fake (cookie httpOnly).
// A validação real do token do Google e a consulta de permissão em
// Team_Members entram aqui numa etapa seguinte, fora do escopo deste passo.
export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: "ID token required" }, { status: 400 });
  }

  const response = NextResponse.json({ email: "mock@aiselab.com", role: "admin" });
  response.cookies.set("auth-token", "mock-session", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  return response;
}
