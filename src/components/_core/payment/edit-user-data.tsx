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

interface EditUserDataProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<PersonalDataForm> | null;
  onSave?: (data: PersonalDataForm) => void;
}

export function EditUserData({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditUserDataProps) {
  const [form, setForm] = useState<PersonalDataForm>(defaultForm);

  useEffect(() => {
    if (open) {
      setForm({
        firstName: initialData?.firstName ?? defaultForm.firstName,
        lastName: initialData?.lastName ?? defaultForm.lastName,
        email: initialData?.email ?? defaultForm.email,
        location: initialData?.location ?? defaultForm.location,
        countryCode: initialData?.countryCode ?? defaultForm.countryCode,
        phone: initialData?.phone ?? defaultForm.phone,
      });
    }
  }, [open, initialData]);

  const isFormComplete =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.location.length > 0 &&
    form.phone.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(form);
    onOpenChange(false);
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
                setForm((prev) => ({ ...prev, location: value }))
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
                value={form.countryCode}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, countryCode: value }))
                }
              >
                <SelectTrigger className="w-30 shrink-0 rounded-none border-0 border-r border-gray-200 bg-[#F8FAFC] py-3 h-auto focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((c) => (
                    <SelectItem key={c.name} value={c.code || c.name}>
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

          <Button
            type="submit"
            disabled={!isFormComplete}
            className="w-full h-12 text-base font-semibold rounded-lg bg-[#0F4652] hover:bg-[#0d3d47] text-white disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserData;
