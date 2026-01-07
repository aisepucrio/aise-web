"use client";

import { useEffect, useState } from "react";
import { Box, Text, Loader, Center, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@shared/ui";
import { ToolCardCompact } from "@shared/ui";
import SectionWithHeader from "@/components/home/SectionWithHeader";
import homeContent from "@/../public/json/home.json";

interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlightImageUrl: string;
  category: string;
  status: string;
  techStack?: string[];
  team_relationships?: any[];
}

interface ToolsData {
  tools: Tool[];
}

const useToolsData = () => {
  const [toolsData, setToolsData] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadToolsData = async () => {
      try {
        const res = await fetch("/api/tools", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load tools data");
        }

        const data: ToolsData = await res.json();

        if (mounted) {
          setHasError(false);
          setToolsData(data.tools);
        }
      } catch (err) {
        if (mounted) {
          setHasError(true);
          setToolsData([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadToolsData();

    return () => {
      mounted = false;
    };
  }, []);

  return { toolsData, isLoading, hasError };
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
      No tools found.
    </Text>
  </Center>
);

const ErrorState = () => (
  <Center h={200}>
    <Stack gap={4} align="center">
      <Text fw={600}>Error loading tools</Text>
    </Stack>
  </Center>
);

export default function ToolsSection() {
  const { toolsData, isLoading, hasError } = useToolsData();
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <SectionWithHeader
      title={homeContent.toolsSection.title}
      subtitle={homeContent.toolsSection.subtitle}
      button={homeContent.toolsSection.button}
      isMobile={isMobile}
    >
      {isLoading ? (
        <LoadingState />
      ) : hasError ? (
        <ErrorState />
      ) : toolsData.length > 0 ? (
        <Box>
          {/* Tools Carousel */}
          <Carousel
            autoPlay
            autoPlayInterval={25000}
            showDots
            showNavButtons
            itemsPerView={2}
            itemsPerViewMobile={1}
            itemWidth={500}
            itemWidthMobile="75vw"
            itemGap={32}
            itemGapMobile={24}
          >
            {toolsData.map((tool, index) => (
              <ToolCardCompact key={tool.id} tool={tool} index={index} />
            ))}
          </Carousel>
        </Box>
      ) : (
        <EmptyState />
      )}
    </SectionWithHeader>
  );
}
