"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingVideoPlayer from "./onboarding-video-player";

const ORIENTATION_VIDEO_SRC = "https://vimeo.com/1123856639";

const OrientationVideo = () => {
  const router = useRouter();
  const [hasVideoEnded, setHasVideoEnded] = useState(false);

  return (
    <section className="w-full max-w-190 py-5 sm:py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-1.5 w-14 rounded-full bg-[#1E7C8D]" />
        <span className="h-1.5 w-14 rounded-full bg-[#B1C5CB]" />
        <span className="h-1.5 w-14 rounded-full bg-[#B1C5CB]" />
      </div>

      <h1 className="text-2xl font-semibold text-[#173740]">Your Orientation</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">Watch video</h2>

        <OnboardingVideoPlayer
          src={ORIENTATION_VIDEO_SRC}
          onEnded={() => setHasVideoEnded(true)}
        />

        <p className="mt-3 text-base leading-relaxed text-[#64748B] font-semibold">
          Get familiar with your learning environment, understand what to expect,
          and how to make the most of your learning experience.
        </p>
      </article>

      <button
        type="button"
        disabled={!hasVideoEnded}
        onClick={() => router.push("/onboarding?step=internship-structure-video")}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        Continue
      </button>
    </section>
  );
};

export default OrientationVideo;
