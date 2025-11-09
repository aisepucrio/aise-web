"use client";

import React, { useState } from "react";
import {
  Box,
  Text,
  Badge,
  Stack,
  Title,
  Group,
  useMantineTheme,
  ThemeIcon,
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

type Project = {
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

const MotionBox = motion(Box as any);

export default function ProjectCardCompact({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const router = useRouter();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <MotionBox
        whileHover={{ scale: 1.015, y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={() => router.push(`/projects/${project.id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          cursor: "pointer",
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          background: "white",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        role="button"
        aria-label={`Ver detalhes do projeto ${project.name}`}
      >
        {/* Image Section with overlays */}
        <Box
          style={{
            position: "relative",
            height: isMobile ? 200 : 260,
            overflow: "hidden",
            backgroundColor: "#f1f5f9",
          }}
        >
          <Box
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${project.imageUrl})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
            }}
          />
          {/* Very subtle gradient overlay */}
          <Box
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.15) 100%)",
            }}
          />

          {/* Category badge only */}
          <Badge
            size="sm"
            variant="filled"
            leftSection={<IconCode size={12} />}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              backgroundColor: "rgba(82, 175, 225, 0.95)",
              color: "white",
              fontWeight: 600,
              textTransform: "uppercase",
              fontSize: "0.65rem",
              letterSpacing: "0.5px",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {project.category}
          </Badge>
        </Box>

        {/* Content Section */}
        <Stack
          gap="md"
          p={isMobile ? "lg" : "xl"}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          {/* Header row: title + stats */}
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Title
              order={3}
              size={isMobile ? "1.25rem" : "1.5rem"}
              style={{
                color: "var(--primary)",
                fontWeight: 800,
                lineHeight: 1.2,
                flex: 1,
              }}
            >
              {project.name}
            </Title>

            {/* Stats on the right */}
            {!isMobile && (
              <Group gap="md" style={{ flexShrink: 0 }}>
                {project.techStack && project.techStack.length > 0 && (
                  <Group gap={6}>
                    <ThemeIcon
                      size="sm"
                      variant="light"
                      color="var(--primary)"
                      radius="xl"
                    >
                      <IconStack2 size={14} />
                    </ThemeIcon>
                    <Text size="xs" fw={600} c="dimmed">
                      {project.techStack.length}
                    </Text>
                  </Group>
                )}
                {project.team && project.team.length > 0 && (
                  <Group gap={6}>
                    <ThemeIcon
                      size="sm"
                      variant="light"
                      color="var(--primary)"
                      radius="xl"
                    >
                      <IconUsers size={14} />
                    </ThemeIcon>
                    <Text size="xs" fw={600} c="dimmed">
                      {project.team.length}
                    </Text>
                  </Group>
                )}
              </Group>
            )}
          </Group>

          {/* Tagline - bold */}
          <Text
            size={isMobile ? "sm" : "md"}
            fw={600}
            style={{
              color: "#334155",
              lineHeight: 1.4,
            }}
          >
            {project.tagline}
          </Text>

          {/* Description */}
          <Text
            size="sm"
            style={{
              color: "#64748b",
              lineHeight: 1.6,
              flex: 1,
            }}
          >
            {project.description}
          </Text>

          {/* Stats row for mobile */}
          {isMobile && (
            <Group gap="lg" mt="auto" pt="xs">
              {project.techStack && project.techStack.length > 0 && (
                <Group gap={6}>
                  <ThemeIcon
                    size="sm"
                    variant="light"
                    color="var(--primary)"
                    radius="xl"
                  >
                    <IconStack2 size={14} />
                  </ThemeIcon>
                  <Text size="xs" fw={600} c="dimmed">
                    {project.techStack.length} techs
                  </Text>
                </Group>
              )}
              {project.team && project.team.length > 0 && (
                <Group gap={6}>
                  <ThemeIcon
                    size="sm"
                    variant="light"
                    color="var(--primary)"
                    radius="xl"
                  >
                    <IconUsers size={14} />
                  </ThemeIcon>
                  <Text size="xs" fw={600} c="dimmed">
                    {project.team.length} members
                  </Text>
                </Group>
              )}
            </Group>
          )}
        </Stack>

        {/* Hover overlay with "View Project" */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(82, 175, 225, 0.96), rgba(82, 175, 225, 0.92))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              <Group gap="md">
                <Text
                  size={isMobile ? "lg" : "xl"}
                  fw={800}
                  style={{ color: "white", letterSpacing: 0.5 }}
                >
                  View Project
                </Text>
                <ThemeIcon size="xl" radius="xl" color="white" variant="filled">
                  <IconArrowRight
                    size={24}
                    stroke={2.5}
                    color="var(--primary)"
                  />
                </ThemeIcon>
              </Group>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionBox>
    </MotionBox>
  );
}
