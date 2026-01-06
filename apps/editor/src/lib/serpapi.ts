/**
 * Utilitário para buscar publicações via SerpAPI
 */

export interface RawPublication {
  title?: string;
  link?: string;
  authors?: string;
  authors_list?: string;
  publication?: string;
  publication_place?: string;
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

// Normaliza uma publicação raw para o formato padronizado
function normalizePublication(raw: RawPublication): Publication | null {
  const title = raw.title || "";
  const link = raw.link || "";
  const authors_list = raw.authors_list || raw.authors || "";
  const publication_place = raw.publication_place || raw.publication || "";
  
  // Extrai citation_number
  let citation_number = 0;
  if (typeof raw.citation_number === "number") {
    citation_number = raw.citation_number;
  } else if (raw.cited_by && typeof raw.cited_by === "object" && raw.cited_by.value !== undefined) {
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

  // Normaliza e filtra por ano
  return allArticles
    .map(normalizePublication)
    .filter((pub): pub is Publication => {
      if (!pub) return false;
      const yearNum = parseInt(pub.year, 10);
      return !isNaN(yearNum) && yearNum >= yearCutoff;
    });
}
