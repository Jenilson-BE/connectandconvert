import * as React from "react";
import Link from "next/link";
import { ShieldCheck, FileCheck, Layers, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function ProofSection() {
  return (
    <section className="py-20 md:py-28 bg-white border-y border-[#E8E2EF]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="TRANSPARENCY & PROOF"
          title="Proof that speaks for itself."
          subtitle="As a growing digital agency, we believe in radical transparency. We showcase real creative methodologies, verified frameworks, and concept explorations rather than fabricated metrics."
          align="center"
          className="mb-16"
        />

        {/* 3 Capability Proof Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#FAF9FC] border border-[#E8E2EF] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E2EF] flex items-center justify-center mb-6 text-[#6D28D9]">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-[#A855F7] tracking-wider block mb-2">
                FOUNDATIONAL INTEGRITY
              </span>
              <h3 className="text-xl font-bold text-[#17121F] mb-3">
                Methodology Over Hype
              </h3>
              <p className="text-sm text-[#625A6D] leading-relaxed">
                Every strategy we propose is grounded in proven conversion principles: structured testing matrices, message-to-audience matching, and robust server-side conversion tracking.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#E8E2EF]">
              <Link
                href="/case-studies"
                className="text-xs font-semibold text-[#6D28D9] hover:underline flex items-center gap-1"
              >
                Read Framework Case Studies <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#FAF9FC] border border-[#E8E2EF] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E2EF] flex items-center justify-center mb-6 text-[#6D28D9]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-[#A855F7] tracking-wider block mb-2">
                ETHICAL PRACTICES
              </span>
              <h3 className="text-xl font-bold text-[#17121F] mb-3">
                No Fabricated Outcomes
              </h3>
              <p className="text-sm text-[#625A6D] leading-relaxed">
                We clearly label our concept explorations and agency research. We do not invent fictitious client case studies or promise unrealistic guaranteed outcomes.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#E8E2EF]">
              <Link
                href="/about"
                className="text-xs font-semibold text-[#6D28D9] hover:underline flex items-center gap-1"
              >
                About Our Ethics &amp; Standards <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#FAF9FC] border border-[#E8E2EF] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E2EF] flex items-center justify-center mb-6 text-[#6D28D9]">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-[#A855F7] tracking-wider block mb-2">
                EARNED TRUST
              </span>
              <h3 className="text-xl font-bold text-[#17121F] mb-3">
                Growing With Our Clients
              </h3>
              <p className="text-sm text-[#625A6D] leading-relaxed">
                We're actively building our portfolio alongside forward-thinking business partners. Get in touch to collaborate on your next growth milestone.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#E8E2EF]">
              <Link
                href="/contact"
                className="text-xs font-semibold text-[#6D28D9] hover:underline flex items-center gap-1"
              >
                Start A Pilot Campaign <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Polished Capability Box */}
        <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#F5EFFF] via-[#FAF9FC] to-[#F5EFFF] border border-[#E9D5FF] text-center max-w-3xl mx-auto space-y-4">
          <h4 className="text-xl font-bold text-[#17121F]">
            Partner with an agency that puts transparency first.
          </h4>
          <p className="text-sm text-[#625A6D] leading-relaxed max-w-xl mx-auto">
            We're building our portfolio with meaningful creative and marketing work. Explore our capabilities or get in touch to discuss your project.
          </p>
          <div className="pt-2">
            <Button href="/contact" variant="primary" size="md">
              Let's Work Together
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
