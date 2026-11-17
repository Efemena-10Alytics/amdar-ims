"use client";

import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CONTROL =
  "h-12 w-full rounded-xl border border-[#E6EDEF] bg-white px-4 text-sm text-[#092A31] outline-none placeholder:text-[#94A3B8] focus:border-[#156374]";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-[#092A31]">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-[#94A3B8]">{hint}</p>}
    </div>
  );
}

export function TextInput({
  id,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={CONTROL}
    />
  );
}

export function SelectInput({
  id,
  value,
  options,
  onChange,
  placeholder = "Select",
}: {
  id: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(CONTROL, "appearance-none pr-10", value ? "" : "text-[#94A3B8]")}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="text-[#092A31]">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#092A31]"
        aria-hidden
      />
    </div>
  );
}

export function RadioCards({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {options.map((option) => {
        const checked = option === value;
        return (
          <label
            key={option}
            className={cn(
              "flex h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm transition-colors",
              checked
                ? "border-[#156374] bg-[#F3F8F9] text-[#092A31]"
                : "border-[#E6EDEF] bg-white text-[#475569]",
            )}
          >
            <input
              type="radio"
              name={name}
              checked={checked}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "flex size-4.5 shrink-0 items-center justify-center rounded-full border",
                checked ? "border-[#156374]" : "border-[#CBD5E1]",
              )}
            >
              {checked && <span className="size-2.5 rounded-full bg-[#156374]" />}
            </span>
            {option}
          </label>
        );
      })}
    </div>
  );
}

export function CheckBox({
  label,
  checked,
  onChange,
  boxed = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Renders the tinted row used in "What should candidates submit?". */
  boxed?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 text-sm text-[#092A31]",
        boxed && "h-12 rounded-xl bg-[#F4F8F9] px-4",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "flex size-4.5 shrink-0 items-center justify-center rounded transition-colors",
          checked ? "bg-[#156374] text-white" : "border border-[#CBD5E1] bg-white",
        )}
      >
        {checked && <Check className="size-3" strokeWidth={3.5} />}
      </span>
      {label}
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors",
        checked ? "bg-[#156374]" : "bg-[#D8E1E3]",
      )}
    >
      <span
        className={cn(
          "size-5 rounded-full bg-white transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

/** Static formatting bar above the description editor. */
export function EditorToolbar() {
  return (
    <div className="flex items-center gap-1 border-b border-[#E6EDEF] px-3 py-2 text-[#475569]">
      <button type="button" className="flex items-center gap-1 rounded px-2 py-1 text-sm hover:bg-[#F1F5F6]">
        Normal text
        <ChevronDown className="size-3" aria-hidden />
      </button>
      <span className="mx-1 h-5 w-px bg-[#E6EDEF]" aria-hidden />
      <button type="button" className="size-8 rounded font-bold hover:bg-[#F1F5F6]">B</button>
      <button type="button" className="size-8 rounded italic hover:bg-[#F1F5F6]">I</button>
      <button type="button" className="size-8 rounded underline hover:bg-[#F1F5F6]">U</button>
      <span className="mx-1 h-5 w-px bg-[#E6EDEF]" aria-hidden />
      <button type="button" className="size-8 rounded hover:bg-[#F1F5F6]" aria-label="Bulleted list">
        •≡
      </button>
      <button type="button" className="size-8 rounded text-sm hover:bg-[#F1F5F6]" aria-label="Numbered list">
        1.≡
      </button>
    </div>
  );
}
