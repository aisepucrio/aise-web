"use client";

import React, { useEffect, useState } from "react";
import { Box, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import ProjectCardCompact from "./ProjectCardCompact";

interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  category: string;
  status: string;
  techStack?: string[];
  team?: any[];
}

interface ProjectsCarouselProps {
  projects: Project[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function ProjectsCarousel({
  projects,
  autoPlay = false,
  autoPlayInterval = 5000,
}: ProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 62em)");
  const isTablet = useMediaQuery("(max-width: 90em)");

  // Determina quantos cards mostrar por vez
  const itemsPerView = isMobile ? 1 : isTablet ? 2 : 2;
  const totalPages = Math.ceil(projects.length / itemsPerView);

  // Auto play
  useEffect(() => {
    if (!autoPlay || projects.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, projects.length, itemsPerView, totalPages]);

  // Navegação
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Pega os projetos atuais para exibir
  const startIdx = currentIndex * itemsPerView;
  const currentProjects = projects.slice(startIdx, startIdx + itemsPerView);

  // Não mostrar controles se todos os projetos cabem em uma página
  const showControls = projects.length > itemsPerView;

  return (
    <Box style={{ position: "relative", width: "100%" }}>
      {/* Carousel Container */}
      <Box style={{  position: "relative" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                ? "repeat(2, 1fr)"
                : "repeat(2, 1fr)",
              gap: isMobile ? 24 : 32,
              width: "100%",
            }}
          >
            {currentProjects.map((project, idx) => (
              <ProjectCardCompact
                key={project.id}
                project={project}
                index={idx}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Navigation Controls */}
      {showControls && (
        <>
          {/* Previous Button */}
          <div
            style={{
              position: "absolute",
              left: isMobile ? -12 : -20,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPrev}
              style={{
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                borderRadius: "50%",
                backgroundColor: "white",
                border: "2px solid rgba(82, 175, 225, 0.3)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--primary)",
              }}
              aria-label="Previous projects"
            >
              <IconChevronLeft size={isMobile ? 20 : 24} stroke={2.5} />
            </motion.button>
          </div>

          {/* Next Button */}
          <div
            style={{
              position: "absolute",
              right: isMobile ? -12 : -20,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNext}
              style={{
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                borderRadius: "50%",
                backgroundColor: "white",
                border: "2px solid rgba(82, 175, 225, 0.3)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--primary)",
              }}
              aria-label="Next projects"
            >
              <IconChevronRight size={isMobile ? 20 : 24} stroke={2.5} />
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <Group justify="center" gap="xs" mt={isMobile ? 32 : 40}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: currentIndex === idx ? 32 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    currentIndex === idx
                      ? "var(--primary)"
                      : "rgba(82, 175, 225, 0.2)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </Group>
        </>
      )}
    </Box>
  );
}
