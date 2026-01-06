"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Container, ActionIcon, Group } from "@mantine/core";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

export interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showNavButtons?: boolean;
  itemWidth?: number | string;
  itemWidthMobile?: number | string;
  itemGap?: number;
  itemGapMobile?: number;
  itemsPerView?: number;
  itemsPerViewMobile?: number;
  containerSize?: "xs" | "sm" | "md" | "lg" | "xl";
  enableDrag?: boolean;
}

const MotionBox = motion(Box as any);

// Botão de navegação reutilizável
interface NavButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  isMobile?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  direction,
  onClick,
  isMobile = false,
}) => {
  const wrapperStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    [direction]: isMobile ? -16 : 8,
    transform: "translateY(-50%)",
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "white",
    color: "#333",
    padding: isMobile ? 8 : 6,
    border: "2px solid rgba(82, 175, 225, 0.3)",
  };

  return (
    <div style={wrapperStyle} aria-hidden={false}>
      <ActionIcon
        variant="filled"
        size={isMobile ? "xl" : "xl"}
        radius="xl"
        onClick={onClick}
        style={buttonStyle}
        component={motion.button}
        whileHover={{ scale: 1.08, boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}
        whileTap={{ scale: 0.98 }}
        aria-label={direction === "left" ? "Previous" : "Next"}
      >
        {direction === "left" ? (
          <IconChevronLeft
            size={isMobile ? 24 : 28}
            stroke={2}
            color="var(--primary)"
          />
        ) : (
          <IconChevronRight
            size={isMobile ? 24 : 28}
            stroke={2}
            color="var(--primary)"
          />
        )}
      </ActionIcon>
    </div>
  );
};

// Indicadores (dots)
interface DotsProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
  isMobile?: boolean;
}

const Dots: React.FC<DotsProps> = ({
  total,
  current,
  onDotClick,
  isMobile = false,
}) => (
  <Group justify="center" gap="xs" mt={isMobile ? "lg" : "md"}>
    {Array.from({ length: total }, (_, index) => (
      <Box
        key={index}
        component={motion.button}
        onClick={() => onDotClick(index)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: current === index ? 32 : 8,
          height: 8,
          borderRadius: 4,
          border: "none",
          cursor: "pointer",
          backgroundColor:
            index === current ? "var(--primary)" : "rgba(82, 175, 225, 0.2)",
          transition: "all 0.3s ease",
        }}
      />
    ))}
  </Group>
);

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = true,
  autoPlayInterval = 20000,
  showDots = true,
  showNavButtons = true,
  itemWidth: propItemWidth,
  itemWidthMobile: propItemWidthMobile,
  itemGap: propItemGap,
  itemGapMobile: propItemGapMobile,
  itemsPerView = 1,
  itemsPerViewMobile = 1,
  containerSize = "xl",
  enableDrag = true,
}) => {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useMediaQuery("(max-width: 62em)", false, {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Calcular altura máxima dos itens
  useEffect(() => {
    const calculateMaxHeight = () => {
      const heights = itemRefs.current
        .filter((ref) => ref !== null)
        .map((ref) => ref!.offsetHeight);

      if (heights.length > 0) {
        const max = Math.max(...heights);
        setMaxHeight(max);
      }
    };

    // Calcular após renderização e mudanças de layout
    const timer = setTimeout(calculateMaxHeight, 100);

    if (typeof window !== "undefined") {
      window.addEventListener("resize", calculateMaxHeight);
    }

    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", calculateMaxHeight);
      }
    };
  }, [children, isMobile, viewportWidth]);

  // Calcular dimensões do carrossel baseado no dispositivo
  const defaultItemWidthDesktop = 340;
  const defaultItemWidthMobile = 260;
  const defaultItemGapDesktop = 20;
  const defaultItemGapMobile = 12;

  const resolveWidth = (
    value: number | string | undefined,
    fallback: number
  ): { numeric: number; css: number | string } => {
    if (typeof value === "number") {
      return { numeric: value, css: value };
    }

    if (typeof value !== "string") {
      return { numeric: fallback, css: fallback };
    }

    const trimmed = value.trim();
    const parsed = parseFloat(trimmed);
    const hasNumber = !Number.isNaN(parsed);

    if (trimmed.endsWith("vw") || trimmed.endsWith("%")) {
      const pct = hasNumber ? parsed : 100;
      const numeric = ((viewportWidth || fallback) * pct) / 100;
      return {
        numeric,
        css: trimmed.endsWith("%") ? `${pct}vw` : trimmed,
      };
    }

    if (trimmed.endsWith("px")) {
      return { numeric: hasNumber ? parsed : fallback, css: trimmed };
    }

    if (hasNumber) {
      return { numeric: parsed, css: parsed };
    }

    return { numeric: fallback, css: fallback };
  };

  const rawItemWidth = isMobile
    ? propItemWidthMobile ?? defaultItemWidthMobile
    : propItemWidth ?? defaultItemWidthDesktop;

  const { numeric: itemWidth, css: itemWidthCss } = resolveWidth(
    rawItemWidth,
    isMobile ? defaultItemWidthMobile : defaultItemWidthDesktop
  );

  const itemGap = isMobile
    ? propItemGapMobile ?? defaultItemGapMobile
    : propItemGap ?? defaultItemGapDesktop;

  const currentItemsPerView = isMobile ? itemsPerViewMobile : itemsPerView;
  const totalItems = React.Children.count(children);
  const totalPages = Math.ceil(totalItems / currentItemsPerView);

  // Calcular largura total do container
  const containerWidth = (itemWidth + itemGap) * totalItems - itemGap;
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
        threshold: 0.1,
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
    if (!autoPlay || isPaused || !isVisible || totalPages <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

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
    totalPages,
  ]);

  // Funções de navegação
  const nextSlide = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalPages;
    const moveAmount = (itemWidth + itemGap) * currentItemsPerView;
    const newPosition = initialPosition - moveAmount * nextIndex;

    controls.start({
      x: newPosition,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    });

    setCurrentIndex(nextIndex);
  }, [
    currentIndex,
    totalPages,
    initialPosition,
    controls,
    itemWidth,
    itemGap,
    currentItemsPerView,
  ]);

  const prevSlide = useCallback(() => {
    const prevIndex = currentIndex === 0 ? totalPages - 1 : currentIndex - 1;
    const moveAmount = (itemWidth + itemGap) * currentItemsPerView;
    const newPosition = initialPosition - moveAmount * prevIndex;

    controls.start({
      x: newPosition,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    });

    setCurrentIndex(prevIndex);
  }, [
    currentIndex,
    totalPages,
    initialPosition,
    controls,
    itemWidth,
    itemGap,
    currentItemsPerView,
  ]);

  const goToSlide = useCallback(
    (index: number) => {
      const moveAmount = (itemWidth + itemGap) * currentItemsPerView;
      const newPosition = initialPosition - moveAmount * index;

      controls.start({
        x: newPosition,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
      });

      setCurrentIndex(index);
    },
    [initialPosition, controls, itemWidth, itemGap, currentItemsPerView]
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
        const moveAmount = (itemWidth + itemGap) * currentItemsPerView;
        const currentPosition = initialPosition - moveAmount * currentIndex;
        controls.start({
          x: currentPosition,
          transition: { duration: 0.3 },
        });
      }
    },
    [
      currentIndex,
      initialPosition,
      controls,
      prevSlide,
      nextSlide,
      itemWidth,
      itemGap,
      currentItemsPerView,
    ]
  );

  if (totalItems === 0) return null;

  const showControls = totalPages > 1;

  return (
    <Container
      size={isMobile ? "sm" : containerSize}
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
          overflow: "visible",
          width: "100%",
          padding: "20px 0",
          touchAction: enableDrag ? "pan-y pinch-zoom" : "auto",
          maxWidth: "100%",
          margin: "0 auto",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Container de overflow para o carrossel */}
        <Box style={{ overflow: "visible", width: "100%" }}>
          {/* Container principal do carrossel */}
          <MotionBox
            style={{
              display: "flex",
              gap: itemGap,
              width: containerWidth,
              x,
              maxWidth:
                isMobile && typeof itemWidthCss === "string"
                  ? itemWidthCss
                  : undefined,
              willChange: "transform",
              alignItems: "stretch",
            }}
            animate={controls}
            drag={enableDrag ? "x" : false}
            dragConstraints={{
              left: -containerWidth + itemWidth * currentItemsPerView,
              right: 0,
            }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragEnd={enableDrag ? handleDragEnd : undefined}
          >
            {React.Children.map(children, (child, index) => (
              <Box
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                style={{
                  flexShrink: 0,
                  width: itemWidthCss,
                  pointerEvents: "auto",
                  height: maxHeight ? `${maxHeight}px` : "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box style={{ flex: 1, display: "flex" }}>{child}</Box>
              </Box>
            ))}
          </MotionBox>
        </Box>

        {/* Botões de navegação */}
        {showControls && showNavButtons && (
          <>
            <NavButton
              direction="left"
              onClick={prevSlide}
              isMobile={isMobile}
            />
            <NavButton
              direction="right"
              onClick={nextSlide}
              isMobile={isMobile}
            />
          </>
        )}

        {/* Indicadores */}
        {showControls && showDots && (
          <Dots
            total={totalPages}
            current={currentIndex}
            onDotClick={goToSlide}
            isMobile={isMobile}
          />
        )}
      </Box>
    </Container>
  );
};

export default Carousel;
