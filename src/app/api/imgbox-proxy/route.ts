import { NextResponse } from "next/server";

/**
 * API Route que extrai a URL real da imagem do imgbox.com
 * Recebe: ?url=https://imgbox.com/ID
 * Retorna: { imageUrl: "https://thumbs2.imgbox.com/..." }
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imgboxUrl = searchParams.get("url");

    if (!imgboxUrl) {
      return NextResponse.json({ error: "URL não fornecida" }, { status: 400 });
    }

    // Extrai ID da URL
    const match = imgboxUrl.match(/imgbox\.com\/([a-zA-Z0-9]+)/);
    if (!match) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    // Busca página do imgbox
    const response = await fetch(`https://imgbox.com/${match[1]}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Erro ao buscar imagem" }, { status: 500 });
    }

    const html = await response.text();

    // Busca URLs no HTML - formato: https://images2.imgbox.com/XX/YY/ID_o.ext
    const regex = /https:\/\/(thumbs\d*|images\d*)\.imgbox\.com\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-zA-Z0-9]+_(t|o)\.(jpg|png|jpeg|gif|webp)/i;
    const imageMatch = html.match(regex);

    if (imageMatch) {
      return NextResponse.json({ imageUrl: imageMatch[0] });
    }

    return NextResponse.json({ error: "URL da imagem não encontrada" }, { status: 404 });
  } catch (error) {
    console.error("Erro no proxy:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
