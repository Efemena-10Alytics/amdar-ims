"use client";

import type { FAQ } from "@/types/internship-program";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FaqProps {
  faqs: FAQ[];
}

const Faq = ({ faqs }: FaqProps) => {
  if (!faqs?.length) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#092A31]">Frequently asked questions</h2>
        <p className="text-[#64748B]">No FAQs available for this program.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-[#092A31] mb-6">
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
            <AccordionTrigger
              className={cn(
                "text-left text-[#092A31] font-medium hover:no-underline hover:text-[#156374]",
                "data-[state=open]:text-[#156374]",
              )}
            >
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-[#64748B] leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faq;
