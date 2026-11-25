"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetInternshipPrograms } from "@/features/internship/use-get-all-internship-programs";
import { DEFAULT_PROMO_CODE } from "@/features/payment/default-promo";
import type { InternshipProgram } from "@/types/internship-program";
import { cn } from "@/lib/utils";

type ProjectAccessModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  careerTrack?: string | null;
};

function normalizeMatchText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s*&\s*/g, " and ")
    .replace(/\s*\/\s*/g, " and ")
    .replace(/\banalytics\b/g, "analysis")
    .replace(/\banalyst\b/g, "analysis")
    .replace(/\bmgt\.?/gi, "management")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findProgramForCareerTrack(
  programs: InternshipProgram[],
  careerTrack: string,
): InternshipProgram | undefined {
  const normalizedTrack = normalizeMatchText(careerTrack);
  const slugHint = normalizedTrack.replace(/\s+/g, "-");
  const trackTokens = normalizedTrack
    .split(" ")
    .filter((word) => word.length > 1);

  const bySlug = programs.find((program) => {
    const normalizedSlug = normalizeMatchText(program.slug.replace(/-/g, " "));
    return (
      program.slug === slugHint ||
      program.slug.includes(slugHint) ||
      slugHint.includes(program.slug) ||
      normalizedSlug === normalizedTrack ||
      normalizedSlug.includes(normalizedTrack) ||
      normalizedTrack.includes(normalizedSlug) ||
      (trackTokens.length > 0 &&
        trackTokens.every((token) => normalizedSlug.includes(token)))
    );
  });
  if (bySlug) return bySlug;

  const byTitle = programs.find((program) => {
    const title = normalizeMatchText(program.title);
    return (
      title === normalizedTrack ||
      title.includes(normalizedTrack) ||
      normalizedTrack.includes(title) ||
      (trackTokens.length > 0 &&
        trackTokens.every((token) => title.includes(token)))
    );
  });
  if (byTitle) return byTitle;

  let best: { program: InternshipProgram; score: number } | undefined;
  for (const program of programs) {
    const haystack = `${normalizeMatchText(program.title)} ${normalizeMatchText(program.slug.replace(/-/g, " "))}`;
    const score = trackTokens.filter((token) => haystack.includes(token)).length;
    if (score === 0) continue;
    if (!best || score > best.score) best = { program, score };
  }

  if (best && best.score >= Math.min(2, trackTokens.length || 1)) {
    return best.program;
  }

  return best?.program;
}

export default function ProjectAccessModal({
  open,
  onOpenChange,
  careerTrack,
}: ProjectAccessModalProps) {
  const { data, isLoading, isFetching } = useGetInternshipPrograms();
  const programs = useMemo(() => {
    return (Array.isArray(data) ? data : data?.data) ?? [];
  }, [data]);

  const matchedProgram = useMemo(() => {
    if (!careerTrack || programs.length === 0) return undefined;
    return findProgramForCareerTrack(programs, careerTrack);
  }, [careerTrack, programs]);

  const paymentHref = matchedProgram?.slug
    ? `/payment/${matchedProgram.slug}?promo_code=${DEFAULT_PROMO_CODE}`
    : null;
  const loading = Boolean(careerTrack) && (isLoading || isFetching) && !matchedProgram;
  const canProceed = Boolean(paymentHref);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-200 bg-black/50"
        className="z-200 w-full max-w-[calc(100%-2rem)] gap-0 rounded-2xl border-0 bg-white p-8 text-left shadow-[0_16px_40px_rgba(15,23,42,0.18)] sm:max-w-md sm:p-10"
      >
        <DialogTitle className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-[1.75rem]">
          Get Full Project Access
        </DialogTitle>
        <DialogDescription className="mt-3 text-base leading-relaxed text-[#64748B]">
          To start this project, enroll to this program
        </DialogDescription>
        {canProceed ? (
          <Link
            href={paymentHref!}
            onClick={() => onOpenChange(false)}
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#156374] px-5 text-base font-semibold text-white transition hover:bg-[#0f4d5a]"
          >
            Proceed with enrollment
          </Link>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              if (!loading) onOpenChange(false);
            }}
            className={cn(
              "mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#156374] px-5 text-base font-semibold text-white transition",
              loading
                ? "cursor-wait opacity-70"
                : "cursor-pointer hover:bg-[#0f4d5a]",
            )}
          >
            {loading ? "Finding program..." : "Proceed with enrollment"}
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
