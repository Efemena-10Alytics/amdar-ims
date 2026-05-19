"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import ReactPlayer from "react-player";

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;

function formatPlaybackRate(rate: number) {
  return rate === 1 ? "1x" : `${rate}x`;
}

type OnboardingVideoPlayerProps = {
  src: string;
  onEnded: () => void;
};

const OnboardingVideoPlayer = ({ src, onEnded }: OnboardingVideoPlayerProps) => {
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);

  const togglePlayback = () => {
    if (hasVideoEnded) return;
    setVideoPlaying((prev) => !prev);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative mt-3 h-63.75 overflow-hidden rounded-2xl sm:h-80"
      onClick={togglePlayback}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          togglePlayback();
        }
      }}
      aria-label={videoPlaying ? "Pause video" : "Play video"}
    >
      <ReactPlayer
        src={src}
        playing={videoPlaying}
        loop={false}
        volume={volume}
        playbackRate={playbackRate}
        width="100%"
        height="100%"
        controls={false}
        onEnded={() => {
          setVideoPlaying(false);
          setHasVideoEnded(true);
          onEnded();
        }}
      />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          togglePlayback();
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
        <label className="sr-only" htmlFor="video-playback-speed">
          Playback speed
        </label>
        <select
          id="video-playback-speed"
          value={playbackRate}
          onChange={(event) => setPlaybackRate(Number(event.target.value))}
          className="h-7 cursor-pointer rounded-md border-0 bg-white/90 px-2 text-xs font-semibold text-[#173740] outline-none"
          aria-label="Playback speed"
        >
          {PLAYBACK_RATES.map((rate) => (
            <option key={rate} value={rate}>
              {formatPlaybackRate(rate)}
            </option>
          ))}
        </select>

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
  );
};

export default OnboardingVideoPlayer;
