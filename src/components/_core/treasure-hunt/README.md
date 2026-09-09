# Treasure Hunt — overview

Hunters register at `/treasure-hunt/register`. While the hunt is active (`hunter.treasure_id === null`), clickable `TreasureSpot`s appear on landing pages.

## Wins vs decoys

| | **Win** | **Decoy** |
|---|---|---|
| Prop | `kind="win"` + `treasureSlotIndex` (0–10) | `kind="decoy"` |
| On click | Claims `treasures[slot]` via `POST v3/treasure-hunters/win` | Opens “Oops! no treasure here” modal only |
| Result | “You've won!” + prize name/image + confetti | No prize |

Slots map to the **API treasure list index**, not a hardcoded product name. The prize shown is whatever the backend returns for that claim.

## Prize pool (possible items)

Images live under `/public/treasures/` (matched by name in `treasure-images.ts`):

- 1 Month Data Subscription
- 10KG Rice & Oil
- 20000mAh Power Bank
- Airtel SmartConnect 5G Outdoor Unit (ODU) router
- Chop Master 7in 1 Food Chopper
- Dinner Set
- Electric Food Chopper
- Electric Kettle
- Headset
- Laptop Bagpack
- Laptop Table Stand
- Microwave
- Oraimo Smart Watch
- OX 18 Inches Standing Fan
- Refrigerator
- SILVER CREST 8L Extra Large
- Skincare Giftcard
- Smart Blender
- Stand Mixer
- mango (image asset)

## Global spot (all landing pages)

| Kind | Place | Label / target |
|---|---|---|
| Decoy | Footer CTA banner | “Start here” |

## Pages

See each landing page’s `README.md` for wins, decoys, and places. Notable: `/job-board` has **18 wins + 182 decoys = 200** spots on the job cards.
