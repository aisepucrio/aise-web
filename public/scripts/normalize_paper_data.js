/**
 * Script de Normalização de Dados de Papers
 * ==========================================
 * Setup: Vá até https://serpapi.com/ e crie uma conta gratuita para obter uma API key.
 * Adicione a API key no arquivo .env como SERPAPI_KEY=your_api_key_here
 * O script busca direto o perfil da Juliana (com author id) da SerpAPI.
 * Pagina 100 resultados, e salva em public/json/paper-data.json.
 * Normalização: limpa dados antes de 2016 ou dados com info faltando e reorganiza a estrutura
 */

/// ==== Carregar .env e deps
require("dotenv").config();
const fs = require("fs");
const path = require("path");

// ==== Configs principais
const yearCutoff = 2015; // filtro: mantém de 2016+
const AUTHOR_ID = "mCaYwHAAAAAJ";
const TOTAL_RESULTS = 200;
const PAGE_SIZE = 100; // SerpAPI: máx 100 por página
const HL = "en";
const API_KEY = process.env.SERPAPI_KEY;
if (!API_KEY) {
  console.error("Faltou SERPAPI_KEY no .env");
  process.exit(1);
}
// Caminho de saída
const filePath = path.join(
  __dirname,
  "..",
  "public",
  "json",
  "paper-data.json"
);

// Normalização de um item
function normalizeEntry(e) {
  const title = e.title || "";
  const link = e.link || "";
  const authors_list =
    e.authors_list !== undefined && e.authors_list !== null
      ? e.authors_list
      : e.authors !== undefined && e.authors !== null
      ? e.authors
      : "";
  const publication_place =
    e.publication_place !== undefined && e.publication_place !== null
      ? e.publication_place
      : e.publication !== undefined && e.publication !== null
      ? e.publication
      : "";

  let citation_number = 0;
  if (typeof e.citation_number === "number") {
    citation_number = e.citation_number;
  } else if (
    e.cited_by &&
    e.cited_by.value !== undefined &&
    e.cited_by.value !== null &&
    e.cited_by.value !== ""
  ) {
    const v = parseInt(e.cited_by.value, 10);
    citation_number = Number.isNaN(v) ? 0 : v;
  } else if (e.cited_by && typeof e.cited_by === "number") {
    citation_number = e.cited_by;
  } else {
    citation_number = 0;
  }

  const year = e.year !== undefined && e.year !== null ? e.year : "";

  return {
    title,
    link,
    authors_list,
    publication_place,
    citation_number,
    year,
  };
}

// ==== Funções para buscar da SerpAPI
const BASE_URL = "https://serpapi.com/search.json"; // garante JSON

function buildQuery(start, num) {
  const params = new URLSearchParams({
    engine: "google_scholar_author",
    author_id: AUTHOR_ID,
    hl: HL,
    start: String(start),
    num: String(num),
    api_key: API_KEY,
  });
  return `${BASE_URL}?${params.toString()}`;
}

async function fetchPage(start, num) {
  const url = buildQuery(start, num);
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`SerpAPI falhou (${res.status}): ${text}`);
  }
  return res.json();
}

async function fetchAllArticles(targetCount) {
  const articles = [];
  let start = 0;
  while (articles.length < targetCount) {
    const pageJson = await fetchPage(start, PAGE_SIZE);
    const pageArticles = Array.isArray(pageJson.articles)
      ? pageJson.articles
      : [];
    articles.push(...pageArticles);
    console.log(
      `Página start=${start}: +${pageArticles.length} artigos (total=${articles.length})`
    );
    if (pageArticles.length < PAGE_SIZE) break; // acabou
    start += PAGE_SIZE;
  }
  return articles.slice(0, targetCount);
}

// ==== Fluxo principal: busca -> normaliza -> filtra -> salva
(async () => {
  try {
    const rawArticles = await fetchAllArticles(TOTAL_RESULTS);

    // Normaliza e filtra (mantendo regra do ano)
    const normalized = rawArticles.map(normalizeEntry).filter((entry) => {
      const yearNum = parseInt(entry.year, 10);
      if (Number.isNaN(yearNum)) return false;
      return yearNum > yearCutoff;
    });

    const out = { paper_data: normalized };

    // Garante diretório
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(out, null, 2) + "\n", "utf8");

    console.log(
      `OK: Normalizados ${normalized.length} papers (>${yearCutoff}) e salvos em ${filePath}`
    );
  } catch (err) {
    console.error("Erro:", err.message);
    process.exit(1);
  }
})();
