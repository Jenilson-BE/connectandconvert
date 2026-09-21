import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  theme = "light",
  className,
}: SectionHeadingProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border",
            isDark
              ? "bg-[#241B33] text-[#E9D5FF] border-[#6D28D9]/40"
              : "bg-[#F5EFFF] text-[#6D28D9] border-[#E9D5FF]"
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9]" />
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]",
          isDark ? "text-white" : "text-[#17121F]"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg leading-relaxed",
            isDark ? "text-[#C4B5FD]" : "text-[#625A6D]"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
