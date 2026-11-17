import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";
import {
  ApplicationOverview,
  HiringPipeline,
  OpenRolesTable,
  RecentApplicants,
  StatCards,
  UpcomingInterviews,
} from "@/components/dashboard/panels";

export default function DashboardPage() {
  return (
    <div className="min-w-0 px-4 py-8 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-clash-display text-4xl font-semibold text-[#092A31]">
            A great team starts here.
          </h1>
          <p className="mt-2 text-base text-[#64748B]">
            Good morning, Deborah. Here&apos;s your hiring overview for October.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#E6EDEF] bg-white px-4 text-sm text-[#092A31]"
          >
            1–31 Oct, 2026
            <ChevronDown className="size-4 text-[#64748B]" aria-hidden />
          </button>
          <Link
            href="/jobs/create"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#156374] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0f4d5a]"
          >
            <Plus className="size-4" aria-hidden />
            Create a job
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <StatCards />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ApplicationOverview />
        <HiringPipeline />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <OpenRolesTable />
          <RecentApplicants />
        </div>
        <UpcomingInterviews />
      </div>
    </div>
  );
}
