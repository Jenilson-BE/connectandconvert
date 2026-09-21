/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function initGA(measurementId?: string): void {
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId || typeof window === "undefined") return;

  if (document.querySelector(`script[src*="gtag/js?id=${gaId}"]`)) return;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", gaId, {
    send_page_view: true,
  });
}

export function trackGAEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}
