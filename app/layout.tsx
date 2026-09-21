import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { SITE_CONFIG } from "@/lib/constants";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: "Connect & Convert — Digital Marketing Agency | India",
    template: "%s | Connect & Convert",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Digital Marketing Agency India",
    "Meta Ads Management",
    "Google Ads Agency India",
    "SEO Agency India",
    "Social Media Marketing",
    "Telegram Automation",
    "Brand Identity Design",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.domain,
    title: "Connect & Convert — Digital Marketing Agency",
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect & Convert — Digital Marketing Agency",
    description: SITE_CONFIG.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#FAF9FC] text-[#17121F] font-sans antialiased selection:bg-[#E9D5FF] selection:text-[#17121F]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
