import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, HeartHandshake, Sparkles, BookOpen, Search } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us — Digital Marketing Agency | Connect & Convert",
  description:
    "Learn about Connect & Convert, a digital marketing agency in India focused on performance marketing, creative execution, and transparent partnerships.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/about`,
  },
};

const VALUES = [
  {
    icon: <Search className="w-5 h-5 text-[#6D28D9]" />,
    title: "Clarity",
    description:
      "We believe in crystal-clear communication, transparent campaign structures, and data visibility with zero confusing agency jargon.",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-[#A855F7]" />,
    title: "Creativity",
    description:
      "Aesthetic excellence and direct-response psychology must work together to capture genuine customer attention in saturated feeds.",
  },
  {
    icon: <BookOpen className="w-5 h-5 text-[#6D28D9]" />,
    title: "Continuous Learning",
    description:
      "Digital algorithms and buyer preferences evolve constantly. We stay ahead through disciplined testing and rapid iteration.",
  },
  {
    icon: <Shield className="w-5 h-5 text-[#A855F7]" />,
    title: "Responsible Marketing",
    description:
      "We strictly respect user privacy, platform advertising policies, and consent standards, rejecting deceptive clickbait and spam.",
  },
  {
    icon: <HeartHandshake className="w-5 h-5 text-[#6D28D9]" />,
    title: "Client Collaboration",
    description:
      "We treat our clients as long-term partners, aligning directly with their commercial milestones rather than isolated vanity metrics.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#FAF9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* 1. Hero */}
        <section className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFFF] text-[#6D28D9] border border-[#E9D5FF] text-xs font-semibold uppercase tracking-wider">
            WHO WE ARE
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#17121F] tracking-tight leading-tight">
            We help ambitious businesses connect, communicate, and convert.
          </h1>
          <p className="text-lg sm:text-xl text-[#6D28D9] font-medium leading-relaxed">
            Connect &amp; Convert is a digital marketing agency established in India to deliver modern, performance-driven growth solutions.
          </p>
          <p className="text-base sm:text-lg text-[#625A6D] leading-relaxed">
            As a newly established agency, we are building our foundation on craft, transparency, and methodical execution. We believe that sustainable business growth doesn't come from empty superlatives or vanity traffic, but from understanding your real buyers, crafting compelling creative propositions, and building seamless conversion workflows.
          </p>
        </section>

        {/* 2. Our Approach */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-[#E8E2EF] space-y-8">
          <SectionHeading
            eyebrow="OUR PHILOSOPHY"
            title="Where strategy, creative, and digital execution meet."
            subtitle="Great marketing requires balance. Strategy without creative is ignored. Creative without performance discipline is art without commercial return."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="p-6 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] space-y-3">
              <span className="text-xs font-mono font-bold text-[#6D28D9]">PILLAR 01</span>
              <h3 className="text-xl font-bold text-[#17121F]">Audience Alignment</h3>
              <p className="text-sm text-[#625A6D] leading-relaxed">
                Before launching ad spend or designing banners, we uncover the exact language, objections, and buying criteria of your ideal prospects.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] space-y-3">
              <span className="text-xs font-mono font-bold text-[#A855F7]">PILLAR 02</span>
              <h3 className="text-xl font-bold text-[#17121F]">Compelling Creative</h3>
              <p className="text-sm text-[#625A6D] leading-relaxed">
                We produce thumb-stopping mobile assets, clear direct-response copywriting, and recognizable brand systems that build immediate trust.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] space-y-3">
              <span className="text-xs font-mono font-bold text-[#6D28D9]">PILLAR 03</span>
              <h3 className="text-xl font-bold text-[#17121F]">Frictionless Conversion</h3>
              <p className="text-sm text-[#625A6D] leading-relaxed">
                We connect ad clicks with fast landing experiences and instant Telegram qualification workflows, eliminating prospect drop-off.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Our Values */}
        <section className="space-y-12">
          <SectionHeading
            eyebrow="AGENCY VALUES"
            title="The principles that guide our work."
            subtitle="We hold ourselves to rigorous ethical and operational standards across every project."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((val) => (
              <div
                key={val.title}
                className="p-8 rounded-3xl bg-white border border-[#E8E2EF] hover:border-[#D8B4FE] hover:shadow-lg transition-all space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF9FC] border border-[#E8E2EF] flex items-center justify-center shadow-2xs">
                  {val.icon}
                </div>
                <h3 className="text-lg font-bold text-[#17121F]">{val.title}</h3>
                <p className="text-sm text-[#625A6D] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Our Capabilities */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-[#E8E2EF] space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHeading
              eyebrow="CAPABILITIES"
              title="Six specialized services. One cohesive strategy."
              subtitle="Explore how our capabilities can be assembled into an integrated growth engine for your brand."
            />
            <Button href="/services" variant="secondary" size="md">
              View All Services
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="p-6 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] hover:border-[#6D28D9] hover:bg-white hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-[#A855F7] block mb-2">
                    {s.number}
                  </span>
                  <h4 className="text-lg font-bold text-[#17121F] group-hover:text-[#6D28D9] transition-colors mb-2">
                    {s.title}
                  </h4>
                  <p className="text-xs text-[#625A6D] line-clamp-2">
                    {s.tagline}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8E2EF] flex items-center justify-between text-xs font-semibold text-[#6D28D9]">
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. CTA */}
        <section className="rounded-3xl bg-[#17121F] text-white p-8 sm:p-12 md:p-16 text-center space-y-6 border border-[#2E2440]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Let's build a lasting partnership.
          </h2>
          <p className="text-base sm:text-lg text-[#C4B5FD] max-w-xl mx-auto">
            Ready to explore what disciplined digital marketing can do for your business in India?
          </p>
          <div className="pt-2">
            <Button href="/contact" variant="primary" size="lg">
              Let's Work Together
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
