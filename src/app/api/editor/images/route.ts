import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedImageUrl } from "@shared/s3-images";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { requireUser } from "@/lib/auth-server";
import { requireCSRF } from "@/lib/csrf-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_SIDE_PX = 1000;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    requireCSRF(request);
    await requireUser(request);

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      throw new Error("Campo 'image' ausente no upload.");
    }

    const lowerCaseName = file.name.toLowerCase();
    const hasAcceptedExtension =
      lowerCaseName.endsWith(".jpg") || lowerCaseName.endsWith(".jpeg") || lowerCaseName.endsWith(".png");
    if (!ACCEPTED_IMAGE_TYPES.has(file.type) && !hasAcceptedExtension) {
      throw new Error("Formato inválido. Envie JPG, JPEG ou PNG.");
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error("Arquivo maior que 10MB.");
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(inputBuffer).metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;
    if (!width || !height) {
      throw new Error("Não foi possível identificar as dimensões da imagem.");
    }

    // Redimensiona só se algum lado passar do limite; preserva a proporção.
    const needsResize = Math.max(width, height) > MAX_IMAGE_SIDE_PX;
    const resizedBuffer = needsResize
      ? await sharp(inputBuffer)
          .resize({ width: MAX_IMAGE_SIDE_PX, height: MAX_IMAGE_SIDE_PX, fit: "inside", withoutEnlargement: true })
          .toBuffer()
      : inputBuffer;

    // Normaliza em JPEG e comprime pra uso web.
    const compressedBuffer = await sharp(resizedBuffer)
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toBuffer();

    const bucket = getRequiredEnv("S3_BUCKET");
    const objectKey = `images/${randomUUID()}.jpg`;

    await createS3Client().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: compressedBuffer,
        ContentType: "image/jpeg",
        ContentDisposition: "inline",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    return NextResponse.json({
      success: true,
      imageUrl: await getSignedImageUrl(objectKey),
    });
  } catch (error: unknown) {
    if (error instanceof NextResponse) return error;
    const message = error instanceof Error ? error.message : "Falha ao processar upload da imagem.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ausente: ${name}.`);
  return value;
}

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
