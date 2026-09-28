import { NextRequest, NextResponse } from "next/server";
import { getClientIp, guardAdminRequest } from "@/lib/admin-guard";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  ALLOWED_IMAGE_FORMATS,
  formatForMimeType,
  isCloudinaryConfigured,
  resolveMaxBytes,
  sniffImageFormat,
  uploadImageToCloudinary,
  type MediaKind,
} from "@/lib/cloudinary";

/** Uploads are heavier than ordinary API calls, so they are capped harder. */
const UPLOAD_LIMIT = { limit: 20, windowMs: 10 * 60 * 1000 };

const KINDS: MediaKind[] = ["logo", "og"];

function isMediaKind(value: unknown): value is MediaKind {
  return typeof value === "string" && (KINDS as string[]).includes(value);
}

export async function POST(request: NextRequest) {
  const denied = guardAdminRequest(request);
  if (denied) return denied;

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, then restart the server.",
      },
      { status: 503 }
    );
  }

  const rate = checkRateLimit(`upload:${getClientIp(request)}`, UPLOAD_LIMIT);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many uploads. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(Math.max(rate.retryAfterSeconds, 1)) } }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, message: "Expected a multipart form upload." },
      { status: 400 }
    );
  }

  const kind = form.get("kind");
  if (!isMediaKind(kind)) {
    return NextResponse.json(
      { success: false, message: `"kind" must be one of: ${KINDS.join(", ")}.` },
      { status: 400 }
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, message: "No file was provided." },
      { status: 400 }
    );
  }

  const maxBytes = resolveMaxBytes(kind);
  if (file.size === 0) {
    return NextResponse.json(
      { success: false, message: "The selected file is empty." },
      { status: 400 }
    );
  }
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        success: false,
        message: `File is too large. Maximum for ${kind === "logo" ? "a logo" : "an OG image"} is ${Math.round(maxBytes / 1024 / 1024)} MB.`,
      },
      { status: 413 }
    );
  }

  const declaredFormat = formatForMimeType(file.type);
  if (!declaredFormat) {
    return NextResponse.json(
      {
        success: false,
        message: `Unsupported file type. Allowed formats: ${ALLOWED_IMAGE_FORMATS.join(", ")}.`,
      },
      { status: 415 }
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  // The declared MIME type is only a claim, so the real type is derived from
  // the file's own header bytes before anything is forwarded.
  const actualFormat = sniffImageFormat(bytes);
  if (!actualFormat) {
    return NextResponse.json(
      {
        success: false,
        message: `That file is not a supported image. Allowed formats: ${ALLOWED_IMAGE_FORMATS.join(", ")}.`,
      },
      { status: 415 }
    );
  }

  try {
    const uploaded = await uploadImageToCloudinary(bytes, actualFormat, kind);
    return NextResponse.json({ success: true, image: uploaded });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Upload failed. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: true, configured: isCloudinaryConfigured() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
