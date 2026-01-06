"use client";

import React from "react";
import {
  Container,
  Box,
  Text,
  Paper,
  Group,
  Stack,
  Divider,
  Button,
  Title,
  SimpleGrid,
  Badge,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconUsers,
  IconFileText,
  IconClock,
  IconSparkles,
  IconFlask,
  IconTool,
} from "@tabler/icons-react";

import SectionTitle from "@/components/main-app-components/SectionTitle";
import DurationInfo from "@/components/main-app-components/DurationInfo";
import ProjectCard from "@/components/main-app-components/ProjectCard";
// Using shared SectionTitle and DurationInfo from main-app-components

// Tipos
export type ResearchPublication = {
  title: string;
  link?: string;
  authors_list?: string;
  publication_place?: string;
  citation_number?: number;
  year?: number;
};

export type ResearchProject = {
  name: string;
  imageUrl: string;
  description: string;
};

export type ResearchTeamMember = {
  name: string;
  roles?: string[];
};

export type ResearchData = {
  name: string;
  shortDescription: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  duration: string;
  projects?: ResearchProject[];
  team_relationships?: Array<{ name: string; roles: string[] }>;
  publication_relationships?: string[];
  tools_relationships?: string[];
};

export interface ResearchDetailViewProps {
  research: ResearchData;
  teamMembers?: ResearchTeamMember[];
  publications?: ResearchPublication[];
  tools?: string[];
  isMobile: boolean;
  onBack?: () => void;
}

export default function ResearchDetailView({
  research,
  teamMembers = [],
  publications = [],
  tools = [],
  isMobile,
  onBack,
}: ResearchDetailViewProps) {
  // Textos estáticos (adaptados para o editor)
  const texts = {
    backButton: "Back",
    durationLabel: "Duration",
    sections: {
      about: { title: "About" },
      projects: { title: "Projects" },
      team: { title: "Team" },
      publications: { title: "Publications" },
      tools: { title: "Tools" },
    },
  };

  // Normaliza team: usa teamMembers externos ou team_relationships da planilha
  const normalizedTeam: ResearchTeamMember[] =
    teamMembers.length > 0
      ? teamMembers
      : (research.team_relationships || []).map((rel) => ({
          name: rel.name,
          roles: rel.roles,
        }));

  // Normaliza publications: usa props ou publication_relationships simples
  const hasDetailedPublications = publications.length > 0;
  const simplePublicationTitles = research.publication_relationships || [];

  // Normaliza tools: usa props ou tools_relationships simples
  const simpleToolNames =
    Array.isArray(tools) && tools.length > 0
      ? tools
      : research.tools_relationships || [];

  return (
    <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
      {/* Botão de voltar */}
      {onBack && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            leftSection={<IconArrowLeft size={20} />}
            variant="white"
            color="var(--primary)"
            mb={isMobile ? 20 : 32}
            onClick={onBack}
          >
            {texts.backButton}
          </Button>
        </motion.div>
      )}

      {/* Conteúdo principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Box
          style={{
            width: "100%",
            height: isMobile ? 280 : 420, // altura aumentada
            overflow: "hidden",
            backgroundImage: `url(${research.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        />
        <Paper
          shadow="xl"
          p={isMobile ? "lg" : "xl"}
          mb={isMobile ? 24 : 32}
          style={{
            bordemrTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            backdropFilter: "blur(10px)",
            paddingTop: 0, // tira o padding de cima pra imagem ocupar o topo
          }}
        >
          {/* Hero Section */}
          <Box mb={isMobile ? "xl" : 48}>
            <Stack gap="md">
              <Box>
                {/* Linha com título e duração */}
                <Group
                  justify={isMobile ? "center" : "space-between"}
                  align="center"
                  wrap="wrap"
                  gap={12}
                  mb={isMobile ? "12px" : "8px"}
                >
                  {/* Título + Duração */}
                  <Group
                    align="center"
                    justify={isMobile ? "center" : "flex-start"}
                    wrap="wrap"
                    gap={12}
                  >
                    <Box
                      style={{
                        minWidth: 0,
                        textAlign: isMobile ? "center" : undefined,
                      }}
                    >
                      <Title
                        order={1}
                        size={isMobile ? "h2" : "38px"}
                        c="var(--primary)"
                        ta={isMobile ? "center" : undefined}
                      >
                        {research.name}
                      </Title>
                    </Box>

                    {/* Duração */}
                    <DurationInfo
                      icon={<IconClock size={14} color="var(--primary)" />}
                      label={texts.durationLabel}
                      value={research.duration}
                      size={isMobile ? "sm" : "md"}
                    />
                  </Group>
                </Group>

                {/* Descrição curta */}
                <Text
                  size={isMobile ? "md" : "lg"}
                  fw={600}
                  c="dimmed"
                  style={{
                    textAlign: isMobile ? "justify" : undefined,
                  }}
                >
                  {research.shortDescription}
                </Text>
              </Box>
            </Stack>
          </Box>

          <Divider mb={isMobile ? "xl" : 48} />

          {/* Descrição longa */}
          {research.longDescription && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconSparkles size={isMobile ? 20 : 24} />}
                title={texts.sections.about.title}
                isMobile={isMobile}
              />
              <Text
                size={isMobile ? "sm" : "md"}
                c="dimmed"
                lh={1.8}
                style={{
                  textAlign: "justify",
                  padding: isMobile ? "0" : "0 8px",
                }}
              >
                {research.longDescription}
              </Text>
            </Box>
          )}

          {/* Projetos */}
          {Array.isArray(research.projects) && research.projects.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconFlask size={isMobile ? 20 : 24} />}
                title={texts.sections.projects.title}
                isMobile={isMobile}
              />
              <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3 }}
                spacing={isMobile ? "lg" : "xl"}
              >
                {research.projects.map((project, idx) => (
                  <ProjectCard
                    key={idx}
                    name={project.name}
                    imageUrl={project.imageUrl}
                    description={project.description}
                    index={idx}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Team Members - Simplificado */}
          {normalizedTeam.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconUsers size={isMobile ? 20 : 24} />}
                title={texts.sections.team.title}
                isMobile={isMobile}
              />
              {/* Nota informativa sobre simplificação */}
              <Text size={isMobile ? "xs" : "sm"} c="dimmed" mb="sm">
                **A renderização de "Team" foi simplificada (a renderização real
                não é nesse formato).
              </Text>
              <Group gap="xs" style={{ flexWrap: "wrap" }}>
                {normalizedTeam.map((person, index) => (
                  <Badge
                    key={`${person.name}-${index}`}
                    variant="light"
                    color="var(--primary)"
                    size="lg"
                    radius="lg"
                    style={{ paddingLeft: 8, paddingRight: 8 }}
                  >
                    {person.name}
                    {person.roles && person.roles.length > 0 && (
                      <Text
                        component="span"
                        size="xs"
                        c="dimmed"
                        ml={4}
                        style={{ fontWeight: 400 }}
                      >
                        ({person.roles.join(", ")})
                      </Text>
                    )}
                  </Badge>
                ))}
              </Group>
            </Box>
          )}

          {/* Publications - Simplificado */}
          {(hasDetailedPublications || simplePublicationTitles.length > 0) && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconFileText size={isMobile ? 20 : 24} />}
                title={texts.sections.publications.title}
                isMobile={isMobile}
              />
              {/* Nota informativa sobre simplificação */}
              <Text size={isMobile ? "xs" : "sm"} c="dimmed" mb="sm">
                **A renderização de "Publications" foi simplificada (a
                renderização real não é nesse formato).
              </Text>
              <Stack gap="xs">
                {hasDetailedPublications
                  ? publications.map((publication, idx) => (
                      <Text key={idx} size={isMobile ? "sm" : "md"} c="dimmed">
                        • {publication.title}
                        {publication.year && ` (${publication.year})`}
                      </Text>
                    ))
                  : simplePublicationTitles.map((title, idx) => (
                      <Text key={idx} size={isMobile ? "sm" : "md"} c="dimmed">
                        • {title}
                      </Text>
                    ))}
              </Stack>
            </Box>
          )}

          {/* Associated Tools - Simplificado */}
          {simpleToolNames.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconTool size={isMobile ? 20 : 24} />}
                title={texts.sections.tools.title}
                isMobile={isMobile}
              />
              {/* Nota informativa sobre simplificação */}
              <Text size={isMobile ? "xs" : "sm"} c="dimmed" mb="sm">
                **A renderização de "Tools" foi simplificada (a renderização
                real não é nesse formato).
              </Text>
              <Group gap="xs" style={{ flexWrap: "wrap" }}>
                {simpleToolNames.map((toolName, index) => (
                  <Badge
                    key={`${toolName}-${index}`}
                    variant="light"
                    color="var(--primary)"
                    size="lg"
                    radius="lg"
                    leftSection={<IconTool size={14} />}
                  >
                    {toolName}
                  </Badge>
                ))}
              </Group>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
}
