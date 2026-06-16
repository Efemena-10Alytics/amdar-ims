"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Calendar, MapPin, Pencil, Upload, User, X } from "lucide-react";
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
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { AuthUser } from "@/store/auth-store";
import type { EnrollmentCohort } from "@/types/user/enrollment";

const COMPANY_LOCATIONS = [
  "United Kingdom",
  "United States",
  "Canada",
  "Nigeria",
] as const;

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

type LinkedInOptimizationDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type LinkedInOptimizationFormState = {
  roleTitle: string;
  companyName: string;
  companyLocation: string;
  cvFile: File | null;
};

const INITIAL_FORM_STATE: LinkedInOptimizationFormState = {
  roleTitle: "",
  companyName: "",
  companyLocation: "",
  cvFile: null,
};

function getUserFullName(user: AuthUser | null | undefined): string {
  if (!user || typeof user !== "object") return "Oluwajuwonlo Olunga";

  const record = user as Record<string, unknown>;
  const nested =
    record.user && typeof record.user === "object"
      ? (record.user as Record<string, unknown>)
      : record;

  const firstName = nested.firstName ?? nested.first_name ?? nested.name;
  const lastName = nested.lastName ?? nested.last_name;
  const first =
    typeof firstName === "string" ? firstName.trim() : "";
  const last = typeof lastName === "string" ? lastName.trim() : "";
  const fullName = [first, last].filter(Boolean).join(" ").trim();

  return fullName || "Oluwajuwonlo Olunga";
}

function formatCohortLabel(cohort: EnrollmentCohort | undefined): string {
  if (!cohort) return "Feb Cohort, 2024.";

  const name = cohort.name?.trim();
  if (name) return name.endsWith(".") ? name : `${name}.`;

  const month = cohort.month?.trim();
  const year = cohort.year?.trim();
  if (month && year) return `${month} Cohort, ${year}.`;

  return "—";
}

function DetailItem({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <span className="mt-0.5 shrink-0 text-[#64748B]" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 text-sm text-[#475467]">{children}</div>
    </div>
  );
}

const LinkedInOptimizationDrawer = ({
  open,
  onOpenChange,
}: LinkedInOptimizationDrawerProps) => {
  const cvInputId = useId();
  const cvInputRef = useRef<HTMLInputElement>(null);
  const authUser = useAuthStore((state) => state.user);
  const { data: userInfo } = useGetUserInfo();
  const { data: enrollment } = useGetUserEnrollment();

  const [form, setForm] = useState<LinkedInOptimizationFormState>(
    INITIAL_FORM_STATE,
  );
  const [cvError, setCvError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const displayName = getUserFullName(userInfo ?? authUser);
  const cohortLabel = formatCohortLabel(enrollment?.cohort);
  const programTitle =
    enrollment?.program?.title?.trim() ||
    enrollment?.program?.intern_title?.trim() ||
    enrollment?.program?.internship_title?.trim() ||
    "Product design";
  const skillLevel = enrollment?.program?.level?.trim() || "Professional";
  const locationLabel = "United Kingdom";
  const affiliationLabel = "Uniformity stage";

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM_STATE);
      setCvError("");
      setIsDragOver(false);
    }
  }, [open]);

  const handleCvSelect = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setCvError("Please upload a JPEG or PNG file.");
      return;
    }

    if (file.size > MAX_CV_SIZE_BYTES) {
      setCvError("File must be 5 MB or smaller.");
      return;
    }

    setCvError("");
    setForm((current) => ({ ...current, cvFile: file }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onOpenChange(false);
  };

  const canSubmit =
    form.roleTitle.trim() &&
    form.companyName.trim() &&
    form.companyLocation &&
    form.cvFile &&
    !cvError;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
              Book LinkedIn Optimization
            </SheetTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <p className="text-sm font-medium text-[#64748B]">Your details</p>

            <div className="mt-2 rounded-xl bg-[#F6F8FA] p-4">
              <p className="text-base font-semibold text-[#092A31]">
                {displayName}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem icon={<Calendar className="size-4" />}>
                  {cohortLabel}
                </DetailItem>
                <DetailItem icon={<Pencil className="size-4" />}>
                  <span className="flex flex-wrap items-center gap-2">
                    <span>{programTitle}</span>
                    <span className="rounded-full bg-[#E2E8F0] px-2 py-0.5 text-xs font-medium text-[#64748B]">
                      {skillLevel}
                    </span>
                  </span>
                </DetailItem>
                <DetailItem icon={<MapPin className="size-4" />}>
                  {locationLabel}
                </DetailItem>
                <DetailItem icon={<User className="size-4" />}>
                  {affiliationLabel}
                </DetailItem>
              </div>
            </div>

            <p className="mt-6 text-sm font-medium text-[#64748B]">
              Fill in this section
            </p>

            <div className="mt-3 space-y-4">
              <div>
                <label
                  htmlFor="linkedin-role-title"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Role title
                </label>
                <Input
                  id="linkedin-role-title"
                  value={form.roleTitle}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      roleTitle: event.target.value,
                    }))
                  }
                  placeholder="Enter role title"
                  className="h-11 rounded-xl border-[#DCE5E9] bg-white px-3 text-sm text-[#092A31] placeholder:text-[#94A3B8]"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin-company-name"
                  className="mb-1.5 block text-sm font-medium text-[#092A31]"
                >
                  Company name
                </label>
                <Input
                  id="linkedin-company-name"
                  value={form.companyName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      companyName: event.target.value,
                    }))
                  }
                  placeholder="Enter company name"
                  className="h-11 rounded-xl border-[#DCE5E9] bg-white px-3 text-sm text-[#092A31] placeholder:text-[#94A3B8]"
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
                  <SelectTrigger className="h-11 w-full rounded-xl border-[#DCE5E9] bg-white px-3 text-sm text-[#092A31] data-placeholder:text-[#94A3B8]">
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
                  accept="image/jpeg,image/png,image/jpg"
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
                    "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F6F8FA] px-4 py-8 transition-colors",
                    isDragOver && "border-[#0A66C2] bg-[#E8F0FF]",
                    cvError && "border-red-300 bg-red-50/50",
                  )}
                >
                  <Upload className="size-8 text-[#0A66C2]" strokeWidth={1.75} />
                  <p className="text-sm font-semibold text-[#0A66C2]">
                    {form.cvFile ? form.cvFile.name : "Click to upload CV"}
                  </p>
                  <p className="text-xs text-[#64748B]">Jpeg, png (max 5mb)</p>
                </div>
                {cvError ? (
                  <p className="mt-1.5 text-xs text-red-600">{cvError}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="border-t border-[#E2EBEF] px-6 py-4">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-12 w-full rounded-full bg-[#134E5E] text-base font-semibold text-white hover:bg-[#0E6174] disabled:bg-[#9DB8C0]"
            >
              Book session
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default LinkedInOptimizationDrawer;
