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
  IconPhoto,
  IconUpload,
} from "@tabler/icons-react";
import { authFetchJson } from "@/lib/auth-fetch";

// Configuracoes fixas de validacao e mensagens do fluxo de upload.
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;
const FILE_INPUT_ACCEPT = ACCEPTED_IMAGE_EXTENSIONS.join(",");

interface ImageUploadButtonProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  description?: string;
}

interface ImageUploadResponse {
  success: boolean;
  imageUrl: string;
  error?: string;
}

export default function ImageUploadButton({
  onChange,
  label = "Imagem",
  description,
}: ImageUploadButtonProps) {
  // Referencia do input nativo e estados principais do fluxo.
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

  // Valores derivados usados pela UI.
  const currentImageUrl = previewUrl;
  const previewTitle = "Preview da nova imagem selecionada";

  // Helpers de interacao com o input e com o modal.
  // Limpa a selecao atual e reseta o input para permitir escolher o mesmo
  // arquivo novamente, caso o usuario queira.
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

  // Validacao e leitura do arquivo escolhido.
  // Alguns navegadores preenchem `file.type`, outros dependem melhor da
  // extensao do nome. Validamos pelos dois caminhos.
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

  // Integracao com a API de conversao/upload.
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

  // Orquestracao final do envio.
  // O botao so fica ativo quando ha um novo arquivo selecionado.
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
      {/* Input oculto controlado pelos botoes do componente. */}
      <input
        ref={inputRef}
        type="file"
        accept={FILE_INPUT_ACCEPT}
        hidden
        onChange={handleSelectFile}
      />

      {/* Caixa inicial resumida antes de abrir o modal. */}
      <Stack gap="xs" mt="xs">
        <Text size="sm" fw={500}>
          {label}
        </Text>

        <Paper
          withBorder
          radius="md"
          p="md"
          style={{ borderColor: "var(--mantine-color-gray-3)" }}
        >
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon
                size="lg"
                radius="xl"
                variant="light"
                color="var(--primary)"
              >
                <IconUpload size={18} />
              </ThemeIcon>

              <Stack gap={2}>
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

            <Button
              variant="light"
              color="var(--primary)"
              leftSection={<IconPhoto size={16} />}
              onClick={() => setOpened(true)}
            >
              Selecionar imagem
            </Button>
          </Group>
        </Paper>
      </Stack>

      {/* Modal separado para concentrar a UI detalhada do upload. */}
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

interface ImageUploadModalProps {
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

function ImageUploadModal({
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
            {/* Area principal de preview. */}
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 47f67a8bd6969aeb389a0b85122a65e32a8a9eea
