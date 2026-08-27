"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCountries } from "@/features/portfolio/use-countries";
import { submitToZoho, ZOHO_RETURN_PATH } from "@/lib/submit-to-zoho";
import {
  TESTIMONIALS,
  TestimonialVideoModal,
  TestimonialVideoThumb,
} from "@/components/_core/shared/testimonial-video";
import "./animations.css";

const ZOHO_FORM_URL =
  "https://forms.zohopublic.com/amdariinc1/form/ReserveYourSpotforThisFriday/formperma/QVJ349_sXHiU6ktkwk3pOBf6hciMVjWl9_rJNLcaBTY/htmlRecords/submit";

// This Zoho form is shared with /get-job-experience-uk-recruiters-demand, so tag
// the source to keep the two pages' leads distinguishable in Zoho.
const ZOHO_REFERRER = "one-week-internship";

const OTHER = "Others";

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
  "Project Management",
  "Business Analysis",
  "Data Science",
  "Cybersecurity",
  OTHER,
];

const VISA_TYPE_OPTIONS = [
  "Short-Term Study Visa",
  "Student Visa",
  "Dependent visa",
  "Skilled worker visa",
  OTHER,
];

const TIMELINE_OPTIONS = ["1 month", "1-3 month", "Just exploring for now"];

const HEARD_FROM_OPTIONS = [
  "Facebook/Instagram Ads",
  "Faloh",
  "Tiktok Ads",
  "Youtube",
  "Google",
  "Family and friends",
  OTHER,
];

const inputCls =
  "w-full rounded-lg border border-[#156374]/50 bg-[#0F4652] px-3.5 py-[11px] text-[13.5px] text-[#F2F7F7] outline-none transition-colors placeholder:text-[#4A6A7A] focus:border-[#2B7F95] appearance-none";

const OneWeekInternshipPage = () => {
  const router = useRouter();
  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneCountryCode, setPhoneCountryCode] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [track, setTrack] = React.useState("");
  const [trackOther, setTrackOther] = React.useState("");
  const [visaType, setVisaType] = React.useState("");
  const [visaTypeOther, setVisaTypeOther] = React.useState("");
  const [timeline, setTimeline] = React.useState("");
  const [heardFrom, setHeardFrom] = React.useState("");
  const [heardFromOther, setHeardFromOther] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);

  const closeVideo = React.useCallback(() => setActiveVideo(null), []);

  React.useEffect(() => {
    if (!countries.length) return;
    const defaultCountry =
      countries.find((c) => c.name === "United Kingdom") ?? countries[0];
    setPhoneCountryCode((prev) => prev || defaultCountry.code);
  }, [countries]);

  const selectedPhoneCountry = React.useMemo(
    () => countries.find((c) => c.code === phoneCountryCode),
    [countries, phoneCountryCode]
  );

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError("");

      const trimFirst = firstName.trim();
      const trimLast = lastName.trim();
      const trimEmail = email.trim();
      const trimPhone = phone.trim();
      const trimCountry = country.trim();

      if (
        !trimFirst ||
        !trimLast ||
        !trimEmail ||
        !trimPhone ||
        !trimCountry ||
        !track ||
        !visaType ||
        !timeline ||
        !heardFrom
      ) {
        setFormError("Please fill in all fields to claim your free week.");
        return;
      }

      // "Others" reveals a free-text box; send what the user typed, not the
      // literal "Others" placeholder.
      const trimTrackOther = trackOther.trim();
      const trimVisaOther = visaTypeOther.trim();
      const trimHeardOther = heardFromOther.trim();
      if (track === OTHER && !trimTrackOther) {
        setFormError("Please enter your track.");
        return;
      }
      if (visaType === OTHER && !trimVisaOther) {
        setFormError("Please enter your visa type.");
        return;
      }
      if (heardFrom === OTHER && !trimHeardOther) {
        setFormError("Please tell us where you heard about us.");
        return;
      }
      const trackValue = track === OTHER ? trimTrackOther : track;
      const visaValue = visaType === OTHER ? trimVisaOther : visaType;
      const heardValue = heardFrom === OTHER ? trimHeardOther : heardFrom;

      // Zoho rejects the record (409) when the calling code is missing, so
      // don't let a blank selection through.
      const callingCode = selectedPhoneCountry?.callingCode ?? "";
      if (!callingCode) {
        setFormError("Please select your phone country code.");
        return;
      }

      // Zoho also rejects (409) when the number repeats the calling code, which
      // happens whenever someone types their full international number.
      let nationalNumber = trimPhone.replace(/[\s()-]/g, "");
      if (nationalNumber.startsWith("+")) {
        nationalNumber = nationalNumber.startsWith(callingCode)
          ? nationalNumber.slice(callingCode.length)
          : nationalNumber.replace(/^\+\d{1,4}/, "");
      }

      setIsSubmitting(true);
      try {
        await submitToZoho(ZOHO_FORM_URL, {
          zf_referrer_name: ZOHO_REFERRER,
          zf_redirect_url: `${window.location.origin}${ZOHO_RETURN_PATH}`,
          zc_gad: "",
          SingleLine: trimFirst,
          SingleLine1: trimLast,
          Email1: trimEmail,
          PhoneNumber1_countrycodeval: callingCode,
          PhoneNumber1_countrycode: nationalNumber,
          SingleLine2: trimCountry,
          Dropdown3: timeline,
          Dropdown: visaValue,
          Dropdown2: trackValue,
          Dropdown1: heardValue,
        });
      } catch {
        // Reaching here means Zoho refused the record, not that the user typed
        // something wrong — don't send them hunting through valid details.
        setFormError(
          "Something went wrong on our end — your details look fine. Please try again, or email hello@amdari.io and we'll reserve your spot."
        );
        return;
      } finally {
        setIsSubmitting(false);
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setTrack("");
      setTrackOther("");
      setVisaType("");
      setVisaTypeOther("");
      setTimeline("");
      setHeardFrom("");
      setHeardFromOther("");
      router.push("/one-week-internship/thank-you");
    },
    [
      country,
      email,
      firstName,
      heardFrom,
      heardFromOther,
      lastName,
      phone,
      router,
      selectedPhoneCountry?.callingCode,
      timeline,
      track,
      trackOther,
      visaType,
      visaTypeOther,
    ]
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

              <div className="grid grid-cols-2 gap-2.5">
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
                    Country
                  </span>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    placeholder="Country of residence"
                    className={inputCls}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-[5px]">
                <span className="text-xs font-semibold text-[#2B7F95]">
                  Phone number
                </span>
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <select
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    className={`${inputCls} [&>option]:bg-[#0C3640]`}
                  >
                    <option value="">
                      {countriesLoading ? "…" : "Code"}
                    </option>
                    {countries.map((phoneCountry) => (
                      <option key={phoneCountry.code} value={phoneCountry.code}>
                        {phoneCountry.callingCode} ({phoneCountry.code})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
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
                    Your current visa type
                  </span>
                  <select
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                    required
                    className={`${inputCls} [&>option]:bg-[#0C3640]`}
                  >
                    <option value="">Select</option>
                    {VISA_TYPE_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {track === OTHER ? (
                <input
                  type="text"
                  value={trackOther}
                  onChange={(e) => setTrackOther(e.target.value)}
                  placeholder="Please specify your track"
                  className={inputCls}
                />
              ) : null}

              {visaType === OTHER ? (
                <input
                  type="text"
                  value={visaTypeOther}
                  onChange={(e) => setVisaTypeOther(e.target.value)}
                  placeholder="Please specify your visa type"
                  className={inputCls}
                />
              ) : null}

              <label className="flex flex-col gap-[5px]">
                <span className="text-xs font-semibold text-[#2B7F95]">
                  How soon will you like to land a job in the UK?
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

              {heardFrom === OTHER ? (
                <input
                  type="text"
                  value={heardFromOther}
                  onChange={(e) => setHeardFromOther(e.target.value)}
                  placeholder="Please specify where you heard about us"
                  className={inputCls}
                />
              ) : null}

              {formError ? (
                <p className="text-[12px] text-[#fca5a5]">{formError}</p>
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

        <div className="grid grid-cols-2 gap-[18px] lg:grid-cols-3">
          {TESTIMONIALS.map((testi) => (
            <div
              key={testi.id}
              className="overflow-hidden rounded-[14px] border border-[#156374]/25 bg-[#0C3640]"
            >
              <TestimonialVideoThumb
                label={testi.name}
                videoId={testi.videoId}
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

      {activeVideo ? (
        <TestimonialVideoModal
          videoId={activeVideo}
          onClose={closeVideo}
          title="Amdari internship testimonial"
        />
      ) : null}
    </div>
  );
};

export default OneWeekInternshipPage;
