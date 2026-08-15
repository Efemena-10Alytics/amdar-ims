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
  "https://forms.zohopublic.com/amdariinc1/form/UKJobLab/formperma/J4q0d7thz45xkdXkNbvCYEHbZi7mwl-XyB8_xOsXaP8/htmlRecords/submit";

// This Zoho form is shared with /remote-internship, so tag the source to keep
// the two pages' leads distinguishable in Zoho.
const ZOHO_REFERRER = "career-consultation";

const OTHER = "Others";

const CAREER_TRACKS = [
  "Business Analysis",
  "Data Analytics",
  "Data Science",
  "Cyber security",
  "Project Management",
  "GRC",
  OTHER,
];

const VISA_STATUSES = [
  "Short-Term Study Visa",
  "Student Visa",
  "Dependent Visa",
  "Skilled worker visa",
  OTHER,
];

const TIMELINE_OPTIONS = [
  "within a month",
  "1-3 months",
  "Just exploring for now",
];

const HEARD_ABOUT_US_OPTIONS = [
  "Facebook/Instagram ads",
  "TikTok Ads",
  "Google",
  "Family and Friends",
  "Faloh",
  OTHER,
];

const HERO_POINTS = [
  "Get a personal roadmap for your track and visa status",
  "Learn how to gain real UK work experience, fast",
  "Understand exactly what UK hiring managers look for",
];

const inputCls =
  "w-full rounded-lg border border-[#156374]/50 bg-[#0F4652] px-3.5 py-[11px] text-[13.5px] text-[#F2F7F7] outline-none transition-colors placeholder:text-[#4A6A7A] focus:border-[#2B7F95] appearance-none";

const CareerConsultationPage = () => {
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
  const [visaStatus, setVisaStatus] = React.useState("");
  const [visaStatusOther, setVisaStatusOther] = React.useState("");
  const [timeline, setTimeline] = React.useState("");
  const [heardAboutUs, setHeardAboutUs] = React.useState("");
  const [heardAboutUsOther, setHeardAboutUsOther] = React.useState("");
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
        !visaStatus ||
        !timeline ||
        !heardAboutUs
      ) {
        setFormError("Please fill in all fields to book your consultation.");
        return;
      }

      // "Others" reveals a free-text box; send what the user typed, not the
      // literal "Others" placeholder.
      const trimTrackOther = trackOther.trim();
      const trimVisaOther = visaStatusOther.trim();
      const trimHeardOther = heardAboutUsOther.trim();
      if (track === OTHER && !trimTrackOther) {
        setFormError("Please enter your career track.");
        return;
      }
      if (visaStatus === OTHER && !trimVisaOther) {
        setFormError("Please enter your visa status.");
        return;
      }
      if (heardAboutUs === OTHER && !trimHeardOther) {
        setFormError("Please tell us where you heard about us.");
        return;
      }
      const trackValue = track === OTHER ? trimTrackOther : track;
      const visaValue = visaStatus === OTHER ? trimVisaOther : visaStatus;
      const heardValue = heardAboutUs === OTHER ? trimHeardOther : heardAboutUs;

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
          SingleLine1: trimFirst,
          SingleLine: trimLast,
          Email: trimEmail,
          PhoneNumber_countrycodeval: callingCode,
          PhoneNumber_countrycode: nationalNumber,
          SingleLine2: trimCountry,
          Dropdown3: timeline,
          Dropdown1: visaValue,
          Dropdown2: trackValue,
          Dropdown: heardValue,
        });
      } catch {
        setFormError(
          "We couldn't complete your registration. Please check your details and try again."
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
      setVisaStatus("");
      setVisaStatusOther("");
      setTimeline("");
      setHeardAboutUs("");
      setHeardAboutUsOther("");
      router.push("/career-consultation/thank-you");
    },
    [
      country,
      email,
      firstName,
      heardAboutUs,
      heardAboutUsOther,
      lastName,
      phone,
      router,
      selectedPhoneCountry?.callingCode,
      timeline,
      track,
      trackOther,
      visaStatus,
      visaStatusOther,
    ]
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
              </div>

              {track === OTHER ? (
                <input
                  type="text"
                  value={trackOther}
                  onChange={(e) => setTrackOther(e.target.value)}
                  placeholder="Please specify your career track"
                  className={inputCls}
                />
              ) : null}

              {visaStatus === OTHER ? (
                <input
                  type="text"
                  value={visaStatusOther}
                  onChange={(e) => setVisaStatusOther(e.target.value)}
                  placeholder="Please specify your visa status"
                  className={inputCls}
                />
              ) : null}

              <label className="flex flex-col gap-[5px]">
                <span className="text-xs font-semibold text-[#2B7F95]">
                  How soon do you need to land a job in the UK?
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
                  How did you hear about us?
                </span>
                <select
                  value={heardAboutUs}
                  onChange={(e) => setHeardAboutUs(e.target.value)}
                  required
                  className={`${inputCls} [&>option]:bg-[#0C3640]`}
                >
                  <option value="">Select</option>
                  {HEARD_ABOUT_US_OPTIONS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>

              {heardAboutUs === OTHER ? (
                <input
                  type="text"
                  value={heardAboutUsOther}
                  onChange={(e) => setHeardAboutUsOther(e.target.value)}
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
                {isSubmitting ? "Registering…" : "Register Now"}
              </button>
              <p className="mt-3 text-center text-[11.5px] text-[#C7D5D6]">
                Free · No credit card · Limited slots
              </p>
          </form>
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
