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

// Dados
const TITLE = "About Us";

const MISSION_DATA = {
  title: "Our Mission",
  description:
    "Transform the software development lifecycle, enhancing productivity, accelerating time-to-market, and raising the bar for quality in software deliverables. We are committed to exploring how AI can reshape every phase of software engineering, from streamlining design and optimizing coding practices to automating testing, refining maintenance strategies, and supporting the human-centric aspects of development.",
  icon: "/images/icons/goal.svg",
  alt: "Goal icon",
};

const HIGHLIGHTS_DATA = [
  {
    title: "Collaborative Innovation",
    description:
      "We actively engage with industry partners and academic institutions to foster interdisciplinary research collaborations. These partnerships enable us to tackle complex challenges at the intersection of AI and software engineering, driving forward the boundaries of technological innovation.",
    icon: "/images/icons/teamwork.svg",
    alt: "Teamwork icon",
  },
  {
    title: "Join Us in Shaping the Future",
    description:
      "Researcher, industry professional, or student passionate about AI and software engineering, we invite you on our journey to redefine the future of technology. Together, let's innovate, collaborate, and pioneer solutions that will shape the next generation of software engineering practices.",
    icon: "/images/icons/rocket.svg",
    alt: "Rocket icon",
  },
];

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
        title={MISSION_DATA.title}
        description={MISSION_DATA.description}
        multiplyer={multiplier}
        iconSrc={MISSION_DATA.icon}
        iconAlt={MISSION_DATA.alt}
      />
    </AnimatedInView>
  );
}

// Seção dos destaques
function HighlightsSection({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <Stack gap="md">
        {HIGHLIGHTS_DATA.map((item, index) => (
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
      {HIGHLIGHTS_DATA.map((item, index) => (
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
          <Titulo>{TITLE}</Titulo>
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
