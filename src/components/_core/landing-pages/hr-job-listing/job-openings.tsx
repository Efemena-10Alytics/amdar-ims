"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { ALL_DEPARTMENTS, DEPARTMENTS, JOB_OPENINGS, type JobOpening } from "./data";
import { JobCompanyMark } from "./svg";

const ResetFilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M11.5 5C11.5 4.86739 11.5527 4.74021 11.6464 4.64645C11.7402 4.55268 11.8674 4.5 12 4.5H13.5C13.6326 4.5 13.7598 4.55268 13.8536 4.64645C13.9473 4.74021 14 4.86739 14 5C14 5.13261 13.9473 5.25979 13.8536 5.35355C13.7598 5.44732 13.6326 5.5 13.5 5.5H12C11.8674 5.5 11.7402 5.44732 11.6464 5.35355C11.5527 5.25979 11.5 5.13261 11.5 5ZM2.5 5.5H8.5V6.5C8.5 6.63261 8.55268 6.75979 8.64645 6.85355C8.74021 6.94732 8.86739 7 9 7H10C10.1326 7 10.2598 6.94732 10.3536 6.85355C10.4473 6.75979 10.5 6.63261 10.5 6.5V3.5C10.5 3.36739 10.4473 3.24021 10.3536 3.14645C10.2598 3.05268 10.1326 3 10 3H9C8.86739 3 8.74021 3.05268 8.64645 3.14645C8.55268 3.24021 8.5 3.36739 8.5 3.5V4.5H2.5C2.36739 4.5 2.24021 4.55268 2.14645 4.64645C2.05268 4.74021 2 4.86739 2 5C2 5.13261 2.05268 5.25979 2.14645 5.35355C2.24021 5.44732 2.36739 5.5 2.5 5.5ZM13.5 10.5H8C7.86739 10.5 7.74021 10.5527 7.64645 10.6464C7.55268 10.7402 7.5 10.8674 7.5 11C7.5 11.1326 7.55268 11.2598 7.64645 11.3536C7.74021 11.4473 7.86739 11.5 8 11.5H13.5C13.6326 11.5 13.7598 11.4473 13.8536 11.3536C13.9473 11.2598 14 11.1326 14 11C14 10.8674 13.9473 10.7402 13.8536 10.6464C13.7598 10.5527 13.6326 10.5 13.5 10.5ZM6 9H5C4.86739 9 4.74021 9.05268 4.64645 9.14645C4.55268 9.24021 4.5 9.36739 4.5 9.5V10.5H2.5C2.36739 10.5 2.24021 10.5527 2.14645 10.6464C2.05268 10.7402 2 10.8674 2 11C2 11.1326 2.05268 11.2598 2.14645 11.3536C2.24021 11.4473 2.36739 11.5 2.5 11.5H4.5V12.5C4.5 12.6326 4.55268 12.7598 4.64645 12.8536C4.74021 12.9473 4.86739 13 5 13H6C6.13261 13 6.25979 12.9473 6.35355 12.8536C6.44732 12.7598 6.5 12.6326 6.5 12.5V9.5C6.5 9.36739 6.44732 9.24021 6.35355 9.14645C6.25979 9.05268 6.13261 9 6 9Z"
      fill="#0C3640"
    />
  </svg>
);

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="shrink-0 font-sora text-sm text-[#94A3B8]">{label}</span>
      <span className="truncate font-sora text-sm font-semibold text-[#092A31]">{value}</span>
    </div>
  );
}

function FooterCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="font-sora text-xs text-[#94A3B8]">{label}</p>
      <p className="mt-1 truncate font-sora text-sm font-semibold text-[#156374]">{value}</p>
    </div>
  );
}

function JobCard({ job }: { job: JobOpening }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-[#FCFDFD] ring-1 ring-[#EEF2F6]">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-4">
          <JobCompanyMark />
          <div className="min-w-0">
            <p className="font-sora text-sm text-[#64748B]">{job.department}</p>
            <h3
              className="truncate font-sora text-xl font-semibold text-[#092A31]"
              title={job.title}
            >
              {job.title}
            </h3>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <MetaRow label="Vacancies  :" value={String(job.vacancies)} />
          <MetaRow label="Work Hours" value={job.workHours} />
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-[#E2E8F0] border-t border-[#E2E8F0] pt-4">
          <div className="pr-3">
            <FooterCell label="Job Type" value={job.jobType} />
          </div>
          <div className="px-3">
            <FooterCell label="Experience" value={job.experience} />
          </div>
          <div className="pl-3">
            <FooterCell label="Deadline:" value={job.deadline} />
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          type="button"
          className="h-13 w-full rounded-xl bg-[#156374] font-sora text-base font-semibold text-white transition-colors hover:bg-[#0f4d5a]"
        >
          Apply Now
        </button>
      </div>
    </article>
  );
}

const JobOpenings = () => {
  const [department, setDepartment] = useState<string>(ALL_DEPARTMENTS);
  const [search, setSearch] = useState("");

  const jobs = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return JOB_OPENINGS.filter((job) => {
      const matchesDepartment =
        department === ALL_DEPARTMENTS || job.department === department;
      const matchesSearch = !needle || job.title.toLowerCase().includes(needle);
      return matchesDepartment && matchesSearch;
    });
  }, [department, search]);

  const resetFilters = () => {
    setDepartment(ALL_DEPARTMENTS);
    setSearch("");
  };

  return (
    <section id="job-openings" className="scroll-mt-24 bg-white py-14 lg:py-20">
      <div className="app-width">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-clash-display text-3xl font-semibold text-[#092A31] sm:text-4xl lg:text-[40px]">
            Available Job Openings
          </h2>

          <div className="relative w-full lg:w-96">
            <Search
              className="pointer-events-none absolute top-1/2 left-6 size-5 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Job Title"
              aria-label="Search job titles"
              className="h-16 w-full rounded-[20px] border border-[#DDE2FD] bg-[#E8EFF1] pr-6 pl-14 font-sora text-base text-[#0C3640] outline-none placeholder:text-[#94A3B8] focus:border-[#156374]"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="font-sora text-base font-medium text-[#092A31]">
            Hiring Departments
          </span>
          <span className="hidden h-6 w-px bg-[#CBD5E1] sm:block" aria-hidden />

          {DEPARTMENTS.map((item) => {
            const isActive = item === department;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setDepartment(item)}
                aria-pressed={isActive}
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-3.5 font-sora text-sm transition-colors ${
                  isActive
                    ? "bg-[#156374] text-white"
                    : "bg-[#E8EFF1] text-[#0C3640] hover:bg-[#dbe6e9]"
                }`}
              >
                {item}
                {isActive && (
                  <span className="flex size-4 items-center justify-center rounded-[4px] bg-[#FFE082] text-[#156374]">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#B6CFD4] px-3 font-sora text-sm text-[#0C3640] transition-opacity hover:opacity-90"
          >
            <ResetFilterIcon />
            Reset filter
          </button>
        </div>

        {jobs.length === 0 ? (
          <p className="mt-10 font-sora text-base text-[#64748B]">
            No roles are open in this department right now. Try another department or reset the
            filters.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobOpenings;
