import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms & Conditions governing the use of the Connect & Convert digital marketing agency website and consultation inquiries.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/terms-and-conditions`,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#FAF9FC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-[#E8E2EF] space-y-8 text-[#17121F]">
          <div className="space-y-2 border-b border-[#F5EFFF] pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              Legal Documentation
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17121F]">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-[#625A6D]">Last updated: September 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">1. Agreement to Terms</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              By accessing and using this website (https://connectandconvert.tech), you agree to comply with and be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">2. Nature of Agency Services &amp; Disclaimers</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              Connect &amp; Convert provides digital marketing strategy, media management, creative design, and technical automation consulting. While we apply disciplined industry best practices, performance outcomes depend significantly on third-party platform algorithms (such as Meta and Google), market competition, client offering viability, and changing auction environments. Therefore, we do not promise or guarantee specific ranking positions, conversion volumes, or sales revenues.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">3. Portfolio &amp; Case Demonstrations</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              Items featured on this website may include agency internal research, hypothetical frameworks, and concept explorations (clearly labeled as "Concept Work" or "Agency Work") alongside active client engagements. These materials are presented to demonstrate technical methodology and creative direction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">4. Intellectual Property</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              All visual assets, proprietary frameworks, editorial content, and brand marks displayed on this website are the property of Connect &amp; Convert unless otherwise noted. Unauthorized reproduction or redistribution without prior written permission is prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">5. Governing Law</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              These terms are governed by and construed in accordance with the laws of India. Any disputes arising in connection with the use of this website shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">6. Inquiries</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              For any questions regarding our terms, please contact us at:
            </p>
            <p className="text-sm font-semibold text-[#6D28D9]">
              Email: {SITE_CONFIG.contact.email}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
