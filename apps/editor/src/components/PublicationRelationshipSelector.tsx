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
import { IconFileText, IconAlertCircle } from "@tabler/icons-react";

interface Publication {
  title: string;
  year?: string;
  authors_list?: string;
}

interface PublicationRelationshipSelectorProps {
  value: string | string[]; // Aceita string ou array
  onChange: (value: string[]) => void; // Retorna array
  label?: string;
}

export default function PublicationRelationshipSelector({
  value,
  onChange,
  label = "Publication Relationships",
}: PublicationRelationshipSelectorProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conflicts, setConflicts] = useState<string[]>([]);

  // Carrega publicações disponíveis
  useEffect(() => {
    loadPublications();
  }, []);

  // Parse do valor inicial e verifica conflitos
  useEffect(() => {
    if (!value) {
      setSelectedTitles([]);
      setConflicts([]);
      return;
    }

    // Se já é array, usa direto
    if (Array.isArray(value)) {
      setSelectedTitles(value);
      checkConflicts(value);
      return;
    }

    // Se é string, faz parse
    if (typeof value === "string" && value.trim() !== "") {
      const titles = value
        .split("|")
        .map((t) => t.trim())
        .filter(Boolean);
      setSelectedTitles(titles);
      checkConflicts(titles);
    }
  }, [value, publications]);

  const loadPublications = async () => {
    try {
      const res = await fetch("/api/publications");
      if (!res.ok) throw new Error("Erro ao carregar publications");

      const data = await res.json();
      const pubs = data.publications || [];

      // Mapeia para extrair título, ano e autores
      const mappedPubs: Publication[] = pubs.map((p: any) => ({
        title: p.title,
        year: p.year,
        authors_list: p.authors_list,
      }));

      setPublications(mappedPubs);
    } catch (err) {
      console.error("Erro ao carregar publications:", err);
      setError("Erro ao carregar lista de publicações");
    } finally {
      setLoading(false);
    }
  };

  // Verifica se há conflitos (publicações deletadas)
  const checkConflicts = (titles: string[]) => {
    const availableTitles = publications.map((p) => p.title);
    const conflictTitles = titles.filter((t) => !availableTitles.includes(t));
    setConflicts(conflictTitles);
  };

  // Atualiza o valor (retorna array)
  const handleSelectionChange = (titles: string[]) => {
    setSelectedTitles(titles);
    onChange(titles);
    checkConflicts(titles);
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
          <IconFileText size={20} color="var(--primary)" />
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
              As seguintes publicações não existem mais na planilha de
              Publications:
            </Text>
            <Stack gap="xs" mt="xs">
              {conflicts.map((title, idx) => (
                <Badge key={idx} color="orange" variant="light">
                  {title.length > 80 ? `${title.substring(0, 80)}...` : title}
                </Badge>
              ))}
            </Stack>
            <Text size="sm" mt="xs">
              Remova-as ou atualize com títulos válidos.
            </Text>
          </Alert>
        )}

        {/* Informação sobre total disponível */}
        <Text size="xs" c="dimmed">
          {publications.length} publicação(ões) disponível(is) na planilha
        </Text>

        {/* MultiSelect de publicações */}
        <MultiSelect
          placeholder="Selecione as publicações relacionadas"
          data={publications.map((p) => ({
            value: p.title,
            label: `${p.title}${p.year ? ` (${p.year})` : ""}`,
          }))}
          value={selectedTitles}
          onChange={handleSelectionChange}
          searchable
          clearable
          description="Pesquise pelo título ou ano da publicação"
          styles={{
            pill: {
              maxWidth: "100%",
            },
          }}
        />

        {/* Contador de selecionados */}
        {selectedTitles.length > 0 && (
          <Group gap="xs">
            <Badge color="var(--primary)" variant="light">
              {selectedTitles.length} selecionada(s)
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

        {/* Não precisa mostrar preview, o contador acima já mostra */}
      </Stack>
    </Paper>
  );
}
