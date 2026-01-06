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
import { SectionTitle } from "@/components/SectionTitle";
import LinkGroup from "@/components/LinkGroup";
import DurationInfo from "@/components/DurationInfo";
import { IconList } from "@/components/IconList";
import componentTexts from "@/../public/json/components-content.json";

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
}: ToolDetailViewProps) {
  const texts = componentTexts.toolDetailView;
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
                      <DurationInfo
                        icon={<IconClock size={14} color="var(--primary)" />}
                        label={texts.durationLabel}
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
                      title={texts.sections.techStack.title}
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
                {tool.longDescription}
              </Text>
            </Box>
          )}

          {/* Galeria */}
          {Array.isArray(tool.gallery) && tool.gallery.length > 0 && (
            <Box mb={isMobile ? "xl" : 48}>
              <SectionTitle
                icon={<IconPhoto size={isMobile ? 20 : 24} />}
                title={texts.sections.gallery.title}
                isMobile={isMobile}
              />
              <ToolGallery images={tool.gallery} toolName={tool.name} />
            </Box>
          )}

          {/* Objetivos e Features */}
          {((Array.isArray(tool.objectives) && tool.objectives.length > 0) ||
            (Array.isArray(tool.features) && tool.features.length > 0)) && (
            <Box mb={isMobile ? "lg" : "xl"}>
              <SimpleGrid
                cols={isMobile ? 1 : 2}
                spacing={isMobile ? "lg" : "xl"}
              >
                {/* Objetivos */}
                {Array.isArray(tool.objectives) &&
                  tool.objectives.length > 0 && (
                    <Box>
                      <SectionTitle
                        icon={<IconTargetArrow size={isMobile ? 20 : 24} />}
                        title={texts.sections.objectives.title}
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
                {Array.isArray(tool.features) && tool.features.length > 0 && (
                  <Box>
                    <SectionTitle
                      icon={<IconStar size={isMobile ? 20 : 24} />}
                      title={texts.sections.features.title}
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
                itemsPerView={1}
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
        </Paper>
      </motion.div>
    </Container>
  );
}
