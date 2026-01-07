"use client";

import React from "react";
import { Box } from "@mantine/core";
import { motion } from "framer-motion";
import { TeamCategoryHorizontal } from "./TeamCategoryHorizontal";
import { TeamMember } from "./membertype";

interface TeamCategoryPairProps {
  categories: {
    position: string;
    members: TeamMember[];
  }[];
  startIndex: number;
  generateSlug: (name: string) => string;
}

export const TeamCategoryPair: React.FC<TeamCategoryPairProps> = ({
  categories,
  startIndex,
  generateSlug,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: startIndex * 0.1, ease: "easeOut" }}
    >
      <Box
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 40,
        }}
      >
        {categories.map((category, idx) => (
          <Box
            key={category.position}
            style={{
              flex: "1 1 45%",
              minWidth: "300px",
              maxWidth: "600px",
            }}
          >
            <TeamCategoryHorizontal
              position={category.position}
              members={category.members}
              index={startIndex + idx}
              generateSlug={generateSlug}
            />
          </Box>
        ))}
      </Box>
    </motion.div>
  );
};
