"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import {
  CheckBox,
  EditorToolbar,
  Field,
  RadioCards,
  SelectInput,
  TextInput,
  Toggle,
} from "./fields";
import { JobPreview } from "./job-preview";

export type JobDraft = {
  title: string;
  department: string;
  employmentType: string;
  experience: string;
  openings: string;
  workDays: string;
  workTime: string;
  workplace: string;
  location: string;
  currency: string;
  minSalary: string;
  maxSalary: string;
  showSalary: boolean;
  about: string;
  deadline: string;
  hiringManager: string;
  wantsResume: boolean;
  wantsPortfolio: boolean;
  wantsCoverLetter: boolean;
};

const DEPARTMENTS = [
  "Design & Engineering",
  "Data Team",
  "Product Team",
  "Growth & Sales Team",
  "Cybersecurity Team",
];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const EXPERIENCE_LEVELS = ["Junior level", "Mid level", "Senior level", "Lead"];
const WORK_DAYS = ["Mon - Fri", "Mon - Sat", "Flexible"];
const WORKPLACE_TYPES = ["Remote", "On-site", "Hybrid"];
const CURRENCIES = ["NGN (₦)", "USD ($)", "GBP (£)", "CAD (C$)"];
const DEADLINES = ["30 November, 2026", "31 December, 2026", "31 January, 2027"];
const HIRING_MANAGERS = ["Zainab Akinfenwa", "Deborah Okafor", "Emem Udo"];

const EMPTY_DRAFT: JobDraft = {
  title: "",
  department: "",
  employmentType: "",
  experience: "",
  openings: "",
  workDays: "",
  workTime: "",
  workplace: "",
  location: "",
  currency: "",
  minSalary: "",
  maxSalary: "",
  showSalary: true,
  about: "",
  deadline: "",
  hiringManager: "",
  wantsResume: true,
  wantsPortfolio: true,
  wantsCoverLetter: false,
};

function ReadyRow({ label, done }: { label: string; done: boolean }) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        aria-hidden
        className={`flex size-5 shrink-0 items-center justify-center rounded-full transition-colors ${
          done ? "bg-[#156374] text-white" : "border border-[#CBD5E1] bg-white text-transparent"
        }`}
      >
        <Check className="size-3" strokeWidth={3.5} />
      </span>
      <span className={done ? "text-sm text-[#092A31]" : "text-sm text-[#94A3B8]"}>{label}</span>
    </li>
  );
}

export function CreateJobForm() {
  const [draft, setDraft] = useState<JobDraft>(EMPTY_DRAFT);

  const set =
    <K extends keyof JobDraft>(key: K) =>
    (value: JobDraft[K]) =>
      setDraft((current) => ({ ...current, [key]: value }));

  const detailsDone = Boolean(
    draft.title && draft.department && draft.employmentType && draft.experience && draft.workplace,
  );
  const descriptionDone = draft.about.trim().length > 0;
  const settingsDone = Boolean(draft.deadline && draft.hiringManager);

  return (
    <div className="min-w-0 px-4 pb-28 lg:px-8">
      <div className="pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#475569] transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to overview
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-clash-display text-4xl font-semibold text-[#092A31]">
            Create a job
          </h1>
          <p className="mt-2 text-base text-[#64748B]">
            Make your next great hire. Tell candidates what makes this role right for them.
          </p>
        </div>
        <span className="inline-flex h-8 items-center rounded-lg bg-[#E8EFF1] px-3 text-sm text-[#0C3640]">
          Draft · Not published
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* ------------------------------------------------ Job details */}
          <section className="app-card p-6">
            <h2 className="font-clash-display text-2xl font-semibold text-[#092A31]">
              Job details
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Start with the essentials. Fields marked * are required.
            </p>

            <div className="mt-6 flex flex-col gap-5">
              <Field label="Job title *" htmlFor="title">
                <TextInput
                  id="title"
                  value={draft.title}
                  placeholder="Enter your job title"
                  onChange={set("title")}
                />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Department *" htmlFor="department">
                  <SelectInput
                    id="department"
                    value={draft.department}
                    options={DEPARTMENTS}
                    onChange={set("department")}
                  />
                </Field>
                <Field label="Employment type *" htmlFor="employment-type">
                  <SelectInput
                    id="employment-type"
                    value={draft.employmentType}
                    options={EMPLOYMENT_TYPES}
                    onChange={set("employmentType")}
                  />
                </Field>

                <Field label="Experience level *" htmlFor="experience">
                  <SelectInput
                    id="experience"
                    value={draft.experience}
                    options={EXPERIENCE_LEVELS}
                    onChange={set("experience")}
                  />
                </Field>
                <Field label="Number of openings" htmlFor="openings">
                  <TextInput
                    id="openings"
                    value={draft.openings}
                    placeholder="Enter number"
                    onChange={set("openings")}
                  />
                </Field>

                <Field label="Work Days" htmlFor="work-days">
                  <SelectInput
                    id="work-days"
                    value={draft.workDays}
                    options={WORK_DAYS}
                    onChange={set("workDays")}
                  />
                </Field>
                <Field label="Work Time" htmlFor="work-time">
                  <TextInput
                    id="work-time"
                    value={draft.workTime}
                    placeholder="Enter number"
                    onChange={set("workTime")}
                  />
                </Field>
              </div>

              <div>
                <p className="mb-1.5 text-sm text-[#092A31]">Workplace type *</p>
                <RadioCards
                  name="workplace"
                  options={WORKPLACE_TYPES}
                  value={draft.workplace}
                  onChange={set("workplace")}
                />
              </div>

              <Field
                label="Location"
                htmlFor="location"
                hint="Candidates will see this location on your job post."
              >
                <TextInput
                  id="location"
                  value={draft.location}
                  placeholder="Enter location"
                  onChange={set("location")}
                />
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Field label="Currency" htmlFor="currency">
                  <SelectInput
                    id="currency"
                    value={draft.currency}
                    options={CURRENCIES}
                    onChange={set("currency")}
                  />
                </Field>
                <Field label="Minimum salary" htmlFor="min-salary">
                  <TextInput
                    id="min-salary"
                    value={draft.minSalary}
                    placeholder="Enter amount"
                    onChange={set("minSalary")}
                  />
                </Field>
                <Field label="Maximum salary" htmlFor="max-salary">
                  <TextInput
                    id="max-salary"
                    value={draft.maxSalary}
                    placeholder="Enter amount"
                    onChange={set("maxSalary")}
                  />
                </Field>
              </div>

              <div className="flex items-center justify-between gap-3">
                <CheckBox
                  label="Show salary on job post"
                  checked={draft.showSalary}
                  onChange={set("showSalary")}
                />
                <span className="text-sm text-[#64748B]">Per month</span>
              </div>
            </div>
          </section>

          {/* ------------------------------------------- Job description */}
          <section className="app-card p-6">
            <h2 className="font-clash-display text-2xl font-semibold text-[#092A31]">
              Job description
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Help the right people picture themselves on your team.
            </p>

            <p className="mt-6 mb-1.5 text-sm font-medium text-[#092A31]">About the role *</p>
            <div className="overflow-hidden rounded-xl border border-[#E6EDEF]">
              <EditorToolbar />
              <textarea
                aria-label="About the role"
                value={draft.about}
                onChange={(event) => set("about")(event.target.value)}
                rows={8}
                placeholder="Briefly describe"
                className="w-full resize-y bg-white px-4 py-3 text-sm leading-relaxed text-[#092A31] outline-none placeholder:text-[#94A3B8]"
              />
            </div>
            <p className="mt-3 text-sm text-[#64748B]">
              Include responsibilities, requirements and what makes your team a great place to
              work.
            </p>
          </section>

          {/* --------------------------------------- Application settings */}
          <section className="app-card p-6">
            <h2 className="font-clash-display text-2xl font-semibold text-[#092A31]">
              Application settings
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Set up how candidates apply and who manages this role.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Application deadline *" htmlFor="deadline">
                <SelectInput
                  id="deadline"
                  value={draft.deadline}
                  options={DEADLINES}
                  onChange={set("deadline")}
                />
              </Field>
              <Field label="Hiring manager *" htmlFor="hiring-manager">
                <SelectInput
                  id="hiring-manager"
                  value={draft.hiringManager}
                  options={HIRING_MANAGERS}
                  onChange={set("hiringManager")}
                />
              </Field>
            </div>

            <p className="mt-6 text-sm font-semibold text-[#092A31]">
              What should candidates submit?
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CheckBox
                boxed
                label="Resume / CV · Required"
                checked={draft.wantsResume}
                onChange={set("wantsResume")}
              />
              <CheckBox
                boxed
                label="Portfolio link · Required"
                checked={draft.wantsPortfolio}
                onChange={set("wantsPortfolio")}
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#092A31]">Ask for a cover letter</p>
                <p className="mt-0.5 text-sm text-[#64748B]">
                  Optional for candidates. Keep applying simple.
                </p>
              </div>
              <Toggle
                label="Ask for a cover letter"
                checked={draft.wantsCoverLetter}
                onChange={set("wantsCoverLetter")}
              />
            </div>
          </section>
        </div>

        {/* ------------------------------------------------- Right rail */}
        <div className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-6">
          <JobPreview draft={draft} />

          <section className="app-card p-5">
            <h2 className="font-clash-display text-lg font-semibold text-[#092A31]">
              Ready to publish
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              <ReadyRow label="Job details added" done={detailsDone} />
              <ReadyRow label="Description completed" done={descriptionDone} />
              <ReadyRow label="Application settings configured" done={settingsDone} />
            </ul>
            <hr className="my-4 border-[#EEF2F6]" />
            <p className="text-sm text-[#64748B]">
              Publishing makes this role live on your Amdari careers page.
            </p>
          </section>
        </div>
      </div>

      {/* ---------------------------------------------------- Action bar */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-[#EEF2F6] bg-[#F6F9F9]/95 backdrop-blur lg:left-60">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-8">
          <p className="text-sm text-[#64748B]">Your job stays private until you publish it.</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="h-12 rounded-xl border border-[#D9E5E8] bg-white px-6 text-sm font-semibold text-[#092A31] transition-colors hover:bg-[#F1F5F6]"
            >
              Save as draft
            </button>
            <button
              type="button"
              className="h-12 rounded-xl bg-[#156374] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0f4d5a]"
            >
              Publish job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
