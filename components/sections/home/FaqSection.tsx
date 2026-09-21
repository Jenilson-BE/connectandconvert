import * as React from "react";
import { FAQS } from "@/lib/faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";

export function FaqSection() {
  return (
    <section className="py-20 md:py-28 bg-[#FAF9FC] relative" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FREQUENTLY ASKED QUESTIONS"
          title="Questions before getting started?"
          subtitle="Everything you need to know about our services, process, and how we work together to support your marketing goals."
          align="center"
          className="mb-14"
        />

        {/* Accessible Accordion */}
        <Accordion items={FAQS} allowMultiple={false} />

        {/* Still have questions CTA */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white border border-[#E8E2EF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-[#17121F] text-base">
              Have a specific question not covered here?
            </h4>
            <p className="text-xs text-[#625A6D]">
              We're happy to discuss your unique business requirements directly.
            </p>
          </div>
          <Button href="/contact" variant="secondary" size="sm">
            Contact Our Team
          </Button>
        </div>
      </div>
    </section>
  );
}
