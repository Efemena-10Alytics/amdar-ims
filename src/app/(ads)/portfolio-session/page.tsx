"use client";

import React from "react";
import Image from "next/image";
import { useCreateAdsData } from "@/features/ads/use-create-ads-data";
import "./animations.css";

// TODO: replace with real YouTube video IDs
const TESTIMONIALS = [
  { id: "testi1", videoId: "VIDEO_ID", name: "Add name", role: "Now [Role] at [Company]", track: "Data Analytics track" },
  { id: "testi2", videoId: "VIDEO_ID", name: "Add name", role: "Now [Role] at [Company]", track: "Data Science track" },
  { id: "testi3", videoId: "VIDEO_ID", name: "Add name", role: "Now [Role] at [Company]", track: "Business Analysis track" },
  { id: "testi4", videoId: "VIDEO_ID", name: "Add name", role: "Now [Role] at [Company]", track: "Cybersecurity track" },
];

const TRACK_STAMPS = [
  "Data Analytics",
  "Data Science",
  "Business Analysis",
  "Project Management",
  "Cybersecurity",
];

const STAMP_ROTATIONS = ["-rotate-[1.2deg]", "rotate-[1deg]", "-rotate-[0.4deg]", "rotate-[1deg]", "-rotate-[1.2deg]"];

const COUNTRY_OPTIONS = ["Nigeria", "United Kingdom", "Other"];

const VISA_STATUS_OPTIONS = [
  "Short-Term Study Visa",
  "Student visa",
  "Dependent visa",
  "Skilled worker visa",
  "Others",
];

const TRACK_OPTIONS = [
  "Data Analytics",
  "Data Science",
  "Business Analysis",
  "Project Management",
  "Cybersecurity",
  "GRC",
  "Others",
];

const TIMELINE_OPTIONS = ["1 month", "1–3 months", "Just exploring for now"];

const HEARD_FROM_OPTIONS = [
  "Facebook/Instagram Ads",
  "TikTok Ads",
  "YouTube",
  "Google",
  "Family and friends",
  "Others",
];

const BENEFITS = [
  {
    title: "Build a Live Portfolio Project",
    body: "Work through one real, track-specific project you can showcase — from framing to finished output.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18M8 4v0" />
      </svg>
    ),
  },
  {
    title: "Sponsorship-Ready Positioning",
    body: "Learn how to frame your project and CV so it reads as sponsor-ready — not just recruiter-friendly.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" />
      </svg>
    ),
  },
  {
    title: "Direct, Practical Feedback",
    body: "Get honest input on your work in the session — what's strong, what's missing, what to fix next.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 12h8M8 16h5M4 6h16v14H4z" />
      </svg>
    ),
  },
];

const inputCls =
  "w-full rounded-lg border border-[#156374]/50 bg-[#0F4652] px-3.5 py-[11px] text-[13.5px] text-[#F2F7F7] outline-none transition-colors placeholder:text-[#4A6A7A] focus:border-[#2B7F95] appearance-none";

function VideoPlayer({ videoId }: { videoId: string }) {
  const [loaded, setLoaded] = React.useState(false);

  return loaded ? (
    <iframe
      className="block aspect-[9/12] w-full border-0"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Amdari portfolio session testimonial"
    />
  ) : (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="group relative flex aspect-[9/12] w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#156374]/60 to-[#061A20]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFE082] transition-transform duration-200 group-hover:scale-110">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#0C2730" className="ml-0.5">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <span className="absolute bottom-3 left-3 text-[11px] font-semibold tracking-[0.04em] text-[#C7D5D6]/60">
        Add clip
      </span>
    </button>
  );
}

const PortfolioSessionPage = () => {
  const { createNaRole, isSubmitting, errorMessage } = useCreateAdsData();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [visaStatus, setVisaStatus] = React.useState("");
  const [track, setTrack] = React.useState("");
  const [timeline, setTimeline] = React.useState("");
  const [heardFrom, setHeardFrom] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError("");

      const trimFirst = firstName.trim();
      const trimLast = lastName.trim();
      const trimEmail = email.trim();
      const trimPhone = phone.trim();

      if (
        !trimFirst ||
        !trimLast ||
        !trimEmail ||
        !trimPhone ||
        !country ||
        !visaStatus ||
        !track ||
        !timeline ||
        !heardFrom
      ) {
        setFormError("Please fill in all fields to reserve your spot.");
        return;
      }

      const res = await createNaRole({
        source: "PortfolioSession",
        firstName: trimFirst,
        lastName: trimLast,
        email: trimEmail,
        phone: trimPhone,
        location: country,
        visaType: `${track} — ${visaStatus} — ${timeline} — ${heardFrom}`,
      });

      if (!res) return;

      setSubmitted(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setVisaStatus("");
      setTrack("");
      setTimeline("");
      setHeardFrom("");
    },
    [createNaRole, country, email, firstName, heardFrom, lastName, phone, timeline, track, visaStatus]
  );

  return (
    <div className="min-h-screen bg-[#092A31] text-[#F2F7F7]">
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#156374]/22 bg-[#092A31]/85 px-[5%] py-4 backdrop-blur-[10px]">
        <Image src="/logo-white.svg" width={140} height={20} alt="Amdari" />
        <a
          href="#book"
          className="rounded-full border border-[#156374] px-5 py-2.5 text-sm font-semibold text-[#2B7F95] transition-colors hover:bg-[#156374] hover:text-white"
        >
          Book Consultation
        </a>
      </nav>

      {/* HERO */}
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-14 px-[5%] pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT */}
        <div>
          <div className="mb-[22px] inline-flex items-center gap-2 rounded-full border border-[#156374]/60 bg-[#0C3640] px-3.5 py-[7px] text-[13px] font-semibold text-[#2B7F95]">
            <span className="h-[7px] w-[7px] animate-[blink_1.6s_ease-in-out_infinite] rounded-full bg-[#FFE082]" />
            Free · Limited spots this month
          </div>

          <h1 className="mb-5 text-[clamp(34px,4.4vw,52px)] font-black leading-[1.15] tracking-normal text-white">
            Free Tech Portfolio Building{" "}
            <em className="not-italic text-[#FFE082]">Practical Session</em>
          </h1>

          <p className="mb-7 max-w-[520px] text-[17.5px] leading-[1.6] text-[#C7D5D6]">
            For career switchers targeting{" "}
            <strong className="font-semibold text-white">visa-sponsorship</strong>{" "}
            roles in the UK across Data Analytics, Data Science, Business
            Analysis, Project Management and Cybersecurity. Build a real,
            sponsor-ready portfolio project — live, with feedback.
          </p>

          {/* Track stamps */}
          <div className="mb-9 flex flex-wrap gap-2.5">
            {TRACK_STAMPS.map((stamp, i) => (
              <span
                key={stamp}
                className={`rounded-lg border border-dashed border-[#156374] bg-[#0C3640] px-3 py-[7px] text-[12.5px] font-semibold text-[#2B7F95] ${STAMP_ROTATIONS[i]}`}
              >
                {stamp}
              </span>
            ))}
          </div>

          {/* Hero points */}
          <ul className="flex flex-col gap-3">
            {[
              "Build one real portfolio project live, in your track",
              "Learn how to position it for UK sponsors, not just recruiters",
              "Get direct, practical feedback on your work in the room",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] text-[#C7D5D6]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#156374]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12l6 6L20 6"
                      stroke="#092A31"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — sticky form card */}
        <div
          id="book"
          className="w-full rounded-[18px] border border-[#156374]/45 bg-[#0C3640] p-7 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] lg:sticky lg:top-24"
        >
          <h2 className="mb-1.5 text-[22px] font-bold text-white">
            Reserve Your Free Spot
          </h2>
          <p className="mb-5 text-[13.5px] text-[#C7D5D6]">
            Takes under a minute. No credit card, no catch.
          </p>

          {submitted ? (
            <div className="py-5 text-center">
              <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-2xl">
                ✅
              </div>
              <h3 className="mb-1.5 text-[17px] font-extrabold text-white">
                You&apos;re booked!
              </h3>
              <p className="text-[13px] leading-[1.6] text-[#C7D5D6]">
                Check your inbox — we&apos;ll be in touch shortly to confirm
                your session spot.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex flex-col gap-[5px]">
                  <span className="text-xs font-semibold text-[#2B7F95]">
                    First name
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className={inputCls}
                  />
                </label>
                <label className="flex flex-col gap-[5px]">
                  <span className="text-xs font-semibold text-[#2B7F95]">
                    Last name
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className={inputCls}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-[5px]">
                <span className="text-xs font-semibold text-[#2B7F95]">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputCls}
                />
              </label>

              <label className="flex flex-col gap-[5px]">
                <span className="text-xs font-semibold text-[#2B7F95]">
                  Phone number
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={inputCls}
                />
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex flex-col gap-[5px]">
                  <span className="text-xs font-semibold text-[#2B7F95]">
                    Country
                  </span>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className={`${inputCls} [&>option]:bg-[#0C3640]`}
                  >
                    <option value="">Select</option>
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-[5px]">
                  <span className="text-xs font-semibold text-[#2B7F95]">
                    Visa status
                  </span>
                  <select
                    value={visaStatus}
                    onChange={(e) => setVisaStatus(e.target.value)}
                    required
                    className={`${inputCls} [&>option]:bg-[#0C3640]`}
                  >
                    <option value="">Select</option>
                    {VISA_STATUS_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-[5px]">
                <span className="text-xs font-semibold text-[#2B7F95]">
                  Which track are you building a portfolio for?
                </span>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  required
                  className={`${inputCls} [&>option]:bg-[#0C3640]`}
                >
                  <option value="">Select</option>
                  {TRACK_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-[5px]">
                <span className="text-xs font-semibold text-[#2B7F95]">
                  How soon are you looking to land a sponsorship job?
                </span>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  required
                  className={`${inputCls} [&>option]:bg-[#0C3640]`}
                >
                  <option value="">Select</option>
                  {TIMELINE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-[5px]">
                <span className="text-xs font-semibold text-[#2B7F95]">
                  Where did you hear about us?
                </span>
                <select
                  value={heardFrom}
                  onChange={(e) => setHeardFrom(e.target.value)}
                  required
                  className={`${inputCls} [&>option]:bg-[#0C3640]`}
                >
                  <option value="">Select</option>
                  {HEARD_FROM_OPTIONS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>

              {formError ? (
                <p className="text-[12px] text-[#fca5a5]">{formError}</p>
              ) : null}
              {errorMessage ? (
                <p className="text-[12px] text-[#fca5a5]">{errorMessage}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1.5 w-full rounded-[10px] bg-[#FFE082] py-[15px] text-[15.5px] font-bold text-[#0C2730] transition-[background-color,transform] hover:scale-[1.01] hover:bg-[#FFD54F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Reserving…" : "Reserve My Free Spot"}
              </button>
              <p className="mt-3 text-center text-xs text-[#C7D5D6]">
                Free · No credit card · Limited spots
              </p>
            </form>
          )}
        </div>
      </div>

      {/* BENEFITS */}
      <div className="border-y border-[#156374]/22 bg-[#061A20]">
        <div className="mx-auto max-w-[1180px] px-[5%] py-[78px]">
          <div className="mb-11 max-w-[640px]">
            <div className="mb-2 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#2B7F95]">
              <span className="inline-block h-0.5 w-[22px] bg-[#FFE082]" />
              What this unlocks
            </div>
            <h2 className="mt-2.5 text-[clamp(26px,3vw,34px)] font-bold text-white">
              Not a lecture. A working session.
            </h2>
            <p className="mt-2.5 text-[15.5px] text-[#C7D5D6]">
              You leave with a real artifact for your portfolio and a clear
              picture of what UK sponsors actually look for.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-[#156374]/25 bg-[#092A31] p-6"
              >
                <div className="mb-[18px] flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#156374]/20 text-[#2B7F95]">
                  {benefit.icon}
                </div>
                <h3 className="mb-2 text-[17px] font-bold text-white">
                  {benefit.title}
                </h3>
                <p className="text-[14.5px] text-[#C7D5D6]">{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="mx-auto max-w-[1180px] px-[5%] py-[70px]">
        <div className="mb-9 max-w-[560px]">
          <div className="mb-2 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#2B7F95]">
            <span className="inline-block h-0.5 w-[22px] bg-[#FFE082]" />
            Real outcomes
          </div>
          <h2 className="mt-2 text-[clamp(24px,2.8vw,32px)] font-bold text-white">
            Hear from people who secured a role
          </h2>
          <p className="mt-2.5 text-[15px] text-[#C7D5D6]">
            Short clips from participants who went through the process and
            landed sponsorship roles in the UK.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {TESTIMONIALS.map((testi) => (
            <div
              key={testi.id}
              className="overflow-hidden rounded-[14px] border border-[#156374]/25 bg-[#0C3640]"
            >
              <VideoPlayer videoId={testi.videoId} />
              <div className="px-4 py-3.5">
                <div className="text-[14.5px] font-bold text-white">
                  {testi.name}
                </div>
                <div className="mt-0.5 text-[12.5px] font-semibold text-[#FFE082]">
                  {testi.role}
                </div>
                <div className="mt-1.5 text-xs text-[#4A6A7A]">
                  {testi.track}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA BANNER */}
      <div className="relative overflow-hidden bg-[#061A20] py-[70px]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-[280px] w-[280px] rounded-full bg-[#FFE082]/10" />
        <div className="relative mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-8 px-[5%]">
          <div>
            <h2 className="max-w-[520px] text-[clamp(24px,3vw,32px)] font-bold text-white">
              Prefer to talk it through first?
            </h2>
            <p className="mt-2.5 max-w-[480px] text-[15px] text-[#C7D5D6]">
              Book a free 1:1 consultation and we&apos;ll map out the
              fastest path to a sponsorship-ready portfolio for your track.
            </p>
          </div>
          <a
            href="#book"
            className="whitespace-nowrap rounded-[10px] bg-[#FFE082] px-[30px] py-4 text-[15.5px] font-bold text-[#0C2730] transition-[background-color,transform] hover:scale-[1.02] hover:bg-[#FFD54F]"
          >
            Book a Free Consultation
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#156374]/22 px-[5%] py-9">
        <Image src="/logo-white.svg" width={120} height={18} alt="Amdari" />
        <p className="text-[13px] text-[#4A6A7A]">
          © 2026 Amdari. Tech internships and career support across the UK,
          US and Canada.
        </p>
      </footer>
    </div>
  );
};

export default PortfolioSessionPage;
