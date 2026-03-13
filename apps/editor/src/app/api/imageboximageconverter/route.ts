import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { requireUser } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IMGBOX_BASE_URL = "https://imgbox.com"; // Host base usado em todas as chamadas ao imgbox.
const MAX_IMAGE_SIDE_PX = 1000; // Se largura ou altura passar disso, a imagem e redimensionada.
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]); // MIME types aceitos na entrada.

// ----------------------------
// Handler Principal (ENDPOINT)
// ----------------------------

export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    await requireUser(request);

    // 1. Recebe a imagem enviada pelo frontend e valida formato/tamanho.
    const upload = await receiveImageFromRequest(request);

    // 2. Le as dimensoes da imagem para decidir se algum lado precisa ser reduzido.
    const resizeDecision = await assessResizeNeed(upload);

    // 3. Se necessario, redimensiona a imagem mantendo a proporcao original.
    const resizedImage = await resizeImageIfNeeded(upload, resizeDecision);

    // 4. Normaliza a saida em JPEG e aplica compressao para uso web.
    const processedImage = await compressImage(resizedImage);

    // 5. Envia a imagem processada ao imgbox e extrai a URL final renderizavel.
    const imgboxUploadResult = await uploadToImgbox(processedImage);

    // 6. Retorna ao frontend apenas o link final da imagem.
    return NextResponse.json(buildImageResponse(imgboxUploadResult));
  } catch (error: any) {
    if (error instanceof NextResponse) {
      return error;
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Falha ao processar upload da imagem.",
      },
      { status: 400 },
    );
  }
}

// ----------------------------
// Tipos/Interfaces para o fluxo de processamento
// ----------------------------

interface IncomingUpload {
  // Arquivo exatamente como chegou do frontend.
  file: File;
  mimeType: string;
}

interface ResizeDecision {
  // Dimensoes lidas pelo sharp antes de qualquer processamento.
  width: number;
  height: number;
  needsResize: boolean;
}

interface ProcessedImage {
  // Imagem depois do resize/compressao local, pronta para ser enviada ao imgbox.
  file: File;
  mimeType: string;
  width: number;
  height: number;
  resized: boolean;
  compressed: boolean;
}

interface ImgboxSession {
  // Sessao inicial do imgbox: sem isso, os POSTs seguintes falham.
  authenticityToken: string;
  cookieHeader: string;
}

interface ImgboxTemporaryToken {
  // Tokens temporarios que o imgbox exige antes do upload multipart.
  tokenId: string;
  tokenSecret: string;
  galleryId: string;
  gallerySecret: string;
  cookieHeader: string;
}

interface ImgboxUploadProcessFile {
  // Bloco por arquivo retornado pelo endpoint /upload/process.
  error?: string;
  error_code?: number;
  original_url?: string;
  name?: string;
  size?: number;
}

interface ImgboxUploadProcessResponse {
  // Resposta JSON do imgbox depois do multipart.
  files?: ImgboxUploadProcessFile[];
}

interface ImgboxUploadResult {
  // Unica informacao que precisamos devolver ao frontend.
  imageUrl: string;
}

// ----------------------------
// Entrada e validacao
// ----------------------------

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // Limite de 10MB por imagem.

function validateImageFile(file: File | null): asserts file is File {
  if (!file) {
    throw new Error("Nenhuma imagem foi enviada.");
  }

  const lowerCaseName = file.name.toLowerCase();
  const hasAcceptedExtension =
    lowerCaseName.endsWith(".jpg") ||
    lowerCaseName.endsWith(".jpeg") ||
    lowerCaseName.endsWith(".png");

  if (!ACCEPTED_IMAGE_TYPES.has(file.type) && !hasAcceptedExtension) {
    throw new Error("Formato invalido. Envie JPG, JPEG ou PNG.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Arquivo maior que 10MB.");
  }
}

async function receiveImageFromRequest(
  request: NextRequest,
): Promise<IncomingUpload> {
  // O frontend envia multipart/form-data com um campo chamado "image".
  const formData = await request.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    throw new Error("Campo 'image' ausente no upload.");
  }

  validateImageFile(file);

  return {
    file,
    mimeType: file.type,
  };
}

async function readImageBuffer(file: File): Promise<Buffer> {
  // sharp trabalha melhor com Buffer no ambiente Node.
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ----------------------------
// Resize e compressao
// ----------------------------

function resolveOutputFileName(originalName: string, mimeType: string): string {
  // O nome final acompanha o formato processado da imagem.
  if (mimeType === "image/jpeg") {
    return originalName.replace(/\.(png|jpe?g)$/i, ".jpg");
  }

  if (mimeType === "image/png") {
    return originalName.replace(/\.(png|jpe?g)$/i, ".png");
  }

  return originalName;
}

function buildOutputFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): File {
  // File espera BlobPart compatível; Uint8Array evita conflito de tipagem com Buffer.
  const fileBytes = Uint8Array.from(buffer);

  return new File([fileBytes], resolveOutputFileName(originalName, mimeType), {
    type: mimeType,
  });
}

async function assessResizeNeed(
  upload: IncomingUpload,
): Promise<ResizeDecision> {
  // Antes de mexer na imagem, lemos o metadata para saber se o resize e necessario.
  const inputBuffer = await readImageBuffer(upload.file);
  const metadata = await sharp(inputBuffer).metadata();

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (!width || !height) {
    throw new Error("Nao foi possivel identificar as dimensoes da imagem.");
  }

  const largestSide = Math.max(width, height);
  if (largestSide <= MAX_IMAGE_SIDE_PX) {
    return {
      width,
      height,
      needsResize: false,
    };
  }

  return {
    width,
    height,
    needsResize: true,
  };
}

async function resizeImageIfNeeded(
  upload: IncomingUpload,
  decision: ResizeDecision,
): Promise<ProcessedImage> {
  // Se a imagem ja esta dentro do limite, seguimos com o arquivo original.
  const inputBuffer = await readImageBuffer(upload.file);

  if (!decision.needsResize) {
    return {
      file: upload.file,
      mimeType: upload.mimeType,
      width: decision.width,
      height: decision.height,
      resized: false,
      compressed: false,
    };
  }

  const resizedBuffer = await sharp(inputBuffer)
    // "inside" preserva proporcao e garante que nenhum lado passe do limite.
    .resize({
      width: MAX_IMAGE_SIDE_PX,
      height: MAX_IMAGE_SIDE_PX,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer();

  const resizedMetadata = await sharp(resizedBuffer).metadata();

  return {
    file: buildOutputFile(resizedBuffer, upload.file.name, upload.mimeType),
    mimeType: upload.mimeType,
    width: resizedMetadata.width ?? decision.width,
    height: resizedMetadata.height ?? decision.height,
    resized: true,
    compressed: false,
  };
}

async function compressImage(image: ProcessedImage): Promise<ProcessedImage> {
  // Toda imagem e convertida para JPEG para simplificar o pipeline final.
  const inputBuffer = await readImageBuffer(image.file);
  const compressedBuffer = await sharp(inputBuffer)
    // Como nao precisamos de transparencia, achatamos qualquer alpha em fundo branco.
    .flatten({ background: "#ffffff" })
    .jpeg({
      quality: 82,
      mozjpeg: true,
      progressive: true,
    })
    .toBuffer();

  return {
    file: buildOutputFile(compressedBuffer, image.file.name, "image/jpeg"),
    mimeType: "image/jpeg",
    width: image.width,
    height: image.height,
    resized: image.resized,
    compressed: true,
  };
}

// ----------------------------
// Fluxo do imagebox: autenticacao, upload multipart e retorno da URL final
// ----------------------------

// Parametros aceitos pelo fluxo web do imgbox.
const IMGBOX_CONTENT_TYPE = 1;
const IMGBOX_THUMBNAIL_SIZE = "350c";
const IMGBOX_COMMENTS_ENABLED = 1;

// Funcao principal que orquestra o upload no imgbox e retorna a URL direta
// da imagem a partir do JSON do /upload/process.
async function uploadToImgbox(
  image: ProcessedImage,
): Promise<ImgboxUploadResult> {
  // Passo 1: abrir uma sessao no imgbox
  // Antes de qualquer POST, precisamos simular a abertura da pagina inicial do
  // imgbox para obter:
  // - o token CSRF da sessao atual
  // - os cookies que identificam essa sessao no servidor deles
  const session = await openImgboxSession();

  // Passo 2: solicitar os tokens temporarios do upload
  // O imgbox nao aceita o multipart diretamente. Primeiro ele gera tokens
  // temporarios que precisam acompanhar o arquivo na proxima etapa.
  const temporaryToken = await generateTemporaryUploadToken(session);

  // Passo 3: montar o multipart do upload
  // Aqui montamos o corpo exatamente como a interface web do imgbox espera:
  // - parametros do upload
  // - arquivo processado
  // - tokens temporarios da sessao atual
  const uploadBody = new FormData();
  uploadBody.append("content_type", String(IMGBOX_CONTENT_TYPE));
  uploadBody.append("thumbnail_size", IMGBOX_THUMBNAIL_SIZE);
  uploadBody.append("comments_enabled", String(IMGBOX_COMMENTS_ENABLED));
  uploadBody.append("files[]", image.file, image.file.name);
  uploadBody.append("token_id", temporaryToken.tokenId);
  uploadBody.append("token_secret", temporaryToken.tokenSecret);
  uploadBody.append("gallery_id", temporaryToken.galleryId);
  uploadBody.append("gallery_secret", temporaryToken.gallerySecret);

  // Passo 4: enviar o multipart para /upload/process
  // Esse e o endpoint que realmente recebe o binario da imagem. Aqui o imgbox
  // valida o arquivo e retorna o resultado do upload em JSON.
  const uploadResponse = await fetch(`${IMGBOX_BASE_URL}/upload/process`, {
    method: "POST",
    headers: {
      ...createImgboxHeaders({
        cookieHeader: temporaryToken.cookieHeader,
        isAjax: true,
        csrfToken: session.authenticityToken,
      }),
    },
    body: uploadBody,
    cache: "no-store",
  });

  if (!uploadResponse.ok) {
    await readErrorResponse(
      uploadResponse,
      "Falha ao enviar a imagem para o imgbox.",
    );
  }

  // Lemos o JSON do upload para descobrir se o arquivo foi aceito e obter
  // a URL direta final da imagem publicada.
  const rawUploadResponse = await uploadResponse.text();
  const parsedUploadResponse = parseJsonResponse<ImgboxUploadProcessResponse>(
    rawUploadResponse,
    "Resposta invalida ao enviar a imagem para o imgbox.",
  );

  // O endpoint retorna um array "files" com o resultado de cada arquivo enviado.
  const uploadedFile = parsedUploadResponse.files?.[0];

  if (uploadedFile?.error) {
    throw new Error(
      `Imgbox rejeitou o arquivo no upload/process: ${uploadedFile.error}`,
    );
  }

  // O proprio /upload/process devolve a URL direta da imagem em original_url.
  const imageUrl = uploadedFile?.original_url ?? null;

  if (!imageUrl) {
    throw new Error(
      "Nao foi possivel extrair o link final da imagem no imgbox.",
    );
  }

  // O unico dado que interessa para o frontend e a URL final renderizavel.
  return {
    imageUrl,
  };
}

// Abre a home do imgbox para obter o token CSRF e os cookies de sessao necessarios para os passos seguintes.
async function openImgboxSession(): Promise<ImgboxSession> {
  // Primeiro abrimos a home para obter CSRF e cookies de sessao.
  const response = await fetch(`${IMGBOX_BASE_URL}/`, {
    headers: createImgboxHeaders({ origin: null, referer: null }),
    cache: "no-store",
  });

  if (!response.ok) {
    await readErrorResponse(
      response,
      "Nao foi possivel iniciar sessao com o imgbox.",
    );
  }

  const html = await response.text();
  const authenticityToken = extractAuthenticityToken(html);

  if (!authenticityToken) {
    throw new Error("Nao foi possivel obter authenticity_token do imgbox.");
  }

  return {
    authenticityToken,
    cookieHeader: buildCookieHeader("", response),
  };
}

// O HTML do imgbox publica o CSRF em uma meta tag chamada "csrf-token".
// Esse valor precisa seguir nos POSTs AJAX do fluxo de upload.
function extractAuthenticityToken(html: string): string | null {
  const metaMatch = html.match(
    /<meta[^>]+name=["']csrf-token["'][^>]+content=["']([^"']+)["']/i,
  );

  return metaMatch?.[1] ?? null;
}

// Esta funcao faz a chamada que o frontend do imgbox faria para obter os tokens temporarios antes do upload multipart.
async function generateTemporaryUploadToken(
  session: ImgboxSession,
): Promise<ImgboxTemporaryToken> {
  // O imgbox gera token e metadados temporarios antes de aceitar o multipart.
  const body = new URLSearchParams({
    gallery: "true",
    gallery_title: "",
    comments_enabled: String(IMGBOX_COMMENTS_ENABLED),
  });

  const response = await fetch(`${IMGBOX_BASE_URL}/ajax/token/generate`, {
    method: "POST",
    headers: {
      ...createImgboxHeaders({
        cookieHeader: session.cookieHeader,
        isAjax: true,
        csrfToken: session.authenticityToken,
      }),
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    await readErrorResponse(
      response,
      "Falha ao gerar token temporario no imgbox.",
    );
  }

  const rawResponse = await response.text();
  const parsedResponse = parseJsonResponse<{
    ok: boolean;
    token_id: string | number;
    token_secret: string | number;
    gallery_id: string | number;
    gallery_secret: string | number;
  }>(rawResponse, "Resposta invalida ao gerar token temporario no imgbox.");

  if (!parsedResponse.ok) {
    throw new Error("Resposta invalida ao gerar token temporario no imgbox.");
  }

  return {
    tokenId: String(parsedResponse.token_id),
    tokenSecret: String(parsedResponse.token_secret),
    galleryId: String(parsedResponse.gallery_id),
    gallerySecret: String(parsedResponse.gallery_secret),
    cookieHeader: buildCookieHeader(session.cookieHeader, response),
  };
}

// ---- Helpers compartilhados de sessao e resposta ----

// Reconstrói o header Cookie para as chamadas seguintes, combinando os cookies existentes com os novos cookies Set-Cookie devolvidos pelo imgbox a cada resposta.
function buildCookieHeader(existingCookieHeader: string, response: Response) {
  const cookieMap = new Map<string, string>();

  if (existingCookieHeader) {
    for (const cookiePart of existingCookieHeader.split(";")) {
      const trimmedPart = cookiePart.trim();
      if (!trimmedPart) {
        continue;
      }

      const separatorIndex = trimmedPart.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      cookieMap.set(
        trimmedPart.slice(0, separatorIndex),
        trimmedPart.slice(separatorIndex + 1),
      );
    }
  }

  for (const rawSetCookie of getSetCookieHeaders(response)) {
    const cookiePair = rawSetCookie.split(";", 1)[0];
    const separatorIndex = cookiePair.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    cookieMap.set(
      cookiePair.slice(0, separatorIndex),
      cookiePair.slice(separatorIndex + 1),
    );
  }

  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

// Lida com as diferentes formas que o Node pode expor os headers Set-Cookie, garantindo que conseguimos ler todos os cookies devolvidos pelo imgbox mesmo que venham em formatos variados.
function getSetCookieHeaders(response: Response): string[] {
  // Node pode expor Set-Cookie de formas diferentes; esse helper uniformiza a leitura.
  const headersWithGetSetCookie = response.headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof headersWithGetSetCookie.getSetCookie === "function") {
    return headersWithGetSetCookie.getSetCookie();
  }

  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) {
    return [];
  }

  return setCookie.split(/,(?=[^;]+=[^;]+)/);
}

// Helper centralizado para parsear respostas JSON do imgbox, com tratamento de erro unificado.
function parseJsonResponse<T>(rawResponse: string, errorMessage: string): T {
  // Centraliza parse defensivo das respostas JSON do imgbox.
  try {
    return JSON.parse(rawResponse) as T;
  } catch {
    throw new Error(errorMessage);
  }
}

// Helper centralizado para montar os headers de cada chamada ao imgbox, garantindo que os cookies e tokens corretos acompanhem cada etapa do fluxo.
function createImgboxHeaders(params?: {
  cookieHeader?: string;
  origin?: string | null;
  referer?: string | null;
  isAjax?: boolean;
  csrfToken?: string | null;
}) {
  const {
    cookieHeader,
    origin = IMGBOX_BASE_URL,
    referer = `${IMGBOX_BASE_URL}/`,
    isAjax = false,
    csrfToken = null,
  } = params ?? {};

  return {
    // Os endpoints do imgbox sao sensiveis a headers de browser/AJAX.
    Accept: isAjax
      ? "application/json, text/javascript, */*; q=0.01"
      : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,pt-BR;q=0.8",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
    ...(origin ? { Origin: origin } : {}),
    ...(referer ? { Referer: referer } : {}),
    ...(isAjax ? { "X-Requested-With": "XMLHttpRequest" } : {}),
    ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
  };
}

// Helper centralizado para ler respostas de erro do imgbox.
async function readErrorResponse(
  response: Response,
  fallbackMessage: string,
): Promise<never> {
  // Quando o imgbox falha, anexamos o body para facilitar diagnostico.
  const rawBody = (await response.text()).trim();
  const details = rawBody ? ` Status ${response.status}. Body: ${rawBody}` : "";
  throw new Error(`${fallbackMessage}${details}`);
}

// ----------------------------
// Helper para montar a resposta final para o frontend.
// ----------------------------

function buildImageResponse(imgboxUploadResult: ImgboxUploadResult) {
  return {
    success: true,
    imageUrl: imgboxUploadResult.imageUrl,
  };
}
