"use client";

/**
 * Componente base de tooltip
 * Renderiza um ícone e no hover mostra uma caixa com conteúdo customizável (ReactNode)
 */

import { Tooltip, ActionIcon, Box } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { ReactNode } from "react";

export interface TooltipIconProps {
  /** Conteúdo exibido dentro do tooltip (instruções específicas) */
  children: ReactNode;

  /** Posicionamento do tooltip — cada seção define o seu */
  position?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end";

  /** Largura máxima da caixa do tooltip (default: 260px) */
  width?: number;

  /** Ícone customizável (default: IconInfoCircle) */
  icon?: ReactNode;
}

export default function TooltipIcon({
  children,
  position = "right",
  width = 260,
  icon,
}: TooltipIconProps) {
  return (
    <Tooltip
      label={<Box style={{ maxWidth: width }}>{children}</Box>}
      position={position}
      withArrow
      multiline
      color="dark"
      radius="md"
      p="sm"
      transitionProps={{ transition: "fade", duration: 150 }}
    >
      <ActionIcon
        variant="subtle"
        color="gray"
        size="xs"
        radius="xl"
        style={{ cursor: "help" }}
      >
        {icon ?? <IconInfoCircle size={14} />}
      </ActionIcon>
    </Tooltip>
  );
}