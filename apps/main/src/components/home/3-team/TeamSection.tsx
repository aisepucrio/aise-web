"use client";

import { useEffect, useState } from "react";
import { Text, Loader, Center, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@shared/ui";
import { PersonCard, PersonCardProps } from "@shared/ui";
import SectionWithHeader from "@/components/home/SectionWithHeader";
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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadTeamData = async () => {
      try {
        const res = await fetch("/api/team", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load team data");
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
          setHasError(false);
          setTeamData(formatted);
        }
      } catch {
        if (mounted) {
          setHasError(true);
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

  return { teamData, isLoading, hasError };
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
      {homeContent.teamSection.emptyStateText}
    </Text>
  </Center>
);

const ErrorState = () => (
  <Center h={200}>
    <Stack gap={4} align="center">
      <Text fw={600}>{homeContent.teamSection.error.title}</Text>
      <Text ta="center" c="dimmed" size="sm">
        {homeContent.teamSection.error.message}
      </Text>
    </Stack>
  </Center>
);

export default function TeamSection() {
  const { teamData, isLoading, hasError } = useTeamData();
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <SectionWithHeader
      title={homeContent.teamSection.title}
      subtitle={homeContent.teamSection.subtitle}
      button={homeContent.teamSection.button}
      isMobile={isMobile}
      paperProps={{ px: 8 }}
    >
      {isLoading ? (
        <LoadingState />
      ) : hasError ? (
        <ErrorState />
      ) : teamData.length > 0 ? (
        <Carousel
          autoPlay
          autoPlayInterval={5000}
          showDots
          itemWidth={280}
          itemWidthMobile={200}
          itemsPerView={3}
          itemsPerViewMobile={1}
        >
          {teamData.map((person, index) => (
            <PersonCard
              key={`${person.name}-${index}`}
              {...person}
              cardWidth={isMobile ? 200 : 280}
            />
          ))}
        </Carousel>
      ) : (
        <EmptyState />
      )}
    </SectionWithHeader>
  );
}
