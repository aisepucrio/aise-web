"use client";

import type { ReactNode } from "react";
import { Container, Title, Text, Stack, Alert } from "@mantine/core";
import {
  IconAlertCircle,
  IconUsers,
  IconTool,
  IconBook,
  IconFlask,
} from "@tabler/icons-react";
import { RequireAdmin } from "@/components/AuthContext";
import PublishSectionCard from "./PublishSectionCard";
import BirthdayDownloadCard from "./BirthdayDownloadCard";

type PublishSection = {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  endpoint: string;
};

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

export default function PublishHomePage() {
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
              <PublishSectionCard
                key={section.id}
                dataKey={section.id}
                name={section.name}
                description={section.description}
                endpoint={section.endpoint}
                icon={section.icon}
              />
            ))}
            <BirthdayDownloadCard />
          </Stack>
        </Stack>
      </Container>
    </RequireAdmin>
  );
}
