"use client";

/**
 * Editor em formato de formulário em blocos para membros de TEAM.
 *
 * Cria uma nova "page" para preenchimento no estilo de formulário,
 * sendo outra opção da textarea JSON.
 */

import {
  Stack,
  Select,
  TextInput,
  Textarea,
  Text,
  Group,
  Badge,
  ActionIcon,
  Button,
  SimpleGrid,
  Switch,
  List,
  Select,
  Space,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  IconWorld,
  IconBook,
  IconCake,
  IconLink,
  IconFlask,
  IconCode,
  IconBrain,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { TeamMemberData } from "@/lib/types";
import { VALID_POSITIONS } from "@/lib/validations";
import { SectionBlock } from "./SectionBlock";
import { TagListEditor } from "./TagListEditor";
import { FieldLabel } from "./FieldLabel";
import ImageUploadButton from "./ImageUploadButton";

interface TeamMemberFormEditorProps {
  data: TeamMemberData;
  onChange: (
    field: keyof TeamMemberData,
    value: TeamMemberData[keyof TeamMemberData]
  ) => void;
  tooltip?: React.ReactNode;
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
                required
                tooltip={
                  <Stack gap={4}>
                    {/* <Badge size="xs" color="red">Obrigatório</Badge> */}
                    <List size="xs" spacing={4}>
                      <List.Item>Formato <strong>First Last</strong> (sem títulos como Dr., Prof.).</List.Item>
                      <List.Item>Mínimo 3, máximo 100 caracteres.</List.Item>
                      <List.Item>Ex.: "João Silva". Evite apelidos ou apenas iniciais.</List.Item>
                    </List>
                  </Stack>
                }
              />
            }
            placeholder="Nome completo"
            value={data.name || ""}
            onChange={(e) => onChange("name", e.currentTarget.value)}
            size="sm"
          />
          {/* Cargo/Posição que o membro do TEAM possui */}
          <Select
            label="Cargo / Posição"
            placeholder="Selecione um cargo"
            data={VALID_POSITIONS}
            value={data.position || ""}
            onChange={(value) => onChange("position", value || "")}
          <Select
            label={
              <FieldLabel
                text="Cargo / Posição"
                required
                tooltip={
                  <Stack gap={4}>
                    <Text size="xs">Escolha exatamente um:</Text>
                    <Group gap={4} wrap="wrap">
                      {[
                        "Laboratory Head",
                        "Postdoctoral Researcher",
                        "PhD Student",
                        "MSc Student",
                        "BSc Student",
                        "Collaborator",
                        "Alumni",
                      ].map((p) => (
                        <Badge key={p} size="xs" variant="outline" color="gray">{p}</Badge>
                      ))}
                    </Group>
                  </Stack>
                }
              />
            }
            placeholder="Selecione o cargo / posição"
            data={[
              "Laboratory Head",
              "Postdoctoral Researcher",
              "PhD Student",
              "MSc Student",
              "BSc Student",
              "Collaborator",
              "Alumni",
            ]}
            value={data.position || null}
            onChange={(val) => onChange("position", val ?? "")}
            size="sm"
          />
          <TextInput
            label={
              <FieldLabel
                text="Universidade"
                tooltip={
                  <Stack gap={4}>
                    <List size="xs" spacing={4}>
                      <List.Item>Valor padrão: <strong>PUC-Rio</strong>. Não altere se for da PUC.</List.Item>
                      <List.Item>Caso contrário, insira a sigla da sua instituição.</List.Item>
                      <List.Item>Ex.: UERJ, UFRJ, MIT.</List.Item>
                    </List>
                  </Stack>
                }
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
                required
                tooltip={
                  <Stack gap={4}>
                    <Text size="xs">Formato DD/MM/AAAA. Ex.: 25/03/1990.</Text>
                  </Stack>
                }
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
              required
              tooltip={
                <Stack gap={4}>
                  <List size="xs" spacing={4}>
                    <List.Item>Email válido — identificador único na planilha.</List.Item>
                    <List.Item>Não pode ser alterado após salvar.</List.Item>
                    <List.Item>Evite exemplo@example.com ou similares.</List.Item>
                  </List>
                </Stack>
              }
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
              required
              tooltip={
                <Stack gap={4}>
                  <List size="xs" spacing={4}>
                    <List.Item>50–750 caracteres.</List.Item>
                    <List.Item>Foque em formação, projetos, interesses e experiências.</List.Item>
                    <List.Item>Sugestão: <strong>&lt;NAME&gt; is a &lt;POSITION&gt; ...</strong></List.Item>
                    <List.Item>Ex.: "João Silva is a MSc. Student interested in machine learning..."</List.Item>
                  </List>
                </Stack>
              }
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
          label="URL da Foto"
          description="JPG, JPEG ou PNG. Proporção 3:4 recomendada."
          value={data.imageUrl || ""}
          onChange={(url) => onChange("imageUrl", url)}
        />
      </SectionBlock>

      {/* Descrição - ANTIGA */}
      {/*
      <SectionBlock icon={<IconBook size={14} />} title="Descrição" required>
        <Textarea
          label={
            <FieldLabel
              text="Descrição"
              tooltip={
                <Stack gap={4}>
                  <List size="xs" spacing={4}>
                    <List.Item>50–750 caracteres.</List.Item>
                    <List.Item>Foque em formação, projetos, interesses e experiências.</List.Item>
                    <List.Item>Sugestão: <strong>&lt;NAME&gt; is a &lt;POSITION&gt; ...</strong></List.Item>
                    <List.Item>Ex.: "João Silva is a MSc. Student interested in machine learning..."</List.Item>
                  </List>
                </Stack>
              }
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
      </SectionBlock>
      */}

      {/* Contato - ANTIGO*/}
      {/*
      <SectionBlock icon={<IconMail size={14} />} title="Contato" required>
        <TextInput
          label={
            <FieldLabel
              text="Email"
              tooltip={
                <Stack gap={4}>
                  <List size="xs" spacing={4}>
                    <List.Item>Email válido — identificador único na planilha.</List.Item>
                    <List.Item>Não pode ser alterado após salvar.</List.Item>
                    <List.Item>Evite exemplo@example.com ou similares.</List.Item>
                  </List>
                </Stack>
              }
            />
          }
          placeholder="membro@universidade.edu"
          leftSection={<IconMail size={14} />}
          value={data.email || ""}
          onChange={(e) => onChange("email", e.currentTarget.value)}
          size="sm"
        />
      </SectionBlock>
      */}

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
                tooltip={<Text size="xs">Ex.: linkedin.com/in/usuario.</Text>}
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
              <FieldLabel
                text="GitHub"
                tooltip={<Text size="xs">Ex.: github.com/usuario.</Text>}
              />
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
                tooltip={<Text size="xs">Ex.: example.com.</Text>}
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
              <FieldLabel
                text="Lattes"
                tooltip={<Text size="xs">Ex.: lattes.cnpq.br/1234567890123456.</Text>}
              />
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
                tooltip={<Text size="xs">Ex.: scholar.google.com/citations?user=XXXXX.</Text>}
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
              <FieldLabel
                text="ORCID"
                tooltip={<Text size="xs">Ex.: orcid.org/0000-0000-0000-0000.</Text>}
              />
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
      <SectionBlock icon={<IconFlask size={14} />} title="Pesquisas de Interesse" required>
        <TagListEditor
        //possível label com tradução da seção:
          //label="Áreas de interesse"
          values={data.researchInterests || []}
          onChange={(val) => onChange("researchInterests", val)}
          placeholder="Ex: Artificial Intelligence"
          tooltip={
            <Stack gap={4}>
              <List size="xs" spacing={4}>
                <List.Item>2–10 itens, em inglês.</List.Item>
                <List.Item>Ex.: "Machine Learning", "Computer Vision", "NLP".</List.Item>
              </List>
            </Stack>
          }
        />
      </SectionBlock>

      {/* Technologies */}
      <SectionBlock icon={<IconCode size={14} />} title="Tecnologias" required>
        <TagListEditor
        //possível label com tradução da seção:
          //label="Tecnologias utilizadas"
          values={data.technologies || []}
          onChange={(val) => onChange("technologies", val)}
          placeholder="Ex: Python"
          tooltip={
            <Stack gap={4}>
              <List size="xs" spacing={4}>
                <List.Item>3–15 itens, em inglês.</List.Item>
                <List.Item>Ex.: "Python", "JavaScript", "TensorFlow", "React", "Docker".</List.Item>
              </List>
            </Stack>
          }
        />
      </SectionBlock>

      {/* Knowledge */}
      <SectionBlock icon={<IconBrain size={14} />} title="Conhecimento" required>
        <TagListEditor
        //possível label com tradução da seção:
          //label="Áreas de conhecimento"
          values={data.knowledge || []}
          onChange={(val) => onChange("knowledge", val)}
          placeholder="Ex: Frontend"
          tooltip={
            <Stack gap={4}>
              <List size="xs" spacing={4}>
                <List.Item>1–8 áreas, em inglês.</List.Item>
                <List.Item>Ex.: "Backend Development", "Data Science", "DevOps".</List.Item>
              </List>
            </Stack>
          }
        />
      </SectionBlock>
    </Stack>
  );
}