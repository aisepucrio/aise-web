"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Text,
  Loader,
  Center,
  Stack,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import FlickeringGrid from "@/components/FlickeringGrid";
import { ResearchCard } from "@shared/ui";
import PagesHeader from "@/components/PagesHeader";
import researchesPageContent from "@/../public/json/research-page-content.json";
import { IconFlask } from "@tabler/icons-react";

type Research = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  highlightImageUrl: string;
  duration: string;
  projects?: any[];
  team_relationships?: any[];
  publication_relationships?: string[];
  tools_relationships?: string[];
};

type ResearchesData = { researches: Research[] };

// Carrega /api/researches sem cache; mostra toast em erro
const useResearchesData = () => {
  const [researchesData, setResearchesData] = useState<Research[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/researches", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Falha ao carregar dados");
        const data: ResearchesData = await res.json();
        if (mounted) setResearchesData(data.researches);
      } catch {
        if (mounted) {
          console.error("Failed to load research data");
          setResearchesData([]);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { researchesData, isLoading };
};

export default function ResearchesPage() {
  const { researchesData: researches, isLoading } = useResearchesData();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setGridKey((prev) => prev + 1), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Box
        style={{
          position: "relative",
          minHeight: "100vh",
          backgroundColor: "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader size="lg" color="white" />
      </Box>
    );
  }

  return (
    <Box
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "var(--primary)",
        paddingTop: isMobile ? 80 : 100,
        paddingBottom: isMobile ? 60 : 100,
        overflow: "hidden",
      }}
    >
      <FlickeringGrid
        key={gridKey}
        squareSize={8}
        gridGap={6}
        color="rgb(255, 255, 255)"
        maxOpacity={0.4}
        flickerChance={0.005}
      />

      <Container
        size="xl"
        style={{ position: "relative", zIndex: 1, maxWidth: 1400 }}
      >
        <PagesHeader
          icon={IconFlask}
          title={researchesPageContent?.hero?.title}
          subtitle={researchesPageContent?.hero?.subtitle}
          metrics={
            researches.length > 0
              ? [
                  {
                    label: researchesPageContent?.stats?.totalLabel,
                    value: researches.length,
                  },
                ]
              : []
          }
        />

        {researches.length > 0 ? (
          <SimpleGrid
            cols={{ base: 1, md: 2 }}
            spacing={isMobile ? "lg" : "xl"}
          >
            {researches.map((research, index) => (
              <ResearchCard
                key={research.id}
                research={research}
                index={index}
              />
            ))}
          </SimpleGrid>
        ) : (
          !isLoading && (
            <Center h={300}>
              <Stack align="center" gap="md">
                <ThemeIcon size={80} radius="xl" variant="white" color="gray">
                  <IconFlask size={40} />
                </ThemeIcon>
                <Text ta="center" c="white" size="xl" fw={600}>
                  {researchesPageContent?.noResearch?.title}
                </Text>
                <Text ta="center" c="rgba(255, 255, 255, 0.8)" size="md">
                  {researchesPageContent?.noResearch?.subtitle}
                </Text>
              </Stack>
            </Center>
          )
        )}
      </Container>
    </Box>
  );
}
