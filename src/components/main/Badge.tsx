import React from "react";

export interface BadgeProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const paletteStyles: React.CSSProperties[] = [
  { backgroundColor: "rgba(82, 175, 225, 0.15)", color: "#2e65b3" },
  { backgroundColor: "rgba(56, 102, 194, 0.15)", color: "#2531a1" },
  { backgroundColor: "rgba(67, 199, 222, 0.15)", color: "#2980a6" },
];

function getAutoStyle(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % paletteStyles.length;
  return paletteStyles[index];
}

export default function Badge({
  text,
  className = "",
  style = {},
}: BadgeProps) {
  const autoStyle = getAutoStyle(text);

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full text-md font-medium whitespace-nowrap ${className}`}
      style={{
        ...autoStyle,
        ...style,
      }}
    >
      {text}
    </span>
  );
}
