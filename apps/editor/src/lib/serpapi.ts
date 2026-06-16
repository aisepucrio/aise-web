/**
 * Utilitário para buscar publicações via SerpAPI
 */

export interface RawPublication {
  title?: string;
  link?: string;
  citation_id?: string;
  authors?: string;
  authors_list?: string;
  publication?: string;
  publication_place?: string;
  journal?: string;
  conference?: string;
  book?: string;
  resources?: Array<{ title?: string; link?: string }>;
  scholar_articles?: Array<{ title?: string; link?: string }>;
  cited_by?: { value?: string | number } | number;
  citation_number?: number;
  year?: string | number;
}

export interface Publication {
  title: string;
  link: string;
  authors_list: string;
  publication_place: string;
  citation_number: number;
  year: string;
  awards: string;
}

function firstNonEmpty(...values: Array<unknown>): string {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }

  return "";
}

function firstLinkedResource(raw: RawPublication): string {
  const resources = [...(raw.resources || []), ...(raw.scholar_articles || [])];
  return firstNonEmpty(...resources.map((resource) => resource.link));
}

function getPublicationPlace(raw: RawPublication): string {
  return firstNonEmpty(
    raw.publication_place,
    raw.publication,
    raw.journal,
    raw.conference,
    raw.book,
  );
}

// Normaliza uma publicação raw para o formato padronizado
function normalizePublication(raw: RawPublication): Publication | null {
  const title = firstNonEmpty(raw.title);
  const link = firstNonEmpty(raw.link, firstLinkedResource(raw));
  const authors_list = firstNonEmpty(raw.authors_list, raw.authors);
  const publication_place = getPublicationPlace(raw);

  // Extrai citation_number
  let citation_number = 0;
  if (typeof raw.citation_number === "number") {
    citation_number = raw.citation_number;
  } else if (
    raw.cited_by &&
    typeof raw.cited_by === "object" &&
    raw.cited_by.value !== undefined
  ) {
    const v = parseInt(String(raw.cited_by.value), 10);
    citation_number = isNaN(v) ? 0 : v;
  } else if (typeof raw.cited_by === "number") {
    citation_number = raw.cited_by;
  }

  const year = String(raw.year || "");

  // Retorna null se não tiver título
  if (!title) return null;

  return {
    title,
    link,
    authors_list,
    publication_place,
    citation_number,
    year,
    awards: "",
  };
}

async function fetchPublicationDetails(
  authorId: string,
  citationId: string,
  apiKey: string
): Promise<RawPublication | null> {
  const params = new URLSearchParams({
    engine: "google_scholar_author",
    author_id: authorId,
    view_op: "view_citation",
    citation_id: citationId,
    hl: "en",
    api_key: apiKey,
  });

  const response = await fetch(`https://serpapi.com/search.json?${params}`);
  if (!response.ok) return null;

  const data = await response.json();
  const citation = data.citation || {};

  return {
    ...citation,
    link: firstNonEmpty(citation.link, firstLinkedResource(citation)),
    resources: citation.resources,
    scholar_articles: citation.scholar_articles,
  };
}

async function enrichPublicationIfNeeded(
  raw: RawPublication,
  authorId: string,
  apiKey: string
): Promise<RawPublication> {
  const hasRequiredDetails =
    firstNonEmpty(raw.link, firstLinkedResource(raw)) &&
    firstNonEmpty(raw.authors_list, raw.authors) &&
    getPublicationPlace(raw);

  if (hasRequiredDetails || !raw.citation_id) return raw;

  const details = await fetchPublicationDetails(
    authorId,
    raw.citation_id,
    apiKey
  );
  if (!details) return raw;

  return {
    ...raw,
    ...details,
    title: firstNonEmpty(raw.title, details.title),
    year: raw.year || details.year,
    cited_by: raw.cited_by || details.cited_by,
    citation_number: raw.citation_number ?? details.citation_number,
    link: firstNonEmpty(raw.link, firstLinkedResource(raw), details.link),
    authors_list: firstNonEmpty(raw.authors_list, raw.authors, details.authors),
    publication_place: firstNonEmpty(
      raw.publication_place,
      raw.publication,
      getPublicationPlace(details)
    ),
  };
}

// Busca publicações da SerpAPI
export async function fetchPublications(
  authorId: string,
  yearCutoff: number,
  apiKey: string
): Promise<Publication[]> {
  const allArticles: RawPublication[] = [];
  let start = 0;
  const pageSize = 100;

  while (true) {
    const params = new URLSearchParams({
      engine: "google_scholar_author",
      author_id: authorId,
      hl: "en",
      start: String(start),
      num: String(pageSize),
      api_key: apiKey,
    });

    const response = await fetch(`https://serpapi.com/search.json?${params}`);
    if (!response.ok) {
      throw new Error(`SerpAPI erro: ${response.status}`);
    }

    const data = await response.json();
    const articles = Array.isArray(data.articles) ? data.articles : [];

    if (articles.length === 0) break;
    allArticles.push(...articles);

    if (articles.length < pageSize) break;
    start += pageSize;
  }

  const enrichedArticles = await Promise.all(
    allArticles.map((article) =>
      enrichPublicationIfNeeded(article, authorId, apiKey)
    )
  );

  // Normaliza e filtra por ano
  return enrichedArticles
    .map(normalizePublication)
    .filter((pub): pub is Publication => {
      if (!pub) return false;
      const yearNum = parseInt(pub.year, 10);
      return !isNaN(yearNum) && yearNum >= yearCutoff;
    });
}
