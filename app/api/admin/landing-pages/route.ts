import { NextRequest, NextResponse } from "next/server";
import { guardAdminRequest } from "@/lib/admin-guard";
import { revalidatePath } from "next/cache";
import {
  getAllLandingPages,
  saveLandingPage,
  sanitizeSlug,
} from "@/lib/landing-storage";
import { LandingPageConfig } from "@/lib/landing-types";
import {
  normalizeMetaPixelId,
  isValidMetaPixelId,
  META_PIXEL_ID_ERROR,
} from "@/lib/meta-pixel-id";
import { validateLandingPageUrls } from "@/lib/url-safety";


export async function GET(request: NextRequest) {
  const denied = guardAdminRequest(request);
  if (denied) return denied;

  const pages = await getAllLandingPages();
  return NextResponse.json({ success: true, pages });
}

export async function POST(request: NextRequest) {
  const denied = guardAdminRequest(request);
  if (denied) return denied;

  try {
    const body: LandingPageConfig = await request.json();

    if (!body.slug || !body.title || !body.destinationUrl) {
      return NextResponse.json(
        { success: false, message: "Slug, title, and destination URL are required." },
        { status: 400 }
      );
    }

    const cleanedSlug = sanitizeSlug(body.slug);
    if (!cleanedSlug) {
      return NextResponse.json(
        { success: false, message: "Slug must contain at least one letter or number." },
        { status: 400 }
      );
    }

    const urls = validateLandingPageUrls(body);
    if (!urls.ok) {
      return NextResponse.json(
        { success: false, message: urls.error },
        { status: 400 }
      );
    }

    const metaPixelId = normalizeMetaPixelId(body.metaPixelId);
    if (metaPixelId && !isValidMetaPixelId(metaPixelId)) {
      return NextResponse.json(
        { success: false, message: META_PIXEL_ID_ERROR },
        { status: 400 }
      );
    }

    const saved = await saveLandingPage({
      ...body,
      slug: cleanedSlug,
      metaPixelId: metaPixelId || undefined,
    });

    revalidatePath(`/lp/${saved.slug}`);

    return NextResponse.json({ success: true, page: saved });
  } catch (error) {
    console.error("Error saving landing page:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save landing page." },
      { status: 500 }
    );
  }
}
