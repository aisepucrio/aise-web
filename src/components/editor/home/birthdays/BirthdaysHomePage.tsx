"use client";

import { Container, Title, Text, Stack } from "@mantine/core";
import { RequireAdmin } from "@/components/editor/AuthContext";
import BirthdayDownloadCard from "./BirthdayDownloadCard";

export default function BirthdaysHomePage() {
  return (
    <RequireAdmin>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <div>
            <Title order={1} size="h1" mb="sm" style={{ color: "var(--primary)", fontWeight: 800 }}>
              Aniversários
            </Title>
            <Text size="lg" c="dimmed">
              Exporte os aniversários do time num arquivo de calendário.
            </Text>
          </div>

          <BirthdayDownloadCard />
        </Stack>
      </Container>
    </RequireAdmin>
  );
}
