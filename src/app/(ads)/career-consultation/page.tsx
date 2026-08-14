"use client";

import React from "react";
import Image from "next/image";
import { useCreateAdsData } from "@/features/ads/use-create-ads-data";
import {
  TESTIMONIALS,
  TestimonialVideoModal,
  TestimonialVideoThumb,
} from "@/components/_core/shared/testimonial-video";
import "./animations.css";

const CAREER_TRACKS = [
  "Data Analytics",
  "Data Science",
  "Business Analysis",
  "Project Management",
  "Cybersecurity",
  "Others",
];

const VISA_STATUSES = [
  "Student visa",
  "Graduate (PSW) visa",
  "Dependent visa",
  "Skilled worker visa",
  "Others",
];

const HERO_POINTS = [
  "Get a personal roadmap for your track and visa status",
  "Learn how to gain real UK work experience, fast",
  "Understand exactly what UK hiring managers look for",
];

const inputCls =
  "w-full rounded-lg border border-[#156374]/50 bg-[#0F4652] px-3.5 py-[11px] text-[13.5px] text-[#F2F7F7] outline-none transition-colors placeholder:text-[#4A6A7A] focus:border-[#2B7F95] appearance-none";

const CareerConsultationPage = () => {
  const { createNaRole, isSubmitting, errorMessage } = useCreateAdsData();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [track, setTrack] = React.useState("");
  const [visaStatus, setVisaStatus] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);

  const closeVideo = React.useCallback(() => setActiveVideo(null), []);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError("");

      const trimFirst = firstName.trim();
      const trimLast = lastName.trim();
      const trimEmail = email.trim();
      const trimPhone = phone.trim();

      if (!trimFirst || !trimLast || !trimEmail || !trimPhone || !track || !visaStatus) {
        setFormError("Please fill in all fields to book your consultation.");
        return;
      }

      const res = await createNaRole({
        source: "CareerConsultation",
        firstName: trimFirst,
        lastName: trimLast,
        email: trimEmail,
        phone: trimPhone,
        location: "UK",
        visaType: `${track} — ${visaStatus}`,
      });

      if (!res) return;

      setSubmitted(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setTrack("");
      setVisaStatus("");
    },
    [createNaRole, email, firstName, lastName, phone, track, visaStatus]
  );

  return (
    <div className="min-h-screen bg-[#092A31] text-[#F2F7F7]">
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#156374]/22 bg-[#092A31]/85 px-[5%] py-4 backdrop-blur-[10px]">
        <Image src="/logo-white.svg" width={140} height={20} alt="Amdari" />
        <a
          href="#book"
          className="rounded-full bg-[#FFE082] px-5 py-2.5 text-sm font-bold text-[#0C2730] transition-[background-color,transform] hover:scale-[1.02] hover:bg-[#FFD54F]"
        >
          Register Now
        </a>
      </nav>

      {/* HERO */}
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-14 px-[5%] pb-[70px] pt-[60px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT */}
        <div>
          <div className="mb-[22px] inline-flex items-center gap-2 rounded-full border border-[#156374]/60 bg-[#0C3640] px-3.5 py-[7px] text-[13px] font-semibold text-[#2B7F95]">
            <span className="h-[7px] w-[7px] animate-[blink_1.6s_ease-in-out_infinite] rounded-full bg-[#FFE082]" />
            Free consultation · Seats limited
          </div>

          <h1 className="mb-4 text-[clamp(30px,4vw,46px)] font-black leading-[1.15] tracking-normal text-white">
            Talk to a UK Hiring Expert. Leave With a Plan to Get Hired in{" "}
            <em className="not-italic text-[#FFE082]">4 Months</em>.
          </h1>

          {/* Hero points */}
          <ul className="flex flex-col gap-[11px]">
            {HERO_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-[11px] text-[14.5px] text-[#C7D5D6]">
                <span className="mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full bg-[#156374]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
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
          className="w-full rounded-[18px] border border-[#156374]/45 bg-[#0C3640] p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] lg:sticky lg:top-24"
        >
          <h2 className="mb-1.5 text-[21px] font-bold text-white">
            Register for Webinar
          </h2>
          <p className="mb-5 text-[13.5px] text-[#C7D5D6]">
            Under a minute to reserve your slot.
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
                your consultation slot.
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
                  Career track
                </span>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  required
                  className={`${inputCls} [&>option]:bg-[#0C3640]`}
                >
                  <option value="">Select</option>
                  {CAREER_TRACKS.map((t) => (
                    <option key={t} value={t}>
                      {t}
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
                  {VISA_STATUSES.map((v) => (
                    <option key={v} value={v}>
                      {v}
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
                {isSubmitting ? "Registering…" : "Register Now"}
              </button>
              <p className="mt-3 text-center text-[11.5px] text-[#C7D5D6]">
                Free · No credit card · Limited slots
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
            They booked the call
          </div>
          <h2 className="text-[clamp(24px,2.8vw,32px)] font-bold text-white">
            One conversation changed their next 4 months.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-[18px] lg:grid-cols-3">
          {TESTIMONIALS.map((testi) => (
            <div
              key={testi.id}
              className="overflow-hidden rounded-[14px] border border-[#156374]/25 bg-[#0C3640]"
            >
              <TestimonialVideoThumb
                label={testi.name}
                onPlay={() => setActiveVideo(testi.videoId)}
              />
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
            <h2 className="max-w-[500px] text-[clamp(22px,2.8vw,30px)] font-bold text-white">
              Your next 4 months could look completely different.
            </h2>
            <p className="mt-2 max-w-[440px] text-[14.5px] text-[#C7D5D6]">
              Book your free consultation and walk away with a clear plan —
              not another generic tip list.
            </p>
          </div>
          <a
            href="#book"
            className="whitespace-nowrap rounded-[10px] bg-[#FFE082] px-7 py-4 text-[15px] font-bold text-[#0C2730] transition-[background-color,transform] hover:scale-[1.02] hover:bg-[#FFD54F]"
          >
            Register Now
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-3.5 px-[5%] py-8">
        <Image src="/logo-white.svg" width={120} height={18} alt="Amdari" />
        <p className="text-[12.5px] text-[#4A6A7A]">
          © 2026 Amdari. 1:1 career consultations with UK hiring experts.
        </p>
      </footer>

      {activeVideo ? (
        <TestimonialVideoModal
          videoId={activeVideo}
          onClose={closeVideo}
          title="Amdari consultation testimonial"
        />
      ) : null}
    </div>
  );
};

export default CareerConsultationPage;
