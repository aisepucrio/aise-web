"use client";

import React from "react";
import { Box, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import SectionWithHeader from "@/components/home/SectionWithHeader";
import homeContent from "@/../public/json/home-content.json";

export default function MissionHighlightsSection() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(
    `(max-width: ${theme.breakpoints.md})`,
    undefined,
    { getInitialValueInEffect: true }
  );

  const fontSize = isMobile ? 18 : 20;

  const paragraphs: string[] = [];
  const card = (homeContent as any).mission?.card;
  if (card) {
    if (card["description-paragraph1"])
      paragraphs.push(card["description-paragraph1"]);
    if (card["description-paragraph2"])
      paragraphs.push(card["description-paragraph2"]);
    if (card["description-paragraph3"])
      paragraphs.push(card["description-paragraph3"]);
  }

  return (
    <SectionWithHeader
      title={(homeContent as any).mission?.sectionTitle}
      isMobile={isMobile}
    >
      <Box>
        {paragraphs.map((p, idx) => (
          <Text
            key={idx}
            style={{
              textAlign: "center",
              fontSize,
              lineHeight: 1.8,
              marginBottom: idx < paragraphs.length - 1 ? 16 : 0,
            }}
          >
            {p}
          </Text>
        ))}
      </Box>
    </SectionWithHeader>
  );
}
