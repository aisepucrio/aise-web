"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Text, Loader, Center, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import SectionWithHeader from "@/components/home/SectionWithHeader";
import homeTexts from "@/../public/json/home.json";
import AwardedPublicationCard from "./AwardedPublicationCard";
import { Carousel } from "@shared/ui";

/* ========= Tipos ========= */

export type Publication = {
  title: string;
  year: string | number;
  link: string;
  awards?: string;
  citation_number?: number;
};

type PublicationsResponse = {
  publications: Publication[];
};

/* ========= Hook para carregar publicações premiadas ========= */

const useAwardedPublications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPublications = async () => {
      try {
        const res = await fetch("/api/publications", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load publications");
        }

        const data: PublicationsResponse = await res.json();

        if (!mounted) return;

        const awarded = (data.publications || []).filter(
          (p) => typeof p.awards === "string" && p.awards.trim().length > 0
        );

        setHasError(false);
        setPublications(awarded);
      } catch (err) {
        if (!mounted) return;

        setHasError(true);
        setPublications([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadPublications();

    return () => {
      mounted = false;
    };
  }, []);

  return { publications, isLoading, hasError };
};

/* ========= Seção de publicações premiadas no header ========= */

export default function AwardedPublicationsHeaderSection() {
  const { publications, isLoading, hasError } = useAwardedPublications();
  const isMobile = useMediaQuery("(max-width: 62em)");

  const hasPublications = publications.length > 0;
  const texts = homeTexts.publicationSections.awarded;

  return (
    <SectionWithHeader
      title={texts.title}
      subtitle={texts.subtitle}
      button={texts.button}
      isMobile={isMobile}
    >
      <Container size="xl" style={{ padding: 0 }}>
        {isLoading ? (
          <Center h={200}>
            <Loader size="lg" color="var(--primary)" />
          </Center>
        ) : hasError ? (
          <Center h={200}>
            <Stack gap={4} align="center">
              <Text fw={600}>Error loading publications</Text>
            </Stack>
          </Center>
        ) : !hasPublications ? (
          <Center h={120}>
            <Text ta="center" c="dimmed" size="sm">
              No awards yet.
            </Text>
          </Center>
        ) : (
          <Box>
            <Carousel
              itemsPerView={3}
              itemsPerViewMobile={1}
              itemWidth={360}
              itemWidthMobile={280}
              itemGap={20}
              itemGapMobile={14}
              containerSize="xl"
              autoPlay={true}
              autoPlayInterval={20000}
              showDots={true}
              showNavButtons={true}
              enableDrag={true}
            >
              {publications.map((publication, index) => (
                <AwardedPublicationCard
                  key={`${publication.title}-${index}`}
                  publication={publication}
                  index={index}
                />
              ))}
            </Carousel>
          </Box>
        )}
      </Container>
    </SectionWithHeader>
  );
}
