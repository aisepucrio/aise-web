"use client";

import React from "react";
import { Box, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { TeamMemberGridItem } from "./TeamMemberGridItem";
import { TeamMember } from "./membertype";

interface TeamCategoryHorizontalProps {
  position: string;
  members: TeamMember[];
  index: number;
  generateSlug: (name: string) => string;
  viewMoreText: string;
}

export const TeamCategoryHorizontal: React.FC<TeamCategoryHorizontalProps> = ({
  position,
  members,
  index,
  generateSlug,
  viewMoreText,
}) => {
  // Centraliza quando há menos de 3 membros
  const shouldCenter = members.length < 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Box
        style={{
          marginBottom: 40,
        }}
      >
        {/* Título centralizado */}
        <Text
          size="xl"
          fw={700}
          ta="center"
          mb="xs"
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "var(--primary)",
          }}
        >
          {position}
        </Text>

        {/* Barra azul abaixo do título */}
        <Box
          style={{
            width: "100%",
            height: 6,
            backgroundColor: "var(--primary)",
            marginBottom: 24,
          }}
        />

        {/* Grid de membros */}
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: shouldCenter
              ? `repeat(${members.length}, 1fr)`
              : "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
            justifyContent: shouldCenter ? "center" : "start",
            maxWidth: shouldCenter ? `${members.length * 350}px` : "100%",
            margin: shouldCenter ? "0 auto" : "0",
          }}
        >
          {members.map((member, idx) => (
            <TeamMemberGridItem
              key={member.name}
              member={member}
              index={idx}
              generateSlug={generateSlug}
              viewMoreText={viewMoreText}
            />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};
