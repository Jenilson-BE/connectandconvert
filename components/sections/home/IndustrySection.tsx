"use client";

import * as React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { INDUSTRIES } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function IndustrySection() {
  const [selectedIndustry, setSelectedIndustry] = React.useState<string>(INDUSTRIES[0].id);

  const current = INDUSTRIES.find((ind) => ind.id === selectedIndustry) || INDUSTRIES[0];

  return (
    <section className="py-20 md:py-28 bg-[#FAF9FC] relative" id="industries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="TAILORED SOLUTIONS"
          title="Your industry. Your opportunity."
          subtitle="Explore how strategic digital marketing and conversion workflows can be adapted to the specific dynamics, compliance, and buyer behaviors of your sector."
          align="center"
          className="mb-16"
        />

        {/* Interactive Industry Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Industry Navigation Tabs (5 cols) */}
          <div className="lg:col-span-5 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
            {INDUSTRIES.map((ind) => {
              const isSelected = selectedIndustry === ind.id;
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setSelectedIndustry(ind.id)}
                  className={`text-left px-5 py-4 rounded-2xl transition-all duration-200 shrink-0 lg:shrink w-auto lg:w-full border flex items-center justify-between group ${
                    isSelected
                      ? "bg-white border-[#6D28D9] shadow-md shadow-[#6D28D9]/5 text-[#6D28D9]"
                      : "bg-[#FAF9FC] border-[#E8E2EF] text-[#625A6D] hover:bg-white hover:text-[#17121F]"
                  }`}
                >
                  <span className="font-semibold text-sm sm:text-base">
                    {ind.name}
                  </span>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform hidden sm:block ${
                      isSelected ? "translate-x-1 text-[#6D28D9]" : "opacity-0 group-hover:opacity-100 text-[#A855F7]"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Industry Content & Strategic Blueprint (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2EF] shadow-lg shadow-[#6D28D9]/5 space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7]">
                  Sector Strategic Alignment
                </span>
                <span className="text-xs text-[#625A6D]">&bull;</span>
                <span className="text-xs text-[#625A6D]">India Market Application</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#17121F]">
                {current.name}
              </h3>

              <p className="text-base sm:text-lg font-medium text-[#6D28D9]">
                {current.tagline}
              </p>

              <p className="text-sm sm:text-base text-[#625A6D] leading-relaxed">
                {current.description}
              </p>

              <div className="pt-4 border-t border-[#F5EFFF]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17121F] mb-4">
                  Key Strategic Deliverables for this Sector:
                </h4>
                <div className="space-y-3">
                  {current.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-[#17121F]">
                      <CheckCircle className="w-4 h-4 text-[#6D28D9] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#F5EFFF] flex flex-wrap items-center justify-between gap-4">
                <Button
                  href={`/contact?industry=${encodeURIComponent(current.name)}`}
                  variant="primary"
                  size="md"
                >
                  Discuss {current.name} Strategy
                </Button>
                <span className="text-xs text-[#625A6D]">
                  Custom consultation &bull; No pressure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
