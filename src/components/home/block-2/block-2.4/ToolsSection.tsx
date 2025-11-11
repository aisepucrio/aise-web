"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Container,
  Text,
  Loader,
  Center,
  Stack,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { motion, useInView } from "framer-motion";
import Titulo from "@/components/Titulo";
import Carousel from "@/components/Carousel";
import ToolCardCompact from "@/components/ToolCardCompact";
import SectionWithHeader from "@/components/SectionWithHeader";
import homeContent from "@/../public/json/home-content.json";

interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  category: string;
  status: string;
  techStack?: string[];
  team?: any[];
}

interface ToolsData {
  tools: Tool[];
}

const useToolsData = () => {
  const [toolsData, setToolsData] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadToolsData = async () => {
      try {
        const res = await fetch("/json/data/tools-data.json", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load tools data");
        }

        const data: ToolsData = await res.json();

        if (mounted) {
          // Show all tools for carousel
          setToolsData(data.tools);
        }
      } catch (err) {
        if (mounted) {
          setError(true);
          notifications.show({
            title: "Error loading tools",
            message: "Please try again later.",
            color: "red",
            withCloseButton: true,
          });
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

  return { toolsData, isLoading, error };
};

// Section Header Component
const SectionHeader = () => {
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <Box mb={isMobile ? 32 : 48}>
      <Stack gap="md" align="center">
        <Titulo
          verticalMarginDesktop={24}
          verticalMarginMobile={12}
          color="#000000ff"
        >
          {homeContent.toolsSection.title}
        </Titulo>
        <Text
          size={isMobile ? "md" : "lg"}
          c="dimmed"
          maw={680}
          ta="center"
          lh={1.7}
        >
          {homeContent.toolsSection.subtitle}
        </Text>
      </Stack>
    </Box>
  );
};

// Loading State Component
const LoadingState = () => (
  <Center h={400}>
    <Loader size="lg"  color="var(--primary)" />
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

// Animation config
const animationConfig = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  },
};

export default function ToolsSection() {
  const { toolsData, isLoading } = useToolsData();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={animationConfig.initial}
      animate={isInView ? animationConfig.animate : animationConfig.initial}
      transition={animationConfig.transition}
    >
      <SectionWithHeader
        title={homeContent.toolsSection.title}
        subtitle={homeContent.toolsSection.subtitle}
        button={homeContent.toolsSection.button}
        isMobile={isMobile}
      >
        <Container size="xl" style={{ padding: 0 }}>
          {isLoading ? (
            <LoadingState />
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
                itemWidthMobile={340}
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
    </motion.div>
  );
}
