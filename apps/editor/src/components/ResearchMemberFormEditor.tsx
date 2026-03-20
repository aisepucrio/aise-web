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
  Text,
  Group,
  Badge,
  ActionIcon,
  Button,
  Divider,
  List,
} from "@mantine/core";
import {
  IconFlask,
  IconAlignLeft,
  IconX,
  IconPlus,
  IconFolder,
} from "@tabler/icons-react";
import { ResearchData } from "@/lib/types";

import { SectionBlock } from "./SectionBlock";
import { FieldLabel } from "./FieldLabel";
import ImageUploadButton from "./ImageUploadButton";

interface ResearchFormEditorProps {
  data: ResearchData;
  onChange: (field: keyof ResearchData, value: any) => void;
}

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
        <Text size="xs" fw={600} c="dimmed">Projeto {index + 1}</Text>
        <ActionIcon size="sm" variant="light" color="red" onClick={() => onRemove(index)}>
          <IconX size={12} />
        </ActionIcon>
      </Group>
      <Stack gap="xs">
        <TextInput
          label={
            <FieldLabel
              text="Nome"
              tooltip={<Text size="xs">Nome do projeto dentro desta research line.</Text>}
            />
          }
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
          label={
            <FieldLabel
              text="Descrição"
              tooltip={<Text size="xs">Breve descrição do projeto. Explique o foco e objetivo.</Text>}
            />
          }
          placeholder="Descrição do projeto..."
          value={project.description || ""}
          onChange={(e) => onChange(index, "description", e.currentTarget.value)}
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
    onChange("projects", projects.filter((_, i) => i !== index));
  };

  return (
    <Stack gap="md">

      {/* Informações Básicas */}
      <SectionBlock icon={<IconFlask size={14} />} title="Informações Básicas" required>
        <Stack gap="xs">
          <TextInput
            label={
              <FieldLabel
                text="ID"
                tooltip={
                  <Stack gap={4}>
                    <Badge size="xs" color="red">Obrigatório</Badge>
                    <List size="xs" spacing={4}>
                      <List.Item>Identificador único em formato <strong>kebab-case</strong>.</List.Item>
                      <List.Item>Apenas letras minúsculas, números e hífens. Sem espaços.</List.Item>
                      <List.Item>Ex.: ai-for-health, quantum-computing.</List.Item>
                    </List>
                  </Stack>
                }
              />
            }
            placeholder="minha-linha-de-pesquisa"
            value={data.id || ""}
            onChange={(e) => onChange("id", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="Nome"
                tooltip={
                  <Stack gap={4}>
                    <Badge size="xs" color="red">Obrigatório</Badge>
                    <List size="xs" spacing={4}>
                      <List.Item>Nome legível da research line (3–80 caracteres).</List.Item>
                      <List.Item>Ex.: "Artificial Intelligence for Healthcare".</List.Item>
                    </List>
                  </Stack>
                }
              />
            }
            placeholder="Nome da linha de pesquisa"
            value={data.name || ""}
            onChange={(e) => onChange("name", e.currentTarget.value)}
            size="sm"
          />
          <ImageUploadButton
            label="Imagem de Destaque"
            description="JPG, JPEG ou PNG. Proporção 16:9 recomendada."
            value={data.highlightImageUrl || ""}
            onChange={(url) => onChange("highlightImageUrl", url)}
          />
        </Stack>
      </SectionBlock>

      {/* Descrições */}
      <SectionBlock icon={<IconAlignLeft size={14} />} title="Descrições" required>
        <Stack gap="xs">
          <Textarea
            label={
              <FieldLabel
                text="Descrição Curta"
                tooltip={
                  <Stack gap={4}>
                    <Badge size="xs" color="red">Obrigatório</Badge>
                    <List size="xs" spacing={4}>
                      <List.Item>2–3 sentenças, mínimo 50 caracteres.</List.Item>
                      <List.Item>Explique o foco principal e objetivo da linha de pesquisa.</List.Item>
                    </List>
                  </Stack>
                }
              />
            }
            placeholder="2-3 frases sobre a linha de pesquisa..."
            value={data.shortDescription || ""}
            onChange={(e) => onChange("shortDescription", e.currentTarget.value)}
            autosize
            minRows={2}
            maxRows={4}
            size="sm"
          />
          <Textarea
            label={
              <FieldLabel
                text="Descrição Longa"
                tooltip={
                  <Stack gap={4}>
                    <Badge size="xs" color="red">Obrigatório</Badge>
                    <List size="xs" spacing={4}>
                      <List.Item>Mínimo 100 caracteres, idealmente 300–800.</List.Item>
                      <List.Item>Contextualize background, objetivos, metodologias e impacto esperado.</List.Item>
                      <List.Item>Use múltiplos parágrafos se necessário.</List.Item>
                    </List>
                  </Stack>
                }
              />
            }
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
      <SectionBlock icon={<IconFolder size={14} />} title="Projetos" required>
        <Stack gap="sm">
          {/* FieldLabel usado diretamente como elemento, igual aos outros campos */}
          <FieldLabel
            text="Projetos"
            tooltip={
              <Stack gap={4}>
                <Badge size="xs" color="gray">Opcional</Badge>
                <List size="xs" spacing={4}>
                  <List.Item>1–6 projetos recomendado.</List.Item>
                  <List.Item>Cada projeto tem nome, imagem e descrição.</List.Item>
                </List>
              </Stack>
            }
          />
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