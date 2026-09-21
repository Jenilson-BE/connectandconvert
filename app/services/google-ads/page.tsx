import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { SITE_CONFIG } from "@/lib/constants";

const service = SERVICES.find((s) => s.slug === "google-ads");

export const metadata: Metadata = {
  title: "Google Ads & High-Intent Search Marketing",
  description:
    "Connect with prospects actively searching for your solutions through keyword modeling, negative keyword filtering, and conversion tracking.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/services/google-ads`,
  },
};

export default function GoogleAdsPage() {
  if (!service) notFound();
  return <ServiceDetailView service={service} />;
}
