"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Link2, Loader2, Upload, X } from "lucide-react";
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
  getInterviewBookingLink,
  useBookInterviewPrep,
  type BookInterviewPrepInput,
} from "@/features/interview-booking/use-book-interview-prep";
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

/**
 * Slugs match what the legacy dashboard writes, so the admin list filter
 * (`where('interview_stage', $stage)`) keeps matching IMS bookings.
 */
const INTERVIEW_STAGES = [
  { value: "first-round", label: "First Round" },
  { value: "second-round", label: "Second Round" },
  { value: "final-round", label: "Final Round" },
  { value: "technical", label: "Technical Interview" },
  { value: "hr", label: "HR Interview" },
] as const;

const BOOKED_MESSAGE = "Interview prep session booked.";

type InterviewPrepDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBooked?: (message: string) => void;
};

type InterviewPrepFormState = {
  roleTitle: string;
  companyName: string;
  companyLocation: string;
  interviewStage: string;
  interviewDate: string;
  jobLink: string;
  cvFile: File | null;
};

const INITIAL_FORM_STATE: InterviewPrepFormState = {
  roleTitle: "",
  companyName: "",
  companyLocation: "",
  interviewStage: "",
  interviewDate: "",
  jobLink: "",
  cvFile: null,
};

const fieldClassName =
  "h-11 rounded-xl border-[#DCE5E9] bg-white px-3 text-sm text-[#092A31] placeholder:text-[#94A3B8]";

function todayYmd(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}


const InterviewPrepDrawer = ({
  open,
  onOpenChange,
  onBooked,
}: InterviewPrepDrawerProps) => {
  const cvInputId = useId();
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<InterviewPrepFormState>(INITIAL_FORM_STATE);
  const [cvError, setCvError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [minDate] = useState(todayYmd);

  const { data: enrollment } = useGetUserEnrollment();
  const authUser = useAuthStore((state) => state.user);
  const { data: userInfo } = useGetUserInfo();
  const { submitInterviewPrep, isSubmitting, errorMessage, clearError } =
    useBookInterviewPrep();

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
  const phoneNumber = resolveUserPhone(userRecord);

  const cohortName = enrollment?.cohort?.name?.trim() ?? "";
  const programTitle =
    enrollment?.program?.title?.trim() ||
    enrollment?.program?.intern_title?.trim() ||
    enrollment?.program?.internship_title?.trim() ||
    "";
  const cohortId = enrollment?.cohort?.id ?? enrollment?.cohort_id ?? null;
  const programId = enrollment?.program?.id ?? enrollment?.program_id ?? null;

  const jobLink = form.jobLink.trim();
  const jobLinkError = jobLink && !isValidUrl(jobLink)
    ? "Enter a valid link starting with http:// or https://"
    : "";

  // Both IDs are required for the API to resolve this cohort's booking link.
  const hasEnrollment = cohortId != null && programId != null;

  const payload: BookInterviewPrepInput | null =
    fullName &&
    hasEnrollment &&
    form.roleTitle.trim() &&
    form.companyName.trim() &&
    form.companyLocation &&
    form.interviewStage &&
    form.interviewDate &&
    form.cvFile &&
    !cvError &&
    !jobLinkError
      ? {
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          cohort_program: cohortName,
          program: programTitle,
          cohort_id: cohortId,
          program_id: programId,
          job_link: jobLink,
          job_role: form.roleTitle.trim(),
          company_name: form.companyName.trim(),
          company_location: form.companyLocation,
          interview_stage: form.interviewStage,
          interview_date: form.interviewDate,
          cv: form.cvFile,
        }
      : null;

  const canSubmit = Boolean(payload) && !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payload || isSubmitting) return;

    try {
      const response = await submitInterviewPrep(payload);
      const link = getInterviewBookingLink(response);

      handleOpenChange(false);
      onBooked?.(BOOKED_MESSAGE);

      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
      }
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
            <SheetClose className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F16B6B]">
              <X className="size-3.5" />
              Close
            </SheetClose>
            <SheetTitle className="mt-1 text-xl font-semibold text-[#173740] sm:text-2xl">
              Book interview prep session
            </SheetTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <UserDetails />

            <p className="mt-6 text-sm font-medium text-[#64748B]">
              Fill in this section
            </p>

            <div className="mt-3 space-y-4">
              <div>
                <label
                  htmlFor="role-title"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Role title
                </label>
                <Input
                  id="role-title"
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
                  htmlFor="company-name"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Company name
                </label>
                <Input
                  id="company-name"
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#092A31]">
                    Interview stage
                  </label>
                  <Select
                    value={form.interviewStage}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        interviewStage: value,
                      }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        fieldClassName,
                        "w-full data-placeholder:text-[#94A3B8]",
                      )}
                    >
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_STAGES.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="interview-date"
                    className="mb-1.5 block text-sm font-medium text-[#092A31]"
                  >
                    Interview date
                  </label>
                  <Input
                    id="interview-date"
                    type="date"
                    min={minDate}
                    value={form.interviewDate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        interviewDate: event.target.value,
                      }))
                    }
                    className={fieldClassName}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="job-link"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Job link (optional)
                </label>
                <div className="relative">
                  <Input
                    id="job-link"
                    value={form.jobLink}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        jobLink: event.target.value,
                      }))
                    }
                    placeholder="Paste link"
                    className={cn(fieldClassName, "pr-10")}
                  />
                  <Link2
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#94A3B8]"
                    aria-hidden
                  />
                </div>
                {jobLinkError ? (
                  <p className="mt-1.5 text-xs text-red-600">{jobLinkError}</p>
                ) : null}
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
                    "flex flex-col items-center justify-center gap-2 rounded-xl border border-[#C5D6DC] bg-[#E8F4F8] px-4 py-8 transition-colors",
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

export default InterviewPrepDrawer;
