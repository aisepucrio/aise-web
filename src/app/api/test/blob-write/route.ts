import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Rota de teste: escreve um JSON simples no Blob toda vez que é chamada
export async function GET() {
  const testData = {
    timestamp: new Date().toISOString(),
    message: "Teste de escrita no Blob",
    randomNumber: Math.floor(Math.random() * 1000),
  };

  const logs: string[] = [];
  
  try {
    logs.push("🧪 [TEST] Iniciando teste de escrita no Blob");
    logs.push(`🧪 [TEST] Dados a escrever: ${JSON.stringify(testData)}`);
    logs.push(`🧪 [TEST] Token presente: ${!!process.env.BLOB_READ_WRITE_TOKEN}`);
    logs.push(`🧪 [TEST] Token length: ${process.env.BLOB_READ_WRITE_TOKEN?.length || 0}`);
    logs.push(`🧪 [TEST] Token prefix: ${process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 30) || "VAZIO"}...`);
    
    const blob = await put("test/home-test.json", JSON.stringify(testData, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    logs.push(`✅ [TEST] Blob criado com sucesso!`);
    logs.push(`✅ [TEST] URL: ${blob.url}`);
    logs.push(`✅ [TEST] Pathname: ${blob.pathname}`);
    logs.push(`✅ [TEST] downloadUrl: ${blob.downloadUrl}`);
    
    return NextResponse.json({
      success: true,
      message: "Dados escritos no Blob com sucesso!",
      testData,
      blob: {
        url: blob.url,
        pathname: blob.pathname,
        downloadUrl: blob.downloadUrl,
      },
      logs,
    });
  } catch (error: any) {
    logs.push(`❌ [TEST] ERRO: ${error.message}`);
    logs.push(`❌ [TEST] Stack: ${error.stack}`);
    
    console.error("Erro ao escrever no Blob:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorDetails: error.toString(),
      logs,
      env: {
        hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
      },
    }, { status: 500 });
  }
}
