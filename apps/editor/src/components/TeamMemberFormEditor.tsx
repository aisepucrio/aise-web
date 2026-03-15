"use client";

/**
 * Editor em formato de formulário em blocos para membros de TEAM.
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
  IconUser,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconWorld,
  IconBook,
  IconCake,
  IconPhoto,
  IconLink,
  IconX,
  IconPlus,
  IconFlask,
  IconCode,
  IconBrain,
} from "@tabler/icons-react";
import { ReactNode, useState } from "react";
import { TeamMemberData } from "@/lib/types";


// Bloco "reutilizavel" que forma o visual de seção
// além disso, é usado por todos os outros blocos abaixo. Dentro dele
import { SectionBlock } from "./SectionBlock";

// Bloco de lista (strings) de tags (researchInterests, technologies, knowledge)
// Possui badges (x) para remover as tags, input (+) para adicionar tags
import { TagListEditor } from "./TagListEditor";

import TooltipIcon from "./TooltipIcon";

import ImageUploadButton from "./ImageUploadButton";

interface TeamMemberFormEditorProps {
  data: TeamMemberData;
  //mudanca aplicada para o tooltipicon
  onChange: (field: keyof TeamMemberData, value: any) => void;
  tooltip?: ReactNode;
}


export default function TeamMemberFormEditor({ 
  data, 
  onChange, 
  tooltip,
}: TeamMemberFormEditorProps) {
  const socialLinks = data.socialLinks || {};

  const updateSocialLink = (key: string, value: string) => {
    onChange("socialLinks", { ...socialLinks, [key]: value });
  };

  return (
    <Stack gap="md">
      {/* Tooltip global no topo — instruções passadas pelo pai */}
      {tooltip && (
        <Group justify="flex-end">
          <TooltipIcon position="left">{tooltip}</TooltipIcon>
        </Group>
      )}


      {/* Informações Básicas/Iniciais Padrão do membro do TEAM */}
      <SectionBlock icon={<IconUser size={14} />} title="Informações Básicas">
        <SimpleGrid cols={2} spacing="xs">
          {/* Nome do membro do TEAM */}
          <TextInput
            label="Nome"
            placeholder="Nome completo"
            value={data.name || ""}
            onChange={(e) => onChange("name", e.currentTarget.value)}
            size="sm"
          />
          {/* Cargo/Posição que o membro do TEAM possui */}
          <TextInput
            label="Cargo / Posição"
            placeholder="Ex: Laboratory Head"
            value={data.position || ""}
            onChange={(e) => onChange("position", e.currentTarget.value)}
            size="sm"
          />
          {/* Universidade do membro do TEAM */}
          <TextInput
            label="Universidade"
            placeholder="Ex: PUC-Rio"
            value={data.university || ""}
            onChange={(e) => onChange("university", e.currentTarget.value)}
            size="sm"
          />
          {/* Data de nascimento do membro do TEAM */}
          <TextInput
            label="Data de Nascimento"
            placeholder="DD/MM/AAAA"
            leftSection={<IconCake size={14} />}
            value={data.birthday || ""}
            onChange={(e) => onChange("birthday", e.currentTarget.value)}
            size="sm"
          />
        </SimpleGrid>
        {/* Inclusão por arquivofoto do membro do TEAM */}
        <ImageUploadButton
          label="URL da Foto"
          description="JPG, JPEG ou PNG. Proporção 3:4 recomendada."
          value={data.imageUrl || ""}
          onChange={(url) => onChange("imageUrl", url)}
        />
      </SectionBlock>
      
      {/* textArea (caixa de texto) para se escrever uma breve descrição do novo membro do TEAM */}
      <SectionBlock icon={<IconBook size={14} />} title="Descrição">
        <Textarea
          placeholder="Escreva a descrição do membro..."
          value={data.description || ""}
          onChange={(e) => onChange("description", e.currentTarget.value)}
          autosize
          minRows={3}
          maxRows={6}
          size="sm"
        />
      </SectionBlock>

      {/* Contato por e-mail do membro do TEAM */}
      <SectionBlock icon={<IconMail size={14} />} title="Contato">
        <TextInput
          label="Email"
          placeholder="membro@universidade.edu"
          leftSection={<IconMail size={14} />}
          value={data.email || ""}
          onChange={(e) => onChange("email", e.currentTarget.value)}
          size="sm"
        />
      </SectionBlock>

      {/* Redes Sociais Gerais, uma abaixo da outra para inserir o link. */}
      <SectionBlock icon={<IconLink size={14} />} title="Redes Sociais">
        <Stack gap="xs">
          {/* Link do Linkedin */}
          <TextInput
            label="LinkedIn"
            placeholder="linkedin.com/in/usuario"
            leftSection={<IconBrandLinkedin size={14} />}
            value={socialLinks.linkedin || ""}
            onChange={(e) => updateSocialLink("linkedin", e.currentTarget.value)}
            size="sm"
          />
          {/* Link do Github */}
          <TextInput
            label="GitHub"
            placeholder="github.com/usuario"
            leftSection={<IconBrandGithub size={14} />}
            value={socialLinks.github || ""}
            onChange={(e) => updateSocialLink("github", e.currentTarget.value)}
            size="sm"
          />
          {/* Link do site pessoal */}
          <TextInput
            label="Site Pessoal"
            placeholder="example.com"
            leftSection={<IconWorld size={14} />}
            value={socialLinks.personalWebsite || ""}
            onChange={(e) => updateSocialLink("personalWebsite", e.currentTarget.value)}
            size="sm"
          />
          {/* Lattes */}
          <TextInput
            label="Lattes"
            placeholder="lattes.cnpq.br/..."
            leftSection={<IconLink size={14} />}
            value={socialLinks.lattes || ""}
            onChange={(e) => updateSocialLink("lattes", e.currentTarget.value)}
            size="sm"
          />
          {/* Google Scholar */}
          <TextInput
            label="Google Scholar"
            placeholder="scholar.google.com/citations?user=..."
            leftSection={<IconLink size={14} />}
            value={socialLinks.googleScholar || ""}
            onChange={(e) => updateSocialLink("googleScholar", e.currentTarget.value)}
            size="sm"
          />
          {/* ORCID */}
          <TextInput
            label="ORCID"
            placeholder="orcid.org/0000-0000-0000-0000"
            leftSection={<IconLink size={14} />}
            value={socialLinks.orcid || ""}
            onChange={(e) => updateSocialLink("orcid", e.currentTarget.value)}
            size="sm"
          />
        </Stack>
      </SectionBlock>

      {/* Seção com informações "fixas" e adicionáveis. Infos em "placas" */}

      {/* Research Interests */}
      <SectionBlock icon={<IconFlask size={14} />} title="Pesquisas de Interesse">
        <TagListEditor
        //possível label com tradução da seção:
          //label="Áreas de interesse"
          values={data.researchInterests || []}
          onChange={(val) => onChange("researchInterests", val)}
          placeholder="Ex: Artificial Intelligence"
        />
      </SectionBlock>

      {/* Technologies */}
      <SectionBlock icon={<IconCode size={14} />} title="Tecnologias">
        <TagListEditor
        //possível label com tradução da seção:
          //label="Tecnologias utilizadas"
          values={data.technologies || []}
          onChange={(val) => onChange("technologies", val)}
          placeholder="Ex: Python"
        />
      </SectionBlock>

      {/* Knowledge */}
      <SectionBlock icon={<IconBrain size={14} />} title="Conhecimento">
        <TagListEditor
        //possível label com tradução da seção:
          //label="Áreas de conhecimento"
          values={data.knowledge || []}
          onChange={(val) => onChange("knowledge", val)}
          placeholder="Ex: Frontend"
        />
      </SectionBlock>
    </Stack>
  );
}
