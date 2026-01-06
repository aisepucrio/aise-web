import React from "react";
import { List, Text, ThemeIcon } from "@mantine/core";

interface IconListProps {
  items: string[];
  icon: React.ReactElement;
  isMobile?: boolean;
}

export const IconList: React.FC<IconListProps> = ({
  items,
  icon,
  isMobile = false,
}) => {
  return (
    <List
      spacing={"sm"}
      size={isMobile ? "sm" : "md"}
      center
      icon={
        <ThemeIcon
          color="var(--primary)"
          size={24}
          radius="lg"
          variant={"light"}
        >
          {React.cloneElement(icon, { size: 14 } as any)}
        </ThemeIcon>
      }
    >
      {items.map((item, idx) => (
        <List.Item key={idx}>
          <Text c="dimmed" lh={1.6} fw={400}>
            {item}
          </Text>
        </List.Item>
      ))}
    </List>
  );
};
