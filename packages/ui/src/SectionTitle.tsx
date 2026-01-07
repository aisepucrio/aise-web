"use client";

import React from "react";
import { Group, ThemeIcon, Title, MantineProvider } from "@mantine/core";

export interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  isMobile?: boolean;
  children?: React.ReactNode;
}

// Reusable section title component with icon for consistent section headers
export const SectionTitle: React.FC<SectionTitleProps> = ({
  icon,
  title,
  isMobile = false,
  children,
}) => {
  return (
    <MantineProvider>
      <div>
        <Group mb="md" gap="sm">
          <ThemeIcon
            size={isMobile ? 36 : 42}
            radius="md"
            variant="light"
            color="var(--primary)"
          >
            {icon}
          </ThemeIcon>
          <Title order={3} size={isMobile ? "h4" : "h3"} c="var(--primary)">
            {title}
          </Title>
        </Group>
        {children}
      </div>
    </MantineProvider>
  );
};

export default SectionTitle;
