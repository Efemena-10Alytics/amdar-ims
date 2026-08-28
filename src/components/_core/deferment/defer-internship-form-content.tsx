"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import { useSubmitDeferment } from "@/features/deferment/use-submit-deferment";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import { useGetCheckoutData } from "@/features/payment/use-get-checkout-data";
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

type DeferInternshipFormContentProps = {
  idPrefix?: string;
  className?: string;
  /** When set, called after a successful submit instead of showing inline success. */
  onSuccess?: () => void;
};

function getUserNameParts(user: AuthUser | null | undefined) {
  if (!user || typeof user !== "object") {
    return { firstName: "", lastName: "", email: "" };
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

  return {
    firstName: typeof first === "string" ? first.trim() : "",
    lastName: typeof last === "string" ? last.trim() : "",
    email: typeof email === "string" ? email.trim() : "",
  };
}

function RadioOption({
  name,
  value,
  checked,
  label,
  onChange,
}: {
  name: string;
  value: YesNoValue;
  checked: boolean;
  label: string;
  onChange: (value: YesNoValue) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#092A31]">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="size-4 accent-[#156374]"
      />
      {label}
    </label>
  );
}

export function DeferInternshipFormContent({
  idPrefix = "",
  className,
  onSuccess,
}: DeferInternshipFormContentProps) {
  const fieldId = (name: string) => `${idPrefix}${name}`;

  const { data: userInfo } = useGetUserInfo();
  const { data: enrollment, isPending: isEnrollmentLoading } =
    useGetUserEnrollment();
  const programSlug = enrollment?.program?.slug;
  const { data: checkoutData, isLoading: isCheckoutLoading } =
    useGetCheckoutData(programSlug);

  const { mutateAsync, isPending: isSubmitting, isSuccess, error } =
    useSubmitDeferment();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [targetCohortId, setTargetCohortId] = useState("");
  const [switchProgram, setSwitchProgram] = useState<YesNoValue>("no");
  const [awareDeferOnce, setAwareDeferOnce] = useState<YesNoValue>("yes");
  const [reason, setReason] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const parts = getUserNameParts(userInfo ?? null);
    setFirstName(parts.firstName);
    setLastName(parts.lastName);
    setEmail(parts.email);
  }, [userInfo]);

  const currentCohortLabel = formatCohortLabel(enrollment?.cohort ?? {});
  const currentProgramTitle = enrollment?.program?.title?.trim() ?? "";

  const targetCohortOptions = useMemo(() => {
    const cohorts = checkoutData?.upcoming_cohorts ?? [];
    const currentId = enrollment?.cohort_id ?? enrollment?.cohort?.id;

    return cohorts
      .filter((cohort) => cohort.id !== currentId)
      .map((cohort) => ({
        id: cohort.id,
        label: formatCohortLabel(cohort),
      }));
  }, [checkoutData?.upcoming_cohorts, enrollment?.cohort?.id, enrollment?.cohort_id]);

  const isLoading = isEnrollmentLoading || isCheckoutLoading;

  const canSubmit =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    targetCohortId.length > 0 &&
    reason.trim().length > 0 &&
    acknowledged &&
    enrollment?.cohort_id != null &&
    enrollment?.program_id != null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!canSubmit || !enrollment) return;

    try {
      await mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        current_cohort_id: enrollment.cohort_id,
        current_program_id: enrollment.program_id,
        target_cohort_id: Number(targetCohortId),
        switch_program: switchProgram === "yes",
        aware_defer_once: awareDeferOnce === "yes",
        reason: reason.trim(),
      });
      onSuccess?.();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to submit deferment request. Please try again.",
      );
    }
  };

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

  if (isSuccess && !onSuccess) {
    return (
      <div className={cn("space-y-2", className)}>
        <h2 className="text-lg font-semibold text-[#173740]">
          Request submitted
        </h2>
        <p className="text-sm leading-relaxed text-[#64748B]">
          Your deferment request has been received and is subject to review. We
          will contact you by email with an update.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("firstName")} className={labelClass}>
            First name
          </label>
          <input
            id={fieldId("firstName")}
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={inputBase}
            required
          />
        </div>
        <div>
          <label htmlFor={fieldId("lastName")} className={labelClass}>
            Last name
          </label>
          <input
            id={fieldId("lastName")}
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className={inputBase}
            required
          />
        </div>
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
            onChange={(event) => setEmail(event.target.value)}
            className={inputBase}
            required
          />
        </div>
        <div>
          <label htmlFor={fieldId("currentCohort")} className={labelClass}>
            Current Cohort
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
            Current Program
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
          <label htmlFor={fieldId("targetCohort")} className={labelClass}>
            Which cohort are you deferring to?
          </label>
          <Select value={targetCohortId} onValueChange={setTargetCohortId}>
            <SelectTrigger
              id={fieldId("targetCohort")}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className={labelClass}>Do you want to switch to a different Program?</p>
          <div className="flex items-center gap-6">
            <RadioOption
              name={fieldId("switchProgram")}
              value="yes"
              checked={switchProgram === "yes"}
              label="Yes"
              onChange={setSwitchProgram}
            />
            <RadioOption
              name={fieldId("switchProgram")}
              value="no"
              checked={switchProgram === "no"}
              label="No"
              onChange={setSwitchProgram}
            />
          </div>
        </div>
        <div>
          <p className={labelClass}>Are you aware you can only defer once?</p>
          <div className="flex items-center gap-6">
            <RadioOption
              name={fieldId("awareDeferOnce")}
              value="yes"
              checked={awareDeferOnce === "yes"}
              label="Yes"
              onChange={setAwareDeferOnce}
            />
            <RadioOption
              name={fieldId("awareDeferOnce")}
              value="no"
              checked={awareDeferOnce === "no"}
              label="No"
              onChange={setAwareDeferOnce}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("reason")} className={labelClass}>
          Reason for deferment
        </label>
        <textarea
          id={fieldId("reason")}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Provide a reason why you want to defer"
          rows={4}
          className={cn(inputBase, "min-h-28 resize-y")}
          required
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-[#FFF8E1] px-4 py-3 text-sm leading-relaxed text-[#6B5A1F]">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          Deferring 2 weeks after internship commencement according to{" "}
          <Link
            href="/terms-and-conditions#deferment-policy"
            className="font-semibold underline underline-offset-2"
          >
            Amdari T&C
          </Link>{" "}
          will attract a re-enrollment fee of USD 200.
        </p>
      </div>

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

      {submitError || error ? (
        <p className="text-sm text-destructive">
          {submitError ??
            (error instanceof Error
              ? error.message
              : "Failed to submit deferment request.")}
        </p>
      ) : null}

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="inline-flex h-11 w-fit cursor-pointer items-center justify-center rounded-full bg-[#156374] px-8 text-sm font-semibold text-white transition hover:bg-[#124F5D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit request"}
        </button>
      </div>
    </form>
  );
}
