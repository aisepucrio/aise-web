"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Anchor, Box, Button, Divider, Drawer, Burger } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { motion, useAnimation } from "framer-motion";
import NavLinks from "./NavLinks";
import headerContent from "@/../public/json/header.json";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };
type HeaderProps = { items?: NavItem[] };

/**
 * Header fixo: logo (esq), nav (centro), CTA (dir).
 * - Home: transparente sobre o hero; fica branco após passar do hero.
 * - Mobile: permanece transparente na home enquanto o menu estiver FECHADO; ao abrir o Drawer, fica branco.
 */
export default function Header({ items = headerContent.items }: HeaderProps) {
  const pathname = usePathname();
  const controls = useAnimation();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  // Menu mobile
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 62em)", false, {
    getInitialValueInEffect: true,
  });

  // Fecha Drawer ao trocar de rota
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Calcula se passou do hero (na home)
  useEffect(() => {
    if (pathname !== "/") {
      setScrolledPastHero(true);
      controls.start({
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        transition: { duration: 0.2 },
      });
      return;
    }

    let ticking = false;
    const update = () => {
      const hero = document.getElementById("hero-root");
      const headerEl = headerRef.current;
      if (!hero || !headerEl) return;

      const heroRect = hero.getBoundingClientRect();
      const heroBottom = heroRect.bottom + window.scrollY;
      const headerHeight = headerEl.getBoundingClientRect().height;
      const scrolled = window.scrollY + headerHeight >= heroBottom - 1;

      setScrolledPastHero(scrolled);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname, controls]);

  // Anima fundo/sombra:
  // - Fora da home: sempre branco
  // - Home: branco se passou do hero OU (mobile && menu aberto), senão transparente
  useEffect(() => {
    const onHome = pathname === "/";
    const whiteOnHome = scrolledPastHero || (isMobile && opened);
    const bg = onHome
      ? whiteOnHome
        ? "#ffffff"
        : "rgba(255,255,255,0)"
      : "#ffffff";
    const shadow =
      (!onHome && true) || whiteOnHome
        ? "0 4px 10px rgba(0,0,0,0.08)"
        : "0 0 0 rgba(0,0,0,0)";

    controls.start({
      backgroundColor: bg,
      boxShadow: shadow,
      transition: { duration: 0.25 },
    });
  }, [pathname, isMobile, opened, scrolledPastHero, controls]);

  // Cor dos links: escuros quando fundo claro
  const isLightBg =
    pathname !== "/" || scrolledPastHero || (isMobile && opened);
  const linkColor = isLightBg ? "#111" : "#fff";

  return (
    <>
      <motion.header
        ref={(el) => {
          headerRef.current = el;
        }}
        animate={controls}
        initial={{
          backgroundColor: "rgba(255,255,255,0)",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backdropFilter: "saturate(150%) blur(4px)",
        }}
      >
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <Box
            style={{
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
            }}
          >
            {/* Logo */}
            <Anchor
              component={Link}
              href="/"
              aria-label="Ir para a página inicial"
            >
              <img
                src={headerContent.logo.src}
                alt={headerContent.logo.alt}
                width={135}
                style={{ display: "inline-block", height: "auto" }}
                draggable={false}
              />
            </Anchor>

            {/* Navegação (desktop) */}
            <nav aria-label="Navegação principal">
              <Box visibleFrom="md">
                <NavLinks
                  items={items}
                  pathname={pathname}
                  linkColor={linkColor}
                  activeColor={"var(--primary)"}
                />
              </Box>
            </nav>

            {/* CTA (desktop) */}
            <Box visibleFrom="md">
              <Button
                component={Link}
                href={headerContent.cta.href}
                size="sm"
                style={{ backgroundColor: "var(--primary)", border: "none" }}
              >
                {headerContent.cta.text}
              </Button>
            </Box>

            {/* Burger (mobile) */}
            <Box hiddenFrom="md">
              <Burger
                opened={opened}
                onClick={toggle}
                aria-label="Abrir menu"
                aria-controls="mobile-nav"
                aria-expanded={opened}
              />
            </Box>
          </Box>
        </Box>
      </motion.header>

      {/* Drawer (mobile): bottom, full screen, itens centralizados */}
      <Drawer
        id="mobile-nav"
        opened={opened}
        onClose={close}
        position="bottom"
        size="100%"
        padding="xl"
        hiddenFrom="md"
        radius={0}
        trapFocus
        lockScroll
        returnFocus
      >
        <Box
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          <NavLinks
            items={items}
            pathname={pathname}
            linkColor="#111"
            activeColor={"var(--primary)"}
            vertical
            size={20}
          />

          <Divider w="60%" />

          <Button
            component={Link}
            href={headerContent.cta.href}
            onClick={close}
            style={{ backgroundColor: "var(--primary)", border: "none" }}
            size="md"
          >
            {headerContent.cta.text}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
