"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Title,
  Text,
  Button,
  Container,
  Stack,
  Alert,
} from "@mantine/core";
import { IconBrandGoogle, IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "@/components/AuthContext";

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Load Google Sign-In script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    setLoading(true);
    setError("");

    try {
      const success = await login(response.credential);

      if (success) {
        router.push("/");
      } else {
        setError(
          "Falha na autenticação. Por favor, verifique se seu email está autorizado.",
        );
      }
    } catch (err) {
      setError("Ocorreu um erro durante o login. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "var(--primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Container size="xs">
        <Paper
          shadow="xl"
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Stack gap="lg">
            <Box ta="center">
              <Title
                order={1}
                size="h2"
                style={{
                  background: "var(--primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 8,
                }}
              >
                AISE Web Editor
              </Title>
              <Text size="sm" c="dimmed">
                Entre com sua conta Google
              </Text>
            </Box>

            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                title="Falha no Login"
              >
                {error}
              </Alert>
            )}

            <Button
              leftSection={<IconBrandGoogle size={20} />}
              size="lg"
              fullWidth
              onClick={handleGoogleLogin}
              loading={loading}
              style={{
                background: "var(--primary)",
              }}
            >
              Entre com sua conta Google
            </Button>

            <Text size="xs" c="dimmed" ta="center">
              Apenas membros autorizados do AISE Lab podem acessar este editor.
              <br />
              Contate seu administrador se precisar de acesso.
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
