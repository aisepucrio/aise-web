"use client";

import {
  Stack,
  TextInput,
  Textarea,
  List,
  SimpleGrid,
} from "@mantine/core";
import {
  IconTool,
  IconPhoto,
  IconLink,
  IconAlignLeft,
  IconTarget,
  IconStar,
  IconCode,
  IconTag,
} from "@tabler/icons-react";
import { ReactNode, useState } from "react";
import { ToolData } from "@/lib/types";

import { SectionBlock } from "../SectionBlock";
import ImageUploadModal from "../image-upload/ImageUploadModal";
import ImageUploadSection from "../image-upload/ImageUploadSection";

import { FieldLabel } from "../FieldLabel";
import { StringListEditor } from "../StringListEditor";

const TOOL_FIELD_TOOLTIPS = {
  id: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Defina o identificador único do tool em formato{" "}
          <strong>kebab-case</strong>.
        </List.Item>
        <List.Item>
          Use apenas letras minúsculas, números e hífens, sem espaços.
        </List.Item>
        <List.Item>
          Esse valor costuma ser usado em URLs, slugs e referências internas.
        </List.Item>
        <List.Item>Ex.: my-awesome-tool, data-analyzer-v2.</List.Item>
      </List>
    </Stack>
  ),
  name: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Escreva o nome principal que será exibido para quem acessa o site.
        </List.Item>
        <List.Item>Prefira um nome curto, claro e fácil de reconhecer.</List.Item>
        <List.Item>Ex.: "AI Content Generator", "Smart Dashboard".</List.Item>
      </List>
    </Stack>
  ),
  tagline: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Escreva uma frase curta que resuma o valor do tool em uma leitura
          rápida.
        </List.Item>
        <List.Item>
          Pense nela como o subtítulo que acompanha o nome do projeto.
        </List.Item>
        <List.Item>Ex.: "Transform data into insights with AI".</List.Item>
      </List>
    </Stack>
  ),
  category: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Escolha a categoria que melhor representa o tipo principal do tool.
        </List.Item>
        <List.Item>
          Use um termo amplo o suficiente para agrupar ferramentas parecidas.
        </List.Item>
        <List.Item>
          Ex.: "Data Analysis", "Content Generation", "Image Processing",
          "Automation", "Visualization".
        </List.Item>
      </List>
    </Stack>
  ),
  galleryImagesUrl: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Adicione imagens extras para mostrar interface, fluxo, resultados ou
          variações do tool.
        </List.Item>
        <List.Item>Cole uma URL por item no campo abaixo.</List.Item>
        <List.Item>
          Prefira imagens diferentes da imagem de destaque e em uma ordem que
          faça sentido.
        </List.Item>
      </List>
    </Stack>
  ),
  description: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Escreva um resumo curto para cards, listagens e contextos de leitura
          rápida.
        </List.Item>
        <List.Item>
          Em 2 ou 3 sentenças, explique o que o tool faz, para quem serve e o
          valor principal que entrega.
        </List.Item>
        <List.Item>Evite detalhes longos ou técnicos demais aqui.</List.Item>
      </List>
    </Stack>
  ),
  longDescription: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Escreva a explicação completa do tool para a página detalhada.
        </List.Item>
        <List.Item>
          Traga contexto, problema atacado, abordagem, principais recursos e
          impacto esperado.
        </List.Item>
        <List.Item>
          Você pode usar vários parágrafos curtos, sem repetir literalmente a
          descrição curta.
        </List.Item>
      </List>
    </Stack>
  ),
  objectives: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>Adicione um objetivo por item da lista.</List.Item>
        <List.Item>
          Cada item deve descrever um resultado concreto que o projeto busca
          alcançar.
        </List.Item>
        <List.Item>
          Ex.: reduzir tempo de análise, automatizar tarefas repetitivas,
          melhorar a tomada de decisão.
        </List.Item>
      </List>
    </Stack>
  ),
  features: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>Liste uma funcionalidade principal por item.</List.Item>
        <List.Item>
          Foque no que a pessoa usuária consegue fazer ou perceber no produto.
        </List.Item>
        <List.Item>
          Ex.: dashboard interativo, geração automática de relatórios,
          exportação em CSV.
        </List.Item>
      </List>
    </Stack>
  ),
  techStack: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>Adicione uma tecnologia por item da lista.</List.Item>
        <List.Item>
          Inclua linguagens, frameworks, bibliotecas, serviços ou infraestrutura
          relevantes.
        </List.Item>
        <List.Item>
          Ex.: Next.js, Python, FastAPI, PostgreSQL, OpenAI API.
        </List.Item>
      </List>
    </Stack>
  ),
  links: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Preencha os links que existirem e façam sentido para apresentar o
          projeto.
        </List.Item>
        <List.Item>
          Use cada campo para o destino correto: produto, repositório, API ou
          documentação.
        </List.Item>
        <List.Item>Se algum link não existir, deixe o campo em branco.</List.Item>
      </List>
    </Stack>
  ),
} satisfies Record<string, ReactNode>;

interface ToolFormEditorProps {
  data: ToolData;
  onChange: <Field extends keyof ToolData>(
    field: Field,
    value: ToolData[Field],
  ) => void;
}

export default function ToolFormEditor({
  data,
  onChange,
}: ToolFormEditorProps) {
  const [isAddingGalleryImage, setIsAddingGalleryImage] = useState(false);
  const links = data.links || {};
  const galleryImages = data.galleryImagesUrl || [];

  const updateLink = (key: string, value: string) => {
    onChange("links", { ...links, [key]: value });
  };

  const handleGalleryImageChange = (imageUrl: string) => {
    if (!imageUrl) {
      return;
    }

    if (!galleryImages.includes(imageUrl)) {
      onChange("galleryImagesUrl", [...galleryImages, imageUrl]);
    }

    setIsAddingGalleryImage(false);
  };

  return (
    <Stack gap="md">
      {/* Informações Básicas */}
      <SectionBlock
        icon={<IconTool size={14} />}
        title="Informações Básicas"
      >
        <SimpleGrid cols={2} spacing="xs">
          <TextInput
            label={
              <FieldLabel
                text="ID"
                tooltip={TOOL_FIELD_TOOLTIPS.id}
                required
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
                tooltip={TOOL_FIELD_TOOLTIPS.name}
                required
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
                tooltip={TOOL_FIELD_TOOLTIPS.tagline}
                required
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
                tooltip={TOOL_FIELD_TOOLTIPS.category}
                required
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
        <ImageUploadSection
          label="Imagem de Destaque"
          description="JPG, JPEG ou PNG. Proporção 16:9 recomendada."
          required
          value={data.highlightImageUrl || ""}
          onChange={(url) => onChange("highlightImageUrl", url)}
        />
        <StringListEditor
          label="Galeria de Imagens (URLs)"
          tooltip={TOOL_FIELD_TOOLTIPS.galleryImagesUrl}
          values={galleryImages}
          onChange={(val) => onChange("galleryImagesUrl", val)}
          addButtonLabel="Adicionar imagem"
          hideInput
          onAddButtonClick={() => setIsAddingGalleryImage(true)}
          variant="list"
        />
        <ImageUploadModal
          opened={isAddingGalleryImage}
          value=""
          onClose={() => setIsAddingGalleryImage(false)}
          onChange={handleGalleryImageChange}
        />
      </SectionBlock>

      {/* Descrições */}
      <SectionBlock
        icon={<IconAlignLeft size={14} />}
        title="Descrições"
      >
        <Stack gap="xs">
          <Textarea
            label={
              <FieldLabel
                text="Descrição Curta"
                tooltip={TOOL_FIELD_TOOLTIPS.description}
                required
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
                tooltip={TOOL_FIELD_TOOLTIPS.longDescription}
                required
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
      <SectionBlock
        icon={<IconTarget size={14} />}
        title="Objetivos"
        tooltip={TOOL_FIELD_TOOLTIPS.objectives}
        required
      >
        <StringListEditor
          values={data.objectives || []}
          onChange={(val) => onChange("objectives", val)}
          placeholder="Ex: Automatizar análise de dados"
          variant="list"
        />
      </SectionBlock>

      {/* Features */}
      <SectionBlock
        icon={<IconStar size={14} />}
        title="Features"
        tooltip={TOOL_FIELD_TOOLTIPS.features}
        required
      >
        <StringListEditor
          values={data.features || []}
          onChange={(val) => onChange("features", val)}
          placeholder="Ex: Dashboard interativo"
          variant="list"
        />
      </SectionBlock>

      {/* Tech Stack */}
      <SectionBlock
        icon={<IconCode size={14} />}
        title="Tech Stack"
        tooltip={TOOL_FIELD_TOOLTIPS.techStack}
        required
      >
        <StringListEditor
          values={data.techStack || []}
          onChange={(val) => onChange("techStack", val)}
          placeholder="Ex: Next.js"
          variant="badges"
        />
      </SectionBlock>

      {/* Links */}
      <SectionBlock
        icon={<IconLink size={14} />}
        title="Links"
        tooltip={TOOL_FIELD_TOOLTIPS.links}
        required
      >
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
