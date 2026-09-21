import { Metadata } from "next";
import { PORTFOLIO_PROJECTS } from "@/lib/portfolio";
import { WorkGallery } from "@/components/portfolio/WorkGallery";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Selected Work & Creative Concepts",
  description:
    "Explore our portfolio of Meta Ads creative frameworks, Google Ads search architectures, SEO topical roadmaps, and Telegram automation workflows.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/work`,
  },
};

export default function WorkPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#FAF9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFFF] text-[#6D28D9] border border-[#E9D5FF] text-xs font-semibold uppercase tracking-wider">
            PORTFOLIO &amp; CONCEPTS
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#17121F] tracking-tight leading-tight">
            Creative thinking built to convert.
          </h1>
          <p className="text-base sm:text-lg text-[#625A6D] leading-relaxed">
            Browse our selected agency casework and strategic concept explorations. Each project is transparently labeled to distinguish client engagements from internal research benchmarks.
          </p>
        </div>

        {/* Filterable Gallery */}
        <WorkGallery projects={PORTFOLIO_PROJECTS} />
      </div>
    </main>
  );
}
