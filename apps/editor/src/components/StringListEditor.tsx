"use client";

import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { KeyboardEvent, ReactNode, useState } from "react";
import { FieldLabel } from "./FieldLabel";

type StringListEditorVariant = "badges" | "list";

export interface StringListEditorProps {
  label?: string;
  tooltip?: ReactNode;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  variant?: StringListEditorVariant;
  addButtonLabel?: string;
}

// Editor reutilizável para listas de texto com a mesma lógica e dois modos visuais.
export function StringListEditor({
  label,
  tooltip,
  values,
  onChange,
  placeholder = "Adicionar...",
  variant = "badges",
  addButtonLabel = "Adicionar",
}: StringListEditorProps) {
  const [draftValue, setDraftValue] = useState("");

  // Normaliza o texto digitado e evita itens vazios ou repetidos.
  const addItem = () => {
    const nextValue = draftValue.trim();

    if (!nextValue || values.includes(nextValue)) {
      return;
    }

    onChange([...values, nextValue]);
    setDraftValue("");
  };

  // Remove pelo índice para preservar o restante da lista como está.
  const removeItem = (indexToRemove: number) => {
    onChange(values.filter((_, index) => index !== indexToRemove));
  };

  // Enter funciona como atalho do botão de adicionar.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    addItem();
  };

  // O rótulo reaproveita o FieldLabel quando existe tooltip.
  const labelNode = !label ? null : tooltip ? (
    <FieldLabel text={label} tooltip={tooltip} />
  ) : (
    <Text size="sm" fw={500} c="dimmed">
      {label}
    </Text>
  );

  return (
    <Stack gap="xs">
      {/* Cabeçalho opcional do campo. */}
      {labelNode}

      {/* Área visual que mostra os itens já adicionados. */}
      {variant === "badges" ? (
        <BadgeList values={values} onRemove={removeItem} />
      ) : (
        <TextList values={values} onRemove={removeItem} />
      )}

      {/* Área de entrada para incluir novos itens na lista. */}
      <Group gap="xs">
        <TextInput
          placeholder={placeholder}
          value={draftValue}
          onChange={(event) => setDraftValue(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          size="xs"
          style={{ flex: 1 }}
        />
        <Button
          size="xs"
          variant="filled"
          color="var(--primary)"
          leftSection={<IconPlus size={12} />}
          onClick={addItem}
          styles={{
            root: {
              color: "white",
            },
          }}
        >
          {addButtonLabel}
        </Button>
      </Group>
    </Stack>
  );
}

type StringListItemsProps = {
  values: string[];
  onRemove: (index: number) => void;
};

// Visual compacto para tags, tecnologias e listas curtas.
function BadgeList({ values, onRemove }: StringListItemsProps) {
  return (
    <Group gap="xs" wrap="wrap">
      {values.map((value, index) => (
        <Badge
          key={`${value}-${index}`}
          variant="light"
          color="var(--primary)"
          size="md"
          radius="sm"
          rightSection={
            <ActionIcon
              size="xs"
              variant="transparent"
              color="var(--primary)"
              onClick={() => onRemove(index)}
            >
              <IconX size={10} />
            </ActionIcon>
          }
        >
          {value}
        </Badge>
      ))}
    </Group>
  );
}

// Visual em linhas para itens mais longos e fáceis de escanear.
function TextList({ values, onRemove }: StringListItemsProps) {
  return (
    <Stack gap={4}>
      {values.map((value, index) => (
        <Group key={`${value}-${index}`} gap="xs" wrap="nowrap">
          <Text
            size="sm"
            style={{
              flex: 1,
              padding: "6px 10px",
              background: "var(--mantine-color-gray-0)",
              borderRadius: 6,
              border: "1px solid var(--mantine-color-gray-2)",
            }}
          >
            {value}
          </Text>
          <ActionIcon
            size="sm"
            variant="light"
            color="red"
            onClick={() => onRemove(index)}
          >
            <IconX size={12} />
          </ActionIcon>
        </Group>
      ))}
    </Stack>
  );
}
