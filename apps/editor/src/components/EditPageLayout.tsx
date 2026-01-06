"use client";

/**
 * Layout compartilhado para páginas de edição
 * Reduz código duplicado entre Team, Tools e Researches
 */

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Group,
  Button,
  Title,
  Text,
  Badge,
  Alert,
  Grid,
  Divider,
  Textarea,
  Center,
  Loader,
  Stack,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCheck,
  IconX,
  IconRefresh,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import SaveButton from "./SaveButton";
import { ReactNode } from "react";

export interface EditPageLayoutProps {
  // Configurações básicas
  title: string;
  subtitle: string;
  isLoading: boolean;
  isNewItem: boolean;
  newItemMessage: string;
  newItemWarning?: string;

  // JSON editor
  jsonText: string;
  setJsonText: (text: string) => void;
  jsonError: string | null;

  // Modo de edição
  editMode: "json" | "form";
  setEditMode: (mode: "json" | "form") => void;
  formEditor?: ReactNode; // Formulário customizado (se houver)

  // Validação
  validation: { valid: boolean; errors: string[] };

  // Ações
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;

  // Autosave
  lastSaved?: Date | null;
  isAutoSaving?: boolean;

  // Preview
  preview: ReactNode;

  // Instruções (opcional)
  instructions?: ReactNode;
}

export function EditPageLayout({
  title,
  subtitle,
  isLoading,
  isNewItem,
  newItemMessage,
  newItemWarning,
  jsonText,
  setJsonText,
  jsonError,
  editMode,
  setEditMode,
  formEditor,
  validation,
  onSave,
  onReset,
  isSaving,
  lastSaved,
  isAutoSaving,
  preview,
  instructions,
}: EditPageLayoutProps) {
  const router = useRouter();
  const [, setTick] = useState(0);

  // Atualiza o tempo "salvo há X segundos" a cada segundo
  useEffect(() => {
    if (!lastSaved) return;

    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  if (isLoading) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          background: "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Center>
          <Loader size="xl" color="white" />
        </Center>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "var(--primary)",
        padding: "20px",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <Container size="100%">
        {/* Header */}
        <Paper
          shadow="xs"
          p="md"
          radius="lg"
          mb="md"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
          }}
        >
          <Group justify="space-between" wrap="nowrap">
            <Group>
              <Button
                leftSection={<IconArrowLeft size={18} />}
                variant="light"
                color="var(--primary)"
                onClick={() => router.push("/")}
              >
                Voltar
              </Button>
              <Box>
                <Title order={2} size="h3" style={{ color: "var(--primary)" }}>
                  {title}
                </Title>
                <Text size="sm" c="dimmed">
                  {subtitle}
                </Text>
              </Box>
            </Group>
            <Stack gap="xs" align="flex-end">
              <Badge
                size="lg"
                variant="light"
                color={validation.valid ? "green" : "red"}
                leftSection={
                  validation.valid ? (
                    <IconCheck size={16} />
                  ) : (
                    <IconX size={16} />
                  )
                }
              >
                {validation.valid ? "Válido" : "Inválido"}
              </Badge>
              {!isNewItem && lastSaved && (
                <Text size="xs" c="dimmed">
                  {isAutoSaving ? (
                    <Text span fw={500} c="blue">
                      Salvando automaticamente...
                    </Text>
                  ) : (
                    <>
                      Salvo há{" "}
                      <Text span fw={500}>
                        {Math.floor(
                          (new Date().getTime() - lastSaved.getTime()) / 1000
                        )}
                        s
                      </Text>
                    </>
                  )}
                </Text>
              )}
            </Stack>
          </Group>
        </Paper>

        {/* Instruções (se fornecidas) */}
        {instructions}

        {/* Alert de novo item */}
        {isNewItem && (
          <Alert
            radius="lg"
            variant="white"
            icon={<IconAlertCircle />}
            title={newItemMessage}
            color="var(--primary)"
            mb="md"
          >
            <Text size="sm" mb="xs">
              Os dados abaixo são de exemplo. Edite-os e clique em
              &quot;Salvar&quot; para criar no Google Sheets.
            </Text>
            {newItemWarning && (
              <Text size="sm" fw={600} c="orange">
                {newItemWarning}
              </Text>
            )}
          </Alert>
        )}

        {/* Erros de validação */}
        {!validation.valid && (
          <Alert
            variant="white"
            radius="lg"
            icon={<IconAlertCircle />}
            title={`Erros de Validação (${validation.errors.length})`}
            color="red"
            mb="md"
          >
            <Text size="sm" mb="xs">
              Corrija os seguintes erros antes de salvar:
            </Text>
            <Stack gap="xs">
              {validation.errors.map((error, idx) => (
                <Text key={idx} size="sm" style={{ fontFamily: "monospace" }}>
                  {error}
                </Text>
              ))}
            </Stack>
          </Alert>
        )}

        <Grid gutter="md">
          {/* Painel Esquerdo - Editor */}
          <Grid.Col span={{ base: 12, md: 4.5 }}>
            <Paper
              shadow="xs"
              p="md"
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.98)",
                height: "calc(100vh - 250px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Toggle entre JSON e Formulário (se houver formulário) */}
              {formEditor && (
                <Group justify="space-between" mb="md">
                  <Title
                    order={3}
                    size="h4"
                    style={{ color: "var(--primary)" }}
                  >
                    Editor {editMode === "json" ? "JSON" : "Formulário"}
                  </Title>
                  <Button
                    size="xs"
                    variant="light"
                    color="var(--primary)"
                    onClick={() =>
                      setEditMode(editMode === "json" ? "form" : "json")
                    }
                  >
                    {editMode === "json" ? "Modo Formulário" : "Modo JSON"}
                  </Button>
                </Group>
              )}

              {!formEditor && (
                <Title
                  order={3}
                  size="h4"
                  mb="md"
                  style={{ color: "var(--primary)" }}
                >
                  Editor JSON
                </Title>
              )}

              <Box
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflowY:
                    editMode === "form" && formEditor ? "auto" : "hidden",
                }}
              >
                {editMode === "json" || !formEditor ? (
                  <Textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.currentTarget.value)}
                    placeholder="Cole ou edite o JSON aqui..."
                    styles={{
                      wrapper: {
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      },
                      root: {
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      },
                      input: {
                        fontFamily: "monospace",
                        fontSize: "12px",
                        resize: "none",
                        flex: 1,
                        minHeight: "100%",
                      },
                    }}
                    error={jsonError}
                  />
                ) : (
                  formEditor
                )}
              </Box>

              <Divider my="md" />

              <Group justify="space-between">
                <Button
                  leftSection={<IconRefresh size={18} />}
                  variant="light"
                  color="var(--primary)"
                  onClick={onReset}
                >
                  Resetar para Exemplo
                </Button>
                <SaveButton
                  onClick={onSave}
                  loading={isSaving}
                  disabled={!validation.valid}
                />
              </Group>
            </Paper>
          </Grid.Col>

          {/* Painel Direito - Preview */}
          <Grid.Col span={{ base: 12, md: 7.5 }}>
            <Paper
              shadow="xs"
              p="md"
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.98)",
                height: "calc(100vh - 250px)",
                overflowY: "auto",
              }}
            >
              <Title
                order={3}
                size="h4"
                mb="md"
                style={{ color: "var(--primary)" }}
              >
                Preview em Tempo Real
              </Title>

              {preview}
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
