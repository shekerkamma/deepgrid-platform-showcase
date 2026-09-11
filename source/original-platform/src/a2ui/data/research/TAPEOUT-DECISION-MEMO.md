# Tapeout decision memo — one page, two columns, one decision

**For:** DeepGrid Semi board
**From:** GTM & ICP playbook review (LLM Council verdict, 10 Aug 2026)
**Decision required by:** 24 Aug 2026 (two weeks)
**Status of the 55-slide GTM playbook:** held, not released to sales, pending this decision

---

## Why this memo exists

The GTM playbook's spine is Act 5: *protected PSU revenue funds the tapeout.* Five independent
advisors computed the same arithmetic and none of them could make it work. Until this decision
is closed, the capacity split, the funding sequence, the Tier-1 motion and the framing of the
ASIC are all downstream of an unanswered question — and none of them can be corrected.

**The tapeout is currently treated as a fixed input to the plan. It is the largest open
variable in it.**

---

## Column A — Build our own 28nm die (the current plan)

| Line | Value | Confidence |
|---|---|---|
| Tapeout capex (mask set, IP, EDA, packaging, qualification) | **Rs 20–35 Cr** | Planning-grade estimate. **Not quoted.** |
| Gross margin per kit today (Rs 2.50 L × 45%) | Rs 1.125 L | Management plan figure |
| Kits required to self-fund a Rs 25 Cr tapeout | **~2,200** | Arithmetic |
| Implied run-rate to fund before Q1 2027 tapeout | **~440 kits/month · ~15/day** | Arithmetic, from 10 Aug 2026 |
| Actual delivered revenue to date | **Rs 23.01 L** | Verified — and in Deepgrid **Datacentre**, not Deepgrid Semi, with customer-owned IP, none of it ADAS |
| Implied step-change | **~240×** | Arithmetic |
| Earliest qualified volume silicon | **H1 2028** | After the 1 Oct 2027 all-models deadline |

**What must be true for Column A to work:** either DeepGrid sells and *collects* on ~2,200 kits
in roughly five months on GeM pre-type-approval, or the tapeout is externally financed — in
which case "PSU revenue funds the tapeout" must be struck from the deck and replaced with the
real funding source.

---

## Column B — Source a merchant automotive SoC (never scored)

Candidates: TI TDA4 family · Hailo · Ambarella. **Every figure in this column must be quoted
before the board meets. None of it is currently costed.**

| Question | Why it decides the company | Owner |
|---|---|---|
| Quoted per-unit price at 5k / 20k / 50k volumes | Determines how much of the Rs 63,250 BOM collapse survives without our own die | VP Silicon |
| Does the part already hold AEC-Q100 and ISO 26262 safety documentation? | If yes, it removes the two gates that block line-fit and Tier-1 design-in | VP Silicon |
| Earliest ship date on a merchant part | If 2027, it beats our own silicon by a full year and lands **before** the deadline | Engineering |
| Resulting kit COGS and gross margin | Determines whether we keep a semiconductor margin or become an integrator | CFO |
| Capex avoided | Rs 20–35 Cr, redeployed to certification and field evidence | CFO |
| What we lose | Die ownership, the domestic-silicon story, and long-run cost floor | CEO |

---

## The two branches, stated plainly

**If Column B is viable:** there is no Rs 20–35 Cr hole. Act 5 evaporates. PSU revenue becomes
profit rather than a mortgage payment. Decisions (a) and (c) both need rewriting, and the
company's identity shifts from "we own the die" to "we own India-tuned perception." That is a
smaller story and a much shorter path to certified revenue.

**If Column B is not viable:** the honest ICP for the next twelve months is *a lead investor
plus one NRE-funding Tier-1 partner*. The sales organisation's job for that period is
generating design-in evidence that closes the round — not booking PSU kit revenue. The
playbook must be rewritten around that, and the 50/30/20 split is wrong as drawn.

Both branches change the deck fundamentally. Neither is what the current 55 slides say.

---

## Kill-criteria for the tapeout itself

The playbook contains four hard disqualifiers for customer deals and **zero** for the company's
own Rs 25 Cr bet. That asymmetry is not serious. Adopt these, or write better ones:

1. **Funding.** If committed funding (equity + non-dilutive + Tier-1 NRE) has not reached
   the quoted tapeout cost by the tapeout decision date, do not tape out.
2. **Anchor design-in.** If no Tier-1 or OEM has signed an evaluation agreement naming the
   part before tapeout, the die ships into a market with no committed buyer.
3. **Certification path.** If AEC-Q100 and an ISO 26262 safety plan are not funded and
   scheduled, H1 2028 silicon cannot be line-fitted and the margin case cannot be realised.
4. **Merchant-SoC parity.** If a quoted merchant part reaches a 2027 ship date with
   qualification in hand and within an agreed cost delta of our die, the die is a luxury.

---

## Items to verify before the board meets

These came out of the council as assertions and are **not yet verified**. Three of them
directly affect the answer.

| # | To verify | Why it matters | Owner |
|---|---|---|---|
| 1 | **PPP-MII local-content status.** Does a kit containing a Rs 65,000 AMD Artix-7 die clear the domestic value-add threshold for Class-I local supplier status? | The "foreign silicon is excluded" moat justifies **50% of sales capacity**. If we fail the threshold, the moat is not ours. | Finance + Legal |
| 2 | **Preference vs exclusion.** PPP-MII grants *purchase preference*, not blanket exclusion, outside defence. | The deck says competitors are "structurally excluded." That is likely an overstatement and must be corrected. | Legal |
| 3 | **Who holds AIS-162 type approval** — the vehicle OEM, or the component vendor? | If it attaches to the vehicle, "we lack AIS-162" is a category error and **AEC-Q100 is the real gate**. Changes the whole certification slide. | Regulatory |
| 4 | Quoted tapeout cost from foundry, IP and packaging vendors | Replaces the Rs 20–35 Cr planning estimate | VP Silicon |
| 5 | India Semiconductor Mission / DLI incentive eligibility and amount | Non-dilutive capital that may close the gap | CFO |
| 6 | Tier-1 and certification programme durations | Determines whether the Tier-1 motion is reachable at all | VP Silicon |

---

## The decision

**Tape out, or source?** One page, two columns, one answer. Everything in the GTM playbook —
capacity allocation, the funding sequence, the Tier-1 motion, and what the ASIC actually is —
is downstream of it.

Until it is answered, the playbook stays held.
