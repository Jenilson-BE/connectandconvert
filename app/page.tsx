import { Metadata } from "next";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { BrandIntroSection } from "@/components/sections/home/BrandIntroSection";
import { ServicesSection } from "@/components/sections/home/ServicesSection";
import { ApproachSection } from "@/components/sections/home/ApproachSection";
import { ShowcaseSection } from "@/components/sections/home/ShowcaseSection";
import { WhyChooseSection } from "@/components/sections/home/WhyChooseSection";
import { IndustrySection } from "@/components/sections/home/IndustrySection";
import { ProofSection } from "@/components/sections/home/ProofSection";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { CtaBannerSection } from "@/components/sections/home/CtaBannerSection";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Connect & Convert — Digital Marketing Agency | India",
  description:
    "Connect & Convert is a premium digital marketing agency in India specializing in Meta Ads, Google Ads, SEO, Social Media, Branding, and Telegram Automation.",
  alternates: {
    canonical: SITE_CONFIG.domain,
  },
  openGraph: {
    title: "Connect & Convert — Digital Marketing Agency | India",
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.domain}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Connect & Convert — Digital Marketing Agency",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function HomePage() {
  const orgSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <main className="min-h-screen">
        <HeroSection />
        <BrandIntroSection />
        <ServicesSection />
        <ApproachSection />
        <ShowcaseSection />
        <WhyChooseSection />
        <IndustrySection />
        <ProofSection />
        <FaqSection />
        <CtaBannerSection />
      </main>
    </>
  );
}
