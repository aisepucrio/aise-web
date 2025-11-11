// Converte URL imgbox curta (https://imgbox.com/ID) para URL real da imagem
export function normalizeImgboxUrl(url: string): string {
  if (!url) return url;
  
  // Se já é uma URL completa de imagem, retorna como está
  if (url.includes("images2.imgbox.com") || url.includes("thumbs2.imgbox.com")) {
    return url;
  }
  
  // Extrai ID de URLs tipo https://imgbox.com/ID
  const match = url.match(/imgbox\.com\/([a-zA-Z0-9]+)/);
  if (match && match[1]) {
    const imageId = match[1];
    // Converte para URL real da imagem hospedada
    return `https://images2.imgbox.com/${imageId}/o.png`;
  }
  
  return url;
}

// Processa objeto/array recursivamente normalizando imageUrl/imgUrl
export function normalizeImgboxInData(data: any): any {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(normalizeImgboxInData);
  }
  
  if (typeof data === "object") {
    const result: any = {};
    for (const key in data) {
      if (key === "imageUrl" || key === "imgUrl") {
        result[key] = normalizeImgboxUrl(data[key]);
      } else {
        result[key] = normalizeImgboxInData(data[key]);
      }
    }
    return result;
  }
  
  return data;
}
