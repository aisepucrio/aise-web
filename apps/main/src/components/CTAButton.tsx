"use client";

import { Button } from "@mantine/core";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";

type CTAButtonProps = {
  href: string;
  text: string;
  isMobile?: boolean;
  ariaLabel?: string;
  className?: string;
};

const buttonMotion = {
  whileHover: { y: -1, scale: 1.03 },
  whileTap: { scale: 0.99 },
  transition: { type: "spring" as const, stiffness: 280, damping: 20 },
} as const;

export default function CTAButton({
  href,
  text,
  isMobile = false,
  ariaLabel,
  className,
}: CTAButtonProps) {
  return (
    <motion.div
      whileHover={buttonMotion.whileHover}
      whileTap={buttonMotion.whileTap}
      transition={buttonMotion.transition}
    >
      <Button
        component={Link}
        href={href}
        size={isMobile ? "md" : "lg"}
        radius="xl"
        aria-label={ariaLabel ?? text}
        rightSection={<IconArrowRight size={18} stroke={2} />}
        className={className}
        style={{
          background: "var(--primary)",
          border: "1px solid rgba(0,0,0,0.06)",
          fontWeight: 700,
          letterSpacing: 0.2,
          paddingInline: isMobile ? 18 : 24,
        }}
      >
        {text}
      </Button>
    </motion.div>
  );
}
