"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";

const WelcomeVideo = () => {
  const router = useRouter();
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);

  return (
    <section className="w-full max-w-190 px-4 pb-5 pt-0 sm:px-0 sm:pb-8">
      <h1 className="text-2xl font-semibold text-[#173740]">Your Orientation</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">Watch video</h2>

        <div
          role="button"
          tabIndex={0}
          className="relative mt-3 h-63.75 overflow-hidden rounded-2xl sm:h-80"
          onClick={() => {
            if (hasVideoEnded) return;
            setVideoPlaying((prev) => !prev);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (hasVideoEnded) return;
              setVideoPlaying((prev) => !prev);
            }
          }}
          aria-label={videoPlaying ? "Pause video" : "Play video"}
        >
          <ReactPlayer
            src="https://vimeo.com/1123856639"
            playing={videoPlaying}
            loop={false}
            volume={volume}
            width="100%"
            height="100%"
            controls={false}
            onEnded={() => {
              setVideoPlaying(false);
              setHasVideoEnded(true);
            }}
          />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (hasVideoEnded) return;
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
            />
          </div>
        </div>

        <p className="mt-3 text-base leading-relaxed text-[#64748B] font-semibold">
          Get familiar with your learning environment, understand what to expect,
          and how to make the most of your learning experience.
        </p>
      </article>

      <button
        type="button"
        disabled={!hasVideoEnded}
        onClick={() => router.push("/pre-diagnostic-test?step=internship-structure-video")}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        Continue
      </button>
    </section>
  );
};

export default WelcomeVideo;
