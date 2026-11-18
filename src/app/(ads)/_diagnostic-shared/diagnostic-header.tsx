"use client";

import React from "react";
import Image from "next/image";

interface DiagnosticHeaderProps {
  subtag: string;
  rightSlot: React.ReactNode;
}

export function DiagnosticHeader({ subtag, rightSlot }: DiagnosticHeaderProps) {
  return (
    <header className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/12 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href="#top"
          aria-label="Amdari"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex items-center"
        >
          <Image
            src="/logo-white.svg"
            alt="Amdari"
            width={130}
            height={26}
            className="block h-[26px] w-auto max-w-[180px] object-contain"
            priority
          />
        </a>
        <span className="rounded-full border border-[#FFE082]/35 bg-[#FFE082]/10 px-3 py-1 text-[0.78rem] font-semibold text-[#FFE082]">
          {subtag}
        </span>
      </div>
      {rightSlot}
    </header>
  );
}
