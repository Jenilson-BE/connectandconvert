export const META_PIXEL_ID_PATTERN = /^\d{15,16}$/;

export function normalizeMetaPixelId(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\s_-]/g, "");
}

export function isValidMetaPixelId(value: string): boolean {
  return META_PIXEL_ID_PATTERN.test(value);
}

export const META_PIXEL_ID_ERROR =
  "Meta Pixel ID must be 15 or 16 digits (numbers only). Leave it blank to run this page without a pixel.";
