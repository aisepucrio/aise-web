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
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import FlickeringGrid from "@/components/FlickeringGrid";
import ToolHeroCard from "@/components/ToolHeroCard";
import PagesHeader from "@/components/PagesHeader";
import toolsPageContent from "@/../public/json/tools-page-content.json";
import { IconTool } from "@tabler/icons-react";

type Tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlightImageUrl: string;
  category: string;
  status: "active" | "pilot" | "archived" | string;
  duration: string;
  techStack?: string[];
  metrics?: Record<string, any>;
};

type ToolsData = { tools: Tool[] };

// Carrega /api/tools sem cache; mostra toast em erro
const useToolsData = () => {
  const [toolsData, setToolsData] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/tools", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Falha ao carregar dados");
        const data: ToolsData = await res.json();
        if (mounted) setToolsData(data.tools);
      } catch {
        if (mounted) {
          notifications.show({
            title: "Erro ao carregar projetos",
            message: "Tente novamente mais tarde.",
            color: "red",
            withCloseButton: true,
          });
          setToolsData([]);
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

  return { toolsData, isLoading };
};

export default function ToolsPage() {
  const { toolsData: tools, isLoading } = useToolsData();
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
          icon={IconTool}
          title={toolsPageContent?.hero?.title}
          subtitle={toolsPageContent?.hero?.subtitle}
          metrics={
            tools.length > 0
              ? [
                  {
                    label: toolsPageContent?.stats?.totalLabel ?? "Total Tools",
                    value: tools.length,
                  },
                ]
              : []
          }
        />

        {tools.length > 0 ? (
          <Box>
            {tools.map((tool, index) => (
              <ToolHeroCard
                key={tool.id}
                tool={tool}
                index={index}
                ctaLabel={
                  isMobile
                    ? toolsPageContent?.hero?.ctaLabelMobile
                    : toolsPageContent?.hero?.ctaLabel
                }
              />
            ))}
          </Box>
        ) : (
          !isLoading && (
            <Center h={300}>
              <Stack align="center" gap="md">
                <ThemeIcon size={80} radius="xl" variant="white" color="gray">
                  <IconTool size={40} />
                </ThemeIcon>
                <Text ta="center" c="white" size="xl" fw={600}>
                  {toolsPageContent?.noTools?.title}
                </Text>
                <Text ta="center" c="rgba(255, 255, 255, 0.8)" size="md">
                  {toolsPageContent?.noTools?.subtitle}
                </Text>
              </Stack>
            </Center>
          )
        )}
      </Container>
    </Box>
  );
}
