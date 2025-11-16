"use client";

import React, { useState, KeyboardEvent } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  IconFlask,
  IconArrowRight,
  IconUsers,
  IconFileText,
  IconClock,
  IconTool,
} from "@tabler/icons-react";
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
function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label?: string;
}) {
  return (
    <Group gap={6}>
      <ThemeIcon size="sm" variant="light" radius="xl">
        {icon}
      </ThemeIcon>
      <Text size="xs" fw={600} c="dimmed">
        {label ? `${value} ${label}` : value}
      </Text>
    </Group>
  );
}

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
  const [isHovered, setIsHovered] = useState(false);
  const texts = componentTexts.researchCard;

  /* Acessibilidade: Enter/Espaço navegam */
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/researches/${research.id}`);
    }
  }

  // Calcula totais para os stats
  const projectsCount = research.projects?.length || 0;
  const publicationsCount = research.publication_relationships?.length || 0;
  const membersCount = research.team_relationships?.length || 0;
  const toolsCount = research.tools_relationships?.length || 0;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        whileHover={{ scale: 1.015, y: -6 }}
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
            {/* Título + Duração */}
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

              {!isMobile && (
                <Box style={{ flexShrink: 0 }}>
                  <DurationInfo
                    icon={<IconClock size={14} color={PRIMARY} />}
                    label={texts.durationLabel}
                    value={research.duration}
                    size="sm"
                  />
                </Box>
              )}
            </Group>

            {/* Descrição curta */}
            <Text
              size={isMobile ? "sm" : "md"}
              style={{ color: "#64748b", lineHeight: 1.6, flex: 1 }}
            >
              {research.shortDescription}
            </Text>

            {/* Stats */}
            <Group gap={isMobile ? "sm" : "md"} mt="auto" pt="xs" wrap="wrap">
              {projectsCount > 0 && (
                <StatPill
                  icon={<IconFlask size={14} color={PRIMARY} />}
                  value={projectsCount}
                  label={
                    projectsCount === 1
                      ? texts.stats.project
                      : texts.stats.projects
                  }
                />
              )}
              {membersCount > 0 && (
                <StatPill
                  icon={<IconUsers size={14} color={PRIMARY} />}
                  value={membersCount}
                  label={
                    membersCount === 1
                      ? texts.stats.member
                      : texts.stats.members
                  }
                />
              )}
              {publicationsCount > 0 && (
                <StatPill
                  icon={<IconFileText size={14} color={PRIMARY} />}
                  value={publicationsCount}
                  label={
                    publicationsCount === 1
                      ? texts.stats.publication
                      : texts.stats.publications
                  }
                />
              )}
              {toolsCount > 0 && (
                <StatPill
                  icon={<IconTool size={14} color={PRIMARY} />}
                  value={toolsCount}
                  label={
                    toolsCount === 1 ? texts.stats.tool : texts.stats.tools
                  }
                />
              )}
            </Group>

            {/* Duração mobile */}
            {isMobile && (
              <Box mt="xs">
                <DurationInfo
                  icon={<IconClock size={14} color={PRIMARY} />}
                  label={texts.durationLabel}
                  value={research.duration}
                  size="sm"
                />
              </Box>
            )}
          </Stack>

          {/* ===========================
              Overlay de hover (DESKTOP apenas)
              =========================== */}
          <AnimatePresence>
            {!isMobile && isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--primary) 96%, transparent), color-mix(in srgb, var(--primary) 92%, transparent))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              >
                <Group gap="md">
                  <Text
                    size="xl"
                    fw={800}
                    style={{ color: "white", letterSpacing: 0.5 }}
                  >
                    {texts.viewResearchText}
                  </Text>
                  <ThemeIcon
                    size="xl"
                    radius="xl"
                    color="white"
                    variant="filled"
                  >
                    <IconArrowRight size={24} stroke={2.5} color={PRIMARY} />
                  </ThemeIcon>
                </Group>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </MotionBox>
  );
}
