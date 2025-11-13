"use client";

import React, { useState } from "react";
import { Card, Group, Box, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

type TeamMember = {
  name: string;
  position: string;
  imageUrl: string;
  description: string;
};

interface TeamMemberListItemProps {
  member: TeamMember;
  index: number;
  generateSlug: (name: string) => string;
}

export const TeamMemberListItem: React.FC<TeamMemberListItemProps> = ({
  member,
  index,
  generateSlug,
}) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 62em)");
  const slug = generateSlug(member.name);
  const [isHovered, setIsHovered] = useState(false);

  return (
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
          borderColor: isHovered ? "var(--primary)" : "#e9ecef",
          backgroundColor: "#ffffff",
          transform: isHovered ? "translateX(4px)" : "translateX(0)",
          boxShadow: isHovered
            ? "0 2px 8px rgba(0, 123, 255, 0.15)"
            : "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push(`/team/${slug}`)}
      >
        <Group gap="md" wrap="nowrap">
          <Box
            style={{
              flexShrink: 0,
              width: isMobile ? 60 : 90,
              height: isMobile ? 60 : 90,
              borderRadius: 8,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={member.imageUrl}
              alt={member.name}
              width={isMobile ? 60 : 90}
              height={isMobile ? 60 : 90}
              style={{ objectFit: "cover" }}
            />
          </Box>
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text
              fw={600}
              size={isMobile ? "sm" : "md"}
              style={{
                color: "var(--primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {member.name}
            </Text>
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
  );
};
