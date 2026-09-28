/**
 * In-memory rate limiting.
 *
 * NOTE: this state lives in the Node process, so limits are per-instance. On
 * serverless or multi-instance deployments an attacker gets the limit divided
 * by the instance count. For strict enforcement, move the counters to Redis or
 * your Mongo instance.
 */

interface Bucket {
  hits: number[];
  lockedUntil: number;
  failures: number;
}

export interface RateLimitOptions {
  /** Requests allowed inside the window. */
  limit: number;
  windowMs: number;
  /** Consecutive failures that trigger a lockout. */
  lockoutThreshold?: number;
  /** How long a lockout lasts. */
  lockoutMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  locked: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

const buckets = new Map<string, Bucket>();

/** Keep memory bounded on long-running servers. */
const MAX_BUCKETS = 10_000;
let lastSweep = Date.now();

function sweep(now: number, windowMs: number) {
  if (now - lastSweep < 60_000 && buckets.size < MAX_BUCKETS) return;
  lastSweep = now;

  for (const [key, bucket] of buckets) {
    const expiredHits = bucket.hits.every((t) => now - t > windowMs);
    if (expiredHits && bucket.lockedUntil <= now && bucket.failures === 0) {
      buckets.delete(key);
    }
  }

  if (buckets.size > MAX_BUCKETS) {
    const excess = buckets.size - MAX_BUCKETS;
    let removed = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      removed += 1;
      if (removed >= excess) break;
    }
  }
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const { limit, windowMs } = options;
  sweep(now, windowMs);

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [], lockedUntil: 0, failures: 0 };
    buckets.set(key, bucket);
  }

  if (bucket.lockedUntil > now) {
    return {
      allowed: false,
      locked: true,
      retryAfterSeconds: Math.ceil((bucket.lockedUntil - now) / 1000),
      remaining: 0,
    };
  }

  bucket.hits = bucket.hits.filter((t) => now - t <= windowMs);

  if (bucket.hits.length >= limit) {
    return {
      allowed: false,
      locked: false,
      retryAfterSeconds: Math.ceil((windowMs - (now - bucket.hits[0])) / 1000),
      remaining: 0,
    };
  }

  bucket.hits.push(now);
  return {
    allowed: true,
    locked: false,
    retryAfterSeconds: 0,
    remaining: Math.max(0, limit - bucket.hits.length),
  };
}

/** Record a failed authentication, locking the key out after enough attempts. */
export function recordFailure(key: string, options: RateLimitOptions): void {
  const threshold = options.lockoutThreshold;
  if (!threshold) return;

  const bucket = buckets.get(key);
  if (!bucket) return;

  bucket.failures += 1;
  if (bucket.failures >= threshold) {
    bucket.lockedUntil = Date.now() + (options.lockoutMs ?? options.windowMs);
    bucket.failures = 0;
    bucket.hits = [];
  }
}

/** Clear counters after a success so a legitimate user is not punished. */
export function clearFailures(key: string): void {
  const bucket = buckets.get(key);
  if (bucket) bucket.failures = 0;
}

/** Test-only helper. */
export function resetRateLimits(): void {
  buckets.clear();
  lastSweep = Date.now();
}
