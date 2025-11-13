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
import { ToolGallery } from "@/components/ToolGallery";
import Carousel from "@/components/Carousel";
import PersonCard, { PersonCardProps } from "@/components/PersonCard";
import PublicationCard from "@/components/PublicationCard";
import { BadgeBox } from "@/components/BadgeBox";
import { ToolSectionTitle } from "@/components/ToolSectionTitle";
import LinkGroup from "@/components/LinkGroup";
import ToolDurationInfo from "@/components/ToolDurationInfo";
import { IconList } from "@/components/IconList";

// Tipos
export type ToolLinks = {
  webapp?: string;
  github?: string;
  api?: string;
  docs?: string;
};

export type ToolPublication = {
  title: string;
  link?: string;
  authors_list?: string;
  publication_place?: string;
  citation_number?: number;
  year?: number;
};

export type ToolData = {
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  duration: string;
  techStack?: string[];
  objectives?: string[];
  features?: string[];
  gallery?: string[];
  links?: ToolLinks;
};

export interface ToolDetailViewProps {
  tool: ToolData;
  teamMembers?: PersonCardProps[];
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
                    backgroundImage: `url(${tool.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
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
                      <ToolDurationInfo
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
              <ToolSectionTitle
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
          {tool.gallery && tool.gallery.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <ToolSectionTitle
                icon={<IconPhoto size={isMobile ? 20 : 24} />}
                title={pageContent.sections.gallery.title}
                isMobile={isMobile}
              />
              <ToolGallery images={tool.gallery} toolName={tool.name} />
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
                    <ToolSectionTitle
                      icon={<IconTargetArrow size={isMobile ? 20 : 24} />}
                      title={pageContent.sections.objectives.title}
                      isMobile={isMobile}
                    >
                      <IconList
                        items={tool.objectives}
                        icon={<IconCheck />}
                        isMobile={isMobile}
                      />
                    </ToolSectionTitle>
                  </Box>
                )}

                {/* Features */}
                {tool.features && tool.features.length > 0 && (
                  <Box>
                    <ToolSectionTitle
                      icon={<IconStar size={isMobile ? 20 : 24} />}
                      title={pageContent.sections.features.title}
                      isMobile={isMobile}
                    >
                      <IconList
                        items={tool.features}
                        icon={<IconStar />}
                        isMobile={isMobile}
                      />
                    </ToolSectionTitle>
                  </Box>
                )}
              </SimpleGrid>
            </Box>
          )}

          {/* Team Members */}
          {teamMembers.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <ToolSectionTitle
                icon={<IconUsers size={isMobile ? 20 : 24} />}
                title={pageContent.sections.team.title}
                isMobile={isMobile}
              />
              <Carousel
                autoPlay={true}
                autoPlayInterval={20000}
                showDots={true}
                itemWidth={240}
                itemWidthMobile={180}
                itemsPerView={1}
                itemsPerViewMobile={1}
              >
                {teamMembers.map((person, index) => (
                  <PersonCard
                    key={`${person.name}-${index}`}
                    {...person}
                    cardWidth={isMobile ? 180 : 240}
                  />
                ))}
              </Carousel>
            </Box>
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <ToolSectionTitle
                icon={<IconFileText size={isMobile ? 20 : 24} />}
                title={pageContent.sections.publications.title}
                isMobile={isMobile}
              />
              <Stack gap="lg">
                {publications.map((publication, idx) => (
                  <PublicationCard
                    key={idx}
                    title={publication.title}
                    link={publication.link || ""}
                    authors_list={publication.authors_list || ""}
                    publication_place={publication.publication_place || ""}
                    citation_number={publication.citation_number || 0}
                    year={publication.year || 0}
                    viewLabel="View Publication"
                    index={idx}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
}
