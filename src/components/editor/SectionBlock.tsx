import { ActionIcon, Box, Group, Paper, Text, Title } from "@mantine/core";
import { ReactNode } from "react";
import Tooltip from "./Tooltip";

export function SectionBlock({
  icon,
  title,
  required,
  tooltip,
  headerRight,
  children,
}: {
  icon: ReactNode;
  title: string;
  required?: boolean;
  tooltip?: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Paper withBorder radius="md" p="md" style={{ borderColor: "var(--mantine-color-gray-2)" }}>
      <Group gap="xs" mb="md" wrap="nowrap">
        <ActionIcon variant="light" color="var(--primary)" size="sm" radius="xl">
          {icon}
        </ActionIcon>
        <Title order={6} style={{ color: "var(--primary)" }}>
          {title}
        </Title>
        {required && (
          <Text span size="sm" c="red" fw={700}>*</Text>
        )}
        {(tooltip || headerRight) && (
          <Group gap="xs" ml="auto" wrap="nowrap">
            {headerRight}
            {tooltip && (
              <Box>
                <Tooltip position="top">{tooltip}</Tooltip>
              </Box>
            )}
          </Group>
        )}
      </Group>
      {children}
    </Paper>
  );
}
