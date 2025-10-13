"use client";

import React from "react";
import {
  BackgroundImage,
  Overlay,
  Container,
  Title,
  Text,
  Button,
  Box,
  Stack,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type HeroProps = {
  height?: number | string; // aceita px (número) ou unidade CSS (ex.: '70vh')
  title: string;
  subtitle?: string;
};

/* Hero com imagem de fundo + overlay escuro.
   - Responsividade via useMediaQuery
   - Mantém aparência e comportamento do original */
export default function Hero({
  height = "70vh",
  title,
  subtitle = "",
}: HeroProps) {
  const theme = useMantineTheme();

  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  // Normaliza altura
  const heightStyle = typeof height === "number" ? `${height}px` : height;

  // Reduz altura em 55% no mobile (xs)
  const heroHeight = isXs ? `calc(${heightStyle} * 0.55)` : heightStyle;

  // Larguras/espacamentos adaptativos
  const containerWidth = isSm ? "100%" : "75%";
  const titleWidth = isSm ? "100%" : "65%";
  const subtitleWidth = isSm ? "100%" : "90%";

  // Tamanhos adaptativos
  const titleFontSize = isXs ? rem(26) : "clamp(1.6rem, 4vw, 2.6rem)";
  const textSize: "sm" | "md" = isXs ? "sm" : "md";
  const buttonSize: "sm" | "md" = isXs ? "sm" : "md";

  return (
    <BackgroundImage
      id="hero-root"
      src="images/foto-do-time.jpg"
      style={{
        width: "100%",
        height: heroHeight,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: isXs ? 24 : 0,
        overflow: "hidden",
      }}
      aria-label="Seção principal com imagem de fundo"
    >
      <Overlay color="rgba(24, 24, 27, 0.5)" zIndex={1} aria-hidden />

      <Container
        fluid
        style={{ position: "relative", zIndex: 2, width: containerWidth }}
      >
        <Stack gap={12} style={{ color: "#fff" }}>
          <Box style={{ width: titleWidth, minWidth: 200 }}>
            <Title
              order={1}
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: titleFontSize,
                lineHeight: 1.05,
                whiteSpace: "pre-line",
              }}
            >
              {title}
            </Title>
          </Box>

          <Box style={{ width: subtitleWidth }}>
            <Text c="white" size={textSize}>
              {subtitle}
            </Text>
          </Box>

          <Box mt={8}>
            <Button
              component="a"
              href="#"
              variant="filled"
              size={buttonSize}
              radius="md"
              style={{ backgroundColor: "#52AFE1" }}
            >
              Learn More
            </Button>
          </Box>
        </Stack>
      </Container>
    </BackgroundImage>
  );
}
