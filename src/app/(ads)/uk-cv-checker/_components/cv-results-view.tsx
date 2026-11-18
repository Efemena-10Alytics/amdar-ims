"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fpixel from "@/lib/fpixel";
import {
  DIAGNOSTIC_CONFIG,
  sendDiagnosticWebhook,
} from "../../_diagnostic-shared/countries";
import { DiagnosticHeader } from "../../_diagnostic-shared/diagnostic-header";
import {
  StickyCtaBar,
  useStickyCtaVisibility,
} from "../../_diagnostic-shared/sticky-cta";
import {
  REBUILD_STEPS,
  SCORECARD_PILLARS,
  StoredCvCheckerState,
  buildCvDiagnosticSummary,
  getLatestCvBase64,
} from "../cv-engine";

interface CvResultsViewProps {
  state: StoredCvCheckerState;
  onUploadAnother: () => void;
}

export function CvResultsView({
  state,
  onUploadAnother,
}: CvResultsViewProps) {
  const [animated, setAnimated] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const topCtaRef = useRef<HTMLElement>(null);
  const endCtaRef = useRef<HTMLElement>(null);
  const showSticky = useStickyCtaVisibility(topCtaRef, endCtaRef);

  const { evaluation: r, lead } = state;
  const firstName = lead.name.split(/\s+/)[0] || "There";
  const isBlocked = r.score < 70;
  const strokeColor =
    r.score < 40 ? "#FF8F78" : r.score < 70 ? "#FFE082" : "#72D9B4";
  const chipColorCls =
    r.score < 40
      ? "text-[#FF8F78]"
      : r.score < 70
        ? "text-[#FFE082]"
        : "text-[#72D9B4]";

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setAnimated(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, []);

  const handleBookingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    void sendDiagnosticWebhook(
      {
        timestamp: new Date().toISOString(),
        lead_source: "CV_Checker",
        full_name: lead.name,
        email: lead.email,
        whatsapp_phone: lead.phone,
        target_role: r.role,
        readiness_score: `${r.score}%`,
        risk_band: r.riskBand,
        diagnostic_summary: buildCvDiagnosticSummary(r),
        cv_file_name: state.cvFileName || "Candidate_CV.pdf",
        cv_file_type: state.cvFileType || "application/pdf",
        cv_file_base64: state.cvFileBase64 || getLatestCvBase64(),
        calendly_clicked: true,
      },
      { enableIframeFallback: true },
    );

    fpixel.event("Schedule", {
      content_name: "CV Strategy Session",
      target_role: r.role,
      score: r.score,
    });

    if (!DIAGNOSTIC_CONFIG.BOOKING_URL) {
      e.preventDefault();
      setBookingConfirmed(true);
    }
  };

  const circumference = 2 * Math.PI * 52;
  const targetOffset = circumference * (1 - r.score / 100);

  const renderCtaButton = () => (
    <a
      href={DIAGNOSTIC_CONFIG.BOOKING_URL || "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleBookingClick}
      className="uk-diag-btn uk-diag-cta-pulse w-full"
    >
      Book a Free Consultation <span className="arr">&rarr;</span>
    </a>
  );

  const confirmationBox = (
    <div className="rounded-[16px] border-[1.5px] border-[#FFE082] bg-[#FFE082]/10 p-4 text-[#F2F7F7]">
      <strong>Request received, {firstName}!</strong>
      <p className="mt-1.5 text-[0.95rem]">
        A Senior Career Consultant will contact you on WhatsApp at{" "}
        <strong>{lead.phone}</strong> within 2 hours to confirm your session
        slot and send your onboarding pack.
      </p>
    </div>
  );

  return (
    <>
      <div className="relative z-10 mx-auto w-full max-w-[760px] px-4 pb-12">
        <DiagnosticHeader
          subtag="UK CV Sponsorship Audit"
          rightSlot={
            <button
              type="button"
              onClick={onUploadAnother}
              className="cursor-pointer py-1.5 text-[0.92rem] text-[#C7D5D6] underline hover:text-white"
            >
              Upload another CV
            </button>
          }
        />

        {/* Hero Score Card */}
        <section className="mb-4 grid grid-cols-1 items-center justify-items-center gap-5 rounded-[26px] border border-[#156374]/55 bg-gradient-to-br from-[#0F4652]/80 to-[#0C3640]/95 p-5 text-center sm:grid-cols-[auto_1fr] sm:justify-items-start sm:p-6 sm:text-left">
          <svg
            className="h-[132px] w-[132px] flex-none drop-shadow-[0_0_18px_rgba(255,143,120,0.22)]"
            viewBox="0 0 120 120"
            role="img"
            aria-label={`Score ${r.score} percent`}
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
            />
            <circle
              className="uk-diag-arc"
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={strokeColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference.toFixed(1)}
              strokeDashoffset={
                animated ? targetOffset.toFixed(1) : circumference.toFixed(1)
              }
              transform="rotate(-90 60 60)"
            />
            <text
              x="60"
              y="60"
              textAnchor="middle"
              dominantBaseline="central"
              className="font-display fill-white text-[30px] font-extrabold"
            >
              {r.score}%
            </text>
          </svg>

          <div>
            <span
              className={`inline-block rounded-full border border-current px-2.5 py-1 text-[0.7rem] font-bold uppercase leading-[1.3] tracking-[0.07em] ${chipColorCls}`}
            >
              {r.riskBand}
            </span>
            <h1 className="my-2 text-[clamp(1.3rem,4.4vw,1.9rem)] font-extrabold leading-[1.12] tracking-[-0.015em] text-white">
              {isBlocked ? (
                <>
                  {firstName}, your current CV{" "}
                  <span className="text-[#FF8F78]">
                    cannot get you a UK sponsored job
                  </span>
                  .
                </>
              ) : (
                <>
                  {firstName}, your CV shows competitive fundamentals for UK
                  sponsorship.
                </>
              )}
            </h1>
            <p className="text-[0.98rem] leading-[1.5] text-[#C7D5D6]">
              {isBlocked ? (
                <>
                  Detected Target Role:{" "}
                  <strong className="text-white">{r.role}</strong>. Your CV
                  readiness score is{" "}
                  <strong className="text-white">{r.score}%</strong>. It will
                  fail UK ATS screeners and recruiter screening before reaching
                  a hiring manager.
                </>
              ) : (
                <>
                  Detected Target Role:{" "}
                  <strong className="text-white">{r.role}</strong>. Your CV
                  readiness score is{" "}
                  <strong className="text-white">{r.score}%</strong>. Strategic
                  targeting can accelerate your offer timeline.
                </>
              )}
            </p>
          </div>
        </section>

        {/* Top CTA Card */}
        <section
          ref={topCtaRef}
          id="cta-top"
          className="relative mb-5 overflow-hidden rounded-[28px] border-[1.5px] border-[#FFE082] bg-gradient-to-br from-[#156374]/75 to-[#0C3640] p-5 shadow-[0_0_0_6px_rgba(255,224,130,0.08),0_28px_60px_-24px_rgba(255,224,130,0.42)] sm:p-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-14 h-[220px] w-[220px]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255, 224, 130, 0.28), transparent)",
            }}
          />
          <div className="relative z-10">
            {bookingConfirmed ? (
              confirmationBox
            ) : (
              <>
                <p className="inline-block text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#FFE082]">
                  Immediate Recommended Action
                </p>
                <h2 className="mb-2 mt-1.5 text-[clamp(1.15rem,3.6vw,1.5rem)] font-extrabold leading-[1.15] text-white">
                  Reserve Your Strategy Session with a Senior Career Consultant
                </h2>
                <p className="mb-4 text-[0.97rem] leading-[1.5] text-[#D7E6E8]">
                  Review your score and uploaded CV with a Senior Career
                  Consultant. Get an actionable plan to fix your CV, hit the
                  £41,700+ sponsorship threshold, and qualify for the 5-Year ILR
                  fast-track.
                </p>
                {renderCtaButton()}
                <p className="mt-3 text-center text-[0.8rem] text-[#C7D5D6]">
                  Limited strategy sessions available this week.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Sponsorship Readiness Scorecard */}
        <div className="mb-4 rounded-[24px] border border-[#156374]/55 bg-[#0C3640]/90 p-5 sm:p-6">
          <h2 className="mb-1 text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold text-white">
            Sponsorship Readiness Scorecard
          </h2>
          <p className="mb-4 text-[0.95rem] text-[#C7D5D6]">
            How your CV performs across four critical UK hiring and visa
            filters:
          </p>
          <div className="grid gap-3.5">
            {SCORECARD_PILLARS.map((pillar) => (
              <div
                key={pillar.label}
                className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5"
              >
                <span className="text-[0.94rem] font-semibold text-white">
                  {pillar.label}
                </span>
                <span className="flex flex-wrap items-center justify-end gap-2 text-[0.84rem] text-[#C7D5D6]">
                  <span className="inline-block rounded-full border border-current px-2.5 py-0.5 text-[0.7rem] font-bold uppercase leading-[1.3] tracking-[0.07em] text-[#FF8F78]">
                    {pillar.chip}
                  </span>
                </span>
                <div className="col-span-full h-2 overflow-hidden rounded-full bg-white/10">
                  <b
                    className="uk-diag-bar-fill block h-full rounded-full bg-[#FF8F78]"
                    style={{ width: animated ? `${pillar.pct}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Critical Missing Signals Detected */}
        <div className="mb-4 rounded-[24px] border border-[#156374]/55 bg-[#0C3640]/90 p-5 sm:p-6">
          <h2 className="mb-1 text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold text-white">
            Top 3 Critical Missing Signals Detected
          </h2>
          <p className="mb-4 text-[0.95rem] text-[#C7D5D6]">
            The exact weaknesses triggering auto-rejections:
          </p>
          <div className="grid gap-3">
            {r.missingSignals.map((sig, i) => (
              <details
                key={sig.title}
                open={i === 0}
                className="uk-diag-gap overflow-hidden rounded-[18px] border border-[#156374]/55 bg-[#0F4652]/45 open:border-[#FFE082]/45"
              >
                <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-4 py-3.5">
                  <span className="font-display grid h-[30px] w-[30px] flex-none place-items-center rounded-full bg-[#FFE082]/14 text-[0.85rem] font-extrabold text-[#FFE082]">
                    {i + 1}
                  </span>
                  <span className="font-display flex-1 basis-[220px] text-[0.98rem] font-bold leading-[1.25] text-white">
                    {sig.title}
                  </span>
                </summary>
                <div className="grid gap-2 px-4 pb-4 text-[0.93rem] leading-[1.5]">
                  <p className="text-[#C7D5D6]">
                    <strong className="text-[#FFE082]">
                      Why it rejects you:
                    </strong>{" "}
                    {sig.why}
                  </p>
                  <p className="text-[#F2F7F7]">
                    <strong className="text-[#FFE082]">How to fix it:</strong>{" "}
                    {sig.fix}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Actionable Prescription: 3-Step Rebuild */}
        <details className="uk-diag-fold mb-4 rounded-[24px] border border-[#156374]/55 bg-[#0C3640]/90 p-5 sm:p-6">
          <summary className="flex cursor-pointer items-center justify-between gap-4">
            <h2 className="text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold text-white">
              Actionable Prescription: 3-Step Rebuild
            </h2>
          </summary>
          <div className="mt-4">
            <p className="mb-4 text-[0.95rem] text-[#C7D5D6]">
              Your roadmap to convert this CV into a sponsor-ready asset:
            </p>
            <div className="grid gap-3.5">
              {REBUILD_STEPS.map((step, i) => (
                <div key={step.title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 inline-block flex-none whitespace-nowrap rounded-full border border-current px-2.5 py-0.5 text-[0.7rem] font-bold uppercase leading-[1.3] tracking-[0.07em] text-[#FFE082]">
                    Step {i + 1}
                  </span>
                  <div>
                    <strong className="block text-[0.97rem] text-white">
                      {step.title}
                    </strong>
                    <p className="text-[0.9rem] leading-[1.45] text-[#C7D5D6]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* Bottom CTA Card */}
        <section
          ref={endCtaRef}
          id="cta-end"
          className="relative mb-5 overflow-hidden rounded-[28px] border-[1.5px] border-[#FFE082] bg-gradient-to-br from-[#156374]/75 to-[#0C3640] p-5 shadow-[0_0_0_6px_rgba(255,224,130,0.08),0_28px_60px_-24px_rgba(255,224,130,0.42)] sm:p-6"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-14 h-[220px] w-[220px]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255, 224, 130, 0.28), transparent)",
            }}
          />
          <div className="relative z-10">
            {bookingConfirmed ? (
              confirmationBox
            ) : (
              <>
                <h2 className="mb-2 text-[clamp(1.15rem,3.6vw,1.5rem)] font-extrabold leading-[1.15] text-white">
                  Ready to Fix Your CV and Target Sponsoring Roles?
                </h2>
                <p className="mb-4 text-[0.97rem] leading-[1.5] text-[#D7E6E8]">
                  Jump on a call with your consultant to review your score and
                  map out a clear strategy for your target role (
                  <strong className="text-white">{r.role}</strong>).
                </p>
                {renderCtaButton()}
              </>
            )}
          </div>
        </section>
      </div>

      {!bookingConfirmed ? (
        <StickyCtaBar visible={showSticky}>{renderCtaButton()}</StickyCtaBar>
      ) : null}
    </>
  );
}
