import React from "react";
import DottedBlueBackground from "./DottedBlueBackground";
import MissionHighlightsSection from "./block-2.1/MissionHighlightsSection";
import Block22 from "./block-2.2";
import Block23 from "./block-2.3";
import Block24 from "./block-2.4";

type Props = {
  height?: string | number;
};

export default function BlockTwoMain({ height = "100vh" }: Props) {
  return (
    <DottedBlueBackground height={height}>
      <MissionHighlightsSection />
    </DottedBlueBackground>
  );
}
