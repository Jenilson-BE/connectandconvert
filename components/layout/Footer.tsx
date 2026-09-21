import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, Send, MapPin } from "lucide-react";
import { SITE_CONFIG, FOOTER_SECTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#17121F] text-white border-t border-[#2E2440] pt-16 pb-12 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6D28D9]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#A855F7]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top conversion strip */}
        <div className="pb-12 border-b border-[#2E2440] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider text-[#A855F7] mb-2 block">
              Start The Conversation
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to turn attention into measurable growth?
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="/contact" variant="primary" size="md">
              Let's Work Together
            </Button>
            <a
              href={SITE_CONFIG.contact.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#241B33] hover:bg-[#2E2440] text-[#E9D5FF] border border-[#3D3055] transition-colors"
            >
              <Send className="w-4 h-4 text-[#2AABEE]" />
              <span>Chat on Telegram</span>
            </a>
          </div>
        </div>

        {/* Main 4-column footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-11 w-48 bg-white/5 p-1 rounded-lg">
                <Image
                  src="/logo.png"
                  alt="Connect & Convert"
                  fill
                  className="object-contain object-left invert brightness-200"
                  sizes="192px"
                />
              </div>
            </Link>
            <p className="text-sm text-[#9E94A8] leading-relaxed max-w-sm">
              Connect &amp; Convert is a digital marketing agency operating across India. We combine strategic performance marketing, creative execution, and conversion workflows to help businesses grow.
            </p>
            <div className="pt-2 space-y-2 text-xs text-[#C4B5FD]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A855F7] shrink-0" />
                <span>Pan-India Digital Services • Based in India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#A855F7] shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A855F7] mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_SECTIONS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#9E94A8] hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[#A855F7]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A855F7] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_SECTIONS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#9E94A8] hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[#A855F7]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Socials */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A855F7] mb-4">
              Legal &amp; Connect
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_SECTIONS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#9E94A8] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7] block mb-2">
                Social
              </span>
              <div className="flex items-center gap-3">
                {SITE_CONFIG.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#241B33] hover:bg-[#6D28D9] border border-[#3D3055] hover:border-transparent flex items-center justify-center text-xs text-[#E9D5FF] hover:text-white transition-all"
                    aria-label={`Connect & Convert on ${s.name}`}
                  >
                    {s.name[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 border-t border-[#2E2440] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#625A6D]">
          <p>© {currentYear} {SITE_CONFIG.legalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
