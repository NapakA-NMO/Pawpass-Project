// PawPass — shared recommendation-engine logic
//
// Expanded recommendation engine (dental risk, exercise tips, obesity
// risk, puppy/kitten growth chart) per pawpass-brief.md Section 3/10,
// built from the spec settled in chat. Kept in its own module, parallel
// to pricing-data.js, so this logic has exactly one home instead of
// being reimplemented per page.
//
// INFORMATIONAL ONLY — nothing here is veterinary diagnosis. See the
// disclaimer shown alongside these results in the UI.
//
// KNOWN ASSUMPTIONS (flagged — pawpass-brief.md doesn't give exact
// numeric cutoffs for life stage or adult weight targets beyond "Large
// dog 25kg+" / "Large cat >6kg", or a growth curve):
//   - Life-stage age cutoffs: puppy/kitten under 12 months. Dog senior
//     threshold varies by size (a commonly cited vet rule of thumb) —
//     small 10yr / medium 8yr / large 7yr. Cat senior 10yr, size-invariant.
//   - Adult ideal-weight midpoints per size band (dog small/medium/large
//     ~7/17/32kg, cat ~3/5/7kg) — consistent with the brief's partial
//     cutoffs (large dog 25kg+, large cat >6kg), but the small/medium
//     bounds and exact midpoints are this module's own estimate.
//   - One generic growth curve (% of adult weight by age in months),
//     applied to both species alike — real curves differ by species and
//     breed; this is a simplified stand-in at the same effort tier as
//     the weight bands above, not real breed-specific data.
//   - Default age-at-adoption of 10 weeks when DOB is unknown and only
//     an adoption date is given (a common shelter-standard weaning/
//     adoption age) — used only to back-calculate an estimated DOB.
//     Doesn't matter for pets adopted as adults since the growth chart
//     only applies to puppies/kittens anyway.
//   - Obesity guidance: first order (no feedback yet) is calculated from
//     the weight norms above. Once real Section-7 feedback exists, it's
//     held indefinitely rather than recalculated if it goes stale after
//     a few cycles — chosen as the simpler of the two options to build
//     for now (no recency/staleness tracking needed). Revisit if stale
//     feedback turns out to matter once the real feedback flow exists.

export const TIER1_BREEDS = {
  dog: [
    'Poodle (Toy/Mini)', 'Thai Bangkaew', 'Shih Tzu', 'Pomeranian', 'Chihuahua',
    'Golden Retriever', 'Labrador Retriever', 'Siberian Husky', 'French Bulldog',
    'Pug', 'Beagle', 'Thai Ridgeback', 'Corgi', 'Shiba Inu', 'Mixed-breed (หมาบ้าน)',
  ],
  cat: [
    'Siamese/Wichien Maat', 'Korat/Si-Sawat', 'Scottish Fold', 'British Shorthair',
    'Persian', 'American Shorthair', 'Exotic Shorthair', 'Ragdoll', 'Munchkin',
    'Sphynx (hairless)', 'Maine Coon', 'Domestic Shorthair (แมวบ้าน)',
  ],
};

// Typical coat per Tier-1 breed — used to pre-fill (not lock) the Coat
// question once a breed is picked; the customer can still change it.
// Demo-quality generalization, not a guarantee for every individual
// animal (e.g. a Scottish Fold *can* be long-haired). "Mixed-breed
// (หมาบ้าน)" is intentionally left unmapped — genuinely variable, no
// suggestion is better than a wrong one there. Its cat counterpart,
// "Domestic Shorthair (แมวบ้าน)", is mapped to short-hair since its own
// name already names the coat.
export const BREED_TYPICAL_COAT = {
  'Poodle (Toy/Mini)': 'long-hair',
  'Thai Bangkaew': 'long-hair',
  'Shih Tzu': 'long-hair',
  'Pomeranian': 'long-hair',
  'Chihuahua': 'short-hair',
  'Golden Retriever': 'long-hair',
  'Labrador Retriever': 'short-hair',
  'Siberian Husky': 'short-hair', // dense double coat, but not "long" in the grooming/shedding sense this app's 3-way split is built around
  'French Bulldog': 'short-hair',
  'Pug': 'short-hair',
  'Beagle': 'short-hair',
  'Thai Ridgeback': 'short-hair',
  'Corgi': 'short-hair',
  'Shiba Inu': 'short-hair',
  'Siamese/Wichien Maat': 'short-hair',
  'Korat/Si-Sawat': 'short-hair',
  'Scottish Fold': 'short-hair',
  'British Shorthair': 'short-hair',
  'Persian': 'long-hair',
  'American Shorthair': 'short-hair',
  'Exotic Shorthair': 'short-hair',
  'Ragdoll': 'long-hair',
  'Munchkin': 'short-hair',
  'Sphynx (hairless)': 'hairless',
  'Maine Coon': 'long-hair',
  'Domestic Shorthair (แมวบ้าน)': 'short-hair',
  // 'Mixed-breed (หมาบ้าน)' intentionally omitted — genuinely variable.
};

// Weight-range descriptions shown on the quiz's Size question, once
// species is known. Consistent with (but not derived from, to avoid
// touching working obesity/growth math) the ADULT_WEIGHT_KG midpoints
// below — small/medium bounds and the large cutoff match the brief's
// partial cutoffs (large dog 25kg+, large cat >6kg); everything else
// here is this module's own estimate, same as ADULT_WEIGHT_KG.
export const SIZE_WEIGHT_BOUNDS_KG = {
  dog: { small: 'up to ~10kg', medium: '~10–25kg', large: '25kg+' },
  cat: { small: 'up to ~4kg', medium: '~4–6kg', large: '6kg+' },
};

const ASSUMED_AGE_AT_ADOPTION_WEEKS = 10;
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const AVG_DAYS_PER_MONTH = 30.4375;

/**
 * Estimated age in months. DOB is primary; if unknown, adoption date is
 * used as a proxy, assuming the pet was ASSUMED_AGE_AT_ADOPTION_WEEKS
 * old at adoption. Returns { ageMonths, source: 'dob'|'adoption-proxy' },
 * or null if neither date is known.
 */
export function getAgeMonths(dob, adoptionDate, today = new Date()) {
  let birthDate = null;
  let source = null;
  if (dob) {
    birthDate = new Date(dob);
    source = 'dob';
  } else if (adoptionDate) {
    const adopted = new Date(adoptionDate);
    birthDate = new Date(adopted.getTime() - ASSUMED_AGE_AT_ADOPTION_WEEKS * 7 * MS_PER_DAY);
    source = 'adoption-proxy';
  }
  if (!birthDate || Number.isNaN(birthDate.getTime())) return null;
  const ageMonths = (today.getTime() - birthDate.getTime()) / (MS_PER_DAY * AVG_DAYS_PER_MONTH);
  return { ageMonths: Math.max(0, ageMonths), source };
}

const SENIOR_AGE_MONTHS = {
  dog: { small: 120, medium: 96, large: 84 }, // ~10 / 8 / 7 years
  cat: { small: 120, medium: 120, large: 120 }, // ~10 years, size-invariant
};
const YOUNG_CUTOFF_MONTHS = 12;

/** 'puppy'|'kitten'|'adult'|'senior', or null if age is unknown. */
export function getLifeStage(species, size, ageMonths) {
  if (ageMonths == null) return null;
  if (ageMonths < YOUNG_CUTOFF_MONTHS) return species === 'cat' ? 'kitten' : 'puppy';
  const seniorCutoff = SENIOR_AGE_MONTHS[species]?.[size] ?? 120;
  return ageMonths >= seniorCutoff ? 'senior' : 'adult';
}

/** Dental risk trigger: senior life stage (any species) OR small-size dogs. */
export function getDentalRisk(species, size, lifeStage) {
  return lifeStage === 'senior' || (species === 'dog' && size === 'small');
}

export const DENTAL_RECOMMENDATION = {
  treat: 'Dental chew — added to the Treats slot',
  supplement: 'Dental support (chews or water additive) — added to the Supplements slot',
};

const BASELINE_EXERCISE_TIPS = {
  dog: {
    puppy: 'Puppies need frequent, short bursts of play rather than long runs — avoid hard surfaces or forced exercise until growth plates close, but plenty of short walks and supervised play support healthy development.',
    adult: "Aim for at least 30–60 minutes of daily activity, split across walks and play, adjusted to your dog's size and energy level.",
    senior: 'Keep activity regular but gentler — shorter, more frequent walks help maintain mobility and weight without overstressing aging joints.',
  },
  cat: {
    kitten: 'Kittens are naturally very active — short, frequent play sessions with toys they can chase and pounce on support healthy development.',
    adult: 'A few short interactive play sessions most days keeps an adult cat physically and mentally engaged, even indoors.',
    senior: 'Gentler, shorter play sessions help maintain mobility — watch for signs of stiffness and adjust intensity accordingly.',
  },
};

// Tier-1 breed exercise "flavor" copy — demo-quality, not vet-reviewed.
// Intentionally not split by life stage the way the baseline tips are
// (would need ~3x the copy for full parity) — breed only upgrades the
// baseline tip, it never gates whether a tip is shown at all.
const BREED_EXERCISE_TIPS = {
  'Poodle (Toy/Mini)': 'Poodles are sharp and food-motivated — mix physical walks with puzzle toys or trick training to satisfy their intelligence, not just their legs.',
  'Thai Bangkaew': 'A naturally alert, active spitz-type breed — benefits from secure yard time or long leash walks to patrol, on top of daily walks.',
  'Shih Tzu': 'Short-nosed and lower-endurance — favor short, cool walks over intense exercise, especially in Bangkok heat.',
  'Pomeranian': 'Small but spirited — short bursts of play plus a couple of daily walks usually cover it; watch for overexertion in heat.',
  'Chihuahua': "Tiny but energetic — a couple of short walks plus indoor play cover most needs; protect paws from hot pavement.",
  'Golden Retriever': 'A retrieving breed at heart — fetch, swimming, and 45–60 min of daily activity help prevent boredom-driven chewing.',
  'Labrador Retriever': 'High energy and prone to weight gain — consistent daily exercise (45+ min) matters as much for weight management as for happiness.',
  'Siberian Husky': 'A high-drive working breed — needs 45–60+ min of vigorous daily exercise; under-exercised Huskies often turn destructive.',
  'French Bulldog': 'Brachycephalic and prone to overheating — short, low-intensity walks in cooler hours, never intense exercise in midday heat.',
  'Pug': 'Also brachycephalic — gentle, short walks and close heat monitoring matter more than distance or intensity.',
  'Beagle': 'A scent hound with real stamina — daily walks with plenty of sniffing time satisfy them more than fast-paced exercise alone.',
  'Thai Ridgeback': 'An athletic, independent breed — benefits from vigorous daily exercise plus mental stimulation to stay content.',
  'Corgi': 'Long-backed and short-legged — regular moderate exercise helps manage weight, but avoid excessive jumping to protect their spine.',
  'Shiba Inu': 'Independent and prey-driven — secure-area exercise and consistent daily walks suit them better than off-leash freedom.',
  'Mixed-breed (หมาบ้าน)': "With mixed heritage, exercise needs vary — use your dog's size and energy level as your guide, adjusting up or down from there.",
  'Siamese/Wichien Maat': 'Vocal and highly active for a cat — interactive play (wand toys, chase games) most days helps satisfy their need for stimulation.',
  'Korat/Si-Sawat': 'An alert, people-oriented breed — short daily play sessions keep them engaged and prevent boredom.',
  'Scottish Fold': 'Prone to joint sensitivity — favor gentler play (low jumps, soft toys) over high-impact climbing and jumping.',
  'British Shorthair': "A calmer breed prone to weight gain — regular short play sessions matter even though they won't ask for them.",
  'Persian': 'Low-energy and heat-sensitive due to their flat face — brief, gentle play in a cool room suits them better than vigorous exercise.',
  'American Shorthair': 'A moderately active, food-motivated breed — a few short daily play sessions help keep weight in check.',
  'Exotic Shorthair': 'Similar heat/face-shape sensitivity to Persians — keep play sessions brief, gentle, and in a cool space.',
  'Ragdoll': "Docile and floor-loving — gentle interactive play encourages movement in a breed that won't naturally seek it out.",
  'Munchkin': "Short legs don't mean low energy — they can play enthusiastically, just avoid high jumps that strain their back.",
  'Sphynx (hairless)': 'High-energy and heat-sensitive without a coat to regulate temperature — active indoor play, away from direct sun or drafts.',
  'Maine Coon': 'A large, athletic breed — benefits from more vigorous and prolonged play than the average cat to stay fit.',
  'Domestic Shorthair (แมวบ้าน)': "Exercise needs vary widely — use your cat's energy level and weight as your guide for how much daily play to offer.",
};

/**
 * Exercise tip: universal baseline by species + life stage, upgraded to
 * breed-specific copy if the pet's breed is in the Tier-1 list. Breed
 * only ever upgrades the tip — an unset/non-Tier-1 breed still gets the
 * baseline tip, never nothing.
 */
export function getExerciseTip(species, lifeStage, breed) {
  if (breed && BREED_EXERCISE_TIPS[breed]) {
    return { text: BREED_EXERCISE_TIPS[breed], source: 'breed' };
  }
  const baseline = BASELINE_EXERCISE_TIPS[species]?.[lifeStage];
  return baseline ? { text: baseline, source: 'baseline' } : null;
}

// Assumed adult ideal-weight midpoints (kg) per species + size band —
// see file header for how these relate to the brief's partial cutoffs.
export const ADULT_WEIGHT_KG = {
  dog: { small: 7, medium: 17, large: 32 },
  cat: { small: 3, medium: 5, large: 7 },
};

/**
 * Obesity/weight guidance for adult/senior pets — null for puppy/kitten
 * (use getGrowthGuidance instead) or if life stage is unknown.
 *
 * First order (no portion feedback yet): calculated from weight norms
 * vs. actual weight. Once real feedback exists, the latest portion
 * entry overrides the calculation and is held indefinitely (see file
 * header for the stale-feedback simplification this chose).
 *
 * feedbackHistory holds mixed entry shapes (portion entries from
 * post-order feedback, and category/liked entries for taste memory —
 * see catalog-data.js's getTasteMemoryExclusions) in one array, so this
 * searches backward for the most recent entry that actually has a
 * `portion` field, rather than assuming the array's last element is one.
 */
export function getObesityGuidance(species, size, lifeStage, weightKg, feedbackHistory = []) {
  if (lifeStage !== 'adult' && lifeStage !== 'senior') return null;

  const latestFeedback = [...feedbackHistory].reverse().find((entry) => entry && entry.portion);
  if (latestFeedback) {
    const copy = {
      'too much': 'Recent feedback says portions have been too much — this box adjusts portion size down.',
      right: 'Recent feedback says portions have been right — holding steady.',
      'too little': 'Recent feedback says portions have been too little — this box adjusts portion size up.',
    };
    const text = copy[latestFeedback.portion];
    return text ? { text, source: 'feedback' } : null;
  }

  if (weightKg == null || Number.isNaN(weightKg)) return null;
  const ideal = ADULT_WEIGHT_KG[species]?.[size];
  if (!ideal) return null;
  const diffPct = (weightKg - ideal) / ideal;
  let text;
  if (diffPct > 0.25) text = `At ${weightKg}kg, that's notably above the ${size} ${species} range (~${ideal}kg) — worth discussing portion size with a vet.`;
  else if (diffPct > 0.10) text = `At ${weightKg}kg, that's a bit above the ${size} ${species} range (~${ideal}kg) — worth keeping an eye on portions.`;
  else if (diffPct < -0.10) text = `At ${weightKg}kg, that's a bit below the ${size} ${species} range (~${ideal}kg) — worth keeping an eye on.`;
  else text = `At ${weightKg}kg, that's within a healthy range for a ${size} ${species} (~${ideal}kg).`;
  return { text, source: 'calculated' };
}

// Generic growth curve: % of adult weight expected at a given age in
// months. Not breed-specific — see file header. Applied to both species.
const GROWTH_CURVE = [
  { months: 2, pct: 0.25 },
  { months: 4, pct: 0.50 },
  { months: 6, pct: 0.70 },
  { months: 9, pct: 0.85 },
  { months: 12, pct: 0.97 },
];

function interpolateGrowthPct(ageMonths) {
  if (ageMonths <= GROWTH_CURVE[0].months) return GROWTH_CURVE[0].pct;
  for (let i = 1; i < GROWTH_CURVE.length; i++) {
    if (ageMonths <= GROWTH_CURVE[i].months) {
      const a = GROWTH_CURVE[i - 1];
      const b = GROWTH_CURVE[i];
      const t = (ageMonths - a.months) / (b.months - a.months);
      return a.pct + t * (b.pct - a.pct);
    }
  }
  return GROWTH_CURVE[GROWTH_CURVE.length - 1].pct;
}

/**
 * Growth-chart guidance — puppy/kitten life stage only. Estimates
 * expected weight at the pet's current age from the generic growth
 * curve × size-band adult weight, and compares to actual weight if given.
 */
export function getGrowthGuidance(species, size, lifeStage, ageMonths, weightKg) {
  if (lifeStage !== 'puppy' && lifeStage !== 'kitten') return null;
  const adultWeight = ADULT_WEIGHT_KG[species]?.[size];
  if (!adultWeight || ageMonths == null) return null;

  const expectedPct = interpolateGrowthPct(ageMonths);
  const expectedKg = Math.round(adultWeight * expectedPct * 10) / 10;
  const roundedAge = Math.round(ageMonths);

  if (weightKg == null || Number.isNaN(weightKg)) {
    return {
      text: `At roughly ${roundedAge} month${roundedAge === 1 ? '' : 's'} old, a ${size} ${species} is typically around ${expectedKg}kg (~${Math.round(expectedPct * 100)}% of adult weight).`,
      source: 'calculated',
    };
  }
  const diffPct = (weightKg - expectedKg) / expectedKg;
  let text;
  if (Math.abs(diffPct) <= 0.15) {
    text = `At ${weightKg}kg and ~${roundedAge} months, growth looks roughly on track for a ${size} ${species} (~${expectedKg}kg expected).`;
  } else if (diffPct > 0.15) {
    text = `At ${weightKg}kg and ~${roundedAge} months, that's a bit ahead of the typical ${expectedKg}kg for a ${size} ${species} — usually not a concern on its own, but worth mentioning at a vet visit.`;
  } else {
    text = `At ${weightKg}kg and ~${roundedAge} months, that's a bit behind the typical ${expectedKg}kg for a ${size} ${species} — usually not a concern on its own, but worth mentioning at a vet visit.`;
  }
  return { text, source: 'calculated' };
}
