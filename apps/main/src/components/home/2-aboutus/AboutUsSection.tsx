"use client";

import React, { useRef } from "react";
import {
  Box,
  Text,
  useMantineTheme,
  Container,
  Title,
  Divider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion, useInView } from "framer-motion";
import homeContent from "@/../public/json/home.json";

const MotionBox = motion(Box as any);

export default function AboutUsSection() {
  const theme = useMantineTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const isMobile = useMediaQuery("(max-width: 62em)");

  const paragraph = homeContent.mission.paragraph;

  return (
    <Box
      ref={ref}
      style={{
        width: "80%",
        margin: "auto",
        padding: isMobile ? "30px 0" : "60px 0",
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.2, 0.6, 0.3, 1] }}
      >
        <Title
          order={2}
          style={{
            fontSize: isMobile ? 42 : 56,
            fontWeight: 800,
            color: theme.colors.dark[9],
            marginBottom: isMobile ? 40 : 60,
            textAlign: "left",
            letterSpacing: "-0.02em",
          }}
        >
          {homeContent.mission.sectionTitle}
        </Title>

        <Box
          style={{
            maxWidth: isMobile ? "100%" : "100%",
          }}
        >
          <Text
            style={{
              textAlign: "left",
              fontSize: isMobile ? 20 : 20,
              lineHeight: 2.2,
              color: theme.colors.dark[7],
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            {paragraph}
          </Text>
        </Box>

        <Divider
          mt={64}
          color="#f8f9fa"
          size="xl"
          w="10%"
          m="auto"
          style={{ borderRadius: "1rem" }}
        />
      </MotionBox>
    </Box>
  );
}
