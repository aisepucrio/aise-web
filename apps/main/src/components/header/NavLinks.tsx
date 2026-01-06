"use client";

import React from "react";
import Link from "next/link";
import { Anchor, Group, Stack } from "@mantine/core";

type NavItem = { label: string; href: string };

/** Lista de links */
export default function NavLinks({
  items,
  pathname,
  linkColor,
  activeColor,
  vertical = false,
  size = 16,
}: {
  items: NavItem[];
  pathname: string | null;
  linkColor: string;
  activeColor: string;
  vertical?: boolean;
  size?: number;
}) {
  const Links = items.map((it) => {
    const selected =
      it.href === "/"
        ? pathname === "/"
        : pathname === it.href ||
          (pathname?.startsWith(it.href + "/") ?? false);
    return (
      <Anchor
        key={it.label}
        component={Link}
        href={it.href}
        aria-current={selected ? "page" : undefined}
        style={{
          textDecoration: "none",
          fontWeight: 500,
          fontSize: size,
          color: selected ? activeColor : linkColor,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {it.label}
      </Anchor>
    );
  });

  if (vertical)
    return (
      <Stack gap="md" align="center">
        {Links}
      </Stack>
    );
  return (
    <Group gap={28} wrap="nowrap">
      {Links}
    </Group>
  );
}
