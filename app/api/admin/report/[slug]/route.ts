import { NextRequest, NextResponse } from "next/server";
import { guardAdminRequest } from "@/lib/admin-guard";
import { getPageReport } from "@/lib/landing-storage";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const denied = guardAdminRequest(request);
  if (denied) return denied;

  const { slug } = await context.params;
  const from = request.nextUrl.searchParams.get("from");
  const to = request.nextUrl.searchParams.get("to");
  const report = await getPageReport(slug, { from, to });

  if (!report) {
    return NextResponse.json(
      { success: false, message: `No report found for landing page: ${slug}` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    report,
  });
}
