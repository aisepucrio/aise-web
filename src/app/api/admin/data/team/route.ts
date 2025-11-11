import { NextRequest, NextResponse } from "next/server";
import { TeamPayload } from "@/lib/schemas";
import { requireBearer } from "@/lib/auth";
import { saveJson } from "@/lib/blob";
import { normalizeImgboxInData } from "@/lib/imgbox";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log("=== POST /api/admin/data/team - Nova requisição ===");
  console.log("Método:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  
  // Rejeita outros métodos
  if (req.method !== "POST") {
    console.log("❌ Método não permitido:", req.method);
    return NextResponse.json({ error: "method not allowed" }, { status: 405 });
  }

  // Auth mínima
  const authHeader = req.headers.get("authorization");
  console.log("Authorization header:", authHeader ? `Bearer ${authHeader.substring(7, 20)}...` : "não presente");
  
  if (!requireBearer(authHeader)) {
    console.log("❌ Autenticação falhou");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  
  console.log("✅ Autenticação OK");

  try {
    const body = await req.json();
    console.log("📥 Body recebido - Total de items:", Array.isArray(body) ? body.length : "não é array");
    console.log("📥 Primeiros 2 items (sample):", JSON.stringify(body.slice(0, 2), null, 2));
    
    const parsed = TeamPayload.parse(body); // valida JSON
    console.log("✅ Validação Zod passou - Items validados:", parsed.length);
    
    // Normaliza URLs imgbox curtas para URLs reais de imagem
    const normalized = normalizeImgboxInData(parsed);
    console.log("🔄 Normalização imgbox concluída");
    console.log("📸 Sample de URL normalizada:", normalized[0]?.imageUrl);
    
    console.log("💾 Tentando salvar no Blob - key: lab/team.json");
    console.log("🔑 Token presente:", !!process.env.BLOB_READ_WRITE_TOKEN);
    
    const putResult = await saveJson("lab/team.json", normalized); // sobrescreve no Blob (retorna diagnóstico)
    
    console.log("✅ Blob PUT concluído - Resultado:", JSON.stringify(putResult, null, 2));
    
    // Retorna contagem, mensagem amigável e resultado do put para confirmar gravação
    const response = {
      ok: true,
      key: "lab/team.json",
      count: normalized.length,
      message: `${normalized.length} membros publicados com sucesso`,
      data: { team: normalized },
      blob: putResult,
    };
    
    console.log("📤 Respondendo com sucesso - count:", response.count);
    console.log("=== FIM da requisição ===\n");
    
    return NextResponse.json(response);
  } catch (e: any) {
    console.error("❌ ERRO na rota:", e);
    console.error("Stack:", e.stack);
    
    const msg = e?.issues ? "invalid payload" : (e?.message ?? "error");
    const code = e?.issues ? 400 : 500;
    
    if (e?.issues) {
      console.error("Erros de validação Zod:", JSON.stringify(e.issues, null, 2));
    }
    
    console.log("=== FIM da requisição (com erro) ===\n");
    return NextResponse.json({ error: msg, details: e?.issues || e?.message }, { status: code });
  }
}
