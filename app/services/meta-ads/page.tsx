import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { SITE_CONFIG } from "@/lib/constants";

const service = SERVICES.find((s) => s.slug === "meta-ads");

export const metadata: Metadata = {
  title: "Meta Ads Management & Creative Testing",
  description:
    "Strategic Facebook & Instagram advertising engineered around rigorous audience targeting, creative angle testing, and performance optimization.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/services/meta-ads`,
  },
};

export default function MetaAdsPage() {
  if (!service) notFound();
  return <ServiceDetailView service={service} />;
}
