"use client";

import { useState, useEffect, type ReactNode } from "react";
import {
  Group,
  Stack,
  Text,
  Button,
  MultiSelect,
  Alert,
  Loader,
  Center,
  Badge,
} from "@mantine/core";
import { IconFileText, IconAlertCircle } from "@tabler/icons-react";
import { SectionBlock } from "./SectionBlock";

interface Publication {
  title: string;
  year?: string;
  authors_list?: string;
}

interface PublicationRelationshipSelectorProps {
  value: string | string[];
  onChange: (value: string[]) => void;
  label?: string;
  tooltip?: ReactNode;
}

export default function PublicationRelationshipSelector({
  value,
  onChange,
  label = "Publication Relationships",
  tooltip,
}: PublicationRelationshipSelectorProps) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conflicts, setConflicts] = useState<string[]>([]);

  useEffect(() => {
    loadPublications();
  }, []);

  useEffect(() => {
    if (!value) {
      setSelectedTitles([]);
      setConflicts([]);
      return;
    }

    if (Array.isArray(value)) {
      setSelectedTitles(value);
      checkConflicts(value);
      return;
    }

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

  const checkConflicts = (titles: string[]) => {
    const availableTitles = publications.map((p) => p.title);
    const conflictTitles = titles.filter((t) => !availableTitles.includes(t));
    setConflicts(conflictTitles);
  };

  const handleSelectionChange = (titles: string[]) => {
    setSelectedTitles(titles);
    onChange(titles);
    checkConflicts(titles);
  };

  return (
    <SectionBlock
      icon={<IconFileText size={14} />}
      title={label}
      tooltip={tooltip}
    >
      {loading ? (
        <Center py="xl">
          <Loader size="md" color="var(--primary)" />
        </Center>
      ) : error ? (
        <Alert icon={<IconAlertCircle />} title="Erro" color="red" radius="lg">
          {error}
        </Alert>
      ) : (
        <Stack gap="md">
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

          <Text size="xs" c="dimmed">
            {publications.length} publicação(ões) disponível(is) na planilha
          </Text>

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
        </Stack>
      )}
    </SectionBlock>
  );
}
