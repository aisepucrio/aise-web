/**
 * Utilitário centralizado para conversão de URLs do imgbox.com
 * Usa a API proxy local que faz scraping do HTML
 */

/**
 * Converte uma única URL do imgbox usando a API proxy
 */
export async function convertImgboxUrl(url: string): Promise<string> {
  if (!url || !url.includes("imgbox.com/")) return url;
  if (url.includes("images2.imgbox.com") || url.includes("thumbs")) return url;

  try {
    const response = await fetch(`/api/imgbox-proxy?url=${encodeURIComponent(url)}`);
    if (!response.ok) return url;
    
    const data = await response.json();
    return data.originalUrl || data.imageUrl || url;
  } catch {
    return url;
  }
}

/**
 * Converte recursivamente todas as URLs do imgbox em um objeto/array
 */
export async function convertImgboxUrls(data: any): Promise<any> {
  if (typeof data === "string") {
    return data.includes("imgbox.com/") && !data.includes("images2.imgbox.com") && !data.includes("thumbs")
      ? await convertImgboxUrl(data)
      : data;
  }
  
  if (Array.isArray(data)) {
    return await Promise.all(data.map(convertImgboxUrls));
  }
  
  if (data && typeof data === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = await convertImgboxUrls(value);
    }
    return result;
  }
  
  return data;
}
