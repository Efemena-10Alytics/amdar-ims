"use client";

import React, { useMemo, useRef, useState, useSyncExternalStore } from "react";
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
  CvEvaluation,
  buildCvDiagnosticSummary,
  saveCvCheckerState,
} from "../cv-engine";

interface CvGateViewProps {
  evaluation: CvEvaluation;
  cvFileName: string;
  cvFileType: string;
  getCvBase64: () => Promise<string>;
  onComplete: () => void;
}

const noopSubscribe = () => () => {};

export function CvGateView({
  evaluation,
  cvFileName,
  cvFileType,
  getCvBase64,
  onComplete,
}: CvGateViewProps) {
  const detectedCountryIso = useSyncExternalStore(
    noopSubscribe,
    guessCountryIso,
    () => "GB",
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [selectedCountryIso, setSelectedCountryIso] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  const countryIso = selectedCountryIso ?? detectedCountryIso;

  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

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

    setSubmitting(true);
    const leadData: LeadInfo = {
      name: name.trim(),
      email: email.trim(),
      phone: getFormattedPhone(
        phoneDigits,
        currentCountry.iso,
        currentCountry.dial,
      ).full,
    };

    const cvBase64 = await getCvBase64();

    void sendDiagnosticWebhook(
      {
        timestamp: new Date().toISOString(),
        lead_source: "CV_Checker",
        full_name: leadData.name,
        email: leadData.email,
        whatsapp_phone: leadData.phone,
        target_role: evaluation.role,
        readiness_score: `${evaluation.score}%`,
        risk_band: evaluation.riskBand,
        diagnostic_summary: buildCvDiagnosticSummary(evaluation),
        cv_file_name: cvFileName || "Candidate_CV.pdf",
        cv_file_type: cvFileType || "application/pdf",
        cv_file_base64: cvBase64,
        calendly_clicked: false,
      },
      { enableIframeFallback: true },
    );

    fpixel.event("Lead", {
      content_name: "CV Checker Report Unlock",
      target_role: evaluation.role,
      score: evaluation.score,
      risk_band: evaluation.riskBand,
    });

    saveCvCheckerState({
      evaluation,
      lead: leadData,
      cvFileName: cvFileName || "Candidate_CV.pdf",
      cvFileType: cvFileType || "application/pdf",
      cvFileBase64: cvBase64,
    });

    onComplete();
  };

  const inputBaseCls =
    "min-h-[54px] w-full rounded-[14px] border-[1.5px] bg-[#092A31] px-4 py-3.5 text-white placeholder:text-[#668B94] transition-[border-color,box-shadow] focus:border-[#FFE082] focus:shadow-[0_0_0_4px_rgba(255,224,130,0.18)] focus:outline-none";

  return (
    <div className="relative z-10 mx-auto w-full max-w-[760px] px-4 pb-12">
      <DiagnosticHeader
        subtag="Sponsorship Audit Ready"
        rightSlot={
          <span className="text-[0.85rem] font-semibold text-[#C7D5D6]">
            Final Step
          </span>
        }
      />

      <div className="mb-4 rounded-[24px] border border-[#FFE082]/45 bg-[#0C3640]/95 p-5 shadow-[0_0_0_6px_rgba(255,224,130,0.06)] sm:p-6">
        <span className="mb-2 inline-block text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#FFE082]">
          Analysis Complete
        </span>
        <h2 className="mb-2 text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold leading-[1.1] text-white">
          Your UK Sponsorship &amp; CV Audit is Ready.
        </h2>
        <p className="mb-5 text-[0.95rem] text-[#C7D5D6]">
          Enter your details below to unlock your full sponsorability scorecard,
          top 3 missing signals, and receive an automated email copy.
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
            hintText="Include country code (e.g. +44 for UK, +234 for Nigeria, +91 for India)."
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
            disabled={submitting}
            className="uk-diag-btn uk-diag-cta-pulse mt-2 w-full disabled:opacity-75"
          >
            Unlock My Sponsorship Report <span className="arr">&rarr;</span>
          </button>

          <p className="mt-4 text-[0.82rem] leading-[1.45] text-[#8EB7BE]">
            We will also email a copy of your full report and gap analysis to
            your inbox for reference during consultant sessions.
          </p>
        </form>
      </div>
    </div>
  );
}
