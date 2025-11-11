import { put, head, list } from "@vercel/blob";

// Salva JSON no Vercel Blob (sobrescreve se já existir)
export async function saveJson(key: string, data: unknown): Promise<any> {
  console.log("💾 [saveJson] Iniciando - key:", key);
  console.log("💾 [saveJson] Tamanho dos dados:", JSON.stringify(data).length, "bytes");
  console.log("💾 [saveJson] Token presente:", !!process.env.BLOB_READ_WRITE_TOKEN);
  console.log("💾 [saveJson] Token primeiros chars:", process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 20) + "...");
  
  const json = JSON.stringify(data);
  
  try {
    // Retorna o resultado do put para diagnóstico (pode conter informações do objeto criado)
    const result = await put(key, json, {
      access: "public", // Vercel Blob requer public; controle via token
      addRandomSuffix: false,
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    console.log("✅ [saveJson] PUT bem-sucedido!");
    console.log("✅ [saveJson] URL do blob:", result.url);
    console.log("✅ [saveJson] Pathname:", result.pathname);
    console.log("✅ [saveJson] Resultado completo:", JSON.stringify(result, null, 2));
    
    return result;
  } catch (error: any) {
    console.error("❌ [saveJson] ERRO ao fazer PUT no Blob:", error);
    console.error("❌ [saveJson] Error message:", error.message);
    console.error("❌ [saveJson] Error stack:", error.stack);
    throw error;
  }
}

// Lê JSON do Vercel Blob; retorna null se não existir
export async function readJson(key: string): Promise<any | null> {
  try {
    // Lista blobs com o prefixo exato
    const { blobs } = await list({
      prefix: key,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Encontra blob exato (sem sufixo aleatório)
    const blob = blobs.find((b) => b.pathname === key);
    if (!blob) return null;

    // Faz fetch da URL pública do blob
    const response = await fetch(blob.url);
    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error(`Erro ao ler ${key} do Blob:`, error);
    return null;
  }
}
