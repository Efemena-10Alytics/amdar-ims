"use client";

import { useEffect, useRef, useState } from "react";
import SpeakToOurExpertPanel from "@/components/_core/landing-pages/home/hero-two/speak-to-our-expert";
import { cn } from "@/lib/utils";
import { SpeakToExpertWidgetSvg } from "../home/svg";

const HERO_SECTION_ID = "home-hero-section";
const WIDGET_ICON_SIZE = 116;

export function SpeakToExpertWidget() {
  const [open, setOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed bottom-6 right-4 z-50 transition-all duration-300 sm:right-6",
        showWidget
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
      aria-hidden={!showWidget}
    >
      {open ? (
        <SpeakToOurExpertPanel onActionClick={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          aria-label="Speak to an expert"
          aria-expanded={false}
          onClick={() => setOpen(true)}
          tabIndex={showWidget ? 0 : -1}
          className="block cursor-pointer"
          style={{ width: WIDGET_ICON_SIZE, height: WIDGET_ICON_SIZE }}
        >
          <SpeakToExpertWidgetSvg />
        </button>
      )}
    </div>
  );
}

export default SpeakToExpertWidget;
