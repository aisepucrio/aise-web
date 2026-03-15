import { ActionIcon, Group, Paper, Title } from "@mantine/core";

export function SectionBlock({         //-> componente interno
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper withBorder radius="md" p="md" style={{ borderColor: "var(--mantine-color-gray-2)" }}>
      <Group gap="xs" mb="md">
        <ActionIcon variant="light" color="var(--primary)" size="sm" radius="xl">
          {icon}
        </ActionIcon>
        <Title order={6} style={{ color: "var(--primary)" }}>
          {title}
        </Title>
      </Group>
      {children}
    </Paper>
  );
}