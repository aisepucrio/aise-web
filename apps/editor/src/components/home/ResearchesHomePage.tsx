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
import { IconFlask, IconAlertCircle, IconLogin } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const NEW_RESEARCH_VALUE = "__NEW_RESEARCH__";

// Interface simplificada para listagem
interface ResearchListItem {
  id: string;
  name: string;
  shortDescription: string;
}

export default function ResearchesHomePage() {
  const router = useRouter();
  const [researches, setResearches] = useState<ResearchListItem[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingResearches, setLoadingResearches] = useState(true);
  const [error, setError] = useState("");

  // Carrega lista de researches ao montar o componente
  useEffect(() => {
    loadResearches();
  }, []);

  const loadResearches = async () => {
    try {
      const res = await fetch("/api/researches");
      if (!res.ok) throw new Error("Erro ao carregar researches");

      const data = await res.json();
      const researchesList = data.researches || [];

      // Extrai apenas id, name e shortDescription para a lista
      const simplifiedResearches = researchesList.map((research: any) => ({
        id: research.id,
        name: research.name,
        shortDescription: research.shortDescription || "",
      }));

      setResearches(simplifiedResearches);
    } catch (err) {
      console.error("Erro ao carregar researches:", err);
      setError("Erro ao carregar lista de researches");
    } finally {
      setLoadingResearches(false);
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
      if (selectedValue === NEW_RESEARCH_VALUE) {
        // Nova research - redireciona para criar
        router.push(`/edit-content/researches/new-research`);
      } else {
        // Research existente - redireciona com ID
        router.push(`/edit-content/researches/${selectedValue}`);
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
          Selecione uma linha de pesquisa na lista para editar suas informações,
          ou escolha &quot;Criar nova research&quot; para adicionar uma nova
          área de pesquisa.
        </Text>
      </Alert>

      {/* Seleção de Research */}
      {loadingResearches ? (
        <Center py="xl">
          <Loader size="md" color="var(--primary)" />
        </Center>
      ) : (
        <Select
          radius={"md"}
          size="md"
          label="Selecione uma linha de pesquisa"
          placeholder="Escolha uma opção"
          leftSection={<IconFlask size={24} />}
          value={selectedValue}
          onChange={setSelectedValue}
          disabled={loading}
          error={error}
          searchable
          data={[
            {
              value: NEW_RESEARCH_VALUE,
              label: "+ Criar nova research",
            },
            ...researches.map((research) => ({
              value: research.id,
              label: `${research.name}`,
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
    </Stack>
  );
}
