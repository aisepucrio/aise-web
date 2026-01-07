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
import FlickeringGrid from "@/components/FlickeringGrid";
import PagesHeader from "@/components/PagesHeader";
import { TeamCategoryColumn } from "@/app/team/page-local/TeamCategoryColumn";
import { TeamCategoryHorizontal } from "@/app/team/page-local/TeamCategoryHorizontal";
import { TeamCategoryPair } from "@/app/team/page-local/TeamCategoryPair";
import content from "@/../public/json/pages-headers.json";
import { IconUsers } from "@tabler/icons-react";
import { TeamMember } from "./page-local/membertype";
import { sortTeamMembers } from "@/lib/Utils";

type TeamData = { team: TeamMember[] };
type GroupedTeam = Record<string, TeamMember[]>;

// Carrega e agrupa a equipe por cargo
const useTeamData = () => {
  const [teamData, setTeamData] = useState<GroupedTeam>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/team", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar dados");
        const data: TeamData = await res.json();

        // Ordena todos os membros (por position e nome)
        const sortedMembers = sortTeamMembers(data.team);

        // Agrupa mantendo a ordem
        const grouped: GroupedTeam = {};
        sortedMembers.forEach((m) => {
          if (!grouped[m.position]) {
            grouped[m.position] = [];
          }
          grouped[m.position].push(m);
        });

        if (mounted) {
          setTeamData(grouped);
        }
      } catch {
        if (mounted) {
          console.error("Failed to load team data");
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

  return { teamData, isLoading };
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
  const { teamData, isLoading } = useTeamData();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const [gridKey, setGridKey] = useState(0);

  // As posições já vêm ordenadas do agrupamento
  const effectiveOrderedPositions = useMemo<string[]>(
    () => Object.keys(teamData),
    [teamData]
  );
  const membersCount = useMemo(
    () => Object.values(teamData).flat().length,
    [teamData]
  );
  const positionsCount = useMemo(
    () => effectiveOrderedPositions.length,
    [effectiveOrderedPositions]
  );

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
          title={content.teamHero.title}
          subtitle={content.teamHero.subtitle}
          metrics={
            positionsCount > 0
              ? [
                  {
                    label: "Team Members",
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
                    />
                  ) : (
                    <TeamCategoryHorizontal
                      key={item.position}
                      position={item.position}
                      members={item.members}
                      index={item.index}
                      generateSlug={generateSlug}
                    />
                  )
                )}
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
