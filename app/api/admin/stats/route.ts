import { NextRequest, NextResponse } from "next/server";
import { getAllLandingPages, getRecentVisitLogs } from "@/lib/landing-storage";

function checkAuth(request: NextRequest): boolean {
  const session = request.cookies.get("cc_admin_session");
  return session?.value === "authenticated";
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const pages = await getAllLandingPages();
  const logs = await getRecentVisitLogs(50);

  const totalPages = pages.length;
  const publishedPages = pages.filter((p) => p.status === "published").length;
  const totalVisits = pages.reduce((acc, p) => acc + (p.visits || 0), 0);
  const totalClicks = pages.reduce((acc, p) => acc + (p.clicks || 0), 0);
  const avgCtr = totalVisits > 0 ? ((totalClicks / totalVisits) * 100).toFixed(1) : "0.0";

  return NextResponse.json({
    success: true,
    stats: {
      totalPages,
      publishedPages,
      totalVisits,
      totalClicks,
      avgCtr: `${avgCtr}%`,
    },
    recentLogs: logs,
  });
}
