# Job Board (`/job-board`) — Treasure Hunt

**200 spots total** on this page (excluding the shared footer decoy): **18 wins** + **182 decoys**.

Wins claim `API treasures[slot % 11]`. Prize pool: [`treasure-hunt/README.md`](../../../components/_core/treasure-hunt/README.md).

While the hunt is active, the jobs grid loads **50** cards (padded if the API returns fewer) so each card contributes **4** always-on spots → `50 × 4 = 200`.

## Wins (18) — on jobs only

| Slot cycle | Place (UI) | Which jobs |
|---|---|---|
| `index % 11` (0–10) | **Apply** button | Job cards **0–17** |

## Decoys (182)

| Place (UI) | Count |
|---|---:|
| Job **icon**, **employer**, **title** on cards 0–17 | 54 |
| Job **icon**, **employer**, **title**, **Apply** on cards 18–49 | 128 |
| **Total decoys** | **182** |

Optional fields (location / meta / date) are **not** counted in the 200 — only the four always-rendered targets above.

## Items that can be won

Any prize from the campaign pool for API slots **0–10** (Apply wins cycle through those indices).

## Implementation

- Config: `job-board-treasure.ts`
- Card wrapping: `job-card.tsx`
- Grid + hunt page size: `job-board-section.tsx`
