"use client";

import { useState } from "react";
import { Badge, Button, Card, Group, Loader, Text } from "@mantine/core";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { authFetchJson } from "@/lib/auth-fetch";

type PublishStatus = "idle" | "loading" | "success" | "error";

type PublishSectionCardProps = {
  name: string;
  description: string;
  icon: React.ReactNode;
  onAction?: () => Promise<string>;
  dataKey?: string;
  endpoint?: string;
  idleLabel?: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  idleButtonLabel?: string;
  loadingButtonLabel?: string;
  idleButtonIcon?: React.ReactNode;
  successButtonIcon?: React.ReactNode;
};

const statusColor: Record<PublishStatus, string> = {
  idle: "gray",
  loading: "var(--primary)",
  success: "green",
  error: "red",
};

export default function PublishSectionCard({
  name,
  description,
  icon,
  onAction,
  dataKey,
  endpoint,
  idleLabel = "Pronto",
  loadingLabel = "Publicando...",
  successLabel = "Sucesso",
  errorLabel = "Erro",
  idleButtonLabel = "Publicar",
  loadingButtonLabel = "Publicando...",
  idleButtonIcon = <IconUpload size={16} />,
  successButtonIcon = <IconCheck size={16} />,
}: PublishSectionCardProps) {
  const [status, setStatus] = useState<PublishStatus>("idle");
  const [message, setMessage] = useState("");

  const runDefaultPublish = async () => {
    if (!endpoint || !dataKey) {
      throw new Error("Missing publish configuration");
    }

    const response = await authFetchJson(endpoint, { method: "GET" });
    const data = response[dataKey];

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format received from server");
    }

    const result = await authFetchJson("/api/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        section: dataKey,
        data: response,
      }),
    });

    return result.message || `${data.length} itens publicados com sucesso!`;
  };

  const handlePublish = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const resultMessage = onAction
        ? await onAction()
        : await runDefaultPublish();
      setStatus("success");
      setMessage(resultMessage);

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Falha ao publicar os dados",
      );
    }
  };

  return (
    <Card shadow="xs" padding="lg" radius="lg" withBorder>
      <Group justify="space-between" align="center">
        <Group>
          <div
            style={{
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </div>
          <div>
            <Group gap="xs" mb={4}>
              <Text fw={600} size="lg">
                {name}
              </Text>
              <Badge size="sm" color={statusColor[status]}>
                {{
                  idle: idleLabel,
                  loading: loadingLabel,
                  success: successLabel,
                  error: errorLabel,
                }[status]}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {description}
            </Text>
            {message && (
              <Text
                size="sm"
                c={status === "error" ? "red" : "var(--primary)"}
                mt="xs"
              >
                {message}
              </Text>
            )}
          </div>
        </Group>

        <Button
          leftSection={
            status === "loading" ? (
              <Loader size="xs" color="white" />
            ) : status === "success" ? (
              successButtonIcon
            ) : (
              idleButtonIcon
            )
          }
          color="var(--primary)"
          disabled={status === "loading"}
          onClick={handlePublish}
        >
          {status === "loading" ? loadingButtonLabel : idleButtonLabel}
        </Button>
      </Group>
    </Card>
  );
}
