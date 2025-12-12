"use client";

import React from "react";
import { Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

// Componente para título padronizado
// - branco (padrão) ou cor customizada
// - peso 800
// - tamanho fixo que diminui em mobile via media query
export default function Titulo({
  children,
  color = "#fff",
  verticalMarginMobile = 12,
  verticalMarginDesktop = 24,
}: {
  children: React.ReactNode;
  color?: string;
  verticalMarginMobile?: number;
  verticalMarginDesktop?: number;
}) {
  const isMobile = useMediaQuery("(max-width: 62em)", false, {
    getInitialValueInEffect: true,
  });

  // Tamanhos
  const size = isMobile ? 38 : 56;
  // Margem vertical
  const verticalMargin = isMobile
    ? verticalMarginMobile
    : verticalMarginDesktop;

  return (
    <Text
      style={{
        color: color,
        fontWeight: 800,
        fontSize: `${size}px`,
        textAlign: "center",
        margin: `${verticalMargin}px 0`,
        lineHeight: 1,
      }}
      // role/semantic
      component="h2"
    >
      {children}
    </Text>
  );
}
