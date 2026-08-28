"use client";

import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { INTERNSHIP_DEFERMENT_FORM_URL } from "@/constants/internship-deferment";
import { cn } from "@/lib/utils";

type DeferInternshipButtonProps = {
  compact?: boolean;
};

export function DeferInternshipButton({
  compact = false,
}: DeferInternshipButtonProps) {
  const isExternal = INTERNSHIP_DEFERMENT_FORM_URL.startsWith("http");

  return (
    <Link
      href={INTERNSHIP_DEFERMENT_FORM_URL}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#E8CC764D] px-4 py-2.5 text-sm font-semibold text-[#FFE082] transition hover:bg-[#9BE8B8]",
        compact && "size-10 px-0",
      )}
      title="Defer internship"
    >
      <ArrowLeftRight className="size-4 shrink-0" aria-hidden />
      <span className={cn(compact && "sr-only")}>Defer internship</span>
    </Link>
  );
}
