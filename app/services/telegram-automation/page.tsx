import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { SITE_CONFIG } from "@/lib/constants";

const service = SERVICES.find((s) => s.slug === "telegram-automation");

export const metadata: Metadata = {
  title: "Telegram Marketing & Subscriber Automation Workflows",
  description:
    "High-converting Telegram subscriber funnels, Click-to-Telegram performance campaigns, and automated welcome bots.",
  alternates: {
    canonical: `${SITE_CONFIG.domain}/services/telegram-automation`,
  },
};

export default function TelegramAutomationPage() {
  if (!service) notFound();
  return <ServiceDetailView service={service} />;
}
