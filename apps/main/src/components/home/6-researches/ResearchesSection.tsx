"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Text, Loader, Center, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@shared/ui";
import { ResearchCardCompact } from "@shared/ui";
import SectionWithHeader from "@/components/home/SectionWithHeader";
import homeContent from "@/../public/json/home.json";

interface Research {
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
}

interface ResearchesData {
  researches: Research[];
}

const useResearchesData = () => {
  const [researchesData, setResearchesData] = useState<Research[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadResearchesData = async () => {
      try {
        const res = await fetch("/api/researches", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load researches data");
        }

        const data: ResearchesData = await res.json();

        if (mounted) {
          setHasError(false);
          setResearchesData(data.researches);
        }
      } catch (err) {
        if (mounted) {
          setHasError(true);
          setResearchesData([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadResearchesData();

    return () => {
      mounted = false;
    };
  }, []);

  return { researchesData, isLoading, hasError };
};

// Loading State Component
const LoadingState = () => (
  <Center h={400}>
    <Loader size="lg" color="var(--primary)" />
  </Center>
);

// Empty State Component
const EmptyState = () => (
  <Center h={200}>
    <Text ta="center" c="dimmed">
      No researches found.
    </Text>
  </Center>
);

const ErrorState = () => (
  <Center h={200}>
    <Stack gap={4} align="center">
      <Text fw={600}>Error loading researches</Text>
    </Stack>
  </Center>
);

export default function ResearchesSection() {
  const { researchesData, isLoading, hasError } = useResearchesData();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const router = useRouter();

  const handleResearchClick = (researchId: string) => {
    router.push(`/research/${researchId}`);
  };

  return (
    <SectionWithHeader
      title={homeContent.researchesSection.title}
      subtitle={homeContent.researchesSection.subtitle}
      button={homeContent.researchesSection.button}
      isMobile={isMobile}
    >
      {isLoading ? (
        <LoadingState />
      ) : hasError ? (
        <ErrorState />
      ) : researchesData.length > 0 ? (
        <Box>
          {/* Researches Carousel */}
          <Carousel
            autoPlay
            autoPlayInterval={25000}
            showDots
            showNavButtons
            itemsPerView={3}
            itemsPerViewMobile={1}
            itemWidth={500}
            itemWidthMobile="75vw"
            itemGap={32}
            itemGapMobile={24}
          >
            {researchesData.map((research, index) => (
              <ResearchCardCompact
                key={research.id}
                research={research}
                index={index}
                onClick={() => handleResearchClick(research.id)}
              />
            ))}
          </Carousel>
        </Box>
      ) : (
        <EmptyState />
      )}
    </SectionWithHeader>
  );
}
