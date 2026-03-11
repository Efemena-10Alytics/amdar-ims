"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCountries } from "@/features/portfolio/use-countries";
import { useGetUserInfo } from "@/features/auth/use-get-user-info";
import { useUpdateUser } from "@/features/user/use-update-user-details";
import { portfolioInputStyle } from "./portfolio-styles";

export type PersonalInfoData = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
};

export const defaultPersonalInfo: PersonalInfoData = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "",
  phone: "",
};

type PrefillFromUser = Partial<PersonalInfoData> & {
  /** API often returns country as a name (e.g. "United States"); we resolve to code when we have countries. */
  locationName?: string;
};

function getPersonalInfoFromUser(
  user: Record<string, unknown> | null | undefined,
): PrefillFromUser {
  if (!user || typeof user !== "object") return {};
  const profile =
    "user" in user && user.user && typeof user.user === "object"
      ? (user.user as Record<string, unknown>)
      : user;
  const first = profile.firstName ?? profile.first_name ?? "";
  const last = profile.lastName ?? profile.last_name ?? "";
  const email = profile.email ?? "";
  const phone =
    profile.phone ?? profile.phone_number ?? profile.phoneNumber ?? "";
  const countryCode =
    profile.countryCode ?? profile.country_code ?? "";
  const locationName =
    profile.location ?? profile.country ?? "";
  return {
    firstName: typeof first === "string" ? first : "",
    lastName: typeof last === "string" ? last : "",
    email: typeof email === "string" ? email : "",
    countryCode: typeof countryCode === "string" ? countryCode : "",
    phone: typeof phone === "string" ? phone : "",
    locationName:
      typeof locationName === "string" ? locationName : undefined,
  };
}

const PersonalInfo = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>(
    defaultPersonalInfo,
  );
  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const { data: userInfo } = useGetUserInfo();
  const { updateUser, isUpdating, errorMessage } = useUpdateUser();
  const selectedCountry = countries.find(
    (c) => c.code === personalInfo.countryCode
  );

  useEffect(() => {
    if (!userInfo) return;
    const isEmpty =
      !personalInfo.firstName &&
      !personalInfo.lastName &&
      !personalInfo.email &&
      !personalInfo.phone &&
      !personalInfo.countryCode;
    if (!isEmpty) return;
    const prefill = getPersonalInfoFromUser(
      userInfo as Record<string, unknown>,
    );
    let countryCode = prefill.countryCode ?? "";
    if (!countryCode && prefill.locationName && countries.length > 0) {
      const byName = countries.find(
        (c) =>
          c.name === prefill.locationName ||
          c.name.localeCompare(prefill.locationName!, undefined, { sensitivity: "accent" }) === 0,
      );
      if (byName) countryCode = byName.code;
    }
    setPersonalInfo((prev) => ({
      ...prev,
      firstName: prefill.firstName ?? prev.firstName,
      lastName: prefill.lastName ?? prev.lastName,
      email: prefill.email ?? prev.email,
      phone: prefill.phone ?? prev.phone,
      countryCode: countryCode || prev.countryCode,
    }));
  }, [userInfo, countries]);

  // Resolve location name → countryCode when countries load after initial prefill
  useEffect(() => {
    if (!userInfo || countries.length === 0) return;
    const prefill = getPersonalInfoFromUser(
      userInfo as Record<string, unknown>,
    );
    if (!prefill.locationName) return;
    setPersonalInfo((prev) => {
      if (prev.countryCode) return prev;
      const byName = countries.find(
        (c) =>
          c.name === prefill.locationName ||
          c.name.localeCompare(prefill.locationName!, undefined, { sensitivity: "accent" }) === 0,
      );
      if (!byName) return prev;
      return { ...prev, countryCode: byName.code };
    });
  }, [userInfo, countries]);

  const handleSave = async () => {
    const location = selectedCountry?.name ?? personalInfo.countryCode ?? "";
    try {
      await updateUser({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        location,
        countryCode: personalInfo.countryCode,
        phone: personalInfo.phone,
      });
    } catch {
      // errorMessage set by hook
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold text-zinc-900">
        Personal Information
      </h2>
      <p className="mt-1 text-sm text-zinc-500 mb-6">
        Fill in your appropriate details below
      </p>
      <div className="grid gap-4">
        <div className="space-y-2">
          <label
            htmlFor="first-name"
            className="text-sm font-medium text-zinc-900"
          >
            First name
          </label>
          <Input
            id="first-name"
            placeholder="Enter your first name"
            value={personalInfo.firstName}
            onChange={(e) =>
              setPersonalInfo((p) => ({
                ...p,
                firstName: e.target.value,
              }))
            }
            className={portfolioInputStyle}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="last-name"
            className="text-sm font-medium text-zinc-900"
          >
            Last name
          </label>
          <Input
            id="last-name"
            placeholder="Enter your last name"
            value={personalInfo.lastName}
            onChange={(e) =>
              setPersonalInfo((p) => ({
                ...p,
                lastName: e.target.value,
              }))
            }
            className={portfolioInputStyle}
          />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-900">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={personalInfo.email}
          onChange={(e) =>
            setPersonalInfo((p) => ({ ...p, email: e.target.value }))
          }
          className={portfolioInputStyle}
        />
      </div>
      <div className="mt-4 space-y-2">
        <label htmlFor="location" className="text-sm font-medium text-zinc-900">
          Location (Country)
        </label>
        <Select
          value={personalInfo.countryCode || undefined}
          onValueChange={(value) =>
            setPersonalInfo((p) => ({ ...p, countryCode: value }))
          }
          disabled={countriesLoading}
        >
          <SelectTrigger id="location" className={portfolioInputStyle}>
            <SelectValue placeholder={countriesLoading ? "Loading…" : "Select your location"} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <span className="flex items-center gap-2">
                  <Image
                    src={c.flag}
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0 h-5 w-5 rounded-full object-cover"
                    unoptimized
                  />
                  {c.name} 
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4 space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-zinc-900">
          Phone number
        </label>
        <div className="flex rounded-lg border border-transparent bg-[#F8FAFC] overflow-hidden">
          <span className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-600 border-r border-zinc-200">
            {selectedCountry ? (
              <>
                {selectedCountry.callingCode}
                <Image
                  src={selectedCountry.flag}
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0 rounded-full h-5 w-5 object-cover"
                  unoptimized
                />
              </>
            ) : (
              "+234"
            )}
          </span>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={personalInfo.phone}
            onChange={(e) =>
              setPersonalInfo((p) => ({
                ...p,
                phone: e.target.value,
              }))
            }
            className={`${portfolioInputStyle} flex-1 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0`}
          />
        </div>
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <Button
        type="button"
        onClick={handleSave}
        disabled={isUpdating}
        className="mt-6 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
      >
        {isUpdating ? "Saving…" : "Save"}
      </Button>
    </div>
  );
};

export default PersonalInfo;
