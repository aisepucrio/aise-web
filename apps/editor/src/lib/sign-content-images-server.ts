import "server-only";
import { getSignedImageUrls } from "@shared/s3-images";

const IMAGE_FIELDS = new Set(["imageUrl", "highlightImageUrl", "galleryImagesUrl"]);

function imageReferences(value: unknown, field?: string): string[] {
  if (typeof value === "string") return IMAGE_FIELDS.has(field ?? "") && value ? [value] : [];
  if (Array.isArray(value)) return value.flatMap((item) => imageReferences(item, field));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => imageReferences(item, key));
  }
  return [];
}

function replaceImages(value: unknown, urls: Map<string, string>, field?: string): unknown {
  if (typeof value === "string" && IMAGE_FIELDS.has(field ?? "")) return urls.get(value) ?? value;
  if (Array.isArray(value)) return value.map((item) => replaceImages(item, urls, field));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceImages(item, urls, key)]),
    );
  }
  return value;
}

export async function signContentImages<T>(data: T): Promise<T> {
  const references = [...new Set(imageReferences(data))];
  if (!references.length) return data;
  const urls = await getSignedImageUrls(references);
  return replaceImages(data, new Map(references.map((key, index) => [key, urls[index]]))) as T;
}
