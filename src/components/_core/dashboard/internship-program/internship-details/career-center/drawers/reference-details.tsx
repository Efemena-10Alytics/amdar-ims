"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Copy, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import UserDetails from "./user-details";

const LETTER_REASONS = [
  { value: "job-offer", label: "Job Offer" },
  { value: "studies", label: "Studies" },
  { value: "visa", label: "VISA" },
] as const;

const REFERENCE_DETAIL_ITEMS = [
  { label: "Referee", value: "Efemena Ikpro" },
  { label: "Email", value: "efemana@amdari.io" },
  { label: "Phone number", value: "+44 7414613215" },
  {
    label: "Address",
    value: "Amdari Limited UK 128, City Road, London, EC1V 2NX, UNITED KINGDOM",
  },
] as const;

type ReferenceDetailsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ReferenceDetailsFormState = {
  reason: string;
  jobRole: string;
  companyName: string;
  companyWebsite: string;
  additionalInfo: string;
};

const INITIAL_FORM_STATE: ReferenceDetailsFormState = {
  reason: "",
  jobRole: "",
  companyName: "",
  companyWebsite: "",
  additionalInfo: "",
};

const fieldClassName =
  "rounded-xl border-[#DCE5E9] bg-[#F6F8FA] text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none";

function ReferenceDetailsBlock() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = REFERENCE_DETAIL_ITEMS.map(
      (item) => `${item.label}: ${item.value}`,
    ).join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-6">
      <p className="text-base font-semibold text-[#475467]">Reference details</p>

      <div className="relative mt-3 rounded-xl border border-[#D6C8B4] bg-[#F7F1E8] p-4">
        <button
          type="button"
          onClick={() => {
            void handleCopy();
          }}
          aria-label={copied ? "Copied" : "Copy reference details"}
          className="absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-md text-[#1A6B8A] transition hover:bg-[#EFE7DB]"
        >
          <Copy className="size-4" aria-hidden />
        </button>

        <div className="grid grid-cols-1 gap-4 pr-14 sm:grid-cols-2">
          {REFERENCE_DETAIL_ITEMS.map((item) => (
            <div key={item.label} className="min-w-0">
              <p className="text-xs font-medium text-[#94A3B8]">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#334155]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ReferenceDetailsDrawer = ({
  open,
  onOpenChange,
}: ReferenceDetailsDrawerProps) => {
  const [form, setForm] = useState<ReferenceDetailsFormState>(INITIAL_FORM_STATE);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM_STATE);
      setShowDetails(false);
    }
  }, [open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowDetails(true);
  };

  const canSubmit =
    Boolean(form.reason.trim()) &&
    Boolean(form.jobRole.trim()) &&
    Boolean(form.companyName.trim());

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full border-l-0 p-0 sm:max-w-xl"
      >
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <div className="border-b border-[#E2EBEF] px-6 pt-5 pb-4">
            <SheetClose className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#F16B6B]">
              <X className="size-3.5" />
              Close
            </SheetClose>
            <SheetTitle className="mt-1 text-xl font-semibold text-[#173740] sm:text-2xl">
              Reference details
            </SheetTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <UserDetails />

            {showDetails ? <ReferenceDetailsBlock /> : null}

            <p className="mt-6 text-sm font-medium text-[#64748B]">
              Fill in this section
            </p>

            <div className="mt-3 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#092A31]">
                  Reason for letter
                </label>
                <Select
                  value={form.reason}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, reason: value }))
                  }
                >
                  <SelectTrigger
                    className={cn(
                      fieldClassName,
                      "h-11 w-full px-3 data-placeholder:text-[#94A3B8]",
                    )}
                  >
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="px-2 py-1.5 text-xs font-medium text-[#64748B]">
                        Why are you requesting
                      </SelectLabel>
                      {LETTER_REASONS.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="reference-details-job-role"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Job role
                </label>
                <Input
                  id="reference-details-job-role"
                  value={form.jobRole}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      jobRole: event.target.value,
                    }))
                  }
                  placeholder="Enter job role"
                  className={cn(fieldClassName, "h-11 px-3")}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reference-details-company-name"
                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                  >
                    Company name
                  </label>
                  <Input
                    id="reference-details-company-name"
                    value={form.companyName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        companyName: event.target.value,
                      }))
                    }
                    placeholder="Enter company name"
                    className={cn(fieldClassName, "h-11 px-3")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="reference-details-company-website"
                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                  >
                    Company website
                  </label>
                  <div className="relative">
                    <Input
                      id="reference-details-company-website"
                      value={form.companyWebsite}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          companyWebsite: event.target.value,
                        }))
                      }
                      placeholder="Paste link"
                      className={cn(fieldClassName, "h-11 pr-10 pl-3")}
                    />
                    <Link2
                      className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#94A3B8]"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reference-details-additional-info"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Additional info
                </label>
                <textarea
                  id="reference-details-additional-info"
                  value={form.additionalInfo}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      additionalInfo: event.target.value,
                    }))
                  }
                  placeholder="Enter additional info"
                  rows={4}
                  className={cn(
                    fieldClassName,
                    "w-full resize-none px-3 py-3 outline-none focus-visible:border-[#156374]",
                  )}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#E2EBEF] px-6 py-4">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-12 w-full rounded-full bg-[#134E5E] text-base font-semibold text-white hover:bg-[#0E6174] disabled:bg-[#9DB8C0]"
            >
              View details
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ReferenceDetailsDrawer;
