import { NextRequest, NextResponse } from "next/server";
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

function checkAuth(request: NextRequest): boolean {
  const session = request.cookies.get("cc_admin_session");
  return session?.value === "authenticated";
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const pages = await getAllLandingPages();
  return NextResponse.json({ success: true, pages });
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

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
