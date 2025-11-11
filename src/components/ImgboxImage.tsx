"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImgboxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

// Converte imgbox.com/ID para URL direta
function convertImgboxUrl(url: string): string {
  if (!url || !url.includes("imgbox.com/")) return url;
  if (url.includes("images2.imgbox.com")) return url;

  const match = url.match(/imgbox\.com\/([a-zA-Z0-9]+)/);
  if (!match) return url;

  const id = match[1];
  return `https://images2.imgbox.com/${id.slice(0, 2).toLowerCase()}/${id.slice(2, 4).toLowerCase()}/${id}_o.png`;
}

export default function ImgboxImage({ src, alt, width = 300, height = 300, fill, style, className }: ImgboxImageProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(false);
    setLoading(true);

    // Se não precisa de proxy, usa direto
    if (!src.includes("imgbox.com/") || src.includes("images2.imgbox.com")) {
      setUrl(src);
      setLoading(false);
      return;
    }

    // Tenta proxy primeiro, fallback para conversão direta
    fetch(`/api/imgbox-proxy?url=${encodeURIComponent(src)}`)
      .then((res) => res.json())
      .then((data) => setUrl(data.imageUrl || convertImgboxUrl(src)))
      .catch(() => setUrl(convertImgboxUrl(src)))
      .finally(() => setLoading(false));
  }, [src]);

  const placeholder = (text: string) => (
    <div
      style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", width: fill ? "100%" : width, height: fill ? "100%" : height }}
      className={className}
    >
      <span style={{ color: "#999", fontSize: 12 }}>{text}</span>
    </div>
  );

  if (loading) return placeholder("Carregando...");
  if (!url || error) return placeholder("Imagem indisponível");

  const imageProps = {
    src: url,
    alt,
    style: fill ? { objectFit: "cover" as const, ...style } : style,
    className,
    onError: () => setError(true),
    unoptimized: true,
  };

  return fill ? <Image {...imageProps} fill /> : <Image {...imageProps} width={width} height={height} />;
}
