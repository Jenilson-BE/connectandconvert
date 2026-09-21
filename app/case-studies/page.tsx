import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { CASE_STUDIES } from "@/lib/case-studies";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Agency Case Studies & Strategic Blueprints",
  description:
    "Deconstruct our performance marketing, search architecture, and Telegram automation frameworks through detailed agency case studies.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/case-studies`,
  },
};

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#FAF9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFFF] text-[#6D28D9] border border-[#E9D5FF] text-xs font-semibold uppercase tracking-wider">
            DEEP-DIVE ANALYSIS
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#17121F] tracking-tight leading-tight">
            How we solve marketing challenges.
          </h1>
          <p className="text-base sm:text-lg text-[#625A6D] leading-relaxed">
            Detailed dissections of marketing frameworks, challenges, strategies, and execution playbooks across paid social, search intent, and automation.
          </p>
        </div>

        {/* Case Studies List */}
        <div className="space-y-12">
          {CASE_STUDIES.map((study) => (
            <article
              key={study.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8E2EF] hover:border-[#D8B4FE] hover:shadow-xl hover:shadow-[#6D28D9]/5 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group"
            >
              {/* Image Preview (5 cols) */}
              <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto w-full bg-[#17121F]">
                <Image
                  src={study.heroImage}
                  alt={study.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant={study.projectType === "Concept Work" ? "concept" : "agency"}>
                    {study.projectType}
                  </Badge>
                </div>
              </div>

              {/* Text & Content (7 cols) */}
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-semibold text-[#A855F7]">
                    <span>{study.category}</span>
                    <span>&bull;</span>
                    <div className="flex items-center gap-1 text-[#625A6D]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{study.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#17121F] group-hover:text-[#6D28D9] transition-colors leading-tight">
                    <Link href={`/case-studies/${study.slug}`}>{study.title}</Link>
                  </h2>

                  <p className="text-sm sm:text-base text-[#625A6D] leading-relaxed">
                    {study.subtitle}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#17121F] block mb-1">
                    The Challenge
                  </span>
                  <p className="text-xs sm:text-sm text-[#625A6D] line-clamp-2">
                    {study.challenge}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D28D9] hover:text-[#5B21B6] group/link"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                  <span className="text-xs text-[#625A6D]">
                    Methodology Blueprint
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
