import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "concept" | "agency" | "client" | "category" | "neutral";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  const variants = {
    concept:
      "bg-[#F5EFFF] text-[#6D28D9] border-[#E9D5FF] font-semibold tracking-wide",
    agency:
      "bg-[#FAF5FF] text-[#7C3AED] border-[#D8B4FE] font-semibold tracking-wide",
    client:
      "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] font-semibold tracking-wide",
    category:
      "bg-white text-[#625A6D] border-[#E8E2EF] hover:border-[#A855F7] hover:text-[#6D28D9]",
    neutral:
      "bg-[#FAF9FC] text-[#625A6D] border-[#E8E2EF]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {variant === "concept" && <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] inline-block" />}
      {variant === "agency" && <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9] inline-block" />}
      {variant === "client" && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" />}
      {children}
    </span>
  );
}
