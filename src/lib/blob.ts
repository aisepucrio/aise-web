import { put, head, list } from "@vercel/blob";

// Salva JSON no Vercel Blob (sobrescreve se já existir)
export async function saveJson(key: string, data: unknown): Promise<any> {
  const json = JSON.stringify(data);
  // Retorna o resultado do put para diagnóstico (pode conter informações do objeto criado)
  return await put(key, json, {
    access: "public", // Vercel Blob requer public; controle via token
    addRandomSuffix: false,
    contentType: "application/json",
    token: process.env.AISE_WEB_BLOB_READ_WRITE_TOKEN,
  });
}

// Lê JSON do Vercel Blob; retorna null se não existir
export async function readJson(key: string): Promise<any | null> {
  try {
    // Lista blobs com o prefixo exato
    const { blobs } = await list({
      prefix: key,
      token: process.env.AISE_WEB_BLOB_READ_WRITE_TOKEN,
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
