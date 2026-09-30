import { NextRequest, NextResponse } from "next/server";
import {
  listPublications,
  appendPublications,
  replacePublications,
} from "@shared/db";
import { requireUser, requireAdmin } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireUser(request);

    const publications = await listPublications();
    return NextResponse.json({ publications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const data = await request.json();

    // External publish (admin only)
    if (token) {
      await requireAdmin(request);

      const publications = Array.isArray(data) ? data : data.publications;

      if (!Array.isArray(publications)) {
        return NextResponse.json(
          { error: "Expected publications array" },
          { status: 400 },
        );
      }

      for (const item of publications) {
        if (!item.title) {
          return NextResponse.json(
            { error: "Missing title in publication" },
            { status: 400 },
          );
        }
      }

      return NextResponse.json({
        ok: true,
        count: publications.length,
        message: `${publications.length} publications published`,
      });
    }

    // Internal update
    await requireUser(request);

    const { publications, mode } = data;

    if (!Array.isArray(publications) || !["append", "replace"].includes(mode)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    if (mode === "replace") {
      await replacePublications(publications);
    } else {
      await appendPublications(publications);
    }

    return NextResponse.json({
      ok: true,
      message: `${publications.length} publicações ${
        mode === "replace" ? "substituídas" : "adicionadas"
      }`,
    });
  } catch (error: any) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
