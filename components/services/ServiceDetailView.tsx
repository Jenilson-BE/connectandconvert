import * as React from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { ServiceItem } from "@/lib/types";
import { PORTFOLIO_PROJECTS } from "@/lib/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/seo";

interface ServiceDetailViewProps {
  service: ServiceItem;
}

export function ServiceDetailView({ service }: ServiceDetailViewProps) {
  const serviceSchema = generateServiceSchema({
    title: service.title,
    description: service.description,
    slug: service.slug,
  });

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
    { name: service.shortTitle, item: `/services/${service.slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  // Find matching portfolio project
  const relevantProjects = PORTFOLIO_PROJECTS.filter((p) =>
    p.services.some((s) => s.toLowerCase().includes(service.shortTitle.toLowerCase()))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen pt-28 pb-20 bg-[#FAF9FC]">
        {/* 1. Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#625A6D]">
            <Link href="/" className="hover:text-[#6D28D9] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#E8E2EF]" />
            <Link href="/services" className="hover:text-[#6D28D9] transition-colors">
              Services
            </Link>
            <ChevronRight className="w-3 h-3 text-[#E8E2EF]" />
            <span className="text-[#17121F] font-semibold">{service.shortTitle}</span>
          </nav>
        </div>

        {/* 2. Service Hero */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFFF] text-[#6D28D9] border border-[#E9D5FF] text-xs font-semibold uppercase tracking-wider">
                SERVICE {service.number} &bull; PERFORMANCE MARKETING
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#17121F] tracking-tight leading-[1.1]">
                {service.title}
              </h1>

              <p className="text-xl text-[#6D28D9] font-medium leading-relaxed">
                {service.tagline}
              </p>

              <p className="text-base sm:text-lg text-[#625A6D] leading-relaxed max-w-3xl">
                {service.description}
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Button href="/contact" variant="primary" size="lg">
                  {service.ctaText}
                </Button>
                <Button href="#deliverables" variant="secondary" size="lg">
                  View Deliverables
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3 & 4. What We Help With (Deliverables) */}
        <section id="deliverables" className="py-16 md:py-24 bg-white border-y border-[#E8E2EF]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-4">
                <SectionHeading
                  eyebrow="SCOPE & CAPABILITIES"
                  title="What we deliver for your business."
                  subtitle="Every engagement includes transparent deliverables, continuous quality control, and actionable performance visibility."
                />
                <div className="pt-4 p-6 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#17121F]">
                    <Sparkles className="w-4 h-4 text-[#6D28D9]" />
                    <span>Quality Guarantee</span>
                  </div>
                  <p className="text-xs text-[#625A6D] leading-relaxed">
                    We adhere strictly to platform advertising standards, privacy guidelines, and server-side conversion attribution.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-[#FAF9FC] rounded-3xl p-8 border border-[#E8E2EF] shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#A855F7] mb-2">
                    Key Deliverables Checklist
                  </h3>
                  <div className="space-y-3.5">
                    {service.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 p-3 rounded-xl bg-white border border-[#E8E2EF]"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#6D28D9] shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base font-medium text-[#17121F] leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Strategy & Step-by-Step Workflow */}
        <section className="py-16 md:py-24 bg-[#FAF9FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="OUR METHODOLOGY"
              title="A structured, predictable workflow."
              subtitle="We eliminate ambiguity by guiding your campaigns through four defined development milestones."
              align="center"
              className="mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.workflow.map((w, idx) => (
                <div
                  key={w.step}
                  className="p-6 rounded-3xl bg-white border border-[#E8E2EF] shadow-xs hover:border-[#D8B4FE] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-[#A855F7] tracking-wider block mb-3">
                      STEP {w.step}
                    </span>
                    <h3 className="text-lg font-bold text-[#17121F] mb-2">
                      {w.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#625A6D] leading-relaxed">
                      {w.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#F5EFFF] text-[11px] font-semibold text-[#6D28D9]">
                    Milestone 0{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Suitable Business Goals */}
        <section className="py-16 md:py-24 bg-white border-y border-[#E8E2EF]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
                STRATEGIC FIT
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#17121F]">
                Who this service is ideal for
              </h2>
              <p className="text-base text-[#625A6D]">
                Our {service.shortTitle} service delivers the highest return when aligned with specific commercial objectives:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {service.suitableFor.map((goal, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F5EFFF] text-[#6D28D9] flex items-center justify-center shrink-0 font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <span className="text-sm font-medium text-[#17121F] leading-snug">
                    {goal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Relevant Work / Concept Examples */}
        {relevantProjects.length > 0 && (
          <section className="py-16 md:py-24 bg-[#FAF9FC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="RELEVANT CASEWORK"
                title={`Selected work related to ${service.shortTitle}.`}
                subtitle="Explore our practical creative approaches and campaign frameworks."
                className="mb-12"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relevantProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-6 rounded-3xl bg-white border border-[#E8E2EF] hover:border-[#D8B4FE] hover:shadow-lg transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={p.projectType === "Concept Work" ? "concept" : "agency"}
                      >
                        {p.projectType}
                      </Badge>
                      <span className="text-xs text-[#625A6D]">{p.industry}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#17121F]">{p.title}</h3>
                    <p className="text-sm text-[#625A6D] leading-relaxed">
                      {p.shortDescription}
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/work"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D28D9] hover:underline"
                      >
                        View Project Overview <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 8. Service FAQs */}
        <section className="py-16 md:py-24 bg-white border-y border-[#E8E2EF]/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="SERVICE FAQS"
              title={`Common questions about ${service.shortTitle}`}
              subtitle="Straightforward answers to help you evaluate if this service is right for your current stage."
              align="center"
              className="mb-12"
            />
            <Accordion items={service.faqs} />
          </div>
        </section>

        {/* 9. CTA */}
        <section className="py-16 md:py-20 bg-[#FAF9FC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#17121F] text-white p-8 sm:p-12 text-center space-y-6 border border-[#2E2440]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Ready to accelerate your {service.shortTitle}?
              </h2>
              <p className="text-sm sm:text-base text-[#C4B5FD] max-w-xl mx-auto">
                Schedule an introductory discussion to explore how our strategy and creative execution can support your growth.
              </p>
              <div className="pt-2">
                <Button href="/contact" variant="primary" size="lg">
                  Let's Work Together
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
