import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowLeft, CheckCircle2, Clock, Target, Lightbulb, TrendingUp } from "lucide-react";
import { CASE_STUDIES } from "@/lib/case-studies";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { generateBreadcrumbSchema } from "@/lib/seo";

export async function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) return { title: "Case Study Not Found" };

  return {
    title: study.title,
    description: study.subtitle,
    alternates: {
      canonical: `${SITE_CONFIG.domain}/case-studies/${study.slug}`,
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) notFound();

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Case Studies", item: "/case-studies" },
    { name: study.title, item: `/case-studies/${study.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />

      <main className="min-h-screen pt-28 pb-24 bg-[#FAF9FC]">
        {/* Breadcrumb Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#625A6D]">
            <Link href="/" className="hover:text-[#6D28D9]">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#E8E2EF]" />
            <Link href="/case-studies" className="hover:text-[#6D28D9]">Case Studies</Link>
            <ChevronRight className="w-3 h-3 text-[#E8E2EF]" />
            <span className="text-[#17121F] font-semibold truncate max-w-[200px]">{study.title}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-6">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D28D9] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Case Studies
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={study.projectType === "Concept Work" ? "concept" : "agency"}>
                {study.projectType}
              </Badge>
              <span className="text-xs text-[#625A6D]">&bull;</span>
              <span className="text-xs font-semibold text-[#A855F7]">{study.category}</span>
              <span className="text-xs text-[#625A6D]">&bull;</span>
              <div className="flex items-center gap-1 text-xs text-[#625A6D]">
                <Clock className="w-3.5 h-3.5" />
                <span>{study.readTime}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17121F] tracking-tight leading-tight">
              {study.title}
            </h1>

            <p className="text-lg sm:text-xl text-[#625A6D] leading-relaxed">
              {study.subtitle}
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-[#E8E2EF] bg-[#17121F]">
            <Image
              src={study.heroImage}
              alt={study.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>

          {/* 1. Project Overview */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2EF] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              01 — Project Overview
            </h2>
            <p className="text-base sm:text-lg text-[#17121F] leading-relaxed">
              {study.overview}
            </p>
          </section>

          {/* 2. Business Challenge */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2EF] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              02 — The Business Challenge
            </h2>
            <p className="text-base text-[#625A6D] leading-relaxed">
              {study.challenge}
            </p>
          </section>

          {/* 3. Objectives */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2EF] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              03 — Objectives
            </h2>
            <div className="space-y-3">
              {study.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#17121F]">
                  <Target className="w-5 h-5 text-[#6D28D9] shrink-0 mt-0.5" />
                  <span className="leading-snug">{obj}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Strategy */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2EF] space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              04 — Strategic Approach
            </h2>
            <div className="space-y-6">
              {study.strategy.map((st, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] space-y-2">
                  <h3 className="text-lg font-bold text-[#17121F]">
                    {st.title}
                  </h3>
                  <p className="text-sm text-[#625A6D] leading-relaxed">
                    {st.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Execution */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2EF] space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              05 — Execution &amp; Implementation
            </h2>
            <div className="space-y-6">
              {study.execution.map((ex, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="text-lg font-bold text-[#17121F]">
                    {ex.title}
                  </h3>
                  <ul className="space-y-2">
                    {ex.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-sm text-[#625A6D]">
                        <CheckCircle2 className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Creative Examples */}
          {study.creativeSamples && (
            <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2EF] space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
                06 — Creative Formats Evaluated
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {study.creativeSamples.map((sample, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] text-center space-y-2">
                    <span className="text-[11px] font-mono font-bold text-[#A855F7] block">
                      {sample.type}
                    </span>
                    <p className="text-xs font-semibold text-[#17121F]">
                      {sample.caption}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 7. Measurement Approach */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2EF] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              07 — Measurement &amp; Gating Criteria
            </h2>
            <div className="space-y-3">
              {study.measurement.map((m, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[#17121F]">
                  <TrendingUp className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Learnings */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2EF] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              08 — Strategic Learnings
            </h2>
            <div className="space-y-3">
              {study.learnings.map((l, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#F5EFFF]/40 border border-[#E9D5FF] text-sm text-[#17121F]">
                  <Lightbulb className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                  <span className="leading-snug">{l}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 9. CTA */}
          <section className="rounded-3xl bg-[#17121F] text-white p-8 sm:p-12 text-center space-y-6 border border-[#2E2440]">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Want to apply this strategy to your business?
            </h2>
            <p className="text-sm sm:text-base text-[#C4B5FD] max-w-xl mx-auto">
              Connect with our team to map out how these performance principles can drive qualified inquiries for your offering.
            </p>
            <div className="pt-2">
              <Button href="/contact" variant="primary" size="lg">
                Let's Work Together
              </Button>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
