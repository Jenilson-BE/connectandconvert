import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_MAX_AGE_SECONDS,
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
  isAdminPasscodeConfigured,
  isProduction,
  verifyAdminPasscode,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { getClientIp, isSameOrigin, MISCONFIGURED_MESSAGE } from "@/lib/admin-guard";
import { checkRateLimit, clearFailures, recordFailure } from "@/lib/rate-limit";

/**
 * Brute-force limits.
 *
 * 10 attempts per 15 minutes per IP, with a 15 minute lockout after 5
 * consecutive wrong passcodes.
 */
const LOGIN_LIMIT = {
  limit: 10,
  windowMs: 15 * 60 * 1000,
  lockoutThreshold: 5,
  lockoutMs: 15 * 60 * 1000,
};

export async function POST(request: NextRequest) {
  // Reject cross-origin login attempts outright.
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { success: false, message: "Cross-origin request rejected." },
      { status: 403 }
    );
  }

  // Fail closed: without a configured passcode nobody can log in, rather than
  // falling back to a well-known default.
  if (!isAdminPasscodeConfigured()) {
    return NextResponse.json(
      { success: false, message: MISCONFIGURED_MESSAGE },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const limitKey = `admin-login:${ip}`;

  const rate = checkRateLimit(limitKey, LOGIN_LIMIT);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: rate.locked
          ? "Too many failed attempts. Try again later."
          : "Too many attempts. Please wait and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.max(rate.retryAfterSeconds, 1)) },
      }
    );
  }

  let passcode: unknown;
  try {
    const body = await request.json();
    passcode = body?.passcode;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  if (typeof passcode !== "string" || passcode.length > 512) {
    recordFailure(limitKey, LOGIN_LIMIT);
    return NextResponse.json(
      { success: false, message: "Invalid admin passcode. Please check and try again." },
      { status: 401 }
    );
  }

  if (!verifyAdminPasscode(passcode)) {
    recordFailure(limitKey, LOGIN_LIMIT);
    return NextResponse.json(
      { success: false, message: "Invalid admin passcode. Please check and try again." },
      { status: 401 }
    );
  }

  clearFailures(limitKey);

  const token = createAdminSessionToken();
  if (!token) {
    return NextResponse.json(
      { success: false, message: MISCONFIGURED_MESSAGE },
      { status: 503 }
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Admin authentication successful.",
  });

  response.cookies.set({ ...adminSessionCookieOptions, value: token });
  return response;
}

export async function GET(request: NextRequest) {
  const authenticated = verifyAdminSessionToken(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  );

  return NextResponse.json(
    { authenticated, configured: isAdminPasscodeConfigured() },
    {
      // Never let an intermediary cache an auth decision.
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { success: false, message: "Cross-origin request rejected." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction,
    path: "/",
    maxAge: 0,
  });

  return response;
}

export const maxDuration = 10;
export { ADMIN_SESSION_MAX_AGE_SECONDS };
