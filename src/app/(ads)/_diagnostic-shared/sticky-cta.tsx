"use client";

import React, { useEffect, useState } from "react";

export function useStickyCtaVisibility(
  topRef: React.RefObject<HTMLElement | null>,
  endRef: React.RefObject<HTMLElement | null>,
): boolean {
  const [showSticky, setShowSticky] = useState(
    () =>
      typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const topEl = topRef.current;
    const endEl = endRef.current;
    if (!topEl || !endEl || !("IntersectionObserver" in window)) return;

    const vis = { top: true, end: false };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === topEl) vis.top = entry.isIntersecting;
          if (entry.target === endEl) vis.end = entry.isIntersecting;
        }
        setShowSticky(!vis.top && !vis.end);
      },
      { threshold: 0.15 },
    );

    observer.observe(topEl);
    observer.observe(endEl);
    return () => observer.disconnect();
  }, [endRef, topRef]);

  return showSticky;
}

export function StickyCtaBar({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(0.8rem+env(safe-area-inset-bottom,0px))] pt-5 transition-transform duration-300 ${
        visible
          ? "pointer-events-auto translate-y-0"
          : "pointer-events-none translate-y-[130%]"
      }`}
      style={{
        background:
          "linear-gradient(180deg, transparent, rgba(9, 42, 49, 0.96) 40%)",
      }}
    >
      <div className="mx-auto max-w-[728px]">{children}</div>
    </div>
  );
}
