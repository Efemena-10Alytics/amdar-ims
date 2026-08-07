"use client";

import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetInternshipDetails,
  type InternshipDetails,
} from "@/features/interns-project/use-get-internship-details";

function formatProgramCohort(details: InternshipDetails): string {
  const programTitle = details.program?.title?.trim() ?? "";
  const cohortName = details.cohort?.name?.trim() ?? "";

  if (programTitle && cohortName) return `${programTitle} · ${cohortName}`;
  return programTitle || cohortName;
}

type InternshipInfoFieldProps = {
  label: string;
  value?: string | null;
  placeholder?: string;
};

function InternshipInfoField({
  label,
  value,
  placeholder = "—",
}: InternshipInfoFieldProps) {
  const displayValue = value?.trim() || placeholder;
  const isPlaceholder = !value?.trim();

  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-medium text-[#64748B]">{label}</p>
      <div
        className={cn(
          "flex min-h-10 items-center rounded-lg bg-white px-3 py-2.5 text-sm",
          isPlaceholder ? "text-[#94A3B8]" : "text-[#092A31]",
        )}
      >
        {displayValue}
      </div>
    </div>
  );
}

function InternshipInfoFieldSkeleton({ label }: { label: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-medium text-[#64748B]">{label}</p>
      <div className="h-10 animate-pulse rounded-lg bg-white/80" />
    </div>
  );
}

const FIELD_LABELS = [
  "Your Program/Cohort",
  "Your skill level",
  "Internship location",
  "Your gender",
  "How did you hear about Amdari?",
  "Reason for decision",
  "Session of decision",
  "How much time can you commit weekly?",
] as const;

const InternshipInfo = () => {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    isAuthReady,
  } = useGetInternshipDetails();

  const isLoading = !isAuthReady || isPending;

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
      <div className="rounded-2xl bg-[#E8EFF1] p-4 sm:p-5">
        <h2 className="text-base font-semibold text-[#092A31] sm:text-lg">
          Internship details
        </h2>

        {isLoading ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4">
            {FIELD_LABELS.map((label) => (
              <InternshipInfoFieldSkeleton key={label} label={label} />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-4 flex flex-col items-start gap-3 rounded-lg bg-white px-4 py-5">
            <p className="text-sm text-[#64748B]">
              {(error as Error)?.message?.trim() ||
                "Failed to load internship details."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isFetching ? (
                <Loader className="size-4 animate-spin" aria-hidden />
              ) : null}
              Try again
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-4">
            <InternshipInfoField
              label="Your Program/Cohort"
              value={data ? formatProgramCohort(data) : undefined}
            />
            <InternshipInfoField
              label="Your skill level"
              value={data?.skillLevel}
            />
            <InternshipInfoField
              label="Internship location"
              value={data?.location}
            />
            <InternshipInfoField label="Your gender" value={data?.gender} />
            <InternshipInfoField
              label="How did you hear about Amdari?"
              value={data?.findOut}
            />
            <InternshipInfoField
              label="Reason for decision"
              value={data?.decisionInfluenced}
              placeholder="Select for decision"
            />
            <InternshipInfoField
              label="Session of decision"
              value={data?.sessionInfluenced}
            />
            <InternshipInfoField
              label="How much time can you commit weekly?"
              value={data?.hoursPerWeek}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default InternshipInfo;
