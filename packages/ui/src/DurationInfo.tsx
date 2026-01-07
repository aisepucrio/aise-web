"use client";

import React from "react";
import { Box, Group, Text, MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";

export interface DurationInfoProps {
  icon: ReactNode;
  value?: ReactNode;
  size?: "sm" | "md" | "lg";
}

// Compact info display with icon, label, and optional value.
export default function DurationInfo({
  icon,
  value,
  size = "md",
}: DurationInfoProps) {
  const textSize = size === "sm" ? "xs" : size === "lg" ? "sm" : "xs";
  const valueTextSize = size === "sm" ? "sm" : size === "lg" ? "md" : "sm";

  return (
    <MantineProvider>
      <Group gap={6} align="center">
        <Box>
          <Group gap={4} align="center">
            {icon}
            <Text size={textSize} c="dimmed" fw={500}>
              Duration
            </Text>
          </Group>
          {value !== undefined && (
            <Text size={valueTextSize} fw={600} c="var(--primary)">
              {value}
            </Text>
          )}
        </Box>
      </Group>
    </MantineProvider>
  );
}

export { DurationInfo };
