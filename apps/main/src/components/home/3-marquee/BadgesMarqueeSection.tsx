"use client";

import { useEffect, useState, useRef } from "react";
import { Box, Divider } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion, useInView } from "framer-motion";
import Marquee from "@/components/Marquee";
import Badge from "@/components/Badge";

const MotionBox = motion(Box as any);

interface BadgesData {
  researchInterests: string[];
  technologies: string[];
  knowledge: string[];
}

export default function BadgesMarqueeSection() {
  const isMobile = useMediaQuery("(max-width: 62em)");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const [badges, setBadges] = useState<BadgesData>({
    researchInterests: [],
    technologies: [],
    knowledge: [],
  });

  useEffect(() => {
    fetch("/api/team/badges")
      .then((res) => res.json())
      .then((data) => setBadges(data))
      .catch((err) => console.error("Error fetching badges:", err));
  }, []);

  return (
    <>
      <MotionBox
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.2, 0.6, 0.3, 1] }}
      >
        <Box
          style={{
            marginTop: 40,
            borderLeft: "4px solid #f8f9fa",
            borderRight: "4px solid #f8f9fa",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            width: isMobile ? "100%" : "85%",
            margin: "auto",
          }}
        >
          {/* Research Interests Row */}
          {badges.researchInterests.length > 0 && (
            <Box>
              <Marquee speed={1}>
                {badges.researchInterests.map((interest, idx) => (
                  <Badge key={idx} text={interest} />
                ))}
              </Marquee>
            </Box>
          )}

          {/* Technologies Row */}
          {badges.technologies.length > 0 && (
            <Box>
              <Marquee speed={0.8} reverse={true}>
                {badges.technologies.map((tech, idx) => (
                  <Badge key={idx} text={tech} />
                ))}
              </Marquee>
            </Box>
          )}

          {/* Knowledge Areas Row */}
          {badges.knowledge.length > 0 && (
            <Box>
              <Marquee speed={1}>
                {badges.knowledge.map((k, idx) => (
                  <Badge key={idx} text={k} />
                ))}
              </Marquee>
            </Box>
          )}
        </Box>

        <Divider
          mt={64}
          mb={32}
          color="#f8f9fa"
          size="xl"
          w="10%"
          m="auto"
          style={{ borderRadius: "1rem" }}
        />
      </MotionBox>
    </>
  );
}
