import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLandingPageBySlug, getAllLandingPages } from "@/lib/landing-storage";
import { LandingTemplateView } from "@/components/landing/LandingTemplateView";
import { SITE_CONFIG } from "@/lib/constants";

export async function generateStaticParams() {
  const pages = await getAllLandingPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `${SITE_CONFIG.domain}/lp/${page.slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `${SITE_CONFIG.domain}/lp/${page.slug}`,
      siteName: page.brandName || SITE_CONFIG.name,
      images: [
        {
          url: page.ogImage || `${SITE_CONFIG.domain}/og-image.png`,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
  };
}

export default async function DynamicLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <LandingTemplateView page={page} />;
}
