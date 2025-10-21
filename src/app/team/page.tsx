"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Card,
  Avatar,
  SimpleGrid,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { notifications } from "@mantine/notifications";
import FlickeringGrid from "@/components/FlickeringGrid";
import PagesHeader from "@/components/PagesHeader";
import teamPageContent from "@/../public/json/team-page-content.json";
import { IconUsers } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type TeamMember = {
  name: string;
  position: string;
  imageUrl: string;
  description: string;
};

type TeamData = { team: TeamMember[] };
type GroupedTeam = Record<string, TeamMember[]>;

// Carrega e agrupa a equipe por cargo (preserva ordem de aparição)
const useTeamData = () => {
  const [teamData, setTeamData] = useState<GroupedTeam>({});
  const [isLoading, setIsLoading] = useState(true);
  const [orderedPositions, setOrderedPositions] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/json/team-data.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar dados");
        const data: TeamData = await res.json();

        const grouped: GroupedTeam = {};
        const order: string[] = [];

        data.team.forEach((m) => {
          if (!grouped[m.position]) {
            grouped[m.position] = [];
            order.push(m.position);
          }
          grouped[m.position].push(m);
        });

        if (mounted) {
          setTeamData(grouped);
          setOrderedPositions(order);
        }
      } catch {
        if (mounted) {
          notifications.show({
            title: "Erro ao carregar equipe",
            message: "Tente novamente mais tarde.",
            color: "red",
            withCloseButton: true,
          });
          setTeamData({});
        }
      } finally {
        mounted && setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { teamData, isLoading, orderedPositions };
};

// Gera slug a partir do nome
const generateSlug = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// Componente de item de membro na lista vertical
const TeamMemberListItem = ({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const slug = generateSlug(member.name);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        padding={isMobile ? "sm" : "md"}
        radius="md"
        withBorder
        style={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          borderColor: isHovered ? "var(--primary)" : "#e9ecef",
          backgroundColor: "#ffffff",
          transform: isHovered ? "translateX(4px)" : "translateX(0)",
          boxShadow: isHovered
            ? "0 2px 8px rgba(0, 123, 255, 0.15)"
            : "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push(`/team/${slug}`)}
      >
        <Group gap="md" wrap="nowrap">
          <Avatar
            src={member.imageUrl}
            alt={member.name}
            size={isMobile ? 60 : 90}
            radius="md"
            style={{
              flexShrink: 0,
            }}
          />
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text
              fw={600}
              size={isMobile ? "sm" : "md"}
              style={{
                color: "var(--primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {member.name}
            </Text>
            <Text
              size={isMobile ? "xs" : "sm"}
              c="dimmed"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {member.description}
            </Text>
          </Box>
        </Group>
      </Card>
    </motion.div>
  );
};

// Componente de categoria com lista vertical (MOBILE)
const TeamCategoryColumn = ({
  position,
  members,
  index,
}: {
  position: string;
  members: TeamMember[];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Paper
        shadow="none"
        p="md"
        radius={0}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          border: "none",
          borderLeft: "6px solid var(--primary)",
          paddingLeft: 16,
        }}
      >
        {/* Cabeçalho da categoria */}
        <Badge
          size="md"
          variant="filled"
          mb="md"
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            padding: "10px 16px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            width: "fit-content",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          {position}
        </Badge>

        {/* Lista vertical de membros */}
        <Stack gap="xs" style={{ flex: 1 }}>
          {members.map((member, idx) => (
            <TeamMemberListItem key={member.name} member={member} index={idx} />
          ))}
        </Stack>
      </Paper>
    </motion.div>
  );
};

// Componente de item de membro em grid (DESKTOP)
const TeamMemberGridItem = ({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) => {
  const router = useRouter();
  const slug = generateSlug(member.name);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        padding="md"
        radius="md"
        withBorder
        style={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          borderColor: isHovered ? "var(--primary)" : "#e9ecef",
          backgroundColor: "#ffffff",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 4px 12px rgba(0, 123, 255, 0.2)"
            : "0 1px 3px rgba(0, 0, 0, 0.05)",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push(`/team/${slug}`)}
      >
        <Stack gap="sm" align="center">
          <Avatar
            src={member.imageUrl}
            alt={member.name}
            size={120}
            radius="md"
          />
          <Box style={{ textAlign: "center", width: "100%" }}>
            <Text
              fw={600}
              size="lg"
              style={{
                color: "var(--primary)",
              }}
            >
              {member.name}
            </Text>
            <Text
              size="sm"
              c="dimmed"
              lineClamp={3}
              style={{
                marginTop: 4,
              }}
            >
              {member.description}
            </Text>
          </Box>
        </Stack>

        {/* Indicador "Ver mais" no hover */}
        <Box
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            padding: "8px",
            textAlign: "center",
            transform: isHovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          Ver mais
        </Box>
      </Card>
    </motion.div>
  );
};

// Componente de categoria horizontal (DESKTOP)
const TeamCategoryHorizontal = ({
  position,
  members,
  index,
}: {
  position: string;
  members: TeamMember[];
  index: number;
}) => {
  // Centraliza quando há menos de 3 membros
  const shouldCenter = members.length < 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Box
        style={{
          marginBottom: 40,
        }}
      >
        {/* Título centralizado */}
        <Text
          size="xl"
          fw={700}
          ta="center"
          mb="xs"
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "var(--primary)",
          }}
        >
          {position}
        </Text>

        {/* Barra azul abaixo do título */}
        <Box
          style={{
            width: "100%",
            height: 6,
            backgroundColor: "var(--primary)",
            marginBottom: 24,
          }}
        />

        {/* Grid de membros */}
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: shouldCenter
              ? `repeat(${members.length}, 1fr)`
              : "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            justifyContent: shouldCenter ? "center" : "start",
            maxWidth: shouldCenter ? `${members.length * 350}px` : "100%",
            margin: shouldCenter ? "0 auto" : "0",
          }}
        >
          {members.map((member, idx) => (
            <TeamMemberGridItem key={member.name} member={member} index={idx} />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

// Página principal
export default function TeamPage() {
  const { teamData, isLoading, orderedPositions } = useTeamData();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const isTablet = useMediaQuery("(max-width: 75em)");
  const [gridKey, setGridKey] = useState(0);

  // Fallback para ordem de cargos caso não haja em state
  const effectiveOrderedPositions = useMemo<string[]>(
    () => (orderedPositions.length ? orderedPositions : Object.keys(teamData)),
    [orderedPositions, teamData]
  );

  // Contadores derivados (evita recalcular)
  const membersCount = useMemo(
    () => Object.values(teamData).flat().length,
    [teamData]
  );
  const positionsCount = useMemo(
    () => effectiveOrderedPositions.length,
    [effectiveOrderedPositions]
  );

  // Define número de colunas baseado na tela
  const gridCols = isMobile ? 1 : isTablet ? 2 : 3;

  // Re-renderiza o grid quando o loading termina
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
        paddingBottom: isMobile ? 60 : 80,
        overflow: "hidden",
      }}
    >
      {isLoading ? (
        <Center h={400}>
          <Loader size="lg" color={"var(--primary)"} />
        </Center>
      ) : (
        /* Fundo animado */
        <FlickeringGrid
          key={gridKey}
          squareSize={8}
          gridGap={6}
          color="rgb(255, 255, 255)"
          maxOpacity={0.4}
          flickerChance={0.005}
        />
      )}

      <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
        {/* Cabeçalho */}
        <PagesHeader
          icon={IconUsers}
          title={teamPageContent.hero.title}
          subtitle={teamPageContent.hero.subtitle}
          metrics={
            !isLoading && positionsCount > 0
              ? [
                  {
                    label: teamPageContent.stats.label,
                    value: membersCount,
                  },
                ]
              : []
          }
        />

        {/* Conteúdo */}
        <Paper
          shadow="xl"
          p={isMobile ? "lg" : "xl"}
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
          }}
        >
          {positionsCount > 0 ? (
            isMobile ? (
              // Layout MOBILE: colunas verticais com barra lateral
              <SimpleGrid cols={1} spacing="md" verticalSpacing="md">
                {effectiveOrderedPositions.map((position, index) => (
                  <TeamCategoryColumn
                    key={position}
                    position={position}
                    members={teamData[position]}
                    index={index}
                  />
                ))}
              </SimpleGrid>
            ) : (
              // Layout DESKTOP: barras horizontais com grid
              <Stack gap="xl">
                {effectiveOrderedPositions.map((position, index) => (
                  <TeamCategoryHorizontal
                    key={position}
                    position={position}
                    members={teamData[position]}
                    index={index}
                  />
                ))}
              </Stack>
            )
          ) : (
            <Center h={300}>
              <Text ta="center" c="dimmed" size="lg">
                No team members found.
              </Text>
            </Center>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
