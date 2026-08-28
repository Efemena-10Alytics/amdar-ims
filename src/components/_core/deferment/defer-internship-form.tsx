"use client";

import { useRequireUserId } from "@/hooks/use-require-user-id";
import { ProgramPill } from "@/components/_core/shared/program-pill";
import { DeferInternshipFormContent } from "@/components/_core/deferment/defer-internship-form-content";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";

export function DeferInternshipForm() {
  const { isAuthReady } = useRequireUserId();
  const { data: enrollment } = useGetUserEnrollment();
  const currentProgramTitle = enrollment?.program?.title?.trim() ?? "";

  if (!isAuthReady) return null;

  return (
    <div className="py-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[#173740] sm:text-[1.75rem]">
          Defer internship
        </h1>
        {currentProgramTitle ? (
          <ProgramPill title={currentProgramTitle} />
        ) : null}
      </div>

      <div className="mt-8 w-full max-w-3xl rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
        <DeferInternshipFormContent />
      </div>
    </div>
  );
}
