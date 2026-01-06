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
  IconTargetArrow,
  IconFileText,
  IconPhoto,
  IconCheck,
  IconStar,
  IconClock,
  IconSparkles,
  IconTerminal2,
} from "@tabler/icons-react";
import { ToolGallery } from "./ToolGallery";
import { BadgeBox } from "./BadgeBox";
import { SectionTitle } from "./SectionTitle";
import LinkGroup from "./LinkGroup";
import DurationInfo from "./DurationInfo";
import { IconList } from "./IconList";
import ImgboxImage from "../ImgboxImage";

// Links do tool
export type ToolLinks = {
  webapp?: string;
  github?: string;
  api?: string;
  docs?: string;
};

// Publicação completa (quando existir em outro contexto)
export type ToolPublication = {
  title: string;
  link?: string;
  authors_list?: string;
  publication_place?: string;
  citation_number?: number;
  year?: number;
};

// Versão genérica dos membros de time (para não depender do componente PersonCard)
export type ToolTeamMember = {
  name: string;
  position?: string;
  roles?: string[];
};

// ToolData compatível com o formato da página + formatos antigos
export type ToolData = {
  // campos base
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  duration: string;
  techStack?: string[];
  objectives?: string[];
  features?: string[];
  links?: ToolLinks;

  // imagem principal (aceita os dois formatos)
  imageUrl?: string;
  highlightImageUrl?: string;

  // galeria (aceita os dois formatos)
  gallery?: string[];
  galleryImagesUrl?: string[];

  // relacionamentos vindos da planilha
  team_relationships?: Array<{ name: string; roles: string[] }>;
  publication_relationships?: string[];
};

export interface ToolDetailViewProps {
  tool: ToolData;
  teamMembers?: ToolTeamMember[];
  publications?: ToolPublication[];
  isMobile: boolean;
  onBack?: () => void;
  content?: {
    backButton?: string;
    sections?: {
      duration?: { label: string };
      techStack?: { title: string };
      about?: { title: string };
      gallery?: { title: string };
      objectives?: { title: string };
      features?: { title: string };
      team?: { title: string };
      publications?: { title: string };
    };
  };
}

const paperStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(10px)",
  borderRadius: 24,
};

export default function ToolDetailView({
  tool,
  teamMembers = [],
  publications = [],
  isMobile,
  onBack,
  content = {},
}: ToolDetailViewProps) {
  const defaultContent = {
    backButton: "Back to Tools",
    sections: {
      duration: { label: "Duration" },
      techStack: { title: "Tech Stack" },
      about: { title: "About" },
      gallery: { title: "Gallery" },
      objectives: { title: "Objectives" },
      features: { title: "Features" },
      team: { title: "Team" },
      publications: { title: "Publications" },
    },
  };

  const pageContent = {
    backButton: content.backButton || defaultContent.backButton,
    sections: {
      ...defaultContent.sections,
      ...content.sections,
    },
  };

  // imagem principal: prioriza highlightImageUrl, cai para imageUrl
  const mainImageUrl =
    tool.highlightImageUrl ||
    tool.imageUrl ||
    "https://via.placeholder.com/800x600";

  // galeria: aceita galleryImagesUrl ou gallery
  const galleryImages =
    (tool.galleryImagesUrl && tool.galleryImagesUrl.length > 0
      ? tool.galleryImagesUrl
      : tool.gallery) || [];

  // time: usa teamMembers (externo) se vier, senão usa team_relationships da planilha
  const normalizedTeam: ToolTeamMember[] =
    teamMembers.length > 0
      ? teamMembers
      : (tool.team_relationships || []).map((rel) => ({
          name: rel.name,
          roles: rel.roles,
        }));

  // publicações: usa props publications se vierem, senão usa publication_relationships simples
  const hasDetailedPublications = publications.length > 0;
  const simplePublicationTitles = tool.publication_relationships || [];

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
            {pageContent.backButton}
          </Button>
        </motion.div>
      )}

      {/* Conteúdo principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Paper
          shadow="xl"
          p={isMobile ? "lg" : "xl"}
          mb={isMobile ? 24 : 32}
          style={paperStyle}
        >
          {/* Hero Section */}
          <Box mb={isMobile ? "xl" : 48}>
            <Group
              align={isMobile ? "flex-start" : "center"}
              gap={isMobile ? "lg" : "xl"}
              style={{ flexDirection: isMobile ? "column" : "row" }}
            >
              {/* Imagem do projeto */}
              <Box
                style={{
                  width: isMobile ? "100%" : 400,
                  flexShrink: 0,
                }}
              >
                <Box
                  style={{
                    height: isMobile ? 240 : 300,
                    borderRadius: 16,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <ImgboxImage
                    src={mainImageUrl}
                    alt={tool.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>
              </Box>

              {/* Informações principais */}
              <Stack gap="md" style={{ flex: 1 }}>
                <Box>
                  {/* Linha com título e links */}
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
                        flex={isMobile ? "none" : "1 1 auto"}
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
                          {tool.name}
                        </Title>
                      </Box>

                      {/* Duração */}
                      <DurationInfo
                        icon={<IconClock size={14} color="var(--primary)" />}
                        label={pageContent.sections.duration.label}
                        value={tool.duration}
                        size={isMobile ? "sm" : "md"}
                      />
                    </Group>

                    {/* Links externos */}
                    {tool.links && (
                      <Box flex="0 0 auto">
                        <LinkGroup
                          links={tool.links}
                          isMobile={isMobile}
                          align={isMobile ? "center" : "right"}
                        />
                      </Box>
                    )}
                  </Group>

                  {/* Tagline e descrição */}
                  <Text
                    size={isMobile ? "md" : "lg"}
                    fw={600}
                    c="dimmed"
                    mb="md"
                  >
                    {tool.tagline}
                  </Text>
                  <Text
                    size={isMobile ? "sm" : "md"}
                    c="dimmed"
                    lh={1.6}
                    mb="md"
                  >
                    {tool.description}
                  </Text>

                  {/* Tech Stack */}
                  {tool.techStack && tool.techStack.length > 0 && (
                    <BadgeBox
                      title={pageContent.sections.techStack.title}
                      icon={<IconTerminal2 size={20} />}
                      items={tool.techStack}
                    />
                  )}
                </Box>
              </Stack>
            </Group>
          </Box>

          <Divider mb={isMobile ? "xl" : 48} />

          {/* Descrição longa */}
          {tool.longDescription && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconSparkles size={isMobile ? 20 : 24} />}
                title={pageContent.sections.about.title}
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
                {tool.longDescription}
              </Text>
            </Box>
          )}

          {/* Galeria */}
          {galleryImages.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconPhoto size={isMobile ? 20 : 24} />}
                title={pageContent.sections.gallery.title}
                isMobile={isMobile}
              />
              <ToolGallery images={galleryImages} toolName={tool.name} />
            </Box>
          )}

          {/* Objetivos e Features */}
          {((tool.objectives && tool.objectives.length > 0) ||
            (tool.features && tool.features.length > 0)) && (
            <Box mb={isMobile ? "lg" : "xl"}>
              <SimpleGrid
                cols={isMobile ? 1 : 2}
                spacing={isMobile ? "lg" : "xl"}
              >
                {/* Objetivos */}
                {tool.objectives && tool.objectives.length > 0 && (
                  <Box>
                    <SectionTitle
                      icon={<IconTargetArrow size={isMobile ? 20 : 24} />}
                      title={pageContent.sections.objectives.title}
                      isMobile={isMobile}
                    >
                      <IconList
                        items={tool.objectives}
                        icon={<IconCheck />}
                        isMobile={isMobile}
                      />
                    </SectionTitle>
                  </Box>
                )}

                {/* Features */}
                {tool.features && tool.features.length > 0 && (
                  <Box>
                    <SectionTitle
                      icon={<IconStar size={isMobile ? 20 : 24} />}
                      title={pageContent.sections.features.title}
                      isMobile={isMobile}
                    >
                      <IconList
                        items={tool.features}
                        icon={<IconStar />}
                        isMobile={isMobile}
                      />
                    </SectionTitle>
                  </Box>
                )}
              </SimpleGrid>
            </Box>
          )}

          {/* [INÍCIO EDIÇÃO] Team + Publications simplificados (sem Carousel / Cards) */}

          {/* Team Members - Simplificado */}
          {normalizedTeam.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconUsers size={isMobile ? 20 : 24} />}
                title={pageContent.sections.team.title}
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
                title={pageContent.sections.publications.title}
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

          {/* [FIM EDIÇÃO] Team + Publications simplificados (sem Carousel / Cards) */}
        </Paper>
      </motion.div>
    </Container>
  );
}
