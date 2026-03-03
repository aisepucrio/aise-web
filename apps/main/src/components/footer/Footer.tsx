"use client";

import { useEffect, useState } from "react";
import {
  Group,
  Text,
  Stack,
  Image,
  Anchor,
  Container,
  Grid,
  Divider,
  ActionIcon,
  Box,
  Flex,
  Paper,
} from "@mantine/core";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconArrowUp,
  IconTool,
  IconUsers,
  IconFlask,
  IconFileText,
} from "@tabler/icons-react";
import footerData from "@/../public/json/footer.json";

export default function Footer() {
  const [teamCount, setTeamCount] = useState(0);
  const [publicationsCount, setPublicationsCount] = useState(0);
  const [toolsCount, setToolsCount] = useState(0);
  const [researchCount, setResearchCount] = useState(0);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => setTeamCount(data.team?.filter(Boolean).length || 0))
      .catch(() => setTeamCount(0));

    fetch("/api/publications")
      .then((res) => res.json())
      .then((data) =>
        setPublicationsCount(data.publications?.filter(Boolean).length || 0),
      )
      .catch(() => setPublicationsCount(0));

    fetch("/api/researches")
      .then((res) => res.json())
      .then((data) =>
        setResearchCount(data.researches?.filter(Boolean).length || 0),
      )
      .catch(() => setResearchCount(0));

    fetch("/api/tools")
      .then((res) => res.json())
      .then((data) => setToolsCount(data.tools?.filter(Boolean).length || 0))
      .catch(() => setToolsCount(0));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      style={{
        backgroundColor: "white",
        color: "#374151",
        marginTop: "auto",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <Container px="xl" py="xl" style={{ maxHeight: 9999, maxWidth: 9999 }}>
        <Grid gutter="xl">
          {/* Section 1: Logos */}
          <Grid.Col span={{ base: 12, md: 3 }} visibleFrom="md">
            <Stack gap="xl" align="center" h="100%" justify="center">
              {/* AISE Logo */}
              <img
                src={footerData.logos.aise}
                alt="AISE Logo"
                width={200}
                height="auto"
                style={{ objectFit: "contain" }}
              />

              {/* PUC-Rio Logo */}
              <img
                src={footerData.logos.puc}
                alt="PUC-Rio Logo"
                width={200}
                height="auto"
                style={{ objectFit: "contain", backgroundColor: "transparent" }}
              />
            </Stack>
          </Grid.Col>

          {/* Section 2: Description & Stats */}
          <Grid.Col span={{ base: 12, md: 5.5 }}>
            <Stack gap="lg" h="100%" justify="center">
              {/* Description */}
              <Stack gap="md">
                <Text size="lg" fw={600} c="gray.8">
                  {footerData.content.title}
                </Text>
                <Text size="sm" c="gray.6" lh={1.6}>
                  {footerData.content.description}
                </Text>
              </Stack>

              {/* Quick Stats */}
              <Group gap="xl">
                <Flex align="center" gap={"xs"}>
                  <IconUsers size={20} color="var(--primary)" />
                  <Stack gap={0}>
                    <Text size="sm" fw={600} c="gray.8">
                      {teamCount > 0
                        ? teamCount
                        : footerData.statsPlaceholder.members}
                    </Text>
                    <Text size="xs" c="gray.6">
                      Members
                    </Text>
                  </Stack>
                </Flex>

                <Flex align="center" gap={"xs"}>
                  <IconFlask size={20} color="var(--primary)" />
                  <Stack gap={0}>
                    <Text size="sm" fw={600} c="gray.8">
                      {researchCount > 0
                        ? researchCount
                        : footerData.statsPlaceholder.research}
                    </Text>
                    <Text size="xs" c="gray.6">
                      Research
                    </Text>
                  </Stack>
                </Flex>

                <Flex align="center" gap={"xs"}>
                  <IconFileText size={20} color="var(--primary)" />
                  <Stack gap={0}>
                    <Text size="sm" fw={600} c="gray.8">
                      {publicationsCount > 0
                        ? publicationsCount
                        : footerData.statsPlaceholder.publications}
                    </Text>
                    <Text size="xs" c="gray.6">
                      Publications
                    </Text>
                  </Stack>
                </Flex>

                <Flex align="center" gap={"xs"}>
                  <IconTool size={20} color="var(--primary)" />
                  <Stack gap={0}>
                    <Text size="sm" fw={600} c="gray.8">
                      {toolsCount > 0
                        ? toolsCount
                        : footerData.statsPlaceholder.tools}
                    </Text>
                    <Text size="xs" c="gray.6">
                      Tools
                    </Text>
                  </Stack>
                </Flex>
              </Group>
            </Stack>
          </Grid.Col>

          {/* Section 3: Contact & Location */}
          <Grid.Col span={{ base: 12, md: 3.5 }}>
            <Stack gap="md" h="100%" justify="center" align="center">
              <Paper
                p="lg"
                radius="md"
                withBorder
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor: "#f9fafb",
                  width: "100%",
                }}
              >
                <Stack gap="md">
                  <Text fw={600} size="md" c="gray.8" ta="center">
                    Contact & Location
                  </Text>
                  <Stack gap="sm">
                    <Flex align="flex-start" gap="xs">
                      <IconMapPin
                        size={16}
                        color="#6b7280"
                        style={{ marginTop: 2, flexShrink: 0 }}
                      />
                      <Text size="sm" c="gray.6" lh={1.4}>
                        {footerData.contact.address.street}
                        <br />
                        {footerData.contact.address.neighborhood}
                        <br />
                        {footerData.contact.address.zipCode}
                        <br />
                        {footerData.contact.address.floor}
                      </Text>
                    </Flex>

                    <Flex align="center" gap="xs">
                      <IconMail size={16} color="#6b7280" />
                      <Anchor
                        c="var(--primary)"
                        td="none"
                        href={`mailto:${footerData.contact.email}`}
                        size="sm"
                        fw={500}
                      >
                        {footerData.contact.email}
                      </Anchor>
                    </Flex>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="xl" color="gray.3" />

        {/* Rodapé inferior */}
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: "column", sm: "row" }}
          gap="md"
        >
          <Text size="sm" c="gray.6" ta={{ base: "center", sm: "left" }}>
            © {new Date().getFullYear()} {footerData.footer.copyright}
          </Text>
          <ActionIcon
            variant="subtle"
            size="sm"
            c="gray.6"
            onClick={scrollToTop}
            aria-label="Back to top"
            style={{
              backgroundColor: "#f3f4f6",
              "&:hover": { backgroundColor: "#e5e7eb" },
            }}
          >
            <IconArrowUp size={16} />
          </ActionIcon>
        </Flex>
      </Container>
    </Box>
  );
}
