"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import InfoCard from "@/components/InfoCard";
import Titulo from "@/components/Titulo";
import homeContent from "@/../public/json/home-content.json";

// Configuração das animações de entrada
const ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 24 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
      delay: index * 0.06,
    },
  }),
  idle: { opacity: 1, y: 0, transition: { duration: 0 } },
};

const MotionBox = motion(Box as any);

// Componente para detecção de direção do scroll
function useScrollDirection() {
  const { scrollY } = useScroll();
  const [isScrollingDown, setIsScrollingDown] = useState(true);
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrollingDown(latest > lastY.current);
    lastY.current = latest;
  });

  return isScrollingDown;
}

// Wrapper para animações
interface AnimatedInViewProps {
  index?: number;
  children: React.ReactNode;
  [key: string]: any;
}

function AnimatedInView({
  index = 0,
  children,
  ...props
}: AnimatedInViewProps) {
  const isScrollingDown = useScrollDirection();

  return (
    <MotionBox
      variants={ANIMATION_CONFIG}
      initial="initial"
      whileInView={isScrollingDown ? "visible" : "idle"}
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
      {...props}
    >
      {children}
    </MotionBox>
  );
}

// Seção da missão
function MissionSection({ multiplier }: { multiplier: number }) {
  return (
    <AnimatedInView>
      <InfoCard
        title={homeContent.mission.card.title}
        description={homeContent.mission.card.description}
        multiplyer={multiplier}
        iconSrc={homeContent.mission.card.icon}
        iconAlt={homeContent.mission.card.alt}
      />
    </AnimatedInView>
  );
}

// Seção dos destaques
function HighlightsSection({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <Stack gap="md">
        {homeContent.highlights.map((item, index) => (
          <AnimatedInView key={item.title} index={index + 1}>
            <InfoCard
              title={item.title}
              description={item.description}
              multiplyer={0.8}
              iconSrc={item.icon}
              iconAlt={item.alt}
            />
          </AnimatedInView>
        ))}
      </Stack>
    );
  }

  return (
    <SimpleGrid cols={2} spacing="lg">
      {homeContent.highlights.map((item, index) => (
        <AnimatedInView key={item.title} index={index + 1}>
          <InfoCard
            title={item.title}
            description={item.description}
            multiplyer={0.8}
            iconSrc={item.icon}
            iconAlt={item.alt}
          />
        </AnimatedInView>
      ))}
    </SimpleGrid>
  );
}

// Componente principal
export default function MissionHighlightsSection() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(
    `(max-width: ${theme.breakpoints.md})`,
    undefined,
    { getInitialValueInEffect: true }
  );

  const missionMultiplier = isMobile ? 0.85 : 1;

  return (
    <Box component="section" py="xl">
      <Container size="xl" style={{ padding: 0 }}>
        {/* Título da seção */}
        <AnimatedInView>
          <Titulo>{homeContent.mission.sectionTitle}</Titulo>
        </AnimatedInView>

        {/* Seção da missão */}
        <Box mb="lg">
          <MissionSection multiplier={missionMultiplier} />
        </Box>

        {/* Seção dos destaques */}
        <HighlightsSection isMobile={isMobile} />
      </Container>
    </Box>
  );
}
