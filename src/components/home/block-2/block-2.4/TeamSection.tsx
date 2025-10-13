"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Container,
  Text,
  Loader,
  Center,
  Button,
} from "@mantine/core";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { motion, useInView } from "framer-motion";
import InfiniteCarousel from "./InfiniteCarousel";
import Titulo from "@/components/Titulo";
import type { PersonCardProps } from "./PersonCard";

// Dados
const TITLE = "Researchers & Creators";
const SUBTITLE =
  "Behind every line of code, every research paper, and every prototype, there’s a dedicated team of thinkers, builders, and learners.";

interface TeamMember {
  name: string;
  position: string;
  imageUrl: string;
  description: string;
}

interface TeamData {
  team: TeamMember[];
}

// Hook personalizado para carregar dados do time
const useTeamData = () => {
  const [teamData, setTeamData] = useState<PersonCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTeamData = async () => {
      try {
        const res = await fetch("/json/team-data.json", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Falha ao carregar dados");
        }

        const data: TeamData = await res.json();

        // Converter dados para formato do PersonCard
        const formatted: PersonCardProps[] = data.team.map((member) => ({
          name: member.name,
          position: member.position,
          imageUrl: member.imageUrl,
          description: member.description,
        }));

        if (mounted) {
          setTeamData(formatted);
        }
      } catch {
        if (mounted) {
          notifications.show({
            title: "Erro ao carregar equipe",
            message: "Tente novamente mais tarde.",
            color: "red",
            withCloseButton: true,
          });
          setTeamData([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadTeamData();

    return () => {
      mounted = false;
    };
  }, []);

  return { teamData, isLoading };
};

// Componente do cabeçalho da seção
const SectionHeader = () => {
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <Box ta="center" mb={isMobile ? 20 : 40}>
      <Titulo
        verticalMarginDesktop={24}
        verticalMarginMobile={12}
        color="#000000ff"
      >
        {TITLE}
      </Titulo>
      <Text size={isMobile ? "sm" : "md"} c="dimmed" w="90%" mx="auto" lh={1.6}>
        {SUBTITLE}
      </Text>
    </Box>
  );
};

// Componente de loading
const LoadingState = () => (
  <Center h={400}>
    <Loader size="lg" />
  </Center>
);

// Componente de estado vazio
const EmptyState = () => (
  <Center h={200}>
    <Text ta="center" c="dimmed">
      Nenhum membro encontrado.
    </Text>
  </Center>
);

// Configuração de animação para entrada da seção
const animationConfig = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  },
};

export default function TeamSection() {
  const { teamData, isLoading } = useTeamData();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={animationConfig.initial}
      animate={isInView ? animationConfig.animate : animationConfig.initial}
      transition={animationConfig.transition}
    >
      <Paper
        component="section"
        py={isMobile ? 24 : 42}
        px={8}
        shadow="md"
        style={{
          width: "100%",
          borderRadius: 24,
          background: "rgba(255, 255, 255, 1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Container size="xl" style={{ padding: 0 }}>
          <SectionHeader />

          {isLoading ? (
            <LoadingState />
          ) : teamData.length > 0 ? (
            <InfiniteCarousel
              people={teamData}
              autoPlay
              autoPlayInterval={5000}
              showDots
            />
          ) : (
            <EmptyState />
          )}
          {/* Centered See team button */}
          <Center mt={24}>
            <Button
              component={Link}
              href="/team"
              size="lg"
              style={{ backgroundColor: "var(--primary)", border: "none" }}
            >
              See more
            </Button>
          </Center>
        </Container>
      </Paper>
    </motion.div>
  );
}
