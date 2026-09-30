import "server-only";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const EXPIRES_IN_SECONDS = 300;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ausente: ${name}.`);
  return value;
}

let warnedMissingConfig = false;

/** Verifica se o S3 está configurado, sem lançar erro (ao contrário de getRequiredEnv). */
function isConfigured(): boolean {
  return !!(
    process.env.S3_ENDPOINT &&
    process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  );
}

let client: S3Client | undefined;

function getConfig() {
  const endpoint = new URL(getRequiredEnv("S3_ENDPOINT"));
  return { endpoint, bucket: getRequiredEnv("S3_BUCKET") };
}

function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      endpoint: getConfig().endpoint.toString(),
      region: process.env.S3_REGION ?? "garage",
      forcePathStyle: true,
      credentials: {
        accessKeyId: getRequiredEnv("S3_ACCESS_KEY_ID"),
        secretAccessKey: getRequiredEnv("S3_SECRET_ACCESS_KEY"),
      },
    });
  }
  return client;
}

export function getImageObjectKey(value: string): string | null {
  const reference = value.trim();
  if (!reference) return null;
  const key = reference.startsWith("images/") ? reference : getObjectKeyFromUrl(reference);
  if (!key) return null;
  if (
    !key.startsWith("images/") ||
    key.split("/").some((part) => !part || part === "." || part === "..")
  ) {
    throw new Error("Referência de imagem S3 inválida.");
  }
  return key;
}

function getObjectKeyFromUrl(reference: string): string | null {
  let url: URL;
  try {
    url = new URL(reference);
  } catch {
    throw new Error("Referência de imagem S3 inválida.");
  }
  const prefix = `/${getConfig().bucket}/`;
  return url.pathname.startsWith(prefix)
    ? decodeURIComponent(url.pathname.slice(prefix.length))
    : null;
}

function signObjectKey(objectKey: string): Promise<string> {
  const { bucket } = getConfig();
  return getSignedUrl(
    getClient(),
    new GetObjectCommand({ Bucket: bucket, Key: objectKey }),
    { expiresIn: EXPIRES_IN_SECONDS },
  );
}

export async function getSignedImageUrl(objectKey: string): Promise<string> {
  return (await getSignedImageUrls([objectKey]))[0];
}

export async function getSignedImageUrls(
  objectKeys: readonly string[],
): Promise<string[]> {
  // Sem S3 configurado (ex: dev local sem Garage), não há como assinar —
  // devolve as referências originais em vez de derrubar a rota inteira.
  if (!isConfigured()) {
    if (!warnedMissingConfig) {
      console.warn(
        "[s3-images] S3 não configurado — pulando assinatura de imagens (URLs originais serão usadas).",
      );
      warnedMissingConfig = true;
    }
    return [...objectKeys];
  }

  const signed = new Map<string, Promise<string>>();
  return Promise.all(objectKeys.map((objectKey) => {
    const key = getImageObjectKey(objectKey);
    if (!key) return objectKey;
    const cached = signed.get(key);
    if (cached) return cached;
    const result = signObjectKey(key);
    signed.set(key, result);
    return result;
  }));
}
