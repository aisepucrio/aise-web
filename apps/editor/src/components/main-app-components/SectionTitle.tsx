import React from "react";
import { Group, ThemeIcon, Title } from "@mantine/core";

interface SectionTitleProps {
  icon: React.ReactNode; // Icone a ser exibido ao lado do título
  title: string; // Texto do título
  isMobile?: boolean; // Se está em modo mobile (ajusta tamanhos)
  children?: React.ReactNode; // Conteúdo opcional para renderizar abaixo do título
}

// Componente reutilizável para títulos de seção com ícone.
export const SectionTitle: React.FC<SectionTitleProps> = ({
  icon,
  title,
  isMobile = false,
  children,
}) => {
  return (
    <div>
      <Group mb={"md"} gap={"sm"}>
        <ThemeIcon
          size={isMobile ? 36 : 42}
          radius="lg"
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
  );
};

export default SectionTitle;
