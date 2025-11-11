"use client";

import React from "react";
import {
  Container,
  Box,
  Text,
  Paper,
  Group,
  Badge,
  Stack,
  Button,
  Title,
} from "@mantine/core";
import { motion } from "framer-motion";
import ImgboxImage from "@/components/ImgboxImage";
import {
  IconBulb,
  IconCopy,
  IconCode,
  IconBriefcase,
  IconArrowLeft,
} from "@tabler/icons-react";
import { BadgeBox } from "@/components/BadgeBox";
import LinkGroup from "@/components/LinkGroup";
import teamMemberContent from "@/../public/json/team-member-page-content.json";

// --------------------------------------------------
// Tipos e helpers locais (simples e auto-explicativos)
// --------------------------------------------------

// Tipo local (estruturalmente compatível com page.tsx)
export type TeamMember = {
  name: string;
  position: string;
  imageUrl: string;
  description: string;
  bio?: string;
  email?: string;
  researchInterests?: string[];
  technologies?: string[];
  expertise?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    googleScholar?: string;
    orcid?: string;
    lattes?: string;
    personalWebsite?: string;
  };
};

// --- Helper: renderiza links sociais/academicos ---
const SocialLinks = ({
  links,
  isMobile,
  align,
}: {
  links?: TeamMember["socialLinks"];
  isMobile: boolean;
  align?: "left" | "center" | "right";
}) => {
  if (!links) return null;
  return <LinkGroup links={links} isMobile={isMobile} align={align} />;
};

// --------------------------------------------------
// Componente principal: TeamMemberProfile
// Recebe o membro, flag de mobile e callback onBack
// --------------------------------------------------
export default function TeamMemberProfile({
  member,
  isMobile,
  onBack,
}: {
  member: TeamMember;
  isMobile: boolean;
  onBack: () => void;
}) {
  const publicationstyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(10px)",
    borderRadius: 24,
  };

  return (
    <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
      {/* --- Linha superior: botão de voltar --- */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          leftSection={<IconArrowLeft size={20} />}
          variant="white"
          color="var(--primary)"
          mb={isMobile ? 20 : 32}
          onClick={onBack}
        >
          Back to Team
        </Button>
      </motion.div>

      {/* --- Cartão principal: foto à esquerda, conteúdo à direita --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Paper shadow="xl" p={isMobile ? "lg" : "xl"} mb={isMobile ? 24 : 32} style={publicationstyle}>
          <Group
            align="flex-start"
            gap={isMobile ? "lg" : "xl"}
            style={{ flexDirection: isMobile ? "column" : "row" }}
          >
            {/* Coluna da foto e contato (esquerda no desktop) */}
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                width: isMobile ? "100%" : 300,
                flexShrink: 0,
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  position: "relative",
                  width: "100%",
                  height: isMobile ? 280 : 360,
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <ImgboxImage
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </Box>

              {/* Botão de e-mail: copia para a área de transferência */}
              {member.email && (
                <Button
                  variant="light"
                  color="var(--primary)"
                  rightSection={<IconCopy size={20} />}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(member.email!);
                    } catch {}
                  }}
                  fullWidth
                  style={{ textTransform: "none", fontWeight: 600 }}
                >
                  {member.email}
                </Button>
              )}
            </Box>

            {/* Coluna de conteúdo: nome, posição, descrições e badges */}
            <Stack gap="md" align={isMobile ? "center" : "stretch"} style={{ flex: 1 }}>
              <Box>
                <div
                  style={{
                    display: "flex",
                    alignItems: isMobile ? "center" : "start",
                    justifyContent: isMobile ? "center" : "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      flex: isMobile ? "none" : "1 1 auto",
                      minWidth: 0,
                      textAlign: isMobile ? "center" : undefined,
                    }}
                  >
                    <Title
                      order={1}
                      size={isMobile ? "h2" : "h1"}
                      mb="xs"
                      style={{
                        color: "var(--primary)",
                        textAlign: isMobile ? "center" : undefined,
                      }}
                    >
                      {member.name}
                    </Title>

                    <Badge
                      size={isMobile ? "lg" : "xl"}
                      variant="light"
                      color="var(--primary)"
                      style={{
                        fontSize: isMobile ? "0.9rem" : "1rem",
                        fontWeight: 600,
                        padding: isMobile ? "12px 20px" : "14px 24px",
                      }}
                    >
                      {member.position}
                    </Badge>
                  </div>

                  <div style={{ flex: "0 0 auto" }}>
                    <SocialLinks links={member.socialLinks} isMobile={isMobile} align={isMobile ? "center" : "right"} />
                  </div>
                </div>
              </Box>

              {/* Descrição curta */}
              <Text size={isMobile ? "md" : "lg"} c="dimmed" lh={1.6} style={{ textAlign: isMobile ? "center" : undefined }}>
                {member.description}
              </Text>

              {/* Interesses de pesquisa (se houver) */}
              {member.researchInterests?.length ? (
                <BadgeBox title={teamMemberContent.researchInterestsTitle} icon={<IconBulb size={18} />} items={member.researchInterests} />
              ) : null}

              {/* Tecnologias e expertise (lado a lado no desktop) */}
              {(member.technologies?.length || member.expertise?.length) && (
                <Group grow align="stretch" gap="md" style={{ flexDirection: isMobile ? "column" : "row" }}>
                  {member.technologies?.length ? (
                    <BadgeBox title={teamMemberContent.technologiesTitle} icon={<IconCode size={18} />} items={member.technologies} />
                  ) : null}

                  {member.expertise?.length ? (
                    <BadgeBox title={teamMemberContent.expertiseTitle} icon={<IconBriefcase size={18} />} items={member.expertise} />
                  ) : null}
                </Group>
              )}
            </Stack>
          </Group>
        </Paper>
      </motion.div>
    </Container>
  );
}
