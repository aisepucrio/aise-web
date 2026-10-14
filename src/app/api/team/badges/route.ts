import { NextResponse } from "next/server";

// Mock. No real, deriva essas listas a partir do GET de /api/team.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    researchInterests: ["AI", "Math", "Computability"],
    technologies: ["Python", "TypeScript", "Rust"],
    knowledge: ["Math", "Cryptography"],
  });
}
