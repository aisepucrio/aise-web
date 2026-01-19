"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BackgroundImage,
  Overlay,
  Container,
  Title,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import homeContent from "@/../public/json/home.json";

/* Hero com imagem de fundo + overlay escuro.
   - Responsividade via useMediaQuery
   - Mantém aparência e comportamento do original */
export default function Hero() {
  const theme = useMantineTheme();

  const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  // Normaliza altura
  const heightStyle = isSm ? "135vh" : "100vh";

  // Reduz altura em 55% no mobile (xs)
  const heroHeight = isXs ? `calc(${heightStyle} * 0.55)` : heightStyle;

  // Larguras/espacamentos adaptativos
  const containerWidth = isSm ? "100%" : "75%";
  const titleWidth = isSm ? "100%" : "65%";
  const subtitleWidth = isSm ? "100%" : "90%";

  // Tamanhos adaptativos
  const titleFontSize = isXs ? rem(26) : "clamp(1.6rem, 4vw, 2.6rem)";
  const textSize: "md" | "lg" = isXs ? "md" : "lg";

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, when: "beforeChildren" },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  } as const;

  return (
    <BackgroundImage
      id="hero-root"
      src={homeContent.hero.imgsrc}
      style={{
        width: "100%",
        height: heroHeight,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: isXs ? 24 : 0,
        overflow: "hidden",

        /* ===== EDIT: refino de fundo (mais “cinema”) ===== */
        backgroundPosition: "center",
        backgroundSize: "cover",
        /* ===== EDIT END ===== */
      }}
      aria-label="Seção principal com imagem de fundo"
    >
      {/* ===== EDIT: overlay em gradiente (profundidade/vinheta) ===== */}
      <Overlay
        zIndex={1}
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.78) 0%, rgba(10,10,12,0.48) 40%, rgba(10,10,12,0.86) 100%)",
        }}
      />
      {/* ===== EDIT END ===== */}

      {/* ===== EDIT: glow radial sutil (dá “vida” sem mudar conteúdo) ===== */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(900px 520px at 28% 42%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.00) 60%)",
        }}
      />
      {/* ===== EDIT END ===== */}

      {/* ===== EDIT: shapes decorativas (bem suaves) ===== */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: isXs ? 260 : 420,
            height: isXs ? 260 : 420,
            borderRadius: 9999,
            left: isXs ? "-90px" : "-120px",
            top: isXs ? "-90px" : "-140px",
            background:
              "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.35), rgba(99,102,241,0.00) 70%)",
            filter: "blur(6px)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          style={{
            position: "absolute",
            width: isXs ? 240 : 360,
            height: isXs ? 240 : 360,
            borderRadius: 9999,
            right: isXs ? "-120px" : "-140px",
            bottom: isXs ? "-120px" : "-160px",
            background:
              "radial-gradient(circle at 65% 40%, rgba(34,211,238,0.26), rgba(34,211,238,0.00) 68%)",
            filter: "blur(8px)",
          }}
        />
      </div>
      {/* ===== EDIT END ===== */}

      <Container
        fluid
        style={{
          position: "relative",
          zIndex: 2,
          width: containerWidth,

          /* ===== EDIT: mais respiro e alinhamento consistente ===== */
          paddingLeft: isXs ? 16 : undefined,
          paddingRight: isXs ? 16 : undefined,
          /* ===== EDIT END ===== */
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* ===== EDIT: “glass card” por trás do conteúdo (foco + coesão) ===== */}
          <div
            style={{
              width: isSm ? "100%" : "fit-content",
              maxWidth: isSm ? "100%" : 900,
              padding: isXs ? "18px 16px" : "26px 26px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.90)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow:
                "0 18px 44px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)",
            }}
          >
            {/* ===== EDIT END ===== */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                color: "#fff",
              }}
            >
              {/* ===== EDIT: barra de acento (identidade visual sem mudar texto) ===== */}
              <motion.div variants={itemVariants}>
                <div
                  aria-hidden
                  style={{
                    width: isXs ? 44 : 56,
                    height: 6,
                    borderRadius: 999,
                    background: "var(--primary)",
                    marginBottom: 10,
                    boxShadow: "0 10px 24px rgba(34,211,238,0.14)",
                  }}
                />
              </motion.div>
              {/* ===== EDIT END ===== */}

              <motion.div
                variants={itemVariants}
                style={{ width: titleWidth, minWidth: 200 }}
              >
                <Title
                  order={1}
                  style={{
                    color: "var(--primary)",
                    fontWeight: 850,

                    /* ===== EDIT: tipografia mais “tight” e elegante ===== */
                    letterSpacing: "-0.02em",
                    textWrap: "balance" as any,
                    /* ===== EDIT END ===== */

                    fontSize: titleFontSize,
                    lineHeight: 1.05,
                    whiteSpace: "pre-line",
                  }}
                >
                  {homeContent.hero.title}
                </Title>
              </motion.div>

              <motion.div
                variants={itemVariants}
                style={{ width: subtitleWidth }}
              >
                <Text
                  size={textSize}
                  style={{
                    /* ===== EDIT: legibilidade/ritmo ===== */
                    opacity: 0.92,
                    lineHeight: 1.55,
                    color: "var(--primary)",
                    maxWidth: isSm ? "100%" : 720,
                    /* ===== EDIT END ===== */
                  }}
                >
                  {homeContent.hero.subtitle}
                </Text>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </BackgroundImage>
  );
}
