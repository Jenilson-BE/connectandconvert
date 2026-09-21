"use client";

import * as React from "react";
import { ArrowRight, Sparkles, TrendingUp, Layers, Target, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#FAF9FC]">
      {/* Ambient background glow & radial gradient */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#6D28D9]/10 via-[#A855F7]/10 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-[#E9D5FF]/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#E8E2EF] shadow-xs text-xs font-semibold tracking-wider text-[#6D28D9]">
              <span className="w-2 h-2 rounded-full bg-[#6D28D9] animate-pulse" />
              <span>DIGITAL MARKETING • CREATIVE • GROWTH</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#17121F] leading-[1.08]">
              Connect with your audience.{" "}
              <span className="bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent block mt-1">
                Convert attention into growth.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[#625A6D] leading-relaxed max-w-2xl font-normal">
              We help businesses strengthen their digital presence through performance marketing, strategic content, and creative solutions designed around their business goals.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Let's Work Together
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                Explore Our Services
              </Button>
            </div>

            {/* Key trust markers tailored for India */}
            <div className="pt-6 border-t border-[#E8E2EF]/80 grid grid-cols-3 gap-4 max-w-xl text-xs sm:text-sm text-[#625A6D]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6D28D9] shrink-0" />
                <span>Transparent Strategy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6D28D9] shrink-0" />
                <span>Pan-India Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6D28D9] shrink-0" />
                <span>Full-Funnel Testing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Abstract Marketing Visual Board */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Decorative Frame with Purple Luxury Accents */}
              <div className="relative bg-white rounded-3xl p-6 shadow-xl shadow-[#6D28D9]/5 border border-[#E8E2EF] overflow-hidden">
                {/* Header strip of creative board */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F5EFFF]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#E9D5FF]" />
                    <div className="w-3 h-3 rounded-full bg-[#D8B4FE]" />
                    <div className="w-3 h-3 rounded-full bg-[#6D28D9]" />
                    <span className="text-xs font-mono text-[#625A6D] ml-2">CAMPAIGN LAB</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F5EFFF] text-[#6D28D9]">
                    Active Framework
                  </span>
                </div>

                {/* Layered campaign cards */}
                <div className="mt-5 space-y-4">
                  {/* Card 1: Paid Traffic Strategy */}
                  <div className="p-4 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] hover:border-[#D8B4FE] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#17121F]">
                        <Target className="w-4 h-4 text-[#6D28D9]" />
                        <span>High-Intent Audience Capture</span>
                      </div>
                      <span className="text-xs font-mono text-[#A855F7] font-semibold">Step 01</span>
                    </div>
                    <p className="text-xs text-[#625A6D] leading-relaxed">
                      Custom persona targeting across Meta &amp; Google Search, filtering for verified buying signals.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1.5 flex-1 bg-[#E8E2EF] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#6D28D9] to-[#A855F7] w-4/5 rounded-full" />
                      </div>
                      <span className="text-[10px] font-mono text-[#6D28D9] font-semibold">Intent: 94%</span>
                    </div>
                  </div>

                  {/* Card 2: Creative Testing & Hook Analysis */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#17121F] to-[#241B33] text-white border border-[#2E2440] shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#E9D5FF]">
                        <Sparkles className="w-4 h-4 text-[#A855F7]" />
                        <span>Creative Angle Variation</span>
                      </div>
                      <span className="text-xs font-mono text-[#C4B5FD] font-semibold">Step 02</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 my-2 text-center">
                      <div className="p-2 rounded-lg bg-[#2E2440]/60 border border-[#3D3055]">
                        <span className="text-[10px] text-[#A855F7] block">Hook 1</span>
                        <span className="text-xs font-bold text-white">Visual</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#6D28D9]/40 border border-[#A855F7]">
                        <span className="text-[10px] text-[#E9D5FF] block">Hook 2</span>
                        <span className="text-xs font-bold text-white">Direct</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#2E2440]/60 border border-[#3D3055]">
                        <span className="text-[10px] text-[#A855F7] block">Hook 3</span>
                        <span className="text-xs font-bold text-white">Proof</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#C4B5FD] block text-right">Rapid iteration matrix</span>
                  </div>

                  {/* Card 3: Conversion & Telegram Flow */}
                  <div className="p-4 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] hover:border-[#D8B4FE] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#17121F]">
                        <TrendingUp className="w-4 h-4 text-[#6D28D9]" />
                        <span>Conversion &amp; Lead Routing</span>
                      </div>
                      <span className="text-xs font-mono text-[#A855F7] font-semibold">Step 03</span>
                    </div>
                    <p className="text-xs text-[#625A6D]">
                      Seamless transition from ad impression to Telegram qualification &amp; CRM synchronization.
                    </p>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-3 -left-3 bg-[#FAF9FC] px-4 py-2 rounded-full border border-[#D8B4FE] shadow-lg flex items-center gap-2 text-xs font-semibold text-[#17121F]">
                  <Layers className="w-3.5 h-3.5 text-[#6D28D9]" />
                  <span>Integrated Digital Growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
