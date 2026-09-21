# PawPass

A monthly subscription box for dogs and cats in Thailand, personalized by
each pet's species, size, coat, breed, and life stage — instead of one
generic box for every pet. Class project prototype: a static landing page
plus a live, interactive "find your fit" quiz.

## Pages

| Page | What it is |
|---|---|
| [`index.html`](index.html) | Landing page — elevator pitch, how the size × coat matching works, and the Starter/Core/Premium pricing table. |
| [`customize.html`](customize.html) | The interactive quiz: a stepped, one-question-at-a-time flow that builds a pet's profile, then reveals live pricing, care recommendations, a Secret Item preview, Taste Memory, and a simulated post-order feedback flow. Supports multiple pets. |

## Running it locally

Both pages use ES module imports (`<script type="module">`), which
browsers block when opened directly as a `file://` path. Serve the folder
over HTTP instead:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html` (or `customize.html`).

## Project structure

```
index.html                 Landing page
customize.html              Interactive quiz
styles.css                  Shared styles (beige/rounded-card look) used by both pages
pricing-data.js              Single source of truth for subscription pricing
recommendations-data.js      Dental/exercise/obesity/growth-chart recommendation logic
catalog-data.js              Minimal item catalog — Secret Item preview + Taste Memory exclusion logic
pawpass-brief.md              Full project brief: concept, positioning, pricing rationale, retention/feedback design, sourcing, known gaps
PawPass_Project_Summary.md   Earlier project summary draft, kept for reference
```

**Design principle throughout:** shared logic (pricing, recommendations,
catalog) lives in exactly one JS module, imported by whichever page needs
it — not duplicated per page. This is deliberate: two independently
maintained copies of the same numbers drift apart the first time either
one is updated.

## Known limitations (by design, for now)

- **No real photography** — the pet/box photo is either a species emoji
  placeholder or a photo you upload yourself in the quiz; there's no
  AI-generated or professionally shot product imagery yet.
- **No backend** — pricing, recommendations, and the "secret item" are all
  computed client-side from the JS modules above. The post-order feedback
  flow is simulated in the quiz itself (there's no real order/checkout
  system to trigger it from).
- **Minimal placeholder catalog** — `catalog-data.js` has a small,
  intentionally scoped item list (2–3 items per category per species),
  not a real product catalog.
- Everything price/recommendation/dental/exercise/weight-related is
  **informational only, not veterinary or financial advice** — see the
  disclaimer on both pages.

See `pawpass-brief.md` Section 9 for the fuller list of known gaps and
regulatory considerations (PDPA, DLD registration, etc.).
