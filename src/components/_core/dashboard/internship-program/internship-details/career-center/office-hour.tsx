"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoToastBanner } from "@/components/ui/info-toast-banner";
import { cn } from "@/lib/utils";
import { formatGmtPlus1Range } from "@/lib/timezone";
import { SpekerIcon } from "@/components/_core/dashboard/internship-program/svg";
import OfficeHourDrawer from "@/components/_core/dashboard/internship-program/internship-details/career-center/drawers/office-hour";

const SERVICE_FLAGS = [
  { src: "/images/svgs/country/UK.svg", alt: "United Kingdom" },
  { src: "/images/svgs/country/USA.svg", alt: "United States" },
];

const OfficeHour = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const availabilityHours = formatGmtPlus1Range("14:00", "23:00");

  return (
    <>
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#0B2B33]">Office Hour</h3>
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E8F4F8] text-[#1A6B8A]"
            aria-hidden
          >
            <SpekerIcon className="size-[15px]" />
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-[#E8F4F8] p-4">
          <p className="text-sm leading-relaxed text-[#475467]">
            Schedule an office hour with your team lead
          </p>

          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#D4EBF1] px-3 py-1.5 text-sm font-medium text-[#0B2B33]">
            <CalendarDays className="size-4 shrink-0 text-[#1A6B8A]" aria-hidden />
            Mon - Fri {availabilityHours}
          </span>
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

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSuccessMessage("");
            setIsDrawerOpen(true);
          }}
          className="mt-5 h-11 w-full rounded-full border-[#3B82F6] bg-[#C2D8FC] text-sm font-semibold text-[#3B82F6] hover:bg-[#B3CDFA] hover:text-[#2563EB]"
        >
          Book session
        </Button>
      </section>

      <OfficeHourDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onBooked={setSuccessMessage}
      />

      {successMessage ? (
        <InfoToastBanner
          message={successMessage}
          onDismiss={() => setSuccessMessage("")}
        />
      ) : null}
    </>
  );
};

export default OfficeHour;
