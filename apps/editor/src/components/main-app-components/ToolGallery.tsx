"use client";

import React, { useState } from "react";
import { Box, ActionIcon, Group, Paper, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion, AnimatePresence } from "framer-motion";
import ImgboxImage from "../ImgboxImage";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMaximize,
} from "@tabler/icons-react";

export interface ToolGalleryProps {
  images: string[];
  toolName: string;
}

const MotionBox = motion(Box as any);

export const ToolGallery: React.FC<ToolGalleryProps> = ({
  images,
  toolName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 62em)");

  if (!images || images.length === 0) return null;

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <Box>
      {/* Galeria Principal */}
      <Paper
        shadow="xs"
        radius="lg"
        p={0}
        style={{
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box
          style={{
            position: "relative",
            height: isFullscreen ? "90vh" : isMobile ? 300 : 500,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <MotionBox
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(
                _e: any,
                {
                  offset,
                  velocity,
                }: { offset: { x: number }; velocity: { x: number } }
              ) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  goToNext();
                } else if (swipe > swipeConfidenceThreshold) {
                  goToPrevious();
                }
              }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                cursor: "grab",
              }}
            >
              <ImgboxImage
                src={images[currentIndex]}
                alt={`${toolName} - Screenshot ${currentIndex + 1}`}
                fill
                style={{
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            </MotionBox>
          </AnimatePresence>

          {/* Controles de navegação */}
          {images.length > 1 && (
            <>
              <ActionIcon
                size={isMobile ? "lg" : "xl"}
                radius="lg"
                variant="filled"
                color="var(--primary)"
                style={{
                  position: "absolute",
                  left: isMobile ? 8 : 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
                onClick={goToPrevious}
                aria-label="Previous Image"
              >
                <IconChevronLeft size={isMobile ? 20 : 24} />
              </ActionIcon>

              <ActionIcon
                size={isMobile ? "lg" : "xl"}
                radius="lg"
                variant="filled"
                color="var(--primary)"
                style={{
                  position: "absolute",
                  right: isMobile ? 8 : 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
                onClick={goToNext}
                aria-label="Next Image"
              >
                <IconChevronRight size={isMobile ? 20 : 24} />
              </ActionIcon>
            </>
          )}

          {/* Botão Fullscreen */}
          <ActionIcon
            size={isMobile ? "md" : "lg"}
            radius="lg"
            variant="filled"
            color="dark"
            style={{
              position: "absolute",
              top: isMobile ? 8 : 16,
              right: isMobile ? 8 : 16,
              zIndex: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              opacity: 0.8,
            }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label="Toggle Fullscreen"
          >
            <IconMaximize size={isMobile ? 16 : 20} />
          </ActionIcon>

          {/* Contador de imagens */}
          <Box
            style={{
              position: "absolute",
              bottom: isMobile ? 8 : 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "6px 16px",
              borderRadius: 20,
            }}
          >
            <Text size="sm" c="white" fw={600}>
              {currentIndex + 1} / {images.length}
            </Text>
          </Box>
        </Box>
      </Paper>

      {/* Thumbnails */}
      {images.length > 1 && !isMobile && (
        <Group justify="center" gap="sm" mt="md" style={{ flexWrap: "wrap" }}>
          {images.map((image, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Paper
                shadow="xs"
                radius="lg"
                p={0}
                style={{
                  overflow: "hidden",
                  cursor: "pointer",
                  border:
                    currentIndex === index
                      ? "3px solid var(--primary)"
                      : "3px solid transparent",
                  transition: "border 0.2s ease",
                  opacity: currentIndex === index ? 1 : 0.6,
                }}
                onClick={() => goToSlide(index)}
              >
                <Box
                  style={{
                    position: "relative",
                    width: 80,
                    height: 60,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <ImgboxImage
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Group>
      )}

      {/* Indicadores de pontos para mobile */}
      {images.length > 1 && isMobile && (
        <Group justify="center" gap={6} mt="md">
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentIndex === index ? "var(--primary)" : "#d1d5db",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Group>
      )}
    </Box>
  );
};
