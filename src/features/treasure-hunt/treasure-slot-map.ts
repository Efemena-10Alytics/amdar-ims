import type { TreasureListItem } from "./use-get-treasures";

/** Win spots on landing pages use indices 0–10. */
export const TREASURE_WIN_SLOT_COUNT = 11;

/** Mulberry32 — deterministic shuffle so a hunter keeps the same slot→id map. */
function seededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  const random = seededRandom(seed || 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Expand each treasure into `units` claim tickets, shuffle, then assign the first
 * `slotCount` tickets to win slots. A `units: 1` id appears in the map at most once.
 */
export function buildTreasureSlotMap(
  treasures: TreasureListItem[],
  seed: number,
  slotCount: number = TREASURE_WIN_SLOT_COUNT,
): number[] {
  const pool: number[] = [];

  for (const treasure of treasures) {
    const units = Math.max(0, Math.floor(Number(treasure.units) || 0));
    for (let i = 0; i < units; i++) {
      pool.push(treasure.id);
    }
  }

  if (pool.length === 0 || slotCount <= 0) return [];

  const shuffled = seededShuffle(pool, seed);
  const assigned: number[] = [];
  const usedById = new Map<number, number>();
  const maxById = new Map<number, number>();

  for (const treasure of treasures) {
    maxById.set(
      treasure.id,
      Math.max(0, Math.floor(Number(treasure.units) || 0)),
    );
  }

  for (const id of shuffled) {
    if (assigned.length >= slotCount) break;
    const used = usedById.get(id) ?? 0;
    const max = maxById.get(id) ?? 0;
    if (used >= max) continue;
    assigned.push(id);
    usedById.set(id, used + 1);
  }

  return assigned;
}

/** Resolve a win-slot index to a treasure id from the units-aware map. */
export function resolveTreasureIdForSlot(
  slotMap: number[],
  treasureSlotIndex: number,
): number | undefined {
  if (
    slotMap.length === 0 ||
    treasureSlotIndex < 0 ||
    treasureSlotIndex >= slotMap.length
  ) {
    return undefined;
  }
  return slotMap[treasureSlotIndex];
}
