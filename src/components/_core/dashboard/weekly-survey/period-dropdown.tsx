"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRightIcon, CurrentPeriodIcon } from "./icons";

export interface PeriodOption {
  label: string;
  value: string;
  submenu?: { label: string; value: string }[];
}

interface PeriodDropdownProps {
  options: PeriodOption[];
  selected: string;
  onChange: (value: string) => void;
  /** "pill" = small trigger used inside stat cards. "button" = toolbar trigger with icon + checkmarks. */
  variant?: "pill" | "button";
  triggerLabel?: string;
}

const PeriodDropdown = ({
  options,
  selected,
  onChange,
  variant = "pill",
  triggerLabel,
}: PeriodDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === selected);
  const label = triggerLabel ?? selectedOption?.label ?? options[0]?.label ?? "";

  const handleSelect = (value: string) => {
    onChange(value);
    setOpen(false);
    setActiveSubmenu(null);
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {variant === "pill" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-5 items-center gap-1 rounded-[24px] bg-[#E8EFF1] py-1 pl-1.5 pr-1.5 font-sora text-sm font-normal text-[#092A31]"
        >
          {label}
          <ChevronRightIcon className="rotate-90" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-[34px] items-center gap-1.5 rounded-lg bg-[#E8EFF1] px-3 font-sora text-sm text-[#156374]"
        >
          <CurrentPeriodIcon />
          {label}
          <ChevronRightIcon className="rotate-90" />
        </button>
      )}

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 flex">
          <div className="w-[172px] rounded-xl border border-[#E6EBF0] bg-white p-2 shadow-[0px_2px_15px_0px_#1563741A]">
            <p className="px-2 py-1.5 font-sora text-sm font-semibold text-[#092A31]">Period</p>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onMouseEnter={() => opt.submenu && setActiveSubmenu(opt.value)}
                onClick={() => (opt.submenu ? setActiveSubmenu(opt.value) : handleSelect(opt.value))}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left font-sora text-sm text-[#5C6777] hover:bg-[#F8FAFC]"
              >
                <span className={opt.value === selected ? "text-[#092A31]" : ""}>{opt.label}</span>
                <span className="flex items-center gap-1">
                  {opt.value === selected && !opt.submenu && (
                    <span className="text-[#156374]">✓</span>
                  )}
                  {opt.submenu && <ChevronRightIcon />}
                </span>
              </button>
            ))}
          </div>

          {activeSubmenu &&
            (() => {
              const submenuParent = options.find((o) => o.value === activeSubmenu);
              if (!submenuParent?.submenu) return null;
              return (
                <div className="ml-2 w-[172px] rounded-xl border border-[#E6EBF0] bg-white p-2 shadow-[0px_2px_15px_0px_#1563741A]">
                  <p className="px-2 py-1.5 font-sora text-sm font-semibold text-[#092A31]">
                    {submenuParent.label} in cohort
                  </p>
                  {submenuParent.submenu.map((sub) => (
                    <button
                      key={sub.value}
                      type="button"
                      onClick={() => handleSelect(sub.value)}
                      className="block w-full rounded-lg px-2 py-2 text-left font-sora text-sm text-[#5C6777] hover:bg-[#F8FAFC]"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              );
            })()}
        </div>
      )}
    </div>
  );
};

export default PeriodDropdown;