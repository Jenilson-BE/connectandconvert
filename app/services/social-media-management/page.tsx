import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { SITE_CONFIG } from "@/lib/constants";

const service = SERVICES.find((s) => s.slug === "social-media-management");

export const metadata: Metadata = {
  title: "Social Media Management & Editorial Content",
  description:
    "Build a consistent, credible digital presence through strategic content planning, creative publishing, and community communication across LinkedIn & Instagram.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/services/social-media-management`,
  },
};

export default function SocialMediaPage() {
  if (!service) notFound();
  return <ServiceDetailView service={service} />;
}
