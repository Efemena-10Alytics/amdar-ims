"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const OFFERS = [
  "CV Review and Revamp",
  "LinkedIn optimization",
  "Navigating the Job Market",
  "Interview prep session",
  "Mentorship and Career coaching",
  "UK/ US/ CAD Reference letter",
  "On the job support",
  "Lifetime Career Support",
];

export type OfferDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** CTA button link (default /internship) */
  secureSpotHref?: string;
  /** Optional image path for left panel (default placeholder) */
  imageSrc?: string;
};

export function OfferDialog({
  open,
  onOpenChange,
  secureSpotHref = "/internship",
}: OfferDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-4xl! w-[min(100%-2rem,700px)] max-h-[96vh] p-0! rounded-2xl gap-0 overflow-auto sm:overflow-hidden bg-primary",
          "grid grid-cols-1 md:grid-cols-2",
        )}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-white/90 text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Left: image */}
        <div className="relative aspect-4/3 md:aspect-auto md:min-h-80 bg-gray-2">
          <Image
            src={"/iwd/offer.png"}
            alt="Team collaboration"
            fill
            className="object-cove p-6 rounded-2xl"
            sizes="(max-width: 768px) 100vw, 450px"
          />
        </div>

        {/* Right: teal panel */}
        <div
          className="flex flex-col p-6 md:p-8 text-white"
          // style={{ backgroundColor: "#0F4652" }}
        >
          <DialogTitle className="text-xl font-semibold text-amdari-yellow mb-6 pr-8">
            Offers you get!
          </DialogTitle>

          <ul className="space-y-3 flex-1">
            {OFFERS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm md:text-base"
              >
                <span
                  className="shrink-0 size-5 rounded-full flex items-center justify-center bg-[#43CA74] border-2 border-[#43CA74] text-primary"
                  aria-hidden
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href={secureSpotHref}
            onClick={() => onOpenChange(false)}
            className={cn(
              "mt-6 w-full rounded-full py-3.5 text-center text-[#0F4652]",
              "bg-[#FFE082] hover:bg-[#F5D76E] transition-colors",
            )}
          >
            Secure your spot
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
