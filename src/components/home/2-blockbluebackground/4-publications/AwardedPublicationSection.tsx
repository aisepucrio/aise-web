"use client";

import React, { useEffect, useState, useRef } from "react";
import { Box, Container, Text, Loader, Center, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion, useInView } from "framer-motion";
import SectionWithHeader from "@/components/SectionWithHeader";
import homeTexts from "@/../public/json/home-content.json";
import AwardedPublicationCard from "./AwardedPublicationCard";
import Carousel from "@/components/Carousel";

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

/* ========= Animação da seção ========= */

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

const ErrorState = ({ title, message }: { title: string; message: string }) => (
  <Center h={200}>
    <Stack gap={4} align="center">
      <Text fw={600}>{title}</Text>
      <Text ta="center" c="dimmed" size="sm">
        {message}
      </Text>
    </Stack>
  </Center>
);

/* ========= Seção de publicações premiadas no header ========= */

export default function AwardedPublicationsHeaderSection() {
  const { publications, isLoading, hasError } = useAwardedPublications();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const hasPublications = publications.length > 0;
  const texts = homeTexts.publicationSections.awarded;

  return (
    <motion.div
      ref={ref}
      initial={animationConfig.initial}
      animate={isInView ? animationConfig.animate : animationConfig.initial}
      transition={animationConfig.transition}
    >
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
            <ErrorState
              title={texts.error.title}
              message={texts.error.message}
            />
          ) : !hasPublications ? (
            <Center h={120}>
              <Text ta="center" c="dimmed" size="sm">
                {texts.emptyStateText}
              </Text>
            </Center>
          ) : (
            <Box>
              <Carousel
                itemsPerView={1}
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
    </motion.div>
  );
}
