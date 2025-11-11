"use client";

import React, { useEffect, useState, useRef } from "react";
import { Box, Paper, Container, Text, Loader, Center } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { motion, useInView } from "framer-motion";
import Carousel from "@/components/Carousel";
import PersonCard, { PersonCardProps } from "@/components/PersonCard";
import SectionWithHeader from "@/components/SectionWithHeader";
import homeContent from "@/../public/json/home-content.json";

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
        const res = await fetch("/api/data/team", {
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

// Using SectionWithHeader for consistent layout

// Componente de loading
const LoadingState = () => (
  <Center h={400}>
    <Loader size="lg" color="var(--primary)" />
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
      <SectionWithHeader
        title={homeContent.teamSection.title}
        subtitle={homeContent.teamSection.subtitle}
        button={homeContent.teamSection.button}
        isMobile={isMobile}
        paperProps={{ px: 8 }}
      >
        <Container size="xl" style={{ padding: 0 }}>
          {isLoading ? (
            <LoadingState />
          ) : teamData.length > 0 ? (
            <Carousel
              autoPlay
              autoPlayInterval={5000}
              showDots
              itemWidth={280}
              itemWidthMobile={200}
              itemsPerView={1}
              itemsPerViewMobile={1}
            >
              {teamData.map((person, index) => (
                <PersonCard key={`${person.name}-${index}`} {...person} cardWidth={isMobile ? 200 : 280} />
              ))}
            </Carousel>
          ) : (
            <EmptyState />
          )}
        </Container>
      </SectionWithHeader>
    </motion.div>
  );
}
