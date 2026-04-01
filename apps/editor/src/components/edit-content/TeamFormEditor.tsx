"use client";

import {
  Stack,
  Select,
  TextInput,
  Textarea,
  Text,
  Group,
  SimpleGrid,
  Switch,
  List,
  Space,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconWorld,
  IconCake,
  IconLink,
  IconFlask,
  IconCode,
  IconBrain,
} from "@tabler/icons-react";
import { TeamMemberData } from "@/lib/types";
import { VALID_POSITIONS } from "@/lib/validations";
import { SectionBlock } from "../SectionBlock";
import { TagListEditor } from "../TagListEditor";
import { FieldLabel } from "../FieldLabel";
import Tooltip from "../Tooltip";
import ImageUploadButton from "../ImageUploadButton";

const TEAM_FIELD_TOOLTIPS = {
  name: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Informe seu nome no formato <strong>First Last</strong>, sem títulos
          como Dr. ou Prof.
        </List.Item>
        <List.Item>Use entre 3 e 100 caracteres.</List.Item>
        <List.Item>
          Ex.: "João Silva". Evite apelidos ou apenas iniciais.
        </List.Item>
      </List>
    </Stack>
  ),
  position: (
    <Stack gap={4}>
      <Text size="xs">
        Selecione sua posição no time entre as opções disponíveis.
      </Text>
    </Stack>
  ),
  university: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Se você é da <strong>PUC-Rio</strong>, pode manter o valor padrão.
        </List.Item>
        <List.Item>
          Se não for, informe a sigla da sua instituição.
        </List.Item>
        <List.Item>Ex.: UERJ, UFRJ, MIT.</List.Item>
      </List>
    </Stack>
  ),
  birthday: (
    <Stack gap={4}>
      <Text size="xs">
        Informe a data usada para aniversário no formato DD/MM/AAAA.
      </Text>
    </Stack>
  ),
  email: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>Informe um email válido como seu identificador único.</List.Item>
        <List.Item>Esse email aparece no site, então escolha com critério.</List.Item>
        <List.Item>Depois de salvar, você não poderá alterá-lo.</List.Item>
      </List>
    </Stack>
  ),
  description: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>Escreva entre 50 e 750 caracteres.</List.Item>
        <List.Item>
          Foque na sua formação, nos seus projetos, interesses e experiências.
        </List.Item>
        <List.Item>
          Você pode seguir algo como{" "}
          <strong>&lt;NAME&gt; is a &lt;POSITION&gt; ...</strong>
        </List.Item>
        <List.Item>
          Ex.: "João Silva is a MSc. Student interested in machine learning..."
        </List.Item>
      </List>
    </Stack>
  ),
  socialLinks: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>Todos os campos desta seção são opcionais.</List.Item>
        <List.Item>
          Se quiser, adicione seu link ou identificador público em cada
          plataforma.
        </List.Item>
        <List.Item>
          Use os placeholders de cada campo como referência de formato.
        </List.Item>
      </List>
    </Stack>
  ),
  researchInterests: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>Adicione de 2 a 10 interesses de pesquisa, em inglês.</List.Item>
        <List.Item>
          Inclua temas e áreas que você pesquisa ou quer pesquisar mais a
          fundo.
        </List.Item>
        <List.Item>
          Ex.: "Machine Learning", "Computer Vision", "NLP".
        </List.Item>
      </List>
    </Stack>
  ),
  technologies: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>Adicione de 3 a 15 tecnologias, em inglês.</List.Item>
        <List.Item>
          Liste ferramentas, linguagens, frameworks, bibliotecas e plataformas
          que você usa no seu trabalho.
        </List.Item>
        <List.Item>
          Ex.: "Python", "JavaScript", "TensorFlow", "React", "Docker".
        </List.Item>
      </List>
    </Stack>
  ),
  knowledge: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>Adicione de 1 a 8 áreas de conhecimento, em inglês.</List.Item>
        <List.Item>
          Inclua frentes mais amplas da sua atuação ou especialidade, além de
          tecnologias específicas.
        </List.Item>
        <List.Item>
          Ex.: "Backend Development", "Data Science", "DevOps".
        </List.Item>
      </List>
    </Stack>
  ),
  alumni: (
    <Stack gap={4}>
      <Text size="xs">
        Marque esta opção se você já fez parte do time, mas não atua mais
        atualmente.
      </Text>
    </Stack>
  ),
} satisfies Record<string, React.ReactNode>;

interface TeamFormEditorProps {
  data: TeamMemberData;
  onChange: (
    field: keyof TeamMemberData,
    value: TeamMemberData[keyof TeamMemberData],
  ) => void;
}

export default function TeamFormEditor({
  data,
  onChange,
}: TeamFormEditorProps) {
  const socialLinks = data.socialLinks || {};

  const updateSocialLink = (key: string, value: string) => {
    onChange("socialLinks", { ...socialLinks, [key]: value });
  };

  return (
    <Stack gap="md">
      {/* Informações Básicas/Iniciais Padrão do membro do TEAM */}
      <SectionBlock
        icon={<IconUser size={14} />}
        title="Informações Básicas"
        headerRight={
          <Switch
            checked={Boolean(data.is_alumni)}
            onChange={(e) => onChange("is_alumni", e.currentTarget.checked)}
            size="sm"
            color="var(--primary)"
            labelPosition="left"
            label={
              <Group gap={4} wrap="nowrap">
                <Tooltip position="top">{TEAM_FIELD_TOOLTIPS.alumni}</Tooltip>
                <Text size="sm" fw={500}>
                  Alumni
                </Text>
              </Group>
            }
          />
        }
      >
        <SimpleGrid cols={2} spacing="xs">
          <TextInput
            label={
              <FieldLabel
                text="Nome"
                tooltip={TEAM_FIELD_TOOLTIPS.name}
                required
              />
            }
            placeholder="Seu nome completo"
            value={data.name || ""}
            onChange={(e) => onChange("name", e.currentTarget.value)}
            size="sm"
          />
          {/* Cargo/Posição que o membro do TEAM possui */}
          <Select
            label={
              <FieldLabel
                text="Cargo / Posição"
                tooltip={TEAM_FIELD_TOOLTIPS.position}
                required
              />
            }
            placeholder="Selecione sua posição no time"
            data={VALID_POSITIONS}
            value={data.position || null}
            onChange={(val) => onChange("position", val ?? "")}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="Universidade"
                tooltip={TEAM_FIELD_TOOLTIPS.university}
              />
            }
            placeholder="Sua instituição. Ex.: PUC-Rio"
            value={data.university || ""}
            onChange={(e) => onChange("university", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="Data de Nascimento"
                tooltip={TEAM_FIELD_TOOLTIPS.birthday}
                required
              />
            }
            placeholder="DD/MM/AAAA"
            leftSection={<IconCake size={14} />}
            value={data.birthday || ""}
            onChange={(e) => onChange("birthday", e.currentTarget.value)}
            size="sm"
          />
        </SimpleGrid>

        {/* Contato - ATT */}
        <Space h="md" />
        <TextInput
          label={
            <FieldLabel
              text="Email de contato"
              tooltip={TEAM_FIELD_TOOLTIPS.email}
              required
            />
          }
          placeholder="seuemail@universidade.edu"
          leftSection={<IconMail size={14} />}
          value={data.email || ""}
          onChange={(e) => onChange("email", e.currentTarget.value)}
          size="sm"
        />

        {/* Descrição - ATT */}
        <Space h="md" />
        <Textarea
          label={
            <FieldLabel
              text="Descrição"
              tooltip={TEAM_FIELD_TOOLTIPS.description}
              required
            />
          }
          placeholder="Escreva sua descrição..."
          value={data.description || ""}
          onChange={(e) => onChange("description", e.currentTarget.value)}
          autosize
          minRows={3}
          maxRows={6}
          size="sm"
        />

        <ImageUploadButton
          label="Foto de Perfil"
          description="Envie uma imagem JPG, JPEG ou PNG. A proporção 3:4 é a mais indicada."
          value={data.imageUrl || ""}
          onChange={(url) => onChange("imageUrl", url)}
        />
      </SectionBlock>

      {/* Redes Sociais */}
      <SectionBlock
        icon={<IconLink size={14} />}
        title="Redes Sociais"
        tooltip={TEAM_FIELD_TOOLTIPS.socialLinks}
      >
        <Stack gap="xs">
          <TextInput
            label="LinkedIn"
            placeholder="linkedin.com/in/usuario"
            leftSection={<IconBrandLinkedin size={14} />}
            value={socialLinks.linkedin || ""}
            onChange={(e) =>
              updateSocialLink("linkedin", e.currentTarget.value)
            }
            size="sm"
          />
          <TextInput
            label="GitHub"
            placeholder="github.com/usuario"
            leftSection={<IconBrandGithub size={14} />}
            value={socialLinks.github || ""}
            onChange={(e) => updateSocialLink("github", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="Site Pessoal"
            placeholder="example.com"
            leftSection={<IconWorld size={14} />}
            value={socialLinks.personalWebsite || ""}
            onChange={(e) =>
              updateSocialLink("personalWebsite", e.currentTarget.value)
            }
            size="sm"
          />
          <TextInput
            label="Lattes"
            placeholder="lattes.cnpq.br/..."
            leftSection={<IconLink size={14} />}
            value={socialLinks.lattes || ""}
            onChange={(e) => updateSocialLink("lattes", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label="Google Scholar"
            placeholder="scholar.google.com/citations?user=..."
            leftSection={<IconLink size={14} />}
            value={socialLinks.googleScholar || ""}
            onChange={(e) =>
              updateSocialLink("googleScholar", e.currentTarget.value)
            }
            size="sm"
          />
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

      {/* Research Interests */}
      <SectionBlock
        icon={<IconFlask size={14} />}
        title="Pesquisas de Interesse"
        required
        tooltip={TEAM_FIELD_TOOLTIPS.researchInterests}
      >
        <TagListEditor
          //possível label com tradução da seção:
          //label="Áreas de interesse"
          values={data.researchInterests || []}
          onChange={(val) => onChange("researchInterests", val)}
          placeholder="Ex: Artificial Intelligence"
        />
      </SectionBlock>

      {/* Technologies */}
      <SectionBlock
        icon={<IconCode size={14} />}
        title="Tecnologias"
        required
        tooltip={TEAM_FIELD_TOOLTIPS.technologies}
      >
        <TagListEditor
          //possível label com tradução da seção:
          //label="Tecnologias utilizadas"
          values={data.technologies || []}
          onChange={(val) => onChange("technologies", val)}
          placeholder="Ex: Python"
        />
      </SectionBlock>

      {/* Knowledge */}
      <SectionBlock
        icon={<IconBrain size={14} />}
        title="Conhecimento"
        required
        tooltip={TEAM_FIELD_TOOLTIPS.knowledge}
      >
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
