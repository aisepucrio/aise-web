"use client";

import {
  Box,
  Text,
  List,
  Badge,
  Anchor,
  SimpleGrid,
  Code,
  Group,
} from "@mantine/core";
import InstructionsPanel from "./InstructionsPanel";

export default function ProfileInstructions() {
  return (
    <InstructionsPanel title="Instruções de Perfil">
      <SimpleGrid cols={2} spacing="md">
        {/* Name */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              Name
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Informe seu nome no formato <Code>First Last</Code> (sem títulos
              como Dr., Prof., etc.). De preferência, um nome e um sobrenome.
            </List.Item>
            <List.Item>
              Comprimento: mínimo 3 caracteres, máximo 100 caracteres.
            </List.Item>
            <List.Item>
              Dicas: prefira usar o nome como quer que apareça publicamente
              (ex.: "João Silva"). Evite apelidos ou apenas iniciais.
            </List.Item>
          </List>
        </Box>

        {/* Image URL */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              Image URL
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Upload no{" "}
              <Anchor
                href="https://imgbox.com"
                target="_blank"
                style={{ color: "var(--mantine-color-blue-8)" }}
              >
                imgbox.com
              </Anchor>{" "}
              → cole o link em <Code>imageUrl</Code>.
            </List.Item>
            <List.Item>
              Link válido do imgbox: <Code>https://imgbox.com/XXXXXX</Code> ou
              URL direta da imagem.
            </List.Item>
            <List.Item>
              Foto 3:4 (retrato), rosto visível, boa iluminação e foco.
            </List.Item>
          </List>
        </Box>

        {/* Position */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              Position
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            {" "}
            <Text
              size="sm"
              mb={8}
              style={{ color: "var(--mantine-color-dark-7)" }}
            >
              Escolha exatamente um:
            </Text>
            <Group gap="xs" wrap="wrap">
              <Badge variant="outline" color="gray">
                Laboratory Head
              </Badge>
              <Badge variant="outline" color="gray">
                Postdoctoral Researcher
              </Badge>
              <Badge variant="outline" color="gray">
                PhD Student
              </Badge>
              <Badge variant="outline" color="gray">
                MSc Student
              </Badge>
              <Badge variant="outline" color="gray">
                BSc Student
              </Badge>
              <Badge variant="outline" color="gray">
                Collaborator
              </Badge>
              <Badge variant="outline" color="gray">
                Alumni
              </Badge>
            </Group>
          </List>
        </Box>

        {/* University */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              University
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Valor padrão: <Code>PUC-Rio</Code>. Não é altere ou exclua se você
              for da PUC.
            </List.Item>
            <List.Item>
              Caso contrário, insira a <Code>sigla</Code> completa de sua
              instituição.
            </List.Item>
            <List.Item>
              Ex.: <Code>UERJ</Code>, <Code>UFRJ</Code>, <Code>MIT</Code>
            </List.Item>
          </List>
        </Box>

        {/* Email */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              Email
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Email válido (identificador único na planilha).
            </List.Item>
            <List.Item>
              Evite <Code>exemplo@example.com</Code> ou similares.
            </List.Item>
          </List>
        </Box>

        {/* Description */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              Description
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Sugestão de formato (opcional):{" "}
              <Code>{"<NAME> is a <POSITION> ..."}</Code>
            </List.Item>
            <List.Item>50–750 caracteres.</List.Item>
            <List.Item>
              Foque em formação, projetos, interesses e experiências.
            </List.Item>
            <List.Item>
              Ex.:{" "}
              <Text span style={{ color: "var(--mantine-color-dark-6)" }}>
                “João Silva is a MSc. Student interested in machine learning and
                computer vision...”
              </Text>
            </List.Item>
          </List>
        </Box>

        {/* Research Interests */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              Research Interests
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>2–10 itens, em inglês.</List.Item>
            <List.Item>
              Ex.: “Machine Learning”, “Computer Vision”, “NLP”, “Software
              Engineering”.
            </List.Item>
          </List>
        </Box>

        {/* Technologies */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              Technologies
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>3–15 itens, em inglês.</List.Item>
            <List.Item>
              Ex.: “Python”, “JavaScript”, “TensorFlow”, “React”, “Docker”,
              “AWS”.
            </List.Item>
          </List>
        </Box>

        {/* knowledge */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              Knowledge
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>1–8 áreas, em inglês.</List.Item>
            <List.Item>
              Ex.: “Backend Development”, “Data Science”, “Mobile Development”,
              “DevOps”.
            </List.Item>
          </List>
        </Box>

        {/* Links */}
        <Box>
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              Links Acadêmicos e Profissionais
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Campos: <Code>lattes</Code>, <Code>personalWebsite</Code>,{" "}
              <Code>linkedin</Code>, <Code>github</Code>,{" "}
              <Code>googleScholar</Code>, <Code>orcid</Code>.
            </List.Item>
            <List.Item>Se não tiver, remova a linha.</List.Item>
            <List.Item>
              URLs começam com <Code>http://</Code> ou <Code>https://</Code>.
            </List.Item>
          </List>
        </Box>
      </SimpleGrid>
    </InstructionsPanel>
  );
}
