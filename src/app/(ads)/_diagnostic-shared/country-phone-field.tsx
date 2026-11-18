"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  COUNTRIES,
  CountryDialOption,
  flagFallbackEmoji,
} from "./countries";

function CountryFlag({ iso }: { iso: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-[1.1rem] leading-none" aria-hidden="true">
        {flagFallbackEmoji(iso)}
      </span>
    );
  }

  return (
    <Image
      src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
      alt=""
      width={24}
      height={18}
      className="h-[18px] w-6 flex-none rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
      onError={() => setFailed(true)}
    />
  );
}

interface CountryPhoneFieldProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  phoneDigits: string;
  countryIso: string;
  phoneErr: string;
  hintText: string;
  inputCls: string;
  onPhoneDigitsChange: (digits: string) => void;
  onCountryChange: (country: CountryDialOption) => void;
  onClearError: () => void;
  onBlurValidate: () => void;
}

export function CountryPhoneField({
  inputRef,
  phoneDigits,
  countryIso,
  phoneErr,
  hintText,
  inputCls,
  onPhoneDigitsChange,
  onCountryChange,
  onClearError,
  onBlurValidate,
}: CountryPhoneFieldProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const ccButtonRef = useRef<HTMLButtonElement>(null);
  const phoneWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        phoneWrapRef.current &&
        !phoneWrapRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        ccButtonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (dropdownOpen) {
      const id = setTimeout(() => searchInputRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [dropdownOpen]);

  const currentCountry = useMemo(
    () => COUNTRIES.find((c) => c.iso === countryIso) ?? COUNTRIES[0],
    [countryIso],
  );

  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.startsWith(q) ||
        c.iso.toLowerCase() === q,
    );
  }, [countryQuery]);

  const handlePhoneChange = (raw: string) => {
    let nextValue = raw;
    if (/^\s*\+/.test(nextValue)) {
      const digits = nextValue.replace(/\D/g, "");
      const hit = COUNTRIES.filter((c) => digits.startsWith(c.dial)).sort(
        (a, b) => b.dial.length - a.dial.length,
      )[0];
      if (hit) {
        onCountryChange(hit);
        nextValue = digits.slice(hit.dial.length);
      }
    }
    onPhoneDigitsChange(nextValue.replace(/\D/g, "").slice(0, 14));
    if (phoneErr) onClearError();
  };

  return (
    <div className="mb-4 grid gap-1.5">
      <label
        htmlFor="g-phone"
        className="text-[0.92rem] font-semibold text-[#F2F7F7]"
      >
        WhatsApp Phone Number
      </label>
      <div className="relative flex gap-2" ref={phoneWrapRef}>
        <button
          ref={ccButtonRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
          aria-label={`Country code: ${currentCountry.name} +${currentCountry.dial}`}
          onClick={() => {
            setCountryQuery("");
            setDropdownOpen((prev) => !prev);
          }}
          className={`flex min-h-[54px] flex-none cursor-pointer items-center gap-2 rounded-[14px] border-[1.5px] bg-[#092A31] px-3 text-[0.98rem] font-semibold text-white transition-colors ${
            dropdownOpen
              ? "border-[#FFE082]"
              : "border-[#156374]/70 hover:border-[#FFE082]"
          }`}
        >
          <CountryFlag iso={currentCountry.iso} />
          <span>+{currentCountry.dial}</span>
          <span
            aria-hidden="true"
            className="-mt-0.5 ml-0.5 h-[7px] w-[7px] rotate-45 border-b-2 border-r-2 border-[#FFE082]"
          />
        </button>

        <input
          ref={inputRef}
          id="g-phone"
          name="phone"
          type="tel"
          autoComplete="tel-national"
          inputMode="numeric"
          placeholder="7700 900123"
          required
          value={phoneDigits}
          aria-invalid={phoneErr ? "true" : "false"}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key.length === 1 &&
              !/\d/.test(e.key) &&
              !e.ctrlKey &&
              !e.metaKey &&
              e.key !== "+"
            ) {
              e.preventDefault();
            }
          }}
          onBlur={() => {
            if (phoneDigits) onBlurValidate();
          }}
          className={`${inputCls} ${
            phoneErr ? "border-[#FF8F78]" : "border-[#156374]/70"
          }`}
        />

        {dropdownOpen ? (
          <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-[min(100%,360px)] overflow-hidden rounded-[16px] border-[1.5px] border-[#FFE082]/45 bg-[#092A31] shadow-[0_24px_50px_-10px_rgba(0,0,0,0.65)]">
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search country or code"
              aria-label="Search country"
              value={countryQuery}
              onChange={(e) => setCountryQuery(e.target.value)}
              className="min-h-[48px] w-full border-0 border-b border-[#156374]/55 bg-transparent px-4 py-2.5 text-white placeholder:text-[#668B94] focus:outline-none"
            />
            <ul
              role="listbox"
              className="max-h-[260px] list-none overflow-y-auto"
            >
              {filteredCountries.length ? (
                filteredCountries.map((c) => {
                  const selected = c.iso === currentCountry.iso;
                  return (
                    <li
                      key={`${c.iso}-${c.name}`}
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        onCountryChange(c);
                        setDropdownOpen(false);
                        inputRef.current?.focus();
                      }}
                      className={`flex cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-[0.94rem] text-white transition-colors hover:bg-[#FFE082]/12 ${
                        selected ? "bg-[#FFE082]/12" : ""
                      }`}
                    >
                      <CountryFlag iso={c.iso} />
                      <span>{c.name}</span>
                      <b className="ml-auto font-medium text-[#8EB7BE]">
                        +{c.dial}
                      </b>
                    </li>
                  );
                })
              ) : (
                <li
                  role="option"
                  aria-selected={false}
                  aria-disabled="true"
                  className="px-3.5 py-3 text-[0.9rem] text-[#8EB7BE]"
                >
                  No match
                </li>
              )}
            </ul>
          </div>
        ) : null}
      </div>
      <span className="text-[0.82rem] text-[#8EB7BE]">{hintText}</span>
      <div className="min-h-[1.1em] text-[0.84rem] font-medium text-[#FF8F78]">
        {phoneErr}
      </div>
    </div>
  );
}
