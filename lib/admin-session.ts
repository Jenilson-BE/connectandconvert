import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "cc_admin_session";

/** Bump to invalidate every outstanding session token. */
const SESSION_VERSION = 1;
const DEFAULT_TTL_SECONDS = 60 * 60 * 8;

export const isProduction = process.env.NODE_ENV === "production";

/**
 * The signing key for session tokens.
 *
 * ADMIN_SESSION_SECRET is preferred so the passcode can be rotated without
 * logging everyone out. Falling back to ADMIN_PASSCODE keeps existing
 * deployments working; returns null when neither is set so that auth fails
 * closed rather than accepting an unsigned token.
 */
function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSCODE;
  return secret && secret.length > 0 ? secret : null;
}

export function isAdminPasscodeConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSCODE && process.env.ADMIN_PASSCODE.length > 0);
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payload: string, secret: string): string {
  return base64url(createHmac("sha256", secret).update(payload).digest());
}

/** Constant-time string comparison that does not leak length via early exit. */
function safeEqual(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

/**
 * Verify a submitted admin passcode in constant time.
 * Always performs the comparison so timing does not reveal the correct value,
 * and refuses to authenticate anything when no passcode is configured.
 */
export function verifyAdminPasscode(candidate: unknown): boolean {
  const configured = process.env.ADMIN_PASSCODE;
  if (!configured) return false;
  if (typeof candidate !== "string" || candidate.length === 0) return false;
  return safeEqual(candidate, configured);
}

export function createAdminSessionToken(
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = base64url(
    JSON.stringify({ v: SESSION_VERSION, iat: issuedAt, exp: issuedAt + ttlSeconds })
  );

  return `${payload}.${sign(payload, secret)}`;
}

/**
 * Validate a session cookie.
 *
 * Rejects anything that is not a well-formed, correctly signed,
 * non-expired token, so a hand-written `cc_admin_session=authenticated`
 * cookie is no longer sufficient for admin access.
 */
export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  const secret = getSessionSecret();
  if (!secret || !token) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  let expected: string;
  try {
    expected = sign(payload, secret);
  } catch {
    return false;
  }

  if (!safeEqual(signature, expected)) return false;

  let claims: { v?: number; iat?: number; exp?: number };
  try {
    claims = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  } catch {
    return false;
  }

  if (!claims || claims.v !== SESSION_VERSION) return false;
  if (typeof claims.exp !== "number" || claims.exp * 1000 <= Date.now()) return false;

  return true;
}

export const ADMIN_SESSION_MAX_AGE_SECONDS = DEFAULT_TTL_SECONDS;

/** Cookie attributes shared by login, logout and any future refresh. */
export const adminSessionCookieOptions = {
  name: ADMIN_SESSION_COOKIE,
  httpOnly: true,
  sameSite: "strict" as const,
  secure: isProduction,
  path: "/",
  maxAge: DEFAULT_TTL_SECONDS,
  priority: "high" as const,
};

/** Opaque random value, for cases where a token is not required. */
export function randomToken(bytes = 16): string {
  return base64url(randomBytes(bytes));
}
