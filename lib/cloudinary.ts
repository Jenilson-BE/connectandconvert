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

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }

  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  if (cloudinaryUrl) {
    try {
      const parsed = new URL(cloudinaryUrl);
      if (
        parsed.protocol === "cloudinary:" &&
        parsed.username &&
        parsed.password &&
        parsed.hostname
      ) {
        return {
          cloudName: parsed.hostname,
          apiKey: parsed.username,
          apiSecret: parsed.password,
        };
      }
    } catch {
      // Invalid URL format
    }
  }

  return null;
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}

function getUploadFolder(): string {
  const base = (process.env.CLOUDINARY_UPLOAD_FOLDER || "connectandconvert")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  return base || "connectandconvert";
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
 * Cloudinary's signed-upload signature: SHA-1 hex digest over alphabetically
 * sorted `key=value` pairs, with the API secret appended.
 *
 * `file`, `api_key`, `signature`, `resource_type`, and `cloud_name` are excluded
 * per Cloudinary's specification. Empty or undefined parameters are also skipped.
 * SHA-1 hex digest is required by the Cloudinary API.
 */
export function buildCloudinarySignature(
  params: Record<string, string>,
  apiSecret: string
): string {
  const toSign = Object.keys(params)
    .filter(
      (key) =>
        !["file", "api_key", "signature", "resource_type", "cloud_name"].includes(key) &&
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
    )
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
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
  const config = getCloudinaryConfig();

  if (!config) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (or CLOUDINARY_URL)."
    );
  }

  const { cloudName, apiKey, apiSecret } = config;
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
    let errorMessage = `Cloudinary rejected the upload (status ${response.status}).`;
    try {
      const parsed = JSON.parse(detail);
      if (parsed?.error?.message) {
        errorMessage = `Cloudinary: ${parsed.error.message}`;
      }
    } catch {
      if (detail.trim()) {
        errorMessage = `Cloudinary (${response.status}): ${detail.slice(0, 200)}`;
      }
    }
    throw new Error(errorMessage);
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
