import { trackGAEvent } from "./ga";
import { trackPixelEvent, trackPixelStandard } from "./meta-pixel";
import { getAttributionFlat } from "./attribution";

const DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";

// Track set to prevent duplicate events per session
const firedEvents = new Set<string>();

export function trackEvent(
  eventName: string,
  params?: Record<string, string>,
): void {
  const attribution = getAttributionFlat();
  const merged = { ...attribution, ...params };

  if (DEBUG) {
    console.log("[Analytics]", eventName, merged);
  }

  trackGAEvent(eventName, merged);
  trackPixelEvent(eventName, merged);
}

export function trackEventOnce(
  eventName: string,
  params?: Record<string, string>,
): void {
  if (firedEvents.has(eventName)) return;
  firedEvents.add(eventName);
  trackEvent(eventName, params);
}

export function trackTelegramClick(ctaLocation: string): void {
  trackEvent("telegram_click", { cta_location: ctaLocation });
  trackPixelStandard("Subscribe", {
    content_name: "Telegram Join",
    content_category: ctaLocation,
  });
}

export function trackAutoRedirect(): void {
  trackEventOnce("auto_redirect", { cta_location: "countdown" });
  trackPixelEvent("AutoTelegramRedirect");
}

export function trackEngagement(milestone: string): void {
  trackEventOnce(milestone);
}

export function trackScrollDepth(depth: number): void {
  const key = `scroll_depth_${depth}`;
  trackEventOnce(key, { depth: `${depth}%` });
}

export function trackLandingView(): void {
  trackEventOnce("landing_view");
  trackPixelStandard("ViewContent", {
    content_name: "BFSS Tamil Landing Page",
  });
}
