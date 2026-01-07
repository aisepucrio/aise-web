"use client";

import React from "react";
import {
  Card,
  Title,
  Text,
  Group,
  Badge,
  Stack,
  Tooltip,
  MantineProvider,
} from "@mantine/core";
import { IconExternalLink, IconQuote, IconTrophy } from "@tabler/icons-react";
import { motion } from "framer-motion";

export interface PublicationCardProps {
  title: string;
  link: string;
  authors_list: string;
  publication_place: string;
  citation_number: number;
  year: string | number;
  awards?: string;
  viewLabel?: string;
  index?: number;
}

const MotionCard = motion(Card as any);

// Publication card with citation count, awards badge, and external link
export const PublicationCard: React.FC<PublicationCardProps> = ({
  title,
  link,
  authors_list,
  publication_place,
  citation_number,
  year,
  awards,
  index = 0,
  viewLabel = "View",
}) => {
  const handleClick = () => {
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <MantineProvider>
      <MotionCard
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        style={{
          transition: "all 0.3s ease",
          cursor: "pointer",
          borderColor: "#e9ecef",
        }}
        onClick={handleClick}
        role="link"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, delay: index * 0.1, ease: "easeOut" }}
        whileHover={{
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Title
              order={3}
              style={{
                flex: 1,
                fontSize: "1.3rem",
                fontWeight: 600,
                lineHeight: 1.4,
                color: "#2c3e50",
              }}
            >
              {title}
            </Title>

            <Group align="center" gap={8} style={{ flexShrink: 0 }}>
              {awards && (
                <Tooltip label={awards} multiline position="bottom">
                  <span
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <IconTrophy size={28} color="#f1c40f" />
                  </span>
                </Tooltip>
              )}

              <Badge
                size="lg"
                variant="light"
                color="var(--primary)"
                style={{ minWidth: "60px" }}
              >
                {year}
              </Badge>
            </Group>
          </Group>

          <Text
            size="sm"
            c="dimmed"
            style={{ fontStyle: "italic", lineHeight: 1.6 }}
          >
            {authors_list}
          </Text>

          <Text size="sm" style={{ color: "#495057", lineHeight: 1.6 }}>
            {publication_place}
          </Text>

          <Group justify="space-between" mt="md">
            <Group gap="xs">
              <IconQuote size={20} color="var(--primary)" />
              <Text size="sm" fw={600} style={{ color: "var(--primary)" }}>
                {citation_number}{" "}
                {citation_number === 1 ? "citation" : "citations"}
              </Text>
            </Group>

            <Group
              gap="6px"
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--primary)",
              }}
            >
              <span>{viewLabel}</span>
              <IconExternalLink size={18} />
            </Group>
          </Group>
        </Stack>
      </MotionCard>
    </MantineProvider>
  );
};

export default PublicationCard;
