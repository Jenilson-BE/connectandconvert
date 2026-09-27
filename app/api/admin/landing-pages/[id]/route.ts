import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getLandingPageById,
  deleteLandingPage,
  saveLandingPage,
  sanitizeSlug,
} from "@/lib/landing-storage";
import {
  normalizeMetaPixelId,
  isValidMetaPixelId,
  META_PIXEL_ID_ERROR,
} from "@/lib/meta-pixel-id";

function checkAuth(request: NextRequest): boolean {
  const session = request.cookies.get("cc_admin_session");
  return session?.value === "authenticated";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const page = await getLandingPageById(id);
  if (!page) {
    return NextResponse.json({ success: false, message: "Page not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, page });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await getLandingPageById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Page not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

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

    // Analytics counters are server-owned: never let an edit wipe visit history.
    const saved = await saveLandingPage({
      ...existing,
      ...body,
      id,
      slug: cleanedSlug,
      metaPixelId: metaPixelId || undefined,
      createdAt: existing.createdAt,
      visits: existing.visits,
      clicks: existing.clicks,
      subscribes: existing.subscribes,
      autoredirects: existing.autoredirects,
    });

    revalidatePath(`/lp/${saved.slug}`);
    if (existing.slug && existing.slug !== saved.slug) {
      revalidatePath(`/lp/${existing.slug}`);
    }

    return NextResponse.json({ success: true, page: saved });
  } catch (error) {
    console.error("Error updating landing page:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update landing page." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await getLandingPageById(id);
    const deleted = await deleteLandingPage(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Page not found or already deleted." }, { status: 404 });
    }

    if (existing?.slug) {
      revalidatePath(`/lp/${existing.slug}`);
    }

    return NextResponse.json({ success: true, message: "Page deleted successfully." });
  } catch (error) {
    console.error("Error deleting landing page:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete landing page." },
      { status: 500 }
    );
  }
}
