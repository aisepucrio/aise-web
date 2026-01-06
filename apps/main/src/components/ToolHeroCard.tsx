"use client";

import React from "react";
import {
  Box,
  Text,
  Group,
  Badge,
  Stack,
  Title,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import DurationInfo from "@/components/DurationInfo";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconCode, IconClock } from "@tabler/icons-react";
import componentTexts from "@/../public/json/components-content.json";

type Tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlightImageUrl: string;
  category: string;
  status: "active" | "pilot" | "archived" | string;
  duration: string;
  techStack?: string[];
  metrics?: Record<string, any>;
};

const MotionBox = motion(Box as any);

export default function ToolHeroCard({
  tool,
  index,
  ctaLabel,
}: {
  tool: Tool;
  index: number;
  ctaLabel?: string;
}) {
  // Router para navegação ao clicar no cartão
  const router = useRouter();

  // Responsividade: pega breakpoints do tema e detecta 'mobile'
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Determina se o índice é par (usado para inverter layout)
  const isEven = index % 2 === 0;
  const texts = componentTexts.toolHeroCard;

  return (
    // Container de entrada com animação (fade + slide)
    <MotionBox
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{ marginBottom: isMobile ? 40 : 80 }}
    >
      {/* Cartão principal: hover e clique navegam para a página do projeto */}
      <MotionBox
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={() => router.push(`/tools/${tool.id}`)}
        style={{
          cursor: "pointer",
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          background: "white",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
        }}
        role="button"
        aria-label={`Ver detalhes do projeto ${tool.name}`}
      >
        {/* Grid: coluna de imagem + coluna de conteúdo (inverte se isEven) */}
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isEven
              ? "1.2fr 1fr"
              : "1fr 1.2fr",
            minHeight: isMobile ? 500 : 450,
          }}
        >
          {/* Imagem do projeto */}
          <Box
            style={{
              position: "relative",
              order: isMobile ? 1 : isEven ? 1 : 2,
              overflow: "hidden",
              backgroundColor: "#f8fafc",
            }}
          >
            <Box
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                backgroundImage: `url(${tool.highlightImageUrl})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
              }}
            />
          </Box>

          <Stack
            gap="md"
            p={isMobile ? "xl" : 48}
            style={{
              order: isMobile ? 2 : isEven ? 2 : 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            {/* Número grande de fundo indicando a ordem do cartão */}
            <Text
              style={{
                position: "absolute",
                top: isMobile ? 20 : 32,
                right: isMobile ? 20 : 32,
                fontSize: isMobile ? "80px" : "120px",
                fontWeight: 900,
                color: "rgba(82, 175, 225, 0.08)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </Text>

            {/* Badge com categoria do projeto */}
            <Badge
              size="md"
              variant="light"
              leftSection={<IconCode size={12} />}
              style={{
                alignSelf: "flex-start",
                backgroundColor: "rgba(82, 175, 225, 0.1)",
                color: "var(--primary)",
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "0.7rem",
                letterSpacing: "0.5px",
              }}
            >
              {tool.category}
            </Badge>

            {/* Título do projeto */}
            <Title
              order={2}
              size={isMobile ? "h2" : "2.5rem"}
              style={{
                color: "var(--primary)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              {tool.name}
            </Title>

            {/* Tagline, frase curta */}
            <Text
              size={isMobile ? "md" : "lg"}
              fw={600}
              style={{ color: "#64748b", marginBottom: 12 }}
            >
              {tool.tagline}
            </Text>

            {/* Descrição breve do projeto */}
            <Text
              size={isMobile ? "sm" : "md"}
              style={{ color: "#475569", lineHeight: 1.7, marginBottom: 16 }}
            >
              {tool.description}
            </Text>

            {/* Tech stack: lista de tecnologias em badges (condicional) */}
            {Array.isArray(tool.techStack) && tool.techStack.length > 0 ? (
              <Group gap={6} mb="md">
                {tool.techStack.slice(0, isMobile ? 3 : 5).map((tech, idx) => (
                  <Badge
                    key={idx}
                    color={"var(--primary)"}
                    variant="light"
                    radius="sm"
                    size="md"
                  >
                    {tech}
                  </Badge>
                ))}
                {tool.techStack.length > (isMobile ? 3 : 5) && (
                  <Text size="xs" c="dimmed" fw={600}>
                    +{tool.techStack.length - (isMobile ? 3 : 5)}{" "}
                    {texts.moreText}
                  </Text>
                )}
              </Group>
            ) : null}

            {/* CTA: ver detalhes do projeto - alinhado à direita */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <DurationInfo
                icon={<IconClock size={14} color="var(--primary)" />}
                label={texts.durationLabel}
                value={tool.duration}
                size={isMobile ? "sm" : "md"}
              />

              <Group gap="xs" style={{ color: "var(--primary)" }}>
                <Text size="md" fw={700}>
                  {ctaLabel}
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
        </Box>
      </MotionBox>
    </MotionBox>
  );
}
