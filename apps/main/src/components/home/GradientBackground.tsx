"use client";

import React from "react";
import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type GradientBackgroundProps = {
  children?: React.ReactNode; // Optional content rendered inside the background
};

export default function GradientBackground({
  children,
}: GradientBackgroundProps) {
  // Mantine md breakpoint (~62em)
  const isMobile = useMediaQuery("(max-width: 62em)", false, {
    getInitialValueInEffect: true,
  });

  // Smaller overlap + fade on mobile
  const overlap = isMobile ? 50 : 100;
  const fadeSize = isMobile ? 50 : 100;

  // Forces a negative marginTop to pull the section upward
  const negativePx = (v: number) => `-${v}px`;

  return (
    <Box
      component="section"
      style={{
        width: "100%",
        height: "100%",
        marginTop: negativePx(overlap),
        display: "flex",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "white",
        zIndex: 2,
        // Top fade to blend with previous section/image
        WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,1) ${fadeSize}px)`,
        maskImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,1) ${fadeSize}px)`,
      }}
    >
      <Box
        style={{
          marginTop: "8rem",
          width: "100%",
          paddingInline: isMobile ? "1rem" : "2.5rem",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
