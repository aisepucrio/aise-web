import { put, list } from "@vercel/blob";

export async function saveJson(key: string, data: unknown) {
  const blob = await put(key, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    allowOverwrite: true,
  });
  
  return blob;
}

export async function readJson(key: string): Promise<any | null> {
  try {
    const { blobs } = await list({
      prefix: key,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const blob = blobs.find((b) => b.pathname === key);
    if (!blob) return null;

    const response = await fetch(blob.url);
    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error(`[readJson] Erro:`, error);
    return null;
  }
}
