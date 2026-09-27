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

export function initMetaPixel(rawPixelId?: string): boolean {
  if (typeof window === "undefined") return false;

  const pId = normalizeMetaPixelId(rawPixelId);
  if (!isValidMetaPixelId(pId)) return false;
  if (activePixelId === pId) return true;
  if (window.fbq) return false;

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
  return true;
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
