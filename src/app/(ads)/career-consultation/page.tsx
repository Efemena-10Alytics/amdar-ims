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
        <div className="flex items-center gap-3">
          <Image src="/logo-white.svg" width={120} height={18} alt="Amdari" />
          <div className="h-4 w-px bg-[#156374]/50" />
          <span className="text-xs font-bold tracking-[0.2em] text-[#C7D5D6]">
            UK JOB LAB
          </span>
        </div>
        <a
          href="#book"
          className="rounded-lg border border-[#FFE082] px-4 py-2 text-sm font-semibold text-[#FFE082] transition-[background-color,color,transform] hover:scale-[1.02] hover:bg-[#FFE082] hover:text-[#0C2730]"
        >
          Save my seat
        </a>
      </nav>

      {/* HERO */}
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-14 px-[5%] pb-[70px] pt-[60px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT */}
        <div>
          <div className="mb-[22px] inline-flex items-center gap-2 rounded-full border border-[#FFE082] px-3.5 py-[6px] text-[11px] font-bold tracking-wider text-[#FFE082]">
            FREE LIVE ONLINE SESSION
          </div>

          <h1 className="mb-4 text-[clamp(32px,4.5vw,50px)] font-black leading-[1.15] tracking-normal text-white">
            Applying for UK Jobs but <br />
            <span className="text-[#FFE082]">Not Getting Interviews?</span>
          </h1>

          <p className="mb-3 max-w-[500px] text-[17px] font-medium leading-[1.5] text-[#F2F7F7]">
            Find out where your job search may be going wrong— and what to change
            next.
          </p>

          <p className="mb-7 max-w-[500px] text-[15px] leading-[1.6] text-[#C7D5D6]">
            Practical guidance on finding relevant opportunities, strengthening
            your applications and showing employers what you can do.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-[14px] text-[#C7D5D6]">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-[#FFE082]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="12" rx="2" />
                <line x1="2" y1="20" x2="22" y2="20" />
              </svg>
              <span>Live online</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-[#FFE082]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Practical examples</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-[#FFE082]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Live Q&amp;A</span>
            </div>
          </div>
        </div>

        {/* RIGHT — sticky form card */}
        <div
          id="book"
          className="w-full rounded-[18px] border border-[#156374]/45 bg-[#0C3640] p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] lg:sticky lg:top-24"
        >
          <h2 className="mb-1.5 text-[21px] font-bold text-white">
            Save Your Free Seat
          </h2>
          <p className="mb-5 text-[13.5px] text-[#C7D5D6]">
            Join the next UK Job Lab session.
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
                className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#FFE082] py-[15px] text-[15px] font-bold text-[#0C2730] transition-[background-color,transform] hover:scale-[1.01] hover:bg-[#FFD54F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{isSubmitting ? "Saving seat…" : "Save My Free Seat"}</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
              <p className="mt-3 text-center text-[11.5px] text-[#C7D5D6]">
                Free to attend. Join online.
              </p>
          </form>
        </div>
      </div>

      {/* GIVE YOUR JOB SEARCH A CLEARER DIRECTION */}
      <div className="mx-auto max-w-[1180px] px-[5%] pb-[70px] pt-4">
        <h2 className="mb-8 text-[clamp(26px,3vw,36px)] font-black text-white">
          Give Your Job Search a Clearer Direction
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="flex items-start gap-4 rounded-[14px] border border-[#156374]/35 bg-[#0C3640]/50 p-6">
            <svg
              className="mt-0.5 h-7 w-7 shrink-0 text-[#FFE082]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div>
              <h3 className="text-[17px] font-bold text-white">
                Find the right opportunities
              </h3>
              <p className="mt-1.5 text-[14px] leading-[1.6] text-[#C7D5D6]">
                Explore relevant job boards and employers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-[14px] border border-[#156374]/35 bg-[#0C3640]/50 p-6">
            <svg
              className="mt-0.5 h-7 w-7 shrink-0 text-[#FFE082]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="8" y1="10" x2="16" y2="10" />
              <line x1="8" y1="14" x2="16" y2="14" />
              <line x1="8" y1="18" x2="12" y2="18" />
            </svg>
            <div>
              <h3 className="text-[17px] font-bold text-white">
                Strengthen your applications
              </h3>
              <p className="mt-1.5 text-[14px] leading-[1.6] text-[#C7D5D6]">
                Present your skills and experience clearly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-[14px] border border-[#156374]/35 bg-[#0C3640]/50 p-6">
            <svg
              className="mt-0.5 h-7 w-7 shrink-0 text-[#FFE082]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div>
              <h3 className="text-[17px] font-bold text-white">
                Prepare for interviews
              </h3>
              <p className="mt-1.5 text-[14px] leading-[1.6] text-[#C7D5D6]">
                Show employers the value you can bring.
              </p>
            </div>
          </div>
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
            Save My Free Seat
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
