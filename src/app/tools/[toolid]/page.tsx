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
  imageUrl: string;
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
  gallery?: string[];
};

type ToolsData = { tools: Tool[] };

// Hook: carrega um projeto específico do JSON
const useTool = (id: string) => {
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/json/data/tools-data.json", {
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

// Hook: carrega publications relacionados ao projeto
const useToolPublications = (toolId: string) => {
  const [publications, setPublications] = useState<ToolPublication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [relationshipsRes, publicationsRes] = await Promise.all([
          fetch("/json/tool-publications-relationships.json"),
          fetch("/json/data/publications-data.json"),
        ]);

        const relationshipsData = await relationshipsRes.json();
        const publicationsData = await publicationsRes.json();

        const toolRelationship = relationshipsData.relationships.find(
          (r: any) => r.toolId === toolId
        );

        if (toolRelationship) {
          const relatedPublications = publicationsData.publications_data
            .filter((publication: any) =>
              toolRelationship.publications.includes(publication.title)
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
  }, [toolId]);

  return { publications, isLoading };
};

// Hook: carrega membros do time relacionados ao projeto
const useToolTeam = (toolId: string) => {
  const [teamMembers, setTeamMembers] = useState<PersonCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [relationshipsRes, teamRes] = await Promise.all([
          fetch("/json/tool-person-relationships.json"),
          fetch("/api/data/team"),
        ]);

        const relationshipsData = await relationshipsRes.json();
        const teamData = await teamRes.json();

        const toolRelationship = relationshipsData.relationships.find(
          (r: any) => r.toolId === toolId
        );

        if (toolRelationship) {
          // Criar um mapa de nomes para roles
          const memberRolesMap = new Map(
            toolRelationship.teamMembers.map((tm: any) => [
              typeof tm === "string" ? tm : tm.name,
              typeof tm === "string" ? [] : tm.roles || [],
            ])
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
  }, [toolId]);

  return { teamMembers, isLoading };
};

export default function ToolDetailPage() {
  const params = useParams<{ toolid?: string }>();
  const router = useRouter();
  const toolId = (params?.toolid ?? "") as string;
  const { tool, isLoading } = useTool(toolId);
  const { publications, isLoading: publicationsLoading } =
    useToolPublications(toolId);
  const { teamMembers, isLoading: teamLoading } = useToolTeam(toolId);
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
    imageUrl: tool.imageUrl,
    duration: tool.duration,
    techStack: tool.techStack,
    objectives: tool.objectives,
    features: tool.features,
    gallery: tool.gallery,
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
