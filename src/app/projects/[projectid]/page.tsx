"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Box,
  Text,
  Paper,
  Loader,
  Center,
  Group,
  Stack,
  Divider,
  Button,
  Title,
  SimpleGrid,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconUsers,
  IconTargetArrow,
  IconFileText,
  IconPhoto,
  IconCheck,
  IconStar,
  IconClock,
  IconSparkles,
  IconTerminal2,
} from "@tabler/icons-react";
import FlickeringGrid from "@/components/FlickeringGrid";
import { ProjectGallery } from "@/components/ProjectGallery";
import InfiniteCarousel from "@/components/InfiniteCarousel";
import PublicationCard from "@/components/PublicationCard";
import { PersonCardProps } from "@/components/PersonCard";
import { BadgeBox } from "@/components/BadgeBox";
import { SectionTitle } from "@/components/SectionTitle";
import LinkGroup from "@/components/LinkGroup";
import ProjectDurationInfo from "@/components/ProjectDurationInfo";
import { IconList } from "@/components/IconList";
import pageContent from "@/../public/json/project-detail-page-content.json";

// Tipos
type TeamMember = {
  name: string;
  role: string;
};

type Publication = {
  title: string;
  type: string;
  year: number;
};

type Links = {
  webapp?: string;
  github?: string;
  api?: string;
  docs?: string;
};

type Project = {
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
  team?: TeamMember[];
  links?: Links;
  publications?: Publication[];
  metrics?: Record<string, any>;
  gallery?: string[];
};

type ProjectsData = { projects: Project[] };

// Hook: carrega um projeto específico do JSON
const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/json/projects-data.json", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Falha no carregamento");

        const data: ProjectsData = await res.json();
        const found = data.projects.find((p) => p.id === id);

        if (!mounted) return;
        if (found) {
          setProject(found);
        } else {
          notifications.show({
            title: pageContent.notifications.notFound.title,
            message: pageContent.notifications.notFound.message,
            color: "red",
            withCloseButton: true,
          });
        }
      } catch {
        if (!mounted) return;
        notifications.show({
          title: pageContent.notifications.loadError.title,
          message: pageContent.notifications.loadError.message,
          color: "red",
          withCloseButton: true,
        });
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

  return { project, isLoading };
};

// Hook: carrega papers relacionados ao projeto
const useProjectPapers = (projectId: string) => {
  const [papers, setPapers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [relationshipsRes, papersRes] = await Promise.all([
          fetch("/json/project-paper-relationships.json"),
          fetch("/json/paper-data.json"),
        ]);

        const relationshipsData = await relationshipsRes.json();
        const papersData = await papersRes.json();

        const projectRelationship = relationshipsData.relationships.find(
          (r: any) => r.projectId === projectId
        );

        if (projectRelationship) {
          const relatedPapers = papersData.paper_data.filter((paper: any) =>
            projectRelationship.papers.includes(paper.title)
          );
          setPapers(relatedPapers);
        }
      } catch (error) {
        console.error("Error loading project papers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [projectId]);

  return { papers, isLoading };
};

// Hook: carrega membros do time relacionados ao projeto
const useProjectTeam = (projectId: string) => {
  const [teamMembers, setTeamMembers] = useState<PersonCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [relationshipsRes, teamRes] = await Promise.all([
          fetch("/json/project-person-relationships.json"),
          fetch("/json/team-data.json"),
        ]);

        const relationshipsData = await relationshipsRes.json();
        const teamData = await teamRes.json();

        const projectRelationship = relationshipsData.relationships.find(
          (r: any) => r.projectId === projectId
        );

        if (projectRelationship) {
          // Criar um mapa de nomes para roles
          const memberRolesMap = new Map(
            projectRelationship.teamMembers.map((tm: any) => [
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
        console.error("Error loading project team:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [projectId]);

  return { teamMembers, isLoading };
};

// Componente de links externos
const ExternalLinks = ({
  links,
  isMobile,
  align,
}: {
  links?: Links;
  isMobile: boolean;
  align?: "left" | "center" | "right";
}) => {
  if (!links) return null;

  return <LinkGroup links={links} isMobile={isMobile} align={align} />;
};

// Note: Replaced local SectionWithIcon usage with imported SectionTitle (supports children)

export default function ProjectDetailPage() {
  const params = useParams<{ projectid?: string }>();
  const router = useRouter();
  const projectId = (params?.projectid ?? "") as string;
  const { project, isLoading } = useProject(projectId);
  const { papers, isLoading: papersLoading } = useProjectPapers(projectId);
  const { teamMembers, isLoading: teamLoading } = useProjectTeam(projectId);
  const isMobile = useMediaQuery("(max-width: 62em)");
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setGridKey((prev) => prev + 1), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const paperStyle = useMemo<React.CSSProperties>(
    () => ({
      background: "rgba(255, 255, 255, 0.98)",
      backdropFilter: "blur(10px)",
      borderRadius: 24,
    }),
    []
  );

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

  if (!project) {
    return (
      <Box
        style={{
          minHeight: "80vh",
          backgroundColor: "var(--primary)",
          paddingTop: isMobile ? 80 : 100,
        }}
      >
        <Container size="xl">
          <Center h={400}>
            <Stack align="center" gap="lg">
              <Text size="xl" c="white" fw={600}>
                {pageContent.notFoundPage.title}
              </Text>
              <Button
                leftSection={<IconArrowLeft size={20} />}
                onClick={() => router.push("/projects")}
                variant="white"
              >
                {pageContent.notFoundPage.backButton}
              </Button>
            </Stack>
          </Center>
        </Container>
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            leftSection={<IconArrowLeft size={20} />}
            variant="white"
            color="var(--primary)"
            mb={isMobile ? 20 : 32}
            onClick={() => router.push("/projects")}
          >
            {pageContent.backButton.label}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Paper
            shadow="xl"
            p={isMobile ? "lg" : "xl"}
            mb={isMobile ? 24 : 32}
            style={paperStyle}
          >
            {/* Hero Section */}
            <Box mb={isMobile ? "xl" : 48}>
              <Group
                align={isMobile ? "flex-start" : "center"}
                gap={isMobile ? "lg" : "xl"}
                style={{ flexDirection: isMobile ? "column" : "row" }}
              >
                {/* Imagem do projeto */}
                <Box
                  style={{
                    width: isMobile ? "100%" : 400,
                    flexShrink: 0,
                  }}
                >
                  <Box
                    style={{
                      height: isMobile ? 240 : 300,
                      borderRadius: 16,
                      overflow: "hidden",
                      backgroundImage: `url(${project.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </Box>

                {/* Informações principais */}
                <Stack gap="md" style={{ flex: 1 }}>
                  <Box>
                    {/* Linha com título à esquerda e links à direita */}
                    <Group
                      justify={isMobile ? "center" : "space-between"}
                      align="center"
                      wrap="wrap"
                      gap={12}
                      mb={isMobile ? "12px" : "8px"}
                    >
                      {/* Grupo da esquerda: Título + Duração */}
                      <Group
                        align="center"
                        justify={isMobile ? "center" : "flex-start"}
                        wrap="wrap"
                        gap={12}
                      >
                        <Box
                          flex={isMobile ? "none" : "1 1 auto"}
                          style={{
                            minWidth: 0,
                            textAlign: isMobile ? "center" : undefined,
                          }}
                        >
                          <Title
                            order={1}
                            size={isMobile ? "h2" : "38px"}
                            c="var(--primary)"
                            ta={isMobile ? "center" : undefined}
                          >
                            {project.name}
                          </Title>
                        </Box>

                        {/* Duração com ícone apenas antes do label */}
                        <ProjectDurationInfo
                          icon={<IconClock size={14} color="var(--primary)" />}
                          label={pageContent.sections.duration.label}
                          value={project.duration}
                          size={isMobile ? "sm" : "md"}
                        />
                      </Group>

                      {/* Links à direita */}
                      <Box flex="0 0 auto">
                        <ExternalLinks
                          links={project.links}
                          isMobile={isMobile}
                          align={isMobile ? "center" : "right"}
                        />
                      </Box>
                    </Group>
                    <Text
                      size={isMobile ? "md" : "lg"}
                      fw={600}
                      c="dimmed"
                      mb="md"
                    >
                      {project.tagline}
                    </Text>
                    <Text
                      size={isMobile ? "sm" : "md"}
                      c="dimmed"
                      lh={1.6}
                      mb="md"
                    >
                      {project.description}
                    </Text>
                    {/* Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                      <BadgeBox
                        title={pageContent.sections.techStack.title}
                        icon={<IconTerminal2 size={20} />}
                        items={project.techStack}
                      />
                    )}
                  </Box>
                </Stack>
              </Group>
            </Box>

            <Divider mb={isMobile ? "xl" : 48} />

            {/* Detailed Description Section */}
            {project.longDescription && (
              <Box mb={isMobile ? "xl" : 48}>
                <SectionTitle
                  icon={<IconSparkles size={isMobile ? 20 : 24} />}
                  title={pageContent.sections.about.title}
                  isMobile={isMobile}
                />
                <Text
                  size={isMobile ? "sm" : "md"}
                  c="dimmed"
                  lh={1.8}
                  style={{
                    textAlign: "justify",
                    padding: isMobile ? "0" : "0 8px",
                  }}
                >
                  {project.longDescription}
                </Text>
              </Box>
            )}

            {/* Galeria de Screenshots */}
            {project.gallery && project.gallery.length > 0 && (
              <Box mb={isMobile ? "xl" : 48}>
                <SectionTitle
                  icon={<IconPhoto size={isMobile ? 20 : 24} />}
                  title={pageContent.sections.gallery.title}
                  isMobile={isMobile}
                />
                <ProjectGallery
                  images={project.gallery}
                  projectName={project.name}
                />
              </Box>
            )}

            {/* Objetivos e Features lado a lado */}
            {((project.objectives && project.objectives.length > 0) ||
              (project.features && project.features.length > 0)) && (
              <Box mb={isMobile ? "lg" : "xl"}>
                <SimpleGrid
                  cols={isMobile ? 1 : 2}
                  spacing={isMobile ? "lg" : "xl"}
                >
                  {/* Objetivos */}
                  {project.objectives && project.objectives.length > 0 && (
                    <Box>
                      <SectionTitle
                        icon={<IconTargetArrow size={isMobile ? 20 : 24} />}
                        title={pageContent.sections.objectives.title}
                        isMobile={isMobile}
                      >
                        <IconList
                          items={project.objectives}
                          icon={<IconCheck />}
                          isMobile={isMobile}
                        />
                      </SectionTitle>
                    </Box>
                  )}

                  {/* Features */}
                  {project.features && project.features.length > 0 && (
                    <Box>
                      <SectionTitle
                        icon={<IconStar size={isMobile ? 20 : 24} />}
                        title={pageContent.sections.features.title}
                        isMobile={isMobile}
                      >
                        <IconList
                          items={project.features}
                          icon={<IconStar />}
                          isMobile={isMobile}
                        />
                      </SectionTitle>
                    </Box>
                  )}
                </SimpleGrid>
              </Box>
            )}

            {/* Team Members */}
            {!teamLoading && teamMembers.length > 0 && (
              <Box mb={isMobile ? "xl" : 48}>
                <SectionTitle
                  icon={<IconUsers size={isMobile ? 20 : 24} />}
                  title={pageContent.sections.team.title}
                  isMobile={isMobile}
                />
                <InfiniteCarousel
                  people={teamMembers}
                  autoPlay={true}
                  autoPlayInterval={20000}
                  showDots={true}
                  cardWidth={240}
                  cardWidthMobile={180}
                />
              </Box>
            )}

            {/* Publications */}
            {!papersLoading && papers.length > 0 && (
              <Box mb={isMobile ? "xl" : 48}>
                <SectionTitle
                  icon={<IconFileText size={isMobile ? 20 : 24} />}
                  title={pageContent.sections.publications.title}
                  isMobile={isMobile}
                />
                <Stack gap="lg">
                  {papers.map((paper, idx) => (
                    <PublicationCard
                      key={idx}
                      title={paper.title}
                      link={paper.link}
                      authors_list={paper.authors_list}
                      publication_place={paper.publication_place}
                      citation_number={paper.citation_number}
                      year={paper.year}
                      index={idx}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
