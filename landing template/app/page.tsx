"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Crown,
  Send,
} from "lucide-react";

import { telegramConfig } from "@/config/site";
import { initGA } from "@/lib/ga";
import { initMetaPixel } from "@/lib/meta-pixel";
import { captureAttribution } from "@/lib/attribution";

import {
  trackEngagement,
  trackLandingView,
  trackScrollDepth,
} from "@/lib/analytics";

import {
  cancelCountdown,
  isCountdownCancelled,
  openTelegram,
} from "@/lib/telegram";

import { sendVisitLog } from "@/lib/visit-log";



type ToastType = "info" | "error";

interface ToastState {
  message: string;
  type: ToastType;
}

/* -------------------------------------------------------------------------- */
/* Landing page                                                               */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  const totalSeconds = Math.max(
    Number(telegramConfig.redirectAfterSeconds) || 8,
    1,
  );

  const [toast, setToast] = useState<ToastState | null>(null);

  const [stickyVisible, setStickyVisible] = useState(false);

  const [countdownStarted, setCountdownStarted] =
    useState(false);

  const [remaining, setRemaining] =
    useState(totalSeconds);

  const intervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const toastTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const countdownStartedRef = useRef(false);

  const statsSectionRef =
    useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------------ */
  /* Toast                                                                    */
  /* ------------------------------------------------------------------------ */

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
    ) => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      setToast({
        message,
        type,
      });

      toastTimeoutRef.current =
        setTimeout(() => {
          setToast(null);
        }, 2600);
    },
    [],
  );

  /* ------------------------------------------------------------------------ */
  /* Countdown helpers                                                        */
  /* ------------------------------------------------------------------------ */

  const clearCountdown = useCallback(() => {
    if (!intervalRef.current) return;

    clearInterval(intervalRef.current);

    intervalRef.current = null;
  }, []);

  const startCountdown = useCallback(() => {
    if (!telegramConfig.autoRedirect) return;

    if (countdownStartedRef.current) return;

    countdownStartedRef.current = true;

    setCountdownStarted(true);

    trackEngagement("CountdownStartedByScroll");
    trackEngagement("countdown_started");
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Telegram click                                                           */
  /* ------------------------------------------------------------------------ */

  const handleTelegramClick = useCallback(
    (source: string) => {
      clearCountdown();

      cancelCountdown();

      showToast("Opening Telegram...");

      openTelegram({
        source,
      });
    },
    [
      clearCountdown,
      showToast,
    ],
  );

  /* ------------------------------------------------------------------------ */
  /* Analytics initialization                                                 */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    initGA();
    initMetaPixel();

    captureAttribution();

    sendVisitLog("websitevisit");

    trackLandingView();

    const timer5 = setTimeout(() => {
      trackEngagement("Engaged5Seconds");
    }, 5000);

    const timer10 = setTimeout(() => {
      trackEngagement("Engaged10Seconds");
    }, 10000);

    /* ---------------------------------------------------------------------- */
    /* Scroll-depth analytics                                                 */
    /* ---------------------------------------------------------------------- */

    const reachedScrollDepths =
      new Set<number>();

    const handleScrollDepth = () => {
      const scrollTop =
        window.scrollY;

      const scrollableHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (scrollableHeight <= 0) return;

      const percentage =
        Math.round(
          (scrollTop / scrollableHeight) * 100,
        );

      [25, 50, 75, 90].forEach(
        (depth) => {
          if (
            percentage >= depth &&
            !reachedScrollDepths.has(depth)
          ) {
            reachedScrollDepths.add(depth);

            trackScrollDepth(depth);
          }
        },
      );
    };

    window.addEventListener(
      "scroll",
      handleScrollDepth,
      {
        passive: true,
      },
    );

    /* ---------------------------------------------------------------------- */
    /* Sticky CTA                                                             */
    /* ---------------------------------------------------------------------- */

    const primaryCTA =
      document.getElementById(
        "cta-primary",
      );

    let stickyObserver:
      | IntersectionObserver
      | undefined;

    if (primaryCTA) {
      stickyObserver =
        new IntersectionObserver(
          ([entry]) => {
            setStickyVisible(
              !entry.isIntersecting,
            );
          },
          {
            threshold: 0.15,
          },
        );

      stickyObserver.observe(primaryCTA);
    }

    return () => {
      clearTimeout(timer5);
      clearTimeout(timer10);

      if (
        toastTimeoutRef.current
      ) {
        clearTimeout(
          toastTimeoutRef.current,
        );
      }

      window.removeEventListener(
        "scroll",
        handleScrollDepth,
      );

      stickyObserver?.disconnect();
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Start countdown on FIRST USER SCROLL                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!telegramConfig.autoRedirect) {
      return;
    }

    const handleFirstScroll = () => {
      if (window.scrollY < 8) {
        return;
      }

      startCountdown();

      window.removeEventListener(
        "scroll",
        handleFirstScroll,
      );
    };

    window.addEventListener(
      "scroll",
      handleFirstScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleFirstScroll,
      );
    };
  }, [startCountdown]);

  /* ------------------------------------------------------------------------ */
  /* Stats viewed                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const element =
      statsSectionRef.current;

    if (!element) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            !entry.isIntersecting
          ) {
            return;
          }

          trackEngagement(
            "StatsViewed",
          );

          observer.disconnect();
        },
        {
          threshold: 0.4,
        },
      );

    observer.observe(element);

    return () =>
      observer.disconnect();
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Countdown timer                                                          */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      !countdownStarted ||
      !telegramConfig.autoRedirect
    ) {
      return;
    }

    intervalRef.current =
      setInterval(() => {
        setRemaining(
          (previous) => {
            if (previous <= 1) {
              clearCountdown();

              if (
                !isCountdownCancelled()
              ) {
                trackEngagement(
                  "countdown_completed",
                );

                openTelegram({
                  source:
                    "scroll_auto_redirect",
                  isAutoRedirect: true,
                });
              }

              return 0;
            }

            return previous - 1;
          },
        );
      }, 1000);

    return clearCountdown;
  }, [
    countdownStarted,
    clearCountdown,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Countdown SVG                                                            */
  /* ------------------------------------------------------------------------ */

  const radius = 48;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    remaining / totalSeconds;

  const strokeDashoffset =
    circumference *
    (1 - progress);

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <main
      className="
        relative
        min-h-[100svh]
        overflow-hidden
        bg-[#FAFAFF]
        text-[#1E1B4B]
        selection:bg-violet-300
        selection:text-violet-950
      "
    >
      {/* ==================================================================== */}
      {/* Background decorations                                               */}
      {/* ==================================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          inset-0
          overflow-hidden
        "
      >
        {/* Subtle dot grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.4]
            [background-image:radial-gradient(circle,rgba(124,58,237,0.07)_1px,transparent_1px)]
            [background-size:32px_32px]
          "
        />

        {/* Top-right lavender blob */}
        <div
          className="
            absolute
            right-[-180px]
            top-[-120px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-violet-300/[0.18]
            blur-[120px]
          "
        />

        {/* Bottom-left lavender blob */}
        <div
          className="
            absolute
            bottom-[-200px]
            left-[-180px]
            h-[480px]
            w-[480px]
            rounded-full
            bg-purple-300/[0.14]
            blur-[130px]
          "
        />

        {/* Center glow */}
        <div
          className="
            absolute
            left-1/2
            top-[30%]
            h-[400px]
            w-[400px]
            -translate-x-1/2
            rounded-full
            bg-violet-200/[0.10]
            blur-[100px]
          "
        />

        {/* Decorative floating line */}
        <svg
          viewBox="0 0 1000 420"
          fill="none"
          className="
            absolute
            left-1/2
            top-[80px]
            h-[430px]
            w-[1000px]
            -translate-x-1/2
            opacity-[0.06]
          "
        >
          <motion.path
            d="
              M0 330
              L65 304
              L130 319
              L195 260
              L260 279
              L330 205
              L400 235
              L475 161
              L540 187
              L610 125
              L680 151
              L750 87
              L820 113
              L890 62
              L1000 84
            "
            stroke="url(#lineGrad)"
            strokeWidth="2"
            initial={{
              pathLength: 0,
            }}
            animate={{
              pathLength: 1,
            }}
            transition={{
              duration: 2,
              ease: "easeOut",
            }}
          />

          <defs>
            <linearGradient
              id="lineGrad"
              x1="0"
              y1="0"
              x2="1000"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#7C3AED"
                stopOpacity="0"
              />

              <stop
                offset="50%"
                stopColor="#A78BFA"
              />

              <stop
                offset="100%"
                stopColor="#7C3AED"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ==================================================================== */}
      {/* Main content                                                         */}
      {/* ==================================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-[620px]
          flex-col
          px-4
          pb-32
          pt-5
          sm:px-6
          sm:pt-8
        "
      >
        {/* ------------------------------------------------------------------ */}
        {/* Top badge                                                          */}
        {/* ------------------------------------------------------------------ */}

        <motion.div
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="
            flex
            justify-center
          "
        >
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-violet-300/40
              bg-violet-50/80
              px-4
              py-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-violet-600
              backdrop-blur-md
              shadow-[0_2px_12px_rgba(124,58,237,0.08)]
            "
          >
            <Crown
              size={13}
              strokeWidth={2.2}
              className="text-violet-500"
            />

            Profit Queen Community
          </div>
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* Logo                                                               */}
        {/* ------------------------------------------------------------------ */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.92,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            delay: 0.08,
          }}
          className="
            relative
            mx-auto
            mt-7
            flex
            h-[150px]
            w-[150px]
            items-center
            justify-center
            sm:h-[170px]
            sm:w-[170px]
          "
        >
          {/* Spinning dashed ring */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 34,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              inset-0
              rounded-full
              border
              border-dashed
              border-violet-300/40
            "
          />

          {/* Inner ring */}
          <div
            className="
              absolute
              inset-[8px]
              rounded-full
              border
              border-violet-200/30
            "
          />

          {/* Glow */}
          <div
            className="
              absolute
              inset-[20px]
              rounded-full
              bg-violet-400/[0.08]
              blur-xl
            "
          />

          {/* Logo container */}
          <div
            className="
              relative
              flex
              h-[124px]
              w-[124px]
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-violet-200/40
              bg-white
              shadow-[0_18px_55px_rgba(124,58,237,.10),0_0_40px_rgba(167,139,250,.08)]
              sm:h-[140px]
              sm:w-[140px]
            "
          >
            <Image
              src="/profit-queen-logo.jpg"
              alt="Profit Queen"
              width={180}
              height={180}
              priority
              className="
                h-[88%]
                w-[88%]
                object-contain
              "
            />
          </div>
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* Community status                                                   */}
        {/* ------------------------------------------------------------------ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
          className="
            mt-4
            flex
            justify-center
          "
        >
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-emerald-300/30
              bg-emerald-50/80
              px-3
              py-1.5
              text-[9px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-emerald-600
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-500
                shadow-[0_0_6px_rgba(16,185,129,0.6)]
              "
            />

            Community Access Available
          </div>
        </motion.div>

        {/* ------------------------------------------------------------------ */}
        {/* Hero                                                               */}
        {/* ------------------------------------------------------------------ */}

        <motion.section
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
            delay: 0.2,
          }}
          className="
            mt-5
            text-center
          "
        >
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.30em]
              text-violet-500
            "
          >
            Market Education Community
          </p>

          <h1
            className="
              mt-2
              font-[var(--font-display)]
              text-[44px]
              font-black
              leading-none
              tracking-[-0.03em]
              text-[#1E1B4B]
              sm:text-[58px]
            "
            style={{ fontFamily: "var(--font-display)" }}
          >
            Profit{" "}
            <span
              className="
                bg-gradient-to-r
                from-violet-500
                via-purple-500
                to-violet-600
                bg-clip-text
                text-transparent
              "
            >
              Queen
            </span>
          </h1>

          <h2
            className="
              mx-auto
              mt-4
              max-w-[440px]
              text-[22px]
              font-bold
              leading-[1.18]
              tracking-[-0.02em]
              text-[#1E1B4B]
              sm:text-[27px]
            "
          >
            Understand Markets
            <br />
            With More Clarity.
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-[430px]
              text-[14px]
              leading-6
              text-slate-500
              sm:text-[15px]
            "
          >
            Market education with clarity,
            technical analysis concepts, risk awareness
            and community updates.
          </p>
        </motion.section>

        {/* ------------------------------------------------------------------ */}
        {/* Main CTA                                                           */}
        {/* ------------------------------------------------------------------ */}

        <motion.button
          id="cta-primary"
          type="button"
          onClick={() =>
            handleTelegramClick("primary")
          }
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
          whileHover={{
            y: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
          className="
            group
            relative
            mt-7
            flex
            min-h-[70px]
            w-full
            items-center
            justify-between
            overflow-hidden
            rounded-[22px]
            border
            border-violet-200/50
            bg-gradient-to-r
            from-violet-600
            via-purple-600
            to-violet-700
            px-5
            text-left
            text-white
            shadow-[0_18px_45px_rgba(124,58,237,.18),inset_0_1px_0_rgba(255,255,255,.20)]
          "
        >
          {/* Sweep animation */}
          <motion.span
            aria-hidden="true"
            animate={{
              x: [
                "-180%",
                "280%",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 2.2,
              ease: "easeInOut",
            }}
            className="
              absolute
              inset-y-0
              w-24
              rotate-12
              bg-white/20
              blur-xl
            "
          />

          <span
            className="
              relative
              z-10
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-white/15
              "
            >
              <Send
                size={20}
                strokeWidth={2.5}
              />
            </span>

            <span>
              <span
                className="
                  block
                  text-[15px]
                  font-black
                  tracking-[0.025em]
                "
              >
                JOIN PROFIT QUEEN ON TELEGRAM
              </span>

              <span
                className="
                  mt-0.5
                  block
                  text-[10px]
                  font-semibold
                  text-white/65
                "
              >
                Continue to the Profit Queen community
              </span>
            </span>
          </span>

          <ArrowRight
            size={20}
            strokeWidth={2.4}
            className="
              relative
              z-10
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </motion.button>

        {/* ------------------------------------------------------------------ */}
        {/* Countdown section                                                  */}
        {/* ------------------------------------------------------------------ */}

        {telegramConfig.autoRedirect && (
          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="
              relative
              mt-8
              overflow-hidden
              rounded-[26px]
              border
              border-violet-200/50
              bg-gradient-to-b
              from-violet-50/80
              to-white/80
              px-5
              py-7
              text-center
              shadow-[0_4px_20px_rgba(124,58,237,0.06)]
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-slate-400
              "
            >
              {countdownStarted
                ? "Opening Telegram In"
                : "Scroll To Start"}
            </p>

            <div
              className="
                relative
                mx-auto
                mt-5
                h-[126px]
                w-[126px]
              "
            >
              <div
                className="
                  absolute
                  inset-[13px]
                  rounded-full
                  border
                  border-violet-200/30
                  bg-white/80
                "
              />

              <svg
                width="126"
                height="126"
                viewBox="0 0 126 126"
                className="-rotate-90"
              >
                <circle
                  cx="63"
                  cy="63"
                  r={radius}
                  fill="none"
                  stroke="rgba(124,58,237,.10)"
                  strokeWidth="4"
                />

                <motion.circle
                  cx="63"
                  cy="63"
                  r={radius}
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={
                    circumference
                  }
                  animate={{
                    strokeDashoffset,
                  }}
                  transition={{
                    duration: 0.75,
                  }}
                />
              </svg>

              <div
                className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >
                <AnimatePresence
                  mode="wait"
                >
                  <motion.span
                    key={remaining}
                    initial={{
                      opacity: 0,
                      scale: 0.75,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 1.15,
                    }}
                    className="
                      text-[36px]
                      font-black
                      leading-none
                      text-violet-600
                    "
                  >
                    {remaining}
                  </motion.span>
                </AnimatePresence>

                <span
                  className="
                    mt-1
                    text-[8px]
                    font-bold
                    uppercase
                    tracking-[0.20em]
                    text-slate-400
                  "
                >
                  seconds
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleTelegramClick(
                  "countdown",
                )
              }
              className="
                mt-5
                inline-flex
                items-center
                gap-1.5
                text-[11px]
                font-bold
                text-violet-600
                hover:text-violet-700
                transition-colors
              "
            >
              Open Telegram now

              <ArrowRight
                size={13}
              />
            </button>
          </motion.section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Trust disclaimer                                                   */}
        {/* ------------------------------------------------------------------ */}

        <div
          className="
            mt-4
            rounded-[16px]
            border
            border-violet-200/30
            bg-white/60
            px-4
            py-3
            text-center
          "
        >
          <p
            className="
              text-[10px]
              leading-5
              text-slate-400
            "
          >
            Profit Queen focuses on market
            education, technical analysis concepts,
            risk awareness and community learning.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Footer                                                             */}
        {/* ------------------------------------------------------------------ */}

        <footer
          className="
            mt-9
            text-center
          "
        >
          <p
            className="
              text-[12px]
              font-bold
              text-slate-500
            "
          >
            Profit Queen
          </p>

          <p
            className="
              mx-auto
              mt-2
              max-w-[420px]
              text-[9px]
              leading-[1.7]
              text-slate-400
            "
          >
            Educational content only.
            Trading involves risk.
            Nothing presented on this page
            guarantees financial results or
            future performance.
          </p>

          <details
            className="
              mx-auto
              mt-4
              max-w-[420px]
              text-[9px]
              text-slate-400
            "
          >
            <summary
              className="
                cursor-pointer
                text-slate-500
                transition
                hover:text-violet-600
              "
            >
              Privacy & Analytics
            </summary>

            <p
              className="
                mt-2
                leading-[1.7]
              "
            >
              This website may use analytics
              technologies including Meta Pixel
              and Google Analytics to understand
              website visits, campaign attribution
              and interactions with the Telegram
              button.
            </p>
          </details>
        </footer>
      </div>

      {/* ==================================================================== */}
      {/* Scroll-start countdown notification                                  */}
      {/* ==================================================================== */}

      <AnimatePresence>
        {countdownStarted &&
          remaining > 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              className="
                fixed
                left-1/2
                top-[max(12px,env(safe-area-inset-top))]
                z-[60]
                flex
                -translate-x-1/2
                items-center
                gap-3
                rounded-full
                border
                border-violet-200/50
                bg-white/95
                px-4
                py-2.5
                shadow-[0_8px_30px_rgba(124,58,237,0.12)]
                backdrop-blur-xl
              "
            >
              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-violet-100
                  text-[11px]
                  font-black
                  text-violet-600
                "
              >
                {remaining}
              </div>

              <div>
                <p
                  className="
                    whitespace-nowrap
                    text-[10px]
                    font-bold
                    text-[#1E1B4B]
                  "
                >
                  Opening Telegram
                </p>

                <p
                  className="
                    whitespace-nowrap
                    text-[8px]
                    text-slate-400
                  "
                >
                  Redirecting automatically
                </p>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* Sticky mobile CTA                                                    */}
      {/* ==================================================================== */}

      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{
              y: 100,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: 100,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              fixed
              inset-x-0
              bottom-0
              z-50
              border-t
              border-violet-200/40
              bg-white/90
              px-3
              pb-[max(12px,env(safe-area-inset-bottom))]
              pt-2.5
              backdrop-blur-xl
              md:hidden
            "
          >
            <button
              id="cta-sticky_mobile"
              type="button"
              onClick={() =>
                handleTelegramClick(
                  "sticky_mobile",
                )
              }
              className="
                mx-auto
                flex
                min-h-[54px]
                w-full
                max-w-[560px]
                items-center
                justify-center
                gap-2
                rounded-[17px]
                bg-gradient-to-r
                from-violet-600
                via-purple-600
                to-violet-700
                text-[13px]
                font-black
                text-white
                shadow-[0_10px_32px_rgba(124,58,237,.18)]
              "
            >
              <Send
                size={17}
                strokeWidth={2.6}
              />

              JOIN PROFIT QUEEN

              <ArrowRight
                size={17}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* Toast                                                                */}
      {/* ==================================================================== */}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 15,
              scale: 0.96,
            }}
            className="
              fixed
              bottom-24
              left-1/2
              z-[70]
              -translate-x-1/2
              whitespace-nowrap
              rounded-full
              border
              border-violet-200/40
              bg-white/95
              px-4
              py-2.5
              text-[11px]
              font-semibold
              text-[#1E1B4B]
              shadow-[0_8px_30px_rgba(124,58,237,0.12)]
              backdrop-blur-xl
            "
          >
            <span
              className="
                mr-2
                inline-block
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-violet-500
              "
            />

            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}