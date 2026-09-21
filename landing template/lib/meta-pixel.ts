/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";

export function initMetaPixel(): void {
  if (!PIXEL_ID || typeof window === "undefined") return;

  // Prevent duplicate initialization
  if (window.fbq) return;

  /* Meta Pixel base code */
  const n: any = (window.fbq = function () {
    // eslint-disable-next-line prefer-rest-params
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

export function trackPixelEvent(
  eventName: string,
  params?: Record<string, any>,
): void {
  if (DEBUG) {
    console.log("[Meta Pixel]", eventName, params);
  }
  if (typeof window !== "undefined" && window.fbq) {
    if (params) {
      window.fbq("trackCustom", eventName, params);
    } else {
      window.fbq("trackCustom", eventName);
    }
  }
}

export function trackPixelStandard(
  eventName: string,
  params?: Record<string, any>,
): void {
  if (DEBUG) {
    console.log("[Meta Pixel Standard]", eventName, params);
  }
  if (typeof window !== "undefined" && window.fbq) {
    if (params) {
      window.fbq("track", eventName, params);
    } else {
      window.fbq("track", eventName);
    }
  }
}
