"use client";

import { Publication } from "@/lib/types";
import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Button,
  TextInput,
  Table,
  ActionIcon,
  Loader,
  Alert,
  Modal,
} from "@mantine/core";
import {
  IconDownload,
  IconRefresh,
  IconTrash,
  IconEdit,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import SaveButton from "@/components/SaveButton";

export default function PublicationsHomePage() {
  // Estado das publicações
  const [publications, setPublications] = useState<Publication[]>([]);
  const [originalPublications, setOriginalPublications] = useState<
    Publication[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scraping, setScraping] = useState(false);

  // Parâmetros de scraping
  const [authorId, setAuthorId] = useState("mCaYwHAAAAAJ");
  const [yearCutoff, setYearCutoff] = useState(2023);

  // Edição de awards
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Modal de confirmação
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"append" | "replace">(
    "append",
  );

  // Mensagens
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  // Detecta se houve alterações
  const hasChanges =
    JSON.stringify(publications) !== JSON.stringify(originalPublications);

  // Carrega publicações ao montar
  useEffect(() => {
    loadPublications();
  }, []);

  // Carrega publicações do Google Sheets
  const loadPublications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/publications");
      const data = await response.json();
      const pubs = data.publications || [];
      setPublications(pubs);
      setOriginalPublications(pubs);
    } catch (error) {
      showMessage("Erro ao carregar publicações", "error");
    } finally {
      setLoading(false);
    }
  };

  // Scraping via SerpAPI
  const handleScrape = async (mode: "append" | "replace") => {
    setScraping(true);
    setMessage("");

    try {
      // 1. Busca via SerpAPI
      const response = await fetch("/api/serpapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId, yearCutoff }),
      });

      if (!response.ok) throw new Error("Erro no scraping");

      const { publications: newPubs } = await response.json();

      // 2. Se for append, filtra duplicatas (por título)
      let finalPubs = newPubs;
      if (mode === "append") {
        const existingTitles = new Set(
          publications.map((p) => p.title.toLowerCase()),
        );
        finalPubs = newPubs.filter(
          (p: Publication) => !existingTitles.has(p.title.toLowerCase()),
        );

        if (finalPubs.length === 0) {
          showMessage("Nenhuma publicação nova encontrada", "success");
          setScraping(false);
          return;
        }
      }

      // 3. Atualiza estado local
      if (mode === "replace") {
        setPublications(finalPubs);
      } else {
        setPublications([...publications, ...finalPubs]);
      }

      showMessage(
        `${finalPubs.length} publicação(ões) ${
          mode === "replace" ? "carregadas" : "adicionadas"
        }`,
        "success",
      );
    } catch (error) {
      showMessage("Erro ao coletar publicações", "error");
    } finally {
      setScraping(false);
    }
  };

  // Salva alterações na planilha
  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/publications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publications, mode: "replace" }),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      showMessage("Publicações salvas com sucesso!", "success");
      setOriginalPublications(publications); // Atualiza o estado original após salvar
    } catch (error) {
      showMessage("Erro ao salvar publicações", "error");
    } finally {
      setSaving(false);
    }
  };

  // Remove publicação
  const handleDelete = (index: number) => {
    setPublications(publications.filter((_, i) => i !== index));
    showMessage("Publicação removida (salve para aplicar)", "success");
  };

  // Edita awards
  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(publications[index].awards);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updated = [...publications];
    updated[editingIndex].awards = editValue;
    setPublications(updated);
    setEditingIndex(null);
    showMessage("Award editado (salve para aplicar)", "success");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  // Exibe mensagem temporária
  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  // Confirma ação destrutiva
  const confirmScrape = (mode: "append" | "replace") => {
    if (mode === "replace" && publications.length > 0) {
      setConfirmAction(mode);
      setShowConfirm(true);
    } else {
      handleScrape(mode);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={1} c="var(--primary)" mb="xs">
            Editor de Publicações
          </Title>
          <Text c="dimmed">
            Colete dados via SerpAPI e gerencie publicações acadêmicas
          </Text>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <Alert
            color={messageType === "success" ? "green" : "red"}
            radius="lg"
          >
            {message}
          </Alert>
        )}

        {/* Configuração de scraping */}
        <Card withBorder padding="lg" shadow="xs" radius="lg">
          <Stack gap="md">
            <Title order={3} size="h5">
              Configuração de Coleta
            </Title>

            <Group grow>
              <TextInput
                label="ID do Perfil (Google Scholar)"
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                placeholder="mCaYwHAAAAAJ"
              />
              <TextInput
                label="Ano de Corte (a partir de)"
                type="number"
                value={yearCutoff}
                onChange={(e) =>
                  setYearCutoff(parseInt(e.target.value) || 2023)
                }
                placeholder="2023"
              />
            </Group>

            <Button
              style={{ width: "50%", margin: "0 auto" }}
              leftSection={
                scraping ? (
                  <Loader size="xs" color="var(--primary)" />
                ) : (
                  <IconDownload size={16} />
                )
              }
              onClick={() => confirmScrape("append")}
              disabled={scraping}
              color="var(--primary)"
            >
              Coletar e Adicionar
            </Button>

            <Button
              style={{ width: "50%", margin: "0 auto" }}
              leftSection={
                scraping ? (
                  <Loader size="xs" color="var(--primary)" />
                ) : (
                  <IconRefresh size={16} />
                )
              }
              onClick={() => confirmScrape("replace")}
              disabled={scraping}
              variant="outline"
              color="var(--primary)"
            >
              Coletar e Substituir
            </Button>
          </Stack>
        </Card>

        {/* Tabela de publicações */}
        <Card withBorder padding="lg" shadow="xs" radius="lg">
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3} size="h5">
                Publicações ({publications.length})
              </Title>
              <SaveButton
                onClick={handleSave}
                loading={saving}
                disabled={!hasChanges}
                text="Salvar Alterações"
              />
            </Group>

            {loading ? (
              <Group justify="center" py="xl">
                <Loader color="var(--primary)" />
              </Group>
            ) : publications.length === 0 ? (
              <Text ta="center" c="dimmed" py="xl">
                Nenhuma publicação encontrada. Use "Coletar" para buscar dados.
              </Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Título</Table.Th>
                    <Table.Th>Ano</Table.Th>
                    <Table.Th>Citações</Table.Th>
                    <Table.Th>Awards</Table.Th>
                    <Table.Th>Ações</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {publications.map((pub, index) => (
                    <Table.Tr key={index}>
                      <Table.Td style={{ maxWidth: 400 }}>
                        <Text size="sm" lineClamp={2}>
                          {pub.title}
                        </Text>
                      </Table.Td>
                      <Table.Td>{pub.year}</Table.Td>
                      <Table.Td>{pub.citation_number}</Table.Td>
                      <Table.Td>
                        {editingIndex === index ? (
                          <Group gap="xs">
                            <TextInput
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              size="xs"
                              style={{ flex: 1 }}
                            />
                            <ActionIcon
                              color="var(--primary)"
                              onClick={saveEdit}
                              size="sm"
                            >
                              <IconCheck size={14} />
                            </ActionIcon>
                            <ActionIcon
                              color="red"
                              onClick={cancelEdit}
                              size="sm"
                            >
                              <IconX size={14} />
                            </ActionIcon>
                          </Group>
                        ) : (
                          <Text size="sm">{pub.awards || "-"}</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ActionIcon
                            color="var(--primary)"
                            onClick={() => startEdit(index)}
                            disabled={editingIndex !== null}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            onClick={() => handleDelete(index)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Stack>
        </Card>
      </Stack>

      {/* Modal de confirmação */}
      <Modal
        opened={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirmar Substituição"
        style={{ color: "var(--primary)" }}
        radius="lg"
      >
        <Stack gap="md">
          <Group>
            <Text>
              Esta ação irá <strong>sobrescrever todas as publicações</strong>{" "}
              existentes.
            </Text>
          </Group>
          <Group justify="flex-end">
            <Button
              variant="outline"
              color="var(--primary)"
              onClick={() => setShowConfirm(false)}
            >
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={() => {
                setShowConfirm(false);
                handleScrape(confirmAction);
              }}
            >
              Confirmar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
