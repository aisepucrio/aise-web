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
  Badge,
  Stack,
  Divider,
  Button,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import {
  IconArrowLeft,
  IconBulb,
  IconCopy,
  IconCode,
  IconBriefcase,
} from "@tabler/icons-react";
import FlickeringGrid from "@/components/FlickeringGrid";
import { BadgeBox } from "@/components/BadgeBox";
import LinkGroup from "@/components/LinkGroup";

// Tipos essenciais
type TeamMember = {
  name: string;
  position: string;
  imageUrl: string;
  description: string;
  bio?: string;
  email?: string;
  researchInterests?: string[];
  technologies?: string[];
  expertise?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    googleScholar?: string;
    orcid?: string;
    lattes?: string;
    personalWebsite?: string;
  };
};
type TeamData = { team: TeamMember[] };

// Slug simples a partir do nome
const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// Hook: carrega um membro específico do JSON
const useTeamMember = (slug: string) => {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch("/json/team-data.json", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Falha no carregamento");

        const data: TeamData = await res.json();
        const found = data.team.find((m) => generateSlug(m.name) === slug);

        if (!mounted) return;
        if (found) {
          setMember(found);
        } else {
          notifications.show({
            title: "Membro não encontrado",
            message: "Não foi possível localizar a pessoa solicitada.",
            color: "red",
            withCloseButton: true,
          });
        }
      } catch {
        if (!mounted) return;
        notifications.show({
          title: "Erro ao carregar",
          message: "Tente novamente mais tarde.",
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
  }, [slug]);

  return { member, isLoading };
};

// Links sociais/acadêmicos
const SocialLinks = ({
  links,
  isMobile,
  align,
}: {
  links?: TeamMember["socialLinks"];
  isMobile: boolean;
  align?: "left" | "center" | "right";
}) => {
  if (!links) return null;

  return <LinkGroup links={links} isMobile={isMobile} align={align} />;
};

export default function TeamMemberPage() {
  const params = useParams<{ name?: string }>();
  const router = useRouter();
  const slug = (params?.name ?? "") as string;
  const { member, isLoading } = useTeamMember(slug);
  const isMobile = useMediaQuery("(max-width: 62em)");
  const [gridKey, setGridKey] = useState(0);

  // Rebobina leve animação do grid ao terminar carregamento
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

  if (!member) {
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
                Team member not found
              </Text>
              <Button
                leftSection={<IconArrowLeft size={20} />}
                onClick={() => router.push("/team")}
                variant="white"
              >
                Back to Team
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
      {/* Fundo animado */}
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
            onClick={() => router.push("/team")}
          >
            Back to Team
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
            <Group
              align="flex-start"
              gap={isMobile ? "lg" : "xl"}
              style={{ flexDirection: isMobile ? "column" : "row" }}
            >
              {/* Coluna da foto */}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  width: isMobile ? "100%" : 300,
                  flexShrink: 0,
                  alignItems: "center",
                }}
              >
                <Box
                  style={{
                    position: "relative",
                    width: "100%",
                    height: isMobile ? 280 : 360,
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    style={{ objectFit: "cover", objectPosition: "top" }}
                    priority
                  />
                </Box>

                {/* Botão de e-mail com cópia para área de transferência */}
                {member.email && (
                  <Button
                    variant="light"
                    color="var(--primary)"
                    rightSection={<IconCopy size={20} />}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(member.email!);
                        notifications.show({
                          message: "Email copiado!",
                          color: "teal",
                          withCloseButton: false,
                        });
                      } catch {
                        notifications.show({
                          title: "Erro",
                          message: "Não foi possível copiar o email.",
                          color: "red",
                          withCloseButton: true,
                        });
                      }
                    }}
                    fullWidth
                    style={{ textTransform: "none", fontWeight: 600 }}
                  >
                    {member.email}
                  </Button>
                )}
              </Box>

              {/* Coluna de conteúdo */}
              <Stack
                gap="md"
                align={isMobile ? "center" : "stretch"}
                style={{ flex: 1 }}
              >
                <Box>
                  {/* Linha com nome à esquerda e redes sociais à direita (desktop) */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: isMobile ? "center" : "start",
                      justifyContent: isMobile ? "center" : "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        flex: isMobile ? "none" : "1 1 auto",
                        minWidth: 0,
                        textAlign: isMobile ? "center" : undefined,
                      }}
                    >
                      <Title
                        order={1}
                        size={isMobile ? "h2" : "h1"}
                        mb="xs"
                        style={{
                          color: "var(--primary)",
                          textAlign: isMobile ? "center" : undefined,
                        }}
                      >
                        {member.name}
                      </Title>

                      <Badge
                        size={isMobile ? "lg" : "xl"}
                        variant="light"
                        color="var(--primary)"
                        style={{
                          fontSize: isMobile ? "0.9rem" : "1rem",
                          fontWeight: 600,
                          padding: isMobile ? "12px 20px" : "14px 24px",
                        }}
                      >
                        {member.position}
                      </Badge>
                    </div>

                    {/* No mobile deixa centralizado/agrupado abaixo; no desktop alinha à direita */}
                    <div style={{ flex: "0 0 auto" }}>
                      <SocialLinks
                        links={member.socialLinks}
                        isMobile={isMobile}
                        align={isMobile ? "center" : "right"}
                      />
                    </div>
                  </div>
                </Box>

                <Text
                  size={isMobile ? "md" : "lg"}
                  c="dimmed"
                  lh={1.6}
                  style={{ textAlign: isMobile ? "center" : undefined }}
                >
                  {member.description}
                </Text>

                {/* Interesses de pesquisa (se houver) */}
                {member.researchInterests?.length ? (
                  <BadgeBox
                    title="Research Interests"
                    icon={<IconBulb size={18} />}
                    items={member.researchInterests}
                  />
                ) : null}

                {/* Technologies e Expertise na mesma linha */}
                {(member.technologies?.length || member.expertise?.length) && (
                  <Group
                    grow
                    align="flex-start"
                    gap="md"
                    style={{ flexDirection: isMobile ? "column" : "row" }}
                  >
                    {member.technologies?.length ? (
                      <BadgeBox
                        title="Technologies"
                        icon={<IconCode size={18} />}
                        items={member.technologies}
                      />
                    ) : null}

                    {member.expertise?.length ? (
                      <BadgeBox
                        title="Expertise"
                        icon={<IconBriefcase size={18} />}
                        items={member.expertise}
                      />
                    ) : null}
                  </Group>
                )}
              </Stack>
            </Group>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
