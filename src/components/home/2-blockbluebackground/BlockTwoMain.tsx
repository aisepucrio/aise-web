import React from "react";
import DottedBlueBackground from "./DottedBlueBackground";
import MissionHighlightsSection from "./1-aboutus/MissionHighlightsSection";
import TeamSection from "./2-team/TeamSection";
import AwardedPublicationsHeaderSection from "./4-publications/AwardedPublicationHeaderSection";
import ToolsSection from "./5-tools/ToolsSection";
import CallToActionSection from "./6-sendresume/CallToActionSection";



export default function BlockTwoMain() {
  return (
    <DottedBlueBackground height="100vh">
      <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
        <MissionHighlightsSection />
        <TeamSection />
        <AwardedPublicationsHeaderSection />
        <ToolsSection />
        <CallToActionSection />
      </div>
    </DottedBlueBackground>
  );
}
