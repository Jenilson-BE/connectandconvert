/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export function initMetaPixel(pixelId?: string): void {
  const pId = pixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pId || typeof window === "undefined") return;

  if (window.fbq) return;

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

  window.fbq("init", pId);
  window.fbq("track", "PageView");
}

export function trackPixelEvent(eventName: string, params?: Record<string, any>): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", eventName, params);
  }
}

export function trackPixelStandard(eventName: string, params?: Record<string, any>): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
}
