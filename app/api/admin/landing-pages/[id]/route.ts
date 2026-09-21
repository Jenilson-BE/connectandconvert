import { NextRequest, NextResponse } from "next/server";
import { getLandingPageById, deleteLandingPage, saveLandingPage } from "@/lib/landing-storage";

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
  const body = await request.json();
  const saved = await saveLandingPage({ ...body, id });
  return NextResponse.json({ success: true, page: saved });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteLandingPage(id);
  if (!deleted) {
    return NextResponse.json({ success: false, message: "Page not found or already deleted." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Page deleted successfully." });
}
