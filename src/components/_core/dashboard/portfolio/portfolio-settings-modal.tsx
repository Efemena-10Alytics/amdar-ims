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
};

export function PortfolioSettingsModal({
  open,
  onOpenChange,
}: PortfolioSettingsModalProps) {
  const { updateProject, isUpdating, errorMessage } = useUpdatePortfolio();
  const { data: portfolioData } = useGetPortfolio();
  const [availableToWork, setAvailableToWork] = useState(true);
  const [showProfilePicture, setShowProfilePicture] = useState(true);
  const [showToolsRate, setShowToolsRate] = useState(true);

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
  }, [open, portfolioData]);

  const handleSaveSettings = async () => {
    try {
      const result = await updateProject({
        setting: {
          availableToWork,
          showProfilePicture,
          showToolsRate,
        },
      });
      if (result) onOpenChange(false);
    } catch {
      // handled by hook errorMessage
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
              onClick={() => setAvailableToWork((v) => !v)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
                availableToWork ? "bg-primary" : "bg-zinc-200"
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
              onClick={() => setShowProfilePicture((v) => !v)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
                showProfilePicture ? "bg-primary" : "bg-zinc-200"
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
              onClick={() => setShowToolsRate((v) => !v)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
                showToolsRate ? "bg-primary" : "bg-zinc-200"
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
              href="#"
              className="flex size-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
              aria-label="View portfolio site"
            >
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
        <Button
          type="button"
          onClick={handleSaveSettings}
          disabled={isUpdating}
          className="w-full bg-primary text-white hover:bg-primary/90 mt-2"
        >
          {isUpdating ? "Saving..." : "Save settings"}
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
