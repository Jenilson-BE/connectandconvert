import { NextRequest, NextResponse } from "next/server";
import { getAllLandingPages, saveLandingPage } from "@/lib/landing-storage";
import { LandingPageConfig } from "@/lib/landing-types";

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

    // Sanitize slug
    const cleanedSlug = body.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-");

    const saved = await saveLandingPage({
      ...body,
      slug: cleanedSlug,
    });

    return NextResponse.json({ success: true, page: saved });
  } catch (error) {
    console.error("Error saving landing page:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save landing page." },
      { status: 500 }
    );
  }
}
