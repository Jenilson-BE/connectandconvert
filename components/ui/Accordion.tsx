"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}

export function AccordionItem({ question, answer, isOpen, onToggle, id }: AccordionItemProps) {
  const contentId = `accordion-content-${id}`;
  const headerId = `accordion-header-${id}`;

  return (
    <div className="border border-[#E8E2EF] rounded-2xl overflow-hidden transition-colors duration-200 bg-white hover:border-[#D8B4FE]">
      <h3>
        <button
          type="button"
          id={headerId}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={onToggle}
          className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] focus-visible:ring-inset"
        >
          <span className="font-semibold text-base sm:text-lg text-[#17121F] pr-4">
            {question}
          </span>
          <span
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full bg-[#FAF9FC] flex items-center justify-center transition-transform duration-300 text-[#6D28D9] border border-[#E8E2EF]",
              isOpen ? "rotate-180 bg-[#F5EFFF] border-[#D8B4FE]" : ""
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </span>
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={cn(
          "grid transition-all duration-300 ease-in-out px-5 sm:px-6",
          isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] pb-0 opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm sm:text-base text-[#625A6D] leading-relaxed border-t border-[#F5EFFF] pt-4">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { question: string; answer: string }[];
  className?: string;
  allowMultiple?: boolean;
}

export function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [openIndexes, setOpenIndexes] = React.useState<number[]>([0]);

  const handleToggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          id={`faq-${index}`}
          question={item.question}
          answer={item.answer}
          isOpen={openIndexes.includes(index)}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}
