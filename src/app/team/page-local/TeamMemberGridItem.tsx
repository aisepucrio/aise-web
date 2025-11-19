"use client";

import React, { useState } from "react";
import { Card, Stack, Box, Text, Badge } from "@mantine/core";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TeamMember } from "./membertype";

interface TeamMemberGridItemProps {
  member: TeamMember;
  index: number;
  generateSlug: (name: string) => string;
  viewMoreText: string;
}

export const TeamMemberGridItem: React.FC<TeamMemberGridItemProps> = ({
  member,
  index,
  generateSlug,
  viewMoreText,
}) => {
  const router = useRouter();
  const slug = generateSlug(member.name);
  const [isHovered, setIsHovered] = useState(false);

  return (
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
        onClick={() => router.push(`/team/${slug}`)}
      >
        <Stack gap="sm" align="center">
          <Box
            style={{
              width: 140,
              height: 150,
              borderRadius: 8,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={member.imageUrl}
              alt={member.name}
              width={140}
              height={150}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

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

        {/* Indicador "Ver mais" no hover */}
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
          {viewMoreText}
        </Box>
      </Card>
    </motion.div>
  );
};
