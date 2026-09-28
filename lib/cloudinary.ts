import { createHash } from "node:crypto";

/**
 * Cloudinary integration for admin media uploads.
 *
 * This module holds the API secret, so it must never reach the browser. The
 * check below replaces the `server-only` package, which is not a dependency of
 * this project.
 */
if (typeof window !== "undefined") {
  throw new Error("lib/cloudinary.ts is server-only and must not be imported by a client component.");
}

export const CLOUDINARY_UPLOAD_ENDPOINT_BASE = "https://api.cloudinary.com/v1_1";

/** Formats accepted for admin media, enforced both by signature and by sniffing. */
export const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "gif"] as const;

export type AllowedImageFormat = (typeof ALLOWED_IMAGE_FORMATS)[number];

export const MEDIA_SIZE_LIMITS = {
  logo: 2 * 1024 * 1024,
  og: 5 * 1024 * 1024,
} as const;

export type MediaKind = keyof typeof MEDIA_SIZE_LIMITS;

const MIME_TO_FORMAT: Record<string, AllowedImageFormat> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function getUploadFolder(): string {
  return (process.env.CLOUDINARY_UPLOAD_FOLDER || "connectandconvert").replace(/^\/+|\/+$/g, "");
}

export function resolveMaxBytes(kind: MediaKind): number {
  return MEDIA_SIZE_LIMITS[kind] ?? MEDIA_SIZE_LIMITS.logo;
}

/** Map a client-declared MIME type to a permitted format. */
export function formatForMimeType(mimeType: string): AllowedImageFormat | null {
  return MIME_TO_FORMAT[mimeType.toLowerCase().trim()] ?? null;
}

/**
 * Identify an image from its leading bytes.
 *
 * The browser-supplied MIME type is only a claim, so the real type is derived
 * from the file contents before anything is forwarded to Cloudinary.
 */
export function sniffImageFormat(bytes: Uint8Array): AllowedImageFormat | null {
  if (bytes.length < 12) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";

  // GIF: "GIF87a" / "GIF89a"
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return "gif";
  }

  // WEBP: "RIFF" .... "WEBP"
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }

  // SVG is deliberately unsupported: it can carry scripts.
  return null;
}

/**
 * Cloudinary's signed-upload signature: SHA-1 over the alphabetically sorted
 * `key=value` pairs, with the API secret appended.
 *
 * `file`, `api_key`, `signature` and `resource_type` are excluded per
 * Cloudinary's specification. SHA-1 is required by their API; it is an
 * integrity check on a request this server assembles itself, not a security
 * primitive chosen on our side.
 */
export function buildCloudinarySignature(
  params: Record<string, string>,
  apiSecret: string
): string {
  const toSign = Object.keys(params)
    .filter((key) => !["file", "api_key", "signature", "resource_type"].includes(key))
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("base64");
}

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload validated image bytes to Cloudinary.
 *
 * Every request parameter is assembled here, so the client can neither read the
 * API secret nor redirect the upload to another folder or format.
 */
export async function uploadImageToCloudinary(
  bytes: Uint8Array,
  format: AllowedImageFormat,
  kind: MediaKind
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Signed so the client cannot alter it.
  const params: Record<string, string> = {
    timestamp,
    folder: `${getUploadFolder()}/${kind}`,
    allowed_formats: ALLOWED_IMAGE_FORMATS.join(","),
  };

  const body = new FormData();
  body.append(
    "file",
    new Blob([bytes as BlobPart], { type: formatToMime(format) }),
    `upload.${format}`
  );
  body.append("api_key", apiKey);
  body.append("timestamp", params.timestamp);
  body.append("folder", params.folder);
  body.append("allowed_formats", params.allowed_formats);
  body.append("signature", buildCloudinarySignature(params, apiSecret));

  const endpoint = `${CLOUDINARY_UPLOAD_ENDPOINT_BASE}/${cloudName}/image/upload`;

  const response = await fetch(endpoint, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Cloudinary upload failed:", response.status, detail.slice(0, 500));
    throw new Error(`Cloudinary rejected the upload (status ${response.status}).`);
  }

  const data = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    format?: string;
    width?: number;
    height?: number;
    bytes?: number;
    error?: { message?: string };
  };

  if (!data.secure_url) {
    throw new Error(data.error?.message || "Cloudinary did not return an image URL.");
  }

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id ?? "",
    format: data.format ?? format,
    width: data.width ?? 0,
    height: data.height ?? 0,
    bytes: data.bytes ?? bytes.byteLength,
  };
}

function formatToMime(format: AllowedImageFormat): string {
  switch (format) {
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}
