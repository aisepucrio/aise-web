"use client";

/**
 * Editor em formato de formulário em blocos para Tools.
 * 
 * Cria uma nova "page" para preenchimento no estilo de formulário, 
 * sendo outra opção da textarea JSON.
 */

import {
  Stack,
  TextInput,
  Textarea,
  Text,
  Group,
  Badge,
  ActionIcon,
  Button,
  List,
  SimpleGrid,
} from "@mantine/core";
import {
  IconTool,
  IconPhoto,
  IconLink,
  IconX,
  IconPlus,
  IconAlignLeft,
  IconTarget,
  IconStar,
  IconCode,
  IconTag,
} from "@tabler/icons-react";
import { ReactNode, useState } from "react";
import { ToolData } from "@/lib/types";

import { SectionBlock } from "./SectionBlock";
import TooltipIcon from "./TooltipIcon";
import ImageUploadButton from "./ImageUploadButton";

import { FieldLabel } from "./FieldLabel";

interface ToolFormEditorProps {
  data: ToolData;
  onChange: (field: keyof ToolData, value: any) => void;
}

// Editor de lista de strings — suporta tooltip via FieldLabel
function StringListEditor({
  label,
  tooltip,
  values,
  onChange,
  placeholder,
  asBadge = false,
}: {
  label: string;
  tooltip?: ReactNode;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  asBadge?: boolean;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setInputValue("");
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Stack gap="xs">
      {/* Se tiver tooltip, usa FieldLabel. Senão, texto simples */}
      {tooltip ? (
        <FieldLabel text={label} tooltip={tooltip} />
      ) : (
        <Text size="sm" fw={500} c="dimmed">{label}</Text>
      )}
      <Stack gap="xs">
        {asBadge ? (
          <Group gap="xs" wrap="wrap">
            {values.map((val, idx) => (
              <Badge
                key={idx}
                variant="light"
                color="var(--primary)"
                size="md"
                radius="sm"
                rightSection={
                  <ActionIcon size="xs" variant="transparent" color="var(--primary)" onClick={() => handleRemove(idx)}>
                    <IconX size={10} />
                  </ActionIcon>
                }
              >
                {val}
              </Badge>
            ))}
          </Group>
        ) : (
          <Stack gap={4}>
            {values.map((val, idx) => (
              <Group key={idx} gap="xs" wrap="nowrap">
                <Text
                  size="sm"
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    background: "var(--mantine-color-gray-0)",
                    borderRadius: 6,
                    border: "1px solid var(--mantine-color-gray-2)",
                  }}
                >
                  {val}
                </Text>
                <ActionIcon size="sm" variant="light" color="red" onClick={() => handleRemove(idx)}>
                  <IconX size={12} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
      <Group gap="xs">
        <TextInput
          placeholder={placeholder || "Adicionar..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          size="xs"
          style={{ flex: 1 }}
        />
        <Button size="xs" variant="light" color="var(--primary)" leftSection={<IconPlus size={12} />} onClick={handleAdd}>
          Adicionar
        </Button>
      </Group>
    </Stack>
  );
}

export default function ToolFormEditor({ data, onChange }: ToolFormEditorProps) {
  const links = data.links || {};

  const updateLink = (key: string, value: string) => {
    onChange("links", { ...links, [key]: value });
  };

  return (
    <Stack gap="md">

      {/* Informações Básicas */}
      <SectionBlock icon={<IconTool size={14} />} title="Informações Básicas">
        <SimpleGrid cols={2} spacing="xs">
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
                      <List.Item>Ex.: my-awesome-tool, data-analyzer-v2.</List.Item>
                    </List>
                  </Stack>
                }
              />
            }
            placeholder="meu-tool-id"
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
                      <List.Item>Nome legível do tool (3–60 caracteres).</List.Item>
                      <List.Item>Ex.: "AI Content Generator", "Smart Dashboard".</List.Item>
                    </List>
                  </Stack>
                }
              />
            }
            placeholder="Nome da ferramenta"
            value={data.name || ""}
            onChange={(e) => onChange("name", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="Tagline"
                tooltip={
                  <Stack gap={4}>
                    <Badge size="xs" color="red">Obrigatório</Badge>
                    <List size="xs" spacing={4}>
                      <List.Item>Frase curta descrevendo o propósito (10–100 caracteres).</List.Item>
                      <List.Item>Ex.: "Transform data into insights with AI".</List.Item>
                    </List>
                  </Stack>
                }
              />
            }
            placeholder="Frase curta de descrição"
            value={data.tagline || ""}
            onChange={(e) => onChange("tagline", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="Categoria"
                tooltip={
                  <Stack gap={4}>
                    <Badge size="xs" color="red">Obrigatório</Badge>
                    <Text size="xs">Escolha a categoria que melhor se adequa ao tool.</Text>
                    <Text size="xs">Ex.: "Data Analysis", "Content Generation", "Image Processing", "Automation", "Visualization".</Text>
                  </Stack>
                }
              />
            }
            placeholder="Ex: Data Science"
            leftSection={<IconTag size={14} />}
            value={data.category || ""}
            onChange={(e) => onChange("category", e.currentTarget.value)}
            size="sm"
          />
        </SimpleGrid>
      </SectionBlock>

      {/* Imagens */}
      <SectionBlock icon={<IconPhoto size={14} />} title="Imagens">
        <ImageUploadButton
          label="Imagem de Destaque"
          description="JPG, JPEG ou PNG. Proporção 16:9 recomendada."
          value={data.highlightImageUrl || ""}
          onChange={(url) => onChange("highlightImageUrl", url)}
        />
        <StringListEditor
          label="Galeria de Imagens (URLs)"
          tooltip={
            <Stack gap={4}>
              <Badge size="xs" color="gray">Opcional</Badge>
              <Text size="xs">Array de URLs de imagens para galeria.</Text>
            </Stack>
          }
          values={data.galleryImagesUrl || []}
          onChange={(val) => onChange("galleryImagesUrl", val)}
          placeholder="https://..."
        />
      </SectionBlock>

      {/* Descrições */}
      <SectionBlock icon={<IconAlignLeft size={14} />} title="Descrições">
        <Stack gap="xs">
          <Textarea
            label={
              <FieldLabel
                text="Descrição Curta"
                tooltip={
                  <Stack gap={4}>
                    <Badge size="xs" color="red">Obrigatório</Badge>
                    <List size="xs" spacing={4}>
                      <List.Item>2–3 sentenças, 50–300 caracteres.</List.Item>
                      <List.Item>Explique o que o tool faz e seu propósito principal.</List.Item>
                    </List>
                  </Stack>
                }
              />
            }
            placeholder="2-3 frases sobre o tool..."
            value={data.description || ""}
            onChange={(e) => onChange("description", e.currentTarget.value)}
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
                    <Badge size="xs" color="gray">Opcional</Badge>
                    <List size="xs" spacing={4}>
                      <List.Item>200–2000 caracteres.</List.Item>
                      <List.Item>Explique contexto, motivação, funcionalidades e impacto.</List.Item>
                    </List>
                  </Stack>
                }
              />
            }
            placeholder="Descrição detalhada com contexto, motivação e impacto..."
            value={data.longDescription || ""}
            onChange={(e) => onChange("longDescription", e.currentTarget.value)}
            autosize
            minRows={3}
            maxRows={6}
            size="sm"
          />
        </Stack>
      </SectionBlock>

      {/* Objetivos */}
      <SectionBlock icon={<IconTarget size={14} />} title="Objetivos">
        <StringListEditor
          label="Lista de objetivos"
          tooltip={
            <Stack gap={4}>
              <Badge size="xs" color="gray">Opcional</Badge>
              <Text size="xs">Lista de objetivos do projeto (1–5 itens).</Text>
            </Stack>
          }
          values={data.objectives || []}
          onChange={(val) => onChange("objectives", val)}
          placeholder="Ex: Automatizar análise de dados"
        />
      </SectionBlock>

      {/* Features */}
      <SectionBlock icon={<IconStar size={14} />} title="Features">
        <StringListEditor
          label="Principais funcionalidades"
          tooltip={
            <Stack gap={4}>
              <Badge size="xs" color="gray">Opcional</Badge>
              <Text size="xs">Principais funcionalidades (2–8 itens).</Text>
            </Stack>
          }
          values={data.features || []}
          onChange={(val) => onChange("features", val)}
          placeholder="Ex: Dashboard interativo"
        />
      </SectionBlock>

      {/* Tech Stack */}
      <SectionBlock icon={<IconCode size={14} />} title="Tech Stack">
        <StringListEditor
          label="Tecnologias utilizadas"
          tooltip={
            <Stack gap={4}>
              <Badge size="xs" color="gray">Opcional</Badge>
              <Text size="xs">Tecnologias utilizadas (2–10 itens).</Text>
            </Stack>
          }
          values={data.techStack || []}
          onChange={(val) => onChange("techStack", val)}
          placeholder="Ex: Next.js"
          asBadge
        />
      </SectionBlock>

      {/* Links */}
      <SectionBlock icon={<IconLink size={14} />} title="Links">
        <Stack gap="xs">
          <Text size="xs" c="dimmed">Todos opcionais. URLs devem começar com http:// ou https://.</Text>
          <TextInput
            label={
              <FieldLabel
                text="Web App"
                tooltip={<Text size="xs">URL da aplicação web. Ex.: example.com.</Text>}
              />
            }
            placeholder="example.com"
            leftSection={<IconLink size={14} />}
            value={links.webapp || ""}
            onChange={(e) => updateLink("webapp", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="GitHub"
                tooltip={<Text size="xs">Repositório do projeto. Ex.: github.com/example/repo.</Text>}
              />
            }
            placeholder="github.com/example/repo"
            leftSection={<IconLink size={14} />}
            value={links.github || ""}
            onChange={(e) => updateLink("github", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="API"
                tooltip={<Text size="xs">Endpoint da API. Ex.: api.example.com.</Text>}
              />
            }
            placeholder="api.example.com"
            leftSection={<IconLink size={14} />}
            value={links.api || ""}
            onChange={(e) => updateLink("api", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="Docs"
                tooltip={<Text size="xs">Documentação do projeto. Ex.: docs.example.com.</Text>}
              />
            }
            placeholder="docs.example.com"
            leftSection={<IconLink size={14} />}
            value={links.docs || ""}
            onChange={(e) => updateLink("docs", e.currentTarget.value)}
            size="sm"
          />
        </Stack>
      </SectionBlock>
    </Stack>
  );
}