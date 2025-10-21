"use client";

import React from "react";
import { Card, Title, Text, Group, Badge, Anchor, Stack } from "@mantine/core";
import { IconExternalLink, IconQuote } from "@tabler/icons-react";
import { motion } from "framer-motion";

interface PublicationCardProps {
  title: string;
  link: string;
  authors_list: string;
  publication_place: string;
  citation_number: number;
  year: string;
  index?: number;
}

const MotionCard = motion(Card as any);

export const PublicationCard: React.FC<PublicationCardProps> = ({
  title,
  link,
  authors_list,
  publication_place,
  citation_number,
  year,
  index = 0,
}) => {
  const handleClick = () => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
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
      className="paper-card"
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        transform: "translateY(-4px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      <Stack gap="md">
        {/* Título e ano */}
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
          <Badge
            size="lg"
            variant="light"
            color="var(--primary)"
            style={{ minWidth: "60px" }}
          >
            {year}
          </Badge>
        </Group>

        {/* Autores */}
        <Text
          size="sm"
          c="dimmed"
          style={{
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          {authors_list}
        </Text>

        {/* Local de Publicação */}
        <Text
          size="sm"
          style={{
            color: "#495057",
            lineHeight: 1.6,
          }}
        >
          {publication_place}
        </Text>

        {/* Footer: Citações e Link */}
        <Group justify="space-between" mt="md">
          <Group gap="xs">
            <IconQuote size={20} color="var(--primary)" />
            <Text size="sm" fw={600} style={{ color: "var(--primary)" }}>
              {citation_number}{" "}
              {citation_number === 1 ? "citation" : "citations"}
            </Text>
          </Group>

          <Anchor
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--primary)",
              textDecoration: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            View Publication
            <IconExternalLink size={18} />
          </Anchor>
        </Group>
      </Stack>
    </MotionCard>
  );
};

export default PublicationCard;
