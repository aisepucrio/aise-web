import { NextRequest, NextResponse } from "next/server";
import { TeamPayload } from "@/lib/schemas";
import { requireBearer } from "@/lib/auth";
import { saveJson } from "@/lib/blob";
import { normalizeImgboxInData } from "@/lib/imgbox";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Rejeita outros métodos
  if (req.method !== "POST") {
    return NextResponse.json({ error: "method not allowed" }, { status: 405 });
  }

  // Auth mínima
  if (!requireBearer(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = TeamPayload.parse(body); // valida JSON
    
    // Normaliza URLs imgbox curtas para URLs reais de imagem
    const normalized = normalizeImgboxInData(parsed);
    
    const putResult = await saveJson("lab/team.json", normalized); // sobrescreve no Blob (retorna diagnóstico)
    // Retorna contagem, mensagem amigável e resultado do put para confirmar gravação
    return NextResponse.json({
      ok: true,
      key: "lab/team.json",
      count: normalized.length,
      message: `${normalized.length} membros publicados com sucesso`,
      data: { team: normalized },
      blob: putResult,
    });
  } catch (e: any) {
    const msg = e?.issues ? "invalid payload" : (e?.message ?? "error");
    const code = e?.issues ? 400 : 500;
    return NextResponse.json({ error: msg }, { status: code });
  }
}
