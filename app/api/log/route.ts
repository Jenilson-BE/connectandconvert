import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/lib/landing-storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, slug, device, browser, os, path: reqPath, referrer, cid, attribution } = body;

    const safeSlug = slug || (reqPath ? String(reqPath).replace(/^\/lp\//, "") : "unknown");

    if (type && safeSlug) {
      await recordVisit(safeSlug, type, {
        device,
        browser,
        os,
        path: reqPath,
        referrer,
        cid,
        attribution,
      });
    }

    // Optional webhook forwarding
    const webhookUrl = process.env.LOG_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (err) {
        console.warn("Log webhook forwarding warning:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Failed to process log" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, active: true });
}
