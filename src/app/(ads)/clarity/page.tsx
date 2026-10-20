"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

/**
 * ----------------------------------------------------------------------------------
 * CALENDLY CONFIGURATION
 * ----------------------------------------------------------------------------------
 * You can set your custom Calendly link below or by setting
 * NEXT_PUBLIC_CALENDLY_URL in your `.env` file.
 */
const DEFAULT_CALENDLY_URL =
  "https://calendly.com/efemena-amdari/how-we-can-help-you-land-a-job-through-work-exp-clone?month=2026-07&fbclid=IwAR5vaBMibu9Vnv0cAikuCJEcIugzSS7T5k_uQKzh85tl7PjjWnJfAYmqqDe4-A_wapm_N2YxMDA3N2ItMTI3My00Y2E0LTk0M2YtODkwMjU5NDUzZDlh_waaem_aH-q6hdCrElA5CgKcPW2jg&date=2026-07-17";

export default function ClarityAdsPage() {
  const calendlyUrl = DEFAULT_CALENDLY_URL;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isLoadingWidget, setIsLoadingWidget] = useState(true);

  const scrollToBooking = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      cardRef.current.classList.add(
        "ring-4",
        "ring-[#F5CE5F]/70",
        "transition-all",
      );
      setTimeout(() => {
        cardRef.current?.classList.remove("ring-4", "ring-[#F5CE5F]/70");
      }, 1800);
    }
  };

  // Check if Calendly script is already on page (e.g. client route transitions)
  useEffect(() => {
    if (typeof window !== "undefined" && window.Calendly) {
      setScriptLoaded(true);
    }
  }, []);

  // Initialize Calendly inline widget whenever script is loaded & container is available
  useEffect(() => {
    if (scriptLoaded && window.Calendly && containerRef.current) {
      try {
        containerRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: calendlyUrl,
          parentElement: containerRef.current,
        });
        setIsLoadingWidget(false);
      } catch (err) {
        console.error("Error initializing Calendly widget:", err);
        setIsLoadingWidget(false);
      }
    }
  }, [scriptLoaded, calendlyUrl]);

  return (
    <>
      {/* Calendly Widget Assets */}
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <main className="min-h-screen bg-[#04262C] text-white selection:bg-[#F5CE5F] selection:text-[#04262C] font-sans antialiased">
        {/* ---------------------------------------------------- */}
        {/* TOP NAVIGATION BAR                                   */}
        {/* ---------------------------------------------------- */}
        <header className="border-b border-white/10 bg-[#04262C]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Left Brand Identifier */}
            <div className="flex items-center gap-3.5 sm:gap-4">
              <Image
                src="/logo-white.svg"
                alt="Amdari"
                width={130}
                height={26}
                className="h-6 sm:h-7 w-auto"
                priority
              />
              <span
                className="text-[#3A6B72] hidden sm:inline text-xl font-light"
                aria-hidden="true"
              >
                |
              </span>
              <span className="hidden sm:inline  text-[11px] sm:text-[13px] font-semibold tracking-[0.18em] text-[#8EB7BE] uppercase">
                CAREER CLARITY SESSION
              </span>
            </div>

            {/* Right CTA Button */}
            <button
              type="button"
              onClick={scrollToBooking}
              className="inline-flex items-center justify-center rounded-lg border border-[#F5CE5F] px-2 sm:px-5 py-2 text-[0.625rem] sm:text-sm font-semibold text-[#F5CE5F] transition-all hover:bg-[#F5CE5F]/15 active:scale-95 cursor-pointer"
            >
              Choose a Time
            </button>
          </div>
        </header>

        {/* ---------------------------------------------------- */}
        {/* HERO SECTION                                         */}
        {/* ---------------------------------------------------- */}
        <section className="relative overflow-hidden py-10 sm:py-14 lg:py-16">
          {/* Subtle Background Glow */}
          <div
            className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#0E4953]/30 blur-[120px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-[#165D6A]/20 blur-[130px]"
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* LEFT COLUMN: Hero Copy & Value Points */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
                {/* Overline */}
                <p className="text-xs sm:text-[13px] font-bold tracking-[0.2em] text-[#8EB7BE] uppercase">
                  A ONE-TO-ONE CONVERSATION WITH A CAREER COACH
                </p>

                {/* Main Headline */}
                <h1 className="mt-4 sm:mt-5 text-4xl sm:text-5xl lg:text-[52px] font-extrabold leading-[1.12] tracking-tight text-white">
                  Know{" "}
                  <span className="text-[#F5CE5F]">What to Work on Next</span>
                  <br />
                  in Your Job Search.
                </h1>

                {/* Lead Description */}
                <p className="mt-5 sm:mt-6 text-base sm:text-lg text-[#CFE3E7] leading-relaxed max-w-2xl">
                  Talk through your goals, experience and job-search challenges
                  with an Amdari career coach. Understand how we work, ask your
                  questions and explore whether our support fits your needs.
                </p>

                {/* 3 Numbered Steps / Highlights */}
                <div className="mt-8 sm:mt-10 space-y-6">
                  {/* Item 1 */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0E3D44] border border-[#165059] text-base sm:text-lg font-bold text-[#59DBA8]">
                      1
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Your situation first
                      </h3>
                      <p className="mt-1 text-sm sm:text-[15px] text-[#9FBEC5] leading-relaxed">
                        Tell us what you want to do and where you feel stuck.
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0E3D44] border border-[#165059] text-base sm:text-lg font-bold text-[#59DBA8]">
                      2
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Clear explanations
                      </h3>
                      <p className="mt-1 text-sm sm:text-[15px] text-[#9FBEC5] leading-relaxed">
                        Ask how our projects and career support work.
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0E3D44] border border-[#165059] text-base sm:text-lg font-bold text-[#59DBA8]">
                      3
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Space for your questions
                      </h3>
                      <p className="mt-1 text-sm sm:text-[15px] text-[#9FBEC5] leading-relaxed">
                        Discuss what is included and what you would need to
                        commit.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Who is Amdari? Block */}
                <div className="mt-10 sm:mt-12 pt-8 border-t border-white/10 max-w-xl">
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Who is Amdari?
                  </h4>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#9FBEC5] leading-relaxed">
                    Amdari helps people build practical work experience through
                    project-based internships and career support.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Calendly Inline Card */}
              <div className="lg:col-span-6 xl:col-span-5 w-full">
                <div
                  id="booking-card"
                  ref={cardRef}
                  className="relative w-full rounded-[24px] sm:rounded-[30px] bg-white text-[#111827] shadow-[0_24px_60px_rgba(0,0,0,0.45)] overflow-hidden transition-all duration-300"
                >
                  {/* Loading Placeholder */}
                  {isLoadingWidget && (
                    <div className="flex flex-col items-center justify-center min-h-[620px] p-8 text-center bg-gray-50/70">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0E4953] border-t-transparent" />
                      <p className="mt-4 text-sm font-semibold text-gray-700">
                        Loading calendar and available times...
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Scheduling powered by Calendly
                      </p>
                    </div>
                  )}

                  {/* Calendly Inline Widget Container */}
                  <div
                    ref={containerRef}
                    className="calendly-inline-widget w-full"
                    data-url={calendlyUrl}
                    style={{
                      minWidth: "320px",
                      height: "680px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SECONDARY SECTION: What This Conversation Offers     */}
        {/* ---------------------------------------------------- */}
        <section className="border-t border-[#0C383F] bg-[#021A1E] py-14 sm:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight">
                What This Conversation Offers
              </h2>

              <div className="mt-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  A chance to understand your options
                </h3>
                <p className="mt-3 text-base sm:text-lg text-[#9FBEC5] leading-relaxed max-w-2xl">
                  Discuss your goals, learn about Amdari&apos;s approach and ask
                  questions before making a decision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* BOTTOM CONVERSION BANNER                             */}
        {/* ---------------------------------------------------- */}
        <section className="border-t border-[#0C383F] bg-[#031E23] py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white leading-tight text-center md:text-left">
                Come with questions. Leave with a clearer next step.
              </h2>

              <button
                type="button"
                onClick={scrollToBooking}
                className="w-full md:w-auto inline-flex items-center justify-center rounded-lg bg-[#F5CE5F] px-7 py-4 text-base font-bold text-[#04262C] transition-all hover:bg-[#fad877] active:scale-95 shadow-lg shrink-0 cursor-pointer"
              >
                Book My Career Clarity Session
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
