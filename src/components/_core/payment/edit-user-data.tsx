"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUser } from "@/features/payment/use-update-user";

const inputBase = cn(
  "w-full rounded-lg bg-[#F8FAFC] text-sm placeholder:text-xs px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8] border border-transparent",
  "focus:outline-none focus:ring-2 focus:ring-[#156374] focus:ring-offset-0 focus:border-transparent",
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

function getCountryCodeForCountry(countryName: string): string {
  const option = COUNTRY_OPTIONS.find((c) => c.name === countryName);
  return option?.code ?? "+234";
}

/** Remove the country code from the start of phone if it matches (e.g. +2347069261508 → 7069261508). */
export function stripCountryCodeFromPhone(
  phone: string,
  countryCode: string,
): string {
  if (!phone?.trim() || !countryCode?.trim()) return phone?.trim() ?? "";
  const trimmed = phone.trim();
  const codeWithPlus = countryCode.trim().startsWith("+")
    ? countryCode.trim()
    : `+${countryCode.trim()}`;
  const codeWithoutPlus = codeWithPlus.slice(1);
  if (trimmed.startsWith(codeWithPlus))
    return trimmed.slice(codeWithPlus.length).trim();
  if (trimmed.startsWith(codeWithoutPlus))
    return trimmed.slice(codeWithoutPlus.length).trim();
  return trimmed;
}

export { getCountryCodeForCountry };

export type PersonalDataForm = {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  countryCode: string;
  phone: string;
};

const defaultForm: PersonalDataForm = {
  firstName: "",
  lastName: "",
  email: "",
  location: "",
  countryCode: "+234",
  phone: "",
};

/** Phone country is stored by name so US and Canada both show uniquely (same +1 code). */
type FormState = PersonalDataForm & { phoneCountry: string };

interface EditUserDataProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<PersonalDataForm> | null;
}

export function EditUserData({
  open,
  onOpenChange,
  initialData,
}: EditUserDataProps) {
  const [form, setForm] = useState<FormState>({
    ...defaultForm,
    phoneCountry: "",
  });
  const { updateUser, isUpdating, errorMessage } = useUpdateUser();

  useEffect(() => {
    if (open) {
      const location = initialData?.location ?? defaultForm.location;
      const countryCode =
        initialData?.countryCode ?? getCountryCodeForCountry(location);
      const rawPhone = initialData?.phone ?? defaultForm.phone;
      const phone = stripCountryCodeFromPhone(rawPhone, countryCode);
      setForm({
        firstName: initialData?.firstName ?? defaultForm.firstName,
        lastName: initialData?.lastName ?? defaultForm.lastName,
        email: initialData?.email ?? defaultForm.email,
        location,
        countryCode,
        phone,
        phoneCountry: location,
      });
    }
  }, [open, initialData]);

  const isFormComplete =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.location.length > 0 &&
    form.phone.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { phoneCountry: _, ...data } = form;
    try {
      await updateUser(data);
      onOpenChange(false);
    } catch {
      // errorMessage set by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg rounded-2xl border border-gray-200/80 shadow-lg bg-white p-6"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#092A31] font-clash-display">
            Personal data
          </DialogTitle>
          <DialogDescription className="text-sm text-[#64748B]">
            Edit personal data here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="edit-firstName"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              First name
            </label>
            <input
              id="edit-firstName"
              type="text"
              placeholder="Enter your first name."
              value={form.firstName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className={inputBase}
            />
          </div>

          <div>
            <label
              htmlFor="edit-lastName"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              Last name
            </label>
            <input
              id="edit-lastName"
              type="text"
              placeholder="Enter your last name."
              value={form.lastName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className={inputBase}
            />
          </div>

          <div>
            <label
              htmlFor="edit-email"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              placeholder="Enter your email address."
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className={inputBase}
            />
          </div>

          <div>
            <label
              htmlFor="edit-location"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              Location (Country)
            </label>
            <Select
              value={form.location || undefined}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  location: value,
                  phoneCountry: value,
                  countryCode: getCountryCodeForCountry(value),
                }))
              }
            >
              <SelectTrigger
                id="edit-location"
                className={inputBase + " h-auto py-3"}
              >
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
              htmlFor="edit-phone"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              Phone number
            </label>
            <div className="flex rounded-lg overflow-hidden border border-transparent focus-within:ring-2 focus-within:ring-[#156374] focus-within:ring-offset-0 bg-[#F8FAFC]">
              <Select
                value={form.phoneCountry || undefined}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    phoneCountry: value,
                    countryCode: getCountryCodeForCountry(value),
                  }))
                }
              >
                <SelectTrigger className="w-30 shrink-0 rounded-none border-0 border-r border-gray-200 bg-[#F8FAFC] py-3 h-auto focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      <span className="flex items-center gap-2">
                        <span aria-hidden>{c.flag}</span>
                        <span>{c.code || "—"}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                id="edit-phone"
                type="tel"
                placeholder="Your phone number"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={cn(
                  "flex-1 min-w-0 rounded-r-lg bg-[#F8FAFC] text-sm placeholder:text-xs px-4 py-3 text-[#092A31] placeholder:text-[#94A3B8]",
                  "focus:outline-none focus:ring-0 border-0",
                )}
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
          <Button
            type="submit"
            disabled={!isFormComplete || isUpdating}
            className="w-full h-12 text-base font-semibold rounded-lg bg-[#0F4652] hover:bg-[#0d3d47] text-white disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isUpdating ? "Saving…" : "Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserData;
