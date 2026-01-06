"use client";

import React from "react";
import { Paper, Badge, Stack } from "@mantine/core";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { TeamMemberListItem } from "@shared/ui";
import { TeamMember } from "./membertype";

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
  const router = useRouter();

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
              onClick={() => router.push(`/team/${generateSlug(member.name)}`)}
            />
          ))}
        </Stack>
      </Paper>
    </motion.div>
  );
};
