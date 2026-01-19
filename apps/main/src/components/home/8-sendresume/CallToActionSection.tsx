"use client";

import { useRef } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Paper, Box, Stack, Text, Button } from "@mantine/core";
import { motion, useInView } from "framer-motion";
import { IconSend } from "@tabler/icons-react";
import Link from "next/link";
import homeContent from "@/../public/json/home.json";

const MotionPaper = motion(Paper as any);
const MotionButton = motion(Button as any);

const sectionMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0.6, 0.3, 1] as const },
};

const buttonMotion = {
  whileHover: { scale: 1.05, y: -2 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 300, damping: 20 },
} as const;

export default function CallToActionSection() {
  const isMobile = useMediaQuery("(max-width: 62em)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <MotionPaper
      ref={ref}
      initial={sectionMotion.initial}
      animate={isInView ? sectionMotion.animate : sectionMotion.initial}
      transition={sectionMotion.transition}
      style={{
        width: "100%",
        position: "relative",
        padding: isMobile ? 8 : 16,
        borderRadius: 0,
        background: "rgba(255, 255, 255, 0.80)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        style={{
          width: "95%",
          margin: "auto",
          padding: isMobile ? "16px 16px" : "60px 32px",
        }}
      >
        <Stack
          align="center"
          justify="center"
          gap={isMobile ? "xl" : "xxl"}
          style={{ textAlign: "center" }}
        >
          <Stack gap="md" align="center">
            <Text
              component="h2"
              style={{
                color: "#000000ff",
                fontWeight: 800,
                fontSize: isMobile ? "48px" : "64px",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {homeContent.callToAction.title}
            </Text>

            <Text
              size={isMobile ? "lg" : "xl"}
              maw={800}
              ta="center"
              lh={1.7}
              style={{
                color: "rgba(0, 0, 0, 0.7)",
                fontSize: isMobile ? "16px" : "20px",
              }}
            >
              {homeContent.callToAction.subtitle}
            </Text>
          </Stack>

          <MotionButton
            component={Link}
            href={homeContent.callToAction.button.href}
            size={isMobile ? "xl" : "xxl"}
            radius="xl"
            leftSection={<IconSend size={24} stroke={2} />}
            aria-label={homeContent.callToAction.button.text}
            whileHover={buttonMotion.whileHover}
            whileTap={buttonMotion.whileTap}
            transition={buttonMotion.transition}
            style={{
              background: "var(--primary)",
              fontSize: isMobile ? "18px" : "22px",
              fontWeight: 700,
              letterSpacing: 0.3,
              paddingInline: isMobile ? 32 : 48,
              paddingBlock: isMobile ? 16 : 20,
              height: "auto",
              minHeight: isMobile ? 56 : 64,
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
              border: "none",
            }}
          >
            {homeContent.callToAction.button.text}
          </MotionButton>
        </Stack>
      </Box>
    </MotionPaper>
  );
}
