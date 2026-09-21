import * as React from "react";
import { WHY_CHOOSE_US } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WhyChooseSection() {
  return (
    <section className="py-20 md:py-28 bg-white border-y border-[#E8E2EF]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="AGENCY PRINCIPLES"
          title="Built around your business goals."
          subtitle="We focus on disciplined execution, honest communication, and sustainable marketing foundations rather than empty superlative claims."
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.number}
              className="p-8 rounded-3xl bg-[#FAF9FC] border border-[#E8E2EF] hover:border-[#D8B4FE] hover:shadow-lg hover:shadow-[#6D28D9]/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <span className="text-2xl font-mono font-bold text-[#6D28D9] block mb-4">
                  {item.number}
                </span>
                <h3 className="text-xl font-bold text-[#17121F] mb-3 group-hover:text-[#6D28D9] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[#625A6D] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E8E2EF]">
                <span className="text-xs text-[#A855F7] font-medium">
                  Connect &amp; Convert Standard
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
