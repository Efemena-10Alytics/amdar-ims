"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import * as fpixel from "@/lib/fpixel";
import {
  COUNTRIES,
  LeadInfo,
  getFormattedPhone,
  guessCountryIso,
  isValidEmailAddress,
  isValidFullName,
  isValidWhatsAppPhone,
  sanitizeFullName,
  sendDiagnosticWebhook,
} from "../../_diagnostic-shared/countries";
import { CountryPhoneField } from "../../_diagnostic-shared/country-phone-field";
import { DiagnosticHeader } from "../../_diagnostic-shared/diagnostic-header";
import {
  STATUS_MESSAGES,
  buildDiagnosticSummary,
  computeDiagnosticScore,
} from "../data";

interface GateViewProps {
  targetRole: string;
  answers: (number | null)[];
  onBackToQuestions: () => void;
  onComplete: (lead: LeadInfo) => void;
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

  const currentCountry = useMemo(
    () => COUNTRIES.find((c) => c.iso === countryIso) ?? COUNTRIES[0],
    [countryIso],
  );

  const validateName = (value: string, showError: boolean): boolean => {
    const ok = isValidFullName(value);
    if (showError) setNameErr(ok ? "" : "Please enter your full name.");
    return ok;
  };

  const validateEmail = (value: string, showError: boolean): boolean => {
    const ok = isValidEmailAddress(value);
    if (showError) setEmailErr(ok ? "" : "Please enter a valid email address.");
    return ok;
  };

  const validatePhone = (
    digits: string,
    iso: string,
    dial: string,
    showError: boolean,
  ): boolean => {
    const ok = isValidWhatsAppPhone(digits, iso, dial);
    if (showError) {
      setPhoneErr(
        ok ? "" : "Please enter a valid WhatsApp number with country code.",
      );
    }
    return ok;
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
      phone: getFormattedPhone(
        phoneDigits,
        currentCountry.iso,
        currentCountry.dial,
      ).full,
    };

    const result = computeDiagnosticScore(answers);
    const summary = buildDiagnosticSummary(answers);

    void sendDiagnosticWebhook({
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
                setName(sanitizeFullName(e.target.value));
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

          <CountryPhoneField
            inputRef={phoneInputRef}
            phoneDigits={phoneDigits}
            countryIso={countryIso}
            phoneErr={phoneErr}
            hintText="Include country code (e.g. +44 for UK, +234 for Nigeria, +353 for Ireland)."
            inputCls={inputBaseCls}
            onPhoneDigitsChange={setPhoneDigits}
            onCountryChange={(country) => {
              setSelectedCountryIso(country.iso);
              if (phoneDigits) {
                validatePhone(phoneDigits, country.iso, country.dial, false);
              }
            }}
            onClearError={() => setPhoneErr("")}
            onBlurValidate={() =>
              validatePhone(
                phoneDigits,
                currentCountry.iso,
                currentCountry.dial,
                true,
              )
            }
          />

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
