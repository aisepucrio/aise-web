import React from "react";
import DottedBlueBackground from "./DottedBlueBackground";
import MissionHighlightsSection from "./block-2.1/MissionHighlightsSection";
import Block22 from "./block-2.2";
import Block23 from "./block-2.3";
import TeamSection from "./block-2.4/TeamSection";

type Props = {
  height?: string | number;
};

export default function BlockTwoMain({ height = "100vh" }: Props) {
  return (
    <DottedBlueBackground height={height}>
      <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
        <MissionHighlightsSection />
        <TeamSection />
      </div>
    </DottedBlueBackground>
  );
}
