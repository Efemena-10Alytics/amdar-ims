"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import JobOpeningSection from "@/components/_core/dashboard/job-readiness/job-opening-section";
import CareerCenter from "@/components/_core/dashboard/internship-program/internship-details/career-center";
import PageHeader from "@/components/_core/dashboard/dashboard/header";



/* ── Skeleton primitives ─────────────────────────────────────── */
const Bone = ({ className }: { className: string }) => (
  <div className={cn("animate-pulse rounded-md bg-[#E2E8F0]", className)} />
);

/* Mirrors: OfficeHour / EmployabilityExperts / InterviewPrepRequestCard */
const CareerCardSkeleton = ({ hasLink = false }: { hasLink?: boolean }) => (
  <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
    {/* Title row */}
    <div className="flex items-start justify-between gap-3">
      <Bone className="h-6 w-44" />
      <Bone className="size-9 shrink-0 rounded-lg" />
    </div>
    {/* Inner description box */}
    <div className="mt-4 rounded-xl bg-[#E8F4F8] p-4">
      <Bone className="h-4 w-full" />
      <Bone className="mt-1.5 h-4 w-3/4" />
      <div className="mt-3 flex items-center gap-3">
        <Bone className="size-9 shrink-0 rounded-md" />
        <div className="flex gap-2">
          <Bone className="h-7 w-20 rounded-full" />
          <Bone className="h-7 w-28 rounded-full" />
        </div>
      </div>
    </div>
    {/* Flags row */}
    <div className="mt-4 flex items-center justify-between">
      <div className="flex">
        <Bone className="size-8 rounded-full" />
        <Bone className="-ml-2 size-8 rounded-full" />
      </div>
      {hasLink && <Bone className="h-4 w-28 rounded" />}
    </div>
    {/* Button */}
    <Bone className="mt-5 h-11 w-full rounded-full" />
  </div>
);

/* Mirrors: ReferenceLetter (purple inner box, filled button) */
const ReferenceCardSkeleton = () => (
  <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <Bone className="h-6 w-48" />
      <Bone className="size-9 shrink-0 rounded-lg" />
    </div>
    <div className="mt-4 rounded-xl bg-[#F3F0FF] p-4">
      <Bone className="h-4 w-full" />
      <Bone className="mt-1.5 h-4 w-2/3" />
      <div className="mt-3 flex items-center gap-3">
        <Bone className="size-9 shrink-0 rounded-md" />
        <div className="flex gap-2">
          <Bone className="h-7 w-20 rounded-full" />
          <Bone className="h-7 w-28 rounded-full" />
        </div>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <div className="flex">
        <Bone className="size-8 rounded-full" />
        <Bone className="-ml-2 size-8 rounded-full" />
        <Bone className="-ml-2 size-8 rounded-full" />
      </div>
      <Bone className="h-4 w-36 rounded" />
    </div>
    <Bone className="mt-5 h-11 w-full rounded-full" />
  </div>
);

/* Mirrors: CvMatchlyAiCard (warm bg, dark button) */
const CvMatchlyCardSkeleton = () => (
  <div className="rounded-2xl border border-[#F0E6DC] bg-[#FFFBF7] p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Bone className="size-9 shrink-0 rounded-full" />
        <Bone className="h-6 w-36" />
      </div>
      <Bone className="size-9 shrink-0 rounded-full" />
    </div>
    <div className="mt-4 rounded-xl bg-[#FFE8D6] p-4">
      <Bone className="h-4 w-3/4" />
      <Bone className="mt-2 h-4 w-full" />
      <Bone className="mt-1.5 h-4 w-2/3" />
    </div>
    <div className="mt-4 flex">
      <Bone className="size-8 rounded-full" />
      <Bone className="-ml-2 size-8 rounded-full" />
    </div>
    <Bone className="mt-5 h-11 w-full rounded-full" />
  </div>
);

/* Mirrors: JobCard */
const JobCardSkeleton = () => (
  <div className="flex min-h-[260px] flex-col justify-between rounded-xl bg-[#F8FAFC] p-6">
    <div>
      <div className="flex items-center gap-2">
        <Bone className="size-14 shrink-0 rounded-full" />
        <div className="flex-1">
          <Bone className="mt-2 h-3.5 w-24" />
          <div className="mt-2 flex items-center gap-1.5">
            <Bone className="size-4 rounded-full" />
            <Bone className="h-3 w-20" />
          </div>
        </div>
      </div>
      <Bone className="mt-4 h-5 w-3/4" />
      <Bone className="mt-2 h-3.5 w-1/2" />
    </div>
    <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4">
      <Bone className="h-3 w-28" />
      <Bone className="h-10.5 w-20 rounded-xl" />
    </div>
  </div>
);

const TabSkeleton = ({ tab }: { tab: "job-prep" | "job-opening" }) => {
  if (tab === "job-prep") {
    return (
      <div className="flex flex-col gap-6">
        <Bone className="h-7 w-24" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CareerCardSkeleton />
          <CareerCardSkeleton hasLink />
          <CareerCardSkeleton />
          <ReferenceCardSkeleton />
          <CvMatchlyCardSkeleton />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {/* Filter row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Bone className="h-7 w-32" />
          <Bone className="h-8.5 w-28 rounded-lg" />
          <Bone className="h-8.5 w-28 rounded-lg" />
          <Bone className="h-8.5 w-36 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Bone className="h-8.5 w-full rounded-lg sm:w-96" />
          <Bone className="h-8.5 w-28 shrink-0 rounded-lg" />
        </div>
      </div>
      {/* Job grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

type Tab = "job-prep" | "job-opening";

const tabs: { id: Tab; label: string }[] = [
  { id: "job-prep", label: "Job Prep" },
  { id: "job-opening", label: "Job Opening" },
];

const TAB_SKELETON_MS = 3000;

export default function JobReadinessPage() {
  const [activeTab, setActiveTab] = useState<Tab>("job-prep");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), TAB_SKELETON_MS);
    return () => clearTimeout(t);
  }, [activeTab]);

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
      {/* Header row: tab switcher + right badges */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tab pill */}
        <div className="flex w-120.5 max-w-full items-center gap-2.5 rounded-[80px] bg-[#E8EFF1] p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "whitespace-nowrap rounded-[40px] px-4 py-3 font-sora text-base font-medium leading-[140%] transition-colors",
                activeTab === tab.id
                  ? "bg-[#B6CFD4] text-[#135A6A]"
                  : "text-[#64748B]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right badges */}
        <div className="flex items-center gap-3">
          {activeTab === "job-prep" && (
            <PageHeader />
          )}
          {activeTab === "job-opening" && (
            <div className="flex h-10 items-center rounded-[80px] bg-[#EDE5F7] px-4">
              <span className="font-sora text-sm text-[#092A31]">Consultant</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab content */}
      {loading ? (
        <TabSkeleton tab={activeTab} />
      ) : activeTab === "job-opening" ? (
        <JobOpeningSection />
      ) : (
        <div className="flex flex-col gap-6">
          <h2 className="font-sora text-xl font-semibold text-[#092A31]">Job Prep</h2>
          <CareerCenter />
        </div>
      )}
    </div>
  );
}
