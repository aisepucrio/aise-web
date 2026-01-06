"use client";

import { Box, Button, Group } from "@mantine/core";
import {
  IconUsers,
  IconFlask,
  IconBook,
  IconTool,
  IconUpload,
} from "@tabler/icons-react";
import { ReactNode } from "react";

// Tipo para definir uma aba do menu
export interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
}

// Lista de abas disponíveis (facilmente expansível)
export const TABS: TabItem[] = [
  {
    id: "team",
    label: "Team",
    icon: <IconUsers size={18} />,
  },
  {
    id: "researches",
    label: "Researches",
    icon: <IconFlask size={18} />,
  },
  {
    id: "publications",
    label: "Publications",
    icon: <IconBook size={18} />,
  },
  {
    id: "tools",
    label: "Tools",
    icon: <IconTool size={18} />,
  },
  {
    id: "publish",
    label: "Publicar",
    icon: <IconUpload size={18} />,
  },
];

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <Box
      style={{
        borderBottom: "2px solid #f1f3f5",
        marginBottom: "24px",
      }}
    >
      <Group gap="xs" justify="center">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              variant={isActive ? "filled" : "subtle"}
              leftSection={tab.icon}
              onClick={() => onTabChange(tab.id)}
              styles={{
                root: {
                  background: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "white" : "#64748b",
                  borderBottom: isActive
                    ? "3px solid var(--primary)"
                    : "3px solid transparent",
                  borderRadius: "8px 8px 0 0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: isActive ? "var(--primary)" : "#f8f9fa",
                    color: isActive ? "white" : "var(--primary)",
                  },
                },
                label: {
                  fontWeight: isActive ? 600 : 500,
                },
              }}
            >
              {tab.label}
            </Button>
          );
        })}
      </Group>
    </Box>
  );
}
