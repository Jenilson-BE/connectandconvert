import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPageReport } from "@/lib/landing-storage";
import { PageReportView } from "@/components/admin/PageReportView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Campaign Analytics Report — ${slug} | Admin`,
    description: `Detailed conversion and attribution analytics report for landing page: ${slug}`,
  };
}

export default async function AdminReportPage({ params }: PageProps) {
  const { slug } = await params;
  const report = await getPageReport(slug);

  if (!report) {
    return (
      <div className="min-h-screen bg-[#FAF9FC] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-white border border-[#E8E2EF] p-8 text-center space-y-4">
          <span className="text-3xl block">📊</span>
          <h1 className="text-xl font-bold text-[#17121F]">Report Not Found</h1>
          <p className="text-xs text-[#625A6D]">
            We could not find any active landing page matching slug: <strong>{slug}</strong>.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6D28D9] text-white text-xs font-bold hover:bg-[#5B21B6]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Admin Panel</span>
          </Link>
        </div>
      </div>
    );
  }

  return <PageReportView report={report} />;
}
