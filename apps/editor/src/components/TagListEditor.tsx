import { ActionIcon, Badge, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";

 export function TagListEditor({
  //possível label com tradução da seção:
  label,
  values,
  onChange,
  placeholder,
}: {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setInputValue("");
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500} c="dimmed">
        {label}
      </Text>
      <Group gap="xs" wrap="wrap">
        {values.map((val, idx) => (
          <Badge
            key={idx}
            variant="light"
            color="var(--primary)"
            size="md"
            radius="sm"
            rightSection={
              <ActionIcon
                size="xs"
                variant="transparent"
                color="var(--primary)"
                onClick={() => handleRemove(idx)}
              >
                <IconX size={10} />
              </ActionIcon>
            }
          >
            {val}
          </Badge>
        ))}
      </Group>
      <Group gap="xs">
        <TextInput
          placeholder={placeholder || "Adicionar..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          size="xs"
          style={{ flex: 1 }}
        />
        <Button
          size="xs"
          variant="dark"
          color="var(--primary)"
          leftSection={<IconPlus size={12} />}
          onClick={handleAdd}
        >
          Adicionar
        </Button>
      </Group>
    </Stack>
  );
}