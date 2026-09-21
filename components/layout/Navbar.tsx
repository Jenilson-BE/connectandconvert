"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = React.useState(false);
  const pathname = usePathname();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenus = React.useCallback(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, []);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#FAF9FC]/90 backdrop-blur-md border-b border-[#E8E2EF]/80 shadow-xs py-3.5"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] rounded-lg"
          >
            <div className="relative h-10 w-44 sm:h-11 sm:w-48 transition-transform duration-200 group-hover:scale-[1.02]">
              <Image
                src="/logo.png"
                alt="Connect & Convert — Digital Marketing Agency"
                fill
                priority
                className="object-contain object-left"
                sizes="(max-width: 640px) 176px, 192px"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {/* Services Mega Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-full transition-colors",
                  pathname.startsWith("/services")
                    ? "text-[#6D28D9] font-semibold bg-[#F5EFFF]"
                    : "text-[#17121F] hover:text-[#6D28D9] hover:bg-[#F5EFFF]/60"
                )}
                aria-expanded={servicesDropdownOpen}
              >
                <span>Services</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    servicesDropdownOpen ? "rotate-180 text-[#6D28D9]" : "text-[#625A6D]"
                  )}
                />
              </button>

              {servicesDropdownOpen && (
                <div
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-2xl shadow-xl border border-[#E8E2EF] p-4 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="col-span-2 pb-2 mb-1 border-b border-[#F5EFFF] flex items-center justify-between px-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
                      Our Digital Services
                    </span>
                    <Link
                      href="/services"
                      className="text-xs font-medium text-[#625A6D] hover:text-[#6D28D9] flex items-center gap-1"
                    >
                      View All <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {SERVICES.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="p-3 rounded-xl hover:bg-[#FAF9FC] transition-colors group/item block"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#A855F7] group-hover/item:text-[#6D28D9]">
                          {s.number}
                        </span>
                        <span className="text-sm font-semibold text-[#17121F] group-hover/item:text-[#6D28D9] transition-colors">
                          {s.shortTitle}
                        </span>
                      </div>
                      <p className="text-xs text-[#625A6D] line-clamp-1 mt-1 pl-6">
                        {s.tagline}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/work"
              className={cn(
                "px-3.5 py-2 text-sm font-medium rounded-full transition-colors",
                pathname === "/work"
                  ? "text-[#6D28D9] font-semibold bg-[#F5EFFF]"
                  : "text-[#17121F] hover:text-[#6D28D9] hover:bg-[#F5EFFF]/60"
              )}
            >
              Work
            </Link>

            <Link
              href="/case-studies"
              className={cn(
                "px-3.5 py-2 text-sm font-medium rounded-full transition-colors",
                pathname === "/case-studies"
                  ? "text-[#6D28D9] font-semibold bg-[#F5EFFF]"
                  : "text-[#17121F] hover:text-[#6D28D9] hover:bg-[#F5EFFF]/60"
              )}
            >
              Case Studies
            </Link>

            <Link
              href="/about"
              className={cn(
                "px-3.5 py-2 text-sm font-medium rounded-full transition-colors",
                pathname === "/about"
                  ? "text-[#6D28D9] font-semibold bg-[#F5EFFF]"
                  : "text-[#17121F] hover:text-[#6D28D9] hover:bg-[#F5EFFF]/60"
              )}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={cn(
                "px-3.5 py-2 text-sm font-medium rounded-full transition-colors",
                pathname === "/contact"
                  ? "text-[#6D28D9] font-semibold bg-[#F5EFFF]"
                  : "text-[#17121F] hover:text-[#6D28D9] hover:bg-[#F5EFFF]/60"
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Primary CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Button href="/contact" variant="primary" size="md">
              Let's Work Together
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              href="/contact"
              variant="primary"
              size="sm"
              className="text-xs px-3 py-1.5 font-medium"
            >
              Work Together
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#17121F] hover:bg-[#F5EFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9]"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] bg-white z-40 overflow-y-auto border-t border-[#E8E2EF] animate-in fade-in slide-in-from-top-4 duration-200 p-6 flex flex-col justify-between">
          <nav className="space-y-4" aria-label="Mobile Navigation">
            <div className="pb-3 border-b border-[#E8E2EF]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9] block mb-3">
                Services
              </span>
              <div className="grid grid-cols-1 gap-2 pl-2">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="text-sm font-medium text-[#17121F] hover:text-[#6D28D9] py-1.5 flex items-center justify-between"
                  >
                    <span>{s.title}</span>
                    <span className="text-xs font-mono text-[#A855F7]">{s.number}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/work"
              className="block text-lg font-semibold text-[#17121F] hover:text-[#6D28D9] py-2 border-b border-[#E8E2EF]"
            >
              Work &amp; Portfolio
            </Link>

            <Link
              href="/case-studies"
              className="block text-lg font-semibold text-[#17121F] hover:text-[#6D28D9] py-2 border-b border-[#E8E2EF]"
            >
              Case Studies
            </Link>

            <Link
              href="/about"
              className="block text-lg font-semibold text-[#17121F] hover:text-[#6D28D9] py-2 border-b border-[#E8E2EF]"
            >
              About Connect &amp; Convert
            </Link>

            <Link
              href="/contact"
              className="block text-lg font-semibold text-[#17121F] hover:text-[#6D28D9] py-2 border-b border-[#E8E2EF]"
            >
              Contact Us
            </Link>
          </nav>

          <div className="pt-8 pb-12 border-t border-[#E8E2EF] space-y-3">
            <Button href="/contact" variant="primary" size="lg" className="w-full">
              Let's Work Together
            </Button>
            <p className="text-center text-xs text-[#625A6D]">
              India • Pan-India Performance Marketing
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
