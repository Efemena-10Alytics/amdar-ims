"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function WithdrawalSuccessModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-100 gap-6 rounded-2xl p-8 text-center">
        <DialogTitle className="font-clash-display text-2xl font-bold text-[#092A31]">
          Successful !
        </DialogTitle>

        <div className="mx-auto flex size-32 items-center justify-center rounded-full border-4 border-[#22C55E]">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 12.5L10 17.5L19 8.5"
              stroke="#22C55E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="font-sora text-base text-[#64748B]">
          Your withdrawal request has been sent to the finance team.
        </p>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#156374] font-sora text-base font-semibold text-white transition-colors hover:bg-[#156374]/90"
        >
          Back to dashboard
        </button>
      </DialogContent>
    </Dialog>
  );
}
