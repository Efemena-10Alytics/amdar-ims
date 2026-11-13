"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCountries } from "@/features/portfolio/use-countries";
import type { JobOpening } from "../data";
import {
  PhoneField,
  SelectField,
  TextField,
  TextareaField,
  UploadField,
} from "./fields";
import { ApplicationSuccessModal } from "./success-modal";

const TOTAL_STEPS = 2;

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1 - 2 years",
  "2 - 3 years",
  "3 - 5 years",
  "5+ years",
];
const NYSC_OPTIONS = ["Completed", "Currently serving", "Exempted", "Not applicable"];
const YES_NO_OPTIONS = ["Yes", "No"];
const START_OPTIONS = [
  "Immediately",
  "Within 2 weeks",
  "Within 1 month",
  "More than 1 month",
];
const CONFIRM_OPTIONS = ["Yes, I confirm", "No"];

/** Used if the countries endpoint is unreachable, so the select is never empty. */
const FALLBACK_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Canada",
];

const STEP_HEADINGS = [
  {
    title: "Personal & Professional Information",
    subtitle: "Share your details and experience.",
  },
  {
    title: "Documents & Availability",
    subtitle: "Share your documents and availability.",
  },
];

function StepRing({ step }: { step: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - step / TOTAL_STEPS);

  return (
    <span className="relative flex size-11 shrink-0 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" aria-hidden>
        <circle cx="22" cy="22" r={radius} fill="white" stroke="#D6EFDD" strokeWidth="3" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#22C55E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="relative font-sora text-xs font-semibold text-[#092A31]">
        {step}/{TOTAL_STEPS}
      </span>
    </span>
  );
}

/** The faint squares scattered behind the card in the design. */
function BackdropSquares() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute top-16 left-[10%] size-22 bg-white/45" />
      <span className="absolute top-56 left-[10%] size-22 bg-white/45" />
      <span className="absolute top-6 left-[30%] size-16 bg-white/35" />
      <span className="absolute top-4 right-[8%] size-22 bg-white/45" />
      <span className="absolute top-26 right-[8%] size-14 bg-white/35" />
      <span className="absolute top-4 right-[14%] size-16 bg-white/35" />
    </div>
  );
}

const ApplyForm = ({ job }: { job: JobOpening }) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data: countries } = useCountries();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    phone: "",
    experience: "",
    nysc: "",
    linkedin: "",
    familiarity: "",
    cvName: "",
    videoName: "",
    remote: "",
    salary: "",
    startDate: "",
    confirmed: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const countryOptions = countries?.length
    ? countries.map((country) => country.name)
    : FALLBACK_COUNTRIES;

  const heading = STEP_HEADINGS[step - 1];

  // Nothing is validated: the flow is a click-through demo until the HR
  // endpoint exists, so every step can be reached without filling anything in.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="relative bg-[#E8EFF1] py-10 lg:py-14">
      <BackdropSquares />

      <div className="app-width relative max-w-4xl">
        {step === 1 ? (
          <Link
            href={`/hr-job-listing/${job.id}`}
            className="inline-flex items-center gap-2 font-sora text-base text-[#475569] transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="size-4" />
            Back to positions
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 font-sora text-base text-[#475569] transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="size-4" />
            Back to positions
          </button>
        )}

        <div className="mt-5 flex items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-[#C8F0D4] px-3 py-3 sm:px-4">
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#8BD9A6] text-xl"
            >
              🧑🏽‍💻
            </span>
            <div className="min-w-0">
              <p className="truncate font-clash-display text-lg font-semibold text-[#0E5F6B] sm:text-xl">
                {heading.title}
              </p>
              <p className="truncate font-sora text-sm text-[#5B6B70]">{heading.subtitle}</p>
            </div>
          </div>
          <StepRing step={step} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-2xl bg-white p-6 sm:p-8"
          aria-label={`Apply for ${job.detailTitle}`}
        >
          <h2 className="font-sora text-lg font-semibold text-[#092A31]">
            Personal Information
          </h2>
          <p className="mt-0.5 font-sora text-sm text-[#94A3B8]">
            Fill in your appropriate details below
          </p>

          {step === 1 ? (
            <>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <TextField
                  id="first-name"
                  label="First name"
                  placeholder="Enter your first name"
                  value={form.firstName}
                  onChange={set("firstName")}
                />
                <TextField
                  id="last-name"
                  label="Last name"
                  placeholder="Enter your last name"
                  value={form.lastName}
                  onChange={set("lastName")}
                />
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={set("email")}
                />
                <SelectField
                  id="location"
                  label="Location (Country)"
                  placeholder="Select your location"
                  options={countryOptions}
                  value={form.location}
                  onChange={set("location")}
                />
                <PhoneField
                  id="phone"
                  label="Phone number"
                  value={form.phone}
                  onChange={set("phone")}
                />
                <SelectField
                  id="experience"
                  label="How many years of active experience do you have?"
                  options={EXPERIENCE_OPTIONS}
                  value={form.experience}
                  onChange={set("experience")}
                />
                <SelectField
                  id="nysc"
                  label="What's your NYSC status?"
                  options={NYSC_OPTIONS}
                  value={form.nysc}
                  onChange={set("nysc")}
                />
                <TextField
                  id="linkedin"
                  label="Enter LinkedIn Profile"
                  placeholder="@username/linkedin.com"
                  value={form.linkedin}
                  onChange={set("linkedin")}
                />
              </div>

              <div className="mt-5">
                <TextareaField
                  id="familiarity"
                  label="Discuss your familiarity with tech/EdTech or online education (If none, enter NA)"
                  value={form.familiarity}
                  onChange={set("familiarity")}
                />
              </div>

              <button
                type="submit"
                className="mt-6 h-13 w-full rounded-lg bg-[#156374] font-sora text-base font-semibold text-white transition-colors hover:bg-[#0f4d5a]"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <div className="mt-6 flex flex-col gap-5">
                <UploadField
                  id="cv"
                  label="Upload your CV"
                  cta="Click to upload CV"
                  hint="Jpeg, png (max 5mb)"
                  accept=".pdf,.doc,.docx,image/jpeg,image/png"
                  fileName={form.cvName}
                  onFile={set("cvName")}
                />
                <UploadField
                  id="video"
                  label="Upload a Short Video Explaining Why You Are a Good Fit *"
                  cta="Click to upload video"
                  hint="(max 15mb)"
                  accept="video/*"
                  fileName={form.videoName}
                  onFile={set("videoName")}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <SelectField
                  id="remote"
                  label="Are you available for a fully remote role?"
                  options={YES_NO_OPTIONS}
                  value={form.remote}
                  onChange={set("remote")}
                />
                <TextField
                  id="salary"
                  label="What is your salary expectation range (annually)₦"
                  placeholder="₦ e.g 300000 - 400000"
                  value={form.salary}
                  onChange={set("salary")}
                />
                <SelectField
                  id="start-date"
                  label="If you are successful in this role, how soon are you available to start?"
                  options={START_OPTIONS}
                  value={form.startDate}
                  onChange={set("startDate")}
                />
                <SelectField
                  id="confirm"
                  label="I confirm that all the information I provided is true and accurate"
                  options={CONFIRM_OPTIONS}
                  value={form.confirmed}
                  onChange={set("confirmed")}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-13 w-full rounded-lg bg-[#FFE082] font-sora text-base font-semibold text-[#0E5F6B] transition-opacity hover:opacity-90"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="h-13 w-full rounded-lg bg-[#156374] font-sora text-base font-semibold text-white transition-colors hover:bg-[#0f4d5a]"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      <ApplicationSuccessModal open={isSubmitted} onOpenChange={setIsSubmitted} />
    </div>
  );
};

export default ApplyForm;
