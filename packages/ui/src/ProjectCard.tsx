"use client";

import React from "react";
import { Card, Text, Box, Title, Stack, MantineProvider } from "@mantine/core";
import { motion } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";

export interface ProjectCardProps {
  name: string;
  imageUrl: string;
  description: string;
  index?: number;
  texts?: {
    imageAltPrefix?: string;
  };
}

const MotionCard = motion(Card as any);

const defaultTexts = {
  imageAltPrefix: "Project image",
};

// Project card with image, title, and description for research projects
export const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  imageUrl,
  description,
  index = 0,
  texts = defaultTexts,
}) => {
  const isMobile = useMediaQuery("(max-width: 62em)");
  const finalTexts = { ...defaultTexts, ...texts };

  return (
    <MantineProvider>
      <MotionCard
        shadow="sm"
        padding={0}
        radius="xl"
        withBorder
        style={{
          overflow: "hidden",
          background: "white",
          borderColor: "#e9ecef",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      >
        {/* Project image with gradient overlay */}
        <Box
          style={{
            position: "relative",
            height: isMobile ? 180 : 220,
            width: "100%",
            overflow: "hidden",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
            }}
          />
        </Box>

        {/* Project info */}
        <Stack gap="md" p={isMobile ? "md" : "lg"} style={{ flex: 1 }}>
          <Title
            order={4}
            size={isMobile ? "1rem" : "1.2rem"}
            style={{
              color: "var(--primary)",
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            {name}
          </Title>

          <Text
            size={isMobile ? "sm" : "md"}
            c="dimmed"
            style={{ lineHeight: 1.6 }}
          >
            {description}
          </Text>
        </Stack>
      </MotionCard>
    </MantineProvider>
  );
};

export default ProjectCard;
