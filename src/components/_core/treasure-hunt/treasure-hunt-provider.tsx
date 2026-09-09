"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  TREASURES_QUERY_KEY,
  useGetTreasures,
} from "@/features/treasure-hunt/use-get-treasures";
import {
  buildTreasureSlotMap,
  resolveTreasureIdForSlot,
} from "@/features/treasure-hunt/treasure-slot-map";
import { useWinTreasure } from "@/features/treasure-hunt/use-win";
import {
  TreasureHuntCongratulationsModal,
  type TreasureHuntModalVariant,
} from "@/components/_core/treasure-hunt/congratulations";
import { cn } from "@/lib/utils";

type TreasureHuntContextValue = {
  /** True when hunter has not claimed a treasure yet */
  isHuntActive: boolean;
  isClaiming: boolean;
  /** Win-slot index → treasure id (units-aware; rare items appear at most `units` times). */
  slotToTreasureId: number[];
  openDecoy: () => void;
  claimTreasure: (treasureSlotIndex?: number) => Promise<void>;
};

const TreasureHuntContext = createContext<TreasureHuntContextValue | null>(
  null,
);

export function TreasureHuntProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [treasureModal, setTreasureModal] =
    useState<TreasureHuntModalVariant | null>(null);
  const queryClient = useQueryClient();
  const { data } = useGetTreasures();
  const { win, isSubmitting: isClaiming, data: winData } = useWinTreasure();

  const treasures = data?.treasures ?? [];
  const hunterId = data?.hunter?.id;
  const isHuntActive = data?.hunter?.treasure_id === null;

  /** Stable per hunter + current stock so slot N always maps to the same id until units change. */
  const slotToTreasureId = useMemo(() => {
    const stockKey = treasures.map((t) => `${t.id}:${t.units}`).join("|");
    let stockHash = 0;
    for (let i = 0; i < stockKey.length; i++) {
      stockHash = (Math.imul(31, stockHash) + stockKey.charCodeAt(i)) | 0;
    }
    const seed = ((hunterId ?? 1) ^ (stockHash >>> 0)) >>> 0 || 1;
    return buildTreasureSlotMap(treasures, seed);
  }, [treasures, hunterId]);

  const openDecoy = useCallback(() => {
    setTreasureModal("decoy");
  }, []);

  const claimTreasure = useCallback(
    async (treasureSlotIndex = 0) => {
      if (hunterId == null || isClaiming || !isHuntActive) return;

      const treasureId = resolveTreasureIdForSlot(
        slotToTreasureId,
        treasureSlotIndex,
      );
      if (treasureId == null) return;

      try {
        await win({ hunter_id: hunterId, treasure_id: treasureId });
        await queryClient.invalidateQueries({ queryKey: TREASURES_QUERY_KEY });
        setTreasureModal("win");
      } catch {
        // Stock may have changed — refresh map for other open tabs / next attempt.
        await queryClient.invalidateQueries({ queryKey: TREASURES_QUERY_KEY });
      }
    },
    [
      hunterId,
      isClaiming,
      isHuntActive,
      slotToTreasureId,
      win,
      queryClient,
    ],
  );

  const value = useMemo(
    () => ({
      isHuntActive,
      isClaiming,
      slotToTreasureId,
      openDecoy,
      claimTreasure,
    }),
    [isHuntActive, isClaiming, slotToTreasureId, openDecoy, claimTreasure],
  );

  return (
    <TreasureHuntContext.Provider value={value}>
      {children}
      <TreasureHuntCongratulationsModal
        open={treasureModal != null}
        variant={treasureModal ?? "decoy"}
        treasureName={winData?.treasure?.name}
        onOpenChange={(open) => {
          if (!open) setTreasureModal(null);
        }}
      />
    </TreasureHuntContext.Provider>
  );
}

export function useTreasureHunt() {
  const ctx = useContext(TreasureHuntContext);
  if (!ctx) {
    throw new Error("useTreasureHunt must be used within TreasureHuntProvider");
  }
  return ctx;
}

type TreasureSpotProps = {
  kind: "decoy" | "win";
  /**
   * Win-slot index (0–10). Resolved to a treasure id via a units-weighted map
   * so a `units: 1` prize is linked to at most one slot.
   */
  treasureSlotIndex?: number;
  className?: string;
  children: React.ReactNode;
  /** When false, inactive hunt still shows children without click behavior (default true hides nothing — use hideWhenInactive). */
  hideWhenInactive?: boolean;
};

/**
 * Invisible-style treasure target: text, flag, or control.
 * Only interactive while the hunter has no treasure_id.
 */
export function TreasureSpot({
  kind,
  treasureSlotIndex = 0,
  className,
  children,
  hideWhenInactive = false,
}: TreasureSpotProps) {
  const { isHuntActive, isClaiming, slotToTreasureId, openDecoy, claimTreasure } =
    useTreasureHunt();

  if (!isHuntActive) {
    if (hideWhenInactive) return null;
    return <>{children}</>;
  }

  const linkedTreasureId =
    kind === "win"
      ? resolveTreasureIdForSlot(slotToTreasureId, treasureSlotIndex)
      : undefined;

  return (
    <span
      role="button"
      tabIndex={isClaiming && kind === "win" ? -1 : 0}
      className={cn(
        "cursor-pointer appearance-none border-0 bg-transparent p-0 font-inherit text-inherit",
        isClaiming && kind === "win" && "cursor-wait opacity-70",
        className,
      )}
      aria-disabled={kind === "win" && isClaiming}
      data-treasure-kind={kind}
      data-treasure-slot={kind === "win" ? treasureSlotIndex : undefined}
      data-treasure-id={linkedTreasureId}
      onClick={(event) => {
        if (kind === "win" && isClaiming) return;
        event.preventDefault();
        event.stopPropagation();
        if (kind === "decoy") openDecoy();
        else void claimTreasure(treasureSlotIndex);
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (kind === "win" && isClaiming) return;
        event.preventDefault();
        event.stopPropagation();
        if (kind === "decoy") openDecoy();
        else void claimTreasure(treasureSlotIndex);
      }}
    >
      {children}
    </span>
  );
}
