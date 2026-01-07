"use client";

import Hero from "@/components/home/1-hero/Hero";
import DottedBlueBackground from "@/components/home/DottedBlueBackground";
import MissionHighlightsSection from "@/components/home/2-aboutus/MissionHighlightsSection";
import TeamSection from "@/components/home/3-team/TeamSection";
import AwardedPublicationsHeaderSection from "@/components/home/4-publications/AwardedPublicationSection";
import ToolsSection from "@/components/home/5-tools/ToolsSection";
import CallToActionSection from "@/components/home/6-sendresume/CallToActionSection";
import { useMediaQuery } from "@mantine/hooks";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 62em)");
  return (
    <>
      <Hero />
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
    </>
  );
}
