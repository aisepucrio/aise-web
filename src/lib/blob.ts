import { put } from "@vercel/blob";

// Salva JSON no Vercel Blob (sobrescreve se já existir)
export async function saveJson(key: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data);
  await put(key, json, {
    access: "public", // Vercel Blob requer public; controle via token
    addRandomSuffix: false,
    contentType: "application/json",
    token: process.env.AISE_WEB_BLOB_READ_WRITE_TOKEN
,
  });
}
