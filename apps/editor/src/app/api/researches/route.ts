import { NextRequest, NextResponse } from "next/server";
import { listResearches, upsertResearch, researchExists, type LegacyResearch } from "@shared/db";
import { validateResearchBeforeUpdate } from "@/lib/validations";
import { requireUser, requireAdmin } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";
import { signContentImages } from "@/lib/sign-content-images-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireUser(request);

    const researches = await listResearches();
    return NextResponse.json({ researches: await signContentImages(researches) });
  } catch (error: any) {
    if (error instanceof NextResponse) return error;
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

      const researches = Array.isArray(data) ? data : data.researches;

      if (!Array.isArray(researches)) {
        return NextResponse.json(
          { error: "Expected researches array" },
          { status: 400 },
        );
      }

      for (const item of researches) {
        if (!item.name || !item.id) {
          return NextResponse.json(
            { error: "Missing name or id in research" },
            { status: 400 },
          );
        }
      }

      return NextResponse.json({
        ok: true,
        count: researches.length,
        message: `${researches.length} researches published`,
      });
    }

    // Internal update
    await requireUser(request);

    const validation = validateResearchBeforeUpdate(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 },
      );
    }

    const isNew = !(await researchExists(data.id));

    await upsertResearch(data as LegacyResearch, isNew);

    return NextResponse.json({
      success: true,
      message: isNew
        ? "Research criada com sucesso"
        : "Research atualizada com sucesso",
    });
  } catch (error: any) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
