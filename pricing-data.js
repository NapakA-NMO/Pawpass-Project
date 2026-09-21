// PawPass — shared pricing data
//
// Single source of truth for subscription pricing, per pawpass-brief.md
// Section 5. Both the landing page (index.html) and, eventually, the
// interactive customize quiz (Phase 3) read prices from this file — so
// the two never drift out of sync the way hand-typed tables did before.
//
// IMPORTANT: this file ships to the browser on a public page. It holds
// only customer-facing PRICES, never internal cost/COGS or margin
// figures — those stay in pawpass-brief.md for internal planning only,
// since shipping them here would expose margin data in anyone's dev tools.
//
// Known gap: the brief gives Small/Medium/Large as size labels per
// species but only partial weight-band cutoffs (e.g. "Large dog 25kg+",
// "Large cat >6kg"). Full numeric cutoffs for every band aren't in the
// brief yet — needed before a real quiz can classify a pet from a raw
// weight input rather than a pre-picked size label.

export const PAWPASS_PRICING = {
  currency: "THB",

  // Starter: price varies by species + size only — same box shape
  // across coat types at this tier (no long-hair/hairless add-on).
  starter: {
    dog: { small: 249, medium: 329, large: 429 },
    cat: { small: 209, medium: 259, large: 309 },
  },

  // Core: base price is species + size, short-hair baseline. Long-hair
  // or hairless adds a flat surcharge on top, same amount either species.
  core: {
    dog: { small: 549, medium: 719, large: 919 },
    cat: { small: 439, medium: 539, large: 639 },
    longHairHairlessAddOn: 89,
  },

  // Premium: Core price (incl. any coat add-on) + a fixed range for the
  // Quarterly Pet Wellness Review, one exclusive item, and the extra
  // treat + supplement slot. The brief states this as a range, not a
  // single confirmed number — exposed as bounds so callers can decide
  // how to display it (e.g. "+250–350 THB" vs. picking a midpoint).
  premium: {
    addOnMin: 250,
    addOnMax: 350,
  },
};

/** Starter price for a given species ("dog"|"cat") and size ("small"|"medium"|"large"). */
export function getStarterPrice(species, size) {
  return PAWPASS_PRICING.starter[species]?.[size] ?? null;
}

/**
 * Core price for a given species, size, and coat ("short-hair"|"long-hair"|"hairless").
 * Long-hair/hairless adds the flat surcharge on top of the short-hair base.
 */
export function getCorePrice(species, size, coat) {
  const base = PAWPASS_PRICING.core[species]?.[size];
  if (base == null) return null;
  const needsAddOn = coat === "long-hair" || coat === "hairless";
  return needsAddOn ? base + PAWPASS_PRICING.core.longHairHairlessAddOn : base;
}

/** Premium price range ({min, max}) for a given species, size, and coat. */
export function getPremiumPriceRange(species, size, coat) {
  const core = getCorePrice(species, size, coat);
  if (core == null) return null;
  return {
    min: core + PAWPASS_PRICING.premium.addOnMin,
    max: core + PAWPASS_PRICING.premium.addOnMax,
  };
}

/**
 * Overall {min, max} price across every species/size for a tier
 * ("starter"|"core"), short-hair baseline for Core. Used for the
 * landing page's summary ranges (e.g. "~209–429 THB") so they're
 * always derived from the live numbers above, never re-typed by hand.
 */
export function getTierPriceRange(tier) {
  if (tier !== "starter" && tier !== "core") return null;
  const table = PAWPASS_PRICING[tier];
  const all = [...Object.values(table.dog), ...Object.values(table.cat)];
  return { min: Math.min(...all), max: Math.max(...all) };
}

// What each tier actually includes, per pawpass-brief.md Section 5 —
// used by customize.html's results view to show "what's included" for
// the pet's chosen tier specifically. index.html's landing-page pricing
// cards keep their own hand-written bullets (marketing copy tuned for
// that context) rather than reading from this — these numbers (price)
// are the drift risk that matters, not the wording of a features list,
// so this exists to avoid a second quiz-side rewrite of the same facts,
// not to force one canonical sentence everywhere.
export const TIER_FEATURES = {
  starter: [
    'Food, treats, and a sample-size supplement',
    '1 Avoid + 1 Favorite (permanent)',
    'A great way to try PawPass',
  ],
  core: [
    'Full box including a branded toy',
    '2 Avoid + 2 Favorite (permanent)',
    'Long-hair/hairless coat add-on available',
  ],
  premium: [
    'Quarterly Pet Wellness Review',
    '3 Avoid + 3 Favorite (permanent)',
    'Exclusive item + extra treat & supplement slot',
  ],
};
