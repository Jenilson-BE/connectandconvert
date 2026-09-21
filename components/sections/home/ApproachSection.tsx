import * as React from "react";
import { MARKETING_FRAMEWORK } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ApproachSection() {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#E8E2EF]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="OUR FRAMEWORK"
          title="Different businesses. Different strategies."
          subtitle="Your business has its own audience, challenges, and growth objectives. We develop marketing approaches based on your goals, market, and available resources."
          align="center"
          className="mb-16"
        />

        {/* 4-Step Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {MARKETING_FRAMEWORK.map((item, idx) => (
            <div
              key={item.step}
              className="relative p-6 sm:p-8 rounded-3xl bg-[#FAF9FC] border border-[#E8E2EF] hover:border-[#D8B4FE] hover:shadow-lg hover:shadow-[#6D28D9]/5 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Step indicator */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold font-mono text-[#6D28D9] group-hover:scale-110 transition-transform">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E8E2EF] flex items-center justify-center text-xs font-bold text-[#A855F7] group-hover:bg-[#6D28D9] group-hover:text-white group-hover:border-transparent transition-colors">
                    0{idx + 1}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#17121F] mb-3 group-hover:text-[#6D28D9] transition-colors">
                  {item.name}
                </h3>

                <p className="text-sm text-[#625A6D] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom status line */}
              <div className="mt-8 pt-4 border-t border-[#E8E2EF]">
                <span className="text-xs font-semibold text-[#A855F7]">
                  Phase 0{idx + 1} Milestone
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
