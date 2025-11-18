"use client";

import React, { useEffect, useState } from "react";
import { Container, Text, Loader, Center, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Carousel from "@/components/Carousel";
import ToolCardCompact from "@/components/ToolCardCompact";
import SectionWithHeader from "@/components/SectionWithHeader";
import homeContent from "@/../public/json/home-content.json";

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
      {homeContent.toolsSection.emptyStateText}
    </Text>
  </Center>
);

const ErrorState = () => (
  <Center h={200}>
    <Stack gap={4} align="center">
      <Text fw={600}>{homeContent.toolsSection.error.title}</Text>
      <Text ta="center" c="dimmed" size="sm">
        {homeContent.toolsSection.error.message}
      </Text>
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
      <Container size="xl" style={{ padding: 0 }}>
        {isLoading ? (
          <LoadingState />
        ) : hasError ? (
          <ErrorState />
        ) : toolsData.length > 0 ? (
          <Stack gap={isMobile ? 32 : 40}>
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
          </Stack>
        ) : (
          <EmptyState />
        )}
      </Container>
    </SectionWithHeader>
  );
}
