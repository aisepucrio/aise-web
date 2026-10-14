"use client";

import React from "react";
import { Card, Text, Box, ActionIcon, MantineProvider } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@mantine/hooks";

export interface PersonCardProps {
  name: string;
  position: string;
  imageUrl: string;
  description?: string;
  onClick?: () => void;
  cardWidth?: number;
  roles?: string[];
}

const MotionCard = motion(Card as any);
const MotionBox = motion(Box as any);

// Animation variants for hover overlay
const overlayVariants = {
  rest: { opacity: 0, y: 8, transition: { duration: 0.15 } },
  hover: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

// Generate URL-friendly slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
};

export const PersonCard: React.FC<PersonCardProps> = ({
  name,
  position,
  imageUrl,
  onClick,
  cardWidth: propCardWidth,
  roles,
}) => {
  const isMobile = useMediaQuery("(max-width: 62em)");

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      const slug = generateSlug(name);
      window.location.href = `/team/${slug}`;
    }
  };

  // Use provided cardWidth or default based on screen size
  const cardWidth = propCardWidth ?? (isMobile ? 150 : 280);

  // Calculate dimensions based on card width (1:1 aspect ratio for image)
  const imageHeight = Math.floor(cardWidth);
  const cardHeight = imageHeight + (isMobile ? 80 : 100); // Add space for text content

  return (
    <MantineProvider>
      <MotionCard
        shadow={isMobile ? "xs" : "sm"}
        radius="xl"
        p={0}
        style={{
          overflow: "hidden",
          cursor: "pointer",
          background: "white",
          minHeight: cardHeight,
          width: cardWidth,
          margin: "0 auto",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={handleCardClick}
        initial="rest"
        animate="rest"
        whileHover="hover"
        role="button"
        aria-label={`Open ${name}'s profile`}
        title={`Open ${name}'s profile`}
      >
        {/* Image container */}
        <Box
          style={{
            position: "relative",
            height: imageHeight,
            width: "100%",
            overflow: "hidden",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Subtle gradient overlay at the bottom */}
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
            }}
          />

          {/* Hover overlay with call-to-action */}
          <MotionBox
            variants={overlayVariants}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))",
              backdropFilter: "blur(2px)",
              pointerEvents: "none", // Allow clicks to pass through to card
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.35)",
                background: "rgba(0,0,0,0.25)",
              }}
            >
              <Text
                c="white"
                fw={700}
                size={isMobile ? "xs" : "sm"}
                lh={1}
                style={{ letterSpacing: 0.2 }}
              >
                View Profile
              </Text>
              <ActionIcon
                variant="light"
                color="var(--primary)"
                radius="xl"
                size={isMobile ? "sm" : "md"}
                aria-hidden
                style={{ pointerEvents: "none" }}
              >
                <IconArrowRight size={16} />
              </ActionIcon>
            </Box>
          </MotionBox>
        </Box>

        {/* Person information */}
        <Box p={isMobile ? "md" : "lg"} ta="center">
          <Text
            fw={700}
            size={isMobile ? "sm" : "lg"}
            mb="xs"
            c="dark.7"
            lh={1.3}
          >
            {name}
          </Text>

          <Text
            size={isMobile ? "xs" : "sm"}
            c="dimmed"
            mb={roles && roles.length > 0 ? "xs" : "xs"}
            lh={1.4}
            fw={500}
          >
            {position}
          </Text>

          {/* Role tags */}
          {roles && roles.length > 0 && (
            <Box
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: isMobile ? 4 : 6,
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              {roles.map((role, idx) => (
                <Box
                  key={idx}
                  style={{
                    fontSize: isMobile ? "9px" : "10px",
                    fontWeight: 600,
                    padding: isMobile ? "3px 8px" : "4px 10px",
                    borderRadius: 12,
                    backgroundColor: "#52afe11f",
                    color: "var(--primary)",
                    letterSpacing: "0.3px",
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  {role}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </MotionCard>
    </MantineProvider>
  );
};

export default PersonCard;
