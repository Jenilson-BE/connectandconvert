import { getAttribution } from "./attribution";

export type VisitLogType =
  | "websitevisit"
  | "subscribe"
  | "autoredirect";

let websiteVisitLogged = false;

function detectBrowser(userAgent: string): string {
  if (/Edg\//.test(userAgent)) return "Edge";
  if (/OPR\/|Opera\//.test(userAgent)) return "Opera";
  if (/Chrome\//.test(userAgent)) return "Chrome";
  if (/Firefox\//.test(userAgent)) return "Firefox";
  if (/Safari\//.test(userAgent)) return "Safari";
  return "Unknown";
}

function detectOS(userAgent: string): string {
  if (/Windows NT 10/.test(userAgent)) return "Windows 10/11";
  if (/Windows NT 6\.1/.test(userAgent)) return "Windows 7";
  if (/Android/.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";
  if (/Mac OS X/.test(userAgent)) return "macOS";
  if (/Linux/.test(userAgent)) return "Linux";
  return "Unknown";
}


export function sendVisitLog(type: VisitLogType): void {
  if (typeof window === "undefined") return;

  if (type === "websitevisit") {
    if (websiteVisitLogged) return;
    websiteVisitLogged = true;
  }

  const attribution = getAttribution();
  const urlCid = new URLSearchParams(window.location.search).get("cid");
  const cid = attribution.cid ?? urlCid ?? null;

  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
  };

  const isMobile =
    /Mobi|Android/i.test(navigator.userAgent) ||
    navigator.maxTouchPoints > 0;

  const payload = {
    type,
    ts: new Date().toISOString(),
    cid,
    device: isMobile ? "Mobile" : "Desktop",
    browser: detectBrowser(navigator.userAgent),
    os: detectOS(navigator.userAgent),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language || "Unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    path: window.location.pathname,
    referrer: document.referrer || "",
    userAgent: navigator.userAgent,
  };

  try {
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/log", blob);
    } else {
      fetch("/api/log", {
        method: "POST",
        body: blob,
        keepalive: true,
      }).catch(() => {
        // fire-and-forget
      });
    }
  } catch {
    // sendBeacon/fetch unavailable — ignore
  }
}
