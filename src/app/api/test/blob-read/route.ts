import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Rota de teste: lê o JSON de teste do Blob
export async function GET() {
  const logs: string[] = [];
  
  try {
    logs.push("📖 [TEST] Iniciando leitura do Blob");
    logs.push(`📖 [TEST] Token presente: ${!!process.env.BLOB_READ_WRITE_TOKEN}`);
    
    // Lista blobs com prefixo "test/"
    const { blobs } = await list({
      prefix: "test/",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    logs.push(`📖 [TEST] Total de blobs encontrados: ${blobs.length}`);
    
    if (blobs.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Nenhum blob de teste encontrado. Acesse /api/test/blob-write primeiro.",
        logs,
      });
    }
    
    // Procura pelo blob de teste
    const testBlob = blobs.find(b => b.pathname === "test/home-test.json");
    
    if (!testBlob) {
      logs.push(`❌ [TEST] Blob test/home-test.json não encontrado`);
      logs.push(`📋 [TEST] Blobs disponíveis: ${blobs.map(b => b.pathname).join(", ")}`);
      
      return NextResponse.json({
        success: false,
        message: "Blob de teste não encontrado",
        availableBlobs: blobs.map(b => ({ pathname: b.pathname, url: b.url })),
        logs,
      });
    }
    
    logs.push(`✅ [TEST] Blob encontrado: ${testBlob.url}`);
    
    // Faz fetch do conteúdo
    const response = await fetch(testBlob.url);
    
    if (!response.ok) {
      logs.push(`❌ [TEST] Falha ao buscar conteúdo: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    logs.push(`✅ [TEST] Dados lidos com sucesso!`);
    logs.push(`✅ [TEST] Conteúdo: ${JSON.stringify(data)}`);
    
    return NextResponse.json({
      success: true,
      message: "Dados lidos do Blob com sucesso!",
      data,
      blobInfo: {
        url: testBlob.url,
        pathname: testBlob.pathname,
        uploadedAt: testBlob.uploadedAt,
      },
      logs,
    });
  } catch (error: any) {
    logs.push(`❌ [TEST] ERRO: ${error.message}`);
    console.error("Erro ao ler do Blob:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      logs,
    }, { status: 500 });
  }
}
