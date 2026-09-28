import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isAdminPasscodeConfigured,
  verifyAdminSessionToken,
} from "./admin-session";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function getExpectedOrigin(request: NextRequest): string {
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    request.nextUrl.protocol.replace(":", "") ||
    "https";
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    request.nextUrl.host;
  return `${proto}://${host}`;
}

/**
 * CSRF defence for cookie-authenticated mutations.
 *
 * The session cookie is already `SameSite=Strict`, so a cross-site request will
 * not carry it at all. This adds a second, explicit check: browsers always
 * attach either `Sec-Fetch-Site` or `Origin` to a cross-origin attempt, so a
 * mismatch is rejected.
 *
 * Requests with neither header come from non-browser clients, where CSRF is
 * not applicable, so they are allowed through and rely on the signed session.
 */
export function isSameOrigin(request: NextRequest): boolean {
  if (!MUTATING_METHODS.has(request.method.toUpperCase())) return true;

  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite) {
    return secFetchSite === "same-origin" || secFetchSite === "none";
  }

  const origin = request.headers.get("origin");
  if (!origin) return true;

  return origin === getExpectedOrigin(request);
}

export function isAdminRequest(request: NextRequest): boolean {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

function unauthorized(message = "Unauthorized. Please log in to admin.") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

function forbidden(message: string) {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export function isMisconfigured(): boolean {
  return !isAdminPasscodeConfigured();
}

/**
 * Guard an admin route handler.
 *
 * Returns a ready-to-send error response when the request should be rejected,
 * or null when the caller may proceed.
 */
export function guardAdminRequest(request: NextRequest): NextResponse | null {
  if (!isAdminRequest(request)) return unauthorized();

  if (!isSameOrigin(request)) {
    return forbidden("Cross-origin request rejected.");
  }

  return null;
}

const MISCONFIGURED_MESSAGE =
  "Admin access is not configured on this server. Set ADMIN_PASSCODE and restart.";

/**
 * Guard a server-rendered admin page.
 *
 * Redirects to the login screen when the session is missing, invalid or
 * expired. Use this on any admin page that reads data server-side.
 */
export async function requireAdminPage(): Promise<void> {
  if (!isAdminPasscodeConfigured()) redirect("/admin?error=not-configured");

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSessionToken(token)) {
    redirect("/admin?error=session-expired");
  }
}

export { MISCONFIGURED_MESSAGE, unauthorized, forbidden };
