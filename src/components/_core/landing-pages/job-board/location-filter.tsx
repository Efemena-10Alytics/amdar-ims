"use client";

import { useId, useMemo, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * The location filter, as a searchable dropdown rather than a plain Select:
 * the list runs to every country, which is far too long to scroll through.
 * Matching is a case-insensitive substring over the option label, and the
 * option order is preserved, so "Remote" stays pinned at the top.
 */
export function LocationFilter({
  value,
  options,
  onChange,
  className,
  placeholder = "Location",
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  /** Applied to the trigger, so it can match the filters beside it. */
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) => option.toLowerCase().includes(needle));
  }, [options, query]);

  const select = (option: string) => {
    onChange(option);
    setQuery("");
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    // Start from the full list next time it opens.
    if (!next) setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={placeholder}
          className={cn("flex items-center justify-between gap-2", className)}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDownIcon className="h-5 w-5 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-64 p-0"
        // Let the search box take focus instead of the first option.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const content = event.currentTarget as HTMLElement;
          content.querySelector<HTMLInputElement>("input")?.focus();
          selectedRef.current?.scrollIntoView({ block: "nearest" });
        }}
      >
        <div className="relative border-b border-[#E2EBEF]">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]"
            aria-hidden
          />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              // Enter takes the top match, so a full name needn't be typed.
              if (event.key === "Enter" && filtered.length > 0) {
                event.preventDefault();
                select(filtered[0]);
              }
            }}
            placeholder="Search location"
            aria-label="Search location"
            className="h-10 w-full bg-transparent pr-3 pl-9 font-sora text-sm text-[#0C3640] outline-none placeholder:text-[#94A3B8]"
          />
        </div>

        <div id={listboxId} role="listbox" className="max-h-64 overflow-y-auto p-1">
          {filtered.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                ref={isSelected ? selectedRef : undefined}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => select(option)}
                className="relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-left font-sora text-sm text-[#0C3640] outline-none hover:bg-accent focus-visible:bg-accent"
              >
                {isSelected && (
                  <CheckIcon className="absolute left-2 size-3.5" aria-hidden />
                )}
                <span className="truncate">{option}</span>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center font-sora text-sm text-[#64748B]">
              No location matches “{query.trim()}”.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
