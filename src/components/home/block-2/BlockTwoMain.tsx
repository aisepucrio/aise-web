import React from "react";
import DottedBlueBackground from "./DottedBlueBackground";
import MissionHighlightsSection from "./block-2.1/MissionHighlightsSection";
import TeamSection from "./block-2.2/TeamSection";
import ToolsSection from "./block-2.4/ToolsSection";
import CallToActionSection from "./block-2.5/CallToActionSection";

type Props = {
  height?: string | number;
};

export default function BlockTwoMain({ height = "100vh" }: Props) {
  return (
    <DottedBlueBackground height={height}>
      <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
        <MissionHighlightsSection />
        <TeamSection />
        <ToolsSection />
        <CallToActionSection />
      </div>
    </DottedBlueBackground>
  );
}
