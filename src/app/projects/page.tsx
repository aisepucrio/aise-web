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
import ProjectHeroCard from "@/components/ProjectHeroCard";
import PagesHeader from "@/components/PagesHeader";
import projectsPageContent from "@/../public/json/projects-page-content.json";
import {
  IconRocket,
  IconFlask,
  IconArchive,
  IconSparkles,
} from "@tabler/icons-react";

type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  category: string;
  status: "active" | "pilot" | "archived" | string;
  duration: string;
  techStack?: string[];
  metrics?: Record<string, any>;
};

type ProjectsData = { projects: Project[] };

// Carrega /json/projects-data.json sem cache; mostra toast em erro
const useProjectsData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/json/projects-data.json", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Falha ao carregar dados");
        const data: ProjectsData = await res.json();
        if (mounted) setProjects(data.projects);
      } catch {
        if (mounted) {
          notifications.show({
            title: "Erro ao carregar projetos",
            message: "Tente novamente mais tarde.",
            color: "red",
            withCloseButton: true,
          });
          setProjects([]);
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

  return { projects, isLoading };
};

export default function ProjectsPage() {
  const { projects, isLoading } = useProjectsData();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setGridKey((prev) => prev + 1), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

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
      {isLoading ? (
        <Center h={400}>
          <Loader size="lg" color="white" />
        </Center>
      ) : (
        <FlickeringGrid
          key={gridKey}
          squareSize={8}
          gridGap={6}
          color="rgb(255, 255, 255)"
          maxOpacity={0.4}
          flickerChance={0.005}
        />
      )}

      <Container
        size="xl"
        style={{ position: "relative", zIndex: 1, maxWidth: 1400 }}
      >
        <PagesHeader
          icon={IconSparkles}
          title={projectsPageContent?.hero?.title}
          subtitle={projectsPageContent?.hero?.subtitle}
          metrics={
            !isLoading && projects.length > 0
              ? [
                  {
                    label:
                      projectsPageContent?.stats?.totalLabel ??
                      "Total Projects",
                    value: projects.length,
                  },
                ]
              : []
          }
        />

        {projects.length > 0 ? (
          <Box>
            {projects.map((project, index) => (
              <ProjectHeroCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </Box>
        ) : (
          !isLoading && (
            <Center h={300}>
              <Stack align="center" gap="md">
                <ThemeIcon size={80} radius="xl" variant="white" color="gray">
                  <IconSparkles size={40} />
                </ThemeIcon>
                <Text ta="center" c="white" size="xl" fw={600}>
                  {projectsPageContent?.noProjects?.title}
                </Text>
                <Text ta="center" c="rgba(255, 255, 255, 0.8)" size="md">
                  {projectsPageContent?.noProjects?.subtitle}
                </Text>
              </Stack>
            </Center>
          )
        )}
      </Container>
    </Box>
  );
}
