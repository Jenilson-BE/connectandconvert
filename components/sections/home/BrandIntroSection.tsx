import * as React from "react";
import { Users, Lightbulb, BarChart3 } from "lucide-react";
import { CORE_VALUES } from "@/lib/constants";

export function BrandIntroSection() {
  const icons = [
    <Users key="1" className="w-6 h-6 text-[#6D28D9]" />,
    <Lightbulb key="2" className="w-6 h-6 text-[#A855F7]" />,
    <BarChart3 key="3" className="w-6 h-6 text-[#6D28D9]" />,
  ];

  return (
    <section className="py-20 md:py-28 bg-white border-y border-[#E8E2EF]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFFF] text-[#6D28D9] border border-[#E9D5FF] text-xs font-semibold uppercase tracking-wider">
            OUR PERSPECTIVE
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17121F] tracking-tight leading-tight">
            Marketing is more than being seen.
          </h2>

          <p className="text-lg sm:text-xl text-[#17121F] font-medium leading-relaxed">
            It's about reaching the right people, communicating meaningful value, and creating opportunities for businesses to grow.
          </p>

          <p className="text-base sm:text-lg text-[#625A6D] leading-relaxed max-w-3xl mx-auto">
            Connect &amp; Convert brings together marketing strategy, creative execution, and digital channels to help businesses communicate with their audiences and work toward their growth objectives.
          </p>
        </div>

        {/* 3 Core Principles */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {CORE_VALUES.map((val, idx) => (
            <div
              key={val.title}
              className="p-8 rounded-3xl bg-[#FAF9FC] border border-[#E8E2EF] hover:border-[#D8B4FE] hover:shadow-lg hover:shadow-[#6D28D9]/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E2EF] group-hover:border-[#D8B4FE] flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                {icons[idx]}
              </div>
              <span className="text-xs font-mono font-bold text-[#A855F7] tracking-wider block mb-2">
                PRINCIPLE 0{idx + 1}
              </span>
              <h3 className="text-xl font-bold text-[#17121F] mb-3 group-hover:text-[#6D28D9] transition-colors">
                {val.title}
              </h3>
              <p className="text-sm text-[#625A6D] leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
