"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Select,
  Button,
  Alert,
  Loader,
  Center,
  Stack,
  Text,
} from "@mantine/core";
import { IconTool, IconAlertCircle, IconLogin } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const NEW_TOOL_VALUE = "__NEW_TOOL__";

// Interface simplificada para listagem
interface ToolListItem {
  id: string;
  name: string;
  category: string;
}

export default function ToolsHomePage() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolListItem[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTools, setLoadingTools] = useState(true);
  const [error, setError] = useState("");

  // Carrega lista de tools ao montar o componente
  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const res = await fetch("/api/tools");
      if (!res.ok) throw new Error("Erro ao carregar tools");

      const data = await res.json();
      const toolsList = data.tools || [];

      // Extrai apenas id, name e category para a lista
      const simplifiedTools = toolsList.map((tool: any) => ({
        id: tool.id,
        name: tool.name,
        category: tool.category || "Uncategorized",
      }));

      setTools(simplifiedTools);
    } catch (err) {
      console.error("Erro ao carregar tools:", err);
      setError("Erro ao carregar lista de tools");
    } finally {
      setLoadingTools(false);
    }
  };

  const handleLogin = async () => {
    setError("");

    if (!selectedValue) {
      setError("Por favor, selecione uma opção");
      return;
    }

    setLoading(true);

    try {
      if (selectedValue === NEW_TOOL_VALUE) {
        // Novo tool - redireciona para criar
        router.push(`/edit-content/tool/new-tool`);
      } else {
        // Tool existente - redireciona com ID
        router.push(`/edit-content/tool/${selectedValue}`);
      }
    } catch (err) {
      console.error("Erro ao acessar:", err);
      setError("Erro ao acessar editor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      {/* Instruções */}
      <Alert
        icon={<IconAlertCircle size={24} />}
        title="Como funciona"
        color="var(--primary)"
        variant="light"
        radius="lg"
      >
        <Text size="sm">
          Selecione um tool na lista para editar suas informações, ou escolha
          &quot;Criar novo tool&quot; para adicionar um novo projeto.
        </Text>
        <Text size="sm" mt="sm">
          <strong>Importante:</strong> Não edite a planilha diretamente. Use
          sempre este editor.
        </Text>
      </Alert>

      {/* Seleção de Tool */}
      {loadingTools ? (
        <Center py="xl">
          <Loader size="md" color="var(--primary)" />
        </Center>
      ) : (
        <Select
          radius={"md"}
          size="md"
          label="Selecione um tool"
          placeholder="Escolha uma opção"
          leftSection={<IconTool size={24} />}
          value={selectedValue}
          onChange={setSelectedValue}
          disabled={loading}
          error={error}
          searchable
          data={[
            {
              value: NEW_TOOL_VALUE,
              label: "+ Criar novo tool",
            },
            ...tools.map((tool) => ({
              value: tool.id,
              label: `${tool.name} (${tool.category})`,
            })),
          ]}
          styles={{
            label: {
              color: "#000000",
              fontWeight: 500,
            },
            input: {
              color: "#000000",
              borderColor: error ? "#fa5252" : undefined,
            },
            option: {
              color: "#000",
              "&[dataDisabled]": { color: "#adb5bd" },
              "&[dataSelected]": { background: "#f1f3f5", color: "#000" },
              "&[dataHovered]": { background: "#f8f9fa" },
            },
          }}
        />
      )}

      {/* Botão de Acesso */}
      <Button
        size="md"
        fullWidth
        onClick={handleLogin}
        disabled={loading || !selectedValue}
        rightSection={
          loading ? (
            <Loader size="xs" color="white" />
          ) : (
            <IconLogin size={18} color="white" />
          )
        }
        styles={{
          root: {
            background: "var(--primary)",
            border: "none",
            "&[dataDisabled]": {
              background: "var(--primary)",
              opacity: 0.6,
              cursor: "not-allowed",
            },
          },
          label: {
            color: "white",
          },
        }}
      >
        {loading ? "Carregando..." : "Acessar Editor"}
      </Button>

      {/* Informações adicionais */}
      <Box ta="center">
        <Text size="xs" c="dimmed">
          Suas alterações serão sincronizadas com o Google Sheets
        </Text>
      </Box>
    </Stack>
  );
}
