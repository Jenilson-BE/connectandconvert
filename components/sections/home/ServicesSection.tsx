"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function ServicesSection() {
  const [activeService, setActiveService] = React.useState<string>(SERVICES[0].slug);

  const current = SERVICES.find((s) => s.slug === activeService) || SERVICES[0];

  return (
    <section className="py-20 md:py-28 bg-[#FAF9FC] relative" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeading
            eyebrow="CAPABILITIES & SERVICES"
            title="Everything your digital presence needs to move forward."
            subtitle="From paid performance campaigns to content and messaging automation, explore the specialized capabilities designed to support your brand's growth."
          />
          <Button href="/services" variant="secondary" size="md">
            All Services Details
          </Button>
        </div>

        {/* Asymmetric / Editorial Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Numbered Editorial List (7 cols) */}
          <div className="lg:col-span-7 divide-y divide-[#E8E2EF]">
            {SERVICES.map((service) => {
              const isActive = activeService === service.slug;
              return (
                <div
                  key={service.slug}
                  onMouseEnter={() => setActiveService(service.slug)}
                  className={`py-6 sm:py-8 transition-all duration-200 cursor-pointer group ${
                    isActive ? "opacity-100" : "opacity-85 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span
                        className={`text-sm sm:text-base font-mono font-bold transition-colors ${
                          isActive ? "text-[#6D28D9]" : "text-[#A855F7]/70 group-hover:text-[#6D28D9]"
                        }`}
                      >
                        {service.number}
                      </span>
                      <div>
                        <h3
                          className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight transition-colors ${
                            isActive
                              ? "text-[#6D28D9]"
                              : "text-[#17121F] group-hover:text-[#6D28D9]"
                          }`}
                        >
                          {service.title}
                        </h3>
                        <p className="mt-2 text-sm sm:text-base text-[#625A6D] leading-relaxed max-w-xl">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/services/${service.slug}`}
                      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-[#6D28D9] text-white rotate-0"
                          : "bg-white border border-[#E8E2EF] text-[#625A6D] group-hover:border-[#6D28D9] group-hover:text-[#6D28D9]"
                      }`}
                      aria-label={`View ${service.title} details`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Mobile-only Deliverables preview */}
                  <div className="mt-4 pl-10 sm:pl-12 lg:hidden">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center text-xs font-semibold text-[#6D28D9] hover:underline"
                    >
                      Explore {service.shortTitle} Deliverables →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Sticky Live Deliverables Card (5 cols) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <div className="bg-white rounded-3xl p-8 border border-[#E8E2EF] shadow-xl shadow-[#6D28D9]/5 space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-[#F5EFFF]">
                <span className="text-xs font-mono font-bold text-[#6D28D9] tracking-wider">
                  SPECIFICATION {current.number}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5EFFF] text-[#6D28D9]">
                  {current.shortTitle}
                </span>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#17121F] mb-2">
                  What we deliver
                </h4>
                <p className="text-xs text-[#625A6D] leading-relaxed">
                  {current.tagline}
                </p>
              </div>

              {/* Deliverable Checkpoints */}
              <ul className="space-y-3">
                {current.deliverables.slice(0, 5).map((deliv, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#17121F]">
                    <div className="w-4 h-4 rounded-full bg-[#F5EFFF] text-[#6D28D9] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span className="leading-snug text-[#625A6D]">{deliv}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-[#F5EFFF] space-y-3">
                <Button
                  href={`/services/${current.slug}`}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Explore {current.shortTitle} Page
                </Button>
                <p className="text-center text-[11px] text-[#625A6D]">
                  Transparent workflows &bull; No lock-in contracts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
