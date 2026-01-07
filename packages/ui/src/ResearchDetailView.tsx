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
import { IconClock, IconSparkles, IconFlask } from "@tabler/icons-react";
import { DurationInfo } from "./DurationInfo";
import { PersonCardProps } from "./PersonCard";
import { SectionTitle } from "./SectionTitle";
import { ProjectCard } from "./ProjectCard";
import { useMediaQuery } from "@mantine/hooks";

// Types
export interface ResearchPublication {
  title: string;
  link?: string;
  authors_list?: string;
  publication_place?: string;
  citation_number?: number;
  year?: number;
}

export interface ResearchProject {
  name: string;
  imageUrl: string;
  description: string;
}

export interface ResearchData {
  name: string;
  shortDescription: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  duration: string;
  projects?: ResearchProject[];
}

export interface ResearchTool {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
}

export interface ResearchDetailViewProps {
  research: ResearchData;
  teamMembers?: PersonCardProps[];
  publications?: ResearchPublication[];
  tools?: ResearchTool[];
}

// Shared research detail view with projects, description, and flexible styling
export default function ResearchDetailView({
  research,
  teamMembers,
  publications,
  tools,
}: ResearchDetailViewProps) {
  const isMobile = useMediaQuery("(max-width: 62em)");
  const imageHeight = isMobile ? 280 : 420;
  const spacing = isMobile ? "xl" : 48;
  const paperStyle = {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backdropFilter: "blur(10px)",
    paddingTop: 0,
  };

  return (
    <MantineProvider>
      <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Hero image */}
          <Box
            style={{
              width: "100%",
              height: imageHeight,
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
            style={paperStyle}
          >
            {/* Hero section */}
            <Box mb={spacing}>
              <Stack gap="md">
                <Box>
                  {/* Title and duration row */}
                  <Group
                    justify={isMobile ? "center" : "space-between"}
                    align="center"
                    wrap="wrap"
                    gap={12}
                    mb={isMobile ? "12px" : "8px"}
                  >
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

                      {/* Duration info */}
                      <DurationInfo
                        icon={<IconClock size={14} color="var(--primary)" />}
                        label={"Duration"}
                        value={research.duration}
                        size={isMobile ? "sm" : "md"}
                      />
                    </Group>
                  </Group>

                  {/* Short description */}
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

            <Divider mb={spacing} />

            {/* Long description */}
            {research.longDescription && (
              <Box mb={spacing}>
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
                  {research.longDescription}
                </Text>
              </Box>
            )}

            {/* Projects section */}
            {research.projects && research.projects.length > 0 && (
              <Box mb={spacing}>
                <SectionTitle
                  icon={<IconFlask size={isMobile ? 20 : 24} />}
                  title="Projects"
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
          </Paper>
        </motion.div>
      </Container>
    </MantineProvider>
  );
}

export { ResearchDetailView };
