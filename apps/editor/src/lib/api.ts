// Construir as urls da api de publicacao externa
export function getPublishApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_PUBLISH_API_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_PUBLISH_API_URL não está configurada. " +
        "Defina a URL do servidor externo que receberá os dados publicados no arquivo .env.local"
    );
  }

  return baseUrl.replace(/\/$/, ""); // Remove trailing slash
}

// Constrói URL local para leitura de dados (GET)
export function buildLocalApiUrl(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

// Constrói URL completa para a API de publicação externa
export function buildPublishApiUrl(path: string): string {
  const baseUrl = getPublishApiBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

// Função genérica para chamadas à API de publicação externa
export async function publishApiFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const url = buildPublishApiUrl(path);
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}
