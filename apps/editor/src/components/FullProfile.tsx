"use client";

import React from "react";
import {
  Box,
  Button,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Paper,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconBulb,
  IconCode,
  IconBriefcase,
  IconCopy,
} from "@tabler/icons-react";
import type { TeamMemberData } from "../services/googleSheets";
import LinkGroup from "./main-app-components/LinkGroup";
import { BadgeBox } from "./main-app-components/BadgeBox";
import ImgboxImage from "./ImgboxImage";

interface FullProfileProps {
  member: TeamMemberData;
  imageWidth?: number;
}

export const FullProfile: React.FC<FullProfileProps> = ({
  member,
  imageWidth = 300,
}) => {
  const isMobile = useMediaQuery("(max-width: 62em)");
  const photoHeight = isMobile ? 280 : 360;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(member.email ?? "");
    } catch {
      // silencioso
    }
  };

  return (
    <Paper
      p={isMobile ? "lg" : "xl"}
      radius="lg"
      style={{
        background: "rgba(255, 255, 255, 0.98)",
      }}
    >
      <Group
        align="flex-start"
        gap={isMobile ? "lg" : "xl"}
        style={{ flexDirection: isMobile ? "column" : "row" }}
      >
        {/* Coluna da foto e contato */}
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: isMobile ? "100%" : imageWidth,
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          <Box
            style={{
              position: "relative",
              width: "100%",
              height: photoHeight,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <ImgboxImage
              src={member.imageUrl}
              alt={member.name}
              fill
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          </Box>

          {member.email && (
            <Button
              variant="light"
              color="var(--primary)"
              rightSection={<IconCopy size={20} />}
              onClick={handleCopyEmail}
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
          style={{ flex: 1, minWidth: 0 }}
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
                <LinkGroup
                  links={
                    Object.fromEntries(
                      Object.entries({
                        linkedin: member.socialLinks?.linkedin,
                        github: member.socialLinks?.github,
                        googleScholar: member.socialLinks?.googleScholar,
                        orcid: member.socialLinks?.orcid,
                        lattes: member.socialLinks?.lattes,
                        personalWebsite: member.socialLinks?.personalWebsite,
                      }).filter(([_, value]) => value !== undefined)
                    ) as Record<string, string>
                  }
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
          {member.researchInterests && member.researchInterests.length > 0 && (
            <BadgeBox
              title="Interesses de Pesquisa"
              icon={<IconBulb size={18} />}
              items={member.researchInterests}
            />
          )}

          {/* Tecnologias e knowledge (lado a lado no desktop) */}
          {(member.technologies?.length || member.knowledge?.length) && (
            <Group
              grow
              align="stretch"
              gap="md"
              style={{ flexDirection: isMobile ? "column" : "row" }}
            >
              {member.technologies && member.technologies.length > 0 && (
                <BadgeBox
                  title="Tecnologias"
                  icon={<IconCode size={18} />}
                  items={member.technologies}
                />
              )}

              {member.knowledge && member.knowledge.length > 0 && (
                <BadgeBox
                  title="Knowledge"
                  icon={<IconBriefcase size={18} />}
                  items={member.knowledge}
                />
              )}
            </Group>
          )}
        </Stack>
      </Group>
    </Paper>
  );
};

export default FullProfile;
