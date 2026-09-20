# PawPass — Full Project Summary & Next Steps

*Prepared as a working reference for the team. Covers everything decided so far, and what's left to do before this can be presented as a finished course project.*

---

## 1. The Core Concept

PawPass is a monthly subscription box for dogs and cats in Thailand. Instead of one generic box for every pet, the contents (food, treats, a branded toy, supplements, and a monthly care guide) are chosen based on the pet's actual profile — species, size, coat type, age/life stage, and known health factors — rather than a "one box fits all" approach.

**Elevator pitch:** "PawPass is a subscription box that grows with your pet — literally. Instead of one generic box for all dogs, our rule-based matching system changes what's inside based on your pet's size, coat type, and health risks, so a Labrador puppy and a senior Chihuahua never get the same box."

*(Note: call this "rule-based profile matching," not "algorithm" — it's a size × coat matrix, and naming it accurately reads as sober engineering judgment instead of overselling.)*

**Important disclaimer to state prominently, not bury:** weight and vaccine guidance shown in the app is informational only, not veterinary diagnosis — a real launch would need a vet to sign off on the underlying rules, especially since Premium promises an actual vet check-in.

---

## 2. Competitive Positioning

- **The Farmer's Dog / Nom Nom / Ollie** — personalize *food only* by breed/weight/activity. Strong precedent that personalization works, but they stop at food.
- **Pupbox (Petco)** — personalizes by age/stage, but only covers puppyhood.
- **BarkBox / KitNipBox** — curated boxes, but by theme/size, not real health/profile data.
- **The gap PawPass fills:** the only box spanning a pet's *entire life* across *multiple product categories*, driven by profile-specific logic.
- **Local check:** no direct Thai competitor found doing profile-based subscription boxes specifically (TailyBuddy/Pet Lovers Centre are general online shops, not personalization-driven subscriptions) — the market-gap claim survives a basic check.

---

## 3. The Working Prototype (built)

A live, clickable web demo was published (permanent, shareable link). Currently includes: species toggle with quick-switch, avatar picker, profile form (name/breed/DOB/weight), vaccine history inputs, and a recommendations screen (weight-status gauge, vaccine due/overdue flags, breed insight) — all on sample rule-based logic, no backend needed.

**Still to build (agreed, pending implementation):**
- Multi-pet support; adoption-date + spay/neuter toggles with ⓘ info icons
- Expanded recommendation engine (dental, exercise, obesity-risk, growth chart)
- The "find your fit" size × coat quiz
- Subscription/pricing screen (Starter/Core/Premium) with skip-list, swap-token, secret item, and taste-memory features
- Post-order feedback flow (portion size + "did your pet like it")

---

## 4. Solving the "Too Much Breed Data" Problem

**Fix:** match by **physical profile**, not breed name — Size (Small/Medium/Large by weight) × Coat type (Short-hair/Long-hair/Hairless) = a manageable 3×3 grid. Breed name is a bonus care-tip layer only, never the pricing/packing engine. Anything off the curated list falls back to its size/coat profile automatically.

**Tier-1 breeds (full custom care-tip data), Thailand-specific:**
- **Dogs:** Poodle (Toy/Mini), Thai Bangkaew, Shih Tzu, Pomeranian, Chihuahua, Golden Retriever, Labrador Retriever, Siberian Husky, French Bulldog, Pug, Beagle, Thai Ridgeback, Corgi, Shiba Inu, Mixed-breed ("หมาบ้าน")
- **Cats:** Siamese/Wichien Maat, Korat/Si-Sawat, Scottish Fold, British Shorthair, Persian, American Shorthair, Exotic Shorthair, Ragdoll, Munchkin, Sphynx (hairless), Maine Coon, Domestic Shorthair ("แมวบ้าน")

---

## 5. Subscription Model (updated)

**Structure:** 3 tiers — Starter / Core / Premium. All tiers stay **personalized by size/coat profile — nothing is a fixed, one-size-fits-all box**, including Starter (locking Starter's contents was considered and rejected — it would contradict the personalization standpoint).

**Customization mechanics:** skip list (swap disliked items for a same-category alternative) + swap token (1-2 per box). No separate discount system.

**Starter tier — revised to stay personalized AND profitable:**
Real food + treat + a sample-size supplement, portioned smaller than Core, priced by size like Core (not one flat number). No toy at this tier — that keeps the branded toy as a Core+ perk, making Core feel like a real upgrade.

| Profile | Est. cost | Starter price (~15% margin) |
|---|---|---|
| Small | ~170 THB | **~199 THB** |
| Medium | ~230 THB | **~269 THB** |
| Large | ~305 THB | **~349 THB** |

**Core tier pricing (COGS-based, ~35% margin):**

| Profile | Est. cost | Core price |
|---|---|---|
| Small, short-hair | ~295 THB | ~449 THB |
| Medium, short-hair | ~395 THB | ~599 THB |
| Large, short-hair | ~515 THB | ~799 THB |
| + Long-hair/hairless add-on | +50 THB cost | +79 THB |

**Premium tier:** Core price of that size + ~250-350 THB for a vet check-in call and one exclusive item — a real added cost, not just a markup.

**Pricing strategy note (for the pitch):** we considered a loss-leader Starter (deliberately priced below cost to maximize signups) but chose margin-safety instead, since we haven't modeled full customer-acquisition-cost payback. Stating this explicitly signals awareness of the loss-leader playbook without overclaiming a strategy we can't fully back up yet.

**Research inputs behind these numbers:** Thai pet owners spend ~3,400-4,200 THB/month on "family member" level pet care; real Thai retail prices (food pouches ~16-190 THB, treats ~30-90 THB, toys ~50-150 THB, supplements amortized ~100-180 THB/month); shipping (Kerry Express/Flash Express) realistically runs 45-90 THB depending on box size/weight, scaling with pet size like food does.

---

## 6. Retention & Engagement (new — answers the "why stay at month 14" gap)

**The problem identified:** a pet is a puppy/kitten for ~6-12 months, then an adult for 5-8+ years with little profile change — most of a subscriber's tenure is in that low-change period, where "the box grows with your pet" isn't doing much work.

**The answer:**
- **Convenience/replenishment value** — PawPass isn't just personalization, it's not having to think about reordering, portioning, or guessing correctly, which stays valuable even when the pet's profile is stable.
- **Monthly shuffle + quarterly stock rotation** — items rotate month to month so subscribers don't get an identical box twice in a row; every 3 months there's a bigger rotation tied to real inventory strategy (new brands/products enter, underperforming ones cycle out based on feedback data). This is framed as an operational/stock-rotation reason first, novelty second — reads as real business thinking, not a gimmick.
- **Secret/surprise item** — one item per quarter is a genuine mystery pick (within the pet's safe profile), giving even a stable adult pet's owner something to look forward to.
- **Taste memory** — after repeated dislikes on a specific ingredient/brand (from the feedback loop below), the system auto-excludes that category going forward — visibly "gets smarter" about a specific pet, not just its breed average.
- **Seasonal relevance** — Thailand-specific seasonal themes (rainy season flea/tick focus, hot season cooling/hydration) give quarterly rotation a reason beyond randomness.

---

## 7. Feedback Loop & Data-as-Product (new)

**Post-order feedback:** after each box, ask 2-3 quick questions — was the portion too much/right/too little, did the pet like each item. This feeds directly into the skip-list and taste-memory logic automatically.

**Why this matters beyond UX:** it's the answer to "isn't this just a static lookup table forever?" — no, the system corrects itself based on real per-pet feedback, not just breed/size averages. This is arguably a stronger differentiator than the size/coat matrix alone, and worth including explicitly in the "why it's different" section.

**Data-as-product (secondary revenue angle, being pitched):** aggregated, anonymized feedback data becomes a product of its own — trend/insight reports (e.g. "Bangkok medium-dog owners reject fish-based treats at 2x the rate of other cities") sold to pet brand partners. Framing matters: pitch this as "aggregated insights," never as "selling customer data," to avoid an uncomfortable reaction from a real customer's perspective, even though pet preference data is lower-stakes than human health data.

**Pitch-ready line:** *"Every box makes the next one smarter — and in aggregate, that feedback becomes a product of its own: trend insights we can offer back to pet brands."*

---

## 8. Sourcing Strategy (decided: Option A)

**Decision: Curate third-party brands rather than manufacturing our own food or supplements.**
- Pet food/supplement manufacturing or importing in Thailand requires **Department of Livestock Development (DLD)** registration under the Animal Feed Quality Control Act — a real process, non-transferable licenses, real time cost.
- Private-label manufacturing also typically requires a **minimum order quantity (MOQ)** — too much upfront cash for a pre-revenue startup.
- Curating avoids direct product liability on ingested items; matches how real pet subscription boxes (BarkBox, Pupbox) operate.

**Exception: the toy is PawPass's own branded product, made with non-toxic materials.**
- No DLD registration needed (toys aren't "feed") — but this doesn't mean zero regulatory cost: basic safety testing (choking hazards, toxic materials) and possible tooling/mold costs for injection-molded designs still apply. State this honestly rather than implying "no DLD = no cost at all."
- Benefits: better margin than reselling at cost; the item most likely to stay visible/photographed in a customer's home (free marketing); gives PawPass a physical brand identity beyond curating others' brands.

---

## 9. Known Limitations / Things to Be Upfront About

- **Not medical advice** — state this prominently: weight/vaccine guidance is informational, not diagnostic; a real launch needs a vet to sign off on the logic.
- **AI-generated pet images:** requested, but this session has no image-generation tool connected — the prototype uses illustrated avatar icons instead. Worth flagging as a known scope limitation.
- **"Rule-based matching," not "algorithm"** — accurate framing avoids a credibility hit if asked to explain it live.
- **No full CAC/unit-economics model** — acceptable to state as a known next step for a class project, not something to fully build out now.
- **Food spoilage/heat risk in Thai courier logistics** — a real operational risk, worth one acknowledgment sentence, not a full logistics study.
- **Toy safety certification cost** — not zero just because DLD doesn't apply; worth one honest sentence.
- **Regulatory research is general guidance, not legal advice.**

---

## 10. Suggested Next Steps

**To finish the working demo:**
1. Multi-pet profiles + species/avatar quick-switch
2. Adoption-date + spay/neuter toggles with ⓘ info icons
3. Expanded recommendation engine (dental, exercise, obesity-risk, growth chart)
4. "Find your fit" size × coat quiz
5. Starter/Core/Premium subscription screen with skip-list, swap-token, secret item, and taste-memory logic, using the revised pricing tables above
6. Post-order feedback flow (portion + like/dislike per item)

**To strengthen the business case:**
7. One slide/paragraph on retention economics (Section 6) — this was the biggest gap and now has a real answer
8. A simple unit-economics slide (cost → price → margin → rough CAC acknowledgment) — doesn't need to be a full model, just needs to exist
9. Decide how vet partnerships would realistically work for Premium

**Presentation arc suggestion:** (a) the market gap, (b) the profile-based fit solution, (c) a live click-through of the demo, (d) pricing/tier reveal with the Starter-fix story, (e) retention answer, (f) close on sourcing feasibility (Option A + branded toy) — ends on "we thought about real-world execution," not just the idea.

Let me know which of these to tackle first.
