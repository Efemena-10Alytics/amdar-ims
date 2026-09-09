import type { ReactNode } from "react";
import {
  TreasureSpot,
  useTreasureHunt,
} from "@/components/_core/treasure-hunt/treasure-hunt-provider";

/** Wins placed on job Apply buttons (slots cycle 0–10). */
export const JOB_BOARD_WIN_COUNT = 18;

/** Total treasure spots on /job-board (excluding shared footer). */
export const JOB_BOARD_TOTAL_SPOTS = 200;

export const JOB_BOARD_DECOY_COUNT =
  JOB_BOARD_TOTAL_SPOTS - JOB_BOARD_WIN_COUNT;

/** Always-rendered spots per job card: icon, employer, title, apply. */
export const JOB_CARD_SPOTS = 4;

/** Jobs to show while hunting so 50 × 4 = 200 spots. */
export const JOB_BOARD_HUNT_PAGE_SIZE =
  JOB_BOARD_TOTAL_SPOTS / JOB_CARD_SPOTS;

/** API treasure list length used elsewhere (slots 0–10). */
export const TREASURE_SLOT_CYCLE = 11;

export type JobCardTreasureConfig = {
  icon?: "decoy" | "win";
  iconSlot?: number;
  employer?: "decoy" | "win";
  employerSlot?: number;
  location?: "decoy" | "win";
  locationSlot?: number;
  title?: "decoy" | "win";
  titleSlot?: number;
  meta?: "decoy" | "win";
  metaSlot?: number;
  date?: "decoy" | "win";
  dateSlot?: number;
  apply?: "decoy" | "win";
  applySlot?: number;
};

/**
 * First 18 jobs: Apply = win (slot index % 11); icon/employer/title = decoy.
 * Remaining jobs through hunt page size: all four fields = decoy.
 * Yields exactly 18 wins + 182 decoys = 200 spots when 50 jobs render.
 */
export function jobCardTreasure(
  index: number,
): JobCardTreasureConfig | undefined {
  if (index < 0 || index >= JOB_BOARD_HUNT_PAGE_SIZE) return undefined;

  if (index < JOB_BOARD_WIN_COUNT) {
    return {
      icon: "decoy",
      employer: "decoy",
      title: "decoy",
      apply: "win",
      applySlot: index % TREASURE_SLOT_CYCLE,
    };
  }

  return {
    icon: "decoy",
    employer: "decoy",
    title: "decoy",
    apply: "decoy",
  };
}

/** Wrap children in a TreasureSpot when hunt is active and kind is set. */
export function JobTreasureWrap({
  kind,
  slot,
  className,
  children,
}: {
  kind?: "decoy" | "win";
  slot?: number;
  className?: string;
  children: ReactNode;
}) {
  const { isHuntActive } = useTreasureHunt();
  if (!isHuntActive || !kind) return <>{children}</>;
  return (
    <TreasureSpot kind={kind} treasureSlotIndex={slot} className={className}>
      {children}
    </TreasureSpot>
  );
}
