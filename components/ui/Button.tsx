import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "dark" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, href, variant = "primary", size = "md", children, icon, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] text-white shadow-md shadow-[#6D28D9]/20 hover:shadow-lg hover:shadow-[#6D28D9]/30 border border-transparent",
      secondary:
        "bg-white hover:bg-[#FAF9FC] text-[#17121F] border border-[#E8E2EF] hover:border-[#A855F7] shadow-sm",
      dark:
        "bg-[#17121F] hover:bg-[#241B33] text-white border border-[#2E2440] shadow-md shadow-[#17121F]/20",
      outline:
        "bg-transparent text-[#6D28D9] border border-[#6D28D9]/40 hover:border-[#6D28D9] hover:bg-[#F5EFFF]",
      ghost:
        "bg-transparent text-[#17121F] hover:text-[#6D28D9] hover:bg-[#F5EFFF]/60",
    };

    const sizes = {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-6 py-2.5 gap-2",
      lg: "text-base px-8 py-3.5 gap-2.5 font-semibold",
    };

    const content = (
      <>
        <span>{children}</span>
        {icon && <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn("group", baseStyles, variants[variant], sizes[size], className)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={cn("group", baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
