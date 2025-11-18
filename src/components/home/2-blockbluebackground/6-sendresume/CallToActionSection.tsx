"use client";

import React, { useRef } from "react";
import { Paper, Container, Title, Text, Center, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion, useInView } from "framer-motion";
import CTAButton from "../../../CTAButton";
import homeContent from "@/../public/json/home-content.json";

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
      {/* wrapper com “dotted background” sutil */}
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

        {/* card branco simples, com borda suave e sombra leve (sem glassmorphism) */}
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

          <Container size="xl" style={{ padding: 0, textAlign: "center" }}>
            {/* tipografia mais próxima do restante (título forte, sem efeitos) */}
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

            {/* botão sólido e direto, com micro-interação e ícone */}
            <Center mt={24}>
              <motion.div
                whileHover={buttonMotion.whileHover}
                whileTap={buttonMotion.whileTap}
                transition={buttonMotion.transition}
              >
          
                <CTAButton
                  href={homeContent.callToAction.button.href}
                  text={homeContent.callToAction.button.text}
                  isMobile={isMobile}
                  ariaLabel={homeContent.callToAction.button.text}
                />
              </motion.div>
            </Center>
          </Container>
        </Paper>
      </Box>
    </motion.div>
  );
}
