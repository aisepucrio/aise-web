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
  IconFileText,
  IconClock,
  IconSparkles,
  IconFlask,
  IconTool,
} from "@tabler/icons-react";
import Carousel from "@/components/Carousel";
import PersonCard, { PersonCardProps } from "@/components/PersonCard";
import PublicationCard from "@/components/PublicationCard";
import { SectionTitle } from "@/components/SectionTitle";
import DurationInfo from "@/components/DurationInfo";
import ProjectCard from "@/components/ProjectCard";
import ToolCardCompact from "@/components/home/2-blockbluebackground/5-tools/ToolCardCompact";
import componentTexts from "@/../public/json/components-content.json";

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

export type ResearchData = {
  name: string;
  shortDescription: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  duration: string;
  projects?: ResearchProject[];
};

export interface ResearchDetailViewProps {
  research: ResearchData;
  teamMembers?: PersonCardProps[];
  publications?: ResearchPublication[];
  tools?: any[];
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
  const texts = componentTexts.researchDetailView;
  const personCardTexts = componentTexts.personCard;
  const publicationCardTexts = componentTexts.publicationCard;

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
                      flex="1 1 auto"
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

          {/* Team Members */}
          {teamMembers.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconUsers size={isMobile ? 20 : 24} />}
                title={texts.sections.team.title}
                isMobile={isMobile}
              />
              <Carousel
                autoPlay={true}
                autoPlayInterval={20000}
                showDots={true}
                itemWidth={240}
                itemWidthMobile={180}
                itemsPerView={3}
                itemsPerViewMobile={1}
              >
                {teamMembers.map((person, index) => (
                  <PersonCard
                    key={`${person.name}-${index}`}
                    {...person}
                    viewProfileText={personCardTexts.viewProfileText}
                    cardWidth={isMobile ? 180 : 240}
                  />
                ))}
              </Carousel>
            </Box>
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconFileText size={isMobile ? 20 : 24} />}
                title={texts.sections.publications.title}
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
                    viewLabel={publicationCardTexts.viewPublicationText}
                    index={idx}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Associated Tools */}
          {tools.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconTool size={isMobile ? 20 : 24} />}
                title={texts.sections.tools.title}
                isMobile={isMobile}
              />
              <Carousel
                autoPlay={true}
                autoPlayInterval={25000}
                showDots={true}
                itemWidth={425}
                itemWidthMobile={280}
                itemsPerView={2}
                itemsPerViewMobile={1}
              >
                {tools.map((tool, index) => (
                  <ToolCardCompact key={tool.id} tool={tool} index={index} />
                ))}
              </Carousel>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
}
