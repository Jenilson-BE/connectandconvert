import { DailyPerformanceRow, ReportDateRange, VisitLogEntry } from "@/lib/landing-types";

/**
 * Day-wise performance bucketing.
 *
 * Visit logs are stored with `ts` as a UTC ISO-8601 *string*. Reporting is
 * bucketed by the IST (Asia/Kolkata, UTC+05:30) business day, which is what
 * the agency's ad platforms and the team reason in. IST observes no daylight
 * saving, so a fixed offset is exact and needs no timezone database.
 */
export const IST_TIME_ZONE = "Asia/Kolkata";
export const IST_OFFSET_MINUTES = 330;
export const DAILY_REPORT_MAX_DAYS = 90;
export const REPORT_RANGE_MAX_DAYS = 366;

const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function istDayKeyFromMs(ms: number): string {
  const shifted = new Date(ms + IST_OFFSET_MINUTES * MS_PER_MINUTE);
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`;
}

/** Map any log timestamp to its IST calendar day key (YYYY-MM-DD). */
export function toIstDayKey(ts: string): string {
  const parsed = new Date(ts);
  if (Number.isNaN(parsed.getTime())) return "";
  return istDayKeyFromMs(parsed.getTime());
}

/** Day key for the IST day `days`-1 days before today (inclusive window). */
export function getIstRangeStartDayKey(days: number): string {
  const window = Math.max(1, Math.floor(days));
  const now = new Date();
  const todayIstMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  return istDayKeyFromMs(todayIstMidnight - (window - 1) * MS_PER_DAY - IST_OFFSET_MINUTES * MS_PER_MINUTE);
}

/** Day key for today in IST. */
export function getIstTodayDayKey(): string {
  return toIstDayKey(new Date().toISOString());
}

/** True when the value is a real, parseable YYYY-MM-DD calendar day. */
export function isValidDayKey(value: unknown): value is string {
  if (typeof value !== "string" || !DAY_KEY_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  // Reject overflow like 2026-02-31, which Date would roll forward.
  return parsed.toISOString().slice(0, 10) === value;
}

export function dayKeyToUtcMs(dayKey: string): number {
  const [year, month, day] = dayKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Number of IST days between two day keys, inclusive of both ends. */
export function countDaysInclusive(from: string, to: string): number {
  return Math.floor((dayKeyToUtcMs(to) - dayKeyToUtcMs(from)) / MS_PER_DAY) + 1;
}

export function shiftDayKey(dayKey: string, days: number): string {
  return istDayKeyFromMs(dayKeyToUtcMs(dayKey) + days * MS_PER_DAY);
}

/**
 * UTC start instant of an IST day key, as an ISO string.
 * Used as a lower bound for Mongo queries, which must stay a *string* because
 * `ts` is stored as a BSON string rather than a BSON date.
 */
export function istDayKeyToUtcStartIso(dayKey: string): string {
  return new Date(dayKeyToUtcMs(dayKey) - IST_OFFSET_MINUTES * MS_PER_MINUTE).toISOString();
}

/**
 * Exclusive UTC upper bound covering the whole of the given IST day.
 * Using an exclusive bound keeps the query correct at the final millisecond.
 */
export function istDayKeyToUtcEndIso(dayKey: string): string {
  return istDayKeyToUtcStartIso(shiftDayKey(dayKey, 1));
}

/** Derive conversions and conversion rate from raw per-type counts. */
export function finalizeDailyRow(row: {
  date: string;
  landings: number;
  subscribes: number;
  autoredirects: number;
}): DailyPerformanceRow {
  const conversions = row.subscribes + row.autoredirects;
  return {
    date: row.date,
    landings: row.landings,
    subscribes: row.subscribes,
    autoredirects: row.autoredirects,
    conversions,
    conversionRate:
      row.landings > 0 ? `${((conversions / row.landings) * 100).toFixed(1)}%` : "0.0%",
  };
}

/** Human label for a day key, e.g. "2026-09-21" -> "21 Sep". */
export function formatDayLabel(dayKey: string): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  if (!year || !month || !day) return dayKey;
  const monthLabel = new Date(dayKeyToUtcMs(dayKey))
    .toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })
    .slice(0, 3);
  return `${day} ${monthLabel}`;
}

/** Full human label including weekday and year, for tables and tooltips. */
export function formatFullDayLabel(dayKey: string): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  if (!year || !month || !day) return dayKey;
  return new Date(dayKeyToUtcMs(dayKey)).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Insert explicit zero rows for days inside an explicit range that had no
 * tracked events, so a chosen window reads as a continuous series.
 */
export function fillMissingDays(
  rows: DailyPerformanceRow[],
  from: string,
  to: string
): DailyPerformanceRow[] {
  const byDate = new Map(rows.map((row) => [row.date, row]));
  const out: DailyPerformanceRow[] = [];
  const span = countDaysInclusive(from, to);

  for (let i = 0; i < span; i += 1) {
    const key = shiftDayKey(from, i);
    out.push(
      byDate.get(key) ??
        finalizeDailyRow({ date: key, landings: 0, subscribes: 0, autoredirects: 0 })
    );
  }

  return out;
}

/**
 * Bucket visit logs into a day-wise series. Days with no events are omitted.
 * Sorts ascending by day key. Used for the file-storage fallback, and it must
 * produce results identical to the Mongo aggregation path.
 */
export function buildDailyRows(
  logs: VisitLogEntry[],
  sinceIso?: string
): DailyPerformanceRow[] {
  const sinceMs = sinceIso ? new Date(sinceIso).getTime() : Number.NEGATIVE_INFINITY;

  const buckets = new Map<
    string,
    { landings: number; subscribes: number; autoredirects: number }
  >();

  for (const log of logs) {
    const tsMs = new Date(log.ts).getTime();
    if (Number.isNaN(tsMs) || tsMs < sinceMs) continue;

    const key = istDayKeyFromMs(tsMs);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { landings: 0, subscribes: 0, autoredirects: 0 };
      buckets.set(key, bucket);
    }

    if (log.type === "websitevisit") bucket.landings += 1;
    else if (log.type === "subscribe") bucket.subscribes += 1;
    else if (log.type === "autoredirect") bucket.autoredirects += 1;
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, counts]) => finalizeDailyRow({ date, ...counts }));
}

export interface ResolvedReportRange extends ReportDateRange {
  /** True when the caller supplied an explicit window. */
  active: boolean;
  fromIso: string | null;
  toIso: string | null;
  /** Populated only when clamped, so callers can warn the user. */
  clampedToDays: number | null;
}

/**
 * Turn user-supplied day keys into a safe query window.
 *
 * A single `from`/`to` pair may omit either end to mean "up to now" or
 * "since the beginning". Ranges are capped at REPORT_RANGE_MAX_DAYS and can
 * never end in the future.
 */
export function resolveReportRange(
  from?: string | null,
  to?: string | null,
  maxDays: number = REPORT_RANGE_MAX_DAYS
): ResolvedReportRange {
  const today = getIstTodayDayKey();

  let start = isValidDayKey(from) ? from : null;
  let end = isValidDayKey(to) ? to : null;

  if (start && end && start > end) {
    [start, end] = [end, start];
  }
  if (end && end > today) end = today;
  if (start && start > today) start = today;
  if (start && end && start > end) {
    start = null;
    end = null;
  }

  if (!start && !end) {
    return { from: null, to: null, active: false, fromIso: null, toIso: null, clampedToDays: null };
  }

  let clampedToDays: number | null = null;
  if (start && end && countDaysInclusive(start, end) > maxDays) {
    start = shiftDayKey(end, -(maxDays - 1));
    clampedToDays = maxDays;
  }

  return {
    from: start,
    to: end,
    active: true,
    fromIso: start ? istDayKeyToUtcStartIso(start) : null,
    toIso: end ? istDayKeyToUtcEndIso(end) : null,
    clampedToDays,
  };
}
