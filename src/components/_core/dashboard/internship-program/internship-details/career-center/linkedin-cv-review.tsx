"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarCheck, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import CvReviewDrawer from "@/components/_core/dashboard/internship-program/internship-details/career-center/drawers/cv-review";
import LinkedInOptimizationDrawer from "@/components/_core/dashboard/internship-program/internship-details/career-center/drawers/linkedIn-optimization";

const SERVICE_FLAGS = [
  { src: "/images/svgs/country/UK.svg", alt: "United Kingdom" },
  { src: "/images/svgs/country/USA.svg", alt: "United States" },
];

const BOOKING_SESSION_OPTIONS = [
  { id: "linkedin", label: "LinkedIn Optimization" },
  { id: "cv-review", label: "CV Review" },
] as const;

const LinkedInCvReview = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLinkedInDrawerOpen, setIsLinkedInDrawerOpen] = useState(false);
  const [isCvReviewDrawerOpen, setIsCvReviewDrawerOpen] = useState(false);

  const handleSelectSession = (sessionId: (typeof BOOKING_SESSION_OPTIONS)[number]["id"]) => {
    setIsPopoverOpen(false);

    if (sessionId === "linkedin") {
      setIsLinkedInDrawerOpen(true);
      return;
    }

    setIsCvReviewDrawerOpen(true);
  };

  return (
    <>
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#0B2B33]">
            LinkedIn Optimization &amp; CV Review
          </h3>
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F0FF] text-[#0A66C2]"
            aria-hidden
          >
            <Linkedin className="size-5" strokeWidth={2} />
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-[#E8F0FF] p-4">
          <p className="text-sm leading-relaxed text-[#475467]">
            Schedule a session for your CV review or LinkedIn Optimization with
            our expert.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#0A66C2] text-white"
              aria-hidden
            >
              <CalendarCheck className="size-5" strokeWidth={2.5} />
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#D6E4FF] px-3 py-1 text-sm font-medium text-[#0B2B33]">
                Mon - Fri
              </span>
              <span className="rounded-full bg-[#D6E4FF] px-3 py-1 text-sm font-medium text-[#0B2B33]">
                10am - 11pm WAT
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center">
          {SERVICE_FLAGS.map((flag, index) => (
            <span
              key={flag.alt}
              className={cn(
                "relative flex size-8 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm",
                index > 0 && "-ml-2",
              )}
            >
              <Image
                src={flag.src}
                alt={flag.alt}
                width={32}
                height={32}
                className="size-full object-cover"
              />
            </span>
          ))}
        </div>

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="mt-5 h-11 w-full rounded-full border-[#0A66C2] bg-transparent text-sm font-semibold text-[#0A66C2] hover:bg-[#E8F0FF] hover:text-[#084d94]"
            >
              Book session
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            side="top"
            sideOffset={12}
            className="w-72 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-lg"
          >
            <p className="text-sm font-semibold text-[#0F4652]">
              What session are you booking?
            </p>

            <ul className="mt-3 space-y-1">
              {BOOKING_SESSION_OPTIONS.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectSession(option.id)}
                    className="w-full cursor-pointer rounded-lg px-2 py-2 text-left text-sm font-medium text-[#64748B] transition hover:bg-[#F6F8FA] hover:text-[#173740]"
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </section>

      <LinkedInOptimizationDrawer
        open={isLinkedInDrawerOpen}
        onOpenChange={setIsLinkedInDrawerOpen}
      />
      <CvReviewDrawer
        open={isCvReviewDrawerOpen}
        onOpenChange={setIsCvReviewDrawerOpen}
      />
    </>
  );
};

export default LinkedInCvReview;
