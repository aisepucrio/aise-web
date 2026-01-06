"use client";

import React from "react";
import Image from "next/image";
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
import {
  IconBulb,
  IconCopy,
  IconCode,
  IconBrain,
  IconArrowLeft,
} from "@tabler/icons-react";
import { BadgeBox } from "@/components/BadgeBox";
import LinkGroup from "@/components/LinkGroup";
import teamMemberContent from "@/../public/json/team-member-page-content.json";
import { TeamMember } from "./membertype";

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
        <Paper
          shadow="xl"
          p={isMobile ? "lg" : "xl"}
          mb={isMobile ? 24 : 32}
          style={publicationstyle}
        >
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
                <img
                  src={member.imageUrl}
                  alt={member.name}
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
            <Stack
              gap="md"
              align={isMobile ? "center" : "stretch"}
              style={{ flex: 1 }}
            >
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "center" : "center",
                        justifyContent: isMobile ? "center" : "flex-start",
                        gap: 12,
                      }}
                    >
                      <Title
                        order={1}
                        size={isMobile ? "h2" : "h1"}
                        mb="xs"
                        style={{
                          color: "var(--primary)",
                          textAlign: isMobile ? "center" : undefined,
                          margin: 0,
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
                          padding: isMobile ? "10px 16px" : "12px 20px",
                          marginLeft: isMobile ? 0 : 6,
                          marginBottom: isMobile ? 16 : 0,
                          alignSelf: isMobile ? "center" : undefined,
                        }}
                      >
                        {member.position}{" "}
                        {member.university && `- ${member.university}`}
                      </Badge>
                    </div>
                  </div>

                  <div style={{ flex: "0 0 auto" }}>
                    <SocialLinks
                      links={member.socialLinks}
                      isMobile={isMobile}
                      align={isMobile ? "center" : "right"}
                    />
                  </div>
                </div>
              </Box>

              {/* Descrição curta */}
              <Text
                size={isMobile ? "md" : "lg"}
                c="dimmed"
                lh={1.6}
                style={{ textAlign: isMobile ? "center" : undefined }}
              >
                {member.description}
              </Text>

              {/* Interesses de pesquisa (se houver) */}
              {member.researchInterests?.length ? (
                <BadgeBox
                  title={teamMemberContent.researchInterestsTitle}
                  icon={<IconBulb size={18} />}
                  items={member.researchInterests}
                />
              ) : null}

              {/* Tecnologias e knowledge (lado a lado no desktop) */}
              {(member.technologies?.length || member.knowledge?.length) && (
                <Group
                  grow
                  align="stretch"
                  gap="md"
                  style={{ flexDirection: "row" }}
                >
                  {member.technologies?.length ? (
                    <BadgeBox
                      title={teamMemberContent.technologiesTitle}
                      icon={<IconCode size={18} />}
                      items={member.technologies}
                    />
                  ) : null}

                  {member.knowledge?.length ? (
                    <BadgeBox
                      title={teamMemberContent.knowledgeTitle}
                      icon={<IconBrain size={18} />}
                      items={member.knowledge}
                    />
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
