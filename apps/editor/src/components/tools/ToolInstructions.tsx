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
import InstructionsPanel from "../InstructionsPanel";

export default function ToolInstructions() {
  return (
    <InstructionsPanel title="Instruções de Tool">
      <SimpleGrid cols={2} spacing="md">
        {/* ID */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              id
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Identificador único do tool em formato <Code>kebab-case</Code>.
            </List.Item>
            <List.Item>
              Ex.: <Code>my-awesome-tool</Code>, <Code>data-analyzer-v2</Code>
            </List.Item>
            <List.Item>
              Apenas letras minúsculas, números e hífens. Sem espaços.
            </List.Item>
          </List>
        </Box>

        {/* Name */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              name
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>Nome legível do tool (3-60 caracteres).</List.Item>
            <List.Item>
              Ex.: "AI Content Generator", "Smart Dashboard"
            </List.Item>
          </List>
        </Box>

        {/* Tagline */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              tagline
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Frase curta descrevendo o propósito (10-100 caracteres).
            </List.Item>
            <List.Item>Ex.: "Transform data into insights with AI"</List.Item>
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
              description
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Descrição breve (2-3 sentenças, 50-300 caracteres).
            </List.Item>
            <List.Item>
              Explique o que o tool faz e seu propósito principal.
            </List.Item>
          </List>
        </Box>

        {/* Category */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              category
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <Text
              size="sm"
              mb={8}
              style={{ color: "var(--mantine-color-dark-7)" }}
            >
              Escolha uma categoria que melhor se adequa ao tool.
            </Text>
            Ex.: "Data Analysis", "Content Generation", "Image Processing",
            "Automation", "Visualization".
          </List>
        </Box>

        {/* Highlight Image URL */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              highlightImageUrl
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
              → cole o link.
            </List.Item>
            <List.Item>
              Formato: <Code>https://imgbox.com/XXXXXX</Code> ou URL direta.
            </List.Item>
            <List.Item>Imagem principal do tool (16:9 preferível).</List.Item>
          </List>
        </Box>

        {/* Duration */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              duration
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Formato: <Code>Jan 2025 – present</Code> ou{" "}
              <Code>Jan 2024 – Dec 2024</Code>
            </List.Item>
            <List.Item>
              Use hífen longo (–) entre as datas, não traço curto (-).
            </List.Item>
            <List.Item>Para projetos em andamento, use "present".</List.Item>
          </List>
        </Box>

        {/* Gallery Images */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              galleryImagesUrl
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>Array de URLs de imagens para galeria.</List.Item>
          </List>
        </Box>

        {/* Objectives */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              objectives
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>Lista de objetivos do projeto (1-5 itens).</List.Item>
          </List>
        </Box>

        {/* Features */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              features
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>Principais funcionalidades (2-8 itens).</List.Item>
          </List>
        </Box>

        {/* Tech Stack */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              techStack
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>Tecnologias utilizadas (2-10 itens).</List.Item>
          </List>
        </Box>

        {/* Team Relationships */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              team_relationships
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>Membros da equipe com seus cargos no projeto.</List.Item>
            <List.Item>
              Nota: Roles dentro dos parênteses são separados por
              ponto-e-vírgula.
            </List.Item>
          </List>
        </Box>

        {/* Publication Relationships */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              publication_relationships
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>Títulos de publicações relacionadas.</List.Item>
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
              links
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Links relacionados: <Code>webapp</Code>, <Code>github</Code>,{" "}
              <Code>api</Code>, <Code>docs</Code>
            </List.Item>
            <List.Item>
              URLs devem começar com <Code>http://</Code> ou{" "}
              <Code>https://</Code>
            </List.Item>
          </List>
        </Box>

        {/* Long Description */}
        <Box>
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              longDescription
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Descrição detalhada do projeto (200-2000 caracteres).
            </List.Item>
            <List.Item>
              Explique contexto, motivação, funcionalidades e impacto.
            </List.Item>
          </List>
        </Box>
      </SimpleGrid>
    </InstructionsPanel>
  );
}
