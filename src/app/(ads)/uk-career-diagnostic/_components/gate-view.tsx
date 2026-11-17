"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import * as fpixel from "@/lib/fpixel";
import {
  COUNTRIES,
  LeadInfo,
  PHONE_LEN,
  STATUS_MESSAGES,
  buildDiagnosticSummary,
  computeDiagnosticScore,
  flagFallbackEmoji,
  guessCountryIso,
  sendDiagnosticWebhook,
} from "../data";
import { DiagnosticHeader } from "./diagnostic-header";

interface GateViewProps {
  targetRole: string;
  answers: (number | null)[];
  onBackToQuestions: () => void;
  onComplete: (lead: LeadInfo) => void;
}

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

const noopSubscribe = () => () => {};

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function GateView({
  targetRole,
  answers,
  onBackToQuestions,
  onComplete,
}: GateViewProps) {
  const detectedCountryIso = useSyncExternalStore(
    noopSubscribe,
    guessCountryIso,
    () => "GB",
  );
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  const [statusIdx, setStatusIdx] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [selectedCountryIso, setSelectedCountryIso] = useState<string | null>(
    null,
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");

  const countryIso = selectedCountryIso ?? detectedCountryIso;
  const statusMessage = prefersReducedMotion
    ? "Your score is ready. Enter your details to unlock it."
    : STATUS_MESSAGES[statusIdx];

  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const ccButtonRef = useRef<HTMLButtonElement>(null);
  const phoneWrapRef = useRef<HTMLDivElement>(null);

  // Cycle calculation status messages
  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setStatusIdx((prev) => {
        const next = prev + 1;
        if (next >= STATUS_MESSAGES.length - 1) {
          clearInterval(interval);
          return STATUS_MESSAGES.length - 1;
        }
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Close country picker on outside click or Escape
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

  const validateName = (value: string, showError: boolean): boolean => {
    const trimmed = value.trim();
    const ok = trimmed.length >= 2 && /\p{L}{2}/u.test(trimmed);
    if (showError) {
      setNameErr(ok ? "" : "Please enter your full name.");
    }
    return ok;
  };

  const validateEmail = (value: string, showError: boolean): boolean => {
    const ok =
      /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/.test(
        value.trim(),
      );
    if (showError) {
      setEmailErr(ok ? "" : "Please enter a valid email address.");
    }
    return ok;
  };

  const getPhoneParts = (digits: string, iso: string, dial: string) => {
    const national = digits.replace(/\D/g, "").replace(/^0+/, "");
    return { national, full: `+${dial}${national}`, iso };
  };

  const validatePhone = (
    digits: string,
    iso: string,
    dial: string,
    showError: boolean,
  ): boolean => {
    const { national } = getPhoneParts(digits, iso, dial);
    const [min, max] = PHONE_LEN[iso] ?? [6, 14];
    const ok = national.length >= min && national.length <= max;
    if (showError) {
      setPhoneErr(
        ok ? "" : "Please enter a valid WhatsApp number with country code.",
      );
    }
    return ok;
  };

  const handlePhoneChange = (raw: string) => {
    let nextValue = raw;
    let nextCountry = currentCountry;

    if (/^\s*\+/.test(nextValue)) {
      const digits = nextValue.replace(/\D/g, "");
      const hit = COUNTRIES.filter((c) => digits.startsWith(c.dial)).sort(
        (a, b) => b.dial.length - a.dial.length,
      )[0];
      if (hit) {
        nextCountry = hit;
        setSelectedCountryIso(hit.iso);
        nextValue = digits.slice(hit.dial.length);
      }
    }

    const cleanedDigits = nextValue.replace(/\D/g, "").slice(0, 14);
    setPhoneDigits(cleanedDigits);
    if (phoneErr) {
      setPhoneErr("");
    }
    void nextCountry;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isNameOk = validateName(name, true);
    const isEmailOk = validateEmail(email, true);
    const isPhoneOk = validatePhone(
      phoneDigits,
      currentCountry.iso,
      currentCountry.dial,
      true,
    );

    if (!isNameOk) {
      nameInputRef.current?.focus();
      return;
    }
    if (!isEmailOk) {
      emailInputRef.current?.focus();
      return;
    }
    if (!isPhoneOk) {
      phoneInputRef.current?.focus();
      return;
    }

    const leadData: LeadInfo = {
      name: name.trim(),
      email: email.trim(),
      phone: getPhoneParts(
        phoneDigits,
        currentCountry.iso,
        currentCountry.dial,
      ).full,
    };

    const result = computeDiagnosticScore(answers);
    const summary = buildDiagnosticSummary(answers);

    sendDiagnosticWebhook({
      timestamp: new Date().toISOString(),
      lead_source: "Sponsorship_Quiz_V2",
      full_name: leadData.name,
      email: leadData.email,
      whatsapp_phone: leadData.phone,
      target_role: targetRole,
      readiness_score: `${result.pct}%`,
      risk_band: result.band.label,
      diagnostic_summary: summary,
      calendly_clicked: false,
    });

    fpixel.event("Lead", {
      content_name: "UK Sponsorship Diagnostic",
      target_role: targetRole,
      score: result.pct,
      risk_band: result.band.label,
    });

    onComplete(leadData);
  };

  const inputBaseCls =
    "min-h-[54px] w-full rounded-[14px] border-[1.5px] bg-[#092A31] px-4 py-3.5 text-white placeholder:text-[#668B94] transition-[border-color,box-shadow] focus:border-[#FFE082] focus:shadow-[0_0_0_4px_rgba(255,224,130,0.18)] focus:outline-none";

  return (
    <div className="relative z-10 mx-auto w-full max-w-[760px] px-4 pb-12">
      <DiagnosticHeader
        subtag="UK Sponsorship Diagnostic"
        rightSlot={
          <span className="text-[0.85rem] font-semibold text-[#C7D5D6]">
            Final Step
          </span>
        }
      />

      {/* Calculation Card */}
      <div className="mb-4 rounded-[24px] border border-[#156374]/55 bg-[#0C3640]/90 px-5 py-6 text-center">
        <h1 className="mb-2.5 text-[clamp(1.25rem,4.2vw,1.8rem)] font-extrabold leading-[1.1] tracking-[-0.015em] text-white">
          Calculating your UK Sponsorship{" "}
          <span className="text-[#FFE082]">Readiness Score...</span>
        </h1>
        <p className="text-[0.95rem] text-[#C7D5D6]">
          Calibrating your visa runway, commercial deliverables, £41,700
          sponsorship baseline, and £50,271 5-Year ILR fast-track.
        </p>
        <div
          className="mx-auto mb-3 mt-4 h-2 max-w-[420px] overflow-hidden rounded-full bg-white/10"
          aria-hidden="true"
        >
          <b className="uk-diag-meter-fill" />
        </div>
        <p
          className="min-h-[1.4em] text-[0.92rem] font-semibold text-[#FFE082]"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      </div>

      {/* Lead Capture Panel */}
      <div className="mb-4 rounded-[24px] border border-[#FFE082]/45 bg-[#0C3640]/95 p-5 shadow-[0_0_0_6px_rgba(255,224,130,0.06)] sm:p-6">
        <h2 className="mb-1.5 text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold leading-[1.1] text-white">
          Your UK Sponsorship Readiness Score is Ready.
        </h2>
        <p className="mb-5 text-[0.95rem] text-[#C7D5D6]">
          Enter your details below to unlock your full gap breakdown and
          sponsorship roadmap.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4 grid gap-1.5">
            <label
              htmlFor="g-name"
              className="text-[0.92rem] font-semibold text-[#F2F7F7]"
            >
              Full Name
            </label>
            <input
              ref={nameInputRef}
              id="g-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Ada Okafor"
              maxLength={80}
              required
              value={name}
              aria-invalid={nameErr ? "true" : "false"}
              onChange={(e) => {
                const cleaned = e.target.value
                  .replace(/[^\p{L}\p{M}\s.'’-]/gu, "")
                  .replace(/\s{2,}/g, " ");
                setName(cleaned);
                if (nameErr) setNameErr("");
              }}
              className={`${inputBaseCls} ${
                nameErr ? "border-[#FF8F78]" : "border-[#156374]/70"
              }`}
            />
            <div className="min-h-[1.1em] text-[0.84rem] font-medium text-[#FF8F78]">
              {nameErr}
            </div>
          </div>

          <div className="mb-4 grid gap-1.5">
            <label
              htmlFor="g-email"
              className="text-[0.92rem] font-semibold text-[#F2F7F7]"
            >
              Email Address
            </label>
            <input
              ref={emailInputRef}
              id="g-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="e.g. ada@example.com"
              maxLength={120}
              required
              value={email}
              aria-invalid={emailErr ? "true" : "false"}
              onChange={(e) => {
                setEmail(e.target.value.replace(/\s/g, ""));
                if (emailErr) setEmailErr("");
              }}
              onBlur={() => {
                if (email) validateEmail(email, true);
              }}
              className={`${inputBaseCls} ${
                emailErr ? "border-[#FF8F78]" : "border-[#156374]/70"
              }`}
            />
            <div className="min-h-[1.1em] text-[0.84rem] font-medium text-[#FF8F78]">
              {emailErr}
            </div>
          </div>

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
                ref={phoneInputRef}
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
                  if (phoneDigits) {
                    validatePhone(
                      phoneDigits,
                      currentCountry.iso,
                      currentCountry.dial,
                      true,
                    );
                  }
                }}
                className={`${inputBaseCls} ${
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
                              setSelectedCountryIso(c.iso);
                              setDropdownOpen(false);
                              phoneInputRef.current?.focus();
                              if (phoneDigits) {
                                validatePhone(phoneDigits, c.iso, c.dial, false);
                              }
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
            <span className="text-[0.82rem] text-[#8EB7BE]">
              Include country code (e.g. +44 for UK, +234 for Nigeria, +353 for
              Ireland).
            </span>
            <div className="min-h-[1.1em] text-[0.84rem] font-medium text-[#FF8F78]">
              {phoneErr}
            </div>
          </div>

          <button
            type="submit"
            className="uk-diag-btn uk-diag-cta-pulse mt-2 w-full"
          >
            See My Sponsorship Score <span className="arr">&rarr;</span>
          </button>

          <p className="mt-4 text-[0.82rem] leading-[1.45] text-[#8EB7BE]">
            By continuing you agree that Amdari may contact you by email and
            WhatsApp about your report and career sessions. We respect your
            privacy.
          </p>
        </form>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={onBackToQuestions}
          className="cursor-pointer py-2 text-[0.92rem] text-[#C7D5D6] underline hover:text-white"
        >
          &larr; Back to questions
        </button>
      </div>
    </div>
  );
}
