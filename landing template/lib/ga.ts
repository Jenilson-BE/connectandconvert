/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";

export function initGA(): void {
  if (!GA_ID || typeof window === "undefined") return;

  // Prevent duplicate initialization
  if (document.querySelector(`script[src*="gtag/js?id=${GA_ID}"]`)) return;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    send_page_view: true,
  });
}

export function trackGAEvent(
  eventName: string,
  params?: Record<string, any>,
): void {
  if (DEBUG) {
    console.log("[GA4]", eventName, params);
  }
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}
