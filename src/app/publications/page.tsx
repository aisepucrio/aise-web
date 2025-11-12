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
  Loader,
  Center,
} from "@mantine/core";
import { IconFilter, IconFileText, IconSearch } from "@tabler/icons-react";
import publicationsContent from "@/../public/json/publications-page-content.json";
import FlickeringGrid from "@/components/FlickeringGrid";
import PagesHeader from "@/components/PagesHeader";
import { useMediaQuery } from "@mantine/hooks";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import PublicationCard from "@/components/PublicationCard";

interface Publication {
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

export default function PublicationsPage() {
  const [allPublications, setAllPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 62em)");
  const [gridKey, setGridKey] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("year-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Busca publications da API
  useEffect(() => {
    fetch("/api/data/publications")
      .then((res) => res.json())
      .then((data) => {
        setAllPublications(data.publications || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading publications:", error);
        setIsLoading(false);
      });
  }, []);

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

  // Ref para armazenar o número anterior de publications exibidos
  const prevDisplayedCountRef = useRef<number | null>(null);

  // Total de publications (sempre o total original, não filtrado)
  const totalPublicationsCount = allPublications.length;

  // Filtra e ordena os publications baseado na busca e opção selecionada
  const sortedPublications = useMemo(() => {
    // Primeiro filtra pela busca
    let filtered = [...allPublications];
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
  }, [allPublications, sortBy, searchQuery]);

  // Calcula os publications da página atual
  const paginatedPublications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedPublications.slice(startIndex, endIndex);
  }, [sortedPublications, currentPage]);

  // Total de páginas
  const totalPages = Math.ceil(sortedPublications.length / itemsPerPage);

  // Re-renderiza o grid quando o número de publications exibidos na página mudar
  useEffect(() => {
    const currentDisplayedCount = paginatedPublications.length;

    // Se for a primeira vez, só inicializa
    if (prevDisplayedCountRef.current === null) {
      prevDisplayedCountRef.current = currentDisplayedCount;
      return;
    }

    // Só dispara se mudou o número de publications exibidos
    if (prevDisplayedCountRef.current !== currentDisplayedCount) {
      const timer = setTimeout(() => setGridKey((prev) => prev + 1), 60);
      prevDisplayedCountRef.current = currentDisplayedCount;
      return () => clearTimeout(timer);
    }

    // Update o ref
    prevDisplayedCountRef.current = currentDisplayedCount;
  }, [paginatedPublications.length]);

  // Reset para página 1 quando mudar a ordenação ou busca
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, searchQuery]);

  if (isLoading) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--primary)",
          paddingTop: isMobile ? 80 : 100,
        }}
      >
        <Center h={400}>
          <Loader size="lg" color="white" />
        </Center>
      </Box>
    );
  }

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
          title={publicationsContent.hero.title}
          subtitle={publicationsContent.hero.subtitle}
          metrics={
            totalPublicationsCount > 0
              ? [
                  {
                    label: publicationsContent?.stats?.totalLabel,
                    value: totalPublicationsCount,
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
                data={publicationsContent.filter.sortOptions}
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
                  placeholder={publicationsContent?.searchPlaceholder}
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
          {paginatedPublications.map((paper, index) => (
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
              <PublicationCard
                title={paper.title}
                link={paper.link}
                authors_list={paper.authors_list}
                publication_place={paper.publication_place}
                citation_number={paper.citation_number}
                year={paper.year}
                index={index}
                viewLabel={publicationsContent.publicationCard.viewPublicationButton}
              />
            </motion.div>
          ))}
        </Stack>

        {/* Contagem de Resultados */}
        <Text size="md" c="white" mt={30} ta="center" fw={500}>
          {publicationsContent.resultsText.showing} {paginatedPublications.length}{" "}
          {publicationsContent.resultsText.of} {sortedPublications.length}{" "}
          {publicationsContent.resultsText.publications}
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
          :global(.publications-card:hover) {
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
