"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BackgroundImage,
  Overlay,
  Container,
  Title,
  Text,
  rem,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import homeContent from "@/../public/json/home.json";

/* Hero section with background image + layered overlays + centered text block */
export default function Hero() {
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <BackgroundImage
      id="hero-root"
      src={homeContent.hero.imgsrc}
      aria-label="Main section with background image"
      style={{
        width: "100%",
        height: isMobile ? "80vh" : "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: isMobile ? 24 : 0,
        overflow: "hidden",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Overlay
        zIndex={0}
        aria-hidden
        style={{
          background: "rgba(0,0,0,0.25)",
        }}
      />

      <Overlay
        zIndex={1}
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.55) 0%, rgba(10,10,12,0.22) 55%, rgba(10,10,12,0.55) 100%)",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(900px 520px at 28% 42%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.00) 60%)",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: isMobile ? 260 : 420,
            height: isMobile ? 260 : 420,
            borderRadius: 9999,
            left: isMobile ? "-90px" : "-120px",
            top: isMobile ? "-90px" : "-140px",
            background:
              "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.35), rgba(99,102,241,0.00) 70%)",
            filter: "blur(6px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          style={{
            position: "absolute",
            width: isMobile ? 240 : 360,
            height: isMobile ? 240 : 360,
            borderRadius: 9999,
            right: isMobile ? "-120px" : "-140px",
            bottom: isMobile ? "-120px" : "-160px",
            background:
              "radial-gradient(circle at 65% 40%, rgba(34,211,238,0.26), rgba(34,211,238,0.00) 68%)",
            filter: "blur(8px)",
          }}
        />
      </div>

      <Container
        fluid
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingLeft: isMobile ? 16 : undefined,
          paddingRight: isMobile ? 16 : undefined,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.12, when: "beforeChildren" }}
        >
          <div
            style={{
              width: isMobile ? "95%" : "75%",
              textAlign: "center",
              margin: "0 auto",
              padding: isMobile ? "18px 0" : "26px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                color: "#fff",
                alignItems: "center",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ width: "100%" }}
              >
                <Title
                  order={1}
                  style={{
                    color: "#fff",
                    fontWeight: 850,
                    letterSpacing: "-0.02em",
                    textWrap: "balance" as any,
                    fontSize: isMobile ? rem(26) : "clamp(1.8rem, 4vw, 3rem)",
                    lineHeight: 1.05,
                    whiteSpace: "pre-line",
                  }}
                >
                  {homeContent.hero.title}
                </Title>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ width: "100%" }}
              >
                <Text
                  size={isMobile ? "md" : "xl"}
                  style={{
                    opacity: 0.92,
                    lineHeight: 1.55,
                    color: "#fff",
                    maxWidth: "100%",
                    margin: "0 auto",
                  }}
                >
                  {homeContent.hero.subtitle}
                </Text>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </BackgroundImage>
  );
}
