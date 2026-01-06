"use client";

import { Box, Group, Text, Badge, List, SimpleGrid } from "@mantine/core";
import InstructionsPanel from "@/components/InstructionsPanel";

export default function ResearchInstructions() {
  return (
    <InstructionsPanel title="Instruções de Research Line">
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
              Identificador único da research line em formato{" "}
              <code>kebab-case</code>.
            </List.Item>
            <List.Item>
              Ex.: <code>ai-for-health</code>, <code>quantum-computing</code>
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
            <List.Item>
              Nome legível da research line (3-80 caracteres).
            </List.Item>
            <List.Item>
              Ex.: "Artificial Intelligence for Healthcare", "Quantum Computing
              Applications"
            </List.Item>
          </List>
        </Box>

        {/* Short Description */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              shortDescription
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Descrição breve (2-3 sentenças, mínimo 50 caracteres).
            </List.Item>
            <List.Item>
              Explique o foco principal e objetivo da linha de pesquisa.
            </List.Item>
          </List>
        </Box>

        {/* Long Description */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              longDescription
            </Text>
            <Badge size="xs" color="red">
              Obrigatório
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Descrição detalhada (mínimo 100 caracteres, idealmente 300-800).
            </List.Item>
            <List.Item>
              Contextualize o background, objetivos, metodologias e impacto
              esperado.
            </List.Item>
            <List.Item>Use múltiplos parágrafos se necessário.</List.Item>
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
              Upload no <strong>Imgbox</strong> (
              <a
                href="https://imgbox.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                imgbox.com
              </a>
              ) → Family Safe Upload → cole o link.
            </List.Item>
            <List.Item>
              Formato: <code>https://imgbox.com/XXXXXX</code> ou URL direta.
            </List.Item>
            <List.Item>
              Imagem principal representativa da research line (16:9
              preferível).
            </List.Item>
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
              Formato: <code>Jan 2025 – present</code> ou{" "}
              <code>Jan 2024 – Dec 2024</code>
            </List.Item>
            <List.Item>
              Use hífen longo (–) entre as datas, não traço curto (-).
            </List.Item>
            <List.Item>
              Para research lines em andamento, use &quot;present&quot;.
            </List.Item>
          </List>
        </Box>

        {/* Projects */}
        <Box mb="md">
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              projects
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Array de projetos dentro desta research line (1-6 projetos
              recomendado).
            </List.Item>
            <List.Item>
              Cada projeto tem: <code>name</code>, <code>imageUrl</code>,{" "}
              <code>description</code>.
            </List.Item>
            <List.Item>
              Ex.:{" "}
              <code>
                [
                {`{name: "Project Alpha", imageUrl: "...", description: "..."}`}
                ]
              </code>
            </List.Item>
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
            <List.Item>
              Lista de membros envolvidos na research line e seus roles.
            </List.Item>
            <List.Item>
              Use o componente &quot;Team Relationships&quot; no modo formulário
              para adicionar.
            </List.Item>
            <List.Item>
              Formato JSON:{" "}
              <code>
                [{`{name: "John Doe", roles: ["Lead Researcher", "Advisor"]}`}]
              </code>
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
            <List.Item>
              Array de títulos de publicações relacionadas (strings).
            </List.Item>
            <List.Item>
              Use o componente &quot;Publication Relationships&quot; no modo
              formulário.
            </List.Item>
            <List.Item>
              Ex.: <code>["Publication Title 1", "Publication Title 2"]</code>
            </List.Item>
          </List>
        </Box>

        {/* Tools Relationships */}
        <Box>
          <Group gap="xs" mb={6}>
            <Text
              fw={700}
              size="sm"
              style={{ color: "var(--mantine-color-dark-8)" }}
            >
              tools_relationships
            </Text>
            <Badge size="xs" color="gray">
              Opcional
            </Badge>
          </Group>
          <List size="sm" spacing={6}>
            <List.Item>
              Array de IDs de tools relacionados a esta research line.
            </List.Item>
            <List.Item>
              Use o componente &quot;Tool Relationships&quot; no modo
              formulário.
            </List.Item>
            <List.Item>
              Ex.: <code>["tool-id-1", "tool-id-2"]</code>
            </List.Item>
          </List>
        </Box>
      </SimpleGrid>
    </InstructionsPanel>
  );
}
