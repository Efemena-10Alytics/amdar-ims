"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import ReactPlayer from "react-player";
import { VideoFullscreenButton } from "@/components/_core/shared/video-fullscreen-button";
import { useVideoFullscreen } from "@/hooks/use-video-fullscreen";
import { cn } from "@/lib/utils";

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;
const SEEK_SECONDS = 10;

function formatPlaybackRate(rate: number) {
  return rate === 1 ? "1x" : `${rate}x`;
}

function formatVideoTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

type OnboardingVideoPlayerProps = {
  src: string;
  onEnded: () => void;
  className?: string;
};

const OnboardingVideoPlayer = ({
  src,
  onEnded,
  className,
}: OnboardingVideoPlayerProps) => {
  const { containerRef, isFullscreen, toggleFullscreen } = useVideoFullscreen();
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);

  const syncPlaybackTime = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    const duration = player.duration;
    if (Number.isFinite(duration) && duration > 0) {
      setDurationSeconds(duration);
    }

    const currentTime = player.currentTime;
    if (Number.isFinite(currentTime) && currentTime >= 0) {
      setPlayedSeconds(currentTime);
    }
  }, []);

  useEffect(() => {
    setPlayedSeconds(0);
    setDurationSeconds(0);
    setHasVideoEnded(false);
    setVideoPlaying(true);
  }, [src]);

  useEffect(() => {
    if (!videoPlaying || hasVideoEnded) return;

    syncPlaybackTime();
    const intervalId = window.setInterval(syncPlaybackTime, 500);

    return () => window.clearInterval(intervalId);
  }, [videoPlaying, hasVideoEnded, src, syncPlaybackTime]);

  const togglePlayback = () => {
    if (hasVideoEnded) return;
    setVideoPlaying((prev) => !prev);
  };

  const seekBy = (deltaSeconds: number) => {
    const player = playerRef.current;
    if (!player) return;

    const duration = Number.isFinite(player.duration)
      ? player.duration
      : durationSeconds;
    const current = Number.isFinite(player.currentTime)
      ? player.currentTime
      : playedSeconds;
    const maxTime = Number.isFinite(duration) && duration > 0 ? duration : current;
    const nextTime = Math.min(Math.max(current + deltaSeconds, 0), maxTime);

    player.currentTime = nextTime;
    setPlayedSeconds(nextTime);

    if (hasVideoEnded && nextTime < maxTime) {
      setHasVideoEnded(false);
    }
  };

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      className={cn(
        "relative mt-3 h-63.75 overflow-hidden rounded-2xl sm:h-80",
        "[&:fullscreen]:mt-0 [&:fullscreen]:flex [&:fullscreen]:h-screen [&:fullscreen]:max-h-none [&:fullscreen]:w-screen [&:fullscreen]:items-center [&:fullscreen]:justify-center [&:fullscreen]:rounded-none [&:fullscreen]:bg-black",
        className,
      )}
      onClick={togglePlayback}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          togglePlayback();
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          seekBy(-SEEK_SECONDS);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          seekBy(SEEK_SECONDS);
        }
      }}
      aria-label={videoPlaying ? "Pause video" : "Play video"}
    >
      <ReactPlayer
        ref={playerRef}
        src={src}
        playing={videoPlaying}
        loop={false}
        volume={volume}
        playbackRate={playbackRate}
        width="100%"
        height="100%"
        className={cn(isFullscreen && "max-h-screen max-w-screen")}
        controls={false}
        onReady={syncPlaybackTime}
        onDurationChange={syncPlaybackTime}
        onTimeUpdate={syncPlaybackTime}
        onEnded={() => {
          syncPlaybackTime();
          setVideoPlaying(false);
          setHasVideoEnded(true);
          onEnded();
        }}
      />

      <div
        className="absolute top-3 right-3 z-10"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <VideoFullscreenButton
          isFullscreen={isFullscreen}
          onToggle={toggleFullscreen}
        />
      </div>

      <div
        className="absolute bottom-4 left-4 z-10 flex items-center gap-2"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => seekBy(-SEEK_SECONDS)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
          aria-label={`Rewind ${SEEK_SECONDS} seconds`}
        >
          <span className="relative flex items-center justify-center">
            <RotateCcw className="h-6 w-6" />
            <span className="absolute text-[8px] font-bold leading-none">
              {SEEK_SECONDS}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={togglePlayback}
          className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-base font-medium text-white backdrop-blur-sm transition hover:bg-black/40"
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

        <button
          type="button"
          onClick={() => seekBy(SEEK_SECONDS)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
          aria-label={`Fast forward ${SEEK_SECONDS} seconds`}
        >
          <span className="relative flex items-center justify-center">
            <RotateCw className="h-6 w-6" />
            <span className="absolute text-[8px] font-bold leading-none">
              {SEEK_SECONDS}
            </span>
          </span>
        </button>
      </div>

      <div
        className="absolute right-4 bottom-4 z-10 flex items-center gap-2 rounded-lg bg-black/45 px-2 py-1"
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

        <span
          className="px-1 text-xs font-semibold whitespace-nowrap text-white tabular-nums"
          aria-live="polite"
        >
          {formatVideoTime(playedSeconds)} / {formatVideoTime(durationSeconds)}
        </span>
      </div>
    </div>
  );
};

export default OnboardingVideoPlayer;
