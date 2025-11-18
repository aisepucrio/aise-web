"use client";

import React, { useMemo } from "react";
import { Card, Text, Title, useMantineTheme } from "@mantine/core";

type InfoCardProps = {
  title: string;
  description: string;
  /** Fator de escala tipográfica (1 = base). Mantido como 'multiplyer' para compatibilidade. */
  multiplyer?: number;
  /** Opção para exibir um ícone SVG antes do título. Caminho relativo a /public, ex: '/icons/goal.svg' */
  iconSrc?: string;
  /** Texto alternativo para o ícone (acessibilidade) */
  iconAlt?: string;
};

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  multiplyer = 1,
  iconSrc,
  iconAlt = "",
}) => {
  const theme = useMantineTheme();

  // Cálculo de tamanhos (tipografia escalável em rem)
  const { titleSizeRem, textSizeRem } = useMemo(() => {
    const baseTitle = 1.8; // rem
    const baseText = 1.2; // rem
    const m = Number.isFinite(multiplyer) && multiplyer > 0 ? multiplyer : 1;
    return {
      titleSizeRem: `${baseTitle * m}rem`,
      textSizeRem: `${Math.max(0.85, baseText * m)}rem`,
    };
  }, [multiplyer]);

  return (
    <Card
      bg="white"
      role="region"
      style={{
        padding: "2rem",
        borderRadius: 24,
        // Sombra ligeiramente menor e deslocada um pouco para cima
        boxShadow: "0 0px 12px rgba(2, 6, 23, 0.06)",
      }}
      aria-label={title}
    >
      {/* Ícone opcional + título;  escalado pelo multiplyer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "var(--mantine-spacing-xs)",
        }}
      >
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={iconAlt}
            aria-hidden={iconAlt === ""}
            style={{
              width: `calc(${titleSizeRem} * 1.5)`,
              height: `calc(${titleSizeRem} * 1.5)`,
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : null}

        <Title
          order={2}
          style={{ fontWeight: 800, fontSize: titleSizeRem, lineHeight: 1.05 }}
        >
          {title}
        </Title>
      </div>

      {/* Texto com boa leitura e preservando quebras do conteúdo */}
      <Text
        component="p"
        style={{
          fontSize: textSizeRem,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          textAlign: "justify",
        }}
        c={theme.colors.gray ? "gray.7" : undefined}
      >
        {description}
      </Text>
    </Card>
  );
};

export default InfoCard;
