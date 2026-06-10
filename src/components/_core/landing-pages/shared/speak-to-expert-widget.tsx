"use client";

import { useEffect, useState } from "react";
import { SpeakToExpertPopover } from "@/components/_core/landing-pages/home/hero-two/speak-to-our-expert";
import { cn } from "@/lib/utils";
import { SpeakToExpertWidgetSvg } from "../home/svg";

const HERO_SECTION_ID = "home-hero-section";

export function SpeakToExpertWidget() {
  const [open, setOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(HERO_SECTION_ID);
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowWidget(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showWidget) setOpen(false);
  }, [showWidget]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-4 z-50 transition-all duration-300 sm:right-6",
        showWidget
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
      aria-hidden={!showWidget}
    >
      <SpeakToExpertPopover
        side="top"
        align="end"
        sideOffset={16}
        open={open}
        onOpenChange={setOpen}
      >
        <button
          type="button"
          aria-label="Speak to an expert"
          tabIndex={showWidget ? 0 : -1}
          className="cursor-pointer"
        >
          <SpeakToExpertWidgetSvg />
        </button>
      </SpeakToExpertPopover>
    </div>
  );
}

export default SpeakToExpertWidget;
