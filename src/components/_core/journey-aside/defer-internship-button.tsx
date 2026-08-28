"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { DefermentDialog } from "@/components/_core/dashboard/layout/deferment-dialog";
import { cn } from "@/lib/utils";

type DeferInternshipButtonProps = {
  compact?: boolean;
};

export function DeferInternshipButton({
  compact = false,
}: DeferInternshipButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E8CC764D] px-4 py-2.5 text-sm font-semibold text-[#FFE082] transition hover:bg-[#9BE8B8]",
          compact && "size-10 px-0",
        )}
        title="Defer internship"
      >
        <ArrowLeftRight className="size-4 shrink-0" aria-hidden />
        <span className={cn(compact && "sr-only")}>Defer internship</span>
      </button>

      <DefermentDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
