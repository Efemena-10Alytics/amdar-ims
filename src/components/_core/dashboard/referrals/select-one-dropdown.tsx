"use client";

import { useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type SelectOneOption = {
  value: string;
  label: string;
  /** Rendered before the label, e.g. a country flag. */
  icon?: ReactNode;
};

/**
 * The "Select one" dropdown from the designs: a titled panel whose rows carry a
 * square tick on the right rather than the usual inline check.
 */
export function SelectOneDropdown({
  title,
  options,
  value,
  placeholder,
  onChange,
  triggerClassName = "",
}: {
  title: string;
  options: SelectOneOption[];
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={title}
          className={`flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-xl bg-[#F6F8FA] px-3 font-sora text-sm ${triggerClassName}`}
        >
          <span className="flex min-w-0 items-center gap-2">
            {selected?.icon}
            <span className={`truncate ${selected ? "text-[#092A31]" : "text-[#94A3B8]"}`}>
              {selected?.label ?? placeholder}
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-[#64748B]" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-64 border-[#E2EBEF] p-4"
      >
        <p className="font-sora text-base font-semibold text-[#092A31]">{title}</p>
        <p className="font-sora text-sm text-[#94A3B8]">Select one</p>

        <div className="mt-3 max-h-72 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 py-3 text-left"
              >
                <span className="flex min-w-0 items-center gap-2">
                  {option.icon}
                  <span className="truncate font-sora text-sm text-[#092A31]">
                    {option.label}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? "bg-[#C7F5D8] text-[#1F7A4A]"
                      : "border border-[#DCE5E9] bg-white"
                  }`}
                >
                  {isSelected && <Check className="size-5" strokeWidth={2.5} />}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
