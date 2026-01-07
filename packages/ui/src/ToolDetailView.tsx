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
  Title,
  SimpleGrid,
  MantineProvider,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
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
import { Carousel } from "./Carousel";
import { PersonCard, PersonCardProps } from "./PersonCard";
import { PublicationCard, PublicationCardProps } from "./PublicationCard";
import { BadgeBox } from "./BadgeBox";
import { SectionTitle } from "./SectionTitle";
import { LinkGroup } from "./LinkGroup";
import { DurationInfo } from "./DurationInfo";
import { IconList } from "./IconList";
import { useMediaQuery } from "@mantine/hooks";

// Types
export type ToolLinks = {
  webapp?: string;
  github?: string;
  api?: string;
  docs?: string;
};

export interface ToolData {
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
}

export interface ToolDetailViewProps {
  tool: ToolData;
  teamMembers?: PersonCardProps[];
  publications?: PublicationCardProps[];
}

const paperStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(10px)",
  borderRadius: 24,
};

// Comprehensive tool detail view with hero section, gallery, features, team, and publications
export default function ToolDetailView({
  tool,
  teamMembers = [],
  publications = [],
}: ToolDetailViewProps) {
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <MantineProvider>
      <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
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
            {/* Hero section with image and main info */}
            <Box mb={isMobile ? "xl" : 48}>
              <Group
                align={isMobile ? "flex-start" : "center"}
                gap={isMobile ? "lg" : "xl"}
                style={{ flexDirection: isMobile ? "column" : "row" }}
              >
                {/* Tool image */}
                <Box style={{ width: isMobile ? "100%" : 400, flexShrink: 0 }}>
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

                {/* Main info */}
                <Stack gap="md" style={{ flex: 1 }}>
                  <Box>
                    {/* Title row with duration and links */}
                    <Group
                      justify={isMobile ? "center" : "space-between"}
                      align="center"
                      wrap="wrap"
                      gap={12}
                      mb={isMobile ? "12px" : "8px"}
                    >
                      {/* Title + Duration */}
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

                        <DurationInfo
                          icon={<IconClock size={14} color="var(--primary)" />}
                          label="Duration"
                          value={tool.duration}
                          size={isMobile ? "sm" : "md"}
                        />
                      </Group>

                      {/* External links */}
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

                    {/* Tagline and description */}
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

                    {/* Tech stack */}
                    {tool.techStack && tool.techStack.length > 0 && (
                      <BadgeBox
                        title="Tech Stack"
                        icon={<IconTerminal2 size={20} />}
                        items={tool.techStack}
                      />
                    )}
                  </Box>
                </Stack>
              </Group>
            </Box>

            <Divider mb={isMobile ? "xl" : 48} />

            {/* Long description */}
            {tool.longDescription && (
              <Box mb={isMobile ? "xl" : 48}>
                <SectionTitle
                  icon={<IconSparkles size={isMobile ? 20 : 24} />}
                  title="About"
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

            {/* Gallery */}
            {Array.isArray(tool.gallery) && tool.gallery.length > 0 && (
              <Box mb={isMobile ? "xl" : 48}>
                <SectionTitle
                  icon={<IconPhoto size={isMobile ? 20 : 24} />}
                  title="Gallery"
                  isMobile={isMobile}
                />
                <ToolGallery images={tool.gallery} toolName={tool.name} />
              </Box>
            )}

            {/* Objectives and Features */}
            {((Array.isArray(tool.objectives) && tool.objectives.length > 0) ||
              (Array.isArray(tool.features) && tool.features.length > 0)) && (
              <Box mb={isMobile ? "lg" : "xl"}>
                <SimpleGrid
                  cols={isMobile ? 1 : 2}
                  spacing={isMobile ? "lg" : "xl"}
                >
                  {/* Objectives */}
                  {Array.isArray(tool.objectives) &&
                    tool.objectives.length > 0 && (
                      <Box>
                        <SectionTitle
                          icon={<IconTargetArrow size={isMobile ? 20 : 24} />}
                          title="Objectives"
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
                        title="Features"
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

            {/* Team members */}
            {teamMembers.length > 0 && (
              <Box mb={isMobile ? "xl" : 48}>
                <SectionTitle
                  icon={<IconUsers size={isMobile ? 20 : 24} />}
                  title="Team"
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
                <SectionTitle
                  icon={<IconFileText size={isMobile ? 20 : 24} />}
                  title="Publications"
                  isMobile={isMobile}
                />
                <Stack gap="lg">
                  {publications.map((publication, idx) => (
                    <PublicationCard key={idx} {...publication} index={idx} />
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
    </MantineProvider>
  );
}

export { ToolDetailView };
