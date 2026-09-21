"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Printer,
  Download,
  ExternalLink,
  Edit3,
  TrendingUp,
  Clock,
  Send,
  Eye,
  Smartphone,
  Globe,
  Share2,
  Calendar,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { PageAnalyticsReport } from "@/lib/landing-types";
import { Button } from "@/components/ui/Button";

interface PageReportViewProps {
  report: PageAnalyticsReport;
}

export function PageReportView({ report: initialReport }: PageReportViewProps) {
  const [report, setReport] = React.useState<PageAnalyticsReport>(initialReport);
  const [refreshing, setRefreshing] = React.useState(false);

  const { page, metrics, deviceBreakdown, browserBreakdown, osBreakdown, attributionBreakdown, recentLogs } = report;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/admin/report/${page.slug}`);
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error("Failed to refresh report:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportCsv = () => {
    if (!recentLogs || recentLogs.length === 0) {
      alert("No activity logs available to export yet.");
      return;
    }

    const headers = ["Timestamp", "Type", "Slug", "Device", "Browser", "OS", "Country", "City", "Referrer", "UTM_Source", "UTM_Medium", "UTM_Campaign"];
    const rows = recentLogs.map((l) => [
      l.ts,
      l.type,
      l.slug,
      `"${l.device || ""}"`,
      `"${l.browser || ""}"`,
      `"${l.os || ""}"`,
      `"${l.country || ""}"`,
      `"${l.city || ""}"`,
      `"${l.referrer || ""}"`,
      `"${l.attribution?.utm_source || ""}"`,
      `"${l.attribution?.utm_medium || ""}"`,
      `"${l.attribution?.utm_campaign || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cc-report-${page.slug}-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedDate = new Date(report.generatedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-[#FAF9FC] text-[#17121F] pb-24 print:bg-white print:p-0 print:pb-0">
      {/* ==================================================================== */}
      {/* 1. SCREEN-ONLY TOP ACTION BAR                                       */}
      {/* ==================================================================== */}
      <div className="print:hidden border-b border-[#E8E2EF] bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2EF] text-xs font-semibold text-[#625A6D] hover:text-[#17121F] hover:bg-[#FAF9FC] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin</span>
            </Link>
            <div className="h-4 w-[1px] bg-[#E8E2EF]" />
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#F5EFFF] text-[#6D28D9] font-bold">
              /lp/{page.slug}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2EF] text-xs font-semibold text-[#625A6D] hover:text-[#17121F] hover:bg-[#FAF9FC] transition-colors disabled:opacity-50"
              title="Refresh live metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#6D28D9]" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2EF] text-xs font-semibold text-[#625A6D] hover:text-[#17121F] hover:bg-[#FAF9FC] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#059669]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <Link
              href={`/lp/${page.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2EF] text-xs font-semibold text-[#625A6D] hover:text-[#6D28D9] hover:bg-[#FAF9FC] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live</span>
            </Link>

            <Link
              href={`/admin/edit/${page.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2EF] text-xs font-semibold text-[#625A6D] hover:text-[#6D28D9] hover:bg-[#FAF9FC] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </Link>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6D28D9] text-white text-xs font-bold hover:bg-[#5B21B6] shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. PRINT / PDF LETTERHEAD HEADER (Visible on Print & Screen)          */}
      {/* ==================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 print:pt-0 print:px-0">
        {/* Printable Company Letterhead */}
        <div className="rounded-3xl border border-[#E8E2EF] bg-white p-6 sm:p-8 shadow-xs print:rounded-none print:border-b-2 print:border-t-0 print:border-x-0 print:border-[#6D28D9] print:shadow-none print:p-0 print:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="relative h-12 w-52">
                <Image
                  src="/logo.png"
                  alt="Connect & Convert"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <p className="text-xs font-semibold text-[#6D28D9] tracking-wider uppercase">
                Connect &amp; Convert &bull; Digital Marketing Agency
              </p>
              <p className="text-[11px] text-[#625A6D]">
                https://connectandconvert.tech &bull; hello@connectandconvert.tech &bull; Pan-India Remote Delivery
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F5EFFF] text-[#6D28D9] text-[10px] font-extrabold uppercase tracking-widest border border-[#E9D5FF]">
                CAMPAIGN INTELLIGENCE REPORT
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#17121F]">
                {page.brandName}
              </h1>
              <p className="text-xs text-[#625A6D] flex items-center sm:justify-end gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#6D28D9]" />
                <span>Generated: <strong>{formattedDate}</strong></span>
              </p>
            </div>
          </div>

          {/* Campaign Reference Strip */}
          <div className="mt-6 pt-4 border-t border-[#F5EFFF] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9FC] border border-[#E8E2EF]">
              <span className="text-[10px] font-bold text-[#625A6D] uppercase block">Landing URL</span>
              <span className="font-mono text-[#17121F] font-semibold truncate block">
                https://connectandconvert.tech/lp/{page.slug}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9FC] border border-[#E8E2EF]">
              <span className="text-[10px] font-bold text-[#625A6D] uppercase block">Target Telegram URL</span>
              <a
                href={page.destinationUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[#6D28D9] hover:underline font-semibold truncate block"
              >
                {page.destinationUrl}
              </a>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9FC] border border-[#E8E2EF] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#625A6D] uppercase block">Status</span>
                <span className="font-bold text-emerald-600 uppercase text-xs">
                  {page.status || "Published"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#625A6D] uppercase block">Auto-Redirect</span>
                <span className="font-bold text-[#17121F] text-xs">
                  {page.autoRedirect ? `${page.redirectAfterSeconds}s timer` : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 3. 4 CORE METRICS CARDS (Total Landing, Subscribe, Autoredirect, CTR) */}
        {/* ==================================================================== */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:mt-6 print:grid-cols-4 print:gap-3 print-avoid-break">
          {/* Card 1: Total Landing */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E2EF] shadow-xs print:rounded-xl print:p-4 print:border-[#E8E2EF]">
            <div className="flex items-center justify-between text-[#625A6D] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#625A6D]">
                Total Landing
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#F5EFFF] text-[#6D28D9] flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-[#17121F] tracking-tight block">
              {metrics.totalLanding.toLocaleString()}
            </span>
            <span className="text-xs text-[#625A6D] block mt-1">
              Total unique page visit sessions
            </span>
          </div>

          {/* Card 2: Total Subscribe */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E2EF] shadow-xs print:rounded-xl print:p-4 print:border-[#E8E2EF]">
            <div className="flex items-center justify-between text-[#625A6D] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#625A6D]">
                Total Subscribe
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Send className="w-4 h-4 text-[#2AABEE]" />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-[#17121F] tracking-tight block">
              {metrics.totalSubscribe.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                {metrics.subscribeCtr}
              </span>
              <span className="text-xs text-[#625A6D]">Manual button clicks</span>
            </div>
          </div>

          {/* Card 3: Total Autoredirect */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E2EF] shadow-xs print:rounded-xl print:p-4 print:border-[#E8E2EF]">
            <div className="flex items-center justify-between text-[#625A6D] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#625A6D]">
                Autoredirect
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-[#17121F] tracking-tight block">
              {metrics.totalAutoredirect.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                {metrics.autoredirectRate}
              </span>
              <span className="text-xs text-[#625A6D]">Countdown completions</span>
            </div>
          </div>

          {/* Card 4: Overall Conversion Rate */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E2EF] shadow-xs print:rounded-xl print:p-4 print:border-[#E8E2EF]">
            <div className="flex items-center justify-between text-[#625A6D] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#625A6D]">
                Overall Conversion
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-[#059669] tracking-tight block">
              {metrics.overallConversionRate}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-emerald-700">
                {metrics.totalConversions.toLocaleString()} leads
              </span>
              <span className="text-xs text-[#625A6D]">Total audience redirected</span>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 4. VISUAL CONVERSION FUNNEL BAR                                     */}
        {/* ==================================================================== */}
        <div className="mt-8 rounded-3xl bg-white border border-[#E8E2EF] p-6 sm:p-8 shadow-xs print:mt-6 print:rounded-xl print:p-5 print-avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#17121F] mb-4">
            Audience Conversion Funnel
          </h2>

          <div className="space-y-4">
            {/* Stage 1: Landings */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>1. Total Landings (Ad / Direct Traffic)</span>
                <span>{metrics.totalLanding} visitors (100%)</span>
              </div>
              <div className="h-3 w-full bg-[#FAF9FC] rounded-full overflow-hidden border border-[#E8E2EF]">
                <div className="h-full bg-[#17121F] rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            {/* Stage 2: Subscribes */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-blue-600">2. Active Subscribes (Direct Button Click)</span>
                <span className="text-blue-600">{metrics.totalSubscribe} clicks ({metrics.subscribeCtr})</span>
              </div>
              <div className="h-3 w-full bg-[#FAF9FC] rounded-full overflow-hidden border border-[#E8E2EF]">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  style={{ width: metrics.subscribeCtr }}
                />
              </div>
            </div>

            {/* Stage 3: Autoredirects */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-amber-600">3. Auto-Redirects (Radial Timer Completed)</span>
                <span className="text-amber-600">{metrics.totalAutoredirect} completed ({metrics.autoredirectRate})</span>
              </div>
              <div className="h-3 w-full bg-[#FAF9FC] rounded-full overflow-hidden border border-[#E8E2EF]">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                  style={{ width: metrics.autoredirectRate }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 5. ATTRIBUTION & DEVICE BREAKDOWN GRID                              */}
        {/* ==================================================================== */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 print:mt-6 print:grid-cols-12 print:gap-4 print-avoid-break">
          {/* Attribution Breakdown (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-[#E8E2EF] p-6 sm:p-8 shadow-xs print:col-span-7 print:rounded-xl print:p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#17121F] mb-4 flex items-center justify-between">
              <span>Traffic Attribution Breakdown</span>
              <Share2 className="w-4 h-4 text-[#6D28D9]" />
            </h2>

            {attributionBreakdown.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#F5EFFF] text-[#625A6D]">
                      <th className="pb-2 font-bold uppercase tracking-wider">Source</th>
                      <th className="pb-2 font-bold uppercase tracking-wider">Medium</th>
                      <th className="pb-2 font-bold uppercase tracking-wider">Campaign</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-right">Volume</th>
                      <th className="pb-2 font-bold uppercase tracking-wider text-right">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EFFF]">
                    {attributionBreakdown.map((item, i) => (
                      <tr key={i} className="hover:bg-[#FAF9FC]">
                        <td className="py-2.5 font-bold text-[#17121F]">{item.source}</td>
                        <td className="py-2.5 text-[#625A6D]">{item.medium}</td>
                        <td className="py-2.5 text-[#625A6D] max-w-[120px] truncate">{item.campaign}</td>
                        <td className="py-2.5 text-right font-semibold">{item.count}</td>
                        <td className="py-2.5 text-right font-bold text-[#6D28D9]">{item.percentage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-[#625A6D] py-6 text-center">
                Direct / Organic traffic (No UTM tags passed).
              </p>
            )}
          </div>

          {/* Device & OS Breakdown (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-[#E8E2EF] p-6 sm:p-8 shadow-xs print:col-span-5 print:rounded-xl print:p-5 space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#17121F] mb-3 flex items-center justify-between">
                <span>Device Distribution</span>
                <Smartphone className="w-4 h-4 text-[#6D28D9]" />
              </h2>
              <div className="space-y-2">
                {deviceBreakdown.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FAF9FC] border border-[#E8E2EF]">
                    <span className="font-semibold text-[#17121F]">{d.name}</span>
                    <span className="font-bold text-[#6D28D9]">{d.count} ({d.percentage})</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#17121F] mb-3 flex items-center justify-between">
                <span>Operating Systems</span>
                <Globe className="w-4 h-4 text-[#6D28D9]" />
              </h2>
              <div className="space-y-2">
                {osBreakdown.slice(0, 4).map((o, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FAF9FC] border border-[#E8E2EF]">
                    <span className="font-semibold text-[#17121F]">{o.name}</span>
                    <span className="font-bold text-[#625A6D]">{o.count} ({o.percentage})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 6. RECENT CHRONOLOGICAL ACTIVITY LOGS (SCREEN ONLY)                  */}
        {/* ==================================================================== */}
        <div className="mt-8 rounded-3xl bg-white border border-[#E8E2EF] p-6 sm:p-8 shadow-xs print:hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#17121F]">
                Real-Time Activity Stream (Latest 100 Events)
              </h2>
              <p className="text-xs text-[#625A6D]">
                Chronological log of landings, button subscribes, and auto-redirects for this page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportCsv}
              className="text-xs font-semibold text-[#6D28D9] hover:underline"
            >
              Export Log Data (.csv)
            </button>
          </div>

          {recentLogs.length > 0 ? (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-white border-b border-[#E8E2EF]">
                  <tr className="text-[#625A6D]">
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Timestamp</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Event Type</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Device &amp; OS</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Browser</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Location</th>
                    <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Referrer / UTM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFFF]">
                  {recentLogs.map((log) => {
                    const typeStyles = {
                      websitevisit: "bg-slate-100 text-slate-700",
                      subscribe: "bg-blue-100 text-blue-700 font-bold",
                      autoredirect: "bg-amber-100 text-amber-700 font-bold",
                    }[log.type] || "bg-slate-100 text-slate-700";

                    return (
                      <tr key={log.id} className="hover:bg-[#FAF9FC]">
                        <td className="py-2.5 px-3 text-[#625A6D] whitespace-nowrap">
                          {new Date(log.ts).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "medium",
                          })}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${typeStyles}`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[#17121F]">
                          {log.device} &bull; {log.os}
                        </td>
                        <td className="py-2.5 px-3 text-[#625A6D]">{log.browser}</td>
                        <td className="py-2.5 px-3 text-[#625A6D]">
                          {log.city ? `${log.city}, ` : ""}{log.country || "IN"}
                        </td>
                        <td className="py-2.5 px-3 text-[#625A6D] max-w-[180px] truncate">
                          {log.attribution?.utm_source ? (
                            <span className="text-[#6D28D9] font-medium">
                              utm: {log.attribution.utm_source}
                            </span>
                          ) : (
                            log.referrer || "Direct"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#625A6D]">
              No recorded visits yet. Open{" "}
              <Link href={`/lp/${page.slug}`} target="_blank" className="text-[#6D28D9] underline">
                /lp/{page.slug}
              </Link>{" "}
              to generate initial test traffic.
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* 7. PRINT / PDF LETTERHEAD FOOTER (Visible on Print & Screen)          */}
        {/* ==================================================================== */}
        <div className="mt-12 pt-6 border-t-2 border-[#6D28D9] text-center space-y-2 print:mt-12 print:pt-6 print:block print-avoid-break">
          <p className="text-xs font-bold text-[#17121F] tracking-wide uppercase">
            CONFIDENTIAL &bull; CONNECT &amp; CONVERT DIGITAL MARKETING AGENCY
          </p>
          <p className="text-[11px] text-[#625A6D]">
            Official Agency Website: <a href="https://connectandconvert.tech" className="text-[#6D28D9]">https://connectandconvert.tech</a> &bull; Telegram: <a href="https://t.me/connectandconvert" className="text-[#6D28D9]">@connectandconvert</a>
          </p>
          <p className="text-[10px] text-[#9E94A8]">
            This performance intelligence report contains proprietary attribution and conversion metrics generated on {formattedDate}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
