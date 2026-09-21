export type ThemeAccent = "violet" | "purple" | "emerald" | "blue" | "rose" | "amber";

export interface LandingPageStats {
  members: string;
  access: string;
  pricing: string;
  content: string;
}

export interface LandingPageConfig {
  id: string;
  slug: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;

  // SEO & Meta
  title: string;
  metaDescription: string;
  ogImage?: string;

  // Branding
  brandName: string;
  topBadge: string;
  statusBadge: string;
  logoUrl: string;

  // Hero Copy
  preHeadline: string;
  headlineMain: string;
  headlineHighlight: string;
  subHeadline: string;
  description: string;

  // Call to Action
  ctaText: string;
  ctaSubtext: string;
  destinationUrl: string;

  // Countdown & Redirect
  autoRedirect: boolean;
  redirectAfterSeconds: number;
  startOnFirstScroll: boolean;

  // Stats
  stats: LandingPageStats;

  // Legal & Disclaimers
  disclaimerText: string;
  footerText: string;
  privacyText: string;

  // Analytics
  metaPixelId?: string;
  gaMeasurementId?: string;

  // Styling
  themeAccent: ThemeAccent;

  // Metrics (computed or stored)
  visits?: number;
  clicks?: number;
}

export interface VisitLogEntry {
  id: string;
  slug: string;
  type: "websitevisit" | "subscribe" | "autoredirect";
  ts: string;
  cid?: string | null;
  device: string;
  browser: string;
  os: string;
  path: string;
  referrer: string;
  ip?: string;
  country?: string;
  city?: string;
  attribution?: Record<string, string | null>;
}
