"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Box,
  Text,
  Paper,
  Loader,
  Center,
  Stack,
  SimpleGrid,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import FlickeringGrid from "@/components/FlickeringGrid";
import PagesHeader from "@/components/PagesHeader";
import { TeamCategoryColumn } from "@/app/team/page-local/TeamCategoryColumn";
import { TeamCategoryHorizontal } from "@/app/team/page-local/TeamCategoryHorizontal";
import { TeamCategoryPair } from "@/app/team/page-local/TeamCategoryPair";
import teamPageContent from "@/../public/json/team-page-content.json";
import { IconUsers } from "@tabler/icons-react";
import teamPositionsOrder from "@/../public/json/team-positions-order.json";
import { TeamMember } from "./page-local/membertype";

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
        const res = await fetch("/api/team", { cache: "no-store" });
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

// Página principal
export default function TeamPage() {
  const { teamData, isLoading, orderedPositions } = useTeamData();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const isTablet = useMediaQuery("(max-width: 75em)");
  const [gridKey, setGridKey] = useState(0);

  const manualPositionsOrder: string[] =
    (teamPositionsOrder as { positionsOrder?: string[] }).positionsOrder ?? [];

  const effectiveOrderedPositions = useMemo<string[]>(() => {
    const basePositions = orderedPositions.length
      ? orderedPositions
      : Object.keys(teamData);

    // Se não tiver JSON configurado, mantém comportamento antigo
    if (!manualPositionsOrder.length) return basePositions;

    // 1) posições que estão no JSON, na ordem do JSON
    const inConfiguredOrder = manualPositionsOrder.filter((position) =>
      basePositions.includes(position)
    );

    // 2) posições que vieram da API mas não estão no JSON (jogamos pro final)
    const remaining = basePositions.filter(
      (position) => !manualPositionsOrder.includes(position)
    );

    return [...inConfiguredOrder, ...remaining];
  }, [orderedPositions, teamData, manualPositionsOrder]);

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

  // Agrupa categorias consecutivas com soma total ≤ 3 membros
  const groupedCategories = useMemo(() => {
    const result: Array<
      | {
          type: "single";
          position: string;
          members: TeamMember[];
          index: number;
        }
      | {
          type: "pair";
          categories: Array<{ position: string; members: TeamMember[] }>;
          index: number;
        }
    > = [];

    let i = 0;
    while (i < effectiveOrderedPositions.length) {
      const currentPosition = effectiveOrderedPositions[i];
      const currentMembers = teamData[currentPosition];
      const nextPosition = effectiveOrderedPositions[i + 1];
      const nextMembers = nextPosition ? teamData[nextPosition] : [];

      // Se há uma próxima categoria e a soma total é ≤ 3, agrupa
      if (nextPosition && currentMembers.length + nextMembers.length <= 3) {
        result.push({
          type: "pair",
          categories: [
            { position: currentPosition, members: currentMembers },
            { position: nextPosition, members: nextMembers },
          ],
          index: i,
        });
        i += 2; // Pula ambas as categorias
      } else {
        // Categoria individual
        result.push({
          type: "single",
          position: currentPosition,
          members: currentMembers,
          index: i,
        });
        i += 1;
      }
    }

    return result;
  }, [effectiveOrderedPositions, teamData]);

  // Re-renderiza o grid quando o loading termina
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
        {/* Cabeçalho */}
        <PagesHeader
          icon={IconUsers}
          title={teamPageContent.hero.title}
          subtitle={teamPageContent.hero.subtitle}
          metrics={
            positionsCount > 0
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
                    generateSlug={generateSlug}
                  />
                ))}
              </SimpleGrid>
            ) : (
              // Layout DESKTOP: barras horizontais com grid (agrupa categorias pequenas consecutivas)
              <Stack gap="xl">
                {groupedCategories.map((item) =>
                  item.type === "pair" ? (
                    <TeamCategoryPair
                      key={`pair-${item.categories[0].position}-${item.categories[1].position}`}
                      categories={item.categories}
                      startIndex={item.index}
                      generateSlug={generateSlug}
                      viewMoreText={teamPageContent.viewMoreText}
                    />
                  ) : (
                    <TeamCategoryHorizontal
                      key={item.position}
                      position={item.position}
                      members={item.members}
                      index={item.index}
                      generateSlug={generateSlug}
                      viewMoreText={teamPageContent.viewMoreText}
                    />
                  )
                )}
              </Stack>
            )
          ) : (
            <Center h={300}>
              <Text ta="center" c="dimmed" size="lg">
                {teamPageContent.noMembersFound}
              </Text>
            </Center>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
