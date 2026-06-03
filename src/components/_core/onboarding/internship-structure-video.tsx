"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import ReactPlayer from "react-player";
import { useOnboardingNavigation } from "./use-onboarding-navigation";

const InternshipStructureVideo = () => {
  const { onboarding, goToStep } = useOnboardingNavigation();
  const videos = onboarding.internshp_structure_video ?? [];
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [completedIndexes, setCompletedIndexes] = useState<number[]>([]);

  const currentVideo = videos[videoIndex];
  const allVideosCompleted =
    videos.length > 0 && completedIndexes.length >= videos.length;

  const handleVideoEnded = () => {
    setVideoPlaying(false);
    setCompletedIndexes((prev) =>
      prev.includes(videoIndex) ? prev : [...prev, videoIndex],
    );
  };

  const handleContinue = () => {
    if (!allVideosCompleted && videoIndex < videos.length - 1) {
      setVideoIndex((prev) => prev + 1);
      setVideoPlaying(true);
      return;
    }
    goToStep("cohort-lead");
  };

  if (!currentVideo) {
    return (
      <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
        <p className="text-sm text-[#64748B]">No internship structure videos available.</p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <h1 className="text-2xl font-semibold text-[#173740]">Your Internship structure</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">
          {currentVideo.title || "Watch video"}
        </h2>

        <div
          role="button"
          tabIndex={0}
          className="relative mt-3 h-63.75 overflow-hidden rounded-2xl sm:h-80"
          onClick={() => setVideoPlaying((prev) => !prev)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setVideoPlaying((prev) => !prev);
            }
          }}
          aria-label={videoPlaying ? "Pause video" : "Play video"}
        >
          <ReactPlayer
            key={currentVideo.link}
            src={currentVideo.link}
            playing={videoPlaying}
            loop={false}
            volume={volume}
            width="100%"
            height="100%"
            controls={false}
            onEnded={handleVideoEnded}
          />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setVideoPlaying((prev) => !prev);
            }}
            className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-base font-medium text-white backdrop-blur-sm transition hover:bg-black/40"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E7C8D]">
              {videoPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              )}
            </span>
            {videoPlaying ? "Pause video" : "Play to watch"}
          </button>

          <div
            className="absolute right-4 bottom-4 flex items-center gap-2 rounded-lg bg-black/45 px-2 py-1"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="h-1 w-20 cursor-pointer appearance-none rounded-lg bg-white/60"
              aria-label="Volume"
            />
          </div>
        </div>

        <p className="mt-3 text-base leading-relaxed font-semibold text-[#64748B]">
          {currentVideo.description || "Getting to know how your internship works"}
        </p>

        {videos.length > 1 && (
          <p className="mt-2 text-sm font-medium text-[#2D6A78]">
            Video {videoIndex + 1} of {videos.length}
          </p>
        )}
      </article>

      <button
        type="button"
        disabled={!completedIndexes.includes(videoIndex) && !allVideosCompleted}
        onClick={handleContinue}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        {allVideosCompleted || videoIndex >= videos.length - 1
          ? "Continue"
          : "Next video"}
      </button>
    </section>
  );
};

export default InternshipStructureVideo;
