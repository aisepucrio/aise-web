"use client";

import React, { useRef } from "react";
import {
  Paper,
  Container,
  Title,
  Text,
  Button,
  Center,
  Box,
} from "@mantine/core";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import { motion, useInView } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";
import homeContent from "@/../public/json/home-content.json";

/* EDIT: micro-interactions consistentes com o resto do site */
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
/* END EDIT */

export default function CallToActionSection() {
  const isMobile = useMediaQuery("(max-width: 62em)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      initial={sectionMotion.initial}
      animate={isInView ? sectionMotion.animate : sectionMotion.initial}
      transition={sectionMotion.transition}
      style={{ width: "100%" }}
    >
      {/* EDIT: wrapper com “dotted background” sutil (mesma vibe do carrossel) */}
      <Box
        component="section"
        mb={80}
        style={{
          position: "relative",
          padding: isMobile ? 8 : 12,
          borderRadius: 24,
          backgroundColor: "#e7f2ff",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      >
        {/* END EDIT */}

        {/* EDIT: card branco simples, com borda suave e sombra leve (sem glassmorphism) */}
        <Paper
          py={isMobile ? 28 : 44}
          px={isMobile ? 12 : 20}
          radius={24}
          withBorder
          shadow="md"
          style={{
            borderColor: "#e9ecef",
            background: "#fff",
          }}
        >
          {/* END EDIT */}

          <Container size="xl" style={{ padding: 0, textAlign: "center" }}>
            {/* EDIT: tipografia mais próxima do restante (título forte, sem efeitos) */}
            <Title
              order={2}
              style={{
                fontSize: isMobile ? "1.8rem" : "2.6rem",
                lineHeight: 1.15,
                marginBottom: 10,
                fontWeight: 800,
                color: "#0a1228",
                letterSpacing: -0.5,
              }}
            >
              {homeContent.callToAction.title}
            </Title>

            <Text
              size={isMobile ? "sm" : "md"}
              w={isMobile ? "100%" : "70%"}
              mx="auto"
              lh={1.6}
              style={{ color: "rgba(10,18,40,0.75)" }}
            >
              {homeContent.callToAction.subtitle}
            </Text>
            {/* END EDIT */}

            {/* EDIT: botão sólido e direto, com micro-interação e ícone */}
            <Center mt={24}>
              <motion.div
                whileHover={buttonMotion.whileHover}
                whileTap={buttonMotion.whileTap}
                transition={buttonMotion.transition}
              >
                <Button
                  component={Link}
                  href={homeContent.callToAction.button.href}
                  size={isMobile ? "md" : "lg"}
                  radius="xl"
                  aria-label={homeContent.callToAction.button.text}
                  rightSection={<IconArrowRight size={18} stroke={2} />}
                  style={{
                    background: "var(--primary)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    fontWeight: 700,
                    letterSpacing: 0.2,
                    paddingInline: isMobile ? 18 : 24,
                  }}
                >
                  {homeContent.callToAction.button.text}
                </Button>
              </motion.div>
            </Center>
            {/* END EDIT */}
          </Container>
        </Paper>
      </Box>
    </motion.div>
  );
}
