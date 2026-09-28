/* eslint-disable @typescript-eslint/no-explicit-any */
import { normalizeMetaPixelId, isValidMetaPixelId } from "@/lib/meta-pixel-id";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const PIXEL_SRC = "https://connect.facebook.net/en_US/fbevents.js";

let activePixelId: string | null = null;

/**
 * Every landing page carries its own pixel ID, so the caller needs to tell
 * "this page is untracked" apart from "this page's ID is malformed" to log the
 * right thing.
 */
export type MetaPixelInitResult = "ready" | "switched" | "inactive" | "invalid";

export function initMetaPixel(rawPixelId?: string): MetaPixelInitResult {
  if (typeof window === "undefined") return "inactive";

  const pId = normalizeMetaPixelId(rawPixelId);
  if (!isValidMetaPixelId(pId)) {
    // Drop any pixel left behind by a previously viewed page. Without this, a
    // page with no ID of its own keeps reporting into the last page's pixel.
    activePixelId = null;
    return rawPixelId && String(rawPixelId).trim() !== "" ? "invalid" : "inactive";
  }

  if (activePixelId === pId) return "ready";

  if (window.fbq) {
    // fbevents.js is already loaded because this is a client-side navigation
    // from another landing page. Re-initialising the existing instance is the
    // supported way to point it at a different pixel. Returning early here
    // would leave this page's events attributed to the previous page's ID.
    activePixelId = pId;
    window.fbq("init", pId);
    window.fbq("track", "PageView");
    return "switched";
  }

  const n: any = (window.fbq = (...args: unknown[]) => {
    if (n.callMethod) {
      n.callMethod(...args);
    } else {
      n.queue.push(args);
    }
  });
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = PIXEL_SRC;
  document.head.appendChild(script);

  activePixelId = pId;
  window.fbq("init", pId);
  window.fbq("track", "PageView");
  return "ready";
}

/**
 * Stop attributing events to a pixel, e.g. when unmounting a landing page so
 * its ID does not carry over into an unrelated route.
 */
export function resetMetaPixel(): void {
  activePixelId = null;
}

export function getActiveMetaPixelId(): string | null {
  return activePixelId;
}

export function isMetaPixelActive(): boolean {
  return activePixelId !== null;
}

export function getMetaPixelNoScriptUrl(rawPixelId?: string): string | null {
  const pId = normalizeMetaPixelId(rawPixelId);
  if (!isValidMetaPixelId(pId)) return null;
  return `https://www.facebook.com/tr?id=${pId}&ev=PageView&noscript=1`;
}

export function trackPixelEvent(eventName: string, params?: Record<string, any>): void {
  if (isMetaPixelActive() && window.fbq) {
    window.fbq("trackCustom", eventName, params);
  }
}

export function trackPixelStandard(eventName: string, params?: Record<string, any>): void {
  if (isMetaPixelActive() && window.fbq) {
    window.fbq("track", eventName, params);
  }
}
