"use client";

import { useState } from "react";
import {
  ActionIcon,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import ImageUploadModal from "./ImageUploadModal";

// Casca visual do campo; a lógica de upload fica toda dentro do modal.
export interface ImageUploadSectionProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
}

export default function ImageUploadSection({
  value,
  onChange,
  label = "Imagem",
  description,
  required = false,
}: ImageUploadSectionProps) {
  const [opened, setOpened] = useState(false);
  const imageUrl = value?.trim() || "";

  return (
    <>
      {/* Área compacta sempre visível no formulário. */}
      <Stack gap="xs" mt="xs">
        <Text size="sm" fw={500}>
          {label}
          {required && (
            <Text component="span" c="red" ml={5}>
              *
            </Text>
          )}
        </Text>

        <Paper
          withBorder
          radius="md"
          p="md"
          onClick={() => setOpened(true)}
          style={{
            borderColor: "var(--mantine-color-gray-3)",
            cursor: "pointer",
          }}
        >
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
              <ThemeIcon
                size="lg"
                radius="xl"
                variant="light"
                color="var(--primary)"
              >
                <IconUpload size={18} />
              </ThemeIcon>

              <Stack gap={2} style={{ minWidth: 0 }}>
                <Text size="sm" fw={600}>
                  Upload de nova imagem
                </Text>
                {description && (
                  <Text size="xs" c="dimmed">
                    {description}
                  </Text>
                )}
              </Stack>
            </Group>

            {/* Se já existe imagem salva, mostra preview e atalho para remover. */}
            {imageUrl ? (
              <div
                style={{
                  position: "relative",
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                }}
              >
                <img
                  src={imageUrl}
                  alt={`Imagem atual de ${label.toLowerCase()}`}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "var(--mantine-radius-sm)",
                  }}
                />

                <ActionIcon
                  variant="filled"
                  color="dark"
                  radius="xl"
                  size={18}
                  onClick={(event) => {
                    event.stopPropagation();
                    onChange("");
                  }}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                  }}
                >
                  <IconX size={12} />
                </ActionIcon>
              </div>
            ) : (
              <ThemeIcon
                size={40}
                radius="md"
                variant="light"
                color="var(--primary)"
                style={{ flexShrink: 0 }}
              >
                <IconPhoto size={18} />
              </ThemeIcon>
            )}
          </Group>
        </Paper>
      </Stack>

      {/* O modal reaproveita o valor atual e devolve a nova URL pelo onChange. */}
      <ImageUploadModal
        opened={opened}
        value={imageUrl}
        onClose={() => setOpened(false)}
        onChange={onChange}
      />
    </>
  );
}
