"use client";

import React from "react";
import { Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

// Componente para título padronizado
// - branco
// - peso 800
// - tamanho fixo que diminui em mobile via media query
export default function Titulo({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 62em)", false, {
    getInitialValueInEffect: true,
  });

  // Tamanhos
  const size = isMobile ? 38 : 56;
  // Margem vertical
  const verticalMargin = isMobile ? 36 : 48;

  return (
    <Text
      style={{
        color: "#fff",
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
