"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Overlay, Container, Title, Text, rem } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import homeContent from "@/../public/json/home.json";

const carouselDotStyle: React.CSSProperties = {
  width: 9,
  height: 9,
  padding: 0,
  border: "1px solid #fff",
  borderRadius: "50%",
  background: "#fff",
  cursor: "pointer",
  transition: "opacity 0.2s ease, transform 0.2s ease",
};

const heroImages = [
  { src: "/images/IMG_3191.jpeg", alt: "" },
  { src: "/images/allimage.jpeg", alt: "" },
];

/* Hero section with background image + layered overlays + centered text block */
export default function Hero() {
  const isMobile = useMediaQuery("(max-width: 62em)");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroImages.length);
    }, 10000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      id="hero-root"
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
      <div
        aria-label="Hero image carousel"
        aria-roledescription="carousel"
        style={{ position: "absolute", inset: 0 }}
      >
        {heroImages.map((image, index) => (
          <motion.div
            key={image.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${heroImages.length}`}
            aria-hidden={activeSlide !== index}
            initial={false}
            animate={{ opacity: activeSlide === index ? 1 : 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        ))}
      </div>

      <div
        role="tablist"
        aria-label="Choose hero image"
        style={{
          position: "absolute",
          zIndex: 3,
          bottom: isMobile ? 20 : 28,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {heroImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            role="tab"
            aria-selected={activeSlide === index}
            aria-label={`Show hero image ${index + 1}`}
            onClick={() => setActiveSlide(index)}
            style={{
              ...carouselDotStyle,
              opacity: activeSlide === index ? 1 : 0.55,
              transform: activeSlide === index ? "scale(1.15)" : "scale(1)",
            }}
          />
        ))}
      </div>

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
                style={{ width: "100%", marginTop: isMobile ? 0 : 200 }}
              >
                <Title
                  order={1}
                  style={{
                    color: "#fff",
                    fontWeight: 850,
                    letterSpacing: "-0.02em",
                    textWrap: "balance",
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
    </div>
  );
}
