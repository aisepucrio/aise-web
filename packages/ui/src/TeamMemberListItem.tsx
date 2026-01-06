"use client";

import React, { useState } from "react";
import { Card, Group, Box, Text, Badge, MantineProvider } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  imageUrl: string;
  description: string;
  university?: string;
}

export interface TeamMemberListItemProps {
  member: TeamMember;
  index?: number;
  onClick?: () => void;
}

export const TeamMemberListItem: React.FC<TeamMemberListItemProps> = ({
  member,
  index = 0,
  onClick,
}) => {
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <MantineProvider>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Card
          padding={isMobile ? "sm" : "md"}
          radius="md"
          withBorder
          style={{
            cursor: "pointer",
            transition: "all 0.3s ease",
            borderColor: "#e9ecef",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
          onClick={onClick}
        >
          <Group gap="md" wrap="nowrap">
            {/* Member avatar */}
            <Box
              style={{
                flexShrink: 0,
                width: isMobile ? 60 : 90,
                height: isMobile ? 60 : 90,
                borderRadius: 8,
                overflow: "hidden",
                backgroundImage: `url(${member.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Member info */}
            <Box style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Text
                  fw={600}
                  size={isMobile ? "sm" : "md"}
                  style={{
                    color: "var(--primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {member.name}
                </Text>
                {member.university && (
                  <Badge
                    size={isMobile ? "xs" : "sm"}
                    color="gray"
                    variant="light"
                    style={{ backgroundColor: "#f1f3f5", color: "#495057" }}
                  >
                    {member.university}
                  </Badge>
                )}
              </div>
              <Text
                size={isMobile ? "xs" : "sm"}
                c="dimmed"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {member.description}
              </Text>
            </Box>
          </Group>
        </Card>
      </motion.div>
    </MantineProvider>
  );
};

export default TeamMemberListItem;
