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
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { notifications } from "@mantine/notifications";
import { PersonCard, PersonCardProps } from "@/components/PersonCard";
import FlickeringGrid from "@/components/FlickeringGrid";
import teamPageContent from "@/../public/json/team-page-content.json";
import { IconUsers } from "@tabler/icons-react";

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

// Cartão simples para evitar duplicação nas estatísticas
const StatsCard = ({ value, label }: { value: number; label: string }) => (
  <Paper
    shadow="md"
    radius="lg"
    p="lg"
    style={{ background: "rgba(255,255,255,0.95)" }}
  >
    <Text fz={32} fw={800} ta="center" style={{ color: "var(--primary)" }}>
      {value}
    </Text>
    <Text size="sm" ta="center" c="dimmed" fw={600}>
      {label}
    </Text>
  </Paper>
);

// Hook para calcular colunas e largura dos cards baseado na largura da tela
const useResponsiveGrid = () => {
  const [gridConfig, setGridConfig] = useState({ columns: 4, cardWidth: 280 });

  useEffect(() => {
    const calculateGrid = () => {
      const width = window.innerWidth;
      const gap = 48;
      const containerPadding = width < 992 ? 32 : 64; // Padding do Container + Paper
      const availableWidth = Math.min(width - containerPadding, 1200); // Max container width

      let columns: number;
      let cardWidth: number;

      if (width < 480) {
        // Telas muito pequenas: 2 colunas
        columns = 2;
        cardWidth = Math.floor((availableWidth - gap) / 2);
      } else if (width < 768) {
        // Mobile: 2-3 colunas dependendo do espaço
        const testWidth3 = (availableWidth - gap * 2) / 3;
        if (testWidth3 >= 140) {
          columns = 3;
          cardWidth = Math.floor(testWidth3);
        } else {
          columns = 2;
          cardWidth = Math.floor((availableWidth - gap) / 2);
        }
      } else if (width < 992) {
        // Tablet: 3 colunas
        columns = 3;
        cardWidth = Math.floor((availableWidth - gap * 2) / 3);
      } else {
        // Desktop: 4 colunas
        columns = 4;
        cardWidth = Math.floor((availableWidth - gap * 3) / 4);
      }

      // Limita a largura máxima e mínima dos cards
      cardWidth = Math.max(120, Math.min(cardWidth, 300));

      setGridConfig({ columns, cardWidth });
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  return gridConfig;
};

// Lista de membros por cargo
const TeamCategory = ({
  position,
  members,
  index,
  columns,
  cardWidth,
}: {
  position: string;
  members: TeamMember[];
  index: number;
  columns: number;
  cardWidth: number;
}) => {
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Box mb={isMobile ? 32 : 64}>
        {/* Cabeçalho da categoria */}
        <Group justify="flex-start" mb={isMobile ? 20 : 30}>
          <Badge
            size={isMobile ? "lg" : "xl"}
            variant="filled"
            style={{
              fontSize: isMobile ? "0.9rem" : "1.1rem",
              fontWeight: 700,
              padding: isMobile ? "12px 20px" : "16px 28px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            {position}
          </Badge>
        </Group>

        {/* Grid de membros */}
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: isMobile ? 16 : 24,
            justifyItems: "start",
          }}
        >
          {members.map((member) => {
            const personCardData: PersonCardProps = {
              name: member.name,
              position: member.position,
              imageUrl: member.imageUrl,
              description: member.description,
              cardWidth: cardWidth,
            };
            return (
              <Box key={member.name}>
                <PersonCard {...personCardData} />
              </Box>
            );
          })}
        </Box>
      </Box>
    </motion.div>
  );
};

// Página principal
export default function TeamPage() {
  const { teamData, isLoading, orderedPositions } = useTeamData();
  const { columns, cardWidth } = useResponsiveGrid();
  const isMobile = useMediaQuery("(max-width: 62em)");
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Group gap="xs" mb={isMobile ? 24 : 32} mt={isMobile ? 24 : 32}>
            <ThemeIcon
              size={isMobile ? 42 : 56}
              radius="lg"
              variant="white"
              color="var(--primary)"
              style={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" }}
            >
              <IconUsers size={isMobile ? 24 : 32} />
            </ThemeIcon>
            <Title
              order={1}
              style={{
                color: "#ffffff",
                fontWeight: 800,
                fontSize: isMobile ? "38px" : "56px",
                lineHeight: 1,
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              {teamPageContent.hero.title}
            </Title>
          </Group>

          <Box
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 16 : 24,
              alignItems: isMobile ? "flex-start" : "flex-end",
              marginBottom: isMobile ? 40 : 60,
            }}
          >
            <Text
              size={isMobile ? "md" : "lg"}
              ta="left"
              c="white"
              maw={800}
              lh={1.6}
              style={{ fontWeight: 400, flex: 1 }}
            >
              {teamPageContent.hero.subtitle}
            </Text>

            {/* Estatísticas */}
            {!isLoading && positionsCount > 0 && (
              <Group
                justify="flex-end"
                gap={isMobile ? "md" : "xl"}
                style={{
                  marginLeft: isMobile ? 0 : "auto",
                  marginTop: isMobile ? 20 : 0,
                  flexShrink: 0,
                }}
              >
                <StatsCard
                  value={membersCount}
                  label={teamPageContent.members.label}
                />
              </Group>
            )}
          </Box>
        </motion.div>

        {/* Conteúdo */}
        <Paper
          shadow="xl"
          p={isMobile ? "lg" : "xl"}
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          {positionsCount > 0 ? (
            <Box>
              {effectiveOrderedPositions.map((position, index) => (
                <TeamCategory
                  key={position}
                  position={position}
                  members={teamData[position]}
                  index={index}
                  columns={columns}
                  cardWidth={cardWidth}
                />
              ))}
            </Box>
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
