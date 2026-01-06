"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Group,
  Stack,
  Text,
  Button,
  MultiSelect,
  Paper,
  Alert,
  Loader,
  Center,
  Badge,
} from "@mantine/core";
import { IconTool, IconAlertCircle } from "@tabler/icons-react";

interface Tool {
  id: string;
  name: string;
  category?: string;
}

interface ToolRelationshipSelectorProps {
  value: string | string[]; // Aceita string ou array
  onChange: (value: string[]) => void; // Retorna array
  label?: string;
}

export default function ToolRelationshipSelector({
  value,
  onChange,
  label = "Tool Relationships",
}: ToolRelationshipSelectorProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conflicts, setConflicts] = useState<string[]>([]);

  // Carrega tools disponíveis
  useEffect(() => {
    loadTools();
  }, []);

  // Parse do valor inicial e verifica conflitos
  useEffect(() => {
    if (!value) {
      setSelectedToolIds([]);
      setConflicts([]);
      return;
    }

    // Se já é array, usa direto
    if (Array.isArray(value)) {
      setSelectedToolIds(value);
      checkConflicts(value);
      return;
    }

    // Se é string, faz parse
    if (typeof value === "string" && value.trim() !== "") {
      const ids = value
        .split("|")
        .map((t) => t.trim())
        .filter(Boolean);
      setSelectedToolIds(ids);
      checkConflicts(ids);
    }
  }, [value, tools]);

  const loadTools = async () => {
    try {
      const res = await fetch("/api/tools");
      if (!res.ok) throw new Error("Erro ao carregar tools");

      const data = await res.json();
      const toolsList = data.tools || [];

      // Mapeia para extrair id, nome e categoria
      const mappedTools: Tool[] = toolsList.map((t: any) => ({
        id: t.id,
        name: t.name,
        category: t.category,
      }));

      setTools(mappedTools);
    } catch (err) {
      console.error("Erro ao carregar tools:", err);
      setError("Erro ao carregar lista de tools");
    } finally {
      setLoading(false);
    }
  };

  // Verifica se há conflitos (tools deletados)
  const checkConflicts = (ids: string[]) => {
    const availableIds = tools.map((t) => t.id);
    const conflictIds = ids.filter((id) => !availableIds.includes(id));
    setConflicts(conflictIds);
  };

  // Atualiza o valor (retorna array)
  const handleSelectionChange = (ids: string[]) => {
    setSelectedToolIds(ids);
    onChange(ids);
    checkConflicts(ids);
  };

  if (loading) {
    return (
      <Paper p="md" radius="lg" withBorder>
        <Center py="xl">
          <Loader size="md" color="var(--primary)" />
        </Center>
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle />} title="Erro" color="red" radius="lg">
        {error}
      </Alert>
    );
  }

  return (
    <Paper p="md" radius="lg" withBorder>
      <Stack gap="md">
        {/* Header */}
        <Group gap="xs">
          <IconTool size={20} color="var(--primary)" />
          <Text size="sm" fw={600} c="var(--primary)">
            {label}
          </Text>
        </Group>

        {/* Alerta de conflitos */}
        {conflicts.length > 0 && (
          <Alert
            icon={<IconAlertCircle />}
            title="Conflito Detectado"
            color="orange"
            radius="lg"
          >
            <Text size="sm">
              Os seguintes tools não existem mais na planilha de Tools:
            </Text>
            <Stack gap="xs" mt="xs">
              {conflicts.map((id, idx) => (
                <Badge key={idx} color="orange" variant="light">
                  {id}
                </Badge>
              ))}
            </Stack>
            <Text size="sm" mt="xs">
              Remova-os ou atualize com IDs válidos.
            </Text>
          </Alert>
        )}

        {/* Informação sobre total disponível */}
        <Text size="xs" c="dimmed">
          {tools.length} tool(s) disponível(is) na planilha
        </Text>

        {/* MultiSelect de tools */}
        <MultiSelect
          radius={"md"}
          placeholder="Selecione os tools relacionados"
          data={tools.map((t) => ({
            value: t.id,
            label: `${t.name}${t.category ? ` (${t.category})` : ""}`,
          }))}
          value={selectedToolIds}
          onChange={handleSelectionChange}
          searchable
          clearable
          description="Pesquise pelo nome ou categoria do tool"
          styles={{
            pill: {
              maxWidth: "100%",
            },
            label: {
              color: "#000000",
              fontWeight: 500,
            },
            option: {
              color: "#000",
              "&[dataDisabled]": { color: "#adb5bd" },
              "&[dataSelected]": { background: "#f1f3f5", color: "#000" },
              "&[dataHovered]": { background: "#f8f9fa" },
            },
          }}
        />

        {/* Contador de selecionados */}
        {selectedToolIds.length > 0 && (
          <Group gap="xs">
            <Badge color="var(--primary)" variant="light">
              {selectedToolIds.length} selecionado(s)
            </Badge>
            <Button
              size="xs"
              variant="subtle"
              color="gray"
              onClick={() => handleSelectionChange([])}
            >
              Limpar seleção
            </Button>
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
