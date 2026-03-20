import { ActionIcon, Group, Paper, Text, Title } from "@mantine/core";

export function SectionBlock({
  icon,
  title,
  required,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  required?: boolean;
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
        {required && (
          <Text span size="sm" c="red" fw={700}>*</Text>
        )}
      </Group>
      {children}
    </Paper>
  );
}