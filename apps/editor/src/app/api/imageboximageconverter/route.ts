import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { requireUser } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    // 5. Envia a imagem processada ao storage S3 e recebe a URL final.
    const storageUploadResult = await uploadToS3(processedImage);

    // 6. Retorna ao frontend apenas o link final da imagem.
    return NextResponse.json(buildImageResponse(storageUploadResult));
  } catch (error: unknown) {
    if (error instanceof NextResponse) {
      return error;
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Falha ao processar upload da imagem.",
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
  // Imagem depois do resize/compressao local, pronta para ser enviada ao storage.
  file: File;
  mimeType: string;
  width: number;
  height: number;
  resized: boolean;
  compressed: boolean;
}

interface StorageUploadResult {
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
// Upload no storage S3-compatible
// ----------------------------

// Le uma variavel obrigatoria e gera um erro claro caso ela nao esteja definida.
function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variavel de ambiente ausente: ${name}.`);
  }

  return value;
}

// Remove a barra final para evitar URLs com barras duplicadas.
function removeTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

// Cria o cliente usando o endpoint e as credenciais apenas no servidor.
function createS3Client(): S3Client {
  return new S3Client({
    endpoint: getRequiredEnv("S3_ENDPOINT"),
    region: process.env.S3_REGION ?? "garage",
    forcePathStyle: true,
    credentials: {
      accessKeyId: getRequiredEnv("S3_ACCESS_KEY_ID"),
      secretAccessKey: getRequiredEnv("S3_SECRET_ACCESS_KEY"),
    },
  });
}

// Envia o JPEG processado e devolve uma URL permanente no mesmo formato usado pelo frontend.
async function uploadToS3(image: ProcessedImage): Promise<StorageUploadResult> {
  const endpoint = removeTrailingSlash(getRequiredEnv("S3_ENDPOINT"));
  const bucket = getRequiredEnv("S3_BUCKET");
  const publicBaseUrl = removeTrailingSlash(
    process.env.S3_PUBLIC_BASE_URL ?? `${endpoint}/${bucket}`,
  );
  const objectKey = `images/${randomUUID()}.jpg`;
  const imageBuffer = await readImageBuffer(image.file);

  await createS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: imageBuffer,
      ContentType: image.mimeType,
      ContentDisposition: "inline",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    imageUrl: `${publicBaseUrl}/${objectKey}`,
  };
}

// ----------------------------
// Helper para montar a resposta final para o frontend.
// ----------------------------

function buildImageResponse(storageUploadResult: StorageUploadResult) {
  return {
    success: true,
    imageUrl: storageUploadResult.imageUrl,
  };
}
