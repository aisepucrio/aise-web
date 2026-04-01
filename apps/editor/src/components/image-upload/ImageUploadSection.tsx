"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { authFetchJson } from "@/lib/auth-fetch";
import ImageUploadModal from "./ImageUploadModal";

// Regras fixas de validacao aceitas pelo fluxo.
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;
const FILE_INPUT_ACCEPT = ACCEPTED_IMAGE_EXTENSIONS.join(",");

// Props da secao renderizada antes da abertura do modal.
export interface ImageUploadSectionProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  description?: string;
}

// Contrato esperado da API de upload/conversao.
interface ImageUploadResponse {
  success: boolean;
  imageUrl: string;
  error?: string;
}

export default function ImageUploadSection({
  value,
  onChange,
  label = "Imagem",
  description,
}: ImageUploadSectionProps) {
  // A secao principal concentra estado, validacao e envio.
  const inputRef = useRef<HTMLInputElement>(null);
  const [opened, setOpened] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Cria uma URL temporaria para exibir preview local sem esperar o upload.
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

  // Valores derivados repassados para a camada visual.
  const storedImageUrl = value?.trim() || "";
  const hasStoredImage = storedImageUrl.length > 0;
  const currentImageUrl = previewUrl || storedImageUrl || null;
  const previewTitle = previewUrl
    ? "Preview da nova imagem selecionada"
    : "Imagem atual";

  // Limpa a selecao e libera a reescolha do mesmo arquivo.
  const clearSelection = ({
    clearError = true,
  }: { clearError?: boolean } = {}) => {
    setSelectedFile(null);

    if (clearError) {
      setError(null);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const closeModal = () => {
    setOpened(false);
    clearSelection();
  };

  // Remove a imagem persistida sem alterar o restante do fluxo.
  const removeCurrentImage = () => {
    clearSelection();
    onChange("");
  };

  // Valida por MIME e extensao para cobrir navegadores diferentes.
  const isSupportedFile = (file: File) => {
    if (ACCEPTED_IMAGE_TYPES.has(file.type)) {
      return true;
    }

    const fileName = file.name.toLowerCase();
    return ACCEPTED_IMAGE_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension),
    );
  };

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    if (!isSupportedFile(file)) {
      setError("Selecione uma imagem JPG, JPEG ou PNG.");
      clearSelection({ clearError: false });
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  // Encapsula a chamada remota de upload/conversao.
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

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

    return response.imageUrl;
  };

  // Orquestra envio, retorno ao formulario e limpeza local.
  const submitImage = async () => {
    if (!selectedFile) {
      setError("Escolha uma imagem antes de continuar.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadedImageUrl = await uploadImage(selectedFile);
      onChange(uploadedImageUrl);
      closeModal();
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
      {/* Input nativo mantido fora do modal para o fluxo inteiro. */}
      <input
        ref={inputRef}
        type="file"
        accept={FILE_INPUT_ACCEPT}
        hidden
        onChange={handleSelectFile}
      />

      {/* Bloco sempre visivel antes da interacao detalhada. */}
      <Stack gap="xs" mt="xs">
        <Text size="sm" fw={500}>
          {label}
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

            {/* Mantem a acao compacta: preview atual ou icone neutro. */}
            {hasStoredImage ? (
              <div
                style={{
                  position: "relative",
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                }}
              >
                <img
                  src={storedImageUrl}
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
                    removeCurrentImage();
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

      {/* Modal recebe estado pronto e dispara callbacks da secao. */}
      <ImageUploadModal
        opened={opened}
        error={error}
        currentImageUrl={currentImageUrl}
        previewTitle={previewTitle}
        selectedFile={selectedFile}
        isUploading={isUploading}
        onClose={closeModal}
        onPickImage={openFilePicker}
        onSubmit={submitImage}
      />
    </>
  );
}
