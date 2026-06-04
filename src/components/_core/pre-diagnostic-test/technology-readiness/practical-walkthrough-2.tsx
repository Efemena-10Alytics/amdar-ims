"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingVideoPlayer from "@/components/_core/onboarding/onboarding-video-player";
import { usePreDiagnosticNavigation } from "@/components/_core/pre-diagnostic-test/use-pre-diagnostic-navigation";
import { getPreDiagnosticVideoDescription } from "@/features/pre-diagnostic/use-get-pre-diagnostic";

const FALLBACK_VIDEO_SRC = "https://vimeo.com/1123856639";
const FALLBACK_DESCRIPTION =
  "Learn how to navigate your tools, submit work, and stay on track throughout your program.";

const PracticalWalkthrough2 = () => {
  const router = useRouter();
  const { preDiagnostic } = usePreDiagnosticNavigation();
  const [hasVideoEnded, setHasVideoEnded] = useState(false);

  const walkthroughVideo = preDiagnostic.technology_readiness.PracticalWalkthrough[1];
  const src = walkthroughVideo?.link?.trim() || FALLBACK_VIDEO_SRC;
  const description = getPreDiagnosticVideoDescription(
    walkthroughVideo,
    FALLBACK_DESCRIPTION,
  );

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <h1 className="text-2xl font-semibold text-[#173740]">Practical walkthrough 2</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">Watch video</h2>

        <OnboardingVideoPlayer src={src} onEnded={() => setHasVideoEnded(true)} />

        <p className="mt-3 text-base leading-relaxed font-semibold text-[#64748B]">
          {description}
        </p>
      </article>

      <button
        type="button"
        disabled={!hasVideoEnded}
        onClick={() =>
          router.push(
            "/pre-diagnostic-test/technology-readiness?step=technology-diagnostics",
          )
        }
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        Continue
      </button>
    </section>
  );
};

export default PracticalWalkthrough2;
