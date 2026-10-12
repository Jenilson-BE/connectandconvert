import fs from "fs";
import path from "path";
import { getDb } from "./mongodb";
import {
  LandingPageConfig,
  VisitLogEntry,
  PageAnalyticsReport,
  DistributionItem,
  AttributionItem,
  DailyPerformanceRow,
} from "./landing-types";
import {
  IST_TIME_ZONE,
  DAILY_REPORT_MAX_DAYS,
  finalizeDailyRow,
  getIstRangeStartDayKey,
  istDayKeyToUtcStartIso,
  resolveReportRange,
} from "./landing-analytics/daily";
import { normalizeMetaPixelId, isValidMetaPixelId } from "./meta-pixel-id";

const DATA_DIR = path.join(process.cwd(), "data");
const PAGES_FILE = path.join(DATA_DIR, "landing-pages.json");

const PAGES_COLLECTION = "landing_pages";
const LOGS_COLLECTION = "visit_logs";

let indexesCreated = false;

export function sanitizeSlug(slug: unknown): string {
  if (typeof slug !== "string") return "";
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function ensureIndexes() {
  if (indexesCreated) return;
  try {
    const db = await getDb();
    if (!db) return;
    await db.collection(PAGES_COLLECTION).createIndex({ slug: 1 }, { unique: true });
    await db.collection(PAGES_COLLECTION).createIndex({ id: 1 }, { unique: true });
    await db.collection(LOGS_COLLECTION).createIndex({ slug: 1, ts: -1 });
    await db.collection(LOGS_COLLECTION).createIndex({ type: 1 });
    indexesCreated = true;
  } catch {
    // Indexes are retried on the next call.
  }
}

function stripId<T extends { _id?: unknown }>(doc: T): Omit<T, "_id"> {
  const { _id, ...rest } = doc as T & { _id?: unknown };
  void _id;
  return rest;
}

// --------------------------------------------------------------------------
// File Storage Fallbacks (Read seed data / safe local fallback)
// --------------------------------------------------------------------------
function getFileLandingPages(): LandingPageConfig[] {
  try {
    if (fs.existsSync(PAGES_FILE)) {
      const raw = fs.readFileSync(PAGES_FILE, "utf-8");
      return JSON.parse(raw) as LandingPageConfig[];
    }
  } catch (err) {
    console.warn("Error reading landing pages file:", err);
  }
  return [];
}

function saveFileLandingPages(pages: LandingPageConfig[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2), "utf-8");
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "EROFS"
    ) {
      // In serverless environments (read-only filesystem), ignore EROFS silently
      return;
    }
    console.warn("Could not write landing pages file:", err);
  }
}

// --------------------------------------------------------------------------
// Landing Pages Operations (MongoDB + File Fallback)
// --------------------------------------------------------------------------
export async function getAllLandingPages(): Promise<LandingPageConfig[]> {
  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      const docs = await db
        .collection<LandingPageConfig>(PAGES_COLLECTION)
        .find({})
        .sort({ updatedAt: -1 })
        .toArray();
      // Remove MongoDB internal _id field
      return docs.map((d) => stripId(d) as LandingPageConfig);
    }
  } catch (err) {
    console.warn("MongoDB getAllLandingPages fallback to file:", err);
  }

  return getFileLandingPages();
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPageConfig | null> {
  if (!slug) return null;
  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      const doc = await db
        .collection<LandingPageConfig>(PAGES_COLLECTION)
        .findOne({ slug: { $regex: new RegExp(`^${escapeRegExp(slug)}$`, "i") } });
      if (doc) {
        return stripId(doc) as LandingPageConfig;
      }
    }
  } catch (err) {
    console.warn("MongoDB getLandingPageBySlug fallback to file:", err);
  }

  const pages = getFileLandingPages();
  return pages.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function getLandingPageById(id: string): Promise<LandingPageConfig | null> {
  if (!id) return null;
  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      const doc = await db
        .collection<LandingPageConfig>(PAGES_COLLECTION)
        .findOne({ id });
      if (doc) {
        return stripId(doc) as LandingPageConfig;
      }
    }
  } catch (err) {
    console.warn("MongoDB getLandingPageById fallback to file:", err);
  }

  const pages = getFileLandingPages();
  return pages.find((p) => p.id === id) || null;
}

export async function saveLandingPage(page: LandingPageConfig): Promise<LandingPageConfig> {
  const now = new Date().toISOString();
  const pageId = page.id || `lp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanSlug = sanitizeSlug(page.slug);
  const pixelId = normalizeMetaPixelId(page.metaPixelId);

  const preparedPage: LandingPageConfig = {
    ...page,
    id: pageId,
    slug: cleanSlug,
    updatedAt: now,
    createdAt: page.createdAt || now,
    metaPixelId: isValidMetaPixelId(pixelId) ? pixelId : undefined,
    visits: Number(page.visits) || 0,
    clicks: Number(page.clicks) || 0,
    subscribes: Number(page.subscribes) || 0,
    autoredirects: Number(page.autoredirects) || 0,
  };

  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      await db.collection(PAGES_COLLECTION).updateOne(
        { id: preparedPage.id },
        { $set: preparedPage },
        { upsert: true }
      );
      return preparedPage;
    }
  } catch (err) {
    console.warn("MongoDB saveLandingPage warning:", err);
  }

  // Update file only if MongoDB is not available (local offline development)
  const filePages = getFileLandingPages();
  const existingIdx = filePages.findIndex((p) => p.id === preparedPage.id);
  if (existingIdx >= 0) {
    filePages[existingIdx] = preparedPage;
  } else {
    filePages.unshift(preparedPage);
  }
  saveFileLandingPages(filePages);

  return preparedPage;
}

export async function deleteLandingPage(id: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (db) {
      const res = await db.collection(PAGES_COLLECTION).deleteOne({ id });
      return res.deletedCount > 0;
    }
  } catch (err) {
    console.warn("MongoDB deleteLandingPage warning:", err);
  }

  // Fallback for local development when MongoDB is not connected
  const filePages = getFileLandingPages();
  const filtered = filePages.filter((p) => p.id !== id);
  if (filtered.length !== filePages.length) {
    saveFileLandingPages(filtered);
    return true;
  }

  return false;
}

// --------------------------------------------------------------------------
// Visit Logs & Analytics Operations (Database Only - No Folder Logs)
// --------------------------------------------------------------------------
export async function recordVisit(
  slug: string,
  type: "websitevisit" | "subscribe" | "autoredirect",
  logData: Partial<VisitLogEntry>
): Promise<void> {
  const cleanSlug = slug.toLowerCase();
  const newLog: VisitLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    slug: cleanSlug,
    type,
    ts: new Date().toISOString(),
    device: logData.device || "Unknown",
    browser: logData.browser || "Unknown",
    os: logData.os || "Unknown",
    path: logData.path || `/lp/${cleanSlug}`,
    referrer: logData.referrer || "",
    cid: logData.cid || null,
    country: logData.country || "IN",
    city: logData.city || "",
    attribution: logData.attribution || {},
  };

  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      // Insert log document into MongoDB
      await db.collection(LOGS_COLLECTION).insertOne(newLog);

      // Increment counters on page document
      const incField: Record<string, number> = {};
      if (type === "websitevisit") {
        incField.visits = 1;
      } else if (type === "subscribe") {
        incField.clicks = 1;
        incField.subscribes = 1;
      } else if (type === "autoredirect") {
        incField.clicks = 1;
        incField.autoredirects = 1;
      }

      if (Object.keys(incField).length > 0) {
        await db.collection(PAGES_COLLECTION).updateOne(
          { slug: cleanSlug },
          { $inc: incField }
        );
      }
    }
  } catch (err) {
    console.warn("MongoDB recordVisit warning:", err);
  }
}

export async function getRecentVisitLogs(limit = 50): Promise<VisitLogEntry[]> {
  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      const docs = await db
        .collection<VisitLogEntry>(LOGS_COLLECTION)
        .find({})
        .sort({ ts: -1 })
        .limit(limit)
        .toArray();
      return docs.map((d) => stripId(d) as VisitLogEntry);
    }
  } catch (err) {
    console.warn("MongoDB getRecentVisitLogs warning:", err);
  }

  return [];
}

export interface GetPageReportOptions {
  /** Inclusive IST day key, or null/undefined for "since the beginning". */
  from?: string | null;
  /** Inclusive IST day key, or null/undefined for "up to today". */
  to?: string | null;
  /** Rolling window used for the day-wise series when no explicit range is set. */
  days?: number;
}

interface EventCounts {
  landings: number;
  subscribes: number;
  autoredirects: number;
}

function buildLogQuery(
  cleanSlug: string,
  fromIso: string | null,
  toIso: string | null
): Record<string, unknown> {
  if (!fromIso && !toIso) return { slug: cleanSlug };
  const ts: Record<string, string> = {};
  if (fromIso) ts.$gte = fromIso;
  if (toIso) ts.$lt = toIso;
  return { slug: cleanSlug, ts };
}

/**
 * Exact per-type event totals for a window.
 *
 * The report's headline metrics must not be capped by the raw-log read limit,
 * so they are counted by the database rather than derived in memory.
 */
async function getEventCounts(
  cleanSlug: string,
  fromIso: string | null,
  toIso: string | null
): Promise<EventCounts> {
  const empty: EventCounts = { landings: 0, subscribes: 0, autoredirects: 0 };

  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      const [row] = await db
        .collection(LOGS_COLLECTION)
        .aggregate<{ landings: number; subscribes: number; autoredirects: number }>([
          { $match: buildLogQuery(cleanSlug, fromIso, toIso) },
          {
            $group: {
              _id: null,
              landings: { $sum: { $cond: [{ $eq: ["$type", "websitevisit"] }, 1, 0] } },
              subscribes: { $sum: { $cond: [{ $eq: ["$type", "subscribe"] }, 1, 0] } },
              autoredirects: { $sum: { $cond: [{ $eq: ["$type", "autoredirect"] }, 1, 0] } },
            },
          },
        ])
        .toArray();

      if (!row) return empty;
      return {
        landings: row.landings || 0,
        subscribes: row.subscribes || 0,
        autoredirects: row.autoredirects || 0,
      };
    }
  } catch (err) {
    console.warn("MongoDB getEventCounts warning:", err);
  }

  return empty;
}

export async function getDailyBreakdown(
  slug: string,
  options: GetPageReportOptions = {}
): Promise<DailyPerformanceRow[]> {
  const cleanSlug = slug.toLowerCase();
  const range = resolveReportRange(options.from, options.to);
  const fromIso = range.active
    ? range.fromIso
    : istDayKeyToUtcStartIso(getIstRangeStartDayKey(options.days ?? DAILY_REPORT_MAX_DAYS));
  const toIso = range.active ? range.toIso : null;
  const match = buildLogQuery(cleanSlug, fromIso, toIso);

  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      // `ts` is persisted as a UTC ISO string (not a BSON date), so the range
      // bound must be a string and the day key is derived after parsing.
      const rows = await db
        .collection(LOGS_COLLECTION)
        .aggregate<{
          _id: string;
          landings: number;
          subscribes: number;
          autoredirects: number;
        }>([
          { $match: match },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: { $dateFromString: { dateString: "$ts" } },
                  timezone: IST_TIME_ZONE,
                },
              },
              landings: {
                $sum: { $cond: [{ $eq: ["$type", "websitevisit"] }, 1, 0] },
              },
              subscribes: {
                $sum: { $cond: [{ $eq: ["$type", "subscribe"] }, 1, 0] },
              },
              autoredirects: {
                $sum: { $cond: [{ $eq: ["$type", "autoredirect"] }, 1, 0] },
              },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray();

      return rows.map((row) =>
        finalizeDailyRow({
          date: row._id,
          landings: row.landings,
          subscribes: row.subscribes,
          autoredirects: row.autoredirects,
        })
      );
    }
  } catch (err) {
    console.warn("MongoDB getDailyBreakdown warning:", err);
  }

  return [];
}

export async function getPageReport(
  slug: string,
  options: GetPageReportOptions = {}
): Promise<PageAnalyticsReport | null> {
  const cleanSlug = slug.toLowerCase();
  const page = await getLandingPageBySlug(cleanSlug);
  if (!page) return null;

  const range = resolveReportRange(options.from, options.to);
  const fromIso = range.active ? range.fromIso : null;
  const toIso = range.active ? range.toIso : null;

  let pageLogs: VisitLogEntry[] = [];

  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      const docs = await db
        .collection<VisitLogEntry>(LOGS_COLLECTION)
        .find(buildLogQuery(cleanSlug, fromIso, toIso))
        .sort({ ts: -1 })
        .limit(1000)
        .toArray();
      pageLogs = docs.map((d) => stripId(d) as VisitLogEntry);
    }
  } catch (err) {
    console.warn("MongoDB getPageReport warning:", err);
  }

  // Trim the file mirror to the requested window as well.
  if (range.active) {
    pageLogs = pageLogs.filter((l) => {
      if (fromIso && l.ts < fromIso) return false;
      if (toIso && l.ts >= toIso) return false;
      return true;
    });
  }

  // Compute metrics
  const logLandings = pageLogs.filter((l) => l.type === "websitevisit").length;
  const logSubscribes = pageLogs.filter((l) => l.type === "subscribe").length;
  const logAutoredirects = pageLogs.filter((l) => l.type === "autoredirect").length;

  let totalLanding: number;
  let totalSubscribe: number;
  let totalAutoredirect: number;

  if (range.active) {
    // The lifetime counters on the page carry no dates, so they cannot answer
    // "how many on this day". Count exactly, with no raw-log cap.
    const counts = await getEventCounts(cleanSlug, fromIso, toIso);
    totalLanding = counts.landings;
    totalSubscribe = counts.subscribes;
    totalAutoredirect = counts.autoredirects;
  } else {
    totalLanding = Math.max(page.visits || 0, logLandings);
    totalSubscribe = Math.max(page.subscribes || 0, logSubscribes);
    totalAutoredirect = Math.max(page.autoredirects || 0, logAutoredirects);
  }

  const totalConversions = totalSubscribe + totalAutoredirect;

  const subscribeCtr =
    totalLanding > 0 ? ((totalSubscribe / totalLanding) * 100).toFixed(1) + "%" : "0.0%";
  const autoredirectRate =
    totalLanding > 0 ? ((totalAutoredirect / totalLanding) * 100).toFixed(1) + "%" : "0.0%";
  const overallConversionRate =
    totalLanding > 0 ? ((totalConversions / totalLanding) * 100).toFixed(1) + "%" : "0.0%";

  // Distribution helper
  const buildDistribution = (items: string[]): DistributionItem[] => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      const key = item || "Direct / Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
    const total = items.length || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: `${((count / total) * 100).toFixed(1)}%`,
      }))
      .sort((a, b) => b.count - a.count);
  };

  const deviceBreakdown = buildDistribution(pageLogs.map((l) => l.device));
  const browserBreakdown = buildDistribution(pageLogs.map((l) => l.browser));
  const osBreakdown = buildDistribution(pageLogs.map((l) => l.os));

  // Attribution breakdown
  const attributionCounts: Record<string, { source: string; medium: string; campaign: string; count: number }> = {};
  pageLogs.forEach((l) => {
    const attr = l.attribution || {};
    const source = attr.utm_source || (l.referrer ? new URL(l.referrer, "https://connectandconvert.tech").hostname : "Direct / None");
    const medium = attr.utm_medium || "cpc/organic";
    const campaign = attr.utm_campaign || "Default Campaign";
    const key = `${source}::${medium}::${campaign}`;

    if (!attributionCounts[key]) {
      attributionCounts[key] = { source, medium, campaign, count: 0 };
    }
    attributionCounts[key].count += 1;
  });

  const totalLogs = pageLogs.length || 1;
  const attributionBreakdown: AttributionItem[] = Object.values(attributionCounts)
    .map((item) => ({
      ...item,
      percentage: `${((item.count / totalLogs) * 100).toFixed(1)}%`,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    page,
    generatedAt: new Date().toISOString(),
    appliedRange: { from: range.from, to: range.to },
    metrics: {
      totalLanding,
      totalSubscribe,
      totalAutoredirect,
      totalConversions,
      subscribeCtr,
      autoredirectRate,
      overallConversionRate,
    },
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    attributionBreakdown,
    dailyBreakdown: await getDailyBreakdown(cleanSlug, options),
    recentLogs: pageLogs.slice(0, 100),
  };
}
