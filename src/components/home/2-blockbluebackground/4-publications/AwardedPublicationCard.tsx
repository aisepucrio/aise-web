import React from "react";
import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import type { Publication } from "./AwardedPublicationSection";

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

  const handleClick = () => {
    if (publication.link) {
      window.open(publication.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <MotionPaper
      shadow="sm"
      radius="md"
      withBorder
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
      <Stack gap={isMobile ? 8 : 10} style={{ flex: 1 }}>
        <Text
          fw={600}
          size={isMobile ? "sm" : "md"}
          style={{ lineHeight: 1.4, color: "#212529" }}
        >
          {publication.title}
        </Text>
      </Stack>

      <Group
        mt={isMobile ? 10 : 14}
        justify="space-between"
        gap="xs"
        wrap="nowrap"
      >
        <Badge
          size="sm"
          variant="light"
          color="gray"
          style={{ textTransform: "none" }}
        >
          {publication.year}
        </Badge>

        {publication.awards && (
          <Badge
            size="sm"
            variant="light"
            color="var(--primary)"
            style={{
              maxWidth: "70%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textTransform: "none",
            }}
          >
            {publication.awards}
          </Badge>
        )}
      </Group>
    </MotionPaper>
  );
};

export default AwardedPublicationCard;


