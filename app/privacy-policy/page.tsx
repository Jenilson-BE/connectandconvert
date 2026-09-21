import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Connect & Convert Digital Marketing Agency detailing data protection, inquiries, and Telegram messaging practices.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#FAF9FC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-[#E8E2EF] space-y-8 text-[#17121F]">
          <div className="space-y-2 border-b border-[#F5EFFF] pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
              Legal Documentation
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17121F]">
              Privacy Policy
            </h1>
            <p className="text-xs text-[#625A6D]">Last updated: September 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">1. Introduction</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              Connect &amp; Convert ("we," "our," or "us") is dedicated to protecting the privacy of visitors, prospective clients, and business partners. This Privacy Policy outlines how we collect, use, and safeguard personal information submitted through our website (https://connectandconvert.tech).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">2. Information We Collect</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              We collect information that you voluntarily provide when submitting business inquiries via our contact form or communicating via email and Telegram. This includes:
            </p>
            <ul className="list-disc pl-5 text-sm text-[#625A6D] space-y-1.5">
              <li>Full name and professional contact details</li>
              <li>Business/Company name and website URL</li>
              <li>Email address and phone / Telegram handle</li>
              <li>Project scope, marketing goals, and budget estimations</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">3. How We Use Your Information</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              We use collected information solely to:
            </p>
            <ul className="list-disc pl-5 text-sm text-[#625A6D] space-y-1.5">
              <li>Respond directly to your qualified service inquiries and consultation requests</li>
              <li>Prepare customized digital marketing proposals and scopes of work</li>
              <li>Deliver agreed services, campaign reports, and strategic communications</li>
              <li>Maintain responsible business records adhering to Indian legal frameworks</li>
            </ul>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              We do not sell, rent, or trade your contact information to third-party data brokers or marketing lists.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">4. Telegram &amp; Electronic Communications</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              If you initiate contact via Telegram or opt-in to receive community updates through Telegram, we communicate strictly within the scope of your requested consultation. We do not participate in bulk spam or unsolicited automated broadcasts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">5. Cookies &amp; Analytics</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              Our website may utilize essential cookies and privacy-conscious analytics to understand aggregate traffic trends, monitor site performance, and improve navigation. These analytics do not capture personally identifiable financial information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17121F]">6. Contact Information</h2>
            <p className="text-sm text-[#625A6D] leading-relaxed">
              For any questions regarding this Privacy Policy or your personal information, please contact us at:
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
