"use client";

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
  IconBrain,
  IconCode,
  IconUsers,
} from "@tabler/icons-react";
import footerData from "@/../public/json/footer.json";

export default function Footer() {
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
      <Container size="xl" py="xl">
        <Grid gutter="xl">
          {/* Section 1: Logos */}
          <Grid.Col span={{ base: 12, md: 3 }} visibleFrom="md">
            <Stack gap="xl" align="center" h="100%" justify="center">
              {/* AISE Logo */}
              <Image
                src={footerData.logos.aise}
                alt="AISE Logo"
                w={200}
                h="auto"
                fit="contain"
                style={{
                  borderRadius: "8px",
                }}
              />

              {/* PUC-Rio Logo */}
              <Image
                src={footerData.logos.puc}
                alt="PUC-Rio Logo"
                w={200}
                h="auto"
                fit="contain"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                }}
              />
            </Stack>
          </Grid.Col>

          {/* Section 2: Description & Stats */}
          <Grid.Col span={{ base: 12, sm: 6, md: 5.5 }}>
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
                <Flex align="center" gap="xs">
                  <IconBrain size={20} color="#52AFE1" />
                  <Stack gap={0}>
                    <Text size="sm" fw={600} c="gray.8">
                      {footerData.stats.projects}
                    </Text>
                    <Text size="xs" c="gray.6">
                      Projects
                    </Text>
                  </Stack>
                </Flex>
                <Flex align="center" gap="xs">
                  <IconUsers size={20} color="#52AFE1" />
                  <Stack gap={0}>
                    <Text size="sm" fw={600} c="gray.8">
                      {footerData.stats.members}
                    </Text>
                    <Text size="xs" c="gray.6">
                      Members
                    </Text>
                  </Stack>
                </Flex>
                <Flex align="center" gap="xs">
                  <IconCode size={20} color="#52AFE1" />
                  <Stack gap={0}>
                    <Text size="sm" fw={600} c="gray.8">
                      {footerData.stats.publications}
                    </Text>
                    <Text size="xs" c="gray.6">
                      Publications
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
                      </Text>
                    </Flex>
                    <Flex align="center" gap="xs">
                      <IconPhone size={16} color="#6b7280" />
                      <Anchor
                        c="gray.6"
                        td="none"
                        href={`tel:${footerData.contact.phone.replace(
                          /\D/g,
                          ""
                        )}`}
                        size="sm"
                      >
                        {footerData.contact.phone}
                      </Anchor>
                    </Flex>
                    <Flex align="center" gap="xs">
                      <IconMail size={16} color="#6b7280" />
                      <Anchor
                        c="#52AFE1"
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
