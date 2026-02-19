"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCompleteProfile } from "@/features/payment/use-complete-profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorAlert from "@/components/_core/auth/error-alert";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const inputBase = cn(
  "w-full rounded-lg bg-[#F8FAFC] px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8]",
  "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0 focus:border-transparent",
);

const HOW_DID_YOU_HEAR_OPTIONS = [
  {
    value: "Amdari Facebook/Instagram Ad",
    label: "Amdari Facebook/Instagram Ad",
  },
  { value: "Amdari Instagram Page", label: "Amdari Instagram Page" },
  { value: "Amdari LinkedIn", label: "Amdari LinkedIn" },
  { value: "Amdari Twitter", label: "Amdari Twitter" },
  { value: "Efemena Ikpro", label: "Efemena Ikpro" },
  { value: "Adeiza Suleman", label: "Adeiza Suleman" },
  { value: "Melissa Oti I", label: "Melissa Oti I" },
  { value: "Faith Ojone", label: "Faith Ojone" },
  { value: "Faloh_jagaban", label: "Faloh_jagaban" },
  { value: "Family and Friends", label: "Family and Friends" },
  { value: "Amdari Whatsapp Community", label: "Amdari Whatsapp Community" },
  { value: "Amdari Website", label: "Amdari Website" },
  { value: "Clara", label: "Clara" },
  { value: "Deborah", label: "Deborah" },
  { value: "YouTube", label: "YouTube" },
  { value: "Solace", label: "Solace" },
  { value: "Amdari Email Campaign", label: "Amdari Email Campaign" },
  { value: "Tochi", label: "Tochi" },
];

const REASON_OPTIONS = [
  { value: "career", label: "Career growth" },
  { value: "skills", label: "Learn new skills" },
  { value: "industry", label: "Industry exposure" },
  { value: "other", label: "Other" },
];

const SESSION_OPTIONS = [
  {
    value: "Thursday & Friday Career Session",
    label: "Thursday & Friday Career Session",
  },
  { value: "Saturday Info Session", label: "Saturday Info Session" },
  { value: "Clarity Session", label: "Clarity Session" },
  { value: "None of the above", label: "None of the above" },
];

const SKILL_LEVEL_OPTIONS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
];

interface CompleteProfileFormData {
  skillLevel: string;
  gender: string;
  howDidYouHear: string;
  reasonForDecision: string;
  sessionOfDecision: string;
  referralCode: string;
}

const initialFormData: CompleteProfileFormData = {
  skillLevel: "",
  gender: "",
  howDidYouHear: "",
  reasonForDecision: "",
  sessionOfDecision: "",
  referralCode: "",
};

/** Build prefill from auth user profile (nested user or top-level). */
function getPrefillFromProfile(
  profile: Record<string, unknown> | null | undefined,
): Partial<CompleteProfileFormData> {
  if (!profile || typeof profile !== "object") return {};
  const prefill: Partial<CompleteProfileFormData> = {};
  const skillLevel = profile.skillLevel ?? profile.skill_level;
  if (skillLevel != null && String(skillLevel).trim() !== "")
    prefill.skillLevel = String(skillLevel).trim();
  if (profile.gender != null && String(profile.gender).trim() !== "")
    prefill.gender = String(profile.gender).trim();
  const findOut = profile.find_out;
  if (findOut != null && String(findOut).trim() !== "")
    prefill.howDidYouHear = String(findOut).trim();
  const decisionInfluenced = profile.decision_influenced;
  if (decisionInfluenced != null && String(decisionInfluenced).trim() !== "")
    prefill.reasonForDecision = String(decisionInfluenced).trim();
  const sessionInfluenced = profile.session_influenced;
  if (sessionInfluenced != null && String(sessionInfluenced).trim() !== "")
    prefill.sessionOfDecision = String(sessionInfluenced).trim();
  const ref = profile.ref;
  if (ref != null && String(ref).trim() !== "")
    prefill.referralCode = String(ref).trim();
  return prefill;
}

const REQUIRED_FIELDS: (keyof Omit<CompleteProfileFormData, "referralCode">)[] =
  [
    "skillLevel",
    "gender",
    "howDidYouHear",
    "reasonForDecision",
    "sessionOfDecision",
  ];

function validateRequiredFields(
  data: CompleteProfileFormData,
): Partial<Record<keyof CompleteProfileFormData, string>> {
  const errors: Partial<Record<keyof CompleteProfileFormData, string>> = {};
  for (const field of REQUIRED_FIELDS) {
    const value = data[field];
    if (value == null || String(value).trim() === "") {
      errors[field] = "This field is required";
    }
  }
  return errors;
}

function isFormValid(data: CompleteProfileFormData): boolean {
  return Object.keys(validateRequiredFields(data)).length === 0;
}

interface CompleteProfileProps {
  programTitle?: string;
  /** When provided, called after profile is saved successfully. Parent can show PaymentSuccessModal. */
  onProfileComplete?: () => void;
}

export default function CompleteProfile({
  programTitle,
  onProfileComplete,
}: CompleteProfileProps) {
  const { user } = useAuthStore();
  const profile =
    user &&
    typeof user === "object" &&
    "user" in user &&
    user.user &&
    typeof user.user === "object"
      ? (user.user as Record<string, unknown>)
      : (user as Record<string, unknown> | null);

  const [formData, setFormData] =
    useState<CompleteProfileFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CompleteProfileFormData, string>>
  >({});
  const { updateUser, isUpdating, errorMessage } = useCompleteProfile();

  // Prefill from user data when available; only fill fields that are still empty
  useEffect(() => {
    if (!profile) return;
    const prefill = getPrefillFromProfile(profile);
    if (Object.keys(prefill).length === 0) return;
    setFormData((prev) => {
      const next = { ...prev };
      (Object.keys(prefill) as (keyof CompleteProfileFormData)[]).forEach(
        (k) => {
          const value = prefill[k];
          if (
            value != null &&
            value !== "" &&
            (prev[k] == null || prev[k] === "")
          ) {
            next[k] = value;
          }
        },
      );
      return next;
    });
  }, [profile]);

  
  console.log(formData);
  console.log('profile info',profile);

  const valid = isFormValid(formData);

  const updateField = <K extends keyof CompleteProfileFormData>(
    field: K,
    value: CompleteProfileFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRequiredFields(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    const {
      skillLevel,
      gender,
      howDidYouHear,
      reasonForDecision,
      sessionOfDecision,
      referralCode,
    } = formData;
    try {
      await updateUser({
        gender,
        projectInterest: programTitle ?? "",
        skillLevel,
        session_influenced: sessionOfDecision,
        decision_influenced: reasonForDecision,
        ref: referralCode,
        find_out: howDidYouHear,
      });
      onProfileComplete?.();
    } catch {
      // errorMessage set by hook
    }
  };

  return (
    <>
      <div className="min-w-0 max-w-3xl flex-1 w-full pb-12">
        <h2 className="font-clash-display text-xl font-bold text-[#092A31]">
          Complete profile to confirm enrollment
        </h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          complete your enrollment profile
        </p>
        {errorMessage ? (
          <div className="mt-4">
            <ErrorAlert error={errorMessage} />
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 w-full">
          <div>
            <label
              htmlFor="program-paid-for"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              Program paid for
            </label>
            <div
              id="program-paid-for"
              className={cn(inputBase, "cursor-default bg-[#E8EFF1]")}
            >
              {programTitle ?? "—"}
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="skill-level"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                Your skill level
              </label>
              <Select
                value={formData.skillLevel || undefined}
                onValueChange={(value) => updateField("skillLevel", value)}
              >
                <SelectTrigger
                  id="skill-level"
                  className={cn(
                    "w-full",
                    fieldErrors.skillLevel && "border-[#AA3030]",
                  )}
                >
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVEL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.skillLevel ? (
                <p className="mt-1 text-xs text-[#AA3030]">
                  {fieldErrors.skillLevel}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                Your gender
              </label>
              <Select
                value={formData.gender || undefined}
                onValueChange={(value) => updateField("gender", value)}
              >
                <SelectTrigger
                  id="gender"
                  className={cn(
                    "w-full",
                    fieldErrors.gender && "border-[#AA3030]",
                  )}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.gender ? (
                <p className="mt-1 text-xs text-[#AA3030]">
                  {fieldErrors.gender}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="how-did-you-hear"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                How did you hear about Amdari
              </label>
              <Select
                value={formData.howDidYouHear || undefined}
                onValueChange={(value) => updateField("howDidYouHear", value)}
              >
                <SelectTrigger
                  id="how-did-you-hear"
                  className={cn(
                    "w-full",
                    fieldErrors.howDidYouHear && "border-[#AA3030]",
                  )}
                >
                  <SelectValue placeholder="Select how you found out" />
                </SelectTrigger>
                <SelectContent>
                  {HOW_DID_YOU_HEAR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.howDidYouHear ? (
                <p className="mt-1 text-xs text-[#AA3030]">
                  {fieldErrors.howDidYouHear}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="reason-for-decision"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                Reason for decision
              </label>
              <Select
                value={formData.reasonForDecision || undefined}
                onValueChange={(value) =>
                  updateField("reasonForDecision", value)
                }
              >
                <SelectTrigger
                  id="reason-for-decision"
                  className={cn(
                    "w-full",
                    fieldErrors.reasonForDecision && "border-[#AA3030]",
                  )}
                >
                  <SelectValue placeholder="Select for decision" />
                </SelectTrigger>
                <SelectContent>
                  {REASON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.reasonForDecision ? (
                <p className="mt-1 text-xs text-[#AA3030]">
                  {fieldErrors.reasonForDecision}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="session-of-decision"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                Which of our session influenced your decision
              </label>
              <Select
                value={formData.sessionOfDecision || undefined}
                onValueChange={(value) =>
                  updateField("sessionOfDecision", value)
                }
              >
                <SelectTrigger
                  id="session-of-decision"
                  className={cn(
                    "w-full",
                    fieldErrors.sessionOfDecision && "border-[#AA3030]",
                  )}
                >
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.sessionOfDecision ? (
                <p className="mt-1 text-xs text-[#AA3030]">
                  {fieldErrors.sessionOfDecision}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="referral-code"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                Referral code{" "}
                <span className="text-[#6b7280] font-normal">(Optional)</span>
              </label>
              <input
                id="referral-code"
                type="text"
                placeholder="Enter referral code"
                value={formData.referralCode}
                onChange={(e) => updateField("referralCode", e.target.value)}
                className={inputBase}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isUpdating || !valid}
            className="w-full mt-12 rounded-xl bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium disabled:opacity-70"
          >
            {isUpdating ? "Saving…" : "Complete profile"}
          </Button>
        </form>
      </div>
    </>
  );
}
