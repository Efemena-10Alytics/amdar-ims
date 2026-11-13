"use client";

import { useRef, useState, type ReactNode } from "react";
import { ChevronDown, UploadCloud } from "lucide-react";

const CONTROL_CLASS =
  "h-12 w-full rounded-lg border border-transparent bg-[#F7F9FA] px-4 font-sora text-sm text-[#092A31] outline-none placeholder:text-[#94A3B8] focus:border-[#156374]";

export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-sora text-sm text-[#092A31]">
      {children}
    </label>
  );
}

export function TextField({
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={CONTROL_CLASS}
      />
    </div>
  );
}

export function SelectField({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
}: {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${CONTROL_CLASS} appearance-none pr-10 ${value ? "" : "text-[#94A3B8]"}`}
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
    </div>
  );
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        id={id}
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-lg border border-transparent bg-[#F7F9FA] px-4 py-3 font-sora text-sm text-[#092A31] outline-none placeholder:text-[#94A3B8] focus:border-[#156374]"
      />
    </div>
  );
}

/** Phone row with the fixed country prefix the design shows. */
export function PhoneField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex items-stretch gap-2">
        <span className="flex h-12 shrink-0 items-center gap-1.5 rounded-lg bg-[#F7F9FA] px-3 font-sora text-sm text-[#092A31]">
          +234
          <span aria-hidden>🇳🇬</span>
        </span>
        <input
          id={id}
          type="tel"
          value={value}
          placeholder="Your phone number"
          onChange={(event) => onChange(event.target.value)}
          className={CONTROL_CLASS}
        />
      </div>
    </div>
  );
}

export function UploadField({
  id,
  label,
  cta,
  hint,
  accept,
  fileName,
  onFile,
}: {
  id: string;
  label: string;
  cta: string;
  hint: string;
  accept: string;
  fileName: string;
  onFile: (name: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);

  return (
    <div className="min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsOver(false);
          const dropped = event.dataTransfer.files?.[0];
          if (dropped) onFile(dropped.name);
        }}
        className={`flex h-30 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed bg-[#F1F5F6] transition-colors ${
          isOver ? "border-[#156374] bg-[#E6EFF1]" : "border-[#BFD3D8]"
        }`}
      >
        <span className="flex items-center gap-2 font-sora text-base font-medium text-[#156374]">
          <UploadCloud className="size-5" aria-hidden />
          {fileName || cta}
        </span>
        <span className="font-sora text-sm text-[#94A3B8]">{hint}</span>
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const picked = event.target.files?.[0];
          if (picked) onFile(picked.name);
        }}
      />
    </div>
  );
}
