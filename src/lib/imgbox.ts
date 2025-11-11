/**
 * Converte URLs curtas do imgbox para URLs completas
 * Faz scraping da página para obter a URL real
 */
export async function resolveImgboxUrl(url: string): Promise<string> {
  // Se não é imgbox ou já está no formato correto, retorna como está
  if (!url.includes("imgbox.com")) return url;
  if (/\/(thumbs\d*|images\d*)\.imgbox\.com\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-zA-Z0-9]+_(t|o)\./i.test(url)) {
    return url;
  }

  try {
    // Extrai ID da URL
    const match = url.match(/imgbox\.com\/([a-zA-Z0-9]+)/);
    if (!match) return url;

    // Busca página do imgbox
    const response = await fetch(`https://imgbox.com/${match[1]}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) return url;

    const html = await response.text();

    // Busca URL da imagem no HTML
    const regex = /https:\/\/(thumbs\d*|images\d*)\.imgbox\.com\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-zA-Z0-9]+_(t|o)\.(jpg|png|jpeg|gif|webp)/i;
    const imageMatch = html.match(regex);

    return imageMatch ? imageMatch[0] : url;
  } catch {
    return url; // Em caso de erro, retorna URL original
  }
}

/**
 * Processa dados recursivamente convertendo URLs do imgbox
 */
export async function resolveImgboxInData(data: any): Promise<any> {
  if (!data) return data;

  if (Array.isArray(data)) {
    return Promise.all(data.map(resolveImgboxInData));
  }

  if (typeof data === "object") {
    const result: any = {};
    for (const key in data) {
      if (key === "imageUrl" && typeof data[key] === "string") {
        result[key] = await resolveImgboxUrl(data[key]);
      } else {
        result[key] = await resolveImgboxInData(data[key]);
      }
    }
    return result;
  }

  return data;
}
