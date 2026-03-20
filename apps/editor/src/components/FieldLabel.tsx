import { Group, Text } from "@mantine/core";
import TooltipIcon from "./TooltipIcon";
import { ReactNode } from "react";

// Helper que monta o label com o ℹ inline
export function FieldLabel({ text, tooltip }: { text: string; tooltip: ReactNode }) {
  return (
    <Group gap={4} wrap="nowrap">
      <Text size="sm" fw={500}>{text}</Text>
      <TooltipIcon position="top">{tooltip}</TooltipIcon>
    </Group>
  );
}