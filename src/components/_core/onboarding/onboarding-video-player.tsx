"use client";

import ReactPlayer from "react-player";
import { cn } from "@/lib/utils";

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
  return (
    <div
      className={cn(
        "relative mt-3 h-63.75 w-full overflow-hidden rounded-xl bg-[#142A2F] sm:h-80",
        className,
      )}
    >
      <ReactPlayer
        src={src}
        playing
        controls
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
        onEnded={onEnded}
      />
    </div>
  );
};

export default OnboardingVideoPlayer;
