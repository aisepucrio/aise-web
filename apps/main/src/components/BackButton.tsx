import React from "react";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

type BackButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function BackButton({ children, onClick }: BackButtonProps) {
  const isMobile = useMediaQuery("(max-width: 62em)");
  return (
    <Button
      leftSection={<IconArrowLeft size={20} />}
      variant="white"
      color="var(--primary)"
      mb={isMobile ? 20 : 32}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
