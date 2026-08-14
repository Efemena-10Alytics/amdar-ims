"use client";

import React from "react";
import Image from "next/image";
import { useCreateAdsData } from "@/features/ads/use-create-ads-data";
import "./animations.css";

// TODO: replace with real YouTube video IDs
const TESTIMONIALS = [
  { id: "testi1", videoId: "VIDEO_ID", name: "Add name", role: "Data Analytics intern" },
  { id: "testi2", videoId: "VIDEO_ID", name: "Add name", role: "Data Science intern" },
  { id: "testi3", videoId: "VIDEO_ID", name: "Add name", role: "Business Analysis intern" },
  { id: "testi4", videoId: "VIDEO_ID", name: "Add name", role: "Cybersecurity intern" },
];

const WEEK_STRIP = [
  { d: "Day 1", t: "Onboard & meet your team" },
  { d: "Day 2–4", t: "Real project work" },
  { d: "Day 5", t: "Ship it + certificate" },
];

const TRACKS_CHIPS = [
  "Data Analytics",
  "Data Science",
  "Business Analysis",
  "Project Management",
  "Cybersecurity",
];

const TRACK_OPTIONS = [
  "Data Analytics",
  "Data Science",
  "Business Analysis",
  "Project Management",
  "Cybersecurity",
  "Others",
];

const HEARD_FROM_OPTIONS = [
  "Facebook/Instagram Ads",
  "TikTok Ads",
  "YouTube",
  "Google",
  "Family and friends",
  "Others",
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
      title="Amdari internship testimonial"
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

const OneWeekInternshipPage = () => {
  const { createNaRole, isSubmitting, errorMessage } = useCreateAdsData();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [track, setTrack] = React.useState("");
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

      if (!trimFirst || !trimLast || !trimEmail || !trimPhone || !track || !heardFrom) {
        setFormError("Please fill in all fields to claim your free week.");
        return;
      }

      const res = await createNaRole({
        source: "OneWeekInternship",
        firstName: trimFirst,
        lastName: trimLast,
        email: trimEmail,
        phone: trimPhone,
        location: "UK",
        visaType: `${track} — ${heardFrom}`,
      });

      if (!res) return;

      setSubmitted(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setTrack("");
      setHeardFrom("");
    },
    [createNaRole, email, firstName, heardFrom, lastName, phone, track]
  );

  return (
    <div className="min-h-screen bg-[#092A31] text-[#F2F7F7]">
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#156374]/22 bg-[#092A31]/85 px-[5%] py-4 backdrop-blur-[10px]">
        <Image src="/logo-white.svg" width={140} height={20} alt="Amdari" />
        <a
          href="#apply"
          className="rounded-full bg-[#FFE082] px-5 py-2.5 text-sm font-bold text-[#0C2730] transition-[background-color,transform] hover:scale-[1.02] hover:bg-[#FFD54F]"
        >
          Claim Your Week
        </a>
      </nav>

      {/* HERO */}
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-14 px-[5%] pb-[70px] pt-[60px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT */}
        <div>
          <div className="mb-[22px] inline-flex items-center gap-2 rounded-full border border-[#156374]/60 bg-[#0C3640] px-3.5 py-[7px] text-[13px] font-semibold text-[#2B7F95]">
            <span className="h-[7px] w-[7px] animate-[blink_1.6s_ease-in-out_infinite] rounded-full bg-[#FFE082]" />
            Free · Spots close soon
          </div>

          <h1 className="mb-[18px] text-[clamp(32px,4.2vw,50px)] font-black leading-[1.15] tracking-normal text-white">
            Intern With a <em className="not-italic text-[#FFE082]">UK Company</em>.
            Free. For One Week.
          </h1>

          <p className="mb-[30px] max-w-[480px] text-[17px] leading-[1.6] text-[#C7D5D6]">
            Real tasks. Real UK team. One deliverable for your CV — in 5
            days, at zero cost.
          </p>

          {/* Week strip */}
          <div className="mb-8 flex flex-wrap gap-2">
            {WEEK_STRIP.map((day) => (
              <div
                key={day.d}
                className="min-w-[88px] flex-1 rounded-[10px] border border-[#156374]/25 bg-[#0C3640] p-3 text-center"
              >
                <div className="text-[15px] font-bold text-[#FFE082]">{day.d}</div>
                <div className="mt-[3px] text-[11px] leading-[1.3] text-[#C7D5D6]">
                  {day.t}
                </div>
              </div>
            ))}
          </div>

          {/* Track chips */}
          <div className="flex flex-wrap gap-[9px]">
            {TRACKS_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#156374]/60 bg-[#0C3640] px-[13px] py-1.5 text-xs font-semibold text-[#2B7F95]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — sticky form card */}
        <div
          id="apply"
          className="w-full rounded-[18px] border border-[#156374]/45 bg-[#0C3640] p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] lg:sticky lg:top-24"
        >
          <h2 className="mb-1.5 text-[21px] font-bold text-white">
            Claim Your Free Week
          </h2>
          <p className="mb-5 text-[13.5px] text-[#C7D5D6]">
            Under a minute to apply. No cost, no catch.
          </p>

          {submitted ? (
            <div className="py-5 text-center">
              <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-2xl">
                ✅
              </div>
              <h3 className="mb-1.5 text-[17px] font-extrabold text-white">
                You&apos;re in!
              </h3>
              <p className="text-[13px] leading-[1.6] text-[#C7D5D6]">
                Check your inbox — we&apos;ll be in touch shortly to confirm
                your internship week.
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

              <label className="flex flex-col gap-[5px]">
                <span className="text-xs font-semibold text-[#2B7F95]">
                  Which track excites you most?
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
                className="mt-1.5 w-full rounded-[10px] bg-[#FFE082] py-[15px] text-[15px] font-bold text-[#0C2730] transition-[background-color,transform] hover:scale-[1.01] hover:bg-[#FFD54F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Claiming…" : "Claim My Free Week"}
              </button>
              <p className="mt-3 text-center text-[11.5px] text-[#C7D5D6]">
                Free · No credit card · Limited spots
              </p>
            </form>
          )}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="mx-auto max-w-[1180px] px-[5%] py-[70px]">
        <div className="mb-9 max-w-[560px]">
          <div className="mb-2 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#2B7F95]">
            <span className="inline-block h-0.5 w-[22px] bg-[#FFE082]" />
            Real interns, real weeks
          </div>
          <h2 className="text-[clamp(24px,2.8vw,32px)] font-bold text-white">
            They did their week. Here&apos;s what happened.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-[18px] lg:grid-cols-4">
          {TESTIMONIALS.map((testi) => (
            <div
              key={testi.id}
              className="overflow-hidden rounded-[14px] border border-[#156374]/25 bg-[#0C3640]"
            >
              <VideoPlayer videoId={testi.videoId} />
              <div className="px-4 py-3.5">
                <div className="text-sm font-bold text-white">{testi.name}</div>
                <div className="mt-0.5 text-xs font-semibold text-[#FFE082]">
                  {testi.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA BANNER */}
      <div className="relative overflow-hidden border-y border-[#156374]/25 bg-gradient-to-[120deg] from-[#0C3640] to-[#061A20] py-16">
        <div className="pointer-events-none absolute -right-[70px] -top-[70px] h-[260px] w-[260px] rounded-full bg-[#FFE082]/10" />
        <div className="relative mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-7 px-[5%]">
          <div>
            <h2 className="max-w-[480px] text-[clamp(22px,2.8vw,30px)] font-bold text-white">
              One week. Zero cost. A real UK company on your CV.
            </h2>
            <p className="mt-2 max-w-[440px] text-[14.5px] text-[#C7D5D6]">
              Spots are limited and go fast every round — reserve yours now.
            </p>
          </div>
          <a
            href="#apply"
            className="whitespace-nowrap rounded-[10px] bg-[#FFE082] px-7 py-4 text-[15px] font-bold text-[#0C2730] transition-[background-color,transform] hover:scale-[1.02] hover:bg-[#FFD54F]"
          >
            Claim Your Free Week
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-3.5 px-[5%] py-8">
        <Image src="/logo-white.svg" width={120} height={18} alt="Amdari" />
        <p className="text-[12.5px] text-[#4A6A7A]">
          © 2026 Amdari. Free internships with real UK organizations.
        </p>
      </footer>
    </div>
  );
};

export default OneWeekInternshipPage;
