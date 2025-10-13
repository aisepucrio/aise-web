"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Container, ActionIcon, Group } from "@mantine/core";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import PersonCard, { PersonCardProps } from "./PersonCard";

interface InfiniteCarouselProps {
  people: PersonCardProps[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
}

const MotionBox = motion(Box as any);

// Configurações do carrossel
const CARD_WIDTH = 300;
const CARD_WIDTH_MOBILE = 200;
const CARD_GAP = 20;
const CARD_GAP_MOBILE = 10;

// Botão de navegação reutilizável
interface NavButtonProps {
  direction: "left" | "right";
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ direction, onClick }) => (
  <ActionIcon
    variant="filled"
    size="xl"
    radius="xl"
    onClick={onClick}
    style={{
      position: "absolute",
      top: "50%",
      [direction]: 8,
      y: "-50%",
      zIndex: 20,
      backgroundColor: "white",
      color: "#333",
      padding: 6,
      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
    }}
    component={motion.button}
    whileHover={{ scale: 1.08, boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}
    whileTap={{ scale: 0.98 }}
  >
    {direction === "left" ? (
      <IconChevronLeft size={28} />
    ) : (
      <IconChevronRight size={28} />
    )}
  </ActionIcon>
);

// Indicadores (dots)
interface DotsProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}

const Dots: React.FC<DotsProps> = ({ total, current, onDotClick }) => (
  <Group justify="center" gap="xs" mt="md">
    {Array.from({ length: total }, (_, index) => (
      <Box
        key={index}
        component={motion.button}
        onClick={() => onDotClick(index)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          backgroundColor: index === current ? "#52AFE1" : "#e5e7eb",
          transition: "background-color 0.2s",
        }}
      />
    ))}
  </Group>
);

export const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  people,
  autoPlay = true,
  autoPlayInterval = 20000,
  showDots = true,
}) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery("(max-width: 62em)", false, {
    getInitialValueInEffect: true,
  });

  // Calcular dimensões do carrossel baseado no dispositivo
  const cardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH;
  const cardGap = isMobile ? CARD_GAP_MOBILE : CARD_GAP;
  const totalSlides = people.length;

  // Incluir gaps no cálculo total do container
  const containerWidth = (cardWidth + cardGap) * totalSlides - cardGap;
  const initialPosition = 0;

  // Inicialização do carrossel
  useEffect(() => {
    x.set(initialPosition);
    controls.set({ x: initialPosition });
  }, [x, controls, initialPosition]);

  // Intersection Observer para detectar visibilidade
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Considera visível quando 10% do carrossel está na tela
      }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  // Controle do auto-play
  useEffect(() => {
    if (!autoPlay || isPaused || !isVisible || totalSlides === 0) {
      // Limpar intervalo quando qualquer condição não for atendida
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Iniciar novo intervalo apenas se não houver um ativo
    intervalRef.current = setInterval(nextSlide, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    autoPlay,
    autoPlayInterval,
    isPaused,
    isVisible,
    currentIndex,
    totalSlides,
  ]);

  // Funções de navegação
  const nextSlide = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalSlides;
    const newPosition = initialPosition - cardWidth * nextIndex;

    controls.start({
      x: newPosition,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    });

    setCurrentIndex(nextIndex);
  }, [currentIndex, totalSlides, initialPosition, controls, cardWidth]);

  const prevSlide = useCallback(() => {
    const prevIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    const newPosition = initialPosition - cardWidth * prevIndex;

    controls.start({
      x: newPosition,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    });

    setCurrentIndex(prevIndex);
  }, [currentIndex, totalSlides, initialPosition, controls, cardWidth]);

  const goToSlide = useCallback(
    (index: number) => {
      const newPosition = initialPosition - cardWidth * index;

      controls.start({
        x: newPosition,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
      });

      setCurrentIndex(index);
    },
    [initialPosition, controls, cardWidth]
  );

  // Handlers para pause/resume
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Handler para drag
  const handleDragEnd = useCallback(
    (event: any, info: any) => {
      const threshold = 50;
      if (info.offset.x > threshold) {
        prevSlide();
      } else if (info.offset.x < -threshold) {
        nextSlide();
      } else {
        // Voltar para posição atual
        const currentPosition = initialPosition - cardWidth * currentIndex;
        controls.start({
          x: currentPosition,
          transition: { duration: 0.3 },
        });
      }
    },
    [currentIndex, initialPosition, controls, prevSlide, nextSlide, cardWidth]
  );

  if (totalSlides === 0) return null;

  return (
    <Container
      size={isMobile ? "sm" : "xl"}
      px={16}
      style={{
        maxWidth: isMobile ? "100%" : undefined,
        overflow: "hidden",
      }}
    >
      <Box
        ref={carouselRef}
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          padding: "20px 0",
          touchAction: "pan-y pinch-zoom",
          maxWidth: "100%",
          margin: "0 auto",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Container principal do carrossel */}
        <MotionBox
          style={{
            display: "flex",
            gap: cardGap,
            width: containerWidth,
            x,
            maxWidth: isMobile ? "80vw" : "none",
            willChange: "transform",
          }}
          animate={controls}
          drag="x"
          dragConstraints={{
            left: -containerWidth + cardWidth,
            right: 0,
          }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {people.map((person, index) => (
            <Box
              key={`${person.name}-${index}`}
              style={{
                flexShrink: 0,
                width: cardWidth,
                pointerEvents: "auto",
              }}
            >
              <PersonCard {...person} cardWidth={cardWidth} />
            </Box>
          ))}
        </MotionBox>

        {/* Botões de navegação - ocultos no mobile */}
        {!isMobile && (
          <>
            <NavButton direction="left" onClick={prevSlide} />
            <NavButton direction="right" onClick={nextSlide} />
          </>
        )}

        {/* Indicadores */}
        {showDots && (
          <Dots
            total={totalSlides}
            current={currentIndex}
            onDotClick={goToSlide}
          />
        )}
      </Box>
    </Container>
  );
};

export default InfiniteCarousel;
