"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppleSvg, GoogleSvg, LinkedInSvg } from "@/components/_core/auth/svg";
import ErrorAlert from "@/components/_core/auth/error-alert";
import { useSignUp } from "@/features/auth/use-sign-up";
import {
  defaultSignUpFormData,
  type SignUpFormData,
} from "@/components/_core/auth/sign-up/types";

const inputBase = cn(
  "w-full rounded-lg bg-[#F8FAFC] text-sm placeholder:text-[#94A3B8] px-4 py-3 text-[#092A31] border border-transparent",
  "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0",
);

const COUNTRY_OPTIONS = [
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Other", code: "", flag: "🌐" },
] as const;

const PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "Contains at least 8 character",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "upper",
    label: "One upper case",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "One lower case",
    test: (p: string) => /[a-z]/.test(p),
  },
  {
    id: "special",
    label: "One special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
] as const;

export interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when user clicks "Login" link – if provided, modal closes and this runs (e.g. open sign-in modal). */
  onLoginClick?: () => void;
  /** Called when sign-up succeeds (e.g. to show OTP after profile complete). */
  onSignUpSuccess?: () => void;
  /** When set, modal will write this key to sessionStorage on sign-up success (e.g. so payment flow can show OTP after profile). */
  paymentShowOtpStorageKey?: string;
}

export function SignUpModal({
  open,
  onOpenChange,
  onLoginClick,
  onSignUpSuccess,
  paymentShowOtpStorageKey,
}: SignUpModalProps) {
  const { signUp, isSigningUp, errorMessage, clearError } = useSignUp();
  const [formData, setFormData] = useState<SignUpFormData>(
    defaultSignUpFormData,
  );

  const selectedCountry = COUNTRY_OPTIONS.find(
    (c) => c.name === formData.selectedCountryName,
  );
  const passwordsMatch =
    formData.confirmPassword === "" ||
    formData.password === formData.confirmPassword;
  const showMatchError = formData.confirmPassword.length > 0 && !passwordsMatch;

  const requirementStatus = useMemo(
    () =>
      PASSWORD_REQUIREMENTS.map((r) => ({
        ...r,
        met: r.test(formData.password ?? ""),
      })),
    [formData.password],
  );
  const allRequirementsMet = requirementStatus.every((r) => r.met);

  const isPersonalComplete =
    formData.firstName.trim().length > 0 &&
    formData.lastName.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.selectedCountryName.length > 0 &&
    formData.phone.trim().length > 0;
  const canSubmit =
    isPersonalComplete &&
    allRequirementsMet &&
    passwordsMatch &&
    !showMatchError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await signUp(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
          password_confirmation: formData.password,
          location: formData.selectedCountryName,
        },
        undefined,
        undefined,
        { skipRedirect: true }
      );
      if (paymentShowOtpStorageKey && typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(paymentShowOtpStorageKey, "1");
      }
      onSignUpSuccess?.();
      onOpenChange(false);
    } catch {
      // errorMessage set by hook
    }
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    if (onLoginClick) {
      e.preventDefault();
      onOpenChange(false);
      onLoginClick();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-110 w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden border border-gray-200 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Create an account</DialogTitle>
        <div className="p-6">
          <div className="flex flex-col gap-2 mb-1">
            <h2 className="text-2xl font-semibold text-[#092A31]">
              Create an account
            </h2>
            {errorMessage ? <ErrorAlert error={errorMessage} /> : null}
          </div>

          <p className="text-sm text-[#64748B] mb-4">
            Fill in your appropriate details below
          </p>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="sign-up-modal-firstName"
                  className="block text-sm font-medium text-[#092A31] mb-1.5"
                >
                  First name
                </label>
                <input
                  id="sign-up-modal-firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  className={inputBase}
                />
              </div>
              <div>
                <label
                  htmlFor="sign-up-modal-lastName"
                  className="block text-sm font-medium text-[#092A31] mb-1.5"
                >
                  Last name
                </label>
                <input
                  id="sign-up-modal-lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  className={inputBase}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sign-up-modal-email"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                Email
              </label>
              <input
                id="sign-up-modal-email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#092A31] mb-1.5">
                Location (Country)
              </label>
              <Select
                value={formData.selectedCountryName || undefined}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedCountryName: value,
                  }))
                }
              >
                <SelectTrigger className={cn(inputBase, "h-auto py-3")}>
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="sign-up-modal-phone"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                Phone number
              </label>
              <div className="flex rounded-lg overflow-hidden border border-transparent focus-within:ring-2 focus-within:ring-[#156374] focus-within:ring-offset-0 bg-[#F8FAFC]">
                <div className="flex items-center gap-2 px-4 py-3 bg-[#F8FAFC] border-r border-gray-200 text-[#092A31] text-sm shrink-0">
                  {selectedCountry ? (
                    <>
                      <span className="text-base" aria-hidden>
                        {selectedCountry.flag}
                      </span>
                      <span>{selectedCountry.code || "—"}</span>
                    </>
                  ) : (
                    <span className="text-[#94A3B8]">—</span>
                  )}
                </div>
                <input
                  id="sign-up-modal-phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className={cn(
                    "flex-1 min-w-0 rounded-r-lg bg-[#F8FAFC] text-sm placeholder:text-[#94A3B8] px-4 py-3 border-0 focus:ring-0 focus:outline-none",
                  )}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sign-up-modal-password"
                className="block text-sm font-medium text-[#092A31] mb-1.5"
              >
                Create password
              </label>
              <div className="relative">
                <input
                  id="sign-up-modal-password"
                  type={formData.showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className={cn(inputBase, "pr-12")}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      showPassword: !prev.showPassword,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#092A31] p-1"
                  aria-label={
                    formData.showPassword ? "Hide password" : "Show password"
                  }
                >
                  {formData.showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>



            <Button
              type="submit"
              disabled={!canSubmit || isSigningUp}
              className="w-full rounded-lg bg-[#0F4652] hover:bg-[#0d3d47] text-white h-11 text-base font-medium disabled:opacity-70"
            >
              {isSigningUp ? "Signing up…" : "Create an account"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-[#E8EFF1] rounded-lg border-[#B6CFD4] text-primary hover:bg-[#156374]/5 h-11"
              onClick={handleLoginClick}
            >
              Login
            </Button>
          </form>

          <div className="mt-4 flex justify-center gap-4">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] border border-gray-100 text-[#092A31] hover:bg-gray-50 transition-colors"
              aria-label="Sign up with Google"
            >
              <GoogleSvg />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] border border-gray-100 text-[#092A31] hover:bg-gray-50 transition-colors"
              aria-label="Sign up with Apple"
            >
              <AppleSvg />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] border border-gray-100 text-[#0A66C2] hover:bg-gray-50 transition-colors"
              aria-label="Sign up with LinkedIn"
            >
              <LinkedInSvg />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignUpModal;
