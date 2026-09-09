"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTreasureImageSrc } from "./treasure-images";

export type TreasureHuntModalVariant = "decoy" | "win";

type TreasureHuntCongratulationsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: TreasureHuntModalVariant;
  treasureName?: string | null;
};

export function TreasureHuntCongratulationsModal({
  open,
  onOpenChange,
  variant = "decoy",
  treasureName,
}: TreasureHuntCongratulationsModalProps) {
  const confettiFired = useRef(false);
  const isWin = variant === "win";
  const treasureImageSrc = isWin ? getTreasureImageSrc(treasureName) : null;

  useEffect(() => {
    if (!open || !isWin) {
      if (!open) confettiFired.current = false;
      return;
    }
    if (confettiFired.current) return;
    confettiFired.current = true;

    const colors = ["#0F4652", "#156374", "#FFE082", "#22c55e", "#C8DDE3"];
    const fire = (origin: { x: number; y?: number }, angle: number) => {
      confetti({ particleCount: 60, spread: 70, origin, angle, colors });
    };

    fire({ x: 0.2, y: 0.55 }, 60);
    fire({ x: 0.8, y: 0.55 }, 120);
    const t = setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { x: 0.5, y: 0.55 },
        colors,
      });
    }, 180);

    return () => clearTimeout(t);
  }, [open, isWin]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-md text-center", !isWin && "border-[#F9A8D4]")}
        style={!isWin ? { backgroundColor: "#FCE7F3" } : undefined}
      >
        <DialogHeader className="items-center sm:text-center">
          {isWin ? (
            treasureImageSrc ? (
              <div className="mx-auto mb-2 flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl bg-[#F8FAFC] p-2">
                <img
                  src={treasureImageSrc}
                  alt={treasureName ?? "Won treasure"}
                  width={160}
                  height={160}
                  className="h-40 w-40 object-contain"
                />
              </div>
            ) : (
              <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-[#0F4652]/10">
                <Gift className="size-7 text-[#0F4652]" />
              </div>
            )
          ) : null}
          <DialogTitle className="font-clash-display text-2xl font-semibold text-[#092A31]">
            {isWin ? "You've won!" : "Oops! no treasure here,"}
          </DialogTitle>
          {isWin && treasureName ? (
            <p className="font-clash-display text-3xl font-bold text-[#092A31] sm:text-4xl">
              {treasureName}
            </p>
          ) : null}
          <DialogDescription className="text-sm text-[#64748B] sm:text-base">
            {isWin
              ? "Congratulations — you found a treasure. We'll be in touch with next steps."
              : "Please try again"}
          </DialogDescription>
        </DialogHeader>
        <Button
          className="mt-2 h-11 w-full rounded-full bg-primary text-white hover:bg-primary/90"
          onClick={() => onOpenChange(false)}
        >
          {isWin ? "Continue" : "Try again"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
