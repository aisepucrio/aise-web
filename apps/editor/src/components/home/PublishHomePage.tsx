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
import { buildLocalApiUrl, buildPublishApiUrl } from "@/lib/api";
import { convertImgboxUrls } from "@/lib/imgbox";

type PublishStatus = "idle" | "loading" | "success" | "error";

type PublishSection = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  endpoint: string;
};

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
   * Publica dados de uma seção específica
   * Lê o token do prompt para segurança
   */
  const handlePublish = async (section: PublishSection) => {
    // Solicita o token do usuário
    const token = prompt(`Digite o ADMIN_TOKEN para publicar ${section.name}:`);

    if (!token) {
      alert("Token não fornecido. Operação cancelada.");
      return;
    }

    setStatuses((prev) => ({ ...prev, [section.id]: "loading" }));
    setMessages((prev) => ({ ...prev, [section.id]: "" }));

    try {
      // Passo 1: Lê os dados do Google Sheets via API local (GET)
      const getUrl = buildLocalApiUrl(section.endpoint);
      const getResponse = await fetch(getUrl, {
        method: "GET",
      });

      if (!getResponse.ok) {
        const error = await getResponse.json();
        throw new Error(error.error || "Erro ao ler dados do Google Sheets");
      }

      const response = await getResponse.json();

      // Extrai o array de dados (team, tools ou publications)
      const dataArray = response[section.id];

      if (!dataArray || !Array.isArray(dataArray)) {
        throw new Error("Formato de dados inválido recebido do servidor");
      }

      // Converte todas as URLs do imgbox antes de enviar
      const convertedData = await convertImgboxUrls(response);

      // Passo 2: Envia os dados via POST para o servidor externo (mantém estrutura envelopada)
      const postUrl = buildPublishApiUrl(section.endpoint);
      const postResponse = await fetch(postUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(convertedData), // Envia com URLs convertidas
      });

      const result = await postResponse.json();

      if (!postResponse.ok) {
        throw new Error(result.error || "Erro ao publicar dados");
      }

      setStatuses((prev) => ({ ...prev, [section.id]: "success" }));
      setMessages((prev) => ({
        ...prev,
        [section.id]:
          result.message || `${dataArray.length} itens publicados com sucesso!`,
      }));

      // Limpa status após 5 segundos
      setTimeout(() => {
        setStatuses((prev) => ({ ...prev, [section.id]: "idle" }));
        setMessages((prev) => ({ ...prev, [section.id]: "" }));
      }, 5000);
    } catch (error) {
      setStatuses((prev) => ({ ...prev, [section.id]: "error" }));
      setMessages((prev) => ({
        ...prev,
        [section.id]:
          error instanceof Error ? error.message : "Erro ao publicar dados",
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
            Publique os dados do Google Sheets diretamente para o site. O
            servidor lerá a planilha e atualizará os arquivos JSON
            automaticamente.
          </Text>
        </div>

        {/* Alerta informativo */}
        <Alert
          icon={<IconAlertCircle size={24} />}
          title="Como funciona"
          color="var(--primary)"
          variant="light"
          radius="lg"
        >
          <Text size="sm">
            1. Edite os dados na planilha do Google Sheets (abas: Team,
            Researches, Publications, Tools)
            <br />
            2. Clique em "Publicar" na seção desejada
            <br />
            3. Digite o ADMIN_TOKEN quando solicitado
            <br />
            4. O servidor lerá a planilha e atualizará os arquivos do site
            original automaticamente
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
  );
}
