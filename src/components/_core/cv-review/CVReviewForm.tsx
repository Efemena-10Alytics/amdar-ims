"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCVReviewConfig } from "@/features/cv-review/use-cv-review-config";
import { useSubmitCV } from "@/features/cv-review/use-submit-cv";
import {
  defaultCVReviewFormState,
  type CVReviewFormState,
} from "@/features/cv-review/types";
import {
  validateCVFile,
  buildCVFormData,
  formatFileSize,
  validateCohortFormat,
} from "@/lib/utils/cv-review-validation";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepErrors = Partial<Record<keyof CVReviewFormState, string>>;

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { title: "Contact Details" },
  { title: "Professional Links" },
  { title: "Amdari Internship Details" },
  { title: "Cohort" },
  { title: "Target Role & Industry" },
  { title: "CV Upload" },
] as const;

const TOTAL_STEPS = STEPS.length;

// ─── Per-step validation ──────────────────────────────────────────────────────

function validateStep(step: number, form: CVReviewFormState): StepErrors {
  const errors: StepErrors = {};

  if (step === 1) {
    if (!form.name.trim()) errors.name = "Full name is required.";
    if (!form.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
  }

  if (step === 2) {
    if (!form.linkedin.trim()) errors.linkedin = "LinkedIn URL is required.";
  }

  if (step === 3) {
    if (!form.internship) errors.internship = "Please select an internship.";
    if (form.internship === "Other" && !form.internship_other.trim()) {
      errors.internship_other = "Please specify your internship.";
    }
  }

  if (step === 4) {
    if (!form.cohort) {
      errors.cohort = "Please select a cohort.";
    } else if (!validateCohortFormat(form.cohort)) {
      errors.cohort = 'Cohort must be in "Month YYYY" format.';
    }
  }

  if (step === 5) {
    if (!form.target_role) errors.target_role = "Please select a target role.";
    if (form.target_role === "Other" && !form.target_role_other.trim()) {
      errors.target_role_other = "Please specify your target role.";
    }
    if (!form.industry_tailoring) {
      errors.industry_tailoring =
        "Please indicate if you want industry tailoring.";
    }
  }

  if (step === 6) {
    if (!form.cv_file) {
      errors.cv_file = "Please upload your CV file.";
    } else {
      const fileError = validateCVFile(form.cv_file);
      if (fileError) errors.cv_file = fileError;
    }
  }

  return errors;
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-0">
        {STEPS.map((_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;
          return (
            <React.Fragment key={stepNum}>
              {/* Circle */}
              <div
                className={cn(
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  isCompleted || isActive
                    ? "border-[#156374] bg-[#156374] text-white"
                    : "border-[#CBD5E1] bg-white text-[#94A3B8]",
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="size-4" />
                ) : (
                  stepNum
                )}
              </div>
              {/* Connector line */}
              {i < TOTAL_STEPS - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    stepNum < current ? "bg-[#156374]" : "bg-[#CBD5E1]",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="mt-2 text-right text-xs text-[#64748B]">
        Section <span className="font-semibold text-[#092A31]">{current}</span>{" "}
        of {TOTAL_STEPS}
      </p>
    </div>
  );
}

// ─── Section header banner ────────────────────────────────────────────────────

function SectionHeader({ step }: { step: number }) {
  return (
    <div className="mb-6 rounded-lg bg-[#092A31] px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8]">
        Section {step} of {TOTAL_STEPS}
      </p>
      <p className="mt-0.5 text-lg font-bold text-white">
        {STEPS[step - 1].title}
      </p>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function FieldWrapper({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-[#092A31]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="size-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Styled text input ────────────────────────────────────────────────────────

function FormInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      className={cn(
        "h-11 rounded-lg bg-[#F8FAFC] border-transparent px-4 text-[#092A31] placeholder:text-[#94A3B8] focus-visible:ring-[#156374] focus-visible:ring-offset-0",
        error && "border border-red-400",
      )}
    />
  );
}

// ─── Radio option row ─────────────────────────────────────────────────────────

function RadioOption({
  name,
  value,
  checked,
  onChange,
  disabled,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
        checked
          ? "border-[#156374] bg-[#F0F9FB]"
          : "border-[#E2E8F0] bg-white hover:border-[#156374]/40 hover:bg-[#F8FAFC]",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      {/* Custom circle */}
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          checked ? "border-[#156374]" : "border-[#CBD5E1]",
        )}
      >
        {checked && (
          <span className="size-2.5 rounded-full bg-[#156374]" />
        )}
      </span>
      <span className="text-sm text-[#092A31]">{value}</span>
    </label>
  );
}

// ─── Radio list ───────────────────────────────────────────────────────────────

function RadioList({
  name,
  options,
  value,
  onChange,
  disabled,
  error,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <RadioOption
          key={opt}
          name={name}
          value={opt}
          checked={value === opt}
          onChange={() => onChange(opt)}
          disabled={disabled}
        />
      ))}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="size-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── File upload zone ─────────────────────────────────────────────────────────

function FileUploadZone({
  file,
  onFileChange,
  error,
  disabled,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (f: File | null) => {
      if (!f) return;
      onFileChange(f);
    },
    [onFileChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0] ?? null);
    },
    [handleFile],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        aria-label="Upload CV file"
      />

      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-[#156374]/30 bg-[#F0F9FB] px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="size-5 shrink-0 text-[#156374]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#092A31]">
                {file.name}
              </p>
              <p className="text-xs text-[#64748B]">{formatFileSize(file.size)}</p>
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => {
                onFileChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="shrink-0 text-[#64748B] hover:text-red-500 transition-colors"
              aria-label="Remove file"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] py-10 px-4 transition-colors",
            dragOver && "border-[#156374] bg-[#F0F9FB]",
            error && "border-red-300 bg-red-50/50",
            !disabled &&
              "cursor-pointer hover:border-[#156374] hover:bg-[#F0F9FB]",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <Upload className="size-8 text-[#94A3B8]" />
          <div className="text-center">
            <p className="text-sm font-medium text-[#092A31]">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-[#64748B] mt-0.5">
              PDF or DOCX, max 10 MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="size-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({
  name,
  email,
  targetRole,
  onReset,
}: {
  name: string;
  email: string;
  targetRole: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="size-10 text-green-600" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[#092A31]">CV Submitted!</h2>
        <p className="text-[#64748B] max-w-md mx-auto">
          Your CV has been received and is being processed. You will receive an
          email with your optimized CV shortly.
        </p>
      </div>
      <div className="rounded-lg border border-[#156374]/20 bg-[#F0F9FB] px-6 py-4 text-left max-w-sm w-full">
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Name</dt>
            <dd className="font-medium text-[#092A31] text-right">{name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Email</dt>
            <dd className="font-medium text-[#092A31] text-right break-all">
              {email}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Target Role</dt>
            <dd className="font-medium text-[#092A31] text-right">
              {targetRole}
            </dd>
          </div>
        </dl>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="border-[#156374] text-[#156374] hover:bg-[#156374] hover:text-white"
      >
        Submit Another CV
      </Button>
    </div>
  );
}

// ─── Step content ─────────────────────────────────────────────────────────────

function StepContent({
  step,
  form,
  setField,
  errors,
  config,
  isConfigLoading,
  isConfigError,
  isSubmitting,
}: {
  step: number;
  form: CVReviewFormState;
  setField: <K extends keyof CVReviewFormState>(
    key: K,
    value: CVReviewFormState[K],
  ) => void;
  errors: StepErrors;
  config: { internships: string[]; cohorts: string[]; roles: string[] } | undefined;
  isConfigLoading: boolean;
  isConfigError: boolean;
  isSubmitting: boolean;
}) {
  if (step === 1) {
    return (
      <div className="flex flex-col gap-5">
        <FieldWrapper
          label="Full Name"
          htmlFor="cv-name"
          required
          error={errors.name}
        >
          <FormInput
            id="cv-name"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="Jane Doe"
            error={errors.name}
            disabled={isSubmitting}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Email Address"
          htmlFor="cv-email"
          required
          error={errors.email}
        >
          <FormInput
            id="cv-email"
            type="email"
            value={form.email}
            onChange={(v) => setField("email", v)}
            placeholder="jane@example.com"
            error={errors.email}
            disabled={isSubmitting}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Phone Number"
          htmlFor="cv-phone"
          error={errors.phone}
        >
          <FormInput
            id="cv-phone"
            type="tel"
            value={form.phone}
            onChange={(v) => setField("phone", v)}
            placeholder="+1 234 567 8900"
            disabled={isSubmitting}
          />
        </FieldWrapper>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex flex-col gap-5">
        <FieldWrapper
          label="LinkedIn Profile URL"
          htmlFor="cv-linkedin"
          required
          error={errors.linkedin}
        >
          <FormInput
            id="cv-linkedin"
            type="url"
            value={form.linkedin}
            onChange={(v) => setField("linkedin", v)}
            placeholder="https://linkedin.com/in/your-profile"
            error={errors.linkedin}
            disabled={isSubmitting}
          />
        </FieldWrapper>

        <FieldWrapper
          label="GitHub Profile URL"
          htmlFor="cv-github"
          error={errors.github}
        >
          <FormInput
            id="cv-github"
            type="url"
            value={form.github}
            onChange={(v) => setField("github", v)}
            placeholder="https://github.com/your-username"
            disabled={isSubmitting}
          />
        </FieldWrapper>
      </div>
    );
  }

  if (step === 3) {
    if (isConfigError) {
      return (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <p>Could not load internship options. Please refresh the page.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-3 text-sm font-medium text-[#092A31]">
            What Internship are you currently taking at Amdari?{" "}
            <span className="text-red-500">*</span>
          </p>
          {isConfigLoading ? (
            <div className="flex items-center gap-2 text-sm text-[#64748B]">
              <Loader2 className="size-4 animate-spin" />
              Loading options…
            </div>
          ) : (
            <RadioList
              name="internship"
              options={config?.internships ?? []}
              value={form.internship}
              onChange={(v) => {
                setField("internship", v);
                if (v !== "Other") setField("internship_other", "");
              }}
              disabled={isSubmitting}
              error={errors.internship}
            />
          )}
        </div>

        {form.internship === "Other" && (
          <FieldWrapper
            label="Please specify your internship"
            htmlFor="cv-internship-other"
            required
            error={errors.internship_other}
          >
            <FormInput
              id="cv-internship-other"
              value={form.internship_other}
              onChange={(v) => setField("internship_other", v)}
              placeholder="Enter your internship name"
              error={errors.internship_other}
              disabled={isSubmitting}
            />
          </FieldWrapper>
        )}
      </div>
    );
  }

  if (step === 4) {
    if (isConfigError) {
      return (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <p>Could not load cohort options. Please refresh the page.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-[#092A31]">
          Which cohort are you in?{" "}
          <span className="text-red-500">*</span>
        </p>
        {isConfigLoading ? (
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <Loader2 className="size-4 animate-spin" />
            Loading options…
          </div>
        ) : (
          <RadioList
            name="cohort"
            options={config?.cohorts ?? []}
            value={form.cohort}
            onChange={(v) => setField("cohort", v)}
            disabled={isSubmitting}
            error={errors.cohort}
          />
        )}
      </div>
    );
  }

  if (step === 5) {
    if (isConfigError) {
      return (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <p>Could not load role options. Please refresh the page.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-3 text-sm font-medium text-[#092A31]">
            What is your target role?{" "}
            <span className="text-red-500">*</span>
          </p>
          {isConfigLoading ? (
            <div className="flex items-center gap-2 text-sm text-[#64748B]">
              <Loader2 className="size-4 animate-spin" />
              Loading options…
            </div>
          ) : (
            <RadioList
              name="target_role"
              options={config?.roles ?? []}
              value={form.target_role}
              onChange={(v) => {
                setField("target_role", v);
                if (v !== "Other") setField("target_role_other", "");
              }}
              disabled={isSubmitting}
              error={errors.target_role}
            />
          )}
        </div>

        {form.target_role === "Other" && (
          <FieldWrapper
            label="Please specify your target role"
            htmlFor="cv-target-role-other"
            required
            error={errors.target_role_other}
          >
            <FormInput
              id="cv-target-role-other"
              value={form.target_role_other}
              onChange={(v) => setField("target_role_other", v)}
              placeholder="Enter your target role"
              error={errors.target_role_other}
              disabled={isSubmitting}
            />
          </FieldWrapper>
        )}

        {/* Industry tailoring */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-[#092A31]">
            Would you like your CV tailored to a specific industry?{" "}
            <span className="text-red-500">*</span>
          </p>
          <div className="flex gap-3">
            {(["Yes", "No"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setField("industry_tailoring", opt);
                  if (opt === "No") setField("industry_specialization", "");
                }}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 rounded-lg border py-3 text-sm font-medium transition-colors",
                  form.industry_tailoring === opt
                    ? "border-[#156374] bg-[#156374] text-white"
                    : "border-[#E2E8F0] bg-white text-[#092A31] hover:border-[#156374] hover:bg-[#F0F9FB]",
                  isSubmitting && "opacity-50 cursor-not-allowed",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {errors.industry_tailoring && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="size-3 shrink-0" />
              {errors.industry_tailoring}
            </p>
          )}
        </div>

        {form.industry_tailoring === "Yes" && (
          <FieldWrapper
            label="Industry Specialization"
            htmlFor="cv-industry-specialization"
            error={errors.industry_specialization}
          >
            <FormInput
              id="cv-industry-specialization"
              value={form.industry_specialization}
              onChange={(v) => setField("industry_specialization", v)}
              placeholder="e.g. FinTech, Healthcare, E-commerce"
              disabled={isSubmitting}
            />
          </FieldWrapper>
        )}
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-[#092A31]">
          Upload your CV <span className="text-red-500">*</span>
        </p>
        <FileUploadZone
          file={form.cv_file}
          onFileChange={(f) => setField("cv_file", f)}
          error={errors.cv_file}
          disabled={isSubmitting}
        />
      </div>
    );
  }

  return null;
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function CVReviewForm() {
  const {
    data: config,
    isLoading: isConfigLoading,
    isError: isConfigError,
  } = useCVReviewConfig();
  const {
    submit,
    isSubmitting,
    errorMessage,
    fieldErrors,
    successData,
    reset,
  } = useSubmitCV();

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CVReviewFormState>(defaultCVReviewFormState);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const topRef = useRef<HTMLDivElement>(null);

  const setField = useCallback(
    <K extends keyof CVReviewFormState>(key: K, value: CVReviewFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setStepErrors((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  // Merge server field errors (from 422) into step errors on the relevant step
  const mergedErrors: StepErrors = {
    ...stepErrors,
    ...Object.fromEntries(
      Object.entries(fieldErrors).map(([k, v]) => [k, v[0] ?? ""]),
    ),
  };

  // Scroll to top of form whenever step changes or an error appears
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentStep, errorMessage]);

  const goNext = useCallback(() => {
    const errors = validateStep(currentStep, form);
    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, [currentStep, form]);

  const goBack = useCallback(() => {
    setStepErrors({});
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errors = validateStep(currentStep, form);
      if (Object.keys(errors).length > 0) {
        setStepErrors(errors);
        return;
      }
      const fd = buildCVFormData(form);
      try {
        await submit(fd);
      } catch {
        // errors handled inside hook
      }
    },
    [currentStep, form, submit],
  );

  const handleReset = useCallback(() => {
    reset();
    setForm(defaultCVReviewFormState);
    setStepErrors({});
    setCurrentStep(1);
  }, [reset]);

  // ── Success state ──────────────────────────────────────────────────────────
  if (successData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <SuccessScreen
          name={successData.name}
          email={successData.email}
          targetRole={successData.target_role}
          onReset={handleReset}
        />
      </div>
    );
  }

  const isLastStep = currentStep === TOTAL_STEPS;

  return (
    <div ref={topRef} className="mx-auto max-w-2xl px-4 py-10">
      {/* Page header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#092A31]">CV Review Expert</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          Our CV experts will carefully assess and optimise your CV for the UK,
          US, European, and Canadian job markets.
        </p>
      </div>

      {/* Progress bar */}
      <StepProgress current={currentStep} />

      {/* Section header banner */}
      <SectionHeader step={currentStep} />

      {/* Global API error (submit errors) */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Step content */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="min-h-[280px]">
          <StepContent
            step={currentStep}
            form={form}
            setField={setField}
            errors={mergedErrors}
            config={config}
            isConfigLoading={isConfigLoading}
            isConfigError={isConfigError}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center gap-1.5 border-[#CBD5E1] text-[#092A31] hover:border-[#156374] hover:text-[#156374] disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>

          {isLastStep ? (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#156374] px-8 text-white hover:bg-[#0e4f5e] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit CV for Review"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goNext}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 bg-[#156374] px-8 text-white hover:bg-[#0e4f5e]"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>

        {isLastStep && (
          <p className="mt-4 text-center text-xs text-[#94A3B8]">
            By submitting, you agree to have your CV processed by our AI review
            system. Results will be sent to your email.
          </p>
        )}
      </form>
    </div>
  );
}
