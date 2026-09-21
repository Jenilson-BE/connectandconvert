import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Digital Marketing Services",
  description:
    "Explore Connect & Convert's six core services: Meta Ads, Google Ads, SEO / AEO / GEO, Social Media Management, Content Creation & Branding, and Telegram Automation.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/services`,
  },
};

export default function ServicesOverviewPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#FAF9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFFF] text-[#6D28D9] border border-[#E9D5FF] text-xs font-semibold uppercase tracking-wider">
            CAPABILITIES &amp; SPECIALIZATIONS
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#17121F] tracking-tight leading-tight">
            Integrated digital services designed for growth.
          </h1>
          <p className="text-lg text-[#625A6D] leading-relaxed">
            We provide strategic, full-funnel digital marketing tailored to your specific audience, industry, and commercial priorities across India.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s) => (
            <div
              key={s.slug}
              className="p-8 rounded-3xl bg-white border border-[#E8E2EF] hover:border-[#D8B4FE] hover:shadow-xl hover:shadow-[#6D28D9]/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-mono font-bold text-[#6D28D9]">
                    {s.number}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5EFFF] text-[#6D28D9]">
                    Core Service
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[#17121F] mb-3 group-hover:text-[#6D28D9] transition-colors">
                  {s.title}
                </h2>

                <p className="text-sm text-[#625A6D] leading-relaxed mb-6">
                  {s.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-[#F5EFFF]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7] block mb-2">
                    Key Highlights
                  </span>
                  {s.deliverables.slice(0, 3).map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#17121F]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6D28D9] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E8E2EF] flex items-center justify-between">
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6D28D9] hover:text-[#5B21B6] group/link"
                >
                  <span>Explore {s.shortTitle}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Contact Hook */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#17121F] via-[#241B33] to-[#17121F] text-white border border-[#2E2440] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold">
              Need a multi-channel marketing plan?
            </h3>
            <p className="text-sm text-[#C4B5FD] max-w-xl">
              We often combine paid performance ads with messaging automation and content branding to maximize cross-channel ROI.
            </p>
          </div>
          <Button href="/contact" variant="primary" size="lg">
            Let's Work Together
          </Button>
        </div>
      </div>
    </main>
  );
}
