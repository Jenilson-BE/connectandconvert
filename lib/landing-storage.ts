import fs from "fs";
import path from "path";
import { LandingPageConfig, VisitLogEntry } from "./landing-types";

const DATA_DIR = path.join(process.cwd(), "data");
const PAGES_FILE = path.join(DATA_DIR, "landing-pages.json");
const LOGS_FILE = path.join(DATA_DIR, "visit-logs.json");

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

export function getAllLandingPages(): LandingPageConfig[] {
  try {
    ensureDataFiles();
    const raw = fs.readFileSync(PAGES_FILE, "utf-8");
    return JSON.parse(raw) as LandingPageConfig[];
  } catch (err) {
    console.error("Error reading landing pages:", err);
    return [];
  }
}

export function getLandingPageBySlug(slug: string): LandingPageConfig | null {
  const pages = getAllLandingPages();
  return pages.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export function getLandingPageById(id: string): LandingPageConfig | null {
  const pages = getAllLandingPages();
  return pages.find((p) => p.id === id) || null;
}

export function saveLandingPage(page: LandingPageConfig): LandingPageConfig {
  ensureDataFiles();
  const pages = getAllLandingPages();
  const existingIdx = pages.findIndex((p) => p.id === page.id);

  const now = new Date().toISOString();
  let updatedPage: LandingPageConfig;

  if (existingIdx >= 0) {
    updatedPage = {
      ...pages[existingIdx],
      ...page,
      updatedAt: now,
    };
    pages[existingIdx] = updatedPage;
  } else {
    updatedPage = {
      ...page,
      id: page.id || `lp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      visits: 0,
      clicks: 0,
    };
    pages.unshift(updatedPage);
  }

  fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2), "utf-8");
  return updatedPage;
}

export function deleteLandingPage(id: string): boolean {
  ensureDataFiles();
  const pages = getAllLandingPages();
  const filtered = pages.filter((p) => p.id !== id);
  if (filtered.length === pages.length) return false;

  fs.writeFileSync(PAGES_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export function recordVisit(slug: string, type: "websitevisit" | "subscribe" | "autoredirect", logData: Partial<VisitLogEntry>) {
  try {
    ensureDataFiles();
    // 1. Update page visit/click counter
    const pages = getAllLandingPages();
    const pageIdx = pages.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (pageIdx >= 0) {
      if (type === "websitevisit") {
        pages[pageIdx].visits = (pages[pageIdx].visits || 0) + 1;
      } else {
        pages[pageIdx].clicks = (pages[pageIdx].clicks || 0) + 1;
      }
      fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2), "utf-8");
    }

    // 2. Append to visit logs
    const rawLogs = fs.readFileSync(LOGS_FILE, "utf-8");
    const logs: VisitLogEntry[] = JSON.parse(rawLogs);

    const newLog: VisitLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slug,
      type,
      ts: new Date().toISOString(),
      device: logData.device || "Unknown",
      browser: logData.browser || "Unknown",
      os: logData.os || "Unknown",
      path: logData.path || `/lp/${slug}`,
      referrer: logData.referrer || "",
      cid: logData.cid || null,
      country: logData.country || "IN",
      city: logData.city || "",
      attribution: logData.attribution || {},
    };

    // Keep last 1000 logs
    logs.unshift(newLog);
    if (logs.length > 1000) logs.pop();

    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (err) {
    console.error("Error recording visit log:", err);
  }
}

export function getRecentVisitLogs(limit = 50): VisitLogEntry[] {
  try {
    ensureDataFiles();
    const rawLogs = fs.readFileSync(LOGS_FILE, "utf-8");
    const logs: VisitLogEntry[] = JSON.parse(rawLogs);
    return logs.slice(0, limit);
  } catch {
    return [];
  }
}
