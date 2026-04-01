"use client";

import {
  Alert,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconDeviceFloppy,
  IconUpload,
} from "@tabler/icons-react";

// Props puramente visuais/controladas pelo componente pai.
export interface ImageUploadModalProps {
  opened: boolean;
  error: string | null;
  currentImageUrl: string | null;
  previewTitle: string;
  selectedFile: File | null;
  isUploading: boolean;
  onClose: () => void;
  onPickImage: () => void;
  onSubmit: () => void;
}

export default function ImageUploadModal({
  opened,
  error,
  currentImageUrl,
  previewTitle,
  selectedFile,
  isUploading,
  onClose,
  onPickImage,
  onSubmit,
}: ImageUploadModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Upload de nova imagem"
      centered
      size="lg"
    >
      {/* Modal focado apenas na apresentacao do fluxo. */}
      <Stack gap="md">
        {/* Contexto inicial do modal. */}
        <Text size="sm" c="dimmed">
          Envie uma imagem JPG, JPEG ou PNG. Depois de selecionar, clique em
          salvar para aplicar a nova imagem.
        </Text>

        {/* Erro de validacao local ou falha no upload. */}
        {error && (
          <Alert
            color="red"
            variant="light"
            icon={<IconAlertCircle size={16} />}
          >
            {error}
          </Alert>
        )}

        <Paper
          withBorder
          radius="md"
          p="xl"
          style={{
            borderStyle: "dashed",
            borderColor: "var(--mantine-color-gray-4)",
          }}
        >
          <Stack align="center" gap="sm">
            {/* Alterna entre estado vazio e preview do arquivo atual. */}
            {currentImageUrl ? (
              <>
                <img
                  src={currentImageUrl}
                  alt="Preview da imagem selecionada"
                  style={{
                    display: "block",
                    width: "100%",
                    maxHeight: 240,
                    objectFit: "contain",
                    borderRadius: "var(--mantine-radius-md)",
                  }}
                />
                <Text size="sm" fw={500}>
                  {previewTitle}
                </Text>
                {selectedFile && (
                  <Text size="xs" c="dimmed">
                    {selectedFile.name}
                  </Text>
                )}
              </>
            ) : (
              <>
                <ThemeIcon
                  size={56}
                  radius="xl"
                  variant="light"
                  color="var(--primary)"
                >
                  <IconUpload size={28} />
                </ThemeIcon>
                <Stack gap={2} align="center">
                  <Text fw={600}>Nenhuma imagem selecionada</Text>
                  <Text size="sm" c="dimmed" ta="center">
                    Clique abaixo para escolher uma imagem do computador.
                  </Text>
                </Stack>
              </>
            )}

            {/* Aciona o file picker controlado pela secao pai. */}
            <Button
              variant="light"
              color="var(--primary)"
              leftSection={<IconUpload size={16} />}
              onClick={onPickImage}
            >
              Escolher imagem
            </Button>
          </Stack>
        </Paper>

        {/* Acoes finais do fluxo. */}
        <Group justify="center">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            color="var(--primary)"
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={onSubmit}
            loading={isUploading}
            disabled={!selectedFile}
          >
            Salvar imagem
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
