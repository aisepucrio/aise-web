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

export default function ImgboxImage({ src, alt, width = 300, height = 300, fill, style, className }: ImgboxImageProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(false);
    setLoading(true);

    // Se não é imgbox ou já está resolvido, usa direto
    const isShortUrl = src.includes("imgbox.com/") && !src.includes(".imgbox.com/");
    
    if (!isShortUrl) {
      setUrl(src);
      setLoading(false);
      return;
    }

    // Resolve URL curta via proxy
    fetch(`/api/imgbox-proxy?url=${encodeURIComponent(src)}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => data.imageUrl ? setUrl(data.imageUrl) : Promise.reject())
      .catch(() => setError(true))
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
