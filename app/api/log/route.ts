import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getLandingPageBySlug, recordVisit, sanitizeSlug } from "@/lib/landing-storage";
import { getClientIp } from "@/lib/admin-guard";
import { checkRateLimit } from "@/lib/rate-limit";

/** Hard cap on the request body; a real beacon is well under 1 KB. */
const MAX_BODY_BYTES = 16 * 1024;

/**
 * A single visitor produces a handful of beacons per session, so 120/minute
 * is generous for real traffic while capping a scripted flood.
 */
const LOG_LIMIT = { limit: 120, windowMs: 60 * 1000 };

const VISIT_TYPES = ["websitevisit", "subscribe", "autoredirect"] as const;

/** Strips control characters and caps length for free-form client strings. */
const safeText = (max: number) =>
  z
    .string()
    .max(max)
    // eslint-disable-next-line no-control-regex
    .transform((value) => value.replace(/[\u0000-\u001F\u007F]/g, "").trim());

const attributionSchema = z
  .object({
    utmSource: z.union([safeText(120), z.null()]).optional(),
    utmMedium: z.union([safeText(120), z.null()]).optional(),
    utmCampaign: z.union([safeText(200), z.null()]).optional(),
    utmContent: z.union([safeText(200), z.null()]).optional(),
    utmTerm: z.union([safeText(200), z.null()]).optional(),
    fbclid: z.union([safeText(200), z.null()]).optional(),
    gclid: z.union([safeText(200), z.null()]).optional(),
    cid: z.union([safeText(200), z.null()]).optional(),
  })
  // Drop any unexpected keys an attacker appends.
  .strip();

const logSchema = z
  .object({
    type: z.enum(VISIT_TYPES),
    slug: z.union([z.string().max(200), z.null()]).optional(),
    path: z.union([z.string().max(2048), z.null()]).optional(),
    device: z.union([z.enum(["Mobile", "Desktop"]), z.null()]).optional(),
    browser: z.union([safeText(40), z.null()]).optional(),
    os: z.union([safeText(40), z.null()]).optional(),
    referrer: z.union([z.string().max(2048), z.null()]).optional(),
    cid: z.union([safeText(200), z.null()]).optional(),
    attribution: attributionSchema.optional(),
  })
  .strip();

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`visit-log:${ip}`, LOG_LIMIT);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.max(rate.retryAfterSeconds, 1)) } }
    );
  }

  // Read as text first so the size can be capped before any parsing.
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413 }
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const validation = logSchema.safeParse(parsed);
  if (!validation.success) {
    return NextResponse.json({ ok: false, error: "Invalid log payload" }, { status: 400 });
  }

  const data = validation.data;

  // Only real landing pages may receive events, so arbitrary slugs cannot be
  // invented to pollute the database or inflate another page's counters.
  const safeSlug = sanitizeSlug(
    data.slug || (data.path ? String(data.path).replace(/^\/lp\//, "") : "")
  );

  if (!safeSlug) {
    return NextResponse.json({ ok: true });
  }

  const page = await getLandingPageBySlug(safeSlug);
  if (!page) {
    return NextResponse.json({ ok: false, error: "Unknown landing page" }, { status: 404 });
  }

  const logData = {
    device: data.device ?? undefined,
    browser: data.browser ?? undefined,
    os: data.os ?? undefined,
    path: data.path ?? undefined,
    referrer: data.referrer ?? undefined,
    cid: data.cid ?? undefined,
    attribution: data.attribution ?? undefined,
  };

  try {
    await recordVisit(safeSlug, data.type, logData);
  } catch (error) {
    console.error("recordVisit failed:", error);
    return NextResponse.json({ ok: false, error: "Failed to process log" }, { status: 500 });
  }

  // Optional webhook forwarding. Sends only the validated, normalised fields
  // so the endpoint cannot be used to inject arbitrary keys downstream.
  const webhookUrl = process.env.LOG_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: safeSlug, type: data.type, ...logData }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.warn("Log webhook forwarding warning:", err);
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json(
    { ok: true, active: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
