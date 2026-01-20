"use client";

import React, { useState } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Button,
  Badge,
  Alert,
  Loader,
} from "@mantine/core";
import {
  IconUpload,
  IconAlertCircle,
  IconCheck,
  IconUsers,
  IconTool,
  IconBook,
  IconFlask,
} from "@tabler/icons-react";
import { convertImgboxUrls } from "@/lib/imgbox";
import { authFetchJson } from "@/lib/auth-fetch";
import { RequireAdmin } from "@/components/AuthContext";

type PublishStatus = "idle" | "loading" | "success" | "error";

type PublishSection = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  endpoint: string;
};

// Constrói URL completa para a API de publicação externa
export function buildPublishApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_PUBLISH_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_PUBLISH_API_URL not configured. ");
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export default function PublishHomePage() {
  const [statuses, setStatuses] = useState<Record<string, PublishStatus>>({
    team: "idle",
    researches: "idle",
    publications: "idle",
    tools: "idle",
  });

  const [messages, setMessages] = useState<Record<string, string>>({});

  // Seções disponíveis para publicação
  const sections: PublishSection[] = [
    {
      id: "team",
      name: "Team",
      description: "Publicar dados da equipe do laboratório",
      icon: <IconUsers size={24} />,
      endpoint: "/api/team",
    },
    {
      id: "researches",
      name: "Researches",
      description: "Publicar linhas de pesquisa do laboratório",
      icon: <IconFlask size={24} />,
      endpoint: "/api/researches",
    },
    {
      id: "publications",
      name: "Publications",
      description: "Publicar artigos e publicações científicas",
      icon: <IconBook size={24} />,
      endpoint: "/api/publications",
    },
    {
      id: "tools",
      name: "Tools",
      description: "Publicar ferramentas e projetos desenvolvidos",
      icon: <IconTool size={24} />,
      endpoint: "/api/tools",
    },
  ];

  /**
   * Publishes section data to external website
   * Uses admin authentication (no token prompt needed)
   */
  const handlePublish = async (section: PublishSection) => {
    setStatuses((prev) => ({ ...prev, [section.id]: "loading" }));
    setMessages((prev) => ({ ...prev, [section.id]: "" }));

    try {
      // Step 1: Read data from Google Sheets via local API
      // authFetchJson returns parsed JSON directly (throws on error)
      const response = await authFetchJson(section.endpoint, {
        method: "GET",
      });

      const dataArray = response[section.id];

      if (!dataArray || !Array.isArray(dataArray)) {
        throw new Error("Invalid data format received from server");
      }

      // Convert imgbox URLs before sending
      const convertedData = await convertImgboxUrls(response);

      // Step 2: Publish to external website via secure backend endpoint
      // authFetchJson returns parsed JSON directly (throws on error)
      const result = await authFetchJson("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: section.id,
          data: convertedData,
        }),
      });

      setStatuses((prev) => ({ ...prev, [section.id]: "success" }));
      setMessages((prev) => ({
        ...prev,
        [section.id]:
          result.message || `${dataArray.length} itens publicados com sucesso!`,
      }));

      // Clear status after 5 seconds
      setTimeout(() => {
        setStatuses((prev) => ({ ...prev, [section.id]: "idle" }));
        setMessages((prev) => ({ ...prev, [section.id]: "" }));
      }, 5000);
    } catch (error) {
      setStatuses((prev) => ({ ...prev, [section.id]: "error" }));
      setMessages((prev) => ({
        ...prev,
        [section.id]:
          error instanceof Error ? error.message : "Falha ao publicar os dados",
      }));
    }
  };

  /**
   * Retorna a cor do badge baseado no status
   */
  const getStatusColor = (status: PublishStatus): string => {
    switch (status) {
      case "loading":
        return "var(--primary) ";
      case "success":
        return "green";
      case "error":
        return "red";
      default:
        return "gray";
    }
  };

  /**
   * Retorna o texto do badge baseado no status
   */
  const getStatusText = (status: PublishStatus): string => {
    switch (status) {
      case "loading":
        return "Publicando...";
      case "success":
        return "Sucesso";
      case "error":
        return "Erro";
      default:
        return "Pronto";
    }
  };

  return (
    <RequireAdmin>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <div>
            <Title
              order={1}
              size="h1"
              mb="sm"
              style={{ color: "var(--primary)", fontWeight: 800 }}
            >
              Publicar Conteúdo
            </Title>
            <Text size="lg" c="dimmed">
              Publique os dados do Google Sheets diretamente no site. O servidor
              lerá a planilha e atualizará os arquivos JSON automaticamente.
            </Text>
          </div>

          {/* Info alert */}
          <Alert
            icon={<IconAlertCircle size={24} />}
            title="Como funciona"
            color="var(--primary)"
            variant="light"
            radius="lg"
          >
            <Text size="sm">
              1. Edite os dados no Google Sheets (abas: Team, Researches,
              Publications, Tools)
              <br />
              2. Clique em "Publicar" na seção desejada
              <br />
              3. O servidor lerá a planilha e atualizará os arquivos do site
              automaticamente
              <br />
              <strong>
                Nota: Apenas administradores podem publicar no site.
              </strong>
            </Text>
          </Alert>

          {/* Cards de publicação */}
          <Stack gap="md">
            {sections.map((section) => (
              <Card
                key={section.id}
                shadow="xs"
                padding="lg"
                radius="lg"
                withBorder
              >
                <Group justify="space-between" align="flex-start">
                  <Group>
                    <div
                      style={{
                        color: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {section.icon}
                    </div>
                    <div>
                      <Group gap="xs" mb={4}>
                        <Text fw={600} size="lg">
                          {section.name}
                        </Text>
                        <Badge
                          size="sm"
                          color={getStatusColor(statuses[section.id])}
                        >
                          {getStatusText(statuses[section.id])}
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed">
                        {section.description}
                      </Text>
                      {messages[section.id] && (
                        <Text
                          size="sm"
                          c={
                            statuses[section.id] === "error"
                              ? "red"
                              : "var(--primary)"
                          }
                          mt="xs"
                        >
                          {messages[section.id]}
                        </Text>
                      )}
                    </div>
                  </Group>

                  <Button
                    leftSection={
                      statuses[section.id] === "loading" ? (
                        <Loader size="xs" color="white" />
                      ) : statuses[section.id] === "success" ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconUpload size={16} />
                      )
                    }
                    color="var(--primary)"
                    disabled={statuses[section.id] === "loading"}
                    onClick={() => handlePublish(section)}
                  >
                    {statuses[section.id] === "loading"
                      ? "Publicando..."
                      : "Publicar"}
                  </Button>
                </Group>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </RequireAdmin>
  );
}
