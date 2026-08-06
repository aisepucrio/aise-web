"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Title,
  Text,
  Container,
  Stack,
  Alert,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
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
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleCredentialResponse = async (response: any) => {
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
    } catch {
      setError("Ocorreu um erro durante o login. Por favor, tente novamente.");
    }
  };

  // Render Google's user-initiated button. Calling prompt() from our custom
  // button is unreliable in Safari/macOS.
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width: googleButtonRef.current.offsetWidth || 360,
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

            <Box ref={googleButtonRef} style={{ minHeight: 40, width: "100%" }} />

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
