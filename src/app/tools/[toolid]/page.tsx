"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Loader, Center, Stack, Text, Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import FlickeringGrid from "@/components/FlickeringGrid";
import ToolDetailView, {
  ToolData,
  ToolPublication,
} from "@/components/ToolDetailView";
import { PersonCardProps } from "@/components/PersonCard";
import pageContent from "@/../public/json/tools-detail-page-content.json";

// Tipos
type Tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  highlightImageUrl: string;
  galleryImagesUrl?: string[];
  category: string;
  status: string;
  duration: string;
  sponsor?: string;
  objectives?: string[];
  features?: string[];
  techStack?: string[];
  links?: {
    webapp?: string;
    github?: string;
    api?: string;
    docs?: string;
  };
  team_relationships?: Array<{
    name: string;
    roles: string[];
  }>;
  publication_relationships?: string[];
};

type ToolsData = { tools: Tool[] };

// Hook: carrega um projeto específico da API
const useTool = (id: string) => {
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/api/data/tools", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Falha no carregamento");

        const data: ToolsData = await res.json();
        const found = data.tools.find((p) => p.id === id);

        if (!mounted) return;
        if (found) {
          setTool(found);
        } else {
          console.error("Tool not found:", id);
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Error loading tool:", error);
      } finally {
        mounted && setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id]);

  return { tool, isLoading };
};

// Hook: carrega publications relacionados ao projeto (usando relacionamentos embutidos)
const useToolPublications = (tool: Tool | null) => {
  const [publications, setPublications] = useState<ToolPublication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tool) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const publicationsRes = await fetch("/api/data/publications");
        const publicationsData = await publicationsRes.json();

        if (tool.publication_relationships && tool.publication_relationships.length > 0) {
          const relatedPublications = (publicationsData.publications || [])
            .filter((publication: any) =>
              tool.publication_relationships?.includes(publication.title)
            )
            .map((pub: any) => ({
              title: pub.title,
              link: pub.link,
              authors_list: pub.authors_list,
              publication_place: pub.publication_place,
              citation_number: pub.citation_number,
              year: pub.year,
            }));
          setPublications(relatedPublications);
        }
      } catch (error) {
        console.error("Error loading tool publications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [tool]);

  return { publications, isLoading };
};

// Hook: carrega membros do time relacionados ao projeto (usando relacionamentos embutidos)
const useToolTeam = (tool: Tool | null) => {
  const [teamMembers, setTeamMembers] = useState<PersonCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tool) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const teamRes = await fetch("/api/data/team");
        const teamData = await teamRes.json();

        if (tool.team_relationships && tool.team_relationships.length > 0) {
          // Criar um mapa de nomes para roles
          const memberRolesMap = new Map(
            tool.team_relationships.map((tm) => [tm.name, tm.roles || []])
          );

          const relatedMembers = teamData.team
            .filter((member: any) => memberRolesMap.has(member.name))
            .map((member: any) => ({
              name: member.name,
              position: member.position,
              imageUrl: member.imageUrl,
              description: member.description,
              roles: memberRolesMap.get(member.name) || [],
            }));
          setTeamMembers(relatedMembers);
        }
      } catch (error) {
        console.error("Error loading tool team:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [tool]);

  return { teamMembers, isLoading };
};

export default function ToolDetailPage() {
  const params = useParams<{ toolid?: string }>();
  const router = useRouter();
  const toolId = (params?.toolid ?? "") as string;
  const { tool, isLoading } = useTool(toolId);
  const { publications, isLoading: publicationsLoading } =
    useToolPublications(tool);
  const { teamMembers, isLoading: teamLoading } = useToolTeam(tool);
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
          minHeight: "100vh",
          backgroundColor: "var(--primary)",
          paddingTop: isMobile ? 80 : 100,
        }}
      >
        <Center h={400}>
          <Loader size="lg" color="white" />
        </Center>
      </Box>
    );
  }

  if (!tool) {
    return (
      <Box
        style={{
          minHeight: "80vh",
          backgroundColor: "var(--primary)",
          paddingTop: isMobile ? 80 : 100,
        }}
      >
        <Center h={400}>
          <Stack align="center" gap="lg">
            <Text size="xl" c="white" fw={600}>
              {pageContent.notFoundPage.title}
            </Text>
            <Button
              leftSection={<IconArrowLeft size={20} />}
              variant="white"
              color="var(--primary)"
              mb={isMobile ? 20 : 32}
              onClick={() => router.push("/tools")}
            >
              {pageContent.backButton.label}
            </Button>
          </Stack>
        </Center>
      </Box>
    );
  }

  const toolData: ToolData = {
    name: tool.name,
    tagline: tool.tagline,
    description: tool.description,
    longDescription: tool.longDescription,
    imageUrl: tool.highlightImageUrl,
    duration: tool.duration,
    techStack: tool.techStack,
    objectives: tool.objectives,
    features: tool.features,
    gallery: tool.galleryImagesUrl,
    links: tool.links,
  };

  return (
    <Box
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "var(--primary)",
        paddingTop: isMobile ? 80 : 100,
        paddingBottom: isMobile ? 60 : 80,
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

      <ToolDetailView
        tool={toolData}
        teamMembers={teamLoading ? [] : teamMembers}
        publications={publicationsLoading ? [] : publications}
        isMobile={isMobile}
        onBack={() => router.push("/tools")}
        content={{
          backButton: pageContent.backButton.label,
          sections: pageContent.sections,
        }}
      />
    </Box>
  );
}
