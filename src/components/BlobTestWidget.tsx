"use client";

import { useState, useEffect } from "react";
import { Box, Paper, Text, Button, Stack, Code, Group, Alert } from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

export default function BlobTestWidget() {
  const [writeResult, setWriteResult] = useState<any>(null);
  const [readResult, setReadResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Testa escrita automaticamente ao carregar
  useEffect(() => {
    testWrite();
  }, []);

  const testWrite = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/test/blob-write");
      const data = await res.json();
      setWriteResult(data);
      
      // Se escrita foi bem-sucedida, testa leitura
      if (data.success) {
        setTimeout(() => testRead(), 1000);
      }
    } catch (error: any) {
      setWriteResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testRead = async () => {
    try {
      const res = await fetch("/api/test/blob-read");
      const data = await res.json();
      setReadResult(data);
    } catch (error: any) {
      setReadResult({ success: false, error: error.message });
    }
  };

  return (
    <Paper 
      shadow="md" 
      p="md" 
      style={{ 
        position: "fixed", 
        bottom: 20, 
        right: 20, 
        maxWidth: 400,
        maxHeight: "80vh",
        overflow: "auto",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
    >
      <Stack gap="sm">
        <Text fw={700} size="lg">🧪 Teste do Blob Storage</Text>
        
        {/* Resultado da escrita */}
        <Box>
          <Text fw={600} size="sm" mb={4}>
            1. Escrita no Blob:
          </Text>
          {writeResult ? (
            <Alert 
              icon={writeResult.success ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
              color={writeResult.success ? "green" : "red"}
              variant="light"
            >
              {writeResult.success ? (
                <Stack gap={4}>
                  <Text size="xs">✅ Sucesso!</Text>
                  <Text size="xs">Dados: {JSON.stringify(writeResult.testData)}</Text>
                  <Code block style={{ fontSize: 10 }}>
                    {writeResult.blob?.url}
                  </Code>
                </Stack>
              ) : (
                <Stack gap={4}>
                  <Text size="xs">❌ Erro: {writeResult.error}</Text>
                  {writeResult.logs && (
                    <Code block style={{ fontSize: 9, maxHeight: 100, overflow: "auto" }}>
                      {writeResult.logs.join("\n")}
                    </Code>
                  )}
                </Stack>
              )}
            </Alert>
          ) : (
            <Text size="xs" c="dimmed">Carregando...</Text>
          )}
        </Box>

        {/* Resultado da leitura */}
        <Box>
          <Text fw={600} size="sm" mb={4}>
            2. Leitura do Blob:
          </Text>
          {readResult ? (
            <Alert 
              icon={readResult.success ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
              color={readResult.success ? "green" : "red"}
              variant="light"
            >
              {readResult.success ? (
                <Stack gap={4}>
                  <Text size="xs">✅ Lido com sucesso!</Text>
                  <Text size="xs">Mensagem: {readResult.data?.message}</Text>
                  <Text size="xs">Timestamp: {readResult.data?.timestamp}</Text>
                  <Text size="xs">Número: {readResult.data?.randomNumber}</Text>
                </Stack>
              ) : (
                <Stack gap={4}>
                  <Text size="xs">❌ Erro: {readResult.error || readResult.message}</Text>
                  {readResult.logs && (
                    <Code block style={{ fontSize: 9, maxHeight: 100, overflow: "auto" }}>
                      {readResult.logs.join("\n")}
                    </Code>
                  )}
                </Stack>
              )}
            </Alert>
          ) : (
            <Text size="xs" c="dimmed">Aguardando escrita...</Text>
          )}
        </Box>

        <Group gap="xs">
          <Button size="xs" onClick={testWrite} loading={loading}>
            🔄 Testar novamente
          </Button>
          {writeResult?.success && (
            <Button size="xs" variant="light" onClick={testRead}>
              📖 Ler novamente
            </Button>
          )}
        </Group>

        {writeResult && !writeResult.success && writeResult.env && (
          <Alert color="yellow" variant="light">
            <Text size="xs" fw={600}>Debug:</Text>
            <Code block style={{ fontSize: 9 }}>
              Token presente: {writeResult.env.hasToken ? "SIM" : "NÃO"}{"\n"}
              Token length: {writeResult.env.tokenLength}{"\n"}
              NODE_ENV: {writeResult.env.nodeEnv}{"\n"}
              VERCEL_ENV: {writeResult.env.vercelEnv}
            </Code>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
