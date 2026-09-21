import { links } from "@/config/links";
import { trackTelegramClick, trackAutoRedirect } from "./analytics";
import { getAttribution } from "./attribution";
import { sendVisitLog } from "./visit-log";

let countdownCancelled = false;

export function cancelCountdown(): void {
  countdownCancelled = true;
}

export function isCountdownCancelled(): boolean {
  return countdownCancelled;
}

function getTelegramUrl(): string {
  return links.telegramBase;
}

export function openTelegram({
  source,
  isAutoRedirect = false,
}: {
  source: string;
  isAutoRedirect?: boolean;
}): void {
  // Prevent duplicate redirects
  cancelCountdown();

  if (isAutoRedirect) {
    trackAutoRedirect();
    sendVisitLog("autoredirect");
  } else {
    trackTelegramClick(source);
    sendVisitLog("subscribe");
  }

  const telegramUrl = getTelegramUrl();

  // Small delay to allow analytics to fire, then redirect
  setTimeout(() => {
    window.location.href = telegramUrl;
  }, 100);
}
