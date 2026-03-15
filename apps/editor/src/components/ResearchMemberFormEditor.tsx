"use client";

/**
 * Editor em formato de formulário em blocos para Researches.
 * 
 * Cobre todos os campos exceto: duration, team_relationships,
 * publication_relationships, tool_relationships
 * (esses ficam separados na página, como seletores dedicados)
 */

import {
  Stack,
  TextInput,
  Textarea,
  Paper,
  Title,
  Text,
  Group,
  ActionIcon,
  Button,
  Divider,
} from "@mantine/core";
import {
  IconFlask,
  IconPhoto,
  IconAlignLeft,
  IconX,
  IconPlus,
  IconFolder,
} from "@tabler/icons-react";
import { ReactNode, useState } from "react";
import { ResearchData } from "@/lib/types";

// Bloco "reutilizavel" que forma o visual de seção
// além disso, é usado por todos os outros blocos abaixo. Dentro dele
import { SectionBlock } from "./SectionBlock";

import TooltipIcon from "./TooltipIcon";

import ImageUploadButton from "./ImageUploadButton";

interface ResearchFormEditorProps {
  data: ResearchData;
  //mudanca aplicada para o tooltipicon
  onChange: (field: keyof ResearchData, value: any) => void;
  tooltip?: ReactNode;
}

// Editor de projeto individual dentro da lista de projects
function ProjectItemEditor({
  project,
  index,
  onChange,
  onRemove,
}: {
  project: { name: string; imageUrl: string; description: string };
  index: number;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <Paper
      withBorder
      radius="sm"
      p="sm"
      style={{ borderColor: "var(--mantine-color-gray-3)" }}
    >
      <Group justify="space-between" mb="xs">
        <Text size="xs" fw={600} c="dimmed">
          Projeto {index + 1}
        </Text>
        <ActionIcon
          size="sm"
          variant="light"
          color="red"
          onClick={() => onRemove(index)}
        >
          <IconX size={12} />
        </ActionIcon>
      </Group>
      <Stack gap="xs">
        <TextInput
          label="Nome"
          placeholder="Nome do projeto"
          value={project.name || ""}
          onChange={(e) => onChange(index, "name", e.currentTarget.value)}
          size="xs"
        />
        <ImageUploadButton
          label="Imagem do Projeto"
          description="JPG, JPEG ou PNG."
          value={project.imageUrl || ""}
          onChange={(url) => onChange(index, "imageUrl", url)}
        />
        <Textarea
          label="Descrição"
          placeholder="Descrição do projeto..."
          value={project.description || ""}
          onChange={(e) =>
            onChange(index, "description", e.currentTarget.value)
          }
          autosize
          minRows={2}
          maxRows={3}
          size="xs"
        />
      </Stack>
    </Paper>
  );
}

export default function ResearchFormEditor({
  data,
  onChange,
  tooltip,
}: ResearchFormEditorProps) {
  const projects = data.projects || [];

  const updateProject = (index: number, field: string, value: string) => {
    const updated = projects.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    );
    onChange("projects", updated);
  };

  const addProject = () => {
    onChange("projects", [
      ...projects,
      { name: "", imageUrl: "", description: "" },
    ]);
  };

  const removeProject = (index: number) => {
    onChange(
      "projects",
      projects.filter((_, i) => i !== index),
    );
  };

  return (
    <Stack gap="md">
      {/* Tooltip global no topo — instruções passadas pelo pai */}
      {tooltip && (
        <Group justify="flex-end">
          <TooltipIcon position="left">{tooltip}</TooltipIcon>
        </Group>
      )}

      {/* Informações Básicas */}
      <SectionBlock icon={<IconFlask size={14} />} title="Informações Básicas">
        <Stack gap="xs">
          <TextInput
            label="ID"
            placeholder="minha-linha-de-pesquisa"
            value={data.id || ""}
            onChange={(e) => onChange("id", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="Nome"
            placeholder="Nome da linha de pesquisa"
            value={data.name || ""}
            onChange={(e) => onChange("name", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="Imagem de Destaque (URL)"
            placeholder="https://..."
            leftSection={<IconPhoto size={14} />}
            value={data.highlightImageUrl || ""}
            onChange={(e) =>
              onChange("highlightImageUrl", e.currentTarget.value)
            }
            size="sm"
          />
        </Stack>
      </SectionBlock>

      {/* Descrições */}
      <SectionBlock icon={<IconAlignLeft size={14} />} title="Descrições">
        <Stack gap="xs">
          <Textarea
            label="Descrição Curta"
            placeholder="2-3 frases sobre a linha de pesquisa..."
            value={data.shortDescription || ""}
            onChange={(e) => onChange("shortDescription", e.currentTarget.value)}
            autosize
            minRows={2}
            maxRows={4}
            size="sm"
          />
          <Textarea
            label="Descrição Longa"
            placeholder="Contexto, objetivos, metodologias e impacto esperado..."
            value={data.longDescription || ""}
            onChange={(e) => onChange("longDescription", e.currentTarget.value)}
            autosize
            minRows={3}
            maxRows={6}
            size="sm"
          />
        </Stack>
      </SectionBlock>

      {/* Projects */}
      <SectionBlock icon={<IconFolder size={14} />} title="Projetos">
        <Stack gap="sm">
          {projects.length === 0 && (
            <Text size="xs" c="dimmed" ta="center" py="xs">
              Nenhum projeto adicionado ainda.
            </Text>
          )}
          {projects.map((project, idx) => (
            <ProjectItemEditor
              key={idx}
              project={project}
              index={idx}
              onChange={updateProject}
              onRemove={removeProject}
            />
          ))}
          <Divider />
          <Button
            size="xs"
            variant="light"
            color="var(--primary)"
            leftSection={<IconPlus size={12} />}
            onClick={addProject}
            fullWidth
          >
            Adicionar Projeto
          </Button>
        </Stack>
      </SectionBlock>
    </Stack>
  );
}