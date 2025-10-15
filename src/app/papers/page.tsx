"use client";

import {
  Container,
  Title,
  Text,
  Card,
  Badge,
  Group,
  Stack,
  Anchor,
  Box,
  Select,
  Pagination,
} from "@mantine/core";
import {
  IconExternalLink,
  IconQuote,
  IconFilter,
  IconFileText,
} from "@tabler/icons-react";
import paperData from "@/../public/json/paper-data.json";
import papersContent from "@/../public/json/papers-page-content.json";
import FlickeringGrid from "@/components/FlickeringGrid";
import PagesHeader from "@/components/PagesHeader";
import { useMediaQuery } from "@mantine/hooks";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

interface Paper {
  title: string;
  link: string;
  authors_list: string;
  publication_place: string;
  citation_number: number;
  year: string;
}

type SortOption =
  | "year-desc"
  | "year-asc"
  | "citations-desc"
  | "citations-asc"
  | "name-asc"
  | "name-desc";

export default function PapersPage() {
  const allPapers: Paper[] = paperData.paper_data;
  const isMobile = useMediaQuery("(max-width: 62em)");
  const [gridKey, setGridKey] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("year-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Re-renderiza o grid quando o componente monta
  useEffect(() => {
    const timer = setTimeout(() => setGridKey((prev) => prev + 1), 100);
    return () => clearTimeout(timer);
  }, []);

  // Re-renderiza o grid quando a tela muda de tamanho
  useEffect(() => {
    const handleResize = () => {
      setGridKey((prev) => prev + 1);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Re-renderiza o grid somente quando mudarmos entre a última página e uma página não-última (ou vice-versa).
  const prevIsLastRef = useRef<boolean | null>(null);

  // Ordena os papers baseado na opção selecionada
  const sortedPapers = useMemo(() => {
    const sorted = [...allPapers];

    switch (sortBy) {
      case "year-desc":
        return sorted.sort((a, b) => parseInt(b.year) - parseInt(a.year));
      case "year-asc":
        return sorted.sort((a, b) => parseInt(a.year) - parseInt(b.year));
      case "citations-desc":
        return sorted.sort((a, b) => b.citation_number - a.citation_number);
      case "citations-asc":
        return sorted.sort((a, b) => a.citation_number - b.citation_number);
      case "name-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [allPapers, sortBy]);

  // Calcula os papers da página atual
  const paginatedPapers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedPapers.slice(startIndex, endIndex);
  }, [sortedPapers, currentPage]);

  // Total de páginas
  const totalPages = Math.ceil(sortedPapers.length / itemsPerPage);

  // Re-renderiza o grid quando mudamos entre a última página e uma página não-última (ou vice-versa).
  useEffect(() => {
    const isLast = currentPage === totalPages;

    // Se for a primeira vez, só inicializa
    if (prevIsLastRef.current === null) {
      prevIsLastRef.current = isLast;
      return;
    }

    // Só dispara se mudou o estado de "é última página"
    if (prevIsLastRef.current !== isLast) {
      const timer = setTimeout(() => setGridKey((prev) => prev + 1), 60);
      prevIsLastRef.current = isLast;
      return () => clearTimeout(timer);
    }

    // Update o ref
    prevIsLastRef.current = isLast;
  }, [currentPage, totalPages]);

  // Reset para página 1 quando mudar a ordenação
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  return (
    <Box
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "var(--primary)",
        paddingTop: isMobile ? 80 : 100,
        paddingBottom: isMobile ? 60 : 80,
        overflow: "hidden",
      }}
    >
      {/* Fundo animado */}
      <FlickeringGrid
        key={gridKey}
        squareSize={8}
        gridGap={6}
        color="rgba(255, 255, 255, 1)"
        maxOpacity={0.35}
        flickerChance={0.005}
      />
      <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <PagesHeader
          icon={IconFileText}
          title={papersContent.hero.title}
          subtitle={papersContent.hero.subtitle}
          metrics={
            sortedPapers.length > 0
              ? [{ label: "Total Papers", value: sortedPapers.length }]
              : []
          }
        />

        {/* Compact filter (top-left) */}
        <Box
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: 18,
          }}
        >
          <Box
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              background: "rgba(255,255,255,0.95)",
              padding: 12,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <IconFilter size={24} color="var(--primary)" />
            <Select
              value={sortBy}
              onChange={(value) => setSortBy(value as SortOption)}
              data={papersContent.filter.sortOptions}
              style={{ width: isMobile ? 140 : 180 }}
              styles={{
                input: {
                  fontSize: isMobile ? 14 : 16,
                },
              }}
            />
          </Box>
        </Box>

        {/* Lista de Publicações */}
        <Stack gap="xl" mb={40}>
          {paginatedPapers.map((paper, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <Card
                shadow="sm"
                padding="xl"
                radius="md"
                withBorder
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  borderColor: "#e9ecef",
                }}
                className="paper-card"
              >
                <Stack gap="md">
                  {/* Título e ano */}
                  <Group justify="space-between" align="flex-start">
                    <Title
                      order={3}
                      style={{
                        flex: 1,
                        fontSize: "1.3rem",
                        fontWeight: 600,
                        lineHeight: 1.4,
                        color: "#2c3e50",
                      }}
                    >
                      {paper.title}
                    </Title>
                    <Badge
                      size="lg"
                      variant="light"
                      color="var(--primary)"
                      style={{ minWidth: "60px" }}
                    >
                      {paper.year}
                    </Badge>
                  </Group>

                  {/* Autores */}
                  <Text
                    size="sm"
                    c="dimmed"
                    style={{
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    {paper.authors_list}
                  </Text>

                  {/* Local de Publicação */}
                  <Text
                    size="sm"
                    style={{
                      color: "#495057",
                      lineHeight: 1.6,
                    }}
                  >
                    {paper.publication_place}
                  </Text>

                  {/* Footer: Citações e Link */}
                  <Group justify="space-between" mt="md">
                    <Group gap="xs">
                      <IconQuote size={20} color="var(--primary)" />
                      <Text
                        size="sm"
                        fw={600}
                        style={{ color: "var(--primary)" }}
                      >
                        {paper.citation_number}{" "}
                        {papersContent.paperCard.citationsLabel.toLowerCase()}
                      </Text>
                    </Group>

                    <Anchor
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Group gap="xs">
                        <Text
                          size="sm"
                          fw={600}
                          style={{ color: "var(--primary)" }}
                        >
                          {papersContent.paperCard.viewPaperButton}
                        </Text>
                        <IconExternalLink size={18} color="var(--primary)" />
                      </Group>
                    </Anchor>
                  </Group>
                </Stack>
              </Card>
            </motion.div>
          ))}
        </Stack>

        {/* Contagem de Resultados */}
        <Text size="md" c="white" mt={30} ta="center" fw={500}>
          {papersContent.resultsText.showing} {paginatedPapers.length}{" "}
          {papersContent.resultsText.of} {sortedPapers.length}{" "}
          {papersContent.resultsText.publications}
        </Text>

        {/* Paginação */}
        {totalPages > 1 && (
          <Group justify="center" mt={18}>
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
              size={isMobile ? "sm" : "md"}
              withEdges
            />
          </Group>
        )}

        {/* Custom Styles */}
        <style jsx>{`
          :global(.paper-card:hover) {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(82, 175, 225, 0.15) !important;
            border-color: var(--primary) !important;
          }
          /* Estilos globais para os controles de paginação */
          :global(.mantine-Pagination-control) {
            background-color: white !important;
            border-color: white !important;
            color: var(--primary) !important;
          }
          :global(.mantine-Pagination-control[data-active]) {
            background-color: white !important;
            border-color: var(--primary) !important;
            border-width: 1px !important;
            color: var(--primary) !important;
            font-weight: 700 !important;
          }
          :global(.mantine-Pagination-control:hover):not(
              :global([data-active])
            ) {
            background-color: rgba(255, 255, 255, 0.9) !important;
            border-color: white !important;
          }
          :global(.mantine-Pagination-control[data-disabled]) {
            background-color: rgba(255, 255, 255, 0.5) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            color: rgba(82, 175, 225, 0.5) !important;
          }
          /* Força os 3 pontinhos a ficarem brancos */
          :global(.mantine-Pagination-ellipsis),
          :global(.mantine-Pagination-dots),
          :global(.mantine-Pagination-control[data-type="dots"]),
          :global(
              .mantine-Pagination-control[aria-disabled][data-type="dots"]
            ) {
            color: #ffffff !important;
            background-color: transparent !important;
            border-color: transparent !important;
          }

          /* If ellipsis is rendered as a span inside a control */
          :global(.mantine-Pagination-control[data-type="dots"] span),
          :global(.mantine-Pagination-ellipsis span) {
            color: #ffffff !important;
          }
        `}</style>
      </Container>
    </Box>
  );
}
