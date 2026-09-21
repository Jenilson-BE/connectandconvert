import { NextResponse } from "next/server";

const LOG_TYPES = ["websitevisit", "subscribe", "autoredirect"] as const;
type LogType = (typeof LOG_TYPES)[number];

const WEBHOOK_URL = process.env.LOG_WEBHOOK_URL;

type LogPayload = {
  type: LogType;
  ts: string;
  cid: string;
  device: string;
  browser: string;
  os: string;
  viewport: string;
  language: string;
  timezone: string;
  path: string;
  referrer: string;
  userAgent: string;
  country: string;
  region: string;
  city: string;
};

function sanitize(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/[\r\n\t]/g, " ")
    .replace(/\|/g, " ")
    .trim()
    .slice(0, 500);
}

function isLogType(value: unknown): value is LogType {
  return (
    typeof value === "string" &&
    (LOG_TYPES as readonly string[]).includes(value)
  );
}

function buildPayload(
  body: Record<string, unknown>,
  geo?: { country?: string; region?: string; city?: string },
): LogPayload {
  return {
    type: body.type as LogType,
    ts: sanitize(body.ts) || new Date().toISOString(),
    cid: sanitize(body.cid) || "null",
    device: sanitize(body.device) || "Unknown",
    browser: sanitize(body.browser) || "Unknown",
    os: sanitize(body.os) || "Unknown",
    viewport: sanitize(body.viewport) || "Unknown",
    language: sanitize(body.language) || "Unknown",
    timezone: sanitize(body.timezone) || "Unknown",
    path: sanitize(body.path) || "/",
    referrer: sanitize(body.referrer) || "null",
    userAgent: sanitize(body.userAgent) || "Unknown",
    country: sanitize(geo?.country) || "Unknown",
    region: sanitize(geo?.region) || "Unknown",
    city: sanitize(geo?.city) || "Unknown",
  };
}

function extractGeo(headers: Headers): {
  country?: string;
  region?: string;
  city?: string;
} {
  return {
    country: headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || undefined,
    region: headers.get("x-vercel-ip-country-region") || undefined,
    city: headers.get("x-vercel-ip-city") || undefined,
  };
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    webhookConfigured: Boolean(WEBHOOK_URL),
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 },
    );
  }

  if (!isLogType(body.type)) {
    return NextResponse.json(
      { ok: false, error: "invalid type" },
      { status: 400 },
    );
  }

  const payload = buildPayload(body, extractGeo(request.headers));

  if (WEBHOOK_URL) {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const bodyText = (await res.text()).slice(0, 300);
        console.warn(
          `[visit-log] webhook returned ${res.status}: ${bodyText}`,
        );
        return NextResponse.json(
          { ok: false, error: `webhook status ${res.status}` },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true, forwarded: true });
    } catch {
      return NextResponse.json(
        { ok: false, error: "webhook unreachable" },
        { status: 502 },
      );
    }
  }

  console.warn("[visit-log] LOG_WEBHOOK_URL is not set — webhook skipped");
  return NextResponse.json({ ok: true, forwarded: false });
}