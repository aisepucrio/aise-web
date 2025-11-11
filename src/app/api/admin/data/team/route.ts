import { NextRequest, NextResponse } from "next/server";
import { TeamPayload } from "@/lib/schemas";
import { requireBearer } from "@/lib/auth";
import { saveJson } from "@/lib/blob";
import { normalizeImgboxInData } from "@/lib/imgbox";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const debugLogs: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    debugLogs.push(msg);
  };

  log("=== POST /api/admin/data/team - Nova requisição ===");
  log(`Método: ${req.method}`);
  log(`Headers: ${JSON.stringify(Object.fromEntries(req.headers.entries()))}`);
  
  // Rejeita outros métodos
  if (req.method !== "POST") {
    log(`❌ Método não permitido: ${req.method}`);
    return NextResponse.json({ error: "method not allowed", debug: debugLogs }, { status: 405 });
  }

  // Auth mínima
  const authHeader = req.headers.get("authorization");
  log(`Authorization header: ${authHeader ? `Bearer ${authHeader.substring(7, 20)}...` : "não presente"}`);
  
  if (!requireBearer(authHeader)) {
    log("❌ Autenticação falhou");
    return NextResponse.json({ error: "unauthorized", debug: debugLogs }, { status: 401 });
  }
  
  log("✅ Autenticação OK");

  try {
    const body = await req.json();
    log(`📥 Body recebido - Total de items: ${Array.isArray(body) ? body.length : "não é array"}`);
    log(`📥 Primeiros 2 items (sample): ${JSON.stringify(body.slice(0, 2), null, 2)}`);
    
    const parsed = TeamPayload.parse(body); // valida JSON
    log(`✅ Validação Zod passou - Items validados: ${parsed.length}`);
    
    // Normaliza URLs imgbox curtas para URLs reais de imagem
    const normalized = normalizeImgboxInData(parsed);
    log("🔄 Normalização imgbox concluída");
    log(`📸 Sample de URL normalizada: ${normalized[0]?.imageUrl}`);
    
    log("💾 Tentando salvar no Blob - key: lab/team.json");
    log(`🔑 Token BLOB_READ_WRITE_TOKEN presente: ${!!process.env.BLOB_READ_WRITE_TOKEN}`);
    log(`🔑 Token length: ${process.env.BLOB_READ_WRITE_TOKEN?.length || 0}`);
    log(`🔑 Token prefix: ${process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 30) || "VAZIO"}...`);
    log(`📊 Tamanho do JSON a salvar: ${JSON.stringify(normalized).length} bytes`);
    
    const putResult = await saveJson("lab/team.json", normalized); // sobrescreve no Blob (retorna diagnóstico)
    
    log(`✅ Blob PUT concluído - Resultado: ${JSON.stringify(putResult, null, 2)}`);
    
    // Retorna contagem, mensagem amigável e resultado do put para confirmar gravação
    const response = {
      ok: true,
      key: "lab/team.json",
      count: normalized.length,
      message: `${normalized.length} membros publicados com sucesso`,
      data: { team: normalized },
      blob: putResult,
      debug: debugLogs, // Inclui logs na resposta para debug
    };
    
    log(`📤 Respondendo com sucesso - count: ${response.count}`);
    log("=== FIM da requisição ===\n");
    
    return NextResponse.json(response);
  } catch (e: any) {
    console.error("❌ ERRO na rota:", e);
    console.error("Stack:", e.stack);
    log(`❌ ERRO: ${e.message}`);
    log(`❌ Stack: ${e.stack}`);
    
    const msg = e?.issues ? "invalid payload" : (e?.message ?? "error");
    const code = e?.issues ? 400 : 500;
    
    if (e?.issues) {
      log(`❌ Erros de validação Zod: ${JSON.stringify(e.issues, null, 2)}`);
    }
    
    log("=== FIM da requisição (com erro) ===\n");
    return NextResponse.json({ 
      error: msg, 
      details: e?.issues || e?.message,
      debug: debugLogs 
    }, { status: code });
  }
}
