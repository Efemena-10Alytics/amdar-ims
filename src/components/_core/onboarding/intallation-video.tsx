"use client";
import { useState } from "react";
import { Check, Download, Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";

const TOOL_ITEMS = ["Install google sheet", "Download Claude AI", "Download Figma"];

const IntallationVideo = () => {
  const router = useRouter();
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="w-full max-w-190 py-5 sm:py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-1.5 w-14 rounded-full bg-[#1E7C8D]" />
        <span className="h-1.5 w-14 rounded-full bg-[#A9BEC5]" />
        <span className="h-1.5 w-14 rounded-full bg-[#A9BEC5]" />
      </div>

      <h1 className="text-2xl font-semibold text-[#173740]">Tools &amp; Technology Installation</h1>

      <article className="mt-5 rounded-2xl border border-[#DCE5E9] bg-[#F6F8FA] p-4 shadow-[0_8px_18px_rgba(18,57,67,0.06)] sm:p-5">
        <h2 className="text-lg font-semibold text-[#3B6B76]">How to install your tools</h2>
        <p className="mt-1 text-sm font-medium text-[#EC5555]">
          Make sure to take a screenshot after successful installation, it will be
          requested!
        </p>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
          <div
            role="button"
            tabIndex={0}
            className="relative h-63.75 overflow-hidden rounded-2xl sm:h-80"
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
              src="https://vimeo.com/1123856639"
              playing={videoPlaying}
              loop={true}
              volume={volume}
              width="100%"
              height="100%"
              controls={false}
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
              />
            </div>
          </div>

          <div className="space-y-2">
            {TOOL_ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-lg bg-[#E2E8EC] px-3 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-[#D4F8DE] text-[#3CA766]">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <p className="text-sm font-semibold text-[#345764]">{item}</p>
                </div>
                <button
                  type="button"
                  className="text-[#2D6A78] transition hover:text-[#1E7C8D]"
                  aria-label={`Download ${item}`}
                >
                  <Download className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <label className="mt-4 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="size-4 rounded border-[#CBD8DE] accent-[#1E7C8D]"
          />
          <span className="text-sm text-[#8C9DAC]">I have watched &amp; download all tools</span>
        </label>
      </article>

      <button
        type="button"
        disabled={!confirmed}
        onClick={() => router.push("/onboarding?step=readiness-test")}
        className="ml-auto mt-6 block h-12 w-full max-w-80 rounded-full bg-primary text-base font-medium text-[#D7EEF4] transition hover:bg-[#5b98aa] disabled:cursor-not-allowed disabled:bg-[#9DB8C0] disabled:text-[#E4EDF0]"
      >
        Continue
      </button>
    </section>
  );
};

export default IntallationVideo;
