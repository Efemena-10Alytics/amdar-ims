"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LightbulbIcon } from "lucide-react";
import { usePromoCountdown } from "@/components/_core/landing-pages/shared/iwd-banner/use-countdown";
import { getBrowserTimeZone } from "@/lib/timezone";
import { cn } from "@/lib/utils";
import { GoogleMeetSvg } from "../real-uk-experience/content/svg";

type Region = "uk" | "na";

type BundleBenefit = {
  icon: "meet" | "clock";
  title: string;
  description: string;
};

type RegionContent = {
  consultantBadge: string;
  showTopYellowBanner: boolean;
  subtitle: string;
  slotsBadgeLines: [string, string];
  benefits24h: [BundleBenefit, BundleBenefit];
};

const REGION_CONTENT: Record<Region, RegionContent> = {
  uk: {
    consultantBadge: "Amdari for UK consultants",
    showTopYellowBanner: true,
    subtitle:
      "Everything included in your Amdari experience, built to get you hired in the UK, with your own tailored applications ready in 48 hours.",
    slotsBadgeLines: ["10 Slots", "Only!"],
    benefits24h: [
      {
        icon: "meet",
        title: "CV-to-job matching:",
        description:
          "Unlimited CV-to-job matching for 12 months, activated on enrolment day.",
      },
      {
        icon: "clock",
        title: "Skilled Worker Sponsorship Pack:",
        description:
          "A visa-ready document pack covering your eligible SOC codes, salary threshold check, and a one-page sponsorship pitch you can hand to employers.",
      },
    ],
  },
  na: {
    consultantBadge: "Amdari for Canada & US consultants",
    showTopYellowBanner: false,
    subtitle:
      "Everything included in your Amdari experience, built to get you hired in the US, with your own tailored applications ready in 48 hours.",
    slotsBadgeLines: ["10", "Slots!"],
    benefits24h: [
      {
        icon: "meet",
        title: "Interview Fast-Track Kit:",
        description:
          "Top 10 likely questions with STAR answers from their own experience, plus one live mock.",
      },
      {
        icon: "clock",
        title: "1 Year of CVMatchly, free:",
        description:
          "Unlimited CV-to-job matching for 12 months, activated on enrollment day",
      },
    ],
  },
};

const pad = (value: number) => String(value).padStart(2, "0");

function GreenClockSvg() {
  return (
    <svg
      width="26"
      height="30"
      viewBox="0 0 30 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 5C12.0333 5 9.13319 5.87973 6.66645 7.52796C4.19972 9.17618 2.27713 11.5189 1.14181 14.2597C0.00649929 17.0006 -0.290551 20.0166 0.288228 22.9264C0.867006 25.8361 2.29562 28.5088 4.3934 30.6066C6.49119 32.7044 9.16394 34.133 12.0737 34.7118C14.9834 35.2906 17.9994 34.9935 20.7403 33.8582C23.4811 32.7229 25.8238 30.8003 27.472 28.3336C29.1203 25.8668 30 22.9667 30 20C29.9955 16.0231 28.4136 12.2105 25.6016 9.39842C22.7895 6.58636 18.9769 5.00455 15 5ZM22.1344 14.6344L15.8844 20.8844C15.7682 21.0005 15.6304 21.0926 15.4786 21.1555C15.3269 21.2183 15.1643 21.2507 15 21.2507C14.8358 21.2507 14.6731 21.2183 14.5214 21.1555C14.3696 21.0926 14.2318 21.0005 14.1156 20.8844C13.9995 20.7682 13.9074 20.6304 13.8445 20.4786C13.7817 20.3269 13.7493 20.1642 13.7493 20C13.7493 19.8358 13.7817 19.6731 13.8445 19.5214C13.9074 19.3696 13.9995 19.2318 14.1156 19.1156L20.3656 12.8656C20.4818 12.7495 20.6196 12.6574 20.7714 12.5945C20.9231 12.5317 21.0858 12.4993 21.25 12.4993C21.4143 12.4993 21.5769 12.5317 21.7286 12.5945C21.8804 12.6574 22.0182 12.7495 22.1344 12.8656C22.2505 12.9818 22.3426 13.1196 22.4055 13.2714C22.4684 13.4231 22.5007 13.5858 22.5007 13.75C22.5007 13.9142 22.4684 14.0769 22.4055 14.2286C22.3426 14.3804 22.2505 14.5182 22.1344 14.6344ZM10 1.25C10 0.918479 10.1317 0.600537 10.3661 0.366116C10.6005 0.131696 10.9185 0 11.25 0H18.75C19.0815 0 19.3995 0.131696 19.6339 0.366116C19.8683 0.600537 20 0.918479 20 1.25C20 1.58152 19.8683 1.89946 19.6339 2.13388C19.3995 2.3683 19.0815 2.5 18.75 2.5H11.25C10.9185 2.5 10.6005 2.3683 10.3661 2.13388C10.1317 1.89946 10 1.58152 10 1.25Z"
        fill="#4ADE80"
      />
    </svg>
  );
}

const STARBURST_POINTS = Array.from({ length: 48 }, (_, i) => {
  const angle = (i * Math.PI) / 24 - Math.PI / 2;
  const radius = i % 2 === 0 ? 58 : 44;
  const x = (60 + radius * Math.cos(angle)).toFixed(2);
  const y = (60 + radius * Math.sin(angle)).toFixed(2);
  return `${x},${y}`;
}).join(" ");

function StarburstBadge({ lines }: { lines: [string, string] }) {
  return (
    <div
      className="pointer-events-none relative flex h-28 w-28 sm:h-33 sm:w-33 items-center justify-center -rotate-12 select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
      aria-label={`${lines[0]} ${lines[1]}`}
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <polygon points={STARBURST_POINTS} fill="#E03B3B" />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center text-center font-display text-sm sm:text-base font-bold leading-tight text-white">
        <span>{lines[0]}</span>
        <span>{lines[1]}</span>
      </div>
    </div>
  );
}

function detectInitialRegion(): Region {
  if (typeof window === "undefined") return "uk";

  try {
    const params = new URLSearchParams(window.location.search);
    const queryRegion = params.get("region")?.toLowerCase();
    if (
      queryRegion === "na" ||
      queryRegion === "north-america" ||
      queryRegion === "us" ||
      queryRegion === "ca"
    ) {
      return "na";
    }
    if (queryRegion === "uk" || queryRegion === "gb") {
      return "uk";
    }
  } catch {
    // ignore URLSearchParams errors
  }

  const tz = getBrowserTimeZone();
  if (
    tz.startsWith("America/") ||
    tz.startsWith("US/") ||
    tz.startsWith("Canada/")
  ) {
    return "na";
  }

  return "uk";
}

export default function FastTrackAdsPage() {
  const [region, setRegion] = useState<Region>("uk");
  const { days, hrs, mins, secs } = usePromoCountdown();
  const totalHours = days * 24 + hrs;

  useEffect(() => {
    setRegion(detectInitialRegion());
  }, []);

  const content = REGION_CONTENT[region];

  return (
    <main className="min-h-screen bg-[#052A31] text-white selection:bg-[#FFE082] selection:text-[#052A31]">
      {/* ================================================================= */}
      {/* TOP SECTION: HEADER + HERO + 24-HR BUNDLE CARD                    */}
      {/* ================================================================= */}
      <div className="relative overflow-hidden">
        {/* Grid + Glow Pattern Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/images/svgs/ads/clarity-pattern-1.svg)",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 sm:pb-20">
          {/* Header: Logo + Region Switcher */}
          <header className="flex items-center justify-between gap-4">
            <Link href="/" aria-label="Amdari Home" className="shrink-0">
              <Image
                src="/images/pngs/ads/fast-track-logo.png"
                alt="Amdari"
                width={148}
                height={34}
                className="h-6 sm:h-8 w-auto"
                priority
              />
            </Link>

            <div
              role="tablist"
              aria-label="Select region"
              className="inline-flex items-center rounded-full border border-[#236B7B] bg-[#145563]/90 p-1.5 backdrop-blur-xs"
            >
              <button
                type="button"
                role="tab"
                aria-selected={region === "uk"}
                onClick={() => setRegion("uk")}
                className={cn(
                  "cursor-pointer rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all",
                  region === "uk"
                    ? "bg-[#FFE082] font-bold text-[#092A31] shadow-xs"
                    : "font-medium text-[#CFE3E7] hover:text-white",
                )}
              >
                UK
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={region === "na"}
                onClick={() => setRegion("na")}
                className={cn(
                  "cursor-pointer rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all",
                  region === "na"
                    ? "bg-[#FFE082] font-bold text-[#092A31] shadow-xs"
                    : "font-medium text-[#CFE3E7] hover:text-white",
                )}
              >
                North America
              </button>
            </div>
          </header>

          {/* Hero Copy */}
          <div className="mt-10 sm:mt-12 text-center">
            {/* Consultant Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3AB66A] bg-[#1E8B4E33] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#6EE599]">
              <span
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6EE599]"
              >
                <LightbulbIcon className="h-3.5 w-3.5 text-[#14532D]" />
              </span>
              <span>{content.consultantBadge}</span>
            </div>

            {/* UK Top Yellow Banner */}
            {content.showTopYellowBanner && (
              <div className="mt-5 flex items-center justify-center gap-2.5">
                <Image
                  src="/images/svgs/country/UK.svg"
                  alt="United Kingdom flag"
                  width={28}
                  height={28}
                  className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 rounded-full"
                />
                <p className="font-display text-2xl sm:text-3xl md:text-[36px] xl:text-5xl font-semibold tracking-tight text-[#FFE082]">
                  What You Get In 24/48 Hrs
                </p>
              </div>
            )}

            {/* Main Headline */}
            <h1
              className={cn(
                "font-display text-3xl sm:text-5xl lg:text-[54px] xl:text-[56px] font-semibold leading-[1.12] tracking-tight text-white",
                content.showTopYellowBanner
                  ? "mt-1.5"
                  : "mt-5 flex flex-wrap items-center justify-center gap-3",
              )}
            >
              <span className="font-display">The Fast-Track Hiring Bundle</span>
              {region === "na" && (
                <Image
                  src="/images/svgs/country/CAD.svg"
                  alt="Canada flag"
                  width={32}
                  height={32}
                  className="inline-block h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full"
                />
              )}
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg xl:text-xl leading-relaxed text-[#B6CFD4]">
              {content.subtitle}
            </p>
          </div>

          {/* 24-Hour Bundle Card */}
          <div className="relative mx-auto mt-12 sm:mt-16 max-w-5xl">
            {/* Red Starburst Slot Badge */}
            <div className="absolute -top-12 right-2 z-20 sm:-top-14 sm:right-4 md:-right-3">
              <StarburstBadge lines={content.slotsBadgeLines} />
            </div>

            <div className="rounded-[24px] bg-[#166070] p-6 sm:p-8 md:px-12 md:py-10 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
                {/* Left Column: Title, Countdown, CTA */}
                <div className="lg:col-span-5">
                  <h2 className="font-display text-2xl sm:text-3xl md:text-[32px] font-semibold leading-tight text-white">
                    What you get in 24 hrs
                  </h2>

                  <div className="mt-5 flex items-center gap-3">
                    <Image
                      src="/iwd/iwd-time-icon.svg"
                      width={28}
                      height={28}
                      alt=""
                      className="animate-vibrate shrink-0"
                    />
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white">
                        OFFERS YOU GET
                      </p>
                      <p className="font-display text-base sm:text-lg font-semibold text-[#FFE082]">
                        Ending soon!{" "}
                        <span className="tabular-nums">
                          {pad(totalHours)} : {pad(mins)} : {pad(secs)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/internship"
                      className="group inline-flex w-full sm:w-auto min-w-[230px] items-center justify-center gap-2.5 rounded-xl bg-[#FFE082] px-7 py-3.5 text-sm sm:text-base font-bold text-[#092A31] transition hover:bg-[#F5D76E] active:scale-[0.99]"
                    >
                      <span>Save my spot</span>
                      <span
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#156374] text-[#FFE082] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      >
                        <ArrowUpRight
                          className="h-3.5 w-3.5"
                          strokeWidth={2.5}
                        />
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Right Column: 24-Hr Benefits */}
                <div className="space-y-6 lg:col-span-7">
                  {content.benefits24h.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 sm:gap-5"
                    >
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#093540] [&>svg]:h-6 [&>svg]:w-6">
                        {item.icon === "meet" ? (
                          <GoogleMeetSvg />
                        ) : (
                          <GreenClockSvg />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-sora text-base sm:text-lg font-semibold text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#D0E3E7]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* BOTTOM SECTION: WHAT YOU GET IN 48 HRS                            */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden bg-[#092A31] py-14 sm:py-20">
        {/* Map Watermark Pattern Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/images/svgs/ads/clarity-pattern-2.svg)",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-3xl sm:text-4xl md:text-[40px] xl:text-5xl font-semibold tracking-tight text-white">
              What you get in 48 hrs
            </h2>

            <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-7">
              {/* Card 1: 10-Application Sprint */}
              <article className="grid grid-cols-1 sm:grid-cols-[0.92fr_1.08fr] overflow-hidden rounded-2xl bg-[#EBE7DF] text-[#092A31] shadow-[0_18px_40px_rgba(0,0,0,0.25)] min-h-[275px]">
                <div className="relative min-h-[220px] sm:min-h-full">
                  <Image
                    src="/images/pngs/ads/fast-track-sprint.jpg"
                    alt="Professional looking at departure board with laptop"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 260px"
                  />
                </div>
                <div className="flex flex-col justify-end p-6 sm:p-7">
                  <p className=" text-lg sm:text-xl font-semibold leading-snug text-[#092A31]">
                    10-Application Sprint
                  </p>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#254852]">
                    10 live roles found and tailored, custom CV + cover letter
                    each, ready in 48 hrs.
                  </p>
                </div>
              </article>

              {/* Card 2: Global Talent Visa Evidence Map */}
              <article className="grid grid-cols-1 sm:grid-cols-[0.92fr_1.08fr] overflow-hidden rounded-2xl bg-[#EBE7DF] text-[#092A31] shadow-[0_18px_40px_rgba(0,0,0,0.25)] min-h-[275px]">
                <div className="relative min-h-[220px] sm:min-h-full">
                  <Image
                    src="/images/pngs/ads/fast-track-visa.jpg"
                    alt="Consultant smiling while working on laptop"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 260px"
                  />
                </div>
                <div className="flex flex-col justify-end p-6 sm:p-7">
                  <p className="text-lg sm:text-xl font-semibold leading-snug text-[#092A31]">
                    Global Talent Visa
                    <br />
                    Evidence Map
                  </p>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#254852]">
                    Do I qualify? Know in 48 hours: A 48-hour audit of your
                    achievements against Global Talent criteria, with a gap
                    analysis and a structured evidence checklist.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
