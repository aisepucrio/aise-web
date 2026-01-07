"use client";

import React from "react";
import {
  Paper,
  Group,
  Text,
  Badge,
  ThemeIcon,
  MantineProvider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export interface BadgeBoxProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

// Compact, accessible badge list with responsive layout.
export const BadgeBox: React.FC<BadgeBoxProps> = ({ title, icon, items }) => {
  const isMobile = useMediaQuery("(max-width: 62em)");

  if (!items || items.length === 0) return null;

  return (
    <MantineProvider>
      <Paper
        shadow="xs"
        radius="md"
        p="md"
        style={{ background: "rgba(245,245,245,0.6)", flex: 1, width: "100%" }}
      >
        <Group
          mb="xs"
          style={{ justifyContent: isMobile ? "center" : undefined }}
        >
          <ThemeIcon variant="light" color="var(--primary)" size={32}>
            {icon}
          </ThemeIcon>
          <Text fw={600} c="dimmed" size="md">
            {title}
          </Text>
        </Group>

        <Group
          gap="xs"
          wrap="wrap"
          style={{ justifyContent: isMobile ? "center" : undefined }}
        >
          {items.map((item, idx) => (
            <Badge
              key={idx}
              color="var(--primary)"
              variant="light"
              radius="sm"
              size="md"
            >
              {item}
            </Badge>
          ))}
        </Group>
      </Paper>
    </MantineProvider>
  );
};

export default BadgeBox;
