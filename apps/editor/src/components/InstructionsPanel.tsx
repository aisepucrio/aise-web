"use client";

import { useState, ReactNode } from "react";
import {
  Paper,
  Group,
  Title,
  Badge,
  Collapse,
  ThemeIcon,
  UnstyledButton,
  Divider,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconInfoCircle,
} from "@tabler/icons-react";

export interface InstructionsPanelProps {
  /** Título do painel (ex.: "Instruções de Perfil", "Instruções de Tool") */
  title: string;
  /** Conteúdo interno do painel (campos de instrução) */
  children: ReactNode;
  /** Se deve começar aberto (padrão: true) */
  defaultOpened?: boolean;
}

/**
 * Painel de instruções genérico e reutilizável.
 * Estrutura colapsável com cabeçalho clicável, ícone de informação e badge.
 * Usado por ProfileInstructions e ToolInstructions para evitar duplicação de código.
 */
export default function InstructionsPanel({
  title,
  children,
  defaultOpened = true,
}: InstructionsPanelProps) {
  const [opened, setOpened] = useState(defaultOpened);

  return (
    <Paper
      shadow="xs"
      p="md"
      radius="lg"
      mb="md"
      style={{
        background: "#fff",
        border: "1px solid var(--mantine-color-gray-3)",
        color: "var(--mantine-color-dark-8)",
        lineHeight: 1.55,
      }}
    >
      {/* Header compacto e clicável */}
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        style={{ width: "100%" }}
        aria-expanded={opened}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <ThemeIcon size="lg" variant="light" color="var(--primary)">
              <IconInfoCircle size={18} />
            </ThemeIcon>
            <Title order={4} style={{ color: "var(--mantine-color-dark-9)" }}>
              {title}
            </Title>
            <Badge variant="light" color="gray">
              Leitura rápida
            </Badge>
          </Group>
          <Group gap="xs">
            {opened ? (
              <IconChevronUp size={18} />
            ) : (
              <IconChevronDown size={18} />
            )}
          </Group>
        </Group>
      </UnstyledButton>

      <Collapse in={opened} p="md">
        <Divider my="sm" />
        {children}
      </Collapse>
    </Paper>
  );
}
