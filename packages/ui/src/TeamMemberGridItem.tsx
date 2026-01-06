"use client";

import React, { useState } from "react";
import { Card, Stack, Box, Text, Badge, MantineProvider } from "@mantine/core";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  imageUrl: string;
  description: string;
  university?: string;
}

export interface TeamMemberGridItemProps {
  member: TeamMember;
  index?: number;
  onClick?: () => void;
}

export const TeamMemberGridItem: React.FC<TeamMemberGridItemProps> = ({
  member,
  index = 0,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MantineProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card
          padding="md"
          radius="md"
          withBorder
          style={{
            cursor: "pointer",
            transition: "all 0.3s ease",
            borderColor: isHovered ? "var(--primary)" : "#e9ecef",
            backgroundColor: "#ffffff",
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
            boxShadow: isHovered
              ? "0 4px 12px rgba(0, 123, 255, 0.2)"
              : "0 1px 3px rgba(0, 0, 0, 0.05)",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onClick}
        >
          <Stack gap="sm" align="center">
            {/* Member avatar */}
            <Box
              style={{
                width: 140,
                height: 150,
                borderRadius: 8,
                overflow: "hidden",
                backgroundImage: `url(${member.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Member info */}
            <Box style={{ textAlign: "center", width: "100%" }}>
              <Text
                fw={600}
                size="lg"
                style={{
                  color: "var(--primary)",
                }}
              >
                {member.name}
              </Text>

              {member.university && (
                <Badge
                  size="sm"
                  color="gray"
                  variant="light"
                  style={{
                    marginTop: 6,
                    backgroundColor: "#f1f3f5",
                    color: "#495057",
                    display: "inline-block",
                  }}
                >
                  {member.university}
                </Badge>
              )}

              <Text
                size="sm"
                c="dimmed"
                lineClamp={3}
                style={{
                  marginTop: 4,
                }}
              >
                {member.description}
              </Text>
            </Box>
          </Stack>

          {/* Hover overlay with action hint */}
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              padding: "8px",
              textAlign: "center",
              transform: isHovered ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.3s ease",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            View More
          </Box>
        </Card>
      </motion.div>
    </MantineProvider>
  );
};

export default TeamMemberGridItem;
