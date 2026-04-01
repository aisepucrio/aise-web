"use client";

import {
  Stack,
  Select,
  TextInput,
  Textarea,
  Text,
  Group,
  Badge,
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
import ImageUploadButton from "../ImageUploadButton";

const TEAM_FIELD_TOOLTIPS = {
  name: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Formato <strong>First Last</strong> (sem títulos como Dr., Prof.).
        </List.Item>
        <List.Item>Mínimo 3, máximo 100 caracteres.</List.Item>
        <List.Item>
          Ex.: "João Silva". Evite apelidos ou apenas iniciais.
        </List.Item>
      </List>
    </Stack>
  ),
  position: (
    <Stack gap={4}>
      <Text size="xs">Escolha exatamente um:</Text>
      <Group gap={4} wrap="wrap">
        {VALID_POSITIONS.map((position) => (
          <Badge key={position} size="xs" variant="outline" color="gray">
            {position}
          </Badge>
        ))}
      </Group>
    </Stack>
  ),
  university: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>
          Valor padrão: <strong>PUC-Rio</strong>. Não altere se for da PUC.
        </List.Item>
        <List.Item>
          Caso contrário, insira a sigla da sua instituição.
        </List.Item>
        <List.Item>Ex.: UERJ, UFRJ, MIT.</List.Item>
      </List>
    </Stack>
  ),
  birthday: (
    <Stack gap={4}>
      <Text size="xs">Formato DD/MM/AAAA. Ex.: 25/03/1990.</Text>
    </Stack>
  ),
  email: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>Email válido — identificador único na planilha.</List.Item>
        <List.Item>Não pode ser alterado após salvar.</List.Item>
        <List.Item>Evite exemplo@example.com ou similares.</List.Item>
      </List>
    </Stack>
  ),
  description: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>50–750 caracteres.</List.Item>
        <List.Item>
          Foque em formação, projetos, interesses e experiências.
        </List.Item>
        <List.Item>
          Sugestão: <strong>&lt;NAME&gt; is a &lt;POSITION&gt; ...</strong>
        </List.Item>
        <List.Item>
          Ex.: "João Silva is a MSc. Student interested in machine learning..."
        </List.Item>
      </List>
    </Stack>
  ),
  linkedin: <Text size="xs">Ex.: linkedin.com/in/usuario.</Text>,
  github: <Text size="xs">Ex.: github.com/usuario.</Text>,
  personalWebsite: <Text size="xs">Ex.: example.com.</Text>,
  lattes: <Text size="xs">Ex.: lattes.cnpq.br/1234567890123456.</Text>,
  googleScholar: (
    <Text size="xs">Ex.: scholar.google.com/citations?user=XXXXX.</Text>
  ),
  orcid: <Text size="xs">Ex.: orcid.org/0000-0000-0000-0000.</Text>,
  researchInterests: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>2–10 itens, em inglês.</List.Item>
        <List.Item>
          Ex.: "Machine Learning", "Computer Vision", "NLP".
        </List.Item>
      </List>
    </Stack>
  ),
  technologies: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>3–15 itens, em inglês.</List.Item>
        <List.Item>
          Ex.: "Python", "JavaScript", "TensorFlow", "React", "Docker".
        </List.Item>
      </List>
    </Stack>
  ),
  knowledge: (
    <Stack gap={4}>
      <List size="xs" spacing={4}>
        <List.Item>1–8 áreas, em inglês.</List.Item>
        <List.Item>
          Ex.: "Backend Development", "Data Science", "DevOps".
        </List.Item>
      </List>
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
      <Switch
        checked={Boolean(data.is_alumni)}
        onChange={(e) => onChange("is_alumni", e.currentTarget.checked)}
        label="É alumni"
        size="md"
        color="var(--primary)"
      />
      {/* Informações Básicas/Iniciais Padrão do membro do TEAM */}
      <SectionBlock icon={<IconUser size={14} />} title="Informações Básicas">
        <SimpleGrid cols={2} spacing="xs">
          <TextInput
            label={
              <FieldLabel
                text="Nome"
                tooltip={TEAM_FIELD_TOOLTIPS.name}
                required
              />
            }
            placeholder="Nome completo"
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
            placeholder="Selecione o cargo / posição"
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
            placeholder="Ex: PUC-Rio"
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
          placeholder="membro@universidade.edu"
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
          placeholder="Escreva a descrição do membro..."
          value={data.description || ""}
          onChange={(e) => onChange("description", e.currentTarget.value)}
          autosize
          minRows={3}
          maxRows={6}
          size="sm"
        />

        <ImageUploadButton
          label="Foto de Perfil"
          description="JPG, JPEG ou PNG. Proporção 3:4 recomendada."
          value={data.imageUrl || ""}
          onChange={(url) => onChange("imageUrl", url)}
        />
      </SectionBlock>

      {/* Redes Sociais */}
      <SectionBlock icon={<IconLink size={14} />} title="Redes Sociais">
        <Stack gap="xs">
          <Text size="xs" c="dimmed">
            Os links de Redes Sociais são opcionais.
          </Text>
          <TextInput
            label={
              <FieldLabel
                text="LinkedIn"
                tooltip={TEAM_FIELD_TOOLTIPS.linkedin}
              />
            }
            placeholder="linkedin.com/in/usuario"
            leftSection={<IconBrandLinkedin size={14} />}
            value={socialLinks.linkedin || ""}
            onChange={(e) =>
              updateSocialLink("linkedin", e.currentTarget.value)
            }
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel text="GitHub" tooltip={TEAM_FIELD_TOOLTIPS.github} />
            }
            placeholder="github.com/usuario"
            leftSection={<IconBrandGithub size={14} />}
            value={socialLinks.github || ""}
            onChange={(e) => updateSocialLink("github", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="Site Pessoal"
                tooltip={TEAM_FIELD_TOOLTIPS.personalWebsite}
              />
            }
            placeholder="example.com"
            leftSection={<IconWorld size={14} />}
            value={socialLinks.personalWebsite || ""}
            onChange={(e) =>
              updateSocialLink("personalWebsite", e.currentTarget.value)
            }
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel text="Lattes" tooltip={TEAM_FIELD_TOOLTIPS.lattes} />
            }
            placeholder="lattes.cnpq.br/..."
            leftSection={<IconLink size={14} />}
            value={socialLinks.lattes || ""}
            onChange={(e) => updateSocialLink("lattes", e.currentTarget.value)}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="Google Scholar"
                tooltip={TEAM_FIELD_TOOLTIPS.googleScholar}
              />
            }
            placeholder="scholar.google.com/citations?user=..."
            leftSection={<IconLink size={14} />}
            value={socialLinks.googleScholar || ""}
            onChange={(e) =>
              updateSocialLink("googleScholar", e.currentTarget.value)
            }
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel text="ORCID" tooltip={TEAM_FIELD_TOOLTIPS.orcid} />
            }
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
