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
  MantineProvider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconFlask,
  IconArrowRight,
  IconUsers,
  IconFileText,
} from "@tabler/icons-react";

// Types
export interface ResearchCardCompactData {
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
}

export interface ResearchCardCompactProps {
  research: ResearchCardCompactData;
  index: number;
  onClick?: () => void;
}

const MotionBox = motion(Box as any);
const PRIMARY = "var(--primary)";

// Stats pill component - displays icon with count
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

// Compact research card with image, info, and hover overlay
export function ResearchCardCompact({
  research,
  index,
  onClick,
}: ResearchCardCompactProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isHovered, setIsHovered] = useState(false);

  const teamCount = research.team_relationships?.length || 0;
  const publicationsCount = research.publication_relationships?.length || 0;

  // Keyboard navigation support
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <MantineProvider>
      {/* Entry animation container */}
      <MotionBox
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {/* Card hover animation */}
        <motion.div
          whileHover={{ scale: 1.015, y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Card
            withBorder
            radius="xl"
            shadow={isMobile ? "xs" : "sm"}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={onClick ? `View ${research.name} details` : undefined}
            onClick={onClick}
            onKeyDown={onClick ? handleKeyDown : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              cursor: onClick ? "pointer" : "default",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              borderColor: "rgba(226, 232, 240, 0.8)",
              isolation: "isolate",
              minHeight: "525px",
            }}
          >
            {/* Cover image section */}
            <Card.Section>
              <Box
                style={{
                  position: "relative",
                  height: isMobile ? 200 : 260,
                  overflow: "hidden",
                  backgroundColor: "#f1f5f9",
                }}
              >
                {/* Background image */}
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

                {/* Bottom gradient overlay */}
                <Box
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.15) 100%)",
                  }}
                />

                {/* Mobile tap hint */}
                {isMobile && onClick && (
                  <Box
                    style={{
                      position: "absolute",
                      right: 12,
                      bottom: 12,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background:
                        "color-mix(in srgb, var(--primary) 16%, white)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      pointerEvents: "none",
                    }}
                  >
                    <Text size="xs" fw={700} style={{ color: PRIMARY }}>
                      Open
                    </Text>
                    <IconArrowRight size={16} color={PRIMARY} />
                  </Box>
                )}
              </Box>
            </Card.Section>

            {/* Content section */}
            <Stack
              gap="md"
              p={isMobile ? "lg" : "xl"}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              {/* Title and stats row */}
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

                {/* Desktop stats */}
                {!isMobile && (
                  <Group gap="md" style={{ flexShrink: 0 }}>
                    {teamCount > 0 && (
                      <StatPill
                        icon={<IconUsers size={14} color={PRIMARY} />}
                        value={teamCount}
                      />
                    )}
                    {publicationsCount > 0 && (
                      <StatPill
                        icon={<IconFileText size={14} color={PRIMARY} />}
                        value={publicationsCount}
                      />
                    )}
                  </Group>
                )}
              </Group>

              {/* Short description */}
              <Text
                size={isMobile ? "sm" : "md"}
                fw={600}
                style={{ color: "#334155", lineHeight: 1.4 }}
              >
                {research.shortDescription}
              </Text>

              {/* Description */}
              <Text
                size="sm"
                style={{ color: "#64748b", lineHeight: 1.6, flex: 1 }}
              >
                {research.description}
              </Text>

              {/* Mobile stats with labels */}
              {isMobile && (
                <Group gap="lg" mt="auto" pt="xs">
                  {teamCount > 0 && (
                    <StatPill
                      icon={<IconUsers size={14} color={PRIMARY} />}
                      value={teamCount}
                      label={teamCount === 1 ? "member" : "members"}
                    />
                  )}
                  {publicationsCount > 0 && (
                    <StatPill
                      icon={<IconFileText size={14} color={PRIMARY} />}
                      value={publicationsCount}
                      label={
                        publicationsCount === 1 ? "publication" : "publications"
                      }
                    />
                  )}
                </Group>
              )}
            </Stack>

            {/* Desktop hover overlay */}
            <AnimatePresence>
              {!isMobile && isHovered && onClick && (
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
                      View research
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
    </MantineProvider>
  );
}
