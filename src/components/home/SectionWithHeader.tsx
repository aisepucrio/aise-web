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
  const horizontalMask =
    "linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.3) 48px, rgba(0,0,0,1) 144px, rgba(0,0,0,1) calc(100% - 144px), rgba(0,0,0,0.3) calc(100% - 48px), rgba(0,0,0,0) 100%)";
  const verticalMask =
    "linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.08) 16px, rgba(0,0,0,1) 96px, rgba(0,0,0,1) calc(100% - 96px), rgba(0,0,0,0.08) calc(100% - 16px), rgba(0,0,0,0) 100%)";
  const maskGradient = isMobile ? verticalMask : horizontalMask;
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
        WebkitMaskImage: maskGradient,
        maskImage: maskGradient,
      }}
    >
      <Paper
        component="section"
        py={isMobile ? 128 : 48}
        px={isMobile ? 16 : 24}
        shadow="sm"
        style={{
          width: "100%",
          borderRadius: 0,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          WebkitMaskImage: maskGradient,
          maskImage: maskGradient,
        }}
        {...paperProps}
      >
        <Box style={{ width: "100%" }}>
          <Stack gap="md" align="center" mb={isMobile ? 20 : 40}>
            <Titulo
              verticalMarginDesktop={24}
              verticalMarginMobile={12}
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
