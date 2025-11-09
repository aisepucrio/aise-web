"use client";

import React from "react";
import { Paper, Box, Stack, Text, Center } from "@mantine/core";
import CTAButton from "@/components/CTAButton";
import Titulo from "@/components/Titulo";

type SectionWithHeaderProps = {
  title: string;
  subtitle?: string;
  button?: { text: string; href: string };
  isMobile?: boolean;
  children?: React.ReactNode;
  paperProps?: React.ComponentProps<typeof Paper>;
};

export default function SectionWithHeader({
  title,
  subtitle,
  button,
  isMobile = false,
  children,
  paperProps,
}: SectionWithHeaderProps) {
  return (
    <Paper
      component="section"
      py={isMobile ? 24 : 42}
      px={isMobile ? 16 : 24}
      shadow="md"
      style={{
        width: "100%",
        borderRadius: 24,
        background: "rgba(255, 255, 255, 1)",
        backdropFilter: "blur(10px)",
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
            <Text size={isMobile ? "md" : "lg"} c="dimmed" maw={1000} ta="center" lh={1.7}>
              {subtitle}
            </Text>
          )}
        </Stack>

        {/* main content */}
        <Box>{children}</Box>

        {/* CTA (centered) */}
        {button && (
          <Center mt={24}>
            <CTAButton href={button.href} text={button.text} isMobile={isMobile} ariaLabel={button.text} />
          </Center>
        )}
      </Box>
    </Paper>
  );
}
