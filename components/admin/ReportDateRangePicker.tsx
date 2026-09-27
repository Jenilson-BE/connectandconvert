"use client";

import * as React from "react";
import { CalendarRange, Loader2, RotateCcw } from "lucide-react";
import { ReportDateRange } from "@/lib/landing-types";
import {
  REPORT_RANGE_MAX_DAYS,
  countDaysInclusive,
  formatFullDayLabel,
  getIstRangeStartDayKey,
  getIstTodayDayKey,
  isValidDayKey,
} from "@/lib/landing-analytics/daily";

type Mode = "range" | "single";

const PRESETS = [7, 30, 90] as const;

interface ReportDateRangePickerProps {
  appliedRange: ReportDateRange;
  loading: boolean;
  onApply: (range: { from: string | null; to: string | null }) => void;
}

export function ReportDateRangePicker({
  appliedRange,
  loading,
  onApply,
}: ReportDateRangePickerProps) {
  const today = getIstTodayDayKey();
  const [mode, setMode] = React.useState<Mode>(appliedRange.from === appliedRange.to ? "single" : "range");
  const [from, setFrom] = React.useState(appliedRange.from ?? getIstRangeStartDayKey(7));
  const [to, setTo] = React.useState(appliedRange.to ?? today);
  const [error, setError] = React.useState<string | null>(null);

  const handlePreset = (days: number) => {
    setMode("range");
    setError(null);
    onApply({ from: getIstRangeStartDayKey(days), to: today });
  };

  const handleAllTime = () => {
    setMode("range");
    setError(null);
    onApply({ from: null, to: null });
  };

  const handleApply = (event: React.FormEvent) => {
    event.preventDefault();

    if (mode === "single") {
      if (!isValidDayKey(from)) {
        setError("Pick a valid date.");
        return;
      }
      setError(null);
      onApply({ from, to: from });
      return;
    }

    const hasFrom = from !== "";
    const hasTo = to !== "";
    if (hasFrom && !isValidDayKey(from)) {
      setError("The 'from' date is not a real calendar date.");
      return;
    }
    if (hasTo && !isValidDayKey(to)) {
      setError("The 'to' date is not a real calendar date.");
      return;
    }
    if (!hasFrom && !hasTo) {
      setError("Choose at least one date, or use All Time.");
      return;
    }
    if (hasFrom && hasTo && from > to) {
      setError("The 'from' date must be on or before the 'to' date.");
      return;
    }
    if (hasFrom && hasTo && countDaysInclusive(from, to) > REPORT_RANGE_MAX_DAYS) {
      setError(`Please pick a window of ${REPORT_RANGE_MAX_DAYS} days or less.`);
      return;
    }

    setError(null);
    onApply({ from: hasFrom ? from : null, to: hasTo ? to : null });
  };

  const handleReset = () => {
    setMode("range");
    setFrom(getIstRangeStartDayKey(7));
    setTo(today);
    setError(null);
    onApply({ from: null, to: null });
  };

  const spanLabel =
    from && to && from <= to && isValidDayKey(from) && isValidDayKey(to)
      ? `${countDaysInclusive(from, to)} day${countDaysInclusive(from, to) === 1 ? "" : "s"}`
      : null;

  return (
    <form
      onSubmit={handleApply}
      className="rounded-3xl bg-white border border-[#E8E2EF] p-4 sm:p-5 shadow-xs print:hidden"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#17121F]">
          <CalendarRange className="w-4 h-4 text-[#6D28D9]" />
          Reporting period
        </span>

        <div className="flex items-center gap-1 rounded-full border border-[#E8E2EF] bg-[#FAF9FC] p-1">
          {(["range", "single"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setMode(option);
                setError(null);
                if (option === "single" && !from) setFrom(today);
              }}
              aria-pressed={mode === option}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                mode === option ? "bg-[#17121F] text-white" : "text-[#625A6D] hover:text-[#6D28D9]"
              }`}
            >
              {option === "range" ? "From / To" : "Single Day"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === "range" && (
            <>
              <input
                type="date"
                value={from}
                max={today}
                onChange={(e) => setFrom(e.target.value)}
                aria-label="From date"
                className="px-2.5 py-1.5 rounded-xl border border-[#E8E2EF] text-xs text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              />
              <span className="text-xs font-semibold text-[#625A6D]">to</span>
              <input
                type="date"
                value={to}
                max={today}
                onChange={(e) => setTo(e.target.value)}
                aria-label="To date"
                className="px-2.5 py-1.5 rounded-xl border border-[#E8E2EF] text-xs text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
              />
            </>
          )}

          {mode === "single" && (
            <input
              type="date"
              value={from}
              max={today}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="Single day"
              className="px-2.5 py-1.5 rounded-xl border border-[#E8E2EF] text-xs text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
            />
          )}

          {spanLabel && mode === "range" && (
            <span className="text-[11px] font-semibold text-[#6D28D9]">{spanLabel}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {PRESETS.map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => handlePreset(days)}
              className="px-2.5 py-1.5 rounded-full text-[11px] font-bold text-[#625A6D] border border-[#E8E2EF] hover:text-[#6D28D9] hover:border-[#6D28D9]/40 transition-colors"
            >
              {days}D
            </button>
          ))}
          <button
            type="button"
            onClick={handleAllTime}
            className="px-2.5 py-1.5 rounded-full text-[11px] font-bold text-[#625A6D] border border-[#E8E2EF] hover:text-[#6D28D9] hover:border-[#6D28D9]/40 transition-colors"
          >
            All Time
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#6D28D9] text-white hover:bg-[#5B21B6] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Apply
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-2.5 text-[11px] font-semibold text-red-600">{error}</p>
      ) : (
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-[#625A6D]">
          <span>Currently showing:</span>
          <span className="font-bold text-[#17121F]">
            {appliedRange.from === null && appliedRange.to === null
              ? "All time"
              : appliedRange.from === appliedRange.to
                ? formatFullDayLabel(appliedRange.from as string)
                : `${appliedRange.from ? formatFullDayLabel(appliedRange.from) : "Start"} to ${
                    appliedRange.to ? formatFullDayLabel(appliedRange.to) : "Today"
                  }`}
          </span>
          {(appliedRange.from !== null || appliedRange.to !== null) && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 font-semibold text-[#6D28D9] hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to all time
            </button>
          )}
        </div>
      )}
    </form>
  );
}
