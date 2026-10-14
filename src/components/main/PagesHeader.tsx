"use client";

import {
  Box,
  Text,
  Group,
  Card,
  Title,
  ThemeIcon,
  Divider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { Icon } from "@tabler/icons-react";

interface Metric {
  label: string;
  value: number;
}

interface PagesHeaderProps {
  icon: Icon;
  title: string;
  subtitle: string;
  metrics?: Metric[];
}

// Componente reutilizável para o cabeçalho das páginas
export default function PagesHeader({
  icon: IconComponent,
  title,
  subtitle,
  metrics = [],
}: PagesHeaderProps) {
  // Detecta breakpoint para comportamentos/responsividade
  const isMobile = useMediaQuery("(max-width: 62em)");

  return (
    // Animação de entrada (fade + slide)
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Container do header com margin-bottom responsiva */}
      <Box mb={isMobile ? 48 : 80}>
        {/* Linha com ícone + título */}
        <Group gap="xs" mb={isMobile ? 24 : 32}>
          <ThemeIcon
            size={isMobile ? 42 : 56}
            radius="lg"
            variant="white"
            color="var(--primary)"
            style={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" }}
          >
            {/* Ícone fornecido via prop */}
            <IconComponent size={isMobile ? 24 : 32} />
          </ThemeIcon>

          {/* Título principal */}
          <Title
            order={1}
            style={{
              color: "#ffffff",
              fontWeight: 800,
              fontSize: isMobile ? "38px" : "56px",
              lineHeight: 1,
              textShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            {title}
          </Title>
        </Group>

        {/* Linha com descrição e possíveis métricas */}
        <Box
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 16 : 24,
            alignItems: isMobile ? "flex-start" : "flex-end",
          }}
        >
          {/* Descrição/subtítulo da página */}
          <Text
            size={isMobile ? "md" : "lg"}
            c="white"
            maw={800}
            lh={1.6}
            style={{
              fontWeight: 400,
              flex: 1,
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            {subtitle}
          </Text>

          {/* Renderiza cards de métricas quando fornecidos */}
          {metrics.length > 0 && (
            <Group
              justify="flex-end"
              gap={isMobile ? "md" : "xl"}
              style={{
                marginLeft: isMobile ? 0 : "auto",
                marginTop: isMobile ? 20 : 0,
                flexShrink: 0,
              }}
            >
              {metrics.map((metric, index) => (
                <Card
                  key={index}
                  shadow="md"
                  radius="lg"
                  p={isMobile ? "md" : "lg"}
                  style={{ background: "rgba(255,255,255,0.95)" }}
                >
                  {/* Valor da métrica em destaque */}
                  <Text
                    fz={isMobile ? 32 : 42}
                    fw={900}
                    ta="center"
                    style={{ color: "var(--primary)", lineHeight: 1 }}
                  >
                    {metric.value}
                  </Text>

                  {/* Rótulo da métrica */}
                  <Text size="sm" ta="center" c="dimmed" fw={600} mt={4}>
                    {metric.label}
                  </Text>
                </Card>
              ))}
            </Group>
          )}
        </Box>

        {/* Linha divisória padrão usada pelas páginas */}
        <Divider my="md" />
      </Box>
    </motion.div>
  );
}
