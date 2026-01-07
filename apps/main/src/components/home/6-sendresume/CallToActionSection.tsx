"use client";

import React from "react";
import { useMediaQuery } from "@mantine/hooks";
import SectionWithHeader from "@/components/home/SectionWithHeader";
import homeContent from "@/../public/json/home.json";

export default function CallToActionSection() {
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <SectionWithHeader
      title={homeContent.callToAction.title}
      subtitle={homeContent.callToAction.subtitle}
      button={homeContent.callToAction.button}
      isMobile={isMobile}
      paperProps={{
        py: isMobile ? 128 : 60,
        px: isMobile ? 16 : 32,
        shadow: "sm",
        radius: 0,
        withBorder: false,
      }}
    />
  );
}
