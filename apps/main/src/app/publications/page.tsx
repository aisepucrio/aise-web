"use client";

import {
  Box,
  Container,
  Group,
  Loader,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconFileText, IconFilter, IconSearch } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import content from "@/../public/json/pages-headers.json";
import FlickeringGrid from "@/components/FlickeringGrid";
import PagesHeader from "@/components/PagesHeader";
import { PublicationCard } from "@shared/ui";

interface Publication {
  title: string;
  link: string;
  authors_list: string;
  publication_place: string;
  citation_number: number;
  year: string;
  awards?: string;
}

type SortOption =
  | "year-desc"
  | "year-asc"
  | "citations-desc"
  | "citations-asc"
  | "name-asc"
  | "name-desc";

const ITEMS_PER_PAGE = 10;

const sortComparators: Record<
  SortOption,
  (a: Publication, b: Publication) => number
> = {
  "year-desc": (a, b) => Number(b.year) - Number(a.year),
  "year-asc": (a, b) => Number(a.year) - Number(b.year),
  "citations-desc": (a, b) => b.citation_number - a.citation_number,
  "citations-asc": (a, b) => a.citation_number - b.citation_number,
  "name-asc": (a, b) => a.title.localeCompare(b.title),
  "name-desc": (a, b) => b.title.localeCompare(a.title),
};

export default function PublicationsPage() {
  const isMobile = useMediaQuery("(max-width: 62em)");

  const [allPublications, setAllPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [gridKey, setGridKey] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("year-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const prevCountRef = useRef<number | null>(null);

  // Load publications once
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/api/publications");
        const data = await res.json();
        if (alive) setAllPublications(data.publications || []);
      } catch (err) {
        console.error("Error loading publications:", err);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Repaint background grid on mount and resize
  useEffect(() => {
    const bump = () => setGridKey((k) => k + 1);
    const t = window.setTimeout(bump, 100);
    window.addEventListener("resize", bump);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", bump);
    };
  }, []);

  const totalPublicationsCount = allPublications.length;

  const sortedPublications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = q
      ? allPublications.filter((p) => p.title.toLowerCase().includes(q))
      : allPublications;

    return [...filtered].sort(sortComparators[sortBy]);
  }, [allPublications, sortBy, searchQuery]);

  const totalPages = Math.ceil(sortedPublications.length / ITEMS_PER_PAGE);

  const paginatedPublications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedPublications.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedPublications, currentPage]);

  // Reset to page 1 when query/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, searchQuery]);

  // Repaint background grid when visible item count changes
  useEffect(() => {
    const count = paginatedPublications.length;

    if (prevCountRef.current === null) {
      prevCountRef.current = count;
      return;
    }

    if (prevCountRef.current !== count) {
      const t = window.setTimeout(() => setGridKey((k) => k + 1), 60);
      prevCountRef.current = count;
      return () => window.clearTimeout(t);
    }

    prevCountRef.current = count;
  }, [paginatedPublications.length]);

  if (isLoading) {
    return (
      <Box
        style={{
          position: "relative",
          minHeight: "100vh",
          backgroundColor: "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader size="lg" color="white" />
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
          title={content.publicationsHero.title}
          subtitle={content.publicationsHero.subtitle}
          metrics={
            totalPublicationsCount
              ? [
                  {
                    label: "Total Publications",
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
          <Box
            style={{
              display: "flex",
              justifyContent: isMobile ? "center" : "space-between",
              alignItems: "center",
              marginBottom: 18,
              gap: 16,
            }}
          >
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
                onChange={(v) => v && setSortBy(v as SortOption)}
                data={[
                  { value: "year-desc", label: "Year ↓" },
                  { value: "year-asc", label: "Year ↑" },
                  { value: "citations-desc", label: "Citations ↓" },
                  { value: "citations-asc", label: "Citations ↑" },
                  { value: "name-asc", label: "Title A-Z" },
                  { value: "name-desc", label: "Title Z-A" },
                ]}
                w={isMobile ? 140 : 180}
              />
            </Box>

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
                  placeholder={"Search by title..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  w={300}
                />
              </Box>
            )}
          </Box>
        </motion.div>

        <Stack gap="xl" mb={40}>
          {paginatedPublications.map((paper, index) => (
            <motion.div
              key={`${paper.link}-${index}`}
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
                awards={paper.awards}
                index={index}
              />
            </motion.div>
          ))}
        </Stack>

        <Text size="md" c="white" mt={30} ta="center" fw={500}>
          Showing {paginatedPublications.length} of {sortedPublications.length}{" "}
          publications
        </Text>

        {totalPages > 1 && (
          <Group justify="center" mt={18}>
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
              size={isMobile ? "sm" : "md"}
              withEdges
              color="gray"
            />
          </Group>
        )}
      </Container>
    </Box>
  );
}
