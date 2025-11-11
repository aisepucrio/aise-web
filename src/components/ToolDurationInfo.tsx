import React from "react";
import { Box, Group, Text } from "@mantine/core";
import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
  size?: "sm" | "md" | "lg";
};

// Componente que exibe um item de informação da ferramenta com ícone, rótulo e valor.
export default function ToolDurationInfo({
  icon,
  label,
  value,
  size = "md",
}: Props) {
  const labelSize = size === "sm" ? "xs" : "xs";
  const valueSize = size === "sm" ? "sm" : "sm";

  return (
    <Group gap={6} align="center">
      <Box>
        <Group gap={4} align="center">
          {icon}
          <Text size={labelSize} c="dimmed" fw={500}>
            {label}
          </Text>
        </Group>
        {value !== undefined && (
          <Text size={valueSize} fw={600} c="var(--primary)">
            {value}
          </Text>
        )}
      </Box>
    </Group>
  );
}
