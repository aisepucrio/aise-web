import { prisma } from "./client";
import type { Publications as PublicationRow } from "@prisma/client";

// Mapeia entre a tabela normalizada (Postgres) e o shape "achatado" que o
// front-end e o editor já consomem (o mesmo shape que vinha do Google Sheets).
// citation_number/year nunca eram null no Sheets (defaultavam pra 0/""),
// então preservamos esse comportamento aqui pra não mudar nada rio abaixo.

export interface LegacyPublication {
  title: string;
  link: string;
  authors_list: string;
  publication_place: string;
  citation_number: number;
  year: string;
  awards: string;
  acronym?: string;
}

function toLegacy(row: PublicationRow): LegacyPublication {
  return {
    title: row.title,
    link: row.link ?? "",
    authors_list: row.authors_list ?? "",
    publication_place: row.publication_place ?? "",
    citation_number: row.citation_number ?? 0,
    year: row.year != null ? String(row.year) : "",
    awards: row.awards ?? "",
    acronym: row.acronym ?? "",
  };
}

function toDbCreateInput(pub: Partial<LegacyPublication>) {
  const parsedYear = pub.year ? parseInt(pub.year, 10) : NaN;
  const parsedCitations =
    typeof pub.citation_number === "number"
      ? pub.citation_number
      : parseInt(String(pub.citation_number ?? ""), 10);

  return {
    title: pub.title ?? "",
    link: pub.link || null,
    authors_list: pub.authors_list || null,
    publication_place: pub.publication_place || null,
    citation_number: Number.isNaN(parsedCitations) ? null : parsedCitations,
    year: Number.isNaN(parsedYear) ? null : parsedYear,
    awards: pub.awards || null,
    acronym: pub.acronym || null,
  };
}

export async function listPublications(): Promise<LegacyPublication[]> {
  const rows = await prisma.publications.findMany({ orderBy: { id: "asc" } });
  return rows.map(toLegacy);
}

/** Insere as publicações informadas, mantendo as que já existem (== "append" do Sheets). */
export async function appendPublications(
  items: Partial<LegacyPublication>[],
): Promise<void> {
  if (!items.length) return;
  await prisma.publications.createMany({ data: items.map(toDbCreateInput) });
}

/** Apaga tudo e grava só o que foi informado (== "replace" do Sheets / POST do main). */
export async function replacePublications(
  items: Partial<LegacyPublication>[],
): Promise<void> {
  await prisma.$transaction([
    prisma.publications.deleteMany({}),
    ...(items.length
      ? [prisma.publications.createMany({ data: items.map(toDbCreateInput) })]
      : []),
  ]);
}
