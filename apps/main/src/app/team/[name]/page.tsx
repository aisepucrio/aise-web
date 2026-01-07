"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Box, Text, Loader, Center, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import BackButton from "@/components/BackButton";
import FlickeringGrid from "@/components/FlickeringGrid";
import { TeamMemberProfile, TeamMember as TeamMemberType } from "@shared/ui";

// Tipos essenciais
// Local TeamMember type is compatible with the one exported by the profile component
type TeamMember = TeamMemberType;
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
        const res = await fetch("/api/team", {
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
          console.error("Team member not found:", slug);
        }
      } catch {
        if (!mounted) return;
        console.error("Failed to load team member data");
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

// (SocialLinks was moved into the external TeamMemberProfile component)

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
              <BackButton onClick={() => router.push("/team")}>
                Back to Team
              </BackButton>
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
        {/* Back button */}
        <BackButton onClick={() => router.push("/team")}>
          Back to Team
        </BackButton>

        <TeamMemberProfile member={member} />
      </Container>
    </Box>
  );
}
