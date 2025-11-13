"use client";

import React from "react";
import { Paper, Badge, Stack } from "@mantine/core";
import { motion } from "framer-motion";
import { TeamMemberListItem } from "./TeamMemberListItem";

type TeamMember = {
  name: string;
  position: string;
  imageUrl: string;
  description: string;
};

interface TeamCategoryColumnProps {
  position: string;
  members: TeamMember[];
  index: number;
  generateSlug: (name: string) => string;
}

export const TeamCategoryColumn: React.FC<TeamCategoryColumnProps> = ({
  position,
  members,
  index,
  generateSlug,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Paper
        shadow="none"
        p="md"
        radius={0}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          border: "none",
          borderLeft: "6px solid var(--primary)",
          paddingLeft: 16,
        }}
      >
        {/* Cabeçalho da categoria */}
        <Badge
          size="md"
          variant="filled"
          mb="md"
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            padding: "10px 16px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            width: "fit-content",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          {position}
        </Badge>

        {/* Lista vertical de membros */}
        <Stack gap="xs" style={{ flex: 1 }}>
          {members.map((member, idx) => (
            <TeamMemberListItem
              key={member.name}
              member={member}
              index={idx}
              generateSlug={generateSlug}
            />
          ))}
        </Stack>
      </Paper>
    </motion.div>
  );
};
