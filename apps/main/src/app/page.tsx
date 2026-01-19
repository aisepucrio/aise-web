"use client";

import Hero from "@/components/home/1-hero/Hero";
import AboutUsSection from "@/components/home/2-aboutus/AboutUsSection";
import BadgesMarqueeSection from "@/components/home/3-marquee/BadgesMarqueeSection";
import TeamSection from "@/components/home/4-team/TeamSection";
import AwardedPublicationsHeaderSection from "@/components/home/5-publications/AwardedPublicationSection";
import ResearchesSection from "@/components/home/6-researches/ResearchesSection";
import CallToActionSection from "@/components/home/8-sendresume/CallToActionSection";
import { useMediaQuery } from "@mantine/hooks";
import GradientBackground from "@/components/home/GradientBackground";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 62em)");
  return (
    <>
      <Hero />
      <GradientBackground>
        {/* Empty to provide background effect */}

        <AboutUsSection />
        <BadgesMarqueeSection />
        <TeamSection />
        <AwardedPublicationsHeaderSection />
        <ResearchesSection />
        <CallToActionSection />
      </GradientBackground>
    </>
  );
}
