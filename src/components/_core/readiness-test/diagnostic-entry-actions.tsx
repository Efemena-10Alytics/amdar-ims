"use client";

import { cn } from "@/lib/utils";

type DiagnosticEntryActionsProps = {
  canViewResults: boolean;
  isLoading?: boolean;
  isProceeding?: boolean;
  startDisabled?: boolean;
  startLabel?: string;
  seeResultLabel?: string;
  proceedLabel?: string;
  onSeeResult: () => void;
  onProceed: () => void;
  onStart: () => void;
};

export function DiagnosticEntryActions({
  canViewResults,
  isLoading = false,
  isProceeding = false,
  startDisabled = false,
  startLabel = "Start diagnostic",
  seeResultLabel = "See result",
  proceedLabel = "Proceed",
  onSeeResult,
  onProceed,
  onStart,
}: DiagnosticEntryActionsProps) {
  if (canViewResults) {
    return (
      <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={isLoading || isProceeding}
          onClick={onSeeResult}
          className={cn(
            "h-12 w-full flex-1 cursor-pointer rounded-full bg-[#C5D6DC] text-base font-medium text-[#092A31] transition hover:bg-[#B8CDD3]",
            "disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          {isLoading ? "Loading..." : seeResultLabel}
        </button>
        <button
          type="button"
          disabled={isProceeding || isLoading}
          onClick={onProceed}
          className={cn(
            "h-12 w-full flex-1 cursor-pointer rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa]",
            "disabled:cursor-not-allowed disabled:bg-[#9DB8C0]",
          )}
        >
          {isProceeding ? "Saving..." : proceedLabel}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={startDisabled || isLoading || isProceeding}
      onClick={onStart}
      className="ml-auto mt-6 block h-12 w-full max-w-80 cursor-pointer rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0]"
    >
      {isProceeding
        ? "Saving..."
        : isLoading
          ? "Loading..."
          : startLabel}
    </button>
  );
}
