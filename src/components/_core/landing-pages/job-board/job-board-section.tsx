"use client";

import React, { useRef, useState } from "react";
import JobCard from "./job-card";
import JobCardSkeleton from "./job-card-skeleton";
import { useJobs } from "@/features/jobs/use-jobs";
import { useMinDurationLoading } from "@/hooks/use-min-duration-loading";
import { Reveal } from "../shared/reveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ResetFilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.5 5C11.5 4.86739 11.5527 4.74021 11.6464 4.64645C11.7402 4.55268 11.8674 4.5 12 4.5H13.5C13.6326 4.5 13.7598 4.55268 13.8536 4.64645C13.9473 4.74021 14 4.86739 14 5C14 5.13261 13.9473 5.25979 13.8536 5.35355C13.7598 5.44732 13.6326 5.5 13.5 5.5H12C11.8674 5.5 11.7402 5.44732 11.6464 5.35355C11.5527 5.25979 11.5 5.13261 11.5 5ZM2.5 5.5H8.5V6.5C8.5 6.63261 8.55268 6.75979 8.64645 6.85355C8.74021 6.94732 8.86739 7 9 7H10C10.1326 7 10.2598 6.94732 10.3536 6.85355C10.4473 6.75979 10.5 6.63261 10.5 6.5V3.5C10.5 3.36739 10.4473 3.24021 10.3536 3.14645C10.2598 3.05268 10.1326 3 10 3H9C8.86739 3 8.74021 3.05268 8.64645 3.14645C8.55268 3.24021 8.5 3.36739 8.5 3.5V4.5H2.5C2.36739 4.5 2.24021 4.55268 2.14645 4.64645C2.05268 4.74021 2 4.86739 2 5C2 5.13261 2.05268 5.25979 2.14645 5.35355C2.24021 5.44732 2.36739 5.5 2.5 5.5ZM13.5 10.5H8C7.86739 10.5 7.74021 10.5527 7.64645 10.6464C7.55268 10.7402 7.5 10.8674 7.5 11C7.5 11.1326 7.55268 11.2598 7.64645 11.3536C7.74021 11.4473 7.86739 11.5 8 11.5H13.5C13.6326 11.5 13.7598 11.4473 13.8536 11.3536C13.9473 11.2598 14 11.1326 14 11C14 10.8674 13.9473 10.7402 13.8536 10.6464C13.7598 10.5527 13.6326 10.5 13.5 10.5ZM6 9H5C4.86739 9 4.74021 9.05268 4.64645 9.14645C4.55268 9.24021 4.5 9.36739 4.5 9.5V10.5H2.5C2.36739 10.5 2.24021 10.5527 2.14645 10.6464C2.05268 10.7402 2 10.8674 2 11C2 11.1326 2.05268 11.2598 2.14645 11.3536C2.24021 11.4473 2.36739 11.5 2.5 11.5H4.5V12.5C4.5 12.6326 4.55268 12.7598 4.64645 12.8536C4.74021 12.9473 4.86739 13 5 13H6C6.13261 13 6.25979 12.9473 6.35355 12.8536C6.44732 12.7598 6.5 12.6326 6.5 12.5V9.5C6.5 9.36739 6.44732 9.24021 6.35355 9.14645C6.25979 9.05268 6.13261 9 6 9Z"
      fill="#156374"
    />
  </svg>
);

const FILTER_DEFAULT = "";
const PAGE_SIZE = 9;
const MIN_LOADING_MS = 3000;

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

const JobBoardSection = () => {
  const [location, setLocation] = useState(FILTER_DEFAULT);
  const [jobTitle, setJobTitle] = useState(FILTER_DEFAULT);
  const [sponsorship, setSponsorship] = useState(FILTER_DEFAULT);
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  const sponsorshipOptions = ["Yes", "No"];

  const { data, isLoading, isError } = useJobs({
    location: location || undefined,
    q: jobTitle || undefined,
    sponsorship: sponsorship || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const showSkeleton = useMinDurationLoading(isLoading, MIN_LOADING_MS);

  const jobs = data?.jobs ?? [];
  const totalPages = data?.totalPages ?? 1;

  const resetFilters = () => {
    setLocation(FILTER_DEFAULT);
    setJobTitle(FILTER_DEFAULT);
    setSponsorship(FILTER_DEFAULT);
    setPage(1);
  };

  const updateFilter = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const goToPage = (next: number) => {
    setPage(next);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={sectionRef} className="bg-white">
      <div className="mx-auto app-width">
        {/* Heading row */}
        <Reveal className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
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
        </Reveal>

        {/* CVMatchly banner */}
        <Reveal delay={100} className="mt-8 flex h-auto min-h-[80px] flex-col items-start justify-between gap-4 rounded-lg border border-[#FFDFB6] bg-[#FFF5E9] p-4 sm:flex-row sm:items-center">
          <p className="font-sora text-base font-normal text-[#003463]">
            Powered by <span className="text-lg font-bold">CVMatchly AI</span>
          </p>
          <button
            type="button"
            className="h-12 shrink-0 rounded-xl bg-[#003463] px-5 py-3 font-sora text-sm text-white transition-opacity hover:opacity-90"
          >
            Learn More
          </button>
        </Reveal>

        {/* Filters row */}
        <Reveal delay={150} className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h3 className="font-sora text-xl font-semibold leading-none text-[#092A31]">All Jobs</h3>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={location}
              onChange={(e) => updateFilter(setLocation)(e.target.value)}
              placeholder="Location"
              className="h-[34px] rounded-lg bg-[#E8EFF1] px-3 font-sora text-sm text-[#0C3640] outline-none placeholder:text-[#0C3640]"
            />
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => updateFilter(setJobTitle)(e.target.value)}
              placeholder="Job Title"
              className="h-[34px] rounded-lg bg-[#E8EFF1] px-3 font-sora text-sm text-[#0C3640] outline-none placeholder:text-[#0C3640]"
            />
            <Select value={sponsorship || undefined} onValueChange={updateFilter(setSponsorship)}>
              <SelectTrigger className="h-[34px] w-auto min-w-[160px] rounded-lg bg-[#E8EFF1] px-3 py-0 font-sora text-sm text-[#0C3640]">
                <SelectValue placeholder="Visa Sponsorship" />
              </SelectTrigger>
              <SelectContent>
                {sponsorshipOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="flex h-[34px] items-center gap-1 rounded-lg bg-[#B6CFD4] px-2 font-sora text-sm text-[#0C3640] transition-opacity hover:opacity-90"
          >
            <ResetFilterIcon />
            Reset filter
          </button>
        </Reveal>

        {/* Loading skeleton */}
        {showSkeleton && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!showSkeleton && isError && (
          <p className="mt-8 font-sora text-sm text-red-500">
            Unable to load jobs right now. Please try again later.
          </p>
        )}

        {/* Job grid */}
        {!showSkeleton && !isError && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job, index) => (
                <Reveal key={job.id} delay={(index % PAGE_SIZE) * 60}>
                  <JobCard job={job} />
                </Reveal>
              ))}
            </div>

            {jobs.length === 0 && (
              <p className="mt-8 font-sora text-sm text-[#64748B]">
                No jobs match your filters right now. Try resetting or choosing a different combination.
              </p>
            )}

            {jobs.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  className="rounded-lg bg-[#E8EFF1] px-4 py-2 font-sora text-sm text-[#0C3640] disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="font-sora text-sm text-[#64748B]">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(Math.min(totalPages, page + 1))}
                  className="rounded-lg bg-[#E8EFF1] px-4 py-2 font-sora text-sm text-[#0C3640] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default JobBoardSection;