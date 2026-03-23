// Criado a principio para servir de base ao tooltipicon (para inserir info dentro do TextInput)
// Componente aux que monta o label de um campo de formulário com o icone i ao lado

// Pelo que pesquisei, o campo do mantine TextInput aceita qualquer ReactNode na prop do label; 

// O componente FieldLabel faz com que consiga ser um "label composto de mais de 1 item":
// na pratica, o FieldLabel transforma o label normal: " TITLE ", em: " TITLE     i ", onde i é o tooltipicon


import { Group, Text } from "@mantine/core";
import TooltipIcon from "./TooltipIcon";
import { ReactNode } from "react";

// helper que monta o label com o ℹ inline
export function FieldLabel({ text, tooltip }: { text: string; tooltip: ReactNode }) {
  return (
    <Group gap={4} wrap="nowrap">
      <Text size="sm" fw={500}>{text}</Text>
      <TooltipIcon position="top">{tooltip}</TooltipIcon>
    </Group>
  );
}