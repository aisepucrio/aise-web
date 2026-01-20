import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Publishes data to external website (admin only) */
export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    await requireAdmin(request);
    const { section, data } = await request.json();

    // Get API token from env (secure)
    const apiToken = process.env.WEBSITE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "Website API token not configured" },
        { status: 500 },
      );
    }

    // Build publish URL
    const baseUrl = process.env.NEXT_PUBLIC_PUBLISH_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "Publish API URL not configured" },
        { status: 500 },
      );
    }

    const publishUrl = `${baseUrl}/api/${section}`;

    // Publish to external website
    const response = await fetch(publishUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Publicação falhou");
    }

    return NextResponse.json({
      success: true,
      message: result.message || "Publicação realizada com sucesso",
      count: result.count,
    });
  } catch (error: any) {
    if (error instanceof NextResponse) return error;
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: error.message || "Publicação falhou" },
      { status: 500 },
    );
  }
}
