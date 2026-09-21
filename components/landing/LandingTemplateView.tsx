"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Crown, Send, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { LandingPageConfig } from "@/lib/landing-types";
import { initMetaPixel } from "@/lib/landing-engine/meta-pixel";
import { captureAttribution } from "@/lib/landing-engine/attribution";
import {
  trackLandingView,
  trackCtaClick,
  trackAutoRedirect,
  trackScrollDepth,
  trackEngagement,
} from "@/lib/landing-engine/analytics";
import { sendVisitLog } from "@/lib/landing-engine/visit-log";

interface LandingTemplateViewProps {
  page: LandingPageConfig;
}

export function LandingTemplateView({ page }: LandingTemplateViewProps) {
  const totalSeconds = Math.max(Number(page.redirectAfterSeconds) || 8, 1);
  const [toast, setToast] = React.useState<string | null>(null);
  const [stickyVisible, setStickyVisible] = React.useState(false);
  const [countdownStarted, setCountdownStarted] = React.useState(!page.startOnFirstScroll);
  const [remaining, setRemaining] = React.useState(totalSeconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownCancelledRef = React.useRef(false);
  const toastTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = React.useCallback((message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const clearCountdown = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleCtaClick = React.useCallback(
    (source: string, isAuto = false) => {
      countdownCancelledRef.current = true;
      clearCountdown();

      if (isAuto) {
        trackAutoRedirect();
        sendVisitLog("autoredirect", page.slug);
      } else {
        trackCtaClick(source, page.ctaText);
        sendVisitLog("subscribe", page.slug);
        showToast("Connecting now...");
      }

      setTimeout(() => {
        if (page.destinationUrl) {
          window.location.href = page.destinationUrl;
        }
      }, 150);
    },
    [clearCountdown, page.destinationUrl, page.ctaText, page.slug, showToast]
  );

  // Initialize tracking
  React.useEffect(() => {
    initMetaPixel(page.metaPixelId);
    captureAttribution();
    sendVisitLog("websitevisit", page.slug);
    trackLandingView(page.title);

    // Scroll depth tracking
    const reachedDepths = new Set<number>();
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const pct = Math.round((scrollTop / scrollable) * 100);
      [25, 50, 75, 90].forEach((depth) => {
        if (pct >= depth && !reachedDepths.has(depth)) {
          reachedDepths.add(depth);
          trackScrollDepth(depth);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Sticky CTA observer
    const primaryCtaEl = document.getElementById("cta-primary");
    let observer: IntersectionObserver | undefined;
    if (primaryCtaEl) {
      observer = new IntersectionObserver(
        ([entry]) => setStickyVisible(!entry.isIntersecting),
        { threshold: 0.1 }
      );
      observer.observe(primaryCtaEl);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer?.disconnect();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [page]);

  // First scroll countdown start (if configured)
  React.useEffect(() => {
    if (!page.autoRedirect || !page.startOnFirstScroll) return;

    const handleFirstScroll = () => {
      if (window.scrollY > 10) {
        setCountdownStarted(true);
        trackEngagement("countdown_started_on_scroll");
        window.removeEventListener("scroll", handleFirstScroll);
      }
    };
    window.addEventListener("scroll", handleFirstScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleFirstScroll);
  }, [page.autoRedirect, page.startOnFirstScroll]);

  // Countdown timer loop
  React.useEffect(() => {
    if (!page.autoRedirect || !countdownStarted) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearCountdown();
          if (!countdownCancelledRef.current) {
            handleCtaClick("auto_timer", true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearCountdown;
  }, [page.autoRedirect, countdownStarted, clearCountdown, handleCtaClick]);

  // SVG circle calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - remaining / totalSeconds);

  // Theme accents mapping
  const accents = {
    violet: {
      grad: "from-violet-600 via-purple-600 to-violet-700",
      text: "text-violet-600",
      badgeBorder: "border-violet-300/40 bg-violet-50/80 text-violet-600",
      stroke: "#7C3AED",
    },
    purple: {
      grad: "from-purple-600 via-fuchsia-600 to-purple-700",
      text: "text-purple-600",
      badgeBorder: "border-purple-300/40 bg-purple-50/80 text-purple-600",
      stroke: "#9333EA",
    },
    emerald: {
      grad: "from-emerald-600 via-teal-600 to-emerald-700",
      text: "text-emerald-600",
      badgeBorder: "border-emerald-300/40 bg-emerald-50/80 text-emerald-600",
      stroke: "#059669",
    },
    blue: {
      grad: "from-blue-600 via-indigo-600 to-blue-700",
      text: "text-blue-600",
      badgeBorder: "border-blue-300/40 bg-blue-50/80 text-blue-600",
      stroke: "#2563EB",
    },
    rose: {
      grad: "from-rose-600 via-pink-600 to-rose-700",
      text: "text-rose-600",
      badgeBorder: "border-rose-300/40 bg-rose-50/80 text-rose-600",
      stroke: "#E11D48",
    },
    amber: {
      grad: "from-amber-600 via-orange-600 to-amber-700",
      text: "text-amber-600",
      badgeBorder: "border-amber-300/40 bg-amber-50/80 text-amber-600",
      stroke: "#D97706",
    },
  };

  const currentTheme = accents[page.themeAccent] || accents.violet;

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#FAF9FC] text-[#17121F] selection:bg-[#E9D5FF] selection:text-[#17121F]">
      {/* Background ambient lighting */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle,rgba(109,40,217,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute right-[-150px] top-[-100px] h-[500px] w-[500px] rounded-full bg-[#E9D5FF]/30 blur-[120px]" />
        <div className="absolute bottom-[-150px] left-[-150px] h-[480px] w-[480px] rounded-full bg-[#D8B4FE]/20 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[600px] flex-col px-4 pb-32 pt-6 sm:px-6 sm:pt-10">
        {/* Top Badge */}
        {page.topBadge && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${currentTheme.badgeBorder}`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{page.topBadge}</span>
            </div>
          </motion.div>
        )}

        {/* Logo with spinning ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative mx-auto mt-6 flex h-[140px] w-[140px] items-center justify-center sm:h-[160px] sm:w-[160px]"
        >
          {/* Animated dashed ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[#6D28D9]/30"
          />
          <div className="absolute inset-[8px] rounded-full border border-[#E9D5FF]/50" />
          <div className="absolute inset-[18px] rounded-full bg-[#6D28D9]/5 blur-xl" />

          {/* Logo container */}
          <div className="relative flex h-[115px] w-[115px] sm:h-[130px] sm:w-[130px] items-center justify-center overflow-hidden rounded-full border border-[#E8E2EF] bg-white p-3 shadow-xl shadow-[#6D28D9]/10">
            <Image
              src={page.logoUrl || "/logo.png"}
              alt={page.brandName}
              width={160}
              height={160}
              priority
              unoptimized={Boolean(page.logoUrl && (page.logoUrl.startsWith("http://") || page.logoUrl.startsWith("https://")))}
              className="h-full w-full object-contain"
            />
          </div>
        </motion.div>

        {/* Community Status Badge */}
        {page.statusBadge && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-50/90 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
              <span>{page.statusBadge}</span>
            </div>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-center space-y-3"
        >
          {page.preHeadline && (
            <p className={`text-xs font-bold uppercase tracking-widest ${currentTheme.text}`}>
              {page.preHeadline}
            </p>
          )}

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#17121F] leading-tight">
            {page.headlineMain}{" "}
            <span
              className={`bg-gradient-to-r ${currentTheme.grad} bg-clip-text text-transparent`}
            >
              {page.headlineHighlight}
            </span>
          </h1>

          {page.subHeadline && (
            <h2 className="mx-auto max-w-md text-xl sm:text-2xl font-bold text-[#17121F] leading-snug">
              {page.subHeadline}
            </h2>
          )}

          {page.description && (
            <p className="mx-auto max-w-md text-sm sm:text-base text-[#625A6D] leading-relaxed">
              {page.description}
            </p>
          )}
        </motion.section>

        {/* Main CTA Button */}
        <motion.button
          id="cta-primary"
          type="button"
          onClick={() => handleCtaClick("primary")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`group relative mt-7 flex min-h-[68px] w-full items-center justify-between overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r ${currentTheme.grad} px-6 text-left text-white shadow-xl shadow-[#6D28D9]/20 cursor-pointer`}
        >
          {/* Light sweep animation */}
          <motion.span
            aria-hidden="true"
            animate={{ x: ["-180%", "280%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            className="absolute inset-y-0 w-24 rotate-12 bg-white/20 blur-xl"
          />

          <span className="relative z-10 flex items-center gap-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Send className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-sm sm:text-base font-extrabold tracking-wide">
                {page.ctaText}
              </span>
              {page.ctaSubtext && (
                <span className="block text-xs font-medium text-white/80">
                  {page.ctaSubtext}
                </span>
              )}
            </span>
          </span>

          <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>

        {/* Auto-Redirect Radial Countdown Timer */}
        {page.autoRedirect && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-8 overflow-hidden rounded-3xl border border-[#E8E2EF] bg-white p-6 text-center shadow-lg shadow-[#6D28D9]/5"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#625A6D]">
              {countdownStarted ? "Connecting You Automatically In" : "Scroll To Begin"}
            </p>

            <div className="relative mx-auto mt-4 h-[120px] w-[120px]">
              <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#E8E2EF"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={currentTheme.stroke}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.75 }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={remaining}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.15 }}
                    className={`text-3xl font-extrabold ${currentTheme.text}`}
                  >
                    {remaining}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#9E94A8]">
                  seconds
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCtaClick("countdown_text")}
              className={`mt-4 inline-flex items-center gap-1.5 text-xs font-bold ${currentTheme.text} hover:underline cursor-pointer`}
            >
              <span>Connect immediately</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.section>
        )}

        {/* Stats Grid */}
        {page.stats && (
          <div className="mt-8 grid grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-white border border-[#E8E2EF]">
              <span className="text-xs sm:text-sm font-bold text-[#17121F] block">
                {page.stats.members}
              </span>
              <span className="text-[10px] text-[#625A6D]">Members</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#E8E2EF]">
              <span className="text-xs sm:text-sm font-bold text-[#17121F] block">
                {page.stats.access}
              </span>
              <span className="text-[10px] text-[#625A6D]">Access</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#E8E2EF]">
              <span className="text-xs sm:text-sm font-bold text-[#17121F] block">
                {page.stats.pricing}
              </span>
              <span className="text-[10px] text-[#625A6D]">Pricing</span>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-[#E8E2EF]">
              <span className="text-xs sm:text-sm font-bold text-[#17121F] block">
                {page.stats.content}
              </span>
              <span className="text-[10px] text-[#625A6D]">Updates</span>
            </div>
          </div>
        )}

        {/* Disclaimer Card */}
        {page.disclaimerText && (
          <div className="mt-6 rounded-2xl border border-[#E8E2EF] bg-white/70 p-4 text-center">
            <p className="text-xs text-[#625A6D] leading-relaxed">
              {page.disclaimerText}
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-[#E8E2EF] text-center space-y-3">
          <p className="text-sm font-bold tracking-wide text-[#17121F]">
            Ads By Connectandconvert
          </p>
          <div>
            <a
              href="https://t.me/connectandconvert"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D28D9] hover:text-[#5B21B6] transition-colors py-1.5 px-4 rounded-full bg-white border border-[#E8E2EF] shadow-xs hover:border-[#D8B4FE]"
            >
              <Send className="w-3.5 h-3.5 text-[#2AABEE]" />
              <span>Telegram: @connectandconvert</span>
            </a>
          </div>

          <p className="text-xs font-semibold text-[#625A6D] pt-2">{page.brandName}</p>
          {page.footerText && (
            <p className="mx-auto max-w-md text-[11px] leading-relaxed text-[#9E94A8]">
              {page.footerText}
            </p>
          )}

          {page.privacyText && (
            <details className="mx-auto max-w-md text-[11px] text-[#625A6D]">
              <summary className="cursor-pointer hover:text-[#6D28D9] transition-colors">
                Privacy &amp; Analytics Disclosure
              </summary>
              <p className="mt-2 leading-relaxed text-[#9E94A8] text-[10px]">
                {page.privacyText}
              </p>
            </details>
          )}
        </footer>
      </div>

      {/* Sticky Mobile Bottom CTA Bar */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E8E2EF] bg-white/95 p-3 backdrop-blur-md md:hidden"
          >
            <button
              type="button"
              onClick={() => handleCtaClick("sticky_mobile")}
              className={`flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${currentTheme.grad} text-sm font-extrabold text-white shadow-lg`}
            >
              <Send className="w-4 h-4" />
              <span>{page.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-full border border-[#E8E2EF] bg-white px-5 py-2 text-xs font-semibold text-[#17121F] shadow-xl backdrop-blur-md"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
