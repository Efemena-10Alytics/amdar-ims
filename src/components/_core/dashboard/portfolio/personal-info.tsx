"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCountries } from "@/features/portfolio/use-countries";
import { portfolioInputStyle } from ".";

export type PersonalInfoData = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
};

type PersonalInfoProps = {
  value: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
};

const PersonalInfo = ({ value: personalInfo, onChange }: PersonalInfoProps) => {
  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const setPersonalInfo = (fn: (prev: PersonalInfoData) => PersonalInfoData) =>
    onChange(fn(personalInfo));
  const selectedCountry = countries.find(
    (c) => c.code === personalInfo.countryCode
  );
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
                  {c.name} ({c.callingCode})
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
    </div>
  );
};

export default PersonalInfo;
