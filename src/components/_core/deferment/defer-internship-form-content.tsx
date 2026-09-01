"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFERMENT_REASON_MAX_LENGTH,
} from "@/constants/internship-deferment";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import { getDefermentErrorMessage } from "@/features/deferment/deferment-errors";
import {
  useGetDefermentPrograms,
  useGetNextCohortsForDeferment,
} from "@/features/deferment/use-deferment-lookups";
import { useSubmitDeferment } from "@/features/deferment/use-submit-deferment";
import { DefermentFileUpload } from "@/components/_core/deferment/deferment-file-upload";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import type { AuthUser } from "@/store/auth-store";
import { formatCohortLabel } from "@/types/internship-program/user-program";

const inputBase = cn(
  "w-full rounded-lg border border-transparent bg-[#F8FAFC] px-4 py-3 text-sm text-[#092A31] placeholder:text-[#94A3B8]",
  "focus:border-[#156374] focus:outline-none focus:ring-2 focus:ring-[#156374]/20",
);

const readOnlyInputBase = cn(
  inputBase,
  "cursor-not-allowed bg-[#EEF2F6] text-[#64748B]",
);

const labelClass = "mb-1.5 block text-sm font-medium text-[#092A31]";

type YesNoValue = "yes" | "no";
type FormStep = "details" | "appeal" | "confirm";
type FeeDecision = "appeal" | "proceed" | null;

type DeferInternshipFormContentProps = {
  idPrefix?: string;
  className?: string;
  /** When false, deferment lookups are not fetched (e.g. closed modal). */
  enabled?: boolean;
  /** When set, called after a successful submit instead of showing inline success. */
  onSuccess?: () => void;
};

function getUserProfile(user: AuthUser | null | undefined) {
  if (!user || typeof user !== "object") {
    return { fullName: "", email: "" };
  }

  const record = user as Record<string, unknown>;
  const nested =
    record.user && typeof record.user === "object"
      ? (record.user as Record<string, unknown>)
      : record;

  const first =
    nested.firstName ?? nested.first_name ?? nested.name ?? nested.username;
  const last = nested.lastName ?? nested.last_name;
  const email = nested.email;

  const firstName = typeof first === "string" ? first.trim() : "";
  const lastName = typeof last === "string" ? last.trim() : "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return {
    fullName,
    email: typeof email === "string" ? email.trim() : "",
  };
}

function RadioOption({
  name,
  value,
  checked,
  label,
  disabled = false,
  onChange,
}: {
  name: string;
  value: YesNoValue;
  checked: boolean;
  label: string;
  disabled?: boolean;
  onChange: (value: YesNoValue) => void;
}) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-[#092A31]",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="size-4 accent-[#156374] disabled:cursor-not-allowed"
      />
      {label}
    </label>
  );
}

export function DeferInternshipFormContent({
  idPrefix = "",
  className,
  enabled = true,
  onSuccess,
}: DeferInternshipFormContentProps) {
  const fieldId = (name: string) => `${idPrefix}${name}`;

  const { data: userInfo } = useGetUserInfo();
  const { data: enrollment, isPending: isEnrollmentLoading } =
    useGetUserEnrollment();
  const { data: programs = [], isLoading: isProgramsLoading } =
    useGetDefermentPrograms({ enabled });
  const { data: nextCohorts = [], isLoading: isCohortsLoading } =
    useGetNextCohortsForDeferment({
      enabled,
      cohortStartDate: enrollment?.cohort?.start_date,
      selectedCohortId: enrollment?.cohort_id ?? enrollment?.cohort?.id ?? null,
    });

  const { mutateAsync, isPending: isSubmitting, isSuccess } =
    useSubmitDeferment();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newCohortId, setNewCohortId] = useState("");
  const [switchProgram, setSwitchProgram] = useState<YesNoValue>("no");
  const [newProgramId, setNewProgramId] = useState("");
  const [reason, setReason] = useState("");
  const [awareDeferOnce, setAwareDeferOnce] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [feeDecision, setFeeDecision] = useState<FeeDecision>(null);
  const [discountReason, setDiscountReason] = useState("");
  const [discountFile, setDiscountFile] = useState<File | null>(null);
  const [formStep, setFormStep] = useState<FormStep>("details");
  const [confirmName, setConfirmName] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const profile = getUserProfile(userInfo ?? null);
    setFullName(profile.fullName);
    setEmail(profile.email);
  }, [userInfo]);

  const currentCohortLabel = formatCohortLabel(enrollment?.cohort ?? {});
  const currentProgramTitle = enrollment?.program?.title?.trim() ?? "";
  const currentCohortId = enrollment?.cohort_id ?? enrollment?.cohort?.id ?? null;
  const currentProgramId = enrollment?.program_id ?? null;
  const activeWeek = enrollment?.cohort?.active_week ?? 0;
  const requiresReenrollmentFee = activeWeek > 2;

  const targetCohortOptions = useMemo(() => {
    return nextCohorts
      .filter((cohort) => {
        if (cohort.id !== currentCohortId) return true;
        return activeWeek <= 2;
      })
      .map((cohort) => ({
        id: cohort.id,
        label: formatCohortLabel(cohort),
      }));
  }, [activeWeek, currentCohortId, nextCohorts]);

  const programOptions = useMemo(() => {
    return programs
      .filter((program) => program.id !== currentProgramId)
      .map((program) => ({
        id: program.id,
        label: program.title?.trim() || `Program ${program.id}`,
      }));
  }, [currentProgramId, programs]);

  const resolvedNewProgramId =
    switchProgram === "yes" && newProgramId
      ? Number(newProgramId)
      : currentProgramId;

  const isLoading =
    isEnrollmentLoading || isProgramsLoading || isCohortsLoading;

  const isDetailsValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    newCohortId.length > 0 &&
    reason.trim().length > 0 &&
    reason.trim().length <= DEFERMENT_REASON_MAX_LENGTH &&
    acknowledged &&
    (!requiresReenrollmentFee || awareDeferOnce) &&
    currentCohortId != null &&
    currentProgramId != null &&
    resolvedNewProgramId != null &&
    (switchProgram === "no" || newProgramId.length > 0);

  const canContinueFromDetails = isDetailsValid;

  const canContinueFromAppeal = discountReason.trim().length > 0;

  const canConfirmSubmit =
    confirmName.trim() === fullName.trim() && confirmName.trim().length > 0;

  const handleContinueToConfirm = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!canContinueFromDetails) return;

    setFormStep("confirm");
  };

  const handleAppealClick = () => {
    setSubmitError(null);
    if (!canContinueFromDetails) return;

    setFeeDecision("appeal");
    setFormStep("appeal");
  };

  const handleProceedClick = () => {
    setSubmitError(null);
    if (!canContinueFromDetails) return;

    setFeeDecision("proceed");
    setDiscountReason("");
    setDiscountFile(null);
    setFormStep("confirm");
  };

  const handleContinueFromAppeal = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!canContinueFromAppeal) return;

    setFormStep("confirm");
  };

  const handleBackFromConfirm = () => {
    setConfirmName("");
    setSubmitError(null);
    setFormStep(feeDecision === "appeal" ? "appeal" : "details");
  };

  const handleBackFromAppeal = () => {
    setSubmitError(null);
    setFormStep("details");
  };

  const handleFinalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (
      !canConfirmSubmit ||
      !enrollment ||
      currentCohortId == null ||
      currentProgramId == null ||
      resolvedNewProgramId == null
    ) {
      return;
    }

    try {
      await mutateAsync({
        current_cohort_id: currentCohortId,
        current_program_id: currentProgramId,
        new_cohort_id: Number(newCohortId),
        new_program_id: resolvedNewProgramId,
        reason: reason.trim(),
        ...(feeDecision === "appeal" && discountReason.trim()
          ? { discount_reason: discountReason.trim() }
          : {}),
        ...(feeDecision === "appeal" && discountFile ? { file: discountFile } : {}),
      });
    } catch (err) {
      setSubmitError(getDefermentErrorMessage(err));
    }
  };

  if (!enabled) {
    return null;
  }

  if (isLoading) {
    return (
      <p className={cn("text-sm text-[#64748B]", className)}>
        Loading deferment form...
      </p>
    );
  }

  if (!enrollment) {
    return (
      <p className={cn("text-sm text-destructive", className)}>
        Unable to load your enrollment. Please try again later.
      </p>
    );
  }

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col items-center text-center", className)}>
        <div className="flex size-20 items-center justify-center rounded-full bg-[#B8E5C8]">
          <CheckCheck className="size-10 text-[#156374]" strokeWidth={2.5} />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-[#173740]">Sent</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
          Your deferment request has been sent to the finance team, you&apos;ll
          receive your response via email
        </p>
        {onSuccess ? (
          <button
            type="button"
            onClick={() => onSuccess()}
            className="mt-6 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-[#156374] px-8 text-sm font-semibold text-white transition hover:bg-[#124F5D]"
          >
            Close
          </button>
        ) : null}
      </div>
    );
  }

  if (formStep === "confirm") {
    return (
      <form
        onSubmit={handleFinalSubmit}
        className={cn("space-y-6", className)}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="size-20 rounded-full bg-[#B8E5C8]"
            aria-hidden
          />
          <h2 className="mt-5 text-xl lg:text-2xl font-semibold text-[#173740]">
            Are you sure you want to defer?
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#1F5D36]">
            Enter your full name <span className="bg-[#E8EFF1]">&apos;{fullName}&apos;</span> and click{" "}
            <span className="font-bold text-[#1F5D36]">PROCEED</span> to
            validate your request.
          </p>
        </div>

        <input
          id={fieldId("confirmName")}
          type="text"
          value={confirmName}
          onChange={(event) => setConfirmName(event.target.value)}
          placeholder="Enter full name"
          className={inputBase}
          autoComplete="name"
          required
        />

        {submitError ? (
          <p className="text-sm text-destructive">{submitError}</p>
        ) : null}

        <div className="flex w-full gap-3 pt-1">
          <button
            type="button"
            onClick={handleBackFromConfirm}
            className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full bg-[#E8F2F4] px-6 text-sm font-semibold text-[#156374] transition hover:bg-[#D9ECEF]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canConfirmSubmit || isSubmitting}
            className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full bg-[#156374] px-6 text-sm font-semibold text-white transition hover:bg-[#124F5D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Proceed"}
          </button>
        </div>
      </form>
    );
  }

  if (formStep === "appeal") {
    return (
      <form
        onSubmit={handleContinueFromAppeal}
        className={cn("space-y-5", className)}
      >
        <div>
          <h2 className="text-lg font-semibold text-[#173740]">
            Appeal for discount
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Tell us why you are appealing for a discount on the £200 re-enrollment
            fee. You may attach supporting documents.
          </p>
        </div>

        <div>
          <label htmlFor={fieldId("discountReason")} className={labelClass}>
            Reason for discount appeal
          </label>
          <textarea
            id={fieldId("discountReason")}
            value={discountReason}
            onChange={(event) => setDiscountReason(event.target.value)}
            placeholder="Explain why you are appealing for a discount on the re-enrollment fee"
            rows={5}
            className={cn(inputBase, "min-h-32 resize-y")}
            required
          />
        </div>

        <DefermentFileUpload
          id={fieldId("discountFile")}
          file={discountFile}
          onFileChange={setDiscountFile}
        />

        {submitError ? (
          <p className="text-sm text-destructive">{submitError}</p>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handleBackFromAppeal}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-[#CBD5E1] bg-white px-6 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!canContinueFromAppeal}
            className="inline-flex h-11 w-fit cursor-pointer items-center justify-center rounded-full bg-[#156374] px-8 text-sm font-semibold text-white transition hover:bg-[#124F5D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue to confirmation
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!requiresReenrollmentFee) {
          handleContinueToConfirm(event);
        }
      }}
      className={cn("space-y-5", className)}
    >
      <div>
        <label htmlFor={fieldId("fullName")} className={labelClass}>
          Full name
        </label>
        <input
          id={fieldId("fullName")}
          type="text"
          value={fullName}
          readOnly
          className={readOnlyInputBase}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("email")} className={labelClass}>
            Email
          </label>
          <input
            id={fieldId("email")}
            type="email"
            value={email}
            readOnly
            className={readOnlyInputBase}
          />
        </div>
        <div>
          <label htmlFor={fieldId("currentCohort")} className={labelClass}>
            Current cohort
          </label>
          <input
            id={fieldId("currentCohort")}
            type="text"
            value={currentCohortLabel}
            readOnly
            className={readOnlyInputBase}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("currentProgram")} className={labelClass}>
            Current program
          </label>
          <input
            id={fieldId("currentProgram")}
            type="text"
            value={currentProgramTitle}
            readOnly
            className={readOnlyInputBase}
          />
        </div>
        <div>
          <label htmlFor={fieldId("newCohort")} className={labelClass}>
            Which cohort are you deferring to?
          </label>
          <Select value={newCohortId} onValueChange={setNewCohortId}>
            <SelectTrigger
              id={fieldId("newCohort")}
              className="h-11 w-full bg-[#F8FAFC]"
            >
              <SelectValue placeholder="Select cohort" />
            </SelectTrigger>
            <SelectContent>
              {targetCohortOptions.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <p className={labelClass}>
          Do you want to switch to a different program?
        </p>
        <div className="flex items-center gap-6">
          <RadioOption
            name={fieldId("switchProgram")}
            value="yes"
            checked={switchProgram === "yes"}
            label="Yes"
            onChange={(value) => {
              setSwitchProgram(value);
              setNewProgramId("");
            }}
          />
          <RadioOption
            name={fieldId("switchProgram")}
            value="no"
            checked={switchProgram === "no"}
            label="No"
            onChange={(value) => {
              setSwitchProgram(value);
              setNewProgramId("");
            }}
          />
        </div>
      </div>

      {switchProgram === "yes" ? (
        <div>
          <label htmlFor={fieldId("newProgram")} className={labelClass}>
            New program
          </label>
          <Select value={newProgramId} onValueChange={setNewProgramId}>
            <SelectTrigger
              id={fieldId("newProgram")}
              className="h-11 w-full bg-[#F8FAFC]"
            >
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              {programOptions.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div>
        <label htmlFor={fieldId("reason")} className={labelClass}>
          Reason for deferment
        </label>
        <textarea
          id={fieldId("reason")}
          value={reason}
          onChange={(event) => setReason(event.target.value.slice(0, DEFERMENT_REASON_MAX_LENGTH))}
          placeholder="Provide a reason why you want to defer"
          rows={4}
          maxLength={DEFERMENT_REASON_MAX_LENGTH}
          className={cn(inputBase, "min-h-28 resize-y")}
          required
        />
        <p className="mt-1 text-xs text-[#94A3B8]">
          {reason.length}/{DEFERMENT_REASON_MAX_LENGTH}
        </p>
      </div>

      {requiresReenrollmentFee ? (
        <>
          <div className="flex items-start gap-3 rounded-xl bg-[#FFF8EC] px-4 py-3.5">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-[#D4A574] bg-[#FFF4E0]">
              <Info className="size-3 text-[#8B6914]" aria-hidden />
            </span>
            <p className="text-sm leading-relaxed text-[#5C4A1F]">
              Deferring more than 2 weeks after internship commencement
              according to{" "}
              <Link
                href="/terms-and-conditions#deferment-policy"
                className="font-semibold text-[#5C4A1F]"
              >
                Amdari T&amp;C
              </Link>{" "}
              will attract a re-enrollment fee of{" "}
              <span className="font-semibold">£200</span>.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={awareDeferOnce}
                onCheckedChange={(checked) =>
                  setAwareDeferOnce(checked === true)
                }
                className="mt-0.5"
              />
              <span className="text-sm leading-relaxed text-[#64748B]">
                Are you aware you can only defer once?
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked === true)}
                className="mt-0.5"
              />
              <span className="text-sm leading-relaxed text-[#64748B]">
                I acknowledge that my deferment request is subject to review and
                approved on the{" "}
                <Link
                  href="/terms-and-conditions#deferment-policy"
                  className="font-medium text-[#156374] underline underline-offset-2"
                >
                  Amdari Internship Terms and Condition
                </Link>{" "}
                under deferment clause.
              </span>
            </label>
          </div>
        </>
      ) : (
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(checked === true)}
            className="mt-0.5"
          />
          <span className="text-sm leading-relaxed text-[#475569]">
            I acknowledge that my deferment request is subject to review and
            approved on the{" "}
            <Link
              href="/terms-and-conditions#deferment-policy"
              className="font-medium text-[#156374] underline underline-offset-2"
            >
              Amdari Internship Terms and Condition
            </Link>{" "}
            under deferment clause.
          </span>
        </label>
      )}

      {submitError ? (
        <p className="text-sm text-destructive">{submitError}</p>
      ) : null}

      <div className="flex w-full gap-3 pt-1">
        {requiresReenrollmentFee ? (
          <>
            <button
              type="button"
              onClick={handleAppealClick}
              disabled={!canContinueFromDetails}
              className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full bg-[#E8F2F4] px-6 text-sm font-semibold text-[#156374] transition hover:bg-[#D9ECEF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Appeal for discount
            </button>
            <button
              type="button"
              onClick={handleProceedClick}
              disabled={!canContinueFromDetails}
              className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full bg-[#156374] px-6 text-sm font-semibold text-white transition hover:bg-[#124F5D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Proceed without appealing
            </button>
          </>
        ) : (
          <button
            type="submit"
            disabled={!canContinueFromDetails}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-[#156374] px-8 text-sm font-semibold text-white transition hover:bg-[#124F5D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Proceed
          </button>
        )}
      </div>
    </form>
  );
}
