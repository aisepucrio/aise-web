"use client";

import { useState } from "react";
import { Box, Paper, Title, Text, Container, Center } from "@mantine/core";
import TabNavigation from "@/components/TabNavigation";
import TeamHomePage from "@/components/home/TeamHomePage";
import ResearchesHomePage from "@/components/home/ResearchesHomePage";
import PublicationsHomePage from "@/components/home/PublicationsHomePage";
import ToolsHomePage from "@/components/home/ToolsHomePage";
import PublishHomePage from "@/components/home/PublishHomePage";

export default function HomePage() {
  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState("team");

  // Função para renderizar o conteúdo baseado na aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case "team":
        return <TeamHomePage />;
      case "researches":
        return <ResearchesHomePage />;
      case "publications":
        return <PublicationsHomePage />;
      case "tools":
        return <ToolsHomePage />;
      case "publish":
        return <PublishHomePage />;
      default:
        return <TeamHomePage />;
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
      <Container size="md">
        <Paper
          shadow="xl"
          p="xl"
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header */}
          <Box ta="center" mb="lg">
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
              AISE Content Editor
            </Title>
            <Text size="sm" c="dimmed">
              Gerencie o conteúdo do website em tempo real
            </Text>
          </Box>

          {/* Navegação por abas */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Conteúdo da aba ativa */}
          <Box>{renderTabContent()}</Box>
        </Paper>

        {/* Footer */}
        <Center mt="xl">
          <Text size="xs" c="white" ta="center">
            © 2025 AISE Lab - Micro App de Edição de Conteúdo
          </Text>
        </Center>
      </Container>
    </Box>
  );
}
