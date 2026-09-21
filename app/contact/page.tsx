import { Metadata } from "next";
import { Mail, Phone, Send, MapPin, CheckCircle2 } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us & Let's Work Together",
  description:
    "Submit your marketing inquiry to Connect & Convert. Connect with our team to discuss Meta Ads, Google Ads, SEO, Branding, or Telegram Automation.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/contact`,
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#FAF9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5EFFF] text-[#6D28D9] border border-[#E9D5FF] text-xs font-semibold uppercase tracking-wider">
            LET'S CONNECT
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#17121F] tracking-tight leading-tight">
            Have a project in mind? Let's talk.
          </h1>
          <p className="text-base sm:text-lg text-[#625A6D] leading-relaxed">
            Tell us a little about your business and what you'd like to achieve. We'll use your inquiry to understand how we can help.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct channels & trust info (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-[#E8E2EF] space-y-6">
              <h2 className="text-xl font-bold text-[#17121F]">
                Direct Channels
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EFFF] text-[#6D28D9] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#625A6D] block">Inquiries &amp; RFP</span>
                    <a
                      href={`mailto:${SITE_CONFIG.contact.email}`}
                      className="font-semibold text-[#17121F] hover:text-[#6D28D9] transition-colors"
                    >
                      {SITE_CONFIG.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5 text-[#2AABEE]" />
                  </div>
                  <div>
                    <span className="text-xs text-[#625A6D] block">Telegram Channel &amp; Chat</span>
                    <a
                      href="https://t.me/connectandconvert"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#17121F] hover:text-[#0284C7] transition-colors"
                    >
                      @connectandconvert
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF9FC] text-[#625A6D] border border-[#E8E2EF] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#625A6D] block">Service Coverage</span>
                    <span className="font-semibold text-[#17121F]">
                      Pan-India Remote Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* What Happens Next Card */}
            <div className="bg-[#17121F] text-white rounded-3xl p-8 border border-[#2E2440] space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A855F7] block">
                What happens next?
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-[#C4B5FD]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                  <span>We review your website and current marketing presence.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                  <span>We schedule a 20-minute alignment call with our strategy team.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                  <span>You receive a tailored roadmap with transparent deliverables.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
