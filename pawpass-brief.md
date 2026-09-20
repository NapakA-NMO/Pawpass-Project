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
- **Local check (re-verified):** as of this research, still no direct Thai competitor found doing profile-based subscription boxes specifically (TailyBuddy/Pet Lovers Centre are general online shops, not personalization-driven subscriptions; global lists of top pet subscription boxes — BarkBox, Cratejoy, etc. — show no Thailand-specific personalized player). Framed deliberately as a point-in-time search result, not a permanent claim — the market-gap story survives a second look, but this should be re-checked again before any real launch decision.

---

## 3. The Working Prototype (built)

A live, clickable web demo was published (permanent, shareable link). Currently includes: species toggle with quick-switch, avatar picker, profile form (name/breed/DOB/weight), vaccine history inputs, and a recommendations screen (weight-status gauge, vaccine due/overdue flags, breed insight) — all on sample rule-based logic, no backend needed.

**Still to build (agreed, pending implementation):**
- Multi-pet support; adoption-date + spay/neuter toggles with ⓘ info icons
- Expanded recommendation engine (dental, exercise, obesity-risk, growth chart)
- The "find your fit" size × coat quiz
- Subscription/pricing screen (Starter/Core/Premium) with "Pick Two" (Favorite + Avoid), secret item, and taste-memory features
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

**Customization mechanics — "Pick Two" (replaces the old skip-list + swap-token duo):** one permanent **Avoid** and one permanent **Favorite**, both set by the customer and active until changed — not a limited-use token that runs out each month. Avoid means that ingredient/brand/category never ships again; Favorite means that flavor/category ships every time it's relevant, guaranteed. Both are scoped at the *category* level (e.g. "always chicken-flavor in the food slot," not "always this exact bag").

**Margin protection (fixes a gap we caught on review):** the Favorite guarantee is scoped to **standard-tier items only** — if a customer's favorite happens to be a premium/grain-conscious option that normally only rotates in occasionally (Section 12), the guarantee locks in the nearest standard-tier equivalent instead of the pricier item every month. This keeps Pick Two a genuinely same-cost swap rather than a hidden, unbounded cost increase — stated here as a deliberate design constraint, not an oversight.

**Tier scaling — revised so it doesn't swallow the whole box:** **Starter = 1 Avoid + 1 Favorite, Core = 2 Avoid + 2 Favorite, Premium = 3 Avoid + 3 Favorite.** On review, 3+3 against a ~4-category box would lock almost everything and defeat the shuffle's point at the tier that should feel the most special — so **Premium's box is expanded** to give that room: vet check-in call, one exclusive item, a second treat slot, and a second supplement slot (Section 5 pricing below folds this into the existing Premium add-on range). That gives Premium ~6-7 categories, so 3 Avoid + 3 Favorite still leaves genuine rotation room.

**Why Pick Two doesn't turn into unlimited warehouse SKUs:** the catalog isn't fixed — new items are added to the rotation every month, and items with a low aggregate favorite-rate (from the feedback loop, Section 7) are the ones retired first, rather than PawPass trying to indefinitely stock every individual customer's exact pick forever. If a customer's specific Favorite is ever retired, they'd get a "closest match" prompt — a real detail a launch would need to design properly, flagged here rather than hidden.

Taste memory (Section 6) is the automatic complement to Pick Two — it keeps learning and quietly filtering out other dislikes from ongoing feedback, so the customer never has to manage more than their two manual picks. No separate discount system.

**Fulfillment labor — now explicitly costed, and higher than a naive estimate (correction from an earlier version of this plan):** because almost every PawPass box is a different combination (species/size/coat profile × Pick Two × monthly shuffle), packing can't be automated the way a single fixed SKU box can — it requires a person, guided by a barcode/scan system, to pull and verify the right combination of items per box. That's real, non-trivial labor, not a rounding error folded into a generic "packaging buffer" — the cost tables below now include it directly: **+15 THB/box (Starter), +25 THB/box (Core)**, based on Thai minimum wage (~50 THB/hour, Bangkok) and an estimated 2-3 minutes of barcode-assisted pick-and-pack time per box.

**Starter tier — reclassified as an Acquisition/Trial Funnel, not a margin driver (correction from an earlier version of this plan):** ~18% margin leaves no room for error — one failed delivery, one address typo, one damaged-in-transit box, and that customer is negative for the month. Rather than pretending Starter needs to carry its own weight, we're stating plainly that its job is converting first-time buyers, not generating profit. Real food + treat + a sample-size supplement, portioned smaller than Core, priced by size like Core (not one flat number). No toy at this tier — that keeps the branded toy as a Core+ perk, making Core feel like a real upgrade, and gives Starter subscribers something concrete to upgrade toward. **Working target: convert >40% of Starter subscribers to Core within 90 days**, driven by the unboxing/onboarding flow — stated as an assumed target to design toward, not a measured or researched figure (same honest framing as the churn-rate assumption below).

**Pricing is species-specific, not just size-label-specific — this is the point we almost missed:** "Small/Medium/Large" is a shared label, but the underlying weight bands are completely different per species (see Section 4), so the same label should never cost the same across species. A Large dog (25kg+) eats far more than a Large cat (>6kg), and that gap has to show up in the price, not just the size chart.

**Prices are set net of two real, unavoidable deductions, not just COGS — this is the second correction we made.** Every transaction loses money to two things before it's ever "margin": a payment gateway fee (Thai processors like Omise run ~3.65% on cards, ~1.65% on PromptPay QR — call it ~3% blended) and 7% VAT, which becomes mandatory once annual revenue passes 1.8M THB (a threshold this business would cross quickly even at a few hundred subscribers). Combined, roughly 9.5% of every sticker price never reaches the business. The prices below are set so the margin percentages quoted are what's left *after* that, not before — the numbers a professor would actually want to see.

| Profile | Est. cost (incl. +15 THB fulfillment labor) | Starter price (~18% margin, after VAT + payment fee) |
|---|---|---|
| Dog — Small | ~185 THB | **~249 THB** |
| Dog — Medium | ~245 THB | **~329 THB** |
| Dog — Large | ~320 THB | **~429 THB** |
| Cat — Small | ~155 THB | **~209 THB** |
| Cat — Medium | ~190 THB | **~259 THB** |
| Cat — Large | ~230 THB | **~309 THB** |

**Core tier pricing (COGS-based, ~35% margin after VAT + payment fee), also species-specific:**

| Profile | Est. cost (incl. +25 THB fulfillment labor) | Core price |
|---|---|---|
| Dog — Small, short-hair | ~320 THB | ~549 THB |
| Dog — Medium, short-hair | ~420 THB | ~719 THB |
| Dog — Large, short-hair | ~540 THB | ~919 THB |
| Cat — Small, short-hair | ~255 THB | ~439 THB |
| Cat — Medium, short-hair | ~315 THB | ~539 THB |
| Cat — Large, short-hair | ~375 THB | ~639 THB |
| + Long-hair/hairless add-on (either species) | +50 THB cost | +89 THB |

**Premium tier:** Core price of that species/size + ~250-350 THB, which now covers a **Quarterly Pet Wellness Review** (renamed from "vet check-in call" — see below), one exclusive item, **and** the second treat + second supplement slot added to give Pick Two room to breathe (see above) — a real added cost across more items, not just a markup on the same box.

**"Vet check-in" rebranded to reduce regulatory and cost exposure (correction from an earlier version of this plan):** a direct hourly vet retainer creates two problems — it risks brushing against Thai veterinary-practice boundaries around diagnosis/teleconsultation (real Thai telemedicine providers like Thonglor Pet Hospital explicitly frame their remote service as "not a formal diagnosis," precisely because a proper diagnosis needs a physical exam), and a real vet's hourly time would likely blow past the 250-350 THB add-on budget entirely. Fix: rename the touchpoint **"Quarterly Pet Wellness Review"** and frame it strictly around non-diagnostic lifestyle, diet, and enrichment advice — never treatment or prescription. Structurally, this is delivered as an **affiliate voucher** redeemed through an established Thai pet telemedicine platform (candidates: **AnyVet**, **Thonglor Pet's telemedicine service** — named for credibility, not a confirmed partnership, same treatment as the Section 8 sourcing candidates) rather than PawPass employing or retaining a vet directly. This keeps PawPass out of the business of practicing veterinary medicine and turns an open-ended cost into a fixed voucher price we can actually budget.

**Pricing strategy note (for the pitch):** we considered a loss-leader Starter (deliberately priced below cost to maximize signups) but chose margin-safety instead, since we haven't modeled full customer-acquisition-cost payback. Stating this explicitly signals awareness of the loss-leader playbook without overclaiming a strategy we can't fully back up yet.

**Research inputs behind these numbers:** Thai pet owners spend ~3,400-4,200 THB/month on "family member" level pet care; real Thai retail prices (food pouches ~16-190 THB, treats ~30-90 THB, toys ~50-150 THB, supplements amortized ~100-180 THB/month); shipping (Kerry Express/Flash Express) realistically runs 45-90 THB depending on box size/weight, scaling with pet size like food does; payment gateway fees ~1.65-3.65% depending on method (Omise, a real Thai processor); VAT 7% once revenue passes the 1.8M THB/year registration threshold.

**Still not priced in (known simplification, same honest treatment as the rest of Section 9):** packaging materials (box, filler, branded insert) beyond what's folded into shipping, failed-delivery/redelivery courier fees, customer support labor, and basic SaaS/checkout platform costs. Fulfillment/picking labor itself **is** now priced in (above) — that gap is resolved. None of the remaining ones are large enough individually to break Core's margin, but Starter's ~18% margin is thin enough that one of them showing up in a real launch would matter — worth saying so if asked.

---

## 6. Retention & Engagement (new — answers the "why stay at month 14" gap)

**The problem identified:** a pet is a puppy/kitten for ~6-12 months, then an adult for 5-8+ years with little profile change — most of a subscriber's tenure is in that low-change period, where "the box grows with your pet" isn't doing much work.

**The answer:**
- **Convenience/replenishment value** — PawPass isn't just personalization, it's not having to think about reordering, portioning, or guessing correctly, which stays valuable even when the pet's profile is stable.
- **Monthly shuffle + quarterly stock rotation** — the catalog isn't a fixed shelf that gets reshuffled; new items are added to it every month, and the lowest-favorited items (by aggregate feedback data) are the ones retired first. Subscribers don't get an identical box twice in a row (except the guaranteed Favorite slot — see below); every 3 months there's a bigger rotation tied to real inventory strategy. This is framed as an operational/stock-rotation reason first, novelty second — reads as real business thinking, not a gimmick.
- **"Pick Two" — one guaranteed Favorite, one guaranteed Avoid** (Section 5) — a permanent, customer-set preference, not a limited-use token. Gives the shuffle an anchor: everything else rotates, but the Favorite category never does and the Avoid category never appears. Because the catalog grows and self-prunes by aggregate performance rather than staying fixed, PawPass isn't committing to hold infinite stock of every individual customer's exact pick forever — the rare edge case (a Favorite item gets retired) gets a "closest match" prompt rather than silently breaking the guarantee.
- **Secret/surprise item** — one item per quarter is a genuine mystery pick (within the pet's safe profile), giving even a stable adult pet's owner something to look forward to.
- **Taste memory** — the automatic complement to "Pick Two": after repeated dislikes on a specific ingredient/brand from ongoing feedback (Section 7), the system quietly excludes that category too, without the customer having to spend one of their manual picks on it — visibly "gets smarter" about a specific pet, not just its breed average.
- **Seasonal relevance** — Thailand-specific seasonal themes (rainy season flea/tick focus, hot season cooling/hydration) give quarterly rotation a reason beyond randomness.

**Assumed churn rate (new — closes a real gap the retention story didn't have a number under):** industry benchmarks split pet subscriptions into two models with very different churn. Replenishment subscriptions (food/treat autoship — closest to PawPass) run **~5-8% monthly churn**, because they fulfill a recurring biological need (the pet eats every day, the bag runs out on a predictable schedule). Pure discovery/curation boxes (closer to BarkBox-style novelty boxes) run **~8-12% monthly churn**, because retention depends on novelty that fades. **PawPass sits between the two** — it's a replenishment product (real food/treats/supplements a pet needs) wrapped in a discovery-box experience (shuffle, secret item, Pick Two) — so a reasonable working assumption is **~7-9% monthly churn**, closer to the replenishment end because the core purchase is consumable necessity, not just novelty. This is a benchmark-based assumption, not a PawPass-specific measured number — worth saying exactly that if asked, same honest framing as the CAC gap.

---

## 7. Feedback Loop & Data-as-Product (new)

**Post-order feedback:** after each box, ask 2-3 quick questions — was the portion too much/right/too little, did the pet like each item. This feeds directly into Pick Two's Avoid suggestion and the taste-memory logic automatically, and rolls up into the catalog's aggregate favorite-rate used to decide which items get retired (Section 6).

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

**Candidate sourcing partners (named for credibility, not confirmed relationships):**
- **Nannaphat Pet Shop Co., Ltd.** and **Pawducts** — real, registered Thai pet wholesale/import businesses, found via research. Concrete examples rather than hypothetical suppliers, though we have not confirmed either would take on a pre-revenue startup account.
- **Pet Lovers Centre Thailand** — a real multi-brand retail chain, included to show awareness of the existing retail ecosystem, not as a margin-viable wholesale source (retail pricing wouldn't leave real margin to resell).
- **B2B directories (HKTDC Sourcing, Thailand Yellow Pages "Pet Supplies Wholesale")** — these are *how* a real startup would find additional vendors, not suppliers themselves; listed as the honest next step, not a finished sourcing decision.

---

## 9. Known Limitations / Things to Be Upfront About

- **Not medical advice** — state this prominently: weight/vaccine guidance is informational, not diagnostic; a real launch needs a vet to sign off on the logic.
- **PDPA gap on the data-as-product idea** — the aggregated insights product (Section 7) would need PDPA-compliant consent language at the point of feedback collection, not just at the aggregation step; Thailand's Personal Data Protection Act (enforced since June 1, 2022) requires explicit consent before/at collection and covers the raw per-pet-owner feedback even though the final, properly de-identified aggregate may fall outside its scope. Not built into this prototype — same treatment as the other regulatory disclaimers in this section.
- **AI-generated pet images:** requested, but this session has no image-generation tool connected — the prototype uses illustrated avatar icons instead. Worth flagging as a known scope limitation.
- **"Rule-based matching," not "algorithm"** — accurate framing avoids a credibility hit if asked to explain it live.
- **No full CAC/unit-economics model** — acceptable to state as a known next step for a class project, not something to fully build out now.
- **Food spoilage/heat risk in Thai courier logistics** — a real operational risk, worth one acknowledgment sentence, not a full logistics study.
- **Toy safety certification cost** — not zero just because DLD doesn't apply; worth one honest sentence.
- **Regulatory research is general guidance, not legal advice.** This applies especially to the Wellness Review rebrand above — we haven't found a specific Thai veterinary-practice statute governing teleconsultation boundaries (the search that informed the fix found industry practice — e.g. how Thonglor Pet frames its own service — not a cited law), so "reduces regulatory exposure" is an informed judgment call, not a verified legal conclusion.
- **The AnyVet/Thonglor Pet affiliate voucher is a named candidate, not a confirmed partnership or priced deal** — we don't know their actual wholesale/affiliate rate, so whether a real voucher fits inside the existing 250-350 THB Premium add-on budget is still an assumption, not a negotiated number.
- **The "40% convert to Core within 90 days" target is an assumed design goal, not a researched or modeled figure** — reclassifying Starter as an acquisition funnel is the right instinct, but it doesn't by itself solve the underlying gap: we still don't have a CAC model or a real cohort curve to know whether that 40% (or any number) actually pays back. Same gap as the CAC line above, just given a name and a number to design toward.
- **~~Fulfillment/packing labor isn't separately costed~~ — resolved.** Now priced explicitly in Section 5 (+15 THB Starter, +25 THB Core, barcode-assisted pick-and-pack) rather than absorbed into a vague buffer.
- **Assumed churn rate (~7-9% monthly, Section 6) is a benchmark, not a measured number** — same honest framing as the CAC gap: reasonable industry-standard estimate, not something PawPass has real data for yet.

---

## 10. Suggested Next Steps

**To finish the working demo:**
1. Multi-pet profiles + species/avatar quick-switch
2. Adoption-date + spay/neuter toggles with ⓘ info icons
3. Expanded recommendation engine (dental, exercise, obesity-risk, growth chart)
4. "Find your fit" size × coat quiz
5. Starter/Core/Premium subscription screen with "Pick Two" (Favorite + Avoid), secret item, and taste-memory logic, using the revised pricing tables above
6. Post-order feedback flow (portion + like/dislike per item)

**To strengthen the business case:**
7. One slide/paragraph on retention economics (Section 6) — this was the biggest gap and now has a real answer
8. A simple unit-economics slide (cost → price → margin → rough CAC acknowledgment) — doesn't need to be a full model, just needs to exist
9. Decide how vet partnerships would realistically work for Premium

**Presentation arc suggestion:** (a) the market gap, (b) the profile-based fit solution, (c) a live click-through of the demo, (d) pricing/tier reveal with the Starter-fix story, (e) retention answer, (f) close on sourcing feasibility (Option A + branded toy) — ends on "we thought about real-world execution," not just the idea.

---

## 11. Note for Next Work Session

- Namo is going to review how the current live demo looks/feels before more changes.
- Before properly building the real (final) website, he wants to learn how to use Skills, GitHub, and Claude Code himself — this is a personal-skills goal, separate from the PawPass build itself.
- He wants the **customize section** (species/size/coat/tier picking) to feel genuinely **fun** to use, not just functional — exact meaning of "fun" not yet defined (playful motion? gamified feedback? character reactions? needs follow-up).
- When a user clicks a different size or coat, switching between cat and dog, he wants the box to show **a different picture** (not just re-labeled icons) **and** the price, presented in a **"nice view"** — implies real per-profile imagery (tying into the AI-generated pet/box assets already planned) plus a more considered price-reveal moment than the current flash transition.
- Open questions to resolve with Namo before touching the demo again: what "fun" means concretely for the customize interaction.
- **Resolved:** per-profile imagery should be **photo-style mockups** (realistic product photography look), not flat illustration or abstract icons — a bigger asset-generation lift than icons, but matches the "manufactured product, not giveaway junk" quality bar set in Section 12.

---

## 12. Product Catalog (grid view, by category)

**Design intent:** a grid view, split into separate labeled sections per category (Food / Treats / Supplements / Toy). Visual bar: looks like a real manufactured product line — clean, photo-style, quality packaging — not a giveaway-junk aesthetic, and not overly logo-heavy/branded. Packaging in generated imagery should carry a restrained PawPass mark, not loud competitor branding — see the Design Brief for the exact art direction.

**Food**
- Split by species *and* life stage, since nutritional needs genuinely differ: Dog — puppy (growth formula, higher protein/DHA), adult (maintenance), senior (joint-support, lower-calorie). Cat — kitten (growth), adult (maintenance/indoor formula), senior (leans toward hairball control + gentler-on-kidneys formulation).
- Flavor variety per species: dog rotation includes chicken, beef, and salmon/fish; cat rotation leans chicken, tuna/fish, and salmon — cats are typically fussier about fish-forward flavors than dogs.
- Format: dry kibble as the staple, with a wet-food pouch in rotation for variety (matches the food-cost research already in Section 5).
- Curated across quality tiers rather than one fixed brand — consistent with the Option A sourcing decision (Section 8): an everyday-quality staple plus an occasional premium/grain-conscious option in rotation, the same tiering real Thai pet retailers carry (budget: Pedigree/SmartHeart-level; mid: Royal Canin-level; premium: Orijen/Acana-level) — named here for realism, not as a confirmed supplier list.

**Treats**
- Dog: jerky-style meat treats (a genuinely popular category in Thailand — Jerhigh is a well-known local example), dental chews, and small soft training treats (low-calorie, high-value, sized for repeated use).
- Cat: freeze-dried treats (bonito flakes, freeze-dried chicken — a strong current trend), lickable/creamy treats (also trending), and dental treats sized for a cat's smaller mouth/bite — cat treats are a genuinely different category from dog treats, not just a smaller version.

**Supplements** (specific, not generic "supplements")
- Joint & hip support (glucosamine/chondroitin) — especially relevant for large dogs prone to hip dysplasia.
- Skin & coat (omega-3 fish oil) — especially relevant for long-hair profiles, reduces shedding and dry skin.
- Digestive/probiotic — general gut health, especially useful around a diet/brand rotation.
- Dental (chews or a water additive) — reduces tartar buildup over time.
- Hairball control — cat-specific, especially relevant for long-hair cats.
- General multivitamin — broader senior-life-stage support.
- Each pet's profile determines which 1-2 of these actually ship in a given box (e.g. a long-hair senior cat gets skin/coat + hairball control, not the full list every month) — this is part of what makes the box feel personalized rather than generic.

**Toy**
- Already covered in Section 8 (Sourcing Strategy) — PawPass's own branded, non-toxic toy, sized/durability-matched to the pet's size profile.
