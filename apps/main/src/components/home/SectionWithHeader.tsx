"use client";

import React, { useRef } from "react";
import { Paper, Box, Stack, Text, Divider } from "@mantine/core";
import { motion, useInView } from "framer-motion";
import MinimalButton from "@/components/MinimalButton";
import CTAButton from "@/components/CTAButton";
import { useMediaQuery } from "@mantine/hooks";

const MotionPaper = motion(Paper as any);

type SectionWithHeaderProps = {
  title: string;
  subtitle?: string;
  button?: { text: string; href: string };
  isMobile?: boolean;
  children?: React.ReactNode;
  paperProps?: React.ComponentProps<typeof Paper>;
  hasDivider?: boolean;
};

/* micro-interactions consistentes com o resto do site */
const sectionMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0.6, 0.3, 1] as const },
};

export default function SectionWithHeader({
  title,
  subtitle,
  button,
  children,
}: SectionWithHeaderProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <>
      <Box style={{ width: "85%", margin: "auto" }}>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: isMobile ? 20 : 40,
          }}
        >
          <Stack
            gap="xs"
            align={isMobile ? "center" : "flex-start"}
            style={{ flex: 1 }}
          >
            <Text
              component="h2"
              style={{
                color: "#000000ff",
                fontWeight: 800,
                fontSize: `${isMobile ? 38 : 56}px`,
                textAlign: "left",
                margin: `${isMobile ? 6 : 12}px 0`,
                lineHeight: 1,
              }}
            >
              {title}
            </Text>

            {subtitle && (
              <Text
                size={isMobile ? "lg" : "xl"}
                maw={1000}
                ta={isMobile ? "center" : "left"}
                lh={1.7}
                style={{ width: isMobile ? "100%" : "80%" }}
              >
                {subtitle}
              </Text>
            )}
          </Stack>

          {button && !isMobile && (
            <MinimalButton
              href={button.href}
              text={button.text}
              ariaLabel={button.text}
            />
          )}
        </Box>

        {/* main content */}
        <Box style={{ width: isMobile ? "100%" : "95%", margin: "auto" }}>
          {children}
        </Box>

        {/* CTA Button no mobile */}
        {button && isMobile && (
          <Box mt={32} style={{ display: "flex", justifyContent: "center" }}>
            <CTAButton
              href={button.href}
              text={button.text}
              ariaLabel={button.text}
              isMobile={isMobile}
            />
          </Box>
        )}
      </Box>

      <Divider
        mt={64}
        mb={32}
        color="#f8f9fa"
        size="xl"
        w="10%"
        m="auto"
        style={{ borderRadius: "1rem" }}
      />
    </>
  );
}
