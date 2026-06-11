"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetInternshipPrograms } from "@/features/internship/use-get-all-internship-programs";
import { useCountries } from "@/features/portfolio/use-countries";
import type { InternshipProgram } from "@/types/internship-program";
import { cn } from "@/lib/utils";

const STORAGE_KEY_PREFIX = "amdari-blog-brochure-dismissed";
const OPEN_DELAY_MS = 30_000;

function getStorageKey(blogSlug?: string) {
  return `${STORAGE_KEY_PREFIX}:${blogSlug?.trim() || "default"}`;
}

const inputBase = cn(
  "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 text-sm text-[#092A31] placeholder:text-[#94A3B8]",
  "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0",
);

const selectDropdownClassName = "z-[1001]";

const selectItemClassName = "py-2";

type BlogReaderInfoDialogProps = {
  blogSlug?: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  programId: string;
  countryCode: string;
  sendToEmail: boolean;
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  programId: "",
  countryCode: "",
  sendToEmail: true,
};

function getProgramsList(data: unknown): InternshipProgram[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: InternshipProgram[] }).data;
  }
  return [];
}

export function BlogReaderInfoDialog({ blogSlug }: BlogReaderInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: programsData, isLoading: programsLoading } =
    useGetInternshipPrograms();
  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  const programs = useMemo(() => getProgramsList(programsData), [programsData]);

  useEffect(() => {
    setOpen(false);
    setSubmitted(false);
    setForm(initialFormState);

    if (typeof window === "undefined") return;

    const storageKey = getStorageKey(blogSlug);
    if (sessionStorage.getItem(storageKey) === "1") return;

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [blogSlug]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen((prevOpen) => {
      if (!nextOpen && prevOpen && typeof window !== "undefined") {
        sessionStorage.setItem(getStorageKey(blogSlug), "1");
      }
      return nextOpen;
    });
  };

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.programId &&
    form.countryCode;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const selectedProgram = programs.find(
        (program) => String(program.id) === form.programId,
      );
      const selectedCountry = countries.find((c) => c.code === form.countryCode);

      // TODO: wire to brochure download / lead capture API when available
      void {
        blogSlug,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        programId: form.programId,
        programTitle: selectedProgram?.title,
        countryCode: form.countryCode,
        countryName: selectedCountry?.name,
        sendToEmail: form.sendToEmail,
      };

      setSubmitted(true);
      sessionStorage.setItem(getStorageKey(blogSlug), "1");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} >
      <DialogContent
        className="z-[1000] max-h-[calc(100vh-2rem)] overflow-y-auto border-0 bg-white p-6 sm:max-w-[28rem] sm:p-8"
        overlayClassName="z-[999] bg-[#092A31]/45 backdrop-blur-[1px]"
      >
        {submitted ? (
          <div className="space-y-3 py-2 text-center">
            <DialogTitle className="text-xl font-semibold text-[#092A31]">
              Thank you!
            </DialogTitle>
            <DialogDescription className="text-sm text-[#64748B]">
              {form.sendToEmail
                ? "Your brochure is on its way to your inbox."
                : "Your download request has been received."}
            </DialogDescription>
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="mt-2 h-11 w-full rounded-lg bg-primary text-white hover:bg-primary/90"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-1 pr-6">
              <DialogTitle className="text-xl font-semibold leading-snug text-[#092A31]">
                Enjoying this blog?
              </DialogTitle>
              <p className="text-lg font-semibold text-[#092A31]">
                We have a brochure you would love
              </p>
              <DialogDescription className="text-sm text-[#64748B]">
                Fill in your details below to get the brochure in your mail
              </DialogDescription>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="blog-brochure-first-name"
                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                  >
                    First name
                  </label>
                  <input
                    id="blog-brochure-first-name"
                    type="text"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className={inputBase}
                  />
                </div>
                <div>
                  <label
                    htmlFor="blog-brochure-last-name"
                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                  >
                    Last name
                  </label>
                  <input
                    id="blog-brochure-last-name"
                    type="text"
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="blog-brochure-email"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Email
                </label>
                <input
                  id="blog-brochure-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={inputBase}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#092A31]">
                  Program of Interest
                </label>
                <Select
                  value={form.programId || undefined}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, programId: value }))
                  }
                  disabled={programsLoading}
                >
                  <SelectTrigger className={cn(inputBase, "h-auto")}>
                    <SelectValue
                      placeholder={
                        programsLoading
                          ? "Loading programs…"
                          : "Select your program of interest"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className={selectDropdownClassName}>
                    {programs.map((program) => (
                      <SelectItem
                        key={program.id}
                        value={String(program.id)}
                        className={selectItemClassName}
                      >
                        {program.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#092A31]">
                  Location (Country)
                </label>
                <Select
                  value={form.countryCode || undefined}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, countryCode: value }))
                  }
                  disabled={countriesLoading}
                >
                  <SelectTrigger className={cn(inputBase, "h-auto")}>
                    <SelectValue
                      placeholder={
                        countriesLoading
                          ? "Loading…"
                          : "Select your location"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className={selectDropdownClassName}>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.code}
                        value={country.code}
                        className={selectItemClassName}
                      >
                        <span className="flex min-w-0 items-start gap-2">
                          <Image
                            src={country.flag}
                            alt=""
                            width={20}
                            height={14}
                            className="mt-0.5 shrink-0 rounded object-cover"
                            unoptimized
                          />
                          <span className="whitespace-normal break-words">
                            {country.name}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="h-12 w-full rounded-lg bg-primary text-base font-medium text-white hover:bg-primary/90 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting…" : "Download"}
              </Button>

              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  checked={form.sendToEmail}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      sendToEmail: checked === true,
                    }))
                  }
                  className="data-[state=checked]:border-[#3A8E53] data-[state=checked]:bg-[#3A8E53]"
                />
                <span className="text-sm text-[#64748B]">
                  Send brochure to my email
                </span>
              </label>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default BlogReaderInfoDialog;
