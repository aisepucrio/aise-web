"use client";

import React, { useRef } from "react";
import { Paper, Box, Stack, Text, Center } from "@mantine/core";
import CTAButton from "@/components/CTAButton";
import Titulo from "@/components/Titulo";
import { motion, useInView } from "framer-motion";

const MotionPaper = motion(Paper as any);

type SectionWithHeaderProps = {
  title: string;
  subtitle?: string;
  button?: { text: string; href: string };
  isMobile?: boolean;
  children?: React.ReactNode;
  paperProps?: React.ComponentProps<typeof Paper>;
};

/* micro-interactions consistentes com o resto do site */
const sectionMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0.6, 0.3, 1] as const },
};
const buttonMotion = {
  whileHover: { y: -1, scale: 1.01 },
  whileTap: { scale: 0.99 },
  transition: { type: "spring" as const, stiffness: 280, damping: 20 },
} as const;

export default function SectionWithHeader({
  title,
  subtitle,
  button,
  isMobile = false,
  children,
  paperProps,
}: SectionWithHeaderProps) {
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
      <Paper
        component="section"
        py={isMobile ? 64 : 42}
        px={isMobile ? 8 : 12}
        shadow="sm"
        style={{
          width: "100%",
          borderRadius: 0,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
        {...paperProps}
      >
        <Box style={{ width: "100%" }}>
          <Stack gap="xs" align="center" mb={isMobile ? 20 : 40}>
            <Titulo
              verticalMarginDesktop={12}
              verticalMarginMobile={6}
              color="#000000ff"
            >
              {title}
            </Titulo>

            {subtitle && (
              <Text
                size={isMobile ? "md" : "lg"}
                c="dimmed"
                maw={1000}
                ta="center"
                lh={1.7}
              >
                {subtitle}
              </Text>
            )}
          </Stack>

          {/* main content */}
          <Box style={{ width: isMobile ? "100%" : "70%", margin: "auto" }}>
            {children}
          </Box>

          {/* CTA (centered) */}
          {button && (
            <Center mt={24}>
              <CTAButton
                href={button.href}
                text={button.text}
                isMobile={isMobile}
                ariaLabel={button.text}
              />
            </Center>
          )}
        </Box>
      </Paper>
    </MotionPaper>
  );
}
