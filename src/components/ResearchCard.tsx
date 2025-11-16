"use client";

import React, { KeyboardEvent } from "react";
import {
  Box,
  Text,
  Stack,
  Title,
  Group,
  ThemeIcon,
  Card,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconClock } from "@tabler/icons-react";
import DurationInfo from "@/components/DurationInfo";
import componentTexts from "@/../public/json/components-content.json";

/* ===========================
   Tipos
   =========================== */
type Research = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  highlightImageUrl: string;
  duration: string;
  projects?: any[];
  team_relationships?: any[];
  publication_relationships?: string[];
  tools_relationships?: string[];
};

/* ===========================
   Utilitário de animação
   =========================== */
const MotionBox = motion(Box as any);
const PRIMARY = "var(--primary)";

/* ===========================
   Subcomponente: StatPill
   - Ícone + número
   =========================== */
// (Removed StatPill — simplified card layout to match ToolHeroCard)

/* ===========================
   Componente Principal
   =========================== */
export default function ResearchCard({
  research,
  index,
}: {
  research: Research;
  index: number;
}) {
  const router = useRouter();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const texts = componentTexts.researchCard;

  /* Acessibilidade: Enter/Espaço navegam */
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/researches/${research.id}`);
    }
  }

  // (removed stats counts — simplified layout)

  return (
    <MotionBox
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Card
          radius="xl"
          shadow={isMobile ? "xs" : "sm"}
          role="link"
          tabIndex={0}
          aria-label={`Ver detalhes da linha de pesquisa ${research.name}`}
          onClick={() => router.push(`/researches/${research.id}`)}
          onKeyDown={handleKeyDown}
          style={{
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            isolation: "isolate",
          }}
        >
          {/* ===========================
              Imagem de capa + overlay
              =========================== */}
          <Card.Section>
            <Box
              style={{
                position: "relative",
                height: isMobile ? 200 : 360,
                overflow: "hidden",
                backgroundColor: "#f1f5f9",
              }}
            >
              {/* Imagem de fundo */}
              <Box
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${research.highlightImageUrl})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
              {/* Gradiente sutil inferior */}
              <Box
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.15) 100%)",
                }}
              />

              {/* Hint de clique (só mobile) */}
              {isMobile && (
                <Box
                  style={{
                    position: "absolute",
                    right: 12,
                    bottom: 12,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "color-mix(in srgb, var(--primary) 16%, white)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    pointerEvents: "none",
                  }}
                >
                  <Text size="xs" fw={700} style={{ color: PRIMARY }}>
                    {texts.openText}
                  </Text>
                  <IconArrowRight size={16} color={PRIMARY} />
                </Box>
              )}
            </Box>
          </Card.Section>

          {/* ===========================
              Conteúdo
              =========================== */}
          <Stack
            gap="md"
            p={isMobile ? "lg" : "xl"}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            {/* Título */}
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Title
                order={3}
                size={isMobile ? "1.25rem" : "1.5rem"}
                style={{
                  color: PRIMARY,
                  fontWeight: 800,
                  lineHeight: 1.2,
                  flex: 1,
                }}
              >
                {research.name}
              </Title>
            </Group>

            {/* Descrição curta */}
            <Text
              size={isMobile ? "sm" : "md"}
              style={{ color: "#64748b", lineHeight: 1.6, flex: 1 }}
            >
              {research.shortDescription}
            </Text>

            {/* Bottom row: duration (left) + CTA (right) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Box style={{ flexShrink: 0 }}>
                <DurationInfo
                  icon={<IconClock size={14} color={PRIMARY} />}
                  label={texts.durationLabel}
                  value={research.duration}
                  size={isMobile ? "sm" : "md"}
                />
              </Box>

              <Group gap="xs" style={{ color: "var(--primary)" }}>
                <Text size="md" fw={700} style={{ color: PRIMARY }}>
                  {texts.viewResearchText}
                </Text>
                <ThemeIcon
                  size={32}
                  radius="xl"
                  variant="light"
                  color="var(--primary)"
                >
                  <IconArrowRight size={18} />
                </ThemeIcon>
              </Group>
            </div>
          </Stack>

          {/* No overlay on hover; CTA moved to bottom of card */}
        </Card>
      </motion.div>
    </MotionBox>
  );
}
