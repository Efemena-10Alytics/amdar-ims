"use client";

import { useState, type FormEvent } from "react";
import { Link2, Loader2, X } from "lucide-react";
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
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import {
  useRequestReferenceLetter,
  type RequestReferenceLetterPayload,
} from "@/features/reference-request/use-request-reference-letter";
import {
  resolveUserEmail,
  resolveUserFullName,
  resolveUserPhone,
  unwrapUser,
} from "@/lib/user-profile";
import { useAuthStore } from "@/store/auth-store";
import UserDetails from "./user-details";

const LETTER_REASONS = [
  { value: "job-offer", label: "Job Offer" },
  { value: "studies", label: "Studies" },
  { value: "visa", label: "VISA" },
] as const;

type ReferenceLetterDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequested?: (message: string) => void;
};

type ReferenceLetterFormState = {
  reason: string;
  jobRole: string;
  companyName: string;
  companyWebsite: string;
  additionalInfo: string;
  phoneNumber: string;
};

const INITIAL_FORM_STATE: ReferenceLetterFormState = {
  reason: "",
  jobRole: "",
  companyName: "",
  companyWebsite: "",
  additionalInfo: "",
  phoneNumber: "",
};

const REQUESTED_MESSAGE = "Reference letter request submitted.";

const fieldClassName =
  "rounded-xl border-[#DCE5E9] bg-[#F6F8FA] text-sm text-[#092A31] placeholder:text-[#94A3B8] shadow-none";

const ReferenceLetterDrawer = ({
  open,
  onOpenChange,
  onRequested,
}: ReferenceLetterDrawerProps) => {
  const [form, setForm] = useState<ReferenceLetterFormState>(INITIAL_FORM_STATE);
  const { data: enrollment } = useGetUserEnrollment();
  const authUser = useAuthStore((state) => state.user);
  const { data: userInfo } = useGetUserInfo();
  const { submitReferenceLetter, isSubmitting, errorMessage, clearError } =
    useRequestReferenceLetter();

  /** Resets the form on every close, whichever control triggered it. */
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setForm(INITIAL_FORM_STATE);
      clearError();
    }
    onOpenChange(nextOpen);
  };

  // Read from the API objects, never from the display strings in UserDetails —
  // those fall back to placeholder copy before data loads.
  const userRecord = unwrapUser(userInfo ?? authUser);
  const fullName = resolveUserFullName(userRecord);
  const email = resolveUserEmail(userRecord);
  const profilePhone = resolveUserPhone(userRecord);

  // The API requires phone_number; ask for one only when the profile lacks it.
  const needsPhoneInput = !profilePhone;
  const phoneNumber = profilePhone || form.phoneNumber.trim();

  const cohortName = enrollment?.cohort?.name?.trim() ?? "";
  const programTitle =
    enrollment?.program?.title?.trim() ||
    enrollment?.program?.intern_title?.trim() ||
    enrollment?.program?.internship_title?.trim() ||
    "";
  const cohortId = enrollment?.cohort?.id ?? enrollment?.cohort_id ?? undefined;
  const programId = enrollment?.program?.id ?? enrollment?.program_id ?? undefined;

  const reasonLabel =
    LETTER_REASONS.find((option) => option.value === form.reason)?.label ?? "";

  const payload: RequestReferenceLetterPayload | null =
    fullName && email && phoneNumber && reasonLabel && form.jobRole.trim() &&
    form.companyName.trim()
      ? {
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          reason: reasonLabel,
          cohort_program: cohortName,
          program: programTitle,
          cohort_id: cohortId,
          program_id: programId,
          additional_info: form.additionalInfo.trim(),
          job_role: form.jobRole.trim(),
          company_name: form.companyName.trim(),
          company_website: form.companyWebsite.trim(),
        }
      : null;

  const canSubmit = Boolean(payload) && !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payload || isSubmitting) return;

    try {
      await submitReferenceLetter(payload);
      handleOpenChange(false);
      onRequested?.(REQUESTED_MESSAGE);
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
              Reference letter
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
                    htmlFor="reference-letter-phone"
                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                  >
                    Phone number
                  </label>
                  <Input
                    id="reference-letter-phone"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phoneNumber: event.target.value,
                      }))
                    }
                    placeholder="Enter your phone number"
                    className={cn(fieldClassName, "h-11 px-3")}
                  />
                  <p className="mt-1.5 text-xs text-[#64748B]">
                    We don&apos;t have a phone number on your profile yet.
                  </p>
                </div>
              ) : null}

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
                  htmlFor="reference-letter-job-role"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Job role
                </label>
                <Input
                  id="reference-letter-job-role"
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
                    htmlFor="reference-letter-company-name"
                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                  >
                    Company name
                  </label>
                  <Input
                    id="reference-letter-company-name"
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
                    htmlFor="reference-letter-company-website"
                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                  >
                    Company website
                  </label>
                  <div className="relative">
                    <Input
                      id="reference-letter-company-website"
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
                  htmlFor="reference-letter-additional-info"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Additional info
                </label>
                <textarea
                  id="reference-letter-additional-info"
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
                  Requesting…
                </>
              ) : (
                "Request letter"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ReferenceLetterDrawer;
