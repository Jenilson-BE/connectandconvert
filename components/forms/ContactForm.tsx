"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2, AlertCircle, CheckCircle2, Send } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  businessName: z.string().min(2, "Please enter your business or company name."),
  email: z.string().email("Please provide a valid email address."),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number with at least 10 digits.")
    .regex(/^[0-9+\s-()]+$/, "Please enter a valid phone number."),
  services: z.array(z.string()).min(1, "Please select at least one service of interest."),
  businessWebsite: z.string().optional(),
  marketingGoals: z.string().min(10, "Please briefly describe your primary marketing goals."),
  budgetRange: z.string().optional(),
  additionalMessage: z.string().optional(),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type ContactFormInputs = z.infer<typeof contactSchema>;

const BUDGET_OPTIONS = [
  "₹30,000 - ₹50,000 / month",
  "₹50,000 - ₹1,00,000 / month",
  "₹1,00,000 - ₹2,50,000 / month",
  "₹2,50,000+ / month",
  "One-time project budget",
  "Not sure yet / Need guidance",
];

export function ContactForm() {
  const [submissionStatus, setSubmissionStatus] = React.useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      phone: "",
      services: [],
      businessWebsite: "",
      marketingGoals: "",
      budgetRange: "",
      additionalMessage: "",
      honeypot: "",
    },
  });

  const selectedServices = watch("services") || [];

  const handleServiceToggle = (serviceTitle: string) => {
    if (selectedServices.includes(serviceTitle)) {
      setValue(
        "services",
        selectedServices.filter((s) => s !== serviceTitle),
        { shouldValidate: true }
      );
    } else {
      setValue("services", [...selectedServices, serviceTitle], {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (data: ContactFormInputs) => {
    setSubmissionStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit inquiry. Please try again.");
      }

      setSubmissionStatus("success");
      reset();
    } catch (err: unknown) {
      setSubmissionStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please reach out via Telegram or email.");
      }
    }
  };

  if (submissionStatus === "success") {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#A7F3D0] shadow-lg text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-[#17121F]">
            Inquiry Received
          </h3>
          <p className="text-base text-[#625A6D] max-w-md mx-auto leading-relaxed">
            Thank you for reaching out to Connect &amp; Convert. We've received your inquiry and will review the details. Our team will contact you within 24 hours.
          </p>
        </div>
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setSubmissionStatus("idle")}
          >
            Submit Another Inquiry
          </Button>
          <a
            href={SITE_CONFIG.contact.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#2AABEE] text-white hover:bg-[#229ed9] transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Connect on Telegram</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2EF] shadow-xl shadow-[#6D28D9]/5 space-y-8"
      noValidate
    >
      {/* Honeypot field for anti-spam (invisible to users) */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      {submissionStatus === "error" && (
        <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-sm text-[#991B1B]">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Name & Business */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2"
          >
            Full Name <span className="text-[#6D28D9]">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="e.g. Aditi Sharma"
            {...register("fullName")}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#17121F] bg-[#FAF9FC] placeholder:text-[#9E94A8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9] transition-all ${
              errors.fullName ? "border-[#EF4444]" : "border-[#E8E2EF]"
            }`}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-xs text-[#EF4444]">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="businessName"
            className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2"
          >
            Business Name <span className="text-[#6D28D9]">*</span>
          </label>
          <input
            id="businessName"
            type="text"
            placeholder="e.g. Lumina Living Pvt Ltd"
            {...register("businessName")}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#17121F] bg-[#FAF9FC] placeholder:text-[#9E94A8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9] transition-all ${
              errors.businessName ? "border-[#EF4444]" : "border-[#E8E2EF]"
            }`}
          />
          {errors.businessName && (
            <p className="mt-1.5 text-xs text-[#EF4444]">{errors.businessName.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2"
          >
            Email Address <span className="text-[#6D28D9]">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="aditi@example.com"
            {...register("email")}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#17121F] bg-[#FAF9FC] placeholder:text-[#9E94A8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9] transition-all ${
              errors.email ? "border-[#EF4444]" : "border-[#E8E2EF]"
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-[#EF4444]">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2"
          >
            Phone Number <span className="text-[#6D28D9]">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register("phone")}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#17121F] bg-[#FAF9FC] placeholder:text-[#9E94A8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9] transition-all ${
              errors.phone ? "border-[#EF4444]" : "border-[#E8E2EF]"
            }`}
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs text-[#EF4444]">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Services Multi-Select Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2">
          Services Interested In <span className="text-[#6D28D9]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {SERVICES.map((s) => {
            const isChecked = selectedServices.includes(s.title);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleServiceToggle(s.title)}
                className={`p-3 rounded-xl text-left border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                  isChecked
                    ? "bg-[#F5EFFF] border-[#6D28D9] text-[#6D28D9]"
                    : "bg-[#FAF9FC] border-[#E8E2EF] text-[#625A6D] hover:bg-white hover:text-[#17121F]"
                }`}
              >
                <span>{s.shortTitle}</span>
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                    isChecked
                      ? "bg-[#6D28D9] border-[#6D28D9] text-white"
                      : "border-[#E8E2EF] bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
        {errors.services && (
          <p className="mt-1.5 text-xs text-[#EF4444]">{errors.services.message}</p>
        )}
      </div>

      {/* Row 3: Website & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="businessWebsite"
            className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2"
          >
            Business Website <span className="text-[#9E94A8] font-normal">(Optional)</span>
          </label>
          <input
            id="businessWebsite"
            type="url"
            placeholder="https://yourcompany.com"
            {...register("businessWebsite")}
            className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] placeholder:text-[#9E94A8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9] transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="budgetRange"
            className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2"
          >
            Monthly Budget Range <span className="text-[#9E94A8] font-normal">(Optional)</span>
          </label>
          <select
            id="budgetRange"
            {...register("budgetRange")}
            className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9] transition-all"
          >
            <option value="">Select a range...</option>
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Marketing Goals */}
      <div>
        <label
          htmlFor="marketingGoals"
          className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2"
        >
          Marketing Goals &amp; Project Scope <span className="text-[#6D28D9]">*</span>
        </label>
        <textarea
          id="marketingGoals"
          rows={3}
          placeholder="Tell us what you want to achieve (e.g., generate 50 qualified real estate leads monthly, launch new D2C brand, reduce cost per acquisition on Google)..."
          {...register("marketingGoals")}
          className={`w-full px-4 py-3 rounded-xl border text-sm text-[#17121F] bg-[#FAF9FC] placeholder:text-[#9E94A8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9] transition-all ${
            errors.marketingGoals ? "border-[#EF4444]" : "border-[#E8E2EF]"
          }`}
        />
        {errors.marketingGoals && (
          <p className="mt-1.5 text-xs text-[#EF4444]">{errors.marketingGoals.message}</p>
        )}
      </div>

      {/* Additional Message */}
      <div>
        <label
          htmlFor="additionalMessage"
          className="block text-xs font-bold uppercase tracking-wider text-[#17121F] mb-2"
        >
          Additional Context <span className="text-[#9E94A8] font-normal">(Optional)</span>
        </label>
        <textarea
          id="additionalMessage"
          rows={2}
          placeholder="Any existing ad spend, launch timelines, or current challenges we should know about..."
          {...register("additionalMessage")}
          className="w-full px-4 py-3 rounded-xl border border-[#E8E2EF] text-sm text-[#17121F] bg-[#FAF9FC] placeholder:text-[#9E94A8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D28D9] transition-all"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submissionStatus === "submitting"}
          className="w-full sm:w-auto"
        >
          {submissionStatus === "submitting" ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Inquiry...</span>
            </span>
          ) : (
            "Submit Qualified Inquiry"
          )}
        </Button>
        <p className="text-[11px] text-[#625A6D] mt-3">
          We respect your privacy. Your information is strictly used to evaluate your inquiry. No spam.
        </p>
      </div>
    </form>
  );
}
