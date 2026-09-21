export type AttributionData = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
  gclid: string | null;
  cid: string | null;
};

const STORAGE_KEY = "cc_landing_attribution";

export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const data: AttributionData = {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent: params.get("utm_content"),
    utmTerm: params.get("utm_term"),
    fbclid: params.get("fbclid"),
    gclid: params.get("gclid"),
    cid: params.get("cid"),
  };

  const hasData = Object.values(data).some((v) => v !== null);
  if (hasData) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore private mode error
    }
  }
}

export function getAttribution(): AttributionData {
  const empty: AttributionData = {
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    fbclid: null,
    gclid: null,
    cid: null,
  };

  if (typeof window === "undefined") return empty;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as AttributionData;
    }
  } catch {
    // ignore
  }

  return empty;
}

export function getAttributionFlat(): Record<string, string> {
  const data = getAttribution();
  const flat: Record<string, string> = {};
  if (data.utmSource) flat.utm_source = data.utmSource;
  if (data.utmMedium) flat.utm_medium = data.utmMedium;
  if (data.utmCampaign) flat.utm_campaign = data.utmCampaign;
  if (data.utmContent) flat.utm_content = data.utmContent;
  if (data.utmTerm) flat.utm_term = data.utmTerm;
  if (data.fbclid) flat.fbclid = data.fbclid;
  if (data.gclid) flat.gclid = data.gclid;
  if (data.cid) flat.cid = data.cid;
  return flat;
}
