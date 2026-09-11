# Competitor evidence brief

Run `2026-08-08-deepgrid-competitive-evidence`. Feeds the existing 46-slide Shravan deck.
Status: **draft** by design — the story/artifacts/QA stages were deliberately not run.

## BLUF

Four findings change the deck. Two correct errors I introduced, one strengthens the case,
one weakens a stated strength.

1. **The deck flags a mandate-date conflict that does not exist.** Slide 27 says the
   verification "carries two different 2027 dates — pin the exact instrument and date."
   The gazette resolves it: **1 January 2027 (new models)** and **1 October 2027 (all
   models)** are one two-stage timetable under rule 96(12), not a contradiction. Ask #8
   and next-step #10 should be deleted, and the instrument named: **G.S.R. 834(E),
   11 Nov 2025**, amending G.S.R. 184(E) which was only ever a **draft**.

2. **The "~20× the compliance anchor" comparison is cross-scope and overstates the gap
   against DeepGrid's own interest.** It sets a ₹2.50L capital purchase against a device
   sticker price. Against the AIS-140 **three-year total cost of ownership** — ₹22,400
   basic / ₹40,600 standard / ₹62,200 enterprise — the like-for-like ratio is
   **4.0×–11.2×**, not ~20×. The pricing contest is materially less lopsided than the deck
   says, and the correction favours the company.

3. **"2.8–6.5× cheaper than imports" cannot be verified and should be demoted.** No public
   per-unit India price exists for Mobileye EyeQ6, Bosch/Continental, Qualcomm SA8295 or
   Nvidia Orin. bitsensing — the one comparable product with a live India launch — states
   pricing is "agreed case by case". On a loaded-cost basis a prior run put the real
   advantage at **~2.3×**. Slide 44 currently lists the import price gap as one of six
   genuine strengths; it should move to "company claim, not benchmarked".

4. **"India-native" is weaker than the deck implies, and the kill-zone risk is stronger.**
   Two India-present competitors are absent from slide 32 entirely:
   - **bitsensing** (South Korea) launched an aftermarket radar+camera ADAS Kit *targeted
     at India* in Feb 2026, explicitly citing the MoRTH BSIS requirement, with an Indian
     channel MoU (IKIO Technologies) signed in 2025.
   - **ZF WABCO** already ships ADAS as **OE fitment with a leading Indian CV OEM**, holds
     an in-house Indian test track and homologation capability, and its ABS is on roughly
     9 of 10 Indian commercial vehicles.
   - **Netrasemi** is India-native, raised ₹107 Cr, and is building a 12nm edge-AI SoC.

   ZF WABCO in particular converts "incumbent fast-follow" from a projected risk into an
   incumbent that is already in the room with homologation capability DeepGrid lacks.

## The one thing that survives untouched, and it matters

**No vendor in the cohort holds Indian ADAS certification — and AIS-162 itself is still
listed as "Draft" on the MoRTH AIS register.** The deck's central competitive claim —
"the window is the asset here, not the price gap" — is the claim that survived this run
best. It is also the claim that does *not* depend on any price.

That is the argument to lead with. The price gap is unverifiable; the certification window
is real and documented.

## What the pricing evidence actually implies for the commercial thesis

The AIS-140 precedent is the closest domestic analogue and it points somewhere specific:
over three years, **the platform licence can exceed hardware cost by 2–3×**. Value in that
market went to whoever held the recurring compliance relationship, not to whoever sold the
box. Combined with the ~8-year notification-to-enforcement lag on AIS-140, this supports
two things the deck already argues and one it does not:

- supports the transitional-enforcement reading (slide 6)
- supports "price the function, not the bundle" (slide 30)
- **not yet in the deck:** it argues for AD3 (the rented kit) being the strategically right
  commercial model rather than the pricing anomaly slide 31 currently calls it. The ₹0.66
  Cr/yr figure still does not reconcile at ~26× the outright sale — but the *direction*
  (recurring over capital) is what the domestic precedent rewards.

## Contested, not resolved: the FY32 margin basis

A prior run derived **77.2%** as the honest blended FY32 gross margin at a 72% kit margin.
Reproducing it here: 77.2% blended requires **87.2% gross margin on the ₹474.30 Cr of
non-ADAS revenue**.

That is not more defensible than the deck's flat 72% — it simply moves the assumption from
"non-ADAS earns what the kit earns" to "non-ADAS earns 87.2%", and neither is disclosed
anywhere in BP-1A.

**Recommendation: show the range, not a point.** FY32 EBITDA is **₹309 Cr to ₹381 Cr**
depending on non-ADAS margin (72% → 87.2%), with attributable earnings of **₹19.6 Cr to
₹24.2 Cr**. Both ends still sit far below the stated ₹536.63 Cr, so the 120% impossibility
finding on slide 15 is unaffected — only the rebuilt figure widens.

## Retrieval honesty

Six of 27 rows are UNVERIFIED, all of them import unit prices. That was predicted before
the run. The AIS-140 price evidence leans on one telematics vendor's buyer guides, whose
commercial interest points the same way as the finding — it is marked `medium`, should be
attributed on the slide rather than asserted, and corroboration from a non-telematics
source is the highest-value next retrieval.

No buyer voice was collected. Whether any Indian fleet has actually *chosen* certified ADAS
over a compliance box remains unknown — which was the original question behind slide 29 and
is the one thing this run did not answer.
