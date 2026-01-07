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
  MantineProvider,
} from "@mantine/core";
import { motion } from "framer-motion";
import { IconBulb, IconCopy, IconBrain, IconCode } from "@tabler/icons-react";
import { BadgeBox } from "./BadgeBox";
import LinkGroup from "./LinkGroup";
import { useMediaQuery } from "@mantine/hooks";

export type TeamMember = {
  name: string;
  position?: string;
  imageUrl: string;
  description?: string;
  university?: string;
  bio?: string;
  email?: string;
  researchInterests?: string[];
  technologies?: string[];
  knowledge?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    googleScholar?: string;
    orcid?: string;
    lattes?: string;
    personalWebsite?: string;
  };
};

export type TeamMemberProfileProps = {
  member: TeamMember;
};

export default function TeamMemberProfile({ member }: TeamMemberProfileProps) {
  // Use member.* directly to avoid creating a separate local const

  const publicationStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(10px)",
    borderRadius: 24,
  };

  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    <MantineProvider>
      <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Paper
            shadow="xl"
            p={isMobile ? "lg" : "xl"}
            mb={isMobile ? 24 : 32}
            style={publicationStyle}
          >
            <Group
              align="flex-start"
              gap={isMobile ? "lg" : "xl"}
              style={{ flexDirection: isMobile ? "column" : "row" }}
            >
              {/* Photo and contact column */}
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
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top",
                    }}
                  />
                </Box>

                {member.email && (
                  <Button
                    variant="light"
                    color="var(--primary)"
                    rightSection={<IconCopy size={20} />}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          member.email as string
                        );
                      } catch {}
                    }}
                    fullWidth
                    style={{ textTransform: "none", fontWeight: 600 }}
                  >
                    {member.email}
                  </Button>
                )}
              </Box>

              {/* Content column: name, position, description, badges */}
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
                          alignItems: "center",
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
                      <LinkGroup
                        links={member.socialLinks ?? {}}
                        isMobile={isMobile}
                        align={isMobile ? "center" : "right"}
                      />
                    </div>
                  </div>
                </Box>

                <Text
                  size={isMobile ? "md" : "lg"}
                  c="dimmed"
                  lh={1.6}
                  style={{ textAlign: isMobile ? "center" : undefined }}
                >
                  {member.description}
                </Text>

                {member.researchInterests?.length ? (
                  <BadgeBox
                    title="Research Interests"
                    icon={<IconBulb size={18} />}
                    items={member.researchInterests}
                  />
                ) : null}

                {(member.technologies?.length || member.knowledge?.length) && (
                  <Group
                    grow
                    align="stretch"
                    gap="md"
                    style={{ flexDirection: "row" }}
                  >
                    {member.technologies?.length ? (
                      <BadgeBox
                        title="Technologies"
                        icon={<IconCode size={18} />}
                        items={member.technologies}
                      />
                    ) : null}
                    {member.knowledge?.length ? (
                      <BadgeBox
                        title="Knowledge"
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
    </MantineProvider>
  );
}

export { TeamMemberProfile };
