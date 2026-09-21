import * as React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CtaBannerSection() {
  return (
    <section className="py-20 md:py-28 bg-[#FAF9FC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl md:rounded-[40px] bg-gradient-to-br from-[#17121F] via-[#21172E] to-[#17121F] text-white p-8 sm:p-12 md:p-16 lg:p-20 overflow-hidden shadow-2xl border border-[#2E2440]">
          {/* Subtle purple luxury glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6D28D9]/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#A855F7]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#241B33] border border-[#6D28D9]/40 text-xs font-semibold tracking-wider text-[#E9D5FF]">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>LET'S START SOMETHING GREAT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Let's build something meaningful.
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-[#C4B5FD] leading-relaxed max-w-2xl mx-auto font-normal">
              Have a business goal in mind? Let's discuss how Connect &amp; Convert can support your next digital marketing initiative.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="shadow-lg shadow-[#6D28D9]/30"
              >
                Let's Work Together
              </Button>
              <Button
                href="/services"
                variant="dark"
                size="lg"
                className="bg-[#241B33] hover:bg-[#2E2440] text-white border border-[#3D3055]"
              >
                Explore Our Services
              </Button>
            </div>

            <p className="text-xs text-[#9E94A8] pt-4">
              Serving businesses across India &bull; Free initial consultation &bull; No obligation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
