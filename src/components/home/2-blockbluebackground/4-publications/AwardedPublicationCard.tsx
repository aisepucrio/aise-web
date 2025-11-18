import React from "react";
import { Badge, Box, Group, Paper, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { IconExternalLink, IconQuote } from "@tabler/icons-react";
import type { Publication } from "./AwardedPublicationSection";
import componentTexts from "@/../public/json/components-content.json";

const MotionPaper = motion(Paper as any);

interface AwardedPublicationCardProps {
  publication: Publication;
  index: number;
}

const AwardedPublicationCard: React.FC<AwardedPublicationCardProps> = ({
  publication,
  index,
}) => {
  const isMobile = useMediaQuery("(max-width: 48em)");
  const awardedCardTexts = componentTexts.awardedPublicationCard;
  const viewLabel = awardedCardTexts.viewText;
  const citationCount = publication.citation_number ?? 0;
  const citationLabel =
    citationCount === 1
      ? awardedCardTexts.citationSingular
      : awardedCardTexts.citationPlural;

  const handleClick = () => {
    if (publication.link) {
      window.open(publication.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <MotionPaper
      shadow="sm"
      radius="lg"
      padding={isMobile ? "md" : "lg"}
      style={{
        cursor: publication.link ? "pointer" : "default",
        borderColor: "#e9ecef",
        backgroundColor: "#ffffff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onClick={handleClick}
      role={publication.link ? "link" : undefined}
      tabIndex={publication.link ? 0 : -1}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={
        publication.link
          ? {
              transform: "translateY(-3px)",
              boxShadow: "0 10px 24px rgba(0, 0, 0, 0.12)",
            }
          : undefined
      }
    >
      <Stack gap={6} style={{ flex: 1 }} p="md">
        <Group align="flex-start" gap="xs" wrap="nowrap">
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text
              size="xs"
              fw={700}
              tt="uppercase"
              c="var(--primary)"
              style={{
                letterSpacing: 0.8,
                lineHeight: 1.2,
                opacity: publication.awards ? 1 : 0.6,
              }}
            >
              {publication.awards}
            </Text>
          </Box>

          <Badge
            size="sm"
            variant="light"
            color="gray"
            style={{ textTransform: "none" }}
          >
            {publication.year}
          </Badge>
        </Group>

        <Text
          size={isMobile ? "xs" : "sm"}
          fw={500}
          c="dimmed"
          style={{ lineHeight: 1.3 }}
        >
          {publication.title}
        </Text>

        <Group justify="space-between" mt={isMobile ? 8 : 12} gap="sm">
          <Group gap={6} align="center">
            <IconQuote size={18} color="var(--primary)" stroke={2} />
            <Text size="xs" fw={600} c="var(--primary)">
              {citationCount} {citationLabel}
            </Text>
          </Group>

          <Group gap={6} align="center" style={{ color: "var(--primary)" }}>
            <Text size="xs" fw={600}>
              {viewLabel}
            </Text>
            <IconExternalLink size={16} stroke={2} />
          </Group>
        </Group>
      </Stack>
    </MotionPaper>
  );
};

export default AwardedPublicationCard;


