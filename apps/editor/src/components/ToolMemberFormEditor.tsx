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
  Paper,
  Title,
  Text,
  Group,
  Badge,
  ActionIcon,
  Button,
  Divider,
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

// Bloco "reutilizavel" que forma o visual de seção
// além disso, é usado por todos os outros blocos abaixo. Dentro dele
import { SectionBlock } from "./SectionBlock";

import TooltipIcon from "./TooltipIcon";

import ImageUploadButton from "./ImageUploadButton";

interface ToolFormEditorProps {
  data: ToolData;
  //mudanca aplicada para o tooltipicon
  onChange: (field: keyof ToolData, value: any) => void;
  tooltip?: ReactNode;
}

// Editor de lista de strings simples (objectives, features, techStack, galleryImagesUrl)
function StringListEditor({
  label,
  values,
  onChange,
  placeholder,
  asBadge = false,
}: {
  label: string;
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
      <Text size="sm" fw={500} c="dimmed">
        {label}
      </Text>

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
                  <ActionIcon
                    size="xs"
                    variant="transparent"
                    color="var(--primary)"
                    onClick={() => handleRemove(idx)}
                  >
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
                <ActionIcon
                  size="sm"
                  variant="light"
                  color="red"
                  onClick={() => handleRemove(idx)}
                >
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
        <Button
          size="xs"
          variant="light"
          color="var(--primary)"
          leftSection={<IconPlus size={12} />}
          onClick={handleAdd}
        >
          Adicionar
        </Button>
      </Group>
    </Stack>
  );
}

export default function ToolFormEditor({ 
  data, 
  onChange, 
  tooltip 
}: ToolFormEditorProps) {
  const links = data.links || {};

  const updateLink = (key: string, value: string) => {
    onChange("links", { ...links, [key]: value });
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
      <SectionBlock icon={<IconTool size={14} />} title="Informações Básicas">
        <SimpleGrid cols={2} spacing="xs">
          <TextInput
            label="ID"
            placeholder="meu-tool-id"
            value={data.id || ""}
            onChange={(e) => onChange("id", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="Nome"
            placeholder="Nome da ferramenta"
            value={data.name || ""}
            onChange={(e) => onChange("name", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="Tagline"
            placeholder="Frase curta de descrição"
            value={data.tagline || ""}
            onChange={(e) => onChange("tagline", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="Categoria"
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
          values={data.galleryImagesUrl || []}
          onChange={(val) => onChange("galleryImagesUrl", val)}
          placeholder="https://..."
        />
      </SectionBlock>

      {/* Descrições */}
      <SectionBlock icon={<IconAlignLeft size={14} />} title="Descrições">
        <Stack gap="xs">
          <Textarea
            label="Descrição Curta"
            placeholder="2-3 frases sobre o tool..."
            value={data.description || ""}
            onChange={(e) => onChange("description", e.currentTarget.value)}
            autosize
            minRows={2}
            maxRows={4}
            size="sm"
          />
          <Textarea
            label="Descrição Longa"
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
          values={data.objectives || []}
          onChange={(val) => onChange("objectives", val)}
          placeholder="Ex: Automatizar análise de dados"
        />
      </SectionBlock>

      {/* Features */}
      <SectionBlock icon={<IconStar size={14} />} title="Features">
        <StringListEditor
          label="Lista de funcionalidades"
          values={data.features || []}
          onChange={(val) => onChange("features", val)}
          placeholder="Ex: Dashboard interativo"
        />
      </SectionBlock>

      {/* Tech Stack */}
      <SectionBlock icon={<IconCode size={14} />} title="Tech Stack">
        <StringListEditor
          label="Tecnologias utilizadas"
          values={data.techStack || []}
          onChange={(val) => onChange("techStack", val)}
          placeholder="Ex: Next.js"
          asBadge
        />
      </SectionBlock>

      {/* Links */}
      <SectionBlock icon={<IconLink size={14} />} title="Links">
        <Stack gap="xs">
          <TextInput
            label="Web App"
            placeholder="example.com"
            leftSection={<IconLink size={14} />}
            value={links.webapp || ""}
            onChange={(e) => updateLink("webapp", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="GitHub"
            placeholder="github.com/example/repo"
            leftSection={<IconLink size={14} />}
            value={links.github || ""}
            onChange={(e) => updateLink("github", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="API"
            placeholder="api.example.com"
            leftSection={<IconLink size={14} />}
            value={links.api || ""}
            onChange={(e) => updateLink("api", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="Docs"
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