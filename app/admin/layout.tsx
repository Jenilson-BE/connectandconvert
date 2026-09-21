import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Admin Panel | Connect & Convert",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9FC] text-[#17121F]">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8E2EF] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-36">
                <Image
                  src="/logo.png"
                  alt="Connect & Convert"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5EFFF] text-[#6D28D9] border border-[#E9D5FF]">
              Admin Control
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-[#625A6D] hover:text-[#6D28D9] transition-colors"
            >
              <span>Main Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin"
              className="text-[#6D28D9] hover:underline"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="py-8">{children}</div>
    </div>
  );
}
