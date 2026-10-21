"use client";

import { useState } from "react";
import { Badge, Button, Card, Group, Loader, Text } from "@mantine/core";
import { IconCheck, IconUpload } from "@tabler/icons-react";

type ActionStatus = "idle" | "loading" | "success" | "error";

type ActionStatusCardProps = {
  name: string;
  description: string;
  icon: React.ReactNode;
  onAction: () => Promise<string>;
  idleLabel?: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  idleButtonLabel?: string;
  loadingButtonLabel?: string;
  idleButtonIcon?: React.ReactNode;
  successButtonIcon?: React.ReactNode;
};

const statusColor: Record<ActionStatus, string> = {
  idle: "gray",
  loading: "var(--primary)",
  success: "green",
  error: "red",
};

export default function ActionStatusCard({
  name,
  description,
  icon,
  onAction,
  idleLabel = "Pronto",
  loadingLabel = "Processando...",
  successLabel = "Sucesso",
  errorLabel = "Erro",
  idleButtonLabel = "Executar",
  loadingButtonLabel = "Processando...",
  idleButtonIcon = <IconUpload size={16} />,
  successButtonIcon = <IconCheck size={16} />,
}: ActionStatusCardProps) {
  const [status, setStatus] = useState<ActionStatus>("idle");
  const [message, setMessage] = useState("");

  const handleAction = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const resultMessage = await onAction();
      setStatus("success");
      setMessage(resultMessage);

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Falha ao executar a ação");
    }
  };

  return (
    <Card shadow="xs" padding="lg" radius="lg" withBorder>
      <Group justify="space-between" align="center">
        <Group>
          <div style={{ color: "var(--primary)", display: "flex", alignItems: "center" }}>
            {icon}
          </div>
          <div>
            <Group gap="xs" mb={4}>
              <Text fw={600} size="lg">
                {name}
              </Text>
              <Badge size="sm" color={statusColor[status]}>
                {{ idle: idleLabel, loading: loadingLabel, success: successLabel, error: errorLabel }[status]}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {description}
            </Text>
            {message && (
              <Text size="sm" c={status === "error" ? "red" : "var(--primary)"} mt="xs">
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
          onClick={handleAction}
        >
          {status === "loading" ? loadingButtonLabel : idleButtonLabel}
        </Button>
      </Group>
    </Card>
  );
}
