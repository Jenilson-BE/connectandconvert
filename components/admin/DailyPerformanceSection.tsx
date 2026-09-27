"use client";

import * as React from "react";
import { BarChart3, Download, TrendingUp } from "lucide-react";
import { DailyPerformanceRow, ReportDateRange } from "@/lib/landing-types";
import {
  DAILY_REPORT_MAX_DAYS,
  formatDayLabel,
  formatFullDayLabel,
  getIstRangeStartDayKey,
} from "@/lib/landing-analytics/daily";
import { Button } from "@/components/ui/Button";

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

const LABEL_EVERY: Record<Range, number> = { 7: 1, 30: 5, 90: 10 };

/**
 * The two bars sit side by side, so the gaps have to shrink as days are added
 * or the 30/90 day views collapse into an unreadable smear. All values are
 * literal class names so Tailwind's scanner keeps them.
 */
const CHART_DENSITY = {
  comfortable: { outer: "gap-[6px]", inner: "gap-[3px]" },
  compact: { outer: "gap-[3px]", inner: "gap-[2px]" },
  tight: { outer: "gap-[1px]", inner: "gap-px" },
} as const;

interface DailyPerformanceSectionProps {
  rows: DailyPerformanceRow[];
  slug: string;
  /** Explicit report window. When set, the internal range toggle is hidden. */
  appliedRange?: ReportDateRange;
}

export function DailyPerformanceSection({
  rows,
  slug,
  appliedRange,
}: DailyPerformanceSectionProps) {
  const [range, setRange] = React.useState<Range>(7);

  const rangeIsExplicit = Boolean(appliedRange && appliedRange.from && appliedRange.to);

  const visible = React.useMemo(() => {
    if (rangeIsExplicit) {
      const { from, to } = appliedRange as ReportDateRange;
      return rows.filter((row) => row.date >= (from as string) && row.date <= (to as string));
    }
    const minDayKey = getIstRangeStartDayKey(range);
    return rows.filter((row) => row.date >= minDayKey);
  }, [rows, range, rangeIsExplicit, appliedRange]);

  const activeDays = visible.filter((row) => row.landings > 0 || row.conversions > 0).length;

  const maxLandings = React.useMemo(
    () => visible.reduce((max, row) => Math.max(max, row.landings), 0),
    [visible]
  );

  const maxConversions = React.useMemo(
    () => visible.reduce((max, row) => Math.max(max, row.conversions), 0),
    [visible]
  );

  /** Both series share one scale so the pair stays visually comparable. */
  const maxValue = Math.max(maxLandings, maxConversions);

  const totals = React.useMemo(
    () =>
      visible.reduce(
        (acc, row) => ({
          landings: acc.landings + row.landings,
          conversions: acc.conversions + row.conversions,
        }),
        { landings: 0, conversions: 0 }
      ),
    [visible]
  );

  const handleExportCsv = () => {
    if (visible.length === 0) {
      alert("No daily activity available to export yet.");
      return;
    }

    const headers = [
      "Date",
      "Landings",
      "Subscribes",
      "Autoredirects",
      "Conversions",
      "Conversion_Rate",
    ];
    const rowsCsv = visible.map((row) => [
      row.date,
      row.landings,
      row.subscribes,
      row.autoredirects,
      row.conversions,
      row.conversionRate,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent(
        [headers.join(","), ...rowsCsv.map((cells) => cells.join(","))].join("\n")
      );

    const windowLabel = rangeIsExplicit
      ? `${(appliedRange as ReportDateRange).from}_${(appliedRange as ReportDateRange).to}`
      : `last${range}`;

    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `cc-daily-${slug}-${windowLabel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Keep the axis readable when an explicit window spans a year.
  const labelEvery = rangeIsExplicit
    ? Math.max(1, Math.ceil(visible.length / 10))
    : LABEL_EVERY[range];

  const density =
    visible.length <= 10
      ? CHART_DENSITY.comfortable
      : visible.length <= 31
        ? CHART_DENSITY.compact
        : CHART_DENSITY.tight;

  return (
    <div className="mt-8 rounded-3xl bg-white border border-[#E8E2EF] p-6 sm:p-8 shadow-xs print:mt-6 print:rounded-xl print:p-5 print-avoid-break">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#17121F] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#6D28D9]" />
            Day-Wise Performance
          </h2>
          <p className="text-xs text-[#625A6D] mt-1">
            Tracked events grouped by IST business day. Based on logged events, so it may
            differ from the lifetime counters above.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          {!rangeIsExplicit && (
            <div className="flex items-center gap-1 rounded-full border border-[#E8E2EF] bg-[#FAF9FC] p-1">
              {RANGES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRange(option)}
                  aria-pressed={range === option}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    range === option
                      ? "bg-[#6D28D9] text-white shadow-xs"
                      : "text-[#625A6D] hover:text-[#6D28D9]"
                  }`}
                >
                  {option}D
                </button>
              ))}
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleExportCsv}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Daily
          </Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-10 text-center text-xs text-[#625A6D]">
          {rangeIsExplicit
            ? "No tracked events in the selected period."
            : `No tracked events in the last ${range} days.`}
        </div>
      ) : activeDays === 0 ? (
        <div className="py-10 text-center text-xs text-[#625A6D]">
          {rangeIsExplicit
            ? "No tracked events in the selected period."
            : `No tracked events in the last ${range} days.`}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="p-3 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#625A6D] block">
                Days tracked
              </span>
              <span className="text-lg font-extrabold text-[#17121F]">{activeDays}</span>
              {visible.length > activeDays ? (
                <span className="text-[10px] text-[#9E94A8] block">
                  of {visible.length} in period
                </span>
              ) : null}
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#625A6D] block">
                Landings
              </span>
              <span className="text-lg font-extrabold text-[#17121F]">
                {totals.landings.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#625A6D] block">
                Conversions
              </span>
              <span className="text-lg font-extrabold text-emerald-600">
                {totals.conversions.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#625A6D] block">
                Best day
              </span>
              <span className="text-sm font-extrabold text-[#17121F] block leading-tight pt-1">
                {visible.reduce((best, row) => (row.landings > best.landings ? row : best)).date}
              </span>
            </div>
          </div>

          {/* Chart: landings vs conversions per day */}
          <div className="p-4 rounded-2xl bg-[#FAF9FC] border border-[#E8E2EF]">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#625A6D]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#17121F]" /> Landings
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#625A6D]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Conversions
                </span>
              </div>
              <span className="text-[11px] text-[#9E94A8]">Peak: {maxValue}</span>
            </div>

            {/* items-stretch is required: the columns must fill h-36 so the bar
                area below has a definite height and the percentage heights on
                each bar resolve. With items-end every bar collapses to 2px. */}
            <div className={`flex items-stretch h-36 ${density.outer}`}>
              {visible.map((row, index) => {
                const landingPct = maxValue > 0 ? (row.landings / maxValue) * 100 : 0;
                const conversionPct = maxValue > 0 ? (row.conversions / maxValue) * 100 : 0;
                const showLabel = index % labelEvery === 0;

                return (
                  <div
                    key={row.date}
                    className="flex-1 min-w-0 flex flex-col items-center gap-1"
                    title={`${formatFullDayLabel(row.date)} — ${row.landings} landings, ${row.conversions} conversions (${row.conversionRate})`}
                  >
                    <div
                      className={`w-full flex-1 flex items-end justify-center ${density.inner}`}
                    >
                      <div
                        className={`w-1/2 rounded-t-sm bg-[#17121F] ${row.landings > 0 ? "min-h-[2px]" : ""}`}
                        style={{
                          height: row.landings > 0 ? `${Math.max(landingPct, 2)}%` : "0%",
                        }}
                      />
                      <div
                        className={`w-1/2 rounded-t-sm bg-emerald-500 ${row.conversions > 0 ? "min-h-[2px]" : ""}`}
                        style={{
                          height:
                            row.conversions > 0 ? `${Math.max(conversionPct, 2)}%` : "0%",
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-[#9E94A8] truncate w-full text-center">
                      {showLabel ? formatDayLabel(row.date) : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="mt-5 overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-white border-b border-[#E8E2EF]">
                <tr className="text-[#625A6D]">
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider">Date</th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                    Landings
                  </th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                    Subscribe
                  </th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                    Autoredirect
                  </th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                    Conversions
                  </th>
                  <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-right">
                    Conv. Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFFF]">
                {[...visible]
                  .filter((row) => row.landings > 0 || row.conversions > 0)
                  .reverse()
                  .map((row) => (
                    <tr key={row.date} className="hover:bg-[#FAF9FC]">
                    <td className="py-2.5 px-3 text-[#17121F] font-semibold whitespace-nowrap">
                      {formatFullDayLabel(row.date)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#17121F]">{row.landings}</td>
                    <td className="py-2.5 px-3 text-right text-blue-600">{row.subscribes}</td>
                    <td className="py-2.5 px-3 text-right text-amber-600">{row.autoredirects}</td>
                    <td className="py-2.5 px-3 text-right text-[#17121F] font-semibold">
                      {row.conversions}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <TrendingUp className="w-3 h-3" />
                        {row.conversionRate}
                      </span>
                    </td>
                  </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-[#9E94A8] mt-3">
            {rangeIsExplicit
              ? `${activeDays} of ${visible.length} days in the selected period had tracked events.`
              : `Showing the last ${visible.length} tracked days of up to ${DAILY_REPORT_MAX_DAYS}.`}
          </p>
        </>
      )}
    </div>
  );
}
