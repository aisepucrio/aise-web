"use client";

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
  const imageProps = {
    src,
    alt,
    style: fill ? { objectFit: "cover" as const, ...style } : style,
    className,
    unoptimized: true,
  };

  return fill ? <Image {...imageProps} fill /> : <Image {...imageProps} width={width} height={height} />;
}
