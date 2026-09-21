import { trackPixelEvent, trackPixelStandard } from "./meta-pixel";
import { getAttributionFlat } from "./attribution";

const firedEvents = new Set<string>();

export function trackEvent(
  eventName: string,
  params?: Record<string, string>
): void {
  const attribution = getAttributionFlat();
  const merged = { ...attribution, ...params };

  trackPixelEvent(eventName, merged);
}

export function trackEventOnce(
  eventName: string,
  params?: Record<string, string>
): void {
  if (firedEvents.has(eventName)) return;
  firedEvents.add(eventName);
  trackEvent(eventName, params);
}

export function trackCtaClick(ctaLocation: string, label = "Community Join"): void {
  trackEvent("cta_click", { cta_location: ctaLocation, cta_label: label });
  trackPixelStandard("Subscribe", {
    content_name: label,
    content_category: ctaLocation,
  });
}

export function trackAutoRedirect(): void {
  trackEventOnce("auto_redirect", { cta_location: "countdown" });
  trackPixelEvent("AutoCommunityRedirect");
}

export function trackEngagement(milestone: string): void {
  trackEventOnce(milestone);
}

export function trackScrollDepth(depth: number): void {
  trackEventOnce(`scroll_depth_${depth}`, { depth: `${depth}%` });
}

export function trackLandingView(pageName = "Landing Page"): void {
  trackEventOnce("landing_view");
  trackPixelStandard("ViewContent", {
    content_name: pageName,
  });
}
