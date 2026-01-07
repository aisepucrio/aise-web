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
  MantineProvider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { IconArrowRight, IconCode, IconClock } from "@tabler/icons-react";
import { DurationInfo } from "./DurationInfo";

// Types
export interface ToolHeroCardData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlightImageUrl: string;
  category: string;
  duration: string;
  techStack?: string[];
}

export interface ToolHeroCardProps {
  tool: ToolHeroCardData;
  index: number;
  onClick?: () => void;
  texts?: {
    moreText?: string;
    durationLabel?: string;
    ctaLabel?: string;
  };
}

const MotionBox = motion(Box as any);
const PRIMARY = "var(--primary)";

// Default texts for i18n
const defaultTexts = {
  moreText: "more",
  durationLabel: "Duration",
  ctaLabel: "View Tool Details",
};

export function ToolHeroCard({
  tool,
  index,
  onClick,
  texts = {},
}: ToolHeroCardProps) {
  const finalTexts = { ...defaultTexts, ...texts };
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isEven = index % 2 === 0;
  const maxTechStack = isMobile ? 3 : 5;

  return (
    <MantineProvider>
      {/* Entry animation container */}
      <MotionBox
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10px" }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        style={{ marginBottom: isMobile ? 40 : 80 }}
      >
        {/* Main card with hover effect and click handler */}
        <MotionBox
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={onClick}
          style={{
            cursor: onClick ? "pointer" : "default",
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            background: "white",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
          }}
          role={onClick ? "button" : undefined}
          aria-label={onClick ? `View ${tool.name} details` : undefined}
        >
          {/* Grid layout: image column + content column (alternates based on index) */}
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
            {/* Tool image */}
            <Box
              style={{
                position: "relative",
                order: isMobile ? 1 : isEven ? 1 : 2,
                overflow: "hidden",
                backgroundColor: "#f8fafc",
                backgroundImage: `url(${tool.highlightImageUrl})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
              }}
            />

            {/* Content section */}
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
              {/* Large background number indicating card order */}
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

              {/* Category badge */}
              <Badge
                size="md"
                variant="light"
                leftSection={<IconCode size={12} />}
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "rgba(82, 175, 225, 0.1)",
                  color: PRIMARY,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  letterSpacing: "0.5px",
                }}
              >
                {tool.category}
              </Badge>

              {/* Tool title */}
              <Title
                order={2}
                size={isMobile ? "h2" : "2.5rem"}
                style={{
                  color: PRIMARY,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginBottom: 8,
                }}
              >
                {tool.name}
              </Title>

              {/* Short tagline */}
              <Text
                size={isMobile ? "md" : "lg"}
                fw={600}
                style={{ color: "#64748b", marginBottom: 12 }}
              >
                {tool.tagline}
              </Text>

              {/* Description */}
              <Text
                size={isMobile ? "sm" : "md"}
                style={{ color: "#475569", lineHeight: 1.7, marginBottom: 16 }}
              >
                {tool.description}
              </Text>

              {/* Tech stack badges */}
              {Array.isArray(tool.techStack) && tool.techStack.length > 0 && (
                <Group gap={6} mb="md">
                  {tool.techStack.slice(0, maxTechStack).map((tech, idx) => (
                    <Badge
                      key={idx}
                      color={PRIMARY}
                      variant="light"
                      radius="sm"
                      size="md"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {tool.techStack.length > maxTechStack && (
                    <Text size="xs" c="dimmed" fw={600}>
                      +{tool.techStack.length - maxTechStack}{" "}
                      {finalTexts.moreText}
                    </Text>
                  )}
                </Group>
              )}

              {/* Footer: duration and CTA */}
              <Box style={{ display: "flex", justifyContent: "space-between" }}>
                <DurationInfo
                  icon={<IconClock size={14} color={PRIMARY} />}
                  label={finalTexts.durationLabel}
                  value={tool.duration}
                  size={isMobile ? "sm" : "md"}
                />

                <Group gap="xs" style={{ color: PRIMARY }}>
                  <Text size="md" fw={700}>
                    {finalTexts.ctaLabel}
                  </Text>
                  <ThemeIcon
                    size={32}
                    radius="xl"
                    variant="light"
                    color={PRIMARY}
                  >
                    <IconArrowRight size={18} />
                  </ThemeIcon>
                </Group>
              </Box>
            </Stack>
          </Box>
        </MotionBox>
      </MotionBox>
    </MantineProvider>
  );
}
