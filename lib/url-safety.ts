/**
 * URL validation for operator-supplied values.
 *
 * These values end up in `href` attributes and metadata, so a `javascript:`
 * or `data:` URL would become a stored-XSS vector. Only known-safe schemes and
 * site-relative paths are accepted.
 */

const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const SAFE_MEDIA_PROTOCOLS = new Set(["http:", "https:"]);

const MAX_URL_LENGTH = 2048;

function isSiteRelative(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}

function hasSafeProtocol(
  value: string,
  allowed: ReadonlySet<string>
): boolean {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  return allowed.has(parsed.protocol);
}

export type UrlCheckResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

function check(value: unknown, allowed: ReadonlySet<string>, label: string): UrlCheckResult {
  // Optional fields may be omitted entirely; required ones are enforced by the
  // route before this runs.
  if (value === undefined || value === null) return { ok: true, value: "" };

  if (typeof value !== "string") {
    return { ok: false, error: `${label} must be a string.` };
  }

  const trimmed = value.trim();
  if (!trimmed) return { ok: true, value: "" };
  if (trimmed.length > MAX_URL_LENGTH) {
    return { ok: false, error: `${label} is too long.` };
  }
  // Control characters can be used to smuggle a scheme past naive checks.
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) {
    return { ok: false, error: `${label} contains invalid characters.` };
  }

  if (isSiteRelative(trimmed)) return { ok: true, value: trimmed };

  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return { ok: false, error: `${label} must start with / or a valid scheme.` };
  }

  if (!hasSafeProtocol(trimmed, allowed)) {
    return { ok: false, error: `${label} uses a scheme that is not allowed.` };
  }

  return { ok: true, value: trimmed };
}

/** For link targets such as `destinationUrl`. */
export function checkLinkUrl(value: unknown, label = "Destination URL"): UrlCheckResult {
  return check(value, SAFE_LINK_PROTOCOLS, label);
}

/** For image sources such as `logoUrl` and `ogImage`. */
export function checkMediaUrl(value: unknown, label = "Image URL"): UrlCheckResult {
  return check(value, SAFE_MEDIA_PROTOCOLS, label);
}

/**
 * Validate every operator-supplied URL on a landing page config before it is
 * persisted, so a stored `javascript:` URL can never reach an `href` or a
 * meta tag.
 */
export function validateLandingPageUrls(page: {
  destinationUrl?: unknown;
  logoUrl?: unknown;
  ogImage?: unknown;
}): { ok: true } | { ok: false; error: string } {
  const destination = checkLinkUrl(page.destinationUrl, "Destination URL");
  if (!destination.ok) return { ok: false, error: destination.error };

  const logo = checkMediaUrl(page.logoUrl, "Logo URL");
  if (!logo.ok) return { ok: false, error: logo.error };

  const og = checkMediaUrl(page.ogImage, "OG Image URL");
  if (!og.ok) return { ok: false, error: og.error };

  return { ok: true };
}
