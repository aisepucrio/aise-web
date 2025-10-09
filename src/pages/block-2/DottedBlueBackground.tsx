"use client";

import React from "react";
import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type DottedBlueBackgroundProps = {
  height?: React.CSSProperties["height"]; // Altura (ex.: '60vh' ou 400)
  children?: React.ReactNode; // Conteúdo opcional dentro do fundo
};

export default function DottedBlueBackground({
  height = "60vh",
  children,
}: DottedBlueBackgroundProps) {
  // Mobile: breakpoint padrão do Mantine (~md = 62em)
  const isMobile = useMediaQuery("(max-width: 62em)", false, {
    getInitialValueInEffect: true,
  });

  // Overlap menor no mobile
  const overlap = isMobile ? 50 : 100;
  const fadeSize = isMobile ? 50 : 100;
  // Padrão de bolinhas (radial-gradient repetido)
  const dot =
    "radial-gradient(rgba(255,255,255,0.40) 1.8px, rgba(255,255,255,0) 1.9px)";

  // Normaliza overlap para valor negativo (puxar para cima)
  const negative = (v: number | string) =>
    typeof v === "number" ? -v : v.trim().startsWith("-") ? v : `-${v}`;

  return (
    <Box
      component="section"
      // Layout centralizado + fundo azul com padrão de pontos
      style={{
        width: "100%",
        height,
        marginTop: negative(overlap),
        display: "flex",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "#5b8fadff",
        backgroundImage: dot,
        backgroundSize: "26px 26px",
        backgroundRepeat: "repeat",
        zIndex: 2,
        // Fade superior transparente para mesclar com a imagem anterior
        WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,1) ${fadeSize}px)`,
        maskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,1) ${fadeSize}px)`,
      }}
    >
      <Box style={{ marginTop: "8rem" }}>{children}</Box>
    </Box>
  );
}
