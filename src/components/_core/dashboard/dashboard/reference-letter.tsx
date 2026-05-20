"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REFERENCE_FLAGS = [
  { src: "/images/svgs/country/UK.svg", alt: "United Kingdom" },
  { src: "/images/svgs/country/USA.svg", alt: "United States" },
  { src: "/images/svgs/country/USA.svg", alt: "United States" },
];

const ReferenceLetter = () => {
  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-[#0B2B33]">Reference Letter Request</h3>
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#7C6BB5]"
          aria-hidden
        >
          <FileText className="size-5" strokeWidth={2} />
        </span>
      </div>

      <div className="mt-4 rounded-xl bg-[#F3F0FF] p-4">
        <p className="text-sm leading-relaxed text-[#475467]">
          Request an official Amdari reference letter between the hours of:
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#0E6174] text-white"
            aria-hidden
          >
            <CalendarCheck className="size-5" strokeWidth={2.5} />
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#E8E1FF] px-3 py-1 text-sm font-medium text-[#0B2B33]">
              Mon - Fri
            </span>
            <span className="rounded-full bg-[#E8E1FF] px-3 py-1 text-sm font-medium text-[#0B2B33]">
              10am - 11pm WAT
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center">
          {REFERENCE_FLAGS.map((flag, index) => (
            <span
              key={`${flag.alt}-${index}`}
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

        <Link
          href="#"
          className="text-sm font-semibold text-[#1A6B8A] underline underline-offset-2 hover:text-[#0E6174]"
        >
          Request reference details
        </Link>
      </div>

      <Button
        type="button"
        className="mt-5 h-11 w-full rounded-full bg-[#134E5E] text-sm font-semibold text-white hover:bg-[#0E6174]"
      >
        Request letter
      </Button>
    </section>
  );
};

export default ReferenceLetter;
