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
import { useState } from "react";
import { TeamMemberData } from "@/lib/types";

interface TeamMemberFormEditorProps {
  data: TeamMemberData;
  onChange: (field: keyof TeamMemberData, value: any) => void;
}

// Bloco "reutilizavel" que forma o visual de seção
// além disso, é usado por todos os outros blocos abaixo. Dentro dele
function SectionBlock({         //-> componente interno
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper withBorder radius="md" p="md" style={{ borderColor: "var(--mantine-color-gray-2)" }}>
      <Group gap="xs" mb="md">
        <ActionIcon variant="light" color="var(--primary)" size="sm" radius="xl">
          {icon}
        </ActionIcon>
        <Title order={6} style={{ color: "var(--primary)" }}>
          {title}
        </Title>
      </Group>
      {children}
    </Paper>
  );
}

// Bloco de lista (strings) de tags (researchInterests, technologies, knowledge)
// Possui badges (x) para remover as tags, input (+) para adicionar tags
function TagListEditor({
  //possível label com tradução da seção:
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
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
          variant="dark"
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

export default function TeamMemberFormEditor({
  data,
  onChange,
}: TeamMemberFormEditorProps) {
  const socialLinks = data.socialLinks || {};

  const updateSocialLink = (key: string, value: string) => {
    onChange("socialLinks", { ...socialLinks, [key]: value });
  };

  return (
    <Stack gap="md">
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
        {/* Inclusão por URL da foto do membro do TEAM */}
        <TextInput
          mt="xs"
          label="URL da Foto"
          placeholder="https://..."
          leftSection={<IconPhoto size={14} />}
          value={data.imageUrl || ""}
          onChange={(e) => onChange("imageUrl", e.currentTarget.value)}
          size="sm"
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
      <SectionBlock icon={<IconFlask size={14} />} title="Research Interests">
        <TagListEditor
        //possível label com tradução da seção:
          //label="Áreas de interesse"
          values={data.researchInterests || []}
          onChange={(val) => onChange("researchInterests", val)}
          placeholder="Ex: Artificial Intelligence"
        />
      </SectionBlock>

      {/* Technologies */}
      <SectionBlock icon={<IconCode size={14} />} title="Technologies">
        <TagListEditor
        //possível label com tradução da seção:
          //label="Tecnologias utilizadas"
          values={data.technologies || []}
          onChange={(val) => onChange("technologies", val)}
          placeholder="Ex: Python"
        />
      </SectionBlock>

      {/* Knowledge */}
      <SectionBlock icon={<IconBrain size={14} />} title="Knowledge">
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
