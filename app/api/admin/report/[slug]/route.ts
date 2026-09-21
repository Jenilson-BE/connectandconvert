import { NextRequest, NextResponse } from "next/server";
import { getPageReport } from "@/lib/landing-storage";

function checkAuth(request: NextRequest): boolean {
  const session = request.cookies.get("cc_admin_session");
  return session?.value === "authenticated";
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please log in to admin." },
      { status: 401 }
    );
  }

  const { slug } = await context.params;
  const report = await getPageReport(slug);

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
