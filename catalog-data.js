// PawPass — shared catalog / secret item / taste memory logic
//
// Backs two retention features from pawpass-brief.md Section 6 (closely
// tied to Section 5's Pick Two and Section 7's feedback loop): the
// quarterly Secret/surprise item, and Taste memory. Kept in its own
// module, parallel to pricing-data.js and recommendations-data.js, so
// this logic has exactly one home per the project's established
// single-source-of-truth pattern.
//
// INVENTED CONTENT — flagged, not sourced from the brief: Section 12
// describes the catalog only categorically (species × life-stage ×
// flavor for food; named sub-types for treats/supplements; one toy
// line) with no concrete item/SKU list. CATALOG below is this module's
// own minimal placeholder content (~2 items per category per species),
// scoped deliberately small and proportionate to a demo — confirmed
// with the user rather than assumed.

export const CATALOG = {
  dog: {
    food: ['Chicken & Rice Kibble', 'Salmon Pâté Pouch'],
    treats: ['Chicken Jerky Bites', 'Soft Training Bites'],
    supplements: ['Glucosamine Joint Chews', 'Omega-3 Skin & Coat Oil'],
    toy: ['Durable Rubber Chew Bone', 'Rope Tug Toy'],
  },
  cat: {
    food: ['Chicken & Rice Kibble', 'Tuna Pâté Pouch'],
    treats: ['Freeze-Dried Bonito Flakes', 'Lickable Chicken Treat'],
    supplements: ['Hairball Control Chews', 'Omega-3 Skin & Coat Oil'],
    toy: ['Feather Wand Toy', 'Crinkle Ball'],
  },
};

const CATEGORY_LABEL = { food: 'Food', treats: 'Treats', supplements: 'Supplements', toy: 'Toy' };

// Small deterministic string hash — used instead of Math.random() so a
// given seed always produces the same pick (a pet's secret item doesn't
// drift on every unrelated re-render), while still letting a "try
// another" control get a different result by changing the seed on purpose.
function hashSeed(seed) {
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Secret/surprise item — pawpass-brief.md Section 6: "one item per
 * quarter is a genuine mystery pick (within the pet's safe profile)".
 *
 * Framed here as a static PREVIEW EXAMPLE, not a real quarterly cycle —
 * there's no order/subscription lifecycle in this build to track actual
 * quarters against (confirmed with the user rather than faking one).
 *
 * "Safe profile" = excludes anything matching an Avoid tag (case-
 * insensitive match against the item name, using the tag's first
 * slash-separated term so e.g. "Salmon/Fish" matches "Salmon Pâté
 * Pouch"). Falls back to the unfiltered pool if every item happens to
 * get excluded, so this never returns nothing just because a pet's
 * Avoids are broad.
 */
export function getSecretItemPreview(species, avoids, seed) {
  const speciesCatalog = CATALOG[species];
  if (!speciesCatalog) return null;

  const allItems = Object.entries(speciesCatalog).flatMap(([category, items]) =>
    items.map((name) => ({ category, name }))
  );

  const avoidTerms = [...avoids].map((tag) => tag.split('/')[0].toLowerCase());
  const safeItems = avoidTerms.length
    ? allItems.filter((item) => !avoidTerms.some((term) => item.name.toLowerCase().includes(term)))
    : allItems;

  const pool = safeItems.length ? safeItems : allItems;
  const index = Math.abs(hashSeed(seed)) % pool.length;
  const picked = pool[index];
  return { name: picked.name, category: CATEGORY_LABEL[picked.category] };
}

/**
 * Taste memory — pawpass-brief.md Section 6/7: the automatic complement
 * to Pick Two. After repeated dislikes on a category from ongoing
 * feedback, quietly exclude it too, without spending a manual pick.
 *
 * ARCHITECTURE-ONLY for now (confirmed with the user): feedbackHistory
 * is always empty in this build — the post-order feedback flow that
 * would populate it is a separate, still-queued item — so this always
 * returns [] today. Wired for real so it activates the moment that flow
 * exists, with no changes needed at the call site.
 *
 * Rule: a category with 2+ "disliked" feedback entries in a row (no
 * intervening "liked" entry resetting the streak) is quietly excluded.
 * Expected feedbackHistory entry shape: { category, liked: true|false }.
 */
export function getTasteMemoryExclusions(feedbackHistory = []) {
  const dislikeStreak = {};
  const excluded = new Set();
  feedbackHistory.forEach((entry) => {
    if (!entry || !entry.category) return;
    if (entry.liked === false) {
      dislikeStreak[entry.category] = (dislikeStreak[entry.category] || 0) + 1;
      if (dislikeStreak[entry.category] >= 2) excluded.add(entry.category);
    } else if (entry.liked === true) {
      dislikeStreak[entry.category] = 0;
      excluded.delete(entry.category);
    }
  });
  return [...excluded];
}
