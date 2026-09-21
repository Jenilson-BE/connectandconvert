import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { SITE_CONFIG } from "@/lib/constants";

const service = SERVICES.find((s) => s.slug === "content-branding");

export const metadata: Metadata = {
  title: "Content Creation & Brand Identity Design",
  description:
    "Distinctive brand identity, creative direction, high-converting ad creative concepts, and compelling marketing copywriting that commands premium value.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/services/content-branding`,
  },
};

export default function ContentBrandingPage() {
  if (!service) notFound();
  return <ServiceDetailView service={service} />;
}
