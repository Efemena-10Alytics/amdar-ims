"use client";

import { ChevronDown } from "lucide-react";
import { AppleSvg, GoogleSvg, LinkedInSvg } from "@/components/_core/auth/svg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SignUpFormData } from "./types";
import Link from "next/link";

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

export interface PersonalInfoProps {
  formData: SignUpFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>>;
  onContinue?: () => void;
}

const PersonalInfo = ({
  formData,
  setFormData,
  onContinue,
}: PersonalInfoProps) => {
  const { firstName, lastName, email, phone, selectedCountryName } = formData;
  const selectedCountry = COUNTRY_OPTIONS.find(
    (c) => c.name === selectedCountryName,
  );

  const isFormComplete =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    selectedCountryName.length > 0 &&
    phone.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue?.();
  };

  return (
    <div className="rounded-2xl w-full bg-white p-3 2xl:p-5 border border-gray-100">
      <h2 className="text-xl font-semibold text-[#092A31]">
        Personal Information
      </h2>
      <p className="mt-1 text-sm text-[#64748B]">
        Fill in your appropriate details below
      </p>

      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              First name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className={inputBase}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className={inputBase}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={inputBase}
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-[#092A31] mb-1.5"
            >
              Location (Country)
            </label>
            <div className="relative">
              <select
                id="location"
                className={cn(
                  inputBase,
                  "appearance-none pr-10 cursor-pointer tex-xs",
                  "bg-[#F8FAFC]",
                )}
                value={selectedCountryName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedCountryName: e.target.value,
                  }))
                }
              >
                <option value="" disabled>
                  Select your location
                </option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.name} value={c.name} className="text-sm">
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B] pointer-events-none"
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-[#092A31] mb-1.5"
          >
            Phone number
          </label>
          <div className="flex rounded-lg overflow-hidden border border-transparent focus-within:ring-2 focus-within:ring-[#156374] focus-within:ring-offset-0 bg-[#F8FAFC]">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#F8FAFC] border-r border-gray-200 text-[#092A31] text-sm">
              {selectedCountry ? (
                <>
                  <span className="text-base" aria-hidden>
                    {selectedCountry.flag}
                  </span>
                  <span>{selectedCountry.code || "—"}</span>
                </>
              ) : (
                <span className="text-[#94A3B8] text-sm"></span>
              )}
            </div>
            <input
              id="phone"
              type="tel"
              placeholder="Your phone number"
              value={phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
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
          className="w-full rounded-xl mt-3 bg-[#0F4652] hover:bg-[#0d3d47] text-white h-12 text-base font-medium disabled:opacity-50 disabled:pointer-events-none"
        >
          Continue
        </Button>
      </form>

      {/* Social login */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] border border-gray-100 text-[#092A31] hover:bg-gray-50 transition-colors"
          aria-label="Continue with Google"
        >
          <GoogleSvg />
        </button>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] border border-gray-100 text-[#092A31] hover:bg-gray-50 transition-colors"
          aria-label="Continue with Apple"
        >
          <AppleSvg />
        </button>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC] border border-gray-100 text-[#0A66C2] hover:bg-gray-50 transition-colors"
          aria-label="Continue with LinkedIn"
        >
          <LinkedInSvg />
        </button>
      </div>

      <div className="text-center text-[#334155] mt-2 pb-3 text-sm">
        Already have have an account? {" "}
        <Link
          href={"/auth/sign-in"}
          role="button"
          className="text-[#156374] cursor-pointer"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default PersonalInfo;
