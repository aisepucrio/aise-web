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
import ProjectsCarousel from "@/components/ProjectsCarousel";
import SectionWithHeader from "@/components/SectionWithHeader";
import homeContent from "@/../public/json/home-content.json";

interface Project {
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

interface ProjectsData {
  projects: Project[];
}

// Custom hook to load projects data
const useProjectsData = () => {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProjectsData = async () => {
      try {
        const res = await fetch("/json/data/projects-data.json", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load projects data");
        }

        const data: ProjectsData = await res.json();

        if (mounted) {
          // Show all projects for carousel
          setProjectsData(data.projects);
        }
      } catch (err) {
        if (mounted) {
          setError(true);
          notifications.show({
            title: "Error loading projects",
            message: "Please try again later.",
            color: "red",
            withCloseButton: true,
          });
          setProjectsData([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadProjectsData();

    return () => {
      mounted = false;
    };
  }, []);

  return { projectsData, isLoading, error };
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
          {homeContent.projectsSection.title}
        </Titulo>
        <Text
          size={isMobile ? "md" : "lg"}
          c="dimmed"
          maw={680}
          ta="center"
          lh={1.7}
        >
          {homeContent.projectsSection.subtitle}
        </Text>
      </Stack>
    </Box>
  );
};

// Loading State Component
const LoadingState = () => (
  <Center h={400}>
    <Loader size="lg" />
  </Center>
);

// Empty State Component
const EmptyState = () => (
  <Center h={200}>
    <Text ta="center" c="dimmed">
      No projects found.
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

export default function ProjectsSection() {
  const { projectsData, isLoading } = useProjectsData();
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
        title={homeContent.projectsSection.title}
        subtitle={homeContent.projectsSection.subtitle}
        button={homeContent.projectsSection.button}
        isMobile={isMobile}
      >
        <Container size="xl" style={{ padding: 0 }}>
          {isLoading ? (
            <LoadingState />
          ) : projectsData.length > 0 ? (
            <Stack gap={isMobile ? 32 : 40}>
              {/* Projects Carousel */}
              <ProjectsCarousel projects={projectsData} autoPlay autoPlayInterval={25000} />
            </Stack>
          ) : (
            <EmptyState />
          )}
        </Container>
      </SectionWithHeader>
    </motion.div>
  );
}
