"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Copy,
  ExternalLink,
  Edit,
  Trash2,
  Lock,
  LogOut,
  Layers,
  MousePointerClick,
  Users,
  Clock,
  Search,
  Check,
  RefreshCw,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { LandingPageConfig, VisitLogEntry } from "@/lib/landing-types";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [passcode, setPasscode] = React.useState("");
  const [authError, setAuthError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [pages, setPages] = React.useState<LandingPageConfig[]>([]);
  const [recentLogs, setRecentLogs] = React.useState<VisitLogEntry[]>([]);
  const [stats, setStats] = React.useState({
    totalPages: 0,
    publishedPages: 0,
    totalVisits: 0,
    totalClicks: 0,
    avgCtr: "0.0%",
  });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [copiedSlug, setCopiedSlug] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"pages" | "logs">("pages");

  // Check auth on load
  const checkAuthStatus = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchDashboardData();
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  React.useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [pagesRes, statsRes] = await Promise.all([
        fetch("/api/admin/landing-pages"),
        fetch("/api/admin/stats"),
      ]);

      const pagesData = await pagesRes.json();
      const statsData = await statsRes.json();

      if (pagesData.success) {
        setPages(pagesData.pages);
      }
      if (statsData.success) {
        setStats(statsData.stats);
        setRecentLogs(statsData.recentLogs || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.message || "Invalid passcode.");
      } else {
        setIsAuthenticated(true);
        fetchDashboardData();
      }
    } catch {
      setAuthError("Server error. Please try again.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setPasscode("");
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!window.confirm(`Are you sure you want to delete landing page /lp/${slug}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/landing-pages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== id));
        fetchDashboardData();
      }
    } catch (err) {
      alert("Failed to delete page.");
    }
  };

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/lp/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 1. Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6D28D9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 pt-16">
        <div className="bg-white rounded-3xl p-8 border border-[#E8E2EF] shadow-xl shadow-[#6D28D9]/5 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F5EFFF] text-[#6D28D9] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#17121F]">
              Admin Authentication
            </h1>
            <p className="text-xs text-[#625A6D] mt-1">
              Enter your passcode to manage landing pages and view campaign logs.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter passcode (default: admin123)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-center font-mono tracking-widest text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              required
              autoFocus
            />

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Access Admin Panel
            </Button>
          </form>

          <p className="text-[11px] text-[#9E94A8]">
            Passcode configured via <code className="bg-[#FAF9FC] px-1 py-0.5 rounded">ADMIN_PASSCODE</code> in environment.
          </p>
        </div>
      </div>
    );
  }

  // 3. Authenticated Dashboard Screen
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#17121F] tracking-tight">
            Landing Page Manager
          </h1>
          <p className="text-sm text-[#625A6D]">
            Create and customize an unlimited number of high-converting landing pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl border border-[#E8E2EF] bg-white text-[#625A6D] hover:text-[#6D28D9] hover:bg-[#FAF9FC] transition-colors"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Button href="/admin/new" variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Create New Page
          </Button>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2.5 rounded-xl border border-[#E8E2EF] bg-white text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E8E2EF] shadow-xs">
          <div className="flex items-center justify-between text-[#625A6D] mb-2">
            <span className="text-xs font-semibold">Total Pages</span>
            <Layers className="w-4 h-4 text-[#6D28D9]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#17121F]">
            {stats.totalPages}
          </span>
          <span className="text-[11px] text-[#059669] block mt-1">
            {stats.publishedPages} Published
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8E2EF] shadow-xs">
          <div className="flex items-center justify-between text-[#625A6D] mb-2">
            <span className="text-xs font-semibold">Total Page Views</span>
            <Users className="w-4 h-4 text-[#A855F7]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#17121F]">
            {stats.totalVisits}
          </span>
          <span className="text-[11px] text-[#625A6D] block mt-1">
            Tracked across all pages
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8E2EF] shadow-xs">
          <div className="flex items-center justify-between text-[#625A6D] mb-2">
            <span className="text-xs font-semibold">CTA Conversions</span>
            <MousePointerClick className="w-4 h-4 text-[#6D28D9]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#17121F]">
            {stats.totalClicks}
          </span>
          <span className="text-[11px] text-[#625A6D] block mt-1">
            Telegram redirect clicks
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8E2EF] shadow-xs">
          <div className="flex items-center justify-between text-[#625A6D] mb-2">
            <span className="text-xs font-semibold">Conversion Rate (CTR)</span>
            <TrendingUp className="w-4 h-4 text-[#059669]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#17121F]">
            {stats.avgCtr}
          </span>
          <span className="text-[11px] text-[#059669] block mt-1">
            Average click efficiency
          </span>
        </div>
      </div>

      {/* Tabs for Pages vs Logs */}
      <div className="flex items-center justify-between border-b border-[#E8E2EF] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("pages")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeTab === "pages"
                ? "bg-[#6D28D9] text-white"
                : "text-[#625A6D] hover:text-[#17121F] bg-white border border-[#E8E2EF]"
            }`}
          >
            Landing Pages ({pages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeTab === "logs"
                ? "bg-[#6D28D9] text-white"
                : "text-[#625A6D] hover:text-[#17121F] bg-white border border-[#E8E2EF]"
            }`}
          >
            Recent Activity Logs ({recentLogs.length})
          </button>
        </div>

        {activeTab === "pages" && (
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 text-[#9E94A8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E2EF] text-xs text-[#17121F] bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
            />
          </div>
        )}
      </div>

      {/* View 1: Pages Table */}
      {activeTab === "pages" && (
        <div className="bg-white rounded-3xl border border-[#E8E2EF] overflow-hidden shadow-xs">
          {filteredPages.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5EFFF] text-[#6D28D9] flex items-center justify-center mx-auto text-xl">
                📄
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17121F]">
                  {pages.length === 0 ? "No Landing Pages Yet" : "No Matching Landing Pages"}
                </h3>
                <p className="text-xs text-[#625A6D] mt-1 max-w-sm mx-auto">
                  {pages.length === 0
                    ? "Start fresh by clicking 'Create First Page' to configure your first high-converting landing campaign."
                    : "No pages matched your search filter. Try clearing your search keyword."}
                </p>
              </div>
              {pages.length === 0 && (
                <Button href="/admin/new" variant="primary" size="sm">
                  Create First Page
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF9FC] border-b border-[#E8E2EF] text-[#625A6D] uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Page / Title</th>
                    <th className="py-3.5 px-6">Slug &amp; URL</th>
                    <th className="py-3.5 px-6">Destination Link</th>
                    <th className="py-3.5 px-6">Redirect Timer</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-center">Visits</th>
                    <th className="py-3.5 px-6 text-center">Clicks</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2EF]">
                  {filteredPages.map((p) => {
                    const isCopied = copiedSlug === p.slug;
                    return (
                      <tr key={p.id} className="hover:bg-[#FAF9FC] transition-colors">
                        <td className="py-4 px-6 font-semibold text-[#17121F]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#6D28D9]" />
                            <span className="truncate max-w-[180px]">{p.title}</span>
                          </div>
                          <span className="text-[11px] text-[#625A6D] block pl-4">
                            {p.brandName}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 font-mono text-xs text-[#6D28D9]">
                            <span>/lp/{p.slug}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(p.slug)}
                              className="p-1 hover:bg-[#F5EFFF] rounded text-[#625A6D] hover:text-[#6D28D9] transition-colors"
                              title="Copy URL"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="truncate max-w-[160px] block text-xs text-[#625A6D]" title={p.destinationUrl}>
                            {p.destinationUrl}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          {p.autoRedirect ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6D28D9] bg-[#F5EFFF] px-2.5 py-1 rounded-full border border-[#E9D5FF]">
                              <Clock className="w-3 h-3" />
                              <span>{p.redirectAfterSeconds}s Auto</span>
                            </span>
                          ) : (
                            <span className="text-xs text-[#9E94A8]">Manual Click</span>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              p.status === "published"
                                ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                                : "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-center font-mono font-bold text-[#17121F]">
                          {p.visits || 0}
                        </td>

                        <td className="py-4 px-6 text-center font-mono font-bold text-[#6D28D9]">
                          {p.clicks || 0}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/report/${p.slug}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F5EFFF] text-[#6D28D9] text-xs font-bold hover:bg-[#E9D5FF] transition-colors"
                              title="View Analytics & Export PDF Report"
                            >
                              <BarChart3 className="w-3.5 h-3.5" />
                              <span>Report</span>
                            </Link>
                            <a
                              href={`/lp/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-[#625A6D] hover:text-[#6D28D9] hover:bg-[#F5EFFF] transition-colors"
                              title="View Live"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <Link
                              href={`/admin/edit/${p.id}`}
                              className="p-2 rounded-lg text-[#625A6D] hover:text-[#6D28D9] hover:bg-[#F5EFFF] transition-colors"
                              title="Edit Page"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id, p.slug)}
                              className="p-2 rounded-lg text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                              title="Delete Page"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* View 2: Recent Activity Logs */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-3xl border border-[#E8E2EF] overflow-hidden shadow-xs">
          {recentLogs.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#625A6D]">
              No activity logs recorded yet. Visit any page at <code className="bg-[#FAF9FC] px-1 py-0.5 rounded font-mono text-[#6D28D9]">/lp/[slug]</code> to test.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF9FC] border-b border-[#E8E2EF] text-[#625A6D] uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Timestamp</th>
                    <th className="py-3.5 px-6">Page Slug</th>
                    <th className="py-3.5 px-6">Event Type</th>
                    <th className="py-3.5 px-6">Device &amp; Browser</th>
                    <th className="py-3.5 px-6">Campaign / Referrer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2EF]">
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF9FC] transition-colors">
                      <td className="py-3.5 px-6 text-xs font-mono text-[#625A6D]">
                        {new Date(log.ts).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-6 font-mono font-semibold text-[#6D28D9]">
                        /lp/{log.slug}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            log.type === "subscribe"
                              ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                              : log.type === "autoredirect"
                              ? "bg-[#F5EFFF] text-[#6D28D9] border border-[#E9D5FF]"
                              : "bg-[#FAF9FC] text-[#625A6D] border border-[#E8E2EF]"
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-[#17121F]">
                        {log.device} &bull; {log.browser} ({log.os})
                      </td>
                      <td className="py-3.5 px-6 text-xs text-[#625A6D] truncate max-w-[200px]">
                        {log.attribution?.utm_campaign || log.referrer || "Direct"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
