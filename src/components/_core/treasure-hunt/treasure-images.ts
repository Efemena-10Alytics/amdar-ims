/** Filenames under `/public/treasures` — matched against won item names. */
export const TREASURE_IMAGE_FILES = [
  "1 Month Data Subscription.jpeg",
  "10KG Rice &Oil.jpeg",
  "20000mAh Power Bank.jpeg",
  "Airtel SmartConnect 5G Outdoor Unit (ODU) router..jpeg",
  "Chop Master 7in 1 Food Chopper.jpeg",
  "Dinner Set.jpeg",
  "Electric Food Chopper.jpeg",
  "Electric Kettle.jpeg",
  "Headset.jpeg",
  "Laptop Bagpack.jpeg",
  "Laptop Table Stand.jpeg",
  "mango.jpg",
  "Microwave.jpeg",
  "Oraimo Smart Watch.jpeg",
  "OX 18 Inches StandiNG Fan.jpeg",
  "Refridgerator.jpeg",
  "SILVER CREST 8L Extra Large .jpeg",
  "Skincare Giftcard.jpeg",
  "Smart Blender.jpeg",
  "Stand Mixer.jpeg",
] as const;

function normalizeTreasureLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Public URL under /treasures/... */
function toTreasurePublicPath(file: string): string {
  return `/treasures/${file
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

/** Resolve a public image path for a won treasure name, or null if no match. */
export function getTreasureImageSrc(
  treasureName: string | null | undefined,
): string | null {
  if (!treasureName?.trim()) return null;

  const needle = normalizeTreasureLabel(treasureName);
  let best: { src: string; score: number } | null = null;

  for (const file of TREASURE_IMAGE_FILES) {
    const stem = file.replace(/\.[^.]+$/u, "");
    const hay = normalizeTreasureLabel(stem);

    if (hay === needle) {
      return toTreasurePublicPath(file);
    }

    if (hay.includes(needle) || needle.includes(hay)) {
      const score = Math.min(hay.length, needle.length);
      if (!best || score > best.score) {
        best = { src: toTreasurePublicPath(file), score };
      }
    }
  }

  return best?.src ?? null;
}
