"use client";

import Link from "next/link";
import { Flag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/components/_core/landing-pages/shared/whatsapp-widget";
import { getInternsWhatsappGroupUrl } from "@/constants/interns-whatsapp-group";
import { useGetUserEnrollment } from "@/features/internship/use-get-user-enrollment";
import {
  getReadinessScoreProgressPercent,
  getReadinessScoreTierConfig,
} from "@/features/readiness-test/get-readiness-score-tier";

type ReadinessTestResultProps = {
  totalScore: number;
  percentageScore?: number;
  title?: string;
  onRetake?: () => void;
  onProceed?: () => void;
  isProceeding?: boolean;
  /** Renders inside the quiz drawer without page-level section padding. */
  embedded?: boolean;
};

function ScoreRing({
  score,
  progressPercent,
  progressColor,
  trackColor,
}: {
  score: number;
  progressPercent: number;
  progressColor: string;
  trackColor: string;
}) {
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.min(100, Math.max(0, progressPercent));
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="relative mx-auto size-16">
      <svg
        className="size-full -rotate-90"
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        aria-hidden
      >
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={progressColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold text-[#173740]">
          {Math.round(score)}
        </span>
      </div>
    </div>
  );
}

const ReadinessTestResult = ({
  totalScore,
  percentageScore,
  title = "Readiness Quiz",
  onRetake,
  onProceed,
  isProceeding = false,
  embedded = false,
}: ReadinessTestResultProps) => {
  const { data: enrollment } = useGetUserEnrollment();
  const whatsappGroupUrl = getInternsWhatsappGroupUrl(
    enrollment?.program,
    enrollment?.cohort,
  );
  const config = getReadinessScoreTierConfig(totalScore);
  const ringScore = percentageScore ?? totalScore;
  const ringProgress =
    percentageScore != null
      ? percentageScore
      : getReadinessScoreProgressPercent(totalScore);

  const openSupport = () => {
    const supportUrl = whatsappGroupUrl ?? WHATSAPP_URL;
    window.open(supportUrl, "_blank", "noopener,noreferrer");
  };

  const handlePrimaryClick = () => {
    if (config.primaryAction === "support") {
      openSupport();
      return;
    }
    onProceed?.();
  };

  const content = (
    <>
      {!embedded ? (
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-base! font-semibold text-[#173740]">{title}</h1>
          {onRetake ? (
            <Button
              type="button"
              onClick={onRetake}
              disabled={isProceeding}
              className="h-10 shrink-0 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90"
            >
              Retake
            </Button>
          ) : null}
        </div>
      ) : null}

      <article
        className={
          embedded
            ? "bg-white"
            : "mt-5 rounded-2xl border border-[#DCE5E9] bg-white p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-8"
        }
      >
        <div className="mx-auto max-w-md text-center">
          {/* <ScoreRing
            score={ringScore}
            progressPercent={ringProgress}
            progressColor={config.progressColor}
            trackColor={config.trackColor}
          />

          <h2 className="mt-4 text-lg font-semibold text-[#173740] sm:text-xl">
            {config.heading}
          </h2> */}

          {/* <div
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${config.badgeClassName}`}
          >
            <Flag className="size-3.5 shrink-0" aria-hidden />
            {config.badgeLabel}
          </div> */}
        </div>

        <div className="mx-auto mt-6 max-w-lg rounded-xl bg-[#E8EFF1] p-4 sm:p-5">
          <h3 className="text-base font-semibold text-[#2F6A78]">Summary</h3>
          <p className="mt-2 text-xs leading-relaxed text-[#3F5E68] sm:text-sm">
            {config.summary}
          </p>
        </div>

        <p className="mx-auto mt-4 max-w-lg rounded-lg bg-[#EFF3F6] px-4 py-3 text-center text-sm text-[#6C7D88]">
          You can proceed to the next steps regardless of your score. A team member will reach out with your personalized readiness plan.
        </p>

        <div className="mx-auto mt-5 flex max-w-lg flex-col gap-3 pb-4">
          <Button
            type="button"
            onClick={handlePrimaryClick}
            disabled={isProceeding}
            className="h-12 w-full cursor-pointer rounded-full bg-primary text-base font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isProceeding ? "Saving..." : config.primaryLabel}
          </Button>

          {config.showSupportButton ? (
            <Button
              type="button"
              variant="outline"
              onClick={openSupport}
              disabled={isProceeding}
              className="h-12 w-full rounded-full border-[#DCE5E9] bg-white text-base font-medium text-[#173740] hover:bg-[#F3F7F8]"
            >
              <MessageCircle className="size-5 text-[#2F6A78]" aria-hidden />
              Reach out to support
            </Button>
          ) : null}

          {config.showCommunityButton ? (
            whatsappGroupUrl ? (
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-12 w-full rounded-full border-[#C5E6CE] bg-[#E8F7EC] text-base font-medium text-[#173740] hover:bg-[#DCF3E2]"
              >
                <Link
                  href={whatsappGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-5 text-[#3A8E53]" aria-hidden />
                  Join our community
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                disabled
                className="h-12 w-full rounded-full border-[#C5E6CE] bg-[#E8F7EC] text-base font-medium text-[#173740] opacity-70"
              >
                <MessageCircle className="size-5 text-[#3A8E53]" aria-hidden />
                Join our community
              </Button>
            )
          ) : null}
        </div>
      </article>
    </>
  );

  if (embedded) {
    return <div className="flex h-full flex-col">{content}</div>;
  }

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      {content}
    </section>
  );
};

export default ReadinessTestResult;
