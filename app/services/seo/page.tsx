import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { SITE_CONFIG } from "@/lib/constants";

const service = SERVICES.find((s) => s.slug === "seo");

export const metadata: Metadata = {
  title: "SEO, AEO & GEO Search Engine Optimization",
  description:
    "Build organic visibility and authoritative content that helps audiences discover your business across traditional search and emerging AI answer engines.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/services/seo`,
  },
};

export default function SeoPage() {
  if (!service) notFound();
  return <ServiceDetailView service={service} />;
}
