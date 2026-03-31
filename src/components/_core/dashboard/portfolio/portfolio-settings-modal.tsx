"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useUpdatePortfolio } from "@/features/portfolio/use-update-portfolio";
import { useGetPortfolio } from "@/features/portfolio/use-get-portfolio";

type PortfolioSettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioHref: string;
};

export function PortfolioSettingsModal({
  open,
  onOpenChange,
  portfolioHref,
}: PortfolioSettingsModalProps) {
  const { updateProject, isUpdating, errorMessage } = useUpdatePortfolio();
  const { data: portfolioData } = useGetPortfolio();
  const [availableToWork, setAvailableToWork] = useState(true);
  const [showProfilePicture, setShowProfilePicture] = useState(true);
  const [showToolsRate, setShowToolsRate] = useState(true);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (!open) return;
    const setting = (
      portfolioData as
        | {
            setting?: {
              availableToWork?: boolean;
              showProfilePicture?: boolean;
              showToolsRate?: boolean;
            };
          }
        | undefined
    )?.setting;
    if (!setting) return;
    setAvailableToWork(setting.availableToWork ?? true);
    setShowProfilePicture(setting.showProfilePicture ?? true);
    setShowToolsRate(setting.showToolsRate ?? true);
    setCopyStatus("idle");
  }, [open, portfolioData]);

  const updateSetting = async (
    key: "availableToWork" | "showProfilePicture" | "showToolsRate",
    nextValue: boolean,
    setValue: (value: boolean) => void,
    previousValue: boolean,
  ) => {
    setValue(nextValue);
    try {
      await updateProject({
        setting: {
          [key]: nextValue,
        },
      });
    } catch {
      setValue(previousValue);
    }
  };

  const handleCopyPortfolioHref = async () => {
    try {
      const valueToCopy =
        typeof window !== "undefined" && portfolioHref.startsWith("/")
          ? `${window.location.origin}${portfolioHref}`
          : portfolioHref;
      await navigator.clipboard.writeText(valueToCopy);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your portfolio settings</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500 shrink-0" aria-hidden />
              <span className="text-sm font-medium">Available to work</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={availableToWork}
              onClick={() =>
                void updateSetting(
                  "availableToWork",
                  !availableToWork,
                  setAvailableToWork,
                  availableToWork,
                )
              }
              disabled={isUpdating}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
                availableToWork ? "bg-primary" : "bg-zinc-200",
                isUpdating && "cursor-not-allowed opacity-70",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform translate-y-0.5",
                  availableToWork ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Show my profile picture</span>
            <button
              type="button"
              role="switch"
              aria-checked={showProfilePicture}
              onClick={() =>
                void updateSetting(
                  "showProfilePicture",
                  !showProfilePicture,
                  setShowProfilePicture,
                  showProfilePicture,
                )
              }
              disabled={isUpdating}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
                showProfilePicture ? "bg-primary" : "bg-zinc-200",
                isUpdating && "cursor-not-allowed opacity-70",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform translate-y-0.5",
                  showProfilePicture ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Show tools Knowledge rate</span>
            <button
              type="button"
              role="switch"
              aria-checked={showToolsRate}
              onClick={() =>
                void updateSetting(
                  "showToolsRate",
                  !showToolsRate,
                  setShowToolsRate,
                  showToolsRate,
                )
              }
              disabled={isUpdating}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
                showToolsRate ? "bg-primary" : "bg-zinc-200",
                isUpdating && "cursor-not-allowed opacity-70",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform translate-y-0.5",
                  showToolsRate ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">View portfolio site</span>
            <a
              href={portfolioHref}
              target="_blank"
              rel="noreferrer"
              className="flex size-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
              aria-label="View portfolio site"
            >
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => void handleCopyPortfolioHref()}
          className="w-full bg-primary text-white hover:bg-primary/90 mt-2"
        >
          {copyStatus === "copied"
            ? "Portfolio link copied"
            : copyStatus === "failed"
              ? "Copy failed"
              : "Copy portfolio link"}
        </Button>
        {errorMessage ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
