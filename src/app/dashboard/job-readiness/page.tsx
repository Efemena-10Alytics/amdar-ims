"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import JobOpeningSection from "@/components/_core/dashboard/job-readiness/job-opening-section";
import CareerCenter from "@/components/_core/dashboard/internship-program/internship-details/career-center";

const FormativeStageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="12" fill="#1F5D36" />
    <path d="M18.2075 7.04636C18.1202 7.00672 18.0234 6.99302 17.9285 7.00687C17.8337 7.02072 17.7448 7.06155 17.6725 7.12448C15.9225 8.63823 14.44 7.90448 12.7219 7.05386C10.9419 6.17198 8.92375 5.17386 6.6725 7.12448C6.61871 7.17111 6.5755 7.22868 6.54575 7.29335C6.516 7.35802 6.5004 7.4283 6.5 7.49948V17.9995C6.5 18.1321 6.55268 18.2593 6.64645 18.353C6.74021 18.4468 6.86739 18.4995 7 18.4995C7.13261 18.4995 7.25979 18.4468 7.35355 18.353C7.44732 18.2593 7.5 18.1321 7.5 17.9995V15.2351C9.17438 13.9126 10.6169 14.6257 12.2781 15.4482C14.0587 16.3289 16.0763 17.327 18.3275 15.3776C18.3813 15.331 18.4245 15.2734 18.4543 15.2087C18.484 15.1441 18.4996 15.0738 18.5 15.0026V7.49948C18.4997 7.40389 18.4719 7.31041 18.4201 7.2301C18.3682 7.14979 18.2945 7.08602 18.2075 7.04636ZM17.5 8.47448V11.0151C16.625 11.7064 15.8125 11.8414 15 11.6951V8.95823C15.8642 9.09324 16.7485 8.92214 17.5 8.47448ZM14 8.70948V11.397C13.5837 11.2301 13.1606 11.022 12.7219 10.8045C12.1706 10.5314 11.5969 10.2476 11 10.0432V7.35573C11.4163 7.52198 11.8394 7.73073 12.2781 7.94823C12.8294 8.22136 13.4037 8.50511 14 8.70948ZM10 7.05636V9.79261C9.13568 9.65784 8.25144 9.82916 7.5 10.277V7.73573C8.375 7.04448 9.1875 6.91011 10 7.05636ZM9.41125 13.4995C8.73846 13.5007 8.07836 13.6826 7.5 14.0264V11.4857C8.375 10.7945 9.1875 10.6595 10 10.8057V13.5432C9.80506 13.5145 9.6083 13.4999 9.41125 13.4995ZM11 13.7914V11.1039C11.4163 11.2701 11.8394 11.4789 12.2781 11.6964C12.8294 11.9695 13.4031 12.2526 14 12.457V15.1445C13.5837 14.9776 13.1606 14.7695 12.7219 14.552C12.1706 14.2789 11.5963 13.9957 11 13.7914ZM15 15.4445V12.707C15.1949 12.7361 15.3917 12.7511 15.5887 12.752C16.2617 12.7499 16.9218 12.5671 17.5 12.2226V14.7651C16.625 15.4564 15.8125 15.5907 15 15.4445Z" fill="#ACF0C5" />
  </svg>
);

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
        <Bone className="h-8.5 w-28 rounded-lg" />
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
            <>
              <div className="flex h-10 items-center gap-1.5 rounded-[80px] bg-[#C7F5D8] px-3">
                <FormativeStageIcon />
                <span className="font-sora text-sm font-normal text-[#092A31]">Formative stage</span>
              </div>
              <div className="flex h-10 items-center gap-1.5 rounded-[80px] bg-[#C7F5D8] px-3">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#092A31]" />
                <span className="font-sora text-sm font-normal text-[#092A31]">Week 5 of 16</span>
              </div>
            </>
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
