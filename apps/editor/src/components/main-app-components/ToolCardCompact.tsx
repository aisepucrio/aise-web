"use client";

import React, { useState, KeyboardEvent } from "react";
import {
  Box,
  Text,
  Badge,
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
  IconCode,
  IconArrowRight,
  IconUsers,
  IconStack2,
} from "@tabler/icons-react";
import ImgboxImage from "../ImgboxImage";

/* ===========================
   Tipos
   =========================== */
type tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  category: string;
  status: "Active" | "Pilot" | "Archived" | string;
  techStack?: string[];
  team?: any[];
};

/* ===========================
   Utilitário de animação
   =========================== */
const MotionBox = motion(Box as any);
const PRIMARY = "var(--primary)";

/* ===========================
   Subcomponente: StatPill
   - Ícone + número (techs / membros)
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
      <ThemeIcon size="sm" variant="light" radius="lg">
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
export default function toolCardCompact({
  tool,
  index,
}: {
  tool: tool;
  index: number;
}) {
  const router = useRouter();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [isHovered, setIsHovered] = useState(false);

  /* Acessibilidade: Enter/Espaço navegam */
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/tools/${tool.id}`);
    }
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        /* Desktop: mantém animação original do hover */
        whileHover={{ scale: 1.015, y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Card
          withBorder
          radius="lg"
          shadow={isMobile ? "xs" : "sm"}
          role="link"
          tabIndex={0}
          aria-label={`Ver detalhes do projeto ${tool.name}`}
          onClick={() => router.push(`/tools/${tool.id}`)}
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
            borderColor: "rgba(226, 232, 240, 0.8)",
            isolation: "isolate", // garante overlay contido no card
          }}
        >
          {/* ===========================
              Imagem de capa + overlay
              =========================== */}
          <Card.Section>
            <Box
              style={{
                position: "relative",
                height: isMobile ? 200 : 260,
                overflow: "hidden",
                backgroundColor: "#f1f5f9",
              }}
            >
              {/* Imagem de fundo com ImgboxImage */}
              <ImgboxImage
                src={tool.imageUrl}
                alt={tool.name}
                fill
                style={{ objectFit: "cover" }}
              />
              
              {/* Gradiente sutil inferior */}
              <Box
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.15) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Badge de categoria */}
              <Badge
                size="sm"
                variant="filled"
                leftSection={<IconCode size={12} />}
                styles={{
                  root: {
                    position: "absolute",
                    top: 16,
                    left: 16,
                    backgroundColor: PRIMARY,
                    color: "white",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.65rem",
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    backdropFilter: "blur(8px)",
                  },
                }}
              >
                {tool.category}
              </Badge>

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
                    Abrir
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
            {/* Título + stats (desktop) */}
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
                {tool.name}
              </Title>

              {!isMobile && (
                <Group gap="md" style={{ flexShrink: 0 }}>
                  {tool.techStack?.length ? (
                    <StatPill
                      icon={<IconStack2 size={14} color={PRIMARY} />}
                      value={tool.techStack.length}
                    />
                  ) : null}
                  {tool.team?.length ? (
                    <StatPill
                      icon={<IconUsers size={14} color={PRIMARY} />}
                      value={tool.team.length}
                    />
                  ) : null}
                </Group>
              )}
            </Group>

            {/* Tagline */}
            <Text
              size={isMobile ? "sm" : "md"}
              fw={600}
              style={{ color: "#334155", lineHeight: 1.4 }}
            >
              {tool.tagline}
            </Text>

            {/* Descrição */}
            <Text size="sm" style={{ color: "#64748b", lineHeight: 1.6, flex: 1 }}>
              {tool.description}
            </Text>

            {/* Stats mobile com rótulos */}
            {isMobile && (
              <Group gap="lg" mt="auto" pt="xs">
                {tool.techStack?.length ? (
                  <StatPill
                    icon={<IconStack2 size={14} color={PRIMARY} />}
                    value={tool.techStack.length}
                    label="techs"
                  />
                ) : null}
                {tool.team?.length ? (
                  <StatPill
                    icon={<IconUsers size={14} color={PRIMARY} />}
                    value={tool.team.length}
                    label="members"
                  />
                ) : null}
              </Group>
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
                  <Text size="xl" fw={800} style={{ color: "white", letterSpacing: 0.5 }}>
                    View tool
                  </Text>
                  <ThemeIcon size="xl" radius="lg" color="white" variant="filled">
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
