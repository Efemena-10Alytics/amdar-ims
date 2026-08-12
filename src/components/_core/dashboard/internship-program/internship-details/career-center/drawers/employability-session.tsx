"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  CV_ACCEPT_ATTRIBUTE,
  CV_HINT_TEXT,
  getCvValidationError,
} from "@/lib/cv-file";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import {
  useBookEmployabilitySession,
  type BookEmployabilitySessionPayload,
} from "@/features/employability-booking/use-book-employability-session";
import { getUserId } from "@/lib/get-user-id";
import {
  resolveUserEmail,
  resolveUserFullName,
  resolveUserPhone,
  unwrapUser,
} from "@/lib/user-profile";
import { useAuthStore } from "@/store/auth-store";
import UserDetails from "./user-details";

const COMPANY_LOCATIONS = [
  "United Kingdom",
  "United States",
  "Canada",
  "Nigeria",
] as const;

/** Same labels the legacy dashboard writes, so admin search keeps matching. */
const ISSUE_OPTIONS = [
  "LinkedIn Optimization",
  "CV Review",
  "Career Clarity",
] as const;

/**
 * Copied from the legacy dashboard — this is not returned by the API, so it
 * has to be kept in sync with `sidebar.jsx` by hand if it ever changes.
 */
const EMPLOYABILITY_CALENDAR_URL =
  "https://calendar.app.google/6m9tQUHHsr5GfYVy6";

const BOOKED_MESSAGE = "Employability session booked.";

type EmployabilitySessionDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBooked?: (message: string) => void;
};

type EmployabilitySessionFormState = {
  roleTitle: string;
  companyName: string;
  companyLocation: string;
  issue: string;
  purposeOfUse: string;
  phoneNumber: string;
  cvFile: File | null;
};

const INITIAL_FORM_STATE: EmployabilitySessionFormState = {
  roleTitle: "",
  companyName: "",
  companyLocation: "",
  issue: "",
  purposeOfUse: "",
  phoneNumber: "",
  cvFile: null,
};

const fieldClassName =
  "h-11 rounded-xl border-[#DCE5E9] bg-[#F6F8FA] px-3 text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none";

const textareaClassName =
  "w-full resize-none rounded-xl border border-[#DCE5E9] bg-[#F6F8FA] px-3 py-3 text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none outline-none focus-visible:border-[#156374]";

function toUserId(value: string | number | null): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

const EmployabilitySessionDrawer = ({
  open,
  onOpenChange,
  onBooked,
}: EmployabilitySessionDrawerProps) => {
  const cvInputId = useId();
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<EmployabilitySessionFormState>(
    INITIAL_FORM_STATE,
  );
  const [cvError, setCvError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const { data: enrollment } = useGetUserEnrollment();
  const authUser = useAuthStore((state) => state.user);
  const { data: userInfo } = useGetUserInfo();
  const { submitEmployabilitySession, isSubmitting, errorMessage, clearError } =
    useBookEmployabilitySession();

  /** Resets the form on every close, whichever control triggered it. */
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setForm(INITIAL_FORM_STATE);
      setCvError("");
      setIsDragOver(false);
      clearError();
      if (cvInputRef.current) cvInputRef.current.value = "";
    }
    onOpenChange(nextOpen);
  };

  const handleCvSelect = (file: File | null) => {
    if (!file) return;

    const validationError = getCvValidationError(file);
    if (validationError) {
      setCvError(validationError);
      return;
    }

    setCvError("");
    setForm((current) => ({ ...current, cvFile: file }));
  };

  // Read from the API objects, never from the display strings in UserDetails —
  // those fall back to placeholder copy before data loads.
  const userRecord = unwrapUser(userInfo ?? authUser);
  const fullName = resolveUserFullName(userRecord);
  const email = resolveUserEmail(userRecord);
  const profilePhone = resolveUserPhone(userRecord);
  const userId = toUserId(getUserId(authUser));

  // The API requires phone_number; ask for one only when the profile lacks it.
  const needsPhoneInput = !profilePhone;
  const phoneNumber = profilePhone || form.phoneNumber.trim();

  // program_id and cohort_id are `required|exists:` on this endpoint.
  const cohortId = enrollment?.cohort?.id ?? enrollment?.cohort_id ?? null;
  const programId = enrollment?.program?.id ?? enrollment?.program_id ?? null;

  const payload: BookEmployabilitySessionPayload | null =
    cohortId != null &&
    programId != null &&
    fullName &&
    email &&
    phoneNumber &&
    form.issue &&
    form.purposeOfUse.trim() &&
    form.roleTitle.trim() &&
    form.companyName.trim() &&
    form.companyLocation &&
    form.cvFile &&
    !cvError
      ? {
          ...(userId != null ? { user_id: userId } : {}),
          program_id: programId,
          cohort_id: cohortId,
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          issue: form.issue,
          purpose_of_use: form.purposeOfUse.trim(),
          job_role: form.roleTitle.trim(),
          company_name: form.companyName.trim(),
          company_location: form.companyLocation,
          cv: form.cvFile,
        }
      : null;

  const canSubmit = Boolean(payload) && !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payload || isSubmitting) return;

    try {
      await submitEmployabilitySession(payload);

      handleOpenChange(false);
      onBooked?.(BOOKED_MESSAGE);

      window.open(EMPLOYABILITY_CALENDAR_URL, "_blank", "noopener,noreferrer");
    } catch {
      // errorMessage is already set by the hook; keep the drawer open.
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
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
              Book employability session
            </SheetTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <UserDetails />

            <p className="mt-6 text-sm font-medium text-[#64748B]">
              Fill in this section
            </p>

            <div className="mt-3 space-y-4">
              {needsPhoneInput ? (
                <div>
                  <label
                    htmlFor="employability-phone"
                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                  >
                    Phone number
                  </label>
                  <Input
                    id="employability-phone"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phoneNumber: event.target.value,
                      }))
                    }
                    placeholder="Enter your phone number"
                    className={fieldClassName}
                  />
                  <p className="mt-1.5 text-xs text-[#64748B]">
                    We don&apos;t have a phone number on your profile yet.
                  </p>
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="employability-role-title"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Role title
                </label>
                <Input
                  id="employability-role-title"
                  value={form.roleTitle}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      roleTitle: event.target.value,
                    }))
                  }
                  placeholder="Enter role title"
                  className={fieldClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="employability-company-name"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Company name
                </label>
                <Input
                  id="employability-company-name"
                  value={form.companyName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      companyName: event.target.value,
                    }))
                  }
                  placeholder="Enter company name"
                  className={fieldClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#092A31]">
                  Company location (Country)
                </label>
                <Select
                  value={form.companyLocation}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      companyLocation: value,
                    }))
                  }
                >
                  <SelectTrigger
                    className={cn(
                      fieldClassName,
                      "w-full data-placeholder:text-[#94A3B8]",
                    )}
                  >
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#092A31]">
                  What do you need help with?
                </label>
                <Select
                  value={form.issue}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, issue: value }))
                  }
                >
                  <SelectTrigger
                    className={cn(
                      fieldClassName,
                      "w-full data-placeholder:text-[#94A3B8]",
                    )}
                  >
                    <SelectValue placeholder="Select an issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {ISSUE_OPTIONS.map((issue) => (
                      <SelectItem key={issue} value={issue}>
                        {issue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="employability-purpose"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Purpose of the session
                </label>
                <textarea
                  id="employability-purpose"
                  value={form.purposeOfUse}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      purposeOfUse: event.target.value,
                    }))
                  }
                  placeholder="Tell us what you'd like to get out of this session"
                  rows={4}
                  className={textareaClassName}
                />
              </div>

              <div>
                <label
                  htmlFor={cvInputId}
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Upload your CV
                </label>
                <input
                  ref={cvInputRef}
                  id={cvInputId}
                  type="file"
                  accept={CV_ACCEPT_ATTRIBUTE}
                  className="sr-only"
                  onChange={(event) =>
                    handleCvSelect(event.target.files?.[0] ?? null)
                  }
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => cvInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      cvInputRef.current?.click();
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragOver(false);
                    handleCvSelect(event.dataTransfer.files?.[0] ?? null);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#C5D6DC] bg-[#E8F4F8] px-4 py-8 transition-colors",
                    isDragOver && "border-[#156374] bg-[#D4EBF1]",
                    cvError && "border-red-300 bg-red-50/50",
                  )}
                >
                  <Upload className="size-8 text-[#1A6B8A]" strokeWidth={1.75} />
                  <p className="text-sm font-semibold text-[#1A6B8A]">
                    {form.cvFile ? form.cvFile.name : "Click to upload CV"}
                  </p>
                  <p className="text-xs text-[#64748B]">{CV_HINT_TEXT}</p>
                </div>
                {cvError ? (
                  <p className="mt-1.5 text-xs text-red-600">{cvError}</p>
                ) : null}
              </div>
            </div>

            {errorMessage ? (
              <p className="mt-3 text-xs font-medium text-[#C0392B]">
                {errorMessage}
              </p>
            ) : null}
          </div>

          <div className="border-t border-[#E2EBEF] px-6 py-4">
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              aria-busy={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#134E5E] text-base font-semibold text-white hover:bg-[#0E6174] disabled:bg-[#9DB8C0]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Booking…
                </>
              ) : (
                "Book session"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EmployabilitySessionDrawer;
