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
  "https://forms.zohopublic.com/amdariinc1/form/USCanadaCareerInfoSession/formperma/4sy5NSfTqV1RK-PM6l_lPBTF_zWKc3iI-WsUAOtQ2dk/htmlRecords/submit";

// Tags the lead so NA registrations stay distinguishable from the UK page's.
const ZOHO_REFERRER = "na-career-consultation";

// Every list below must match the Zoho form's own options exactly — Zoho rejects
// the record (409) on any value it doesn't recognise. None of these fields offer
// an "Others" option, so there is no free-text fallback.

/** Zoho: Dropdown2 — "Which career path are you interested in?" */
const CAREER_PATHS = [
  "Business Analysis",
  "Data Analytics",
  "Data Science",
  "Cyber security",
  "Project Management",
  "GRC",
];

/** Zoho: Dropdown1 — "How soon are you looking to start?" */
const START_TIMINGS = ["immediately", "within 1-3 months", "Just exploring"];

/** Zoho: Dropdown3 — "What is your primary career goal over the next 12 months?" */
const CAREER_GOALS = [
  "Land a fully remote tech job",
  "Earn CAD $100,000+ annually",
  "Switch into a better-paying tech role",
  "Secure my first tech job in Canada/US",
];

/** Zoho: Dropdown4 — biggest challenge */
const CHALLENGES = [
  "Lack of Canadian/US work experience",
  "Not getting interviews",
  "Struggling to pass interviews",
  "Limited professional network",
  "My CV/LinkedIn isn't attracting recruiters",
];

/** Zoho: Dropdown5 — internship interest */
const INTERNSHIP_INTEREST = [
  "Very interested",
  "Somewhat interested",
  "Not sure—I need more information",
  "Not interested",
];

/** Zoho: Dropdown — "How did you hear about us?" */
const HEARD_ABOUT_US_OPTIONS = [
  "Facebook/Instagram ads",
  "TikTok Ads",
  "Google",
  "Family and Friends",
  "Faloh",
];

const HERO_POINTS = [
  "Get a personal roadmap for your track and work authorization status",
  "Learn how to gain real US/Canada work experience, fast",
  "Understand exactly what US/Canada hiring managers look for",
];

const inputCls =
  "w-full rounded-lg border border-[#156374]/50 bg-[#0F4652] px-3.5 py-[11px] text-[13.5px] text-[#F2F7F7] outline-none transition-colors placeholder:text-[#4A6A7A] focus:border-[#2B7F95] appearance-none";

const selectCls = `${inputCls} [&>option]:bg-[#0C3640]`;

const labelCls = "text-xs font-semibold text-[#2B7F95]";

const NaCareerConsultationPage = () => {
  const router = useRouter();
  const { data: countries = [], isLoading: countriesLoading } = useCountries();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneCountryCode, setPhoneCountryCode] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [careerPath, setCareerPath] = React.useState("");
  const [startTiming, setStartTiming] = React.useState("");
  const [careerGoal, setCareerGoal] = React.useState("");
  const [challenge, setChallenge] = React.useState("");
  const [internshipInterest, setInternshipInterest] = React.useState("");
  const [heardAboutUs, setHeardAboutUs] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);

  const closeVideo = React.useCallback(() => setActiveVideo(null), []);

  React.useEffect(() => {
    if (!countries.length) return;
    const defaultCountry =
      countries.find((c) => c.name === "United States") ?? countries[0];
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
        !careerPath ||
        !startTiming ||
        !careerGoal ||
        !challenge ||
        !internshipInterest ||
        !heardAboutUs
      ) {
        setFormError("Please fill in all fields to reserve your slot.");
        return;
      }

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
          Dropdown2: careerPath,
          Dropdown1: startTiming,
          Dropdown3: careerGoal,
          Dropdown4: challenge,
          Dropdown5: internshipInterest,
          Dropdown: heardAboutUs,
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
      setCareerPath("");
      setStartTiming("");
      setCareerGoal("");
      setChallenge("");
      setInternshipInterest("");
      setHeardAboutUs("");
      router.push("/na-career-consultation/thank-you");
    },
    [
      careerGoal,
      careerPath,
      challenge,
      country,
      email,
      firstName,
      heardAboutUs,
      internshipInterest,
      lastName,
      phone,
      router,
      selectedPhoneCountry?.callingCode,
      startTiming,
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
            Talk to a US/Canada Hiring Expert. Leave With a Plan to Get Hired in{" "}
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
                <span className={labelCls}>First name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className={inputCls}
                />
              </label>
              <label className="flex flex-col gap-[5px]">
                <span className={labelCls}>Last name</span>
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
                <span className={labelCls}>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputCls}
                />
              </label>
              <label className="flex flex-col gap-[5px]">
                <span className={labelCls}>Country</span>
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
              <span className={labelCls}>Phone number (WhatsApp)</span>
              <div className="grid grid-cols-[110px_1fr] gap-2">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  className={selectCls}
                >
                  <option value="">{countriesLoading ? "…" : "Code"}</option>
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
                <span className={labelCls}>Career path</span>
                <select
                  value={careerPath}
                  onChange={(e) => setCareerPath(e.target.value)}
                  required
                  className={selectCls}
                >
                  <option value="">Select</option>
                  {CAREER_PATHS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-[5px]">
                <span className={labelCls}>How soon are you starting?</span>
                <select
                  value={startTiming}
                  onChange={(e) => setStartTiming(e.target.value)}
                  required
                  className={selectCls}
                >
                  <option value="">Select</option>
                  {START_TIMINGS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-[5px]">
              <span className={labelCls}>
                What is your primary career goal over the next 12 months?
              </span>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                required
                className={selectCls}
              >
                <option value="">Select</option>
                {CAREER_GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-[5px]">
              <span className={labelCls}>
                What is the biggest challenge preventing you from getting the
                tech job you want?
              </span>
              <select
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                required
                className={selectCls}
              >
                <option value="">Select</option>
                {CHALLENGES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-[5px]">
              <span className={labelCls}>
                If an internship could help you gain Canada/US work experience
                and strengthen your CV, how interested would you be?
              </span>
              <select
                value={internshipInterest}
                onChange={(e) => setInternshipInterest(e.target.value)}
                required
                className={selectCls}
              >
                <option value="">Select</option>
                {INTERNSHIP_INTEREST.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-[5px]">
              <span className={labelCls}>How did you hear about us?</span>
              <select
                value={heardAboutUs}
                onChange={(e) => setHeardAboutUs(e.target.value)}
                required
                className={selectCls}
              >
                <option value="">Select</option>
                {HEARD_ABOUT_US_OPTIONS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </label>

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
          © 2026 Amdari. 1:1 career consultations with US and Canada hiring
          experts.
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

export default NaCareerConsultationPage;
