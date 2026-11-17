"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as fpixel from "@/lib/fpixel";
import {
  DIAGNOSTIC_CONFIG,
  GAPS,
  LeadInfo,
  QUESTIONS,
  RiskBandKey,
  SERVICES,
  buildDiagnosticSummary,
  computeDiagnosticScore,
  getRiskBand,
  sendDiagnosticWebhook,
} from "../data";
import { DiagnosticHeader } from "./diagnostic-header";

interface ResultsViewProps {
  targetRole: string;
  answers: (number | null)[];
  lead: LeadInfo;
  onRetake: () => void;
}

const BAND_COLORS: Record<
  RiskBandKey,
  { text: string; bg: string; stroke: string }
> = {
  red: { text: "text-[#FF8F78]", bg: "bg-[#FF8F78]", stroke: "#FF8F78" },
  amber: { text: "text-[#FFE082]", bg: "bg-[#FFE082]", stroke: "#FFE082" },
  green: { text: "text-[#72D9B4]", bg: "bg-[#72D9B4]", stroke: "#72D9B4" },
};

export function ResultsView({
  targetRole,
  answers,
  lead,
  onRetake,
}: ResultsViewProps) {
  const [animated, setAnimated] = useState(false);
  const [showSticky, setShowSticky] = useState(
    () =>
      typeof window !== "undefined" && !("IntersectionObserver" in window),
  );
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const topCtaRef = useRef<HTMLElement>(null);
  const endCtaRef = useRef<HTMLElement>(null);

  const result = useMemo(() => computeDiagnosticScore(answers), [answers]);
  const summary = useMemo(() => buildDiagnosticSummary(answers), [answers]);

  const firstName = lead.name.split(/\s+/)[0] || "There";
  const role = targetRole || "your target role";
  const isBlocked = result.pct < 70;

  // Trigger SVG ring + bar animations after initial paint
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

  // Sticky bottom CTA visibility based on top & bottom CTA cards
  useEffect(() => {
    const topEl = topCtaRef.current;
    const endEl = endCtaRef.current;
    if (!topEl || !endEl || !("IntersectionObserver" in window)) return;

    const vis = { top: true, end: false };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === topEl) vis.top = entry.isIntersecting;
          if (entry.target === endEl) vis.end = entry.isIntersecting;
        }
        setShowSticky(!vis.top && !vis.end);
      },
      { threshold: 0.15 },
    );

    observer.observe(topEl);
    observer.observe(endEl);
    return () => observer.disconnect();
  }, []);

  const handleBookingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    sendDiagnosticWebhook({
      timestamp: new Date().toISOString(),
      lead_source: "Sponsorship_Quiz_V2",
      full_name: lead.name,
      email: lead.email,
      whatsapp_phone: lead.phone,
      target_role: targetRole,
      readiness_score: `${result.pct}%`,
      risk_band: result.band.label,
      diagnostic_summary: summary,
      calendly_clicked: true,
    });

    fpixel.event("Schedule", {
      content_name: "Career Strategy Session",
      target_role: targetRole,
      score: result.pct,
    });

    if (!DIAGNOSTIC_CONFIG.BOOKING_URL) {
      e.preventDefault();
      setBookingConfirmed(true);
    }
  };

  const circumference = 2 * Math.PI * 52;
  const targetOffset = circumference * (1 - result.pct / 100);

  const strengths = useMemo(
    () =>
      result.pts
        .map((p, idx) => (p === 10 ? GAPS[idx].strong : null))
        .filter((s): s is string => Boolean(s)),
    [result.pts],
  );

  const services = useMemo(
    () => Array.from(new Set(result.gaps.map((g) => GAPS[g.idx].svc))),
    [result.gaps],
  );

  const qSalaryScore = result.pts[4];
  let salaryWarning = "";
  if (qSalaryScore === 10) {
    salaryWarning =
      "You are targeting £50,300+, qualifying you for both Skilled Worker visa sponsorship and the accelerated 5-Year ILR fast-track.";
  } else if (qSalaryScore === 5) {
    salaryWarning =
      "Targeting £41,700–£50,270 meets general Skilled Worker visa rules, but falls short of £50,271, disqualifying you from 5-Year ILR and locking you into the 10-year residency route.";
  } else {
    salaryWarning =
      "Targeting under £41,700 fails the UK general Skilled Worker sponsorship threshold completely. Sponsoring employers cannot legally sponsor you at this salary.";
  }

  const potentialBand = getRiskBand(result.potentialPct);

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
          subtag="Diagnostic Report"
          rightSlot={
            <button
              type="button"
              onClick={onRetake}
              className="cursor-pointer py-1.5 text-[0.92rem] text-[#C7D5D6] underline hover:text-white"
            >
              Retake diagnostic
            </button>
          }
        />

        {/* Hero Score Card */}
        <section className="mb-4 grid grid-cols-1 items-center justify-items-center gap-5 rounded-[26px] border border-[#156374]/55 bg-gradient-to-br from-[#0F4652]/80 to-[#0C3640]/95 p-5 text-center sm:grid-cols-[auto_1fr] sm:justify-items-start sm:p-6 sm:text-left">
          <svg
            className="h-[132px] w-[132px] flex-none drop-shadow-[0_0_18px_rgba(255,143,120,0.22)]"
            viewBox="0 0 120 120"
            role="img"
            aria-label={`Score ${result.pct} percent`}
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
              stroke={BAND_COLORS[result.band.key].stroke}
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
              {result.pct}%
            </text>
          </svg>

          <div>
            <span
              className={`inline-block rounded-full border border-current px-2.5 py-1 text-[0.7rem] font-bold uppercase leading-[1.3] tracking-[0.07em] ${BAND_COLORS[result.band.key].text}`}
            >
              {result.band.label}
            </span>
            <h1 className="my-2 text-[clamp(1.3rem,4.4vw,1.9rem)] font-extrabold leading-[1.12] tracking-[-0.015em] text-white">
              {isBlocked ? (
                <>
                  {firstName}, your current profile{" "}
                  <span className="text-[#FF8F78]">
                    cannot get you a UK sponsored job
                  </span>
                  .
                </>
              ) : (
                <>
                  {firstName}, you have strong sponsorship fundamentals for UK
                  Skilled Worker roles.
                </>
              )}
            </h1>
            <p className="text-[0.98rem] leading-[1.5] text-[#C7D5D6]">
              {isBlocked ? (
                <>
                  Your sponsorship readiness score is{" "}
                  <strong className="text-white">{result.pct}%</strong> for{" "}
                  <strong className="text-white">{role}</strong>. Your CV and
                  positioning will not pass UK ATS filters or recruiter
                  screening in their current state.
                </>
              ) : (
                <>
                  Your sponsorship readiness score is{" "}
                  <strong className="text-white">{result.pct}%</strong> for{" "}
                  <strong className="text-white">{role}</strong>. Strategic
                  targeting can accelerate your offer timeline.
                </>
              )}
            </p>
          </div>
        </section>

        {!isBlocked ? (
          <div className="mb-4 rounded-[16px] border border-[#72D9B4]/40 bg-[#72D9B4]/10 px-4 py-3.5 text-[0.95rem] text-[#F2F7F7]">
            A strong score still benefits from a consultant review: they can
            pressure-test your profile and close any remaining gaps before you
            apply.
          </div>
        ) : null}

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
                  Review your score with a Senior Career Consultant to optimize
                  your CV, align with the £41,700 general salary threshold (or
                  your role&apos;s specific going rate), and map out your
                  standard 5-year path to Indefinite Leave to Remain (ILR).
                </p>
                {renderCtaButton()}
                <p className="mt-3 text-center text-[0.8rem] text-[#C7D5D6]">
                  Limited strategy sessions available this week.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Score Breakdown by Core Pillar */}
        <div className="mb-4 rounded-[24px] border border-[#156374]/55 bg-[#0C3640]/90 p-5 sm:p-6">
          <h2 className="mb-1 text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold text-white">
            Score Breakdown by Core Pillar
          </h2>
          <p className="mb-4 text-[0.95rem] text-[#C7D5D6]">
            Where your profile passes or fails UK sponsorship screeners (out of
            10):
          </p>
          <div className="grid gap-3.5">
            {QUESTIONS.map((q, idx) => {
              const score = result.pts[idx];
              const pct = Math.round((score / 10) * 100);
              const b = getRiskBand(pct);
              return (
                <div
                  key={q.num}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5"
                >
                  <span className="text-[0.94rem] font-semibold text-white">
                    {q.category}
                  </span>
                  <span className="flex flex-wrap items-center justify-end gap-2 text-[0.84rem] text-[#C7D5D6]">
                    <span
                      className={`inline-block rounded-full border border-current px-2.5 py-0.5 text-[0.7rem] font-bold uppercase leading-[1.3] tracking-[0.07em] ${BAND_COLORS[b.key].text}`}
                    >
                      {b.label}
                    </span>
                    {score}/10
                  </span>
                  <div className="col-span-full h-2 overflow-hidden rounded-full bg-white/10">
                    <b
                      className={`uk-diag-bar-fill block h-full rounded-full ${BAND_COLORS[b.key].bg}`}
                      style={{ width: animated ? `${pct}%` : "0%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Blockers */}
        {result.gaps.length ? (
          <div className="mb-4 rounded-[24px] border border-[#156374]/55 bg-[#0C3640]/90 p-5 sm:p-6">
            <h2 className="mb-1 text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold text-white">
              Critical Blockers Stopping Your Sponsorship
            </h2>
            <p className="mb-4 text-[0.95rem] text-[#C7D5D6]">
              The exact weaknesses triggering auto-rejections:
            </p>
            <div className="grid gap-3">
              {result.gaps.map((g, i) => {
                const gapDef = GAPS[g.idx][g.p === 0 ? "A" : "B"](role);
                const sev: [RiskBandKey, string] =
                  g.p === 0 ? ["red", "Critical Blocker"] : ["amber", "High Risk"];
                return (
                  <details
                    key={QUESTIONS[g.idx].num}
                    open={i === 0}
                    className="uk-diag-gap overflow-hidden rounded-[18px] border border-[#156374]/55 bg-[#0F4652]/45 open:border-[#FFE082]/45"
                  >
                    <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-4 py-3.5">
                      <span
                        className={`inline-block rounded-full border border-current px-2.5 py-0.5 text-[0.7rem] font-bold uppercase leading-[1.3] tracking-[0.07em] ${BAND_COLORS[sev[0]].text}`}
                      >
                        {sev[1]}
                      </span>
                      <span className="font-display flex-1 basis-[220px] text-[0.98rem] font-bold leading-[1.25] text-white">
                        {gapDef.f}
                      </span>
                    </summary>
                    <div className="grid gap-2 px-4 pb-4 text-[0.93rem] leading-[1.5]">
                      <p className="text-[0.82rem] text-[#8EB7BE]">
                        {QUESTIONS[g.idx].category}
                      </p>
                      <p className="text-[#C7D5D6]">
                        <strong className="text-[#FFE082]">
                          Why it rejects you:
                        </strong>{" "}
                        {gapDef.w}
                      </p>
                      <p className="text-[#F2F7F7]">
                        <strong className="text-[#FFE082]">
                          How consultant fixes it:
                        </strong>{" "}
                        {gapDef.h}
                      </p>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Projected Score */}
        {result.top3Gaps.length ? (
          <div className="mb-4 rounded-[24px] border border-[#156374]/55 bg-[#0C3640]/90 p-5 sm:p-6">
            <h2 className="text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold text-white">
              Projected Score After Closing Top 3 Blockers
            </h2>
            <div className="mt-4 flex items-center justify-center gap-6 text-center">
              <div>
                <div
                  className={`font-display text-[2.3rem] font-extrabold leading-none ${BAND_COLORS[result.band.key].text}`}
                >
                  {result.pct}%
                </div>
                <div className="mt-1 text-[0.82rem] text-[#C7D5D6]">
                  Current Score
                </div>
              </div>
              <div className="text-[1.8rem] text-[#FFE082]">&rarr;</div>
              <div>
                <div
                  className={`font-display text-[2.3rem] font-extrabold leading-none ${BAND_COLORS[potentialBand.key].text}`}
                >
                  {result.potentialPct}%
                </div>
                <div className="mt-1 text-[0.82rem] text-[#C7D5D6]">
                  With Fixes Applied
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* What is Already Working */}
        {strengths.length ? (
          <div className="mb-4 rounded-[24px] border border-[#156374]/55 bg-[#0C3640]/90 p-5 sm:p-6">
            <h2 className="mb-1 text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold text-white">
              What is Already Working
            </h2>
            <p className="mb-3 text-[0.95rem] text-[#C7D5D6]">
              Strengths your consultant will leverage during hiring outreach:
            </p>
            <div className="flex flex-wrap gap-2">
              {strengths.map((s) => (
                <span
                  key={s}
                  className="inline-block rounded-full border border-[#72D9B4] px-3 py-1 text-[0.72rem] font-bold uppercase leading-[1.3] tracking-[0.06em] text-[#72D9B4]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Where a Consultant Can Help */}
        <details
          open={!isBlocked}
          className="uk-diag-fold mb-4 rounded-[24px] border border-[#156374]/55 bg-[#0C3640]/90 p-5 sm:p-6"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4">
            <h2 className="text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold text-white">
              Where a Consultant Can Help
            </h2>
          </summary>
          <div className="mt-4">
            {services.length ? (
              <div className="grid gap-2.5">
                {services.map((svcName) => (
                  <div
                    key={svcName}
                    className="rounded-[16px] border border-[#156374]/55 bg-[#0F4652]/45 px-4 py-3"
                  >
                    <strong className="font-display mb-1 block text-[0.95rem] font-bold text-[#FFE082]">
                      {svcName}
                    </strong>
                    <span className="text-[0.88rem] leading-[1.45] text-[#C7D5D6]">
                      {SERVICES[svcName].d}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[0.95rem] text-[#C7D5D6]">
                Even with no major gaps, a consultant can pressure-test your
                profile before you apply.
              </p>
            )}
          </div>
        </details>

        {/* Immigration & Salary Rules */}
        <div className="mb-4 rounded-[24px] border border-[#156374]/55 bg-[#0C3640]/90 p-5 sm:p-6">
          <p className="inline-block text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#FFE082]">
            Immigration &amp; Salary Rules
          </p>
          <h2 className="mb-2.5 mt-1.5 text-[clamp(1.25rem,3.8vw,1.8rem)] font-extrabold text-white">
            The UK Salary Reality Check: £41,700 vs. £50,271
          </h2>
          <p className="text-[0.95rem] text-[#C7D5D6]">{salaryWarning}</p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[16px] border border-[#156374]/55 bg-[#0F4652]/45 p-4">
              <span className="font-display mb-1.5 block text-[1.5rem] font-extrabold leading-none text-[#FFE082]">
                £41,700
              </span>
              <h4 className="mb-1 text-[0.95rem] font-bold text-white">
                General Sponsorship Baseline
              </h4>
              <p className="text-[0.85rem] leading-[1.45] text-[#C7D5D6]">
                The minimum general threshold required for a UK Skilled Worker
                visa. Roles below £41,700 face immediate rejection.
              </p>
            </div>

            <div className="rounded-[16px] border border-[#FFE082]/45 bg-[#FFE082]/[0.07] p-4">
              <span className="font-display mb-1.5 block text-[1.5rem] font-extrabold leading-none text-[#FFE082]">
                £50,271+
              </span>
              <h4 className="mb-1 text-[0.95rem] font-bold text-white">
                5-Year ILR Fast-Track
              </h4>
              <p className="text-[0.85rem] leading-[1.45] text-[#C7D5D6]">
                Unlocks accelerated Indefinite Leave to Remain (permanent
                settlement) in 5 years, avoiding the 10-year residency trap.
              </p>
            </div>
          </div>

          <p className="mt-3.5 text-[0.82rem] text-[#8EB7BE]">
            General immigration information based on UK Home Office Skilled
            Worker rules. Not legal advice.
          </p>
        </div>

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
                  Ready to Fix Your CV and Target £41,700+ Sponsoring Roles?
                </h2>
                <p className="mb-4 text-[0.97rem] leading-[1.5] text-[#D7E6E8]">
                  Your consultant will have your score and target role (
                  <strong className="text-white">{role}</strong>) mapped before
                  you join.
                </p>
                {renderCtaButton()}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Sticky Bottom CTA */}
      {!bookingConfirmed ? (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(0.8rem+env(safe-area-inset-bottom,0px))] pt-5 transition-transform duration-300 ${
            showSticky
              ? "pointer-events-auto translate-y-0"
              : "pointer-events-none translate-y-[130%]"
          }`}
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(9, 42, 49, 0.96) 40%)",
          }}
        >
          <div className="mx-auto max-w-[728px]">{renderCtaButton()}</div>
        </div>
      ) : null}
    </>
  );
}
