"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Text,
  Loader,
  Center,
  SimpleGrid,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion, useInView } from "framer-motion";
import SectionWithHeader from "@/components/SectionWithHeader";
import componentTexts from "@/../public/json/components-content.json";
import AwardedPublicationCard from "./AwardedPublicationCard";

/* ========= Tipos ========= */

export type Publication = {
  title: string;
  year: string | number;
  link: string;
  awards?: string;
};

type PublicationsResponse = {
  publications: Publication[];
};

/* ========= Hook para carregar publicações premiadas ========= */

const useAwardedPublications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        setPublications(awarded);
      } catch (err) {
        if (!mounted) return;

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

  return { publications, isLoading };
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

/* ========= Seção de publicações premiadas no header ========= */

export default function AwardedPublicationsHeaderSection() {
  const { publications, isLoading } = useAwardedPublications();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const isMd = useMediaQuery("(max-width: 48em)");
  const isSm = useMediaQuery("(max-width: 30em)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const hasPublications = publications.length > 0;
  const texts = componentTexts.awardedPublicationsSection;

  // compute cols based on viewport breakpoints (replace unsupported SimpleGrid 'breakpoints' prop)
  const gridCols = isSm ? 1 : isMd ? 2 : isMobile ? 3 : 4;

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
        button={{
          text: texts.ctaText,
          href: texts.ctaHref,
        }}
        isMobile={isMobile}
      >
        <Container size="xl" style={{ padding: 0 }}>
          {isLoading ? (
            <Center h={200}>
              <Loader size="lg" color="var(--primary)" />
            </Center>
          ) : !hasPublications ? (
            <Center h={120}>
              <Text ta="center" c="dimmed" size="sm">
                {texts.emptyStateText}
              </Text>
            </Center>
          ) : (
            <Box>
              <SimpleGrid cols={gridCols} spacing={isMobile ? 16 : 24}>
                {publications.map((publication, index) => (
                  <AwardedPublicationCard
                    key={`${publication.title}-${index}`}
                    publication={publication}
                    index={index}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Container>
      </SectionWithHeader>
    </motion.div>
  );
}
