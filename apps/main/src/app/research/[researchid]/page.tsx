"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Loader, Center, Stack, Text, Container } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import FlickeringGrid from "@/components/FlickeringGrid";
import BackButton from "@/components/BackButton";
import {
  ResearchDetailView,
  ResearchData,
  ResearchPublication,
  PersonCardProps,
} from "@shared/ui";
import pageContent from "@/../public/json/research-detail-page-content.json";

// Tipos
type Research = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  longDescription?: string;
  highlightImageUrl: string;
  duration: string;
  projects?: Array<{
    name: string;
    imageUrl: string;
    description: string;
  }>;
  team_relationships?: Array<{
    name: string;
    roles: string[];
  }>;
  publication_relationships?: string[];
  tools_relationships?: string[];
};

type ResearchesData = { researches: Research[] };

// Hook: carrega uma linha de pesquisa específica da API
const useResearch = (id: string) => {
  const [research, setResearch] = useState<Research | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/api/researches", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Falha no carregamento");

        const data: ResearchesData = await res.json();
        const found = data.researches.find((r) => r.id === id);

        if (!mounted) return;
        if (found) {
          setResearch(found);
        } else {
          console.error("Research not found:", id);
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Error loading research:", error);
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

  return { research, isLoading };
};

// Hook: carrega publicações relacionadas à linha de pesquisa
const useResearchPublications = (research: Research | null) => {
  const [publications, setPublications] = useState<ResearchPublication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!research) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const publicationsRes = await fetch("/api/publications");
        const publicationsData = await publicationsRes.json();

        if (
          research.publication_relationships &&
          research.publication_relationships.length > 0
        ) {
          const relatedPublications = (publicationsData.publications || [])
            .filter((publication: any) =>
              research.publication_relationships?.includes(publication.title)
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
        console.error("Error loading research publications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [research]);

  return { publications, isLoading };
};

// Hook: carrega membros do time relacionados à linha de pesquisa
const useResearchTeam = (research: Research | null) => {
  const [teamMembers, setTeamMembers] = useState<PersonCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!research) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const teamRes = await fetch("/api/team");
        const teamData = await teamRes.json();

        if (
          research.team_relationships &&
          research.team_relationships.length > 0
        ) {
          const memberRolesMap = new Map(
            research.team_relationships.map((tm) => [tm.name, tm.roles || []])
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
        console.error("Error loading research team:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [research]);

  return { teamMembers, isLoading };
};

// Hook: carrega tools relacionadas à linha de pesquisa
const useResearchTools = (research: Research | null) => {
  const [tools, setTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!research) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const toolsRes = await fetch("/api/tools");
        const toolsData = await toolsRes.json();

        if (
          research.tools_relationships &&
          research.tools_relationships.length > 0
        ) {
          const relatedTools = toolsData.tools.filter((tool: any) =>
            research.tools_relationships?.includes(tool.id)
          );
          setTools(relatedTools);
        }
      } catch (error) {
        console.error("Error loading research tools:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [research]);

  return { tools, isLoading };
};

export default function ResearchDetailPage() {
  const params = useParams<{ researchid?: string }>();
  const router = useRouter();
  const researchId = (params?.researchid ?? "") as string;
  const { research, isLoading } = useResearch(researchId);
  const { publications, isLoading: publicationsLoading } =
    useResearchPublications(research);
  const { teamMembers, isLoading: teamLoading } = useResearchTeam(research);
  const { tools, isLoading: toolsLoading } = useResearchTools(research);
  const isMobile = useMediaQuery("(max-width: 62em)");
  const [gridKey, setGridKey] = useState(0);

  // Espera TODOS os dados carregarem antes de renderizar
  const isFullyLoaded =
    !isLoading && !publicationsLoading && !teamLoading && !toolsLoading;

  useEffect(() => {
    if (isFullyLoaded) {
      const timer = setTimeout(() => setGridKey((prev) => prev + 1), 100);
      return () => clearTimeout(timer);
    }
  }, [isFullyLoaded]);

  // Loading state - espera todos os dados
  if (!isFullyLoaded) {
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

  // Research não encontrada
  if (!research) {
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
            <BackButton onClick={() => router.push("/researches")}>
              {pageContent.backButton.label}
            </BackButton>
          </Stack>
        </Center>
      </Box>
    );
  }

  const researchData: ResearchData = {
    name: research.name,
    shortDescription: research.shortDescription,
    description: research.description,
    longDescription: research.longDescription,
    imageUrl: research.highlightImageUrl,
    duration: research.duration,
    projects: research.projects,
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

      <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackButton onClick={() => router.push("/researches")}>
            {pageContent.backButton.label}
          </BackButton>
        </motion.div>

        <ResearchDetailView
          research={researchData}
          teamMembers={teamMembers}
          publications={publications}
          tools={tools}
        />
      </Container>
    </Box>
  );
}
