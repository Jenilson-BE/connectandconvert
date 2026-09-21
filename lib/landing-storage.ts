import fs from "fs";
import path from "path";
import { getDb } from "./mongodb";
import {
  LandingPageConfig,
  VisitLogEntry,
  PageAnalyticsReport,
  DistributionItem,
  AttributionItem,
} from "./landing-types";

const DATA_DIR = path.join(process.cwd(), "data");
const PAGES_FILE = path.join(DATA_DIR, "landing-pages.json");
const LOGS_FILE = path.join(DATA_DIR, "visit-logs.json");

const PAGES_COLLECTION = "landing_pages";
const LOGS_COLLECTION = "visit_logs";

let indexesCreated = false;

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
  } catch (err) {
    // Indexes will be retried on next call
  }
}

// --------------------------------------------------------------------------
// File Storage Fallbacks
// --------------------------------------------------------------------------
function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PAGES_FILE)) {
    fs.writeFileSync(PAGES_FILE, JSON.stringify([], null, 2), "utf-8");
  }
  if (!fs.existsSync(LOGS_FILE)) {
    fs.writeFileSync(LOGS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

function getFileLandingPages(): LandingPageConfig[] {
  try {
    ensureDataFiles();
    const raw = fs.readFileSync(PAGES_FILE, "utf-8");
    return JSON.parse(raw) as LandingPageConfig[];
  } catch (err) {
    console.error("Error reading landing pages file:", err);
    return [];
  }
}

function saveFileLandingPages(pages: LandingPageConfig[]) {
  try {
    ensureDataFiles();
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing landing pages file:", err);
  }
}

function getFileVisitLogs(): VisitLogEntry[] {
  try {
    ensureDataFiles();
    const raw = fs.readFileSync(LOGS_FILE, "utf-8");
    return JSON.parse(raw) as VisitLogEntry[];
  } catch {
    return [];
  }
}

function saveFileVisitLogs(logs: VisitLogEntry[]) {
  try {
    ensureDataFiles();
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing visit logs file:", err);
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
      const cleanDocs = docs.map(({ _id, ...rest }: any) => rest as LandingPageConfig);
      // Sync to file mirror
      saveFileLandingPages(cleanDocs);
      return cleanDocs;
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
        .findOne({ slug: { $regex: new RegExp(`^${slug}$`, "i") } });
      if (doc) {
        const { _id, ...rest } = doc as any;
        return rest as LandingPageConfig;
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
        const { _id, ...rest } = doc as any;
        return rest as LandingPageConfig;
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
  const cleanSlug = (page.slug || "").trim().toLowerCase();

  const preparedPage: LandingPageConfig = {
    ...page,
    id: pageId,
    slug: cleanSlug,
    updatedAt: now,
    createdAt: page.createdAt || now,
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
    }
  } catch (err) {
    console.warn("MongoDB saveLandingPage warning:", err);
  }

  // Update file mirror
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
  let deleted = false;
  try {
    const db = await getDb();
    if (db) {
      const res = await db.collection(PAGES_COLLECTION).deleteOne({ id });
      if (res.deletedCount > 0) deleted = true;
    }
  } catch (err) {
    console.warn("MongoDB deleteLandingPage warning:", err);
  }

  // Sync with file mirror
  const filePages = getFileLandingPages();
  const filtered = filePages.filter((p) => p.id !== id);
  if (filtered.length !== filePages.length) {
    deleted = true;
    saveFileLandingPages(filtered);
  }

  return deleted;
}

// --------------------------------------------------------------------------
// Visit Logs & Analytics Operations (MongoDB + File Fallback)
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

  // 1. Update in MongoDB
  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      // Insert log document
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

  // 2. Sync to file mirror
  try {
    const pages = getFileLandingPages();
    const pageIdx = pages.findIndex((p) => p.slug.toLowerCase() === cleanSlug);
    if (pageIdx >= 0) {
      if (type === "websitevisit") {
        pages[pageIdx].visits = (pages[pageIdx].visits || 0) + 1;
      } else if (type === "subscribe") {
        pages[pageIdx].clicks = (pages[pageIdx].clicks || 0) + 1;
        pages[pageIdx].subscribes = (pages[pageIdx].subscribes || 0) + 1;
      } else if (type === "autoredirect") {
        pages[pageIdx].clicks = (pages[pageIdx].clicks || 0) + 1;
        pages[pageIdx].autoredirects = (pages[pageIdx].autoredirects || 0) + 1;
      }
      saveFileLandingPages(pages);
    }

    const logs = getFileVisitLogs();
    logs.unshift(newLog);
    if (logs.length > 1500) logs.pop();
    saveFileVisitLogs(logs);
  } catch (err) {
    console.error("Error mirroring visit to file:", err);
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
      return docs.map(({ _id, ...rest }: any) => rest as VisitLogEntry);
    }
  } catch (err) {
    console.warn("MongoDB getRecentVisitLogs fallback to file:", err);
  }

  const logs = getFileVisitLogs();
  return logs.slice(0, limit);
}

export async function getPageReport(slug: string): Promise<PageAnalyticsReport | null> {
  const cleanSlug = slug.toLowerCase();
  const page = await getLandingPageBySlug(cleanSlug);
  if (!page) return null;

  let pageLogs: VisitLogEntry[] = [];

  try {
    const db = await getDb();
    if (db) {
      await ensureIndexes();
      const docs = await db
        .collection<VisitLogEntry>(LOGS_COLLECTION)
        .find({ slug: cleanSlug })
        .sort({ ts: -1 })
        .limit(1000)
        .toArray();
      pageLogs = docs.map(({ _id, ...rest }: any) => rest as VisitLogEntry);
    }
  } catch (err) {
    console.warn("MongoDB getPageReport fallback to file logs:", err);
  }

  if (pageLogs.length === 0) {
    const allLogs = getFileVisitLogs();
    pageLogs = allLogs.filter((l) => l.slug.toLowerCase() === cleanSlug);
  }

  // Compute metrics
  const logLandings = pageLogs.filter((l) => l.type === "websitevisit").length;
  const logSubscribes = pageLogs.filter((l) => l.type === "subscribe").length;
  const logAutoredirects = pageLogs.filter((l) => l.type === "autoredirect").length;

  const totalLanding = Math.max(page.visits || 0, logLandings);
  const totalSubscribe = Math.max(page.subscribes || 0, logSubscribes);
  const totalAutoredirect = Math.max(page.autoredirects || 0, logAutoredirects);
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
    recentLogs: pageLogs.slice(0, 100),
  };
}
