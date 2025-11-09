"use client";

import {
  Container,
  Text,
  Group,
  Stack,
  Box,
  Select,
  Pagination,
  TextInput,
} from "@mantine/core";
import { IconFilter, IconFileText, IconSearch } from "@tabler/icons-react";
import paperData from "@/../public/json/data/paper-data.json";
import papersContent from "@/../public/json/papers-page-content.json";
import FlickeringGrid from "@/components/FlickeringGrid";
import PagesHeader from "@/components/PagesHeader";
import { useMediaQuery } from "@mantine/hooks";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import PaperCard from "@/components/PaperCard";

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
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Re-renderiza o grid quando o componente monta
  useEffect(() => {
    const timer = setTimeout(() => setGridKey((prev) => prev + 1), 100);
    return () => clearTimeout(timer);
  }, []);

  // Re-renderiza o grid quando a tela muda de tamanho
  useEffect(() => {
    const handleResize = () => setGridKey((prev) => prev + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ref para armazenar o número anterior de papers exibidos
  const prevDisplayedCountRef = useRef<number | null>(null);

  // Total de papers (sempre o total original, não filtrado)
  const totalPapersCount = allPapers.length;

  // Filtra e ordena os papers baseado na busca e opção selecionada
  const sortedPapers = useMemo(() => {
    // Primeiro filtra pela busca
    let filtered = [...allPapers];
    if (searchQuery.trim()) {
      filtered = filtered.filter((paper) =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Depois ordena
    switch (sortBy) {
      case "year-desc":
        return filtered.sort((a, b) => parseInt(b.year) - parseInt(a.year));
      case "year-asc":
        return filtered.sort((a, b) => parseInt(a.year) - parseInt(b.year));
      case "citations-desc":
        return filtered.sort((a, b) => b.citation_number - a.citation_number);
      case "citations-asc":
        return filtered.sort((a, b) => a.citation_number - b.citation_number);
      case "name-asc":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return filtered;
    }
  }, [allPapers, sortBy, searchQuery]);

  // Calcula os papers da página atual
  const paginatedPapers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedPapers.slice(startIndex, endIndex);
  }, [sortedPapers, currentPage]);

  // Total de páginas
  const totalPages = Math.ceil(sortedPapers.length / itemsPerPage);

  // Re-renderiza o grid quando o número de papers exibidos na página mudar
  useEffect(() => {
    const currentDisplayedCount = paginatedPapers.length;

    // Se for a primeira vez, só inicializa
    if (prevDisplayedCountRef.current === null) {
      prevDisplayedCountRef.current = currentDisplayedCount;
      return;
    }

    // Só dispara se mudou o número de papers exibidos
    if (prevDisplayedCountRef.current !== currentDisplayedCount) {
      const timer = setTimeout(() => setGridKey((prev) => prev + 1), 60);
      prevDisplayedCountRef.current = currentDisplayedCount;
      return () => clearTimeout(timer);
    }

    // Update o ref
    prevDisplayedCountRef.current = currentDisplayedCount;
  }, [paginatedPapers.length]);

  // Reset para página 1 quando mudar a ordenação ou busca
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, searchQuery]);

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
        <PagesHeader
          icon={IconFileText}
          title={papersContent.hero.title}
          subtitle={papersContent.hero.subtitle}
          metrics={
            totalPapersCount > 0
              ? [
                  {
                    label: papersContent?.stats?.totalLabel,
                    value: totalPapersCount,
                  },
                ]
              : []
          }
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Filtro e Busca */}
          <Box
            style={{
              display: "flex",
              justifyContent: isMobile ? "center" : "space-between",
              alignItems: "center",
              marginBottom: 18,
              gap: 16,
            }}
          >
            {/* Filtro */}
            <Box
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                background: "rgba(255, 255, 255, 1)",
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
                styles={{ input: { fontSize: isMobile ? 14 : 16 } }}
              />
            </Box>

            {/* Barra de Busca (escondida no mobile) */}
            {!isMobile && (
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
                <IconSearch size={24} color="var(--primary)" />
                <TextInput
                  placeholder={papersContent?.searchPlaceholder}
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.currentTarget.value)
                  }
                  style={{ width: 300 }}
                  styles={{
                    input: {
                      fontSize: 16,
                      border: "none",
                      backgroundColor: "transparent",
                      padding: 0,
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </motion.div>

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
              <PaperCard
                title={paper.title}
                link={paper.link}
                authors_list={paper.authors_list}
                publication_place={paper.publication_place}
                citation_number={paper.citation_number}
                year={paper.year}
                index={index}
                viewLabel={papersContent.paperCard.viewPaperButton}
              />
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
