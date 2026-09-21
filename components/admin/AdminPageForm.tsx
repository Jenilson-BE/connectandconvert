"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  Link2,
  Clock,
  BarChart3,
  Palette,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { LandingPageConfig, ThemeAccent } from "@/lib/landing-types";
import { Button } from "@/components/ui/Button";

interface AdminPageFormProps {
  initialData?: Partial<LandingPageConfig>;
  isEditing?: boolean;
}

export function AdminPageForm({ initialData, isEditing = false }: AdminPageFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"basic" | "copy" | "cta" | "timer" | "stats" | "tracking">("basic");
  const [saving, setSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");

  const [formData, setFormData] = React.useState<LandingPageConfig>({
    id: initialData?.id || "",
    slug: initialData?.slug || "",
    status: initialData?.status || "published",
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    title: initialData?.title || "",
    metaDescription: initialData?.metaDescription || "",
    ogImage: initialData?.ogImage || "",

    brandName: initialData?.brandName || "",
    topBadge: initialData?.topBadge || "VIP Community",
    statusBadge: initialData?.statusBadge || "Access Available",
    logoUrl: initialData?.logoUrl || "/logo.png",

    preHeadline: initialData?.preHeadline || "Exclusive Community",
    headlineMain: initialData?.headlineMain || "Connect &",
    headlineHighlight: initialData?.headlineHighlight || "Convert",
    subHeadline: initialData?.subHeadline || "Turn attention into predictable business growth.",
    description: initialData?.description || "High-converting marketing frameworks and direct communication.",

    ctaText: initialData?.ctaText || "JOIN NOW ON TELEGRAM",
    ctaSubtext: initialData?.ctaSubtext || "Instant access to private community",
    destinationUrl: initialData?.destinationUrl || "https://t.me/connectandconvert",

    autoRedirect: initialData?.autoRedirect ?? true,
    redirectAfterSeconds: initialData?.redirectAfterSeconds || 8,
    startOnFirstScroll: initialData?.startOnFirstScroll ?? true,

    stats: {
      members: initialData?.stats?.members || "10K+",
      access: initialData?.stats?.access || "24/7",
      pricing: initialData?.stats?.pricing || "FREE",
      content: initialData?.stats?.content || "Daily",
    },

    disclaimerText: initialData?.disclaimerText || "Educational and community content only. Past results do not guarantee future performance.",
    footerText: initialData?.footerText || "All rights reserved. Digital marketing and community education.",
    privacyText: initialData?.privacyText || "This website may use privacy-compliant analytics to understand campaign visits.",

    metaPixelId: initialData?.metaPixelId || "",
    gaMeasurementId: initialData?.gaMeasurementId || "",
    themeAccent: (initialData?.themeAccent as ThemeAccent) || "violet",
  });

  const handleChange = (field: keyof LandingPageConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (statField: "members" | "access" | "pricing" | "content", value: string) => {
    setFormData((prev) => ({
      ...prev,
      stats: { ...prev.stats, [statField]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.slug.trim()) {
      setErrorMsg("URL slug is required (e.g. crypto-vip).");
      setSaving(false);
      return;
    }

    if (!formData.destinationUrl.trim()) {
      setErrorMsg("Destination CTA URL is required.");
      setSaving(false);
      return;
    }

    try {
      const url = isEditing
        ? `/api/admin/landing-pages/${formData.id}`
        : "/api/admin/landing-pages";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save landing page.");
      }

      setSuccessMsg("Landing page saved successfully!");
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const THEMES: { id: ThemeAccent; label: string; bg: string }[] = [
    { id: "violet", label: "Violet Luxury", bg: "bg-[#7C3AED]" },
    { id: "purple", label: "Royal Purple", bg: "bg-[#9333EA]" },
    { id: "emerald", label: "Emerald Wealth", bg: "bg-[#059669]" },
    { id: "blue", label: "Cobalt Blue", bg: "bg-[#2563EB]" },
    { id: "rose", label: "Rose Ruby", bg: "bg-[#E11D48]" },
    { id: "amber", label: "Amber Gold", bg: "bg-[#D97706]" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="w-10 h-10 rounded-full bg-white border border-[#E8E2EF] flex items-center justify-center text-[#625A6D] hover:text-[#17121F] hover:border-[#6D28D9] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#17121F]">
              {isEditing ? `Edit: /lp/${formData.slug}` : "Create New Landing Page"}
            </h1>
            <p className="text-xs text-[#625A6D]">
              Complete control over branding, countdown redirect, copy, and analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {formData.slug && (
            <a
              href={`/lp/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8E2EF] text-xs font-semibold text-[#17121F] bg-white hover:bg-[#FAF9FC] transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#6D28D9]" />
              <span>Preview Live</span>
            </a>
          )}
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Save Changes" : "Create & Publish"}</span>
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-3 text-sm text-[#991B1B]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-3 text-sm text-[#065F46]">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-[#E8E2EF]">
        {[
          { id: "basic", label: "URL & SEO", icon: Link2 },
          { id: "copy", label: "Branding & Copy", icon: Sparkles },
          { id: "cta", label: "Destination CTA", icon: Save },
          { id: "timer", label: "Countdown Timer", icon: Clock },
          { id: "stats", label: "Stats & Legal", icon: ShieldCheck },
          { id: "tracking", label: "Pixels & Theme", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#6D28D9] text-white shadow-xs"
                  : "text-[#625A6D] hover:text-[#17121F] hover:bg-[#FAF9FC]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2EF] shadow-lg shadow-[#6D28D9]/5 space-y-8">
        {/* Tab 1: Basic & SEO */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-[#17121F] pb-2 border-b border-[#F5EFFF]">
              Page Identifier &amp; SEO Setup
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  URL Slug <span className="text-[#6D28D9]">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-[#E8E2EF] bg-[#FAF9FC] overflow-hidden focus-within:ring-2 focus-within:ring-[#6D28D9] focus-within:border-transparent">
                  <span className="px-3 text-xs text-[#625A6D] font-mono select-none">
                    /lp/
                  </span>
                  <input
                    type="text"
                    placeholder="profit-queen"
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-"))}
                    className="w-full py-3 pr-4 text-sm text-[#17121F] bg-transparent focus:outline-none"
                    required
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#625A6D]">
                  Accessible at: https://connectandconvert.tech/lp/<strong>{formData.slug || "your-slug"}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Publish Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                >
                  <option value="published">Published (Active)</option>
                  <option value="draft">Draft (Private)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                SEO Page Title <span className="text-[#6D28D9]">*</span>
              </label>
              <input
                type="text"
                placeholder="Profit Queen — Premium Trading Community"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                Meta Description
              </label>
              <textarea
                rows={2}
                placeholder="Join the community for market education, trading insights, and regular updates."
                value={formData.metaDescription}
                onChange={(e) => handleChange("metaDescription", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                Social Share Image (OG Image URL)
              </label>
              <input
                type="text"
                placeholder="/profit-queen-logo.jpg or https://..."
                value={formData.ogImage}
                onChange={(e) => handleChange("ogImage", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Branding & Copy */}
        {activeTab === "copy" && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-[#17121F] pb-2 border-b border-[#F5EFFF]">
              Branding, Badges &amp; Hero Headline
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Brand / Offer Name
                </label>
                <input
                  type="text"
                  placeholder="Profit Queen"
                  value={formData.brandName}
                  onChange={(e) => handleChange("brandName", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Logo Image URL
                </label>
                <input
                  type="text"
                  placeholder="/profit-queen-logo.jpg or /logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange("logoUrl", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Top Badge Text
                </label>
                <input
                  type="text"
                  placeholder="Profit Queen Community"
                  value={formData.topBadge}
                  onChange={(e) => handleChange("topBadge", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Status Pill Badge Text
                </label>
                <input
                  type="text"
                  placeholder="Community Access Available"
                  value={formData.statusBadge}
                  onChange={(e) => handleChange("statusBadge", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                Pre-Headline Eyebrow
              </label>
              <input
                type="text"
                placeholder="Market Education Community"
                value={formData.preHeadline}
                onChange={(e) => handleChange("preHeadline", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Main Headline (Leading text)
                </label>
                <input
                  type="text"
                  placeholder="Profit"
                  value={formData.headlineMain}
                  onChange={(e) => handleChange("headlineMain", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Highlighted Gradient Word
                </label>
                <input
                  type="text"
                  placeholder="Queen"
                  value={formData.headlineHighlight}
                  onChange={(e) => handleChange("headlineHighlight", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                Sub-Headline
              </label>
              <input
                type="text"
                placeholder="Understand Markets With More Clarity."
                value={formData.subHeadline}
                onChange={(e) => handleChange("subHeadline", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                Description Paragraph
              </label>
              <textarea
                rows={3}
                placeholder="Market education with clarity, technical analysis concepts, risk awareness and community updates."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Destination & CTA */}
        {activeTab === "cta" && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-[#17121F] pb-2 border-b border-[#F5EFFF]">
              Primary Call To Action &amp; Destination Link
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                Target Destination URL (Telegram Channel / Invite Link) <span className="text-[#6D28D9]">*</span>
              </label>
              <input
                type="url"
                placeholder="https://t.me/connectandconvert or https://t.me/+yourInviteCode"
                value={formData.destinationUrl}
                onChange={(e) => handleChange("destinationUrl", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                required
              />
              <p className="mt-1.5 text-[11px] text-[#625A6D]">
                Where visitors will be sent when clicking the main button or when the auto-redirect timer completes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  CTA Button Main Label
                </label>
                <input
                  type="text"
                  placeholder="JOIN PROFIT QUEEN ON TELEGRAM"
                  value={formData.ctaText}
                  onChange={(e) => handleChange("ctaText", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  CTA Button Sub-Text
                </label>
                <input
                  type="text"
                  placeholder="Continue to the Profit Queen community"
                  value={formData.ctaSubtext}
                  onChange={(e) => handleChange("ctaSubtext", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Countdown Timer */}
        {activeTab === "timer" && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-[#17121F] pb-2 border-b border-[#F5EFFF]">
              Auto-Redirect &amp; Radial Countdown Timer
            </h2>

            <div className="p-4 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#17121F] block">
                  Enable Auto-Redirect Timer
                </span>
                <span className="text-xs text-[#625A6D]">
                  Automatically forward visitors to the destination link after countdown.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.autoRedirect}
                onChange={(e) => handleChange("autoRedirect", e.target.checked)}
                className="w-5 h-5 accent-[#6D28D9] rounded"
              />
            </div>

            {formData.autoRedirect && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                    Countdown Duration (Seconds)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={60}
                    value={formData.redirectAfterSeconds}
                    onChange={(e) => handleChange("redirectAfterSeconds", parseInt(e.target.value) || 8)}
                    className="w-full max-w-xs px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                  />
                  <p className="mt-1 text-[11px] text-[#625A6D]">
                    Recommended: 6 to 10 seconds for maximum retention and user clarity.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF] flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-[#17121F] block">
                      Start Countdown On User First Scroll
                    </span>
                    <span className="text-xs text-[#625A6D]">
                      Only triggers the timer once the user engages and scrolls down (prevents bounce miscounts).
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.startOnFirstScroll}
                    onChange={(e) => handleChange("startOnFirstScroll", e.target.checked)}
                    className="w-5 h-5 accent-[#6D28D9] rounded"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 5: Stats & Legal */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-[#17121F] pb-2 border-b border-[#F5EFFF]">
              Social Proof Stats &amp; Legal Disclaimers
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Members Count
                </label>
                <input
                  type="text"
                  placeholder="22K+"
                  value={formData.stats.members}
                  onChange={(e) => handleStatChange("members", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Access Type
                </label>
                <input
                  type="text"
                  placeholder="24/7"
                  value={formData.stats.access}
                  onChange={(e) => handleStatChange("access", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Pricing Tag
                </label>
                <input
                  type="text"
                  placeholder="FREE"
                  value={formData.stats.pricing}
                  onChange={(e) => handleStatChange("pricing", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Content Updates
                </label>
                <input
                  type="text"
                  placeholder="∞ or Daily"
                  value={formData.stats.content}
                  onChange={(e) => handleStatChange("content", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                Card Disclaimer Box Text
              </label>
              <textarea
                rows={2}
                value={formData.disclaimerText}
                onChange={(e) => handleChange("disclaimerText", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                Footer Disclaimer Text
              </label>
              <textarea
                rows={2}
                value={formData.footerText}
                onChange={(e) => handleChange("footerText", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              />
            </div>
          </div>
        )}

        {/* Tab 6: Tracking & Pixels */}
        {activeTab === "tracking" && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-[#17121F] pb-2 border-b border-[#F5EFFF]">
              Analytics Pixels &amp; Visual Theme
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Meta Pixel ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789012345"
                  value={formData.metaPixelId}
                  onChange={(e) => handleChange("metaPixelId", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
                <p className="mt-1 text-[11px] text-[#625A6D]">
                  Fires PageView, ViewContent, and Subscribe events for this specific page.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
                  Google Analytics Measurement ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. G-XXXXXXXXXX"
                  value={formData.gaMeasurementId}
                  onChange={(e) => handleChange("gaMeasurementId", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                />
                <p className="mt-1 text-[11px] text-[#625A6D]">
                  GA4 Measurement ID with UTM attribution mapping.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-3">
                Theme Accent Palette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {THEMES.map((th) => {
                  const isSelected = formData.themeAccent === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => handleChange("themeAccent", th.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? "border-[#6D28D9] bg-[#F5EFFF]/60 shadow-xs"
                          : "border-[#E8E2EF] bg-white hover:bg-[#FAF9FC]"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full shrink-0 ${th.bg}`} />
                      <span className="text-xs font-bold text-[#17121F]">{th.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Form Actions */}
        <div className="pt-6 border-t border-[#E8E2EF] flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/admin"
            className="text-xs font-semibold text-[#625A6D] hover:text-[#17121F]"
          >
            Cancel &amp; Return
          </Link>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                handleChange("status", "draft");
                setTimeout(handleSubmit as any, 100);
              }}
              disabled={saving}
            >
              Save as Draft
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={saving}>
              {saving ? "Saving..." : isEditing ? "Save & Update Live" : "Create & Publish"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
