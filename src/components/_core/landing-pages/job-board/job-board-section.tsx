"use client";

import React, { useMemo, useState } from "react";
import JobCard, { Job } from "./job-card";

const ChevronDownIcon = () => (
  <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.8541 0.85375L5.85414 5.85375C5.80771 5.90024 5.75256 5.93712 5.69186 5.96228C5.63117 5.98744 5.5661 6.00039 5.50039 6.00039C5.43469 6.00039 5.36962 5.98744 5.30892 5.96228C5.24823 5.93712 5.19308 5.90024 5.14664 5.85375L0.146644 0.85375C0.0766381 0.783823 0.0289543 0.694696 0.00962914 0.597654C-0.00969606 0.500611 0.000206247 0.400016 0.0380825 0.308605C0.0759587 0.217193 0.140106 0.139075 0.222403 0.08414C0.3047 0.0292046 0.401446 -7.77138e-05 0.500394 1.549e-07H10.5004C10.5993 -7.77138e-05 10.6961 0.0292046 10.7784 0.08414C10.8607 0.139075 10.9248 0.217193 10.9627 0.308605C11.0006 0.400016 11.0105 0.500611 10.9912 0.597654C10.9718 0.694696 10.9242 0.783823 10.8541 0.85375Z"
      fill="#092A31"
    />
  </svg>
);

const ResetFilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.5 5C11.5 4.86739 11.5527 4.74021 11.6464 4.64645C11.7402 4.55268 11.8674 4.5 12 4.5H13.5C13.6326 4.5 13.7598 4.55268 13.8536 4.64645C13.9473 4.74021 14 4.86739 14 5C14 5.13261 13.9473 5.25979 13.8536 5.35355C13.7598 5.44732 13.6326 5.5 13.5 5.5H12C11.8674 5.5 11.7402 5.44732 11.6464 5.35355C11.5527 5.25979 11.5 5.13261 11.5 5ZM2.5 5.5H8.5V6.5C8.5 6.63261 8.55268 6.75979 8.64645 6.85355C8.74021 6.94732 8.86739 7 9 7H10C10.1326 7 10.2598 6.94732 10.3536 6.85355C10.4473 6.75979 10.5 6.63261 10.5 6.5V3.5C10.5 3.36739 10.4473 3.24021 10.3536 3.14645C10.2598 3.05268 10.1326 3 10 3H9C8.86739 3 8.74021 3.05268 8.64645 3.14645C8.55268 3.24021 8.5 3.36739 8.5 3.5V4.5H2.5C2.36739 4.5 2.24021 4.55268 2.14645 4.64645C2.05268 4.74021 2 4.86739 2 5C2 5.13261 2.05268 5.25979 2.14645 5.35355C2.24021 5.44732 2.36739 5.5 2.5 5.5ZM13.5 10.5H8C7.86739 10.5 7.74021 10.5527 7.64645 10.6464C7.55268 10.7402 7.5 10.8674 7.5 11C7.5 11.1326 7.55268 11.2598 7.64645 11.3536C7.74021 11.4473 7.86739 11.5 8 11.5H13.5C13.6326 11.5 13.7598 11.4473 13.8536 11.3536C13.9473 11.2598 14 11.1326 14 11C14 10.8674 13.9473 10.7402 13.8536 10.6464C13.7598 10.5527 13.6326 10.5 13.5 10.5ZM6 9H5C4.86739 9 4.74021 9.05268 4.64645 9.14645C4.55268 9.24021 4.5 9.36739 4.5 9.5V10.5H2.5C2.36739 10.5 2.24021 10.5527 2.14645 10.6464C2.05268 10.7402 2 10.8674 2 11C2 11.1326 2.05268 11.2598 2.14645 11.3536C2.24021 11.4473 2.36739 11.5 2.5 11.5H4.5V12.5C4.5 12.6326 4.55268 12.7598 4.64645 12.8536C4.74021 12.9473 4.86739 13 5 13H6C6.13261 13 6.25979 12.9473 6.35355 12.8536C6.44732 12.7598 6.5 12.6326 6.5 12.5V9.5C6.5 9.36739 6.44732 9.24021 6.35355 9.14645C6.25979 9.05268 6.13261 9 6 9Z"
      fill="#156374"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

interface FilterableJob extends Job {
  visaSponsorship: "Yes" | "No";
}

const JOBS: FilterableJob[] = [
  { id: "1", company: "DELIOTTE", flag: "🇮🇪", location: "England, United Kingdom", title: "Engineering Manager", type: "Remote · Full-time · $150k - $250k", openFrom: "May 25, 2026", openTo: "June 25,2026", visaSponsorship: "Yes" },
  { id: "2", company: "CANON", flag: "🇧🇪", location: "England, United Kingdom", title: "Digital marketing", type: "Remote · Full-time · $150k - $250k", openFrom: "May 25, 2026", openTo: "June 25,2026", visaSponsorship: "No" },
  { id: "3", company: "SALESFORCE", flag: "🇸🇪", location: "England, United Kingdom", title: "Product manager", type: "Remote · Full-time · $150k - $250k", openFrom: "May 25, 2026", openTo: "June 25,2026", visaSponsorship: "Yes" },
  { id: "4", company: "Lendio", flag: "🇩🇪", location: "England, United Kingdom", title: "Engineer", type: "Remote · Full-time · $150k - $250k", openFrom: "May 25, 2026", openTo: "June 25,2026", visaSponsorship: "Yes" },
  { id: "5", company: "Lexiqvolax", flag: "🇪🇸", location: "England, United Kingdom", title: "Account manager", type: "Remote · Full-time · $150k - $250k", openFrom: "May 25, 2026", openTo: "June 25,2026", visaSponsorship: "No" },
  { id: "6", company: "APPLE", flag: "🇬🇧", location: "England, United Kingdom", title: "Account Executive", type: "Remote · Full-time · $150k - $250k", openFrom: "May 25, 2026", openTo: "June 25,2026", visaSponsorship: "Yes" },
  { id: "7", company: "DELL", flag: "🇵🇹", location: "England, United Kingdom", title: "Artist", type: "Remote · Full-time · $150k - $250k", openFrom: "May 25, 2026", openTo: "June 25,2026", visaSponsorship: "No" },
  { id: "8", company: "Entrata", flag: "🇺🇦", location: "England, United Kingdom", title: "Product owner", type: "Remote · Full-time · $150k - $250k", openFrom: "May 25, 2026", openTo: "June 25,2026", visaSponsorship: "Yes" },
  { id: "9", company: "ENT.", flag: "🇮🇹", location: "England, United Kingdom", title: "Software engineer", type: "Remote · Full-time · $150k - $250k", openFrom: "May 25, 2026", openTo: "June 25,2026", visaSponsorship: "Yes" },
];

const FILTER_DEFAULT = "";

/* ------------------------------------------------------------------ */
/* Dropdown                                                             */
/* ------------------------------------------------------------------ */

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-[34px] appearance-none rounded-lg bg-[#E8EFF1] py-2 pl-3 pr-8 font-sora text-sm text-[#0C3640] outline-none"
    >
      <option value={FILTER_DEFAULT}>{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
      <ChevronDownIcon />
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

const JobBoardSection = () => {
  const [location, setLocation] = useState(FILTER_DEFAULT);
  const [jobTitle, setJobTitle] = useState(FILTER_DEFAULT);
  const [visa, setVisa] = useState(FILTER_DEFAULT);

  const locationOptions = useMemo(() => Array.from(new Set(JOBS.map((j) => j.location))), []);
  const jobTitleOptions = useMemo(() => Array.from(new Set(JOBS.map((j) => j.title))), []);
  const visaOptions = ["Yes", "No"];

  const filteredJobs = useMemo(() => {
    return JOBS.filter((job) => {
      if (location && job.location !== location) return false;
      if (jobTitle && job.title !== jobTitle) return false;
      if (visa && job.visaSponsorship !== visa) return false;
      return true;
    });
  }, [location, jobTitle, visa]);

  const resetFilters = () => {
    setLocation(FILTER_DEFAULT);
    setJobTitle(FILTER_DEFAULT);
    setVisa(FILTER_DEFAULT);
  };

  return (
    <section className="bg-white">
      <div className="mx-auto app-width">
        {/* Heading row */}
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-clash-display text-[32px] font-semibold text-[#092A31] lg:text-[48px]">
              Featured Job
            </h2>
            <p className="mt-2 font-sora text-base font-normal text-[#5C6777]">
              Search here for current jobs update
            </p>
          </div>
          <p className="font-sora text-base font-normal text-[#0C3640]">
            Powered by <span className="text-lg font-bold">CVMatchly AI</span>
          </p>
        </div>

        {/* CVMatchly banner */}
        <div className="mt-8 flex h-auto min-h-[80px] flex-col items-start justify-between gap-4 rounded-lg border border-[#FFDFB6] bg-[#FFF5E9] p-4 sm:flex-row sm:items-center">
          <p className="font-sora text-base font-normal text-[#003463]">
            Powered by <span className="text-lg font-bold">CVMatchly AI</span>
          </p>
          <button
            type="button"
            className="h-12 shrink-0 rounded-xl bg-[#003463] px-5 py-3 font-sora text-sm text-white transition-opacity hover:opacity-90"
          >
            Learn More
          </button>
        </div>

        {/* Filters row */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h3 className="font-sora text-xl font-semibold leading-none text-[#092A31]">All Jobs</h3>

          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown label="Location" value={location} options={locationOptions} onChange={setLocation} />
            <FilterDropdown label="Job Title" value={jobTitle} options={jobTitleOptions} onChange={setJobTitle} />
            <FilterDropdown label="Visa Sponsorship" value={visa} options={visaOptions} onChange={setVisa} />
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="flex h-[34px] items-center gap-1 rounded-lg bg-[#B6CFD4] px-2 font-sora text-sm text-[#0C3640] transition-opacity hover:opacity-90"
          >
            <ResetFilterIcon />
            Reset filter
          </button>
        </div>

        {/* Job grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <p className="mt-8 font-sora text-sm text-[#64748B]">
            No jobs match your filters right now. Try resetting or choosing a different combination.
          </p>
        )}
      </div>
    </section>
  );
};

export default JobBoardSection;