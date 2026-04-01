"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
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
import { authFetchJson } from "@/lib/auth-fetch";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;
const FILE_ACCEPT = IMAGE_EXTENSIONS.join(",");

export interface ImageUploadModalProps {
  opened: boolean;
  value?: string;
  onClose: () => void;
  onChange: (imageUrl: string) => void;
}

interface ImageUploadResponse {
  success: boolean;
  imageUrl: string;
  error?: string;
}

export default function ImageUploadModal({
  opened,
  value,
  onClose,
  onChange,
}: ImageUploadModalProps) {
  // O modal concentra todo o fluxo: seleção, validação, preview e upload.
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const imageUrl = value?.trim() || "";
  const preview = previewUrl || imageUrl || null;

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  // Limpa a seleção local sem mexer no valor já salvo fora do modal.
  const reset = (keepError = false) => {
    setSelectedFile(null);
    if (!keepError) {
      setError(null);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    // Aceita por MIME e também por extensão para cobrir diferenças entre navegadores.
    const fileName = file.name.toLowerCase();
    const isValid =
      IMAGE_TYPES.has(file.type) ||
      IMAGE_EXTENSIONS.some((extension) => fileName.endsWith(extension));

    if (!isValid) {
      setError("Selecione uma imagem JPG, JPEG ou PNG.");
      reset(true);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const submitImage = async () => {
    if (!selectedFile) {
      setError("Escolha uma imagem antes de continuar.");
      return;
    }

    setIsUploading(true);

    try {
      // O backend recebe o arquivo bruto e devolve apenas a URL final da imagem.
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await authFetchJson<ImageUploadResponse>(
        "/api/imageboximageconverter",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.success || !response.imageUrl) {
        throw new Error(response.error || "Falha ao converter a imagem.");
      }

      onChange(response.imageUrl);
      handleClose();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Não foi possível enviar a imagem. Tente novamente.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={FILE_ACCEPT}
        hidden
        onChange={handleSelectFile}
      />

      <Modal
        opened={opened}
        onClose={handleClose}
        title="Upload de nova imagem"
        centered
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Envie uma imagem JPG, JPEG ou PNG. Depois de selecionar, clique em
            salvar para aplicar a nova imagem.
          </Text>

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
              {/* Mostra a imagem atual até que um novo arquivo seja escolhido. */}
              {preview ? (
                <>
                  <img
                    src={preview}
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
                    {previewUrl ? "Preview da nova imagem selecionada" : "Imagem atual"}
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

              <Button
                variant="light"
                color="var(--primary)"
                leftSection={<IconUpload size={16} />}
                onClick={() => inputRef.current?.click()}
              >
                Escolher imagem
              </Button>
            </Stack>
          </Paper>

          <Group justify="center">
            <Button variant="default" onClick={handleClose}>
              Cancelar
            </Button>

            <Button
              color="var(--primary)"
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={submitImage}
              loading={isUploading}
              disabled={!selectedFile}
            >
              Salvar imagem
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
