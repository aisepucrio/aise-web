"use client";

import React from "react";
import DottedBlueBackground from "./DottedBlueBackground";
import MissionHighlightsSection from "./1-aboutus/MissionHighlightsSection";
import TeamSection from "./2-team/TeamSection";
import AwardedPublicationsHeaderSection from "./4-publications/AwardedPublicationSection";
import ToolsSection from "./5-tools/ToolsSection";
import CallToActionSection from "./6-sendresume/CallToActionSection";
import { useMediaQuery } from "@mantine/hooks";

export default function BlockTwoMain() {
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <DottedBlueBackground height="100%">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 32 : 64,
          marginBottom: 64,
          marginTop: 64,
        }}
      >
        <MissionHighlightsSection />
        <TeamSection />
        <AwardedPublicationsHeaderSection />
        <ToolsSection />
        <CallToActionSection />
      </div>
    </DottedBlueBackground>
  );
}
