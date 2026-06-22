"use client";

import type { ReactNode } from "react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAvatarUrlFromUser,
  useGetUserInfo,
} from "@/features/auth/use-get-user-info";
import { cn } from "@/lib/utils";

const PATH_D =
  "M24 300 C 92 276, 136 252, 206 214 C 276 174, 296 98, 374 94 C 459 90, 504 152, 592 116 C 670 84, 692 30, 764 24 C 850 16, 904 1, 1000 0";

const VIEWBOX = { minX: 0, minY: -120, width: 1040, height: 480 };

const DECORATIVE_STARS = [
  { left: "13%", top: "73%" },
  { left: "20%", top: "64%" },
  { left: "28%", top: "62%" },
  { left: "36%", top: "47%" },
  { left: "46%", top: "54%" },
  { left: "54%", top: "42%" },
  { left: "66%", top: "30%" },
];

const ROADMAP_STEPS = [
  { label: "Onboarding complete" },
  { label: "Pre-entry diagnostic passed" },
  { label: "You have completed your first Project" },
  { label: "Formative stage complete" },
  { label: "CV Review Completed" },
  { label: "Career center unlocked" },
];

type PathPoint = {
  left: string;
  top: string;
};

type StepMarker = {
  label: string;
  position: PathPoint;
  bubblePosition: "above" | "below";
};

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function toPercentPoint(x: number, y: number): PathPoint {
  return {
    left: `${((x - VIEWBOX.minX) / VIEWBOX.width) * 100}%`,
    top: `${((y - VIEWBOX.minY) / VIEWBOX.height) * 100}%`,
  };
}

function getPointOnPath(
  path: SVGPathElement,
  progress: number,
  yOffset = 0,
): PathPoint {
  const length = path.getTotalLength();
  const point = path.getPointAtLength(length * clampProgress(progress));
  return toPercentPoint(point.x, point.y + yOffset);
}

type SpeechBubbleProps = {
  children: ReactNode;
  variant?: "green" | "grey";
  pointer?: "top" | "bottom" | "left" | "right";
  className?: string;
};

function SpeechBubble({
  children,
  variant = "grey",
  pointer = "bottom",
  className,
}: SpeechBubbleProps) {
  const isGreen = variant === "green";
  const fillColor = isGreen ? "#E4F8E8" : "#FFFFFF";

  const pointerPosition = {
    top: "left-1/2 top-0 -translate-x-1/2 -translate-y-full border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent",
    bottom:
      "bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent",
    left: "left-0 top-1/2 -translate-x-full -translate-y-1/2 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent",
    right:
      "right-0 top-1/2 translate-x-full -translate-y-1/2 border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent",
  };

  const pointerBorderColor = {
    top: { borderBottomColor: fillColor },
    bottom: { borderTopColor: fillColor },
    left: { borderRightColor: fillColor },
    right: { borderLeftColor: fillColor },
  };

  return (
    <div
      className={cn(
        "relative rounded-lg px-3 py-1.5 text-[11px] leading-snug shadow-[0_2px_8px_rgba(13,42,49,0.08)] sm:text-xs",
        isGreen
          ? "bg-[#E4F8E8] font-medium text-[#1F7A4A]"
          : "border border-[#E2E8F0] bg-white text-[#64748B]",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn("absolute size-0", pointerPosition[pointer])}
        style={pointerBorderColor[pointer]}
      />
    </div>
  );
}

function MilestoneMarker() {
  return (
    <div className="flex size-8 items-center justify-center rounded-full bg-[#E8EDF2] shadow-sm">
      <Star
        className="size-4 text-[#94A3B8]"
        fill="none"
        strokeWidth={1.75}
      />
    </div>
  );
}

function getStepProgress(stepIndex: number) {
  if (ROADMAP_STEPS.length <= 1) return 0;
  return stepIndex / (ROADMAP_STEPS.length - 1);
}

const YourRoadMap = () => {
  const clipId = useId();
  const { data: userInfo } = useGetUserInfo();
  const avatarUrl = getAvatarUrlFromUser(userInfo ?? null);
  const pathRef = useRef<SVGPathElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [startLabelPos, setStartLabelPos] = useState<PathPoint>({
    left: "9%",
    top: "52%",
  });
  const [avatarPos, setAvatarPos] = useState<PathPoint>({
    left: "9%",
    top: "40%",
  });
  const [markerPos, setMarkerPos] = useState<PathPoint>({
    left: "10.5%",
    top: "74%",
  });
  const [completedStepMarkers, setCompletedStepMarkers] = useState<StepMarker[]>(
    [],
  );

  const journeyProgress = getStepProgress(currentStep);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ROADMAP_STEPS.length - 1;

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    setPathLength(length);
    setStartLabelPos(getPointOnPath(path, 0, -42));
    setAvatarPos(getPointOnPath(path, journeyProgress, -78));
    setMarkerPos(getPointOnPath(path, journeyProgress));

    const markers = ROADMAP_STEPS.slice(0, currentStep).map((step, index) => ({
      label: step.label,
      position: getPointOnPath(path, getStepProgress(index)),
      bubblePosition: index % 2 === 0 ? "above" : "below",
    })) as StepMarker[];

    setCompletedStepMarkers(markers);
  }, [currentStep, journeyProgress]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFirstStep}
          onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-[#64748B]">
          Step {currentStep + 1} of {ROADMAP_STEPS.length}
        </span>
        <Button
          type="button"
          size="sm"
          disabled={isLastStep}
          onClick={() =>
            setCurrentStep((step) =>
              Math.min(ROADMAP_STEPS.length - 1, step + 1),
            )
          }
        >
          Next step
        </Button>
      </div>
      <section className="rounded-2xl border border-[#E2E8F0] bg-white">
        <div className="flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pt-5">
          <h2 className="text-xl font-semibold text-[#0B2B33]">Your road map</h2>
        </div>

        <div className="relative h-72 w-full overflow-visible sm:h-80">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`${VIEWBOX.minX} ${VIEWBOX.minY} ${VIEWBOX.width} ${VIEWBOX.height}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <clipPath id={clipId}>
                <rect
                  x={VIEWBOX.minX}
                  y={VIEWBOX.minY}
                  width={1000}
                  height={VIEWBOX.height}
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              <path
                d={PATH_D}
                fill="none"
                stroke="#D9EEF2"
                strokeWidth="128"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={pathRef}
                d={PATH_D}
                fill="none"
                stroke="#B8D4DB"
                strokeWidth="4"
                strokeDasharray="10 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {pathLength > 0 && (
                <path
                  d={PATH_D}
                  fill="none"
                  stroke="#0F3E49"
                  strokeWidth="4"
                  strokeDasharray={pathLength}
                  strokeDashoffset={pathLength * (1 - journeyProgress)}
                  strokeLinecap="round"
                />
              )}
            </g>
          </svg>

          {DECORATIVE_STARS.map((item) => (
            <div
              key={`${item.left}-${item.top}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[#FFB547]"
              style={{ left: item.left, top: item.top }}
            >
              <Star className="size-3 fill-current" />
            </div>
          ))}

          <div
            className="absolute z-10 flex -translate-x-1/2 flex-col items-center transition-[left,top] duration-500 ease-out"
            style={startLabelPos}
          >
            <span className="text-xs font-semibold text-[#0F3E49]">Start</span>
            <ChevronDown className="mt-0.5 size-4 text-[#0F3E49]" strokeWidth={2.5} />
          </div>

          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-500 ease-out"
            style={avatarPos}
          >
            <div className="size-9 overflow-hidden rounded-lg border border-[#FECDCA] bg-[#FFE4D6] shadow-sm">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  width={36}
                  height={36}
                  className="size-full object-cover"
                  unoptimized={avatarUrl.startsWith("http")}
                />
              ) : (
                <div className="flex size-full items-center justify-center text-base">
                  🙂
                </div>
              )}
            </div>
          </div>

          <div
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-500 ease-out"
            style={markerPos}
          >
            <div className="flex size-7 items-center justify-center rounded-full bg-[#0F3E49] shadow-sm">
              <Star
                className="size-3.5 text-[#FFB547]"
                fill="none"
                strokeWidth={2}
              />
            </div>
          </div>

          {completedStepMarkers.map((milestone) => (
            <div
              key={milestone.label}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-1000 text-center"
              style={milestone.position}
            >
              {milestone.bubblePosition === "above" && (
                <SpeechBubble
                  pointer="bottom"
                  className="absolute bottom-full left-1/2 mb-2 w-max max-w-44 -translate-x-1/2 sm:max-w-40"
                >
                  {milestone.label}
                </SpeechBubble>
              )}

              <div className="flex justify-center">
                <MilestoneMarker />
              </div>

              {milestone.bubblePosition === "below" && (
                <SpeechBubble
                  pointer="top"
                  className="absolute left-1/2 top-full mt-2 w-max max-w-40 -translate-x-1/2"
                >
                  {milestone.label}
                </SpeechBubble>
              )}
            </div>
          ))}

          <div className="absolute bottom-0 left-4 sm:left-5">
            <SpeechBubble variant="green" pointer="top" className="max-w-44">
              Building experience <br /> that recruiters hire for
            </SpeechBubble>
          </div>
        </div>
      </section>
    </>
  );
};

export default YourRoadMap;
