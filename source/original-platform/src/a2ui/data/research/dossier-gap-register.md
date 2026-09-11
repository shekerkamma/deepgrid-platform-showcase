# What the dossier is missing — consolidated gap register

Target: `DeepGrid-India-ADAS-Competitor-Dossier-Story-reviewed.pptx`, 83 slides,
status `reviewed`, delivered 14 Aug 2026.
Assessed: 2026-08-15 against `outputs/evidence-ledger.csv` (54 source-first rows).

Three classes. **A** are defects — things on the slides that are wrong or unsupported.
**B** are absences — required content that was never built. **C** are method faults that
let A and B through.

---

## A · Defects live in the delivered deck

### A1 — The regulation is cited wrongly, and the deck contradicts itself · CRITICAL

Slide 4 says naming **GSR 184e** in client-facing material is "defensible" and that the
"gazette notification itself" is outstanding. Slide 12 says **"Stop any external claim
citing G.S.R.184(E) as final law."** Both are in the same delivered deck.

Slide 12 is right. G.S.R. 184(E) (20 Mar 2025) was only ever a **draft**. The notified
instrument is **G.S.R. 834(E), 11 Nov 2025**, amended by **G.S.R. 862(E)**, gazetted
21 Nov 2025 — and its own preamble names 184(E) as the draft it supersedes
(`EV-REG-02`). The gazette is not outstanding; it has been public for nine months.

**The strings "834" and "862" appear nowhere in the 83 slides.**

Root cause: Round 2's live research took ZF's press note and Aptiv's release — both of
which repeat "GSR 184e" (`EV-ZF-05`) — as corroboration *of the instrument*. Vendors
repeating a draft is not evidence of law. A prior run had already read the gazette text;
that finding was overwritten by a weaker source.

**Fix:** rewrite slide 4's regulatory row; add the instrument, both rule references and
the two-stage timetable; keep slide 12's stop-rule and make it consistent.

### A2 — Starkenn's headline number cannot be stated · HIGH

"2,500+ vehicles" appears on slides 19, 20 and 83 — including the hostile-question slide
("Starkenn shows 2,500+ vehicles. Are we not already behind?").

The single source behind it (YourStory, Nov 2024) contains **three mutually inconsistent
figures in one interview**: "over 2,500 vehicles", "over 700 units sold", and "300+
vehicles have deployed our tech" (`EV-STK-04`). The dossier propagated the largest. It is
self-reported, un-audited and ~21 months old.

Compounding it: Starkenn is a **57-person company, shrinking 15.8% YoY, with $2.0m of
lifetime funding** (`EV-STK-05`) — none of which is in the deck.

**Fix:** remove the number. Argue Starkenn from its 30% government-tender share and
subscription model, which is the durable point, and answer the hostile question with the
source contradiction rather than conceding it.

### A3 — drivebuddyAI is out of date by two months · HIGH

Slides 29 and 81 still carry "$2.5m / 3,000 heavy trucks" as the current position. The
June 2026 announcement — **$5.3m across 3,600 electric buses and trucks, including
mining** (`EV-DBA-01`) — is on slide 4 only. The body of the dossier was never updated,
so the deck argues against a competitor two months smaller than it is.

### A4 — STRADVISION scale is stale · MEDIUM

Slide 44 cites "4m+ global deployment". The April 2026 primary release says
**~5 million cumulative SVNet units** (`EV-SV-04`).

### A5 — ZF's strongest evidence is absent · MEDIUM

None of the ZF nomination detail appears anywhere: 16 features, 300,000 km India
validation, ARAI certification, the named vehicle platforms (`EV-ZF-01`…`EV-ZF-04`).
The deck rates ZF a HIGH threat without showing why.

---

## B · Required content that was never built

### B1 — No company profiles *(you asked for this)*

Nowhere does the dossier say what these companies **are**. No founding year, domicile,
legal entity, listing status, market cap, headcount, funding or revenue.

The omission hides the single most decision-relevant fact in the whole landscape:
**the competitor set spans four orders of magnitude and is treated as one peer group.**

| Company | Status | Scale (as of Aug 2026) |
|---|---|---|
| ZF Group | Private (Zeppelin Foundation) | €41.4bn sales, 161,600 staff |
| **ZF CVCS India** | **Listed — NSE: ZFCVINDIA** | **₹29,642 Cr (~$3.4bn), +13% YoY** |
| Aptiv PLC | Listed — NYSE: APTV | $10.2bn, **−34.6% YoY** |
| Sterling Tools | Listed — NSE: STERTOOLS | ₹806 Cr (~$92m), falling |
| Roadzen (drivebuddyAI) | Listed — Nasdaq: RDZN | ~$112m, $1.26/share near 52-wk low |
| STRADVISION | Private | 300+ staff, founded 2014 |
| bitsensing | Private | $42m raised across 5 rounds |
| Netrasemi | Private | ₹107 Cr Series A |
| Starkenn | Private | $2m raised, **57 staff, −15.8% YoY** |
| Gahan AI | Private | **15 staff** |

Two facts that change the argument and are in no version of the deck:

- **ZF's India arm is itself a listed ₹29,600 Cr Indian company** (`EV-ZF-07`) —
  incorporated 2004, Chennai, formerly WABCO India. "Foreign incumbent" is the wrong
  frame; it is a domestic listed incumbent that already owns the braking safety case.
- **Aptiv's market cap has halved in under three years** (`EV-APT-08`). A supplier under
  that much pressure prices and partners differently than one that isn't.

### B2 — No AI use cases per company *(you asked for this)*

Built now in `outputs/ai-use-case-profiles.md`. The dossier described competitors by
*threat rating* but never by *what their AI actually does* — which is what determines
whether DeepGrid can displace, attach to, or ignore them.

### B3 — No distinction between systems that brake and systems that warn · CRITICAL

The dossier runs one heatmap across all competitors. But the market divides at **brake
actuation**:

- **Reach actuation (AEBS):** ZF, Aptiv+STRADVISION — can satisfy rule 96(12)
- **Warning-only:** drivebuddyAI (camera-only, alerts driver), bitsensing (explicitly no
  AEB), Starkenn — **cannot satisfy rule 96(12) at any price**

These are two different markets, two different buyers and two different clocks. The
warning-only group is winning *retrofit fleet-safety* budget today; the actuating group
is competing for *homologation* budget in 2027. Flattening them makes drivebuddyAI look
like a mandate competitor when it is not, and makes the mandate look nearer than it is.

### B4 — No certification-gate view

ISO 26262, ARAI certification and AEC-Q100 are the actual gates, and no slide compares
who holds what. STRADVISION holds ISO 26262 (`EV-SV-05`); ZF claims ARAI certification
without publishing certificate numbers (`EV-ZF-04`); Gahan's AEC-Q100 claim is a category
error (`EV-GHN-05`); Netrasemi has none; DeepGrid has no published pathway.

**This is the real barrier, and it is nowhere as a single exhibit.**

### B5 — No lifecycle / OTA economics · **CLOSED v6, slide 93**

Aptiv ships over-the-air updates via LINC + VxWorks (`EV-APT-06`). That turns ADAS from a
shipped part into a maintained service and keeps the customer relationship with the
integrator. A merchant module vendor has no answer to it. Not mentioned anywhere.

### B6 — No data-flywheel or adjacent-monetisation read · **CLOSED v6, folded into slide 93**

Roadzen is an **insurance**-AI parent: drivebuddyAI's telematics feed underwriting.
Starkenn earns **40% of revenue from subscriptions**, not hardware (`EV-STK-06`). Both are
monetising the data layer. The dossier treats this market as hardware-plus-perception
only, so it misses that two rivals already have recurring revenue DeepGrid does not.

### B7 — No silicon-dependency map · **CLOSED v6, slide 15**

Gahan builds on TI AWR2944; bitsensing partners NXP (`EV-BIT-02`); Netrasemi is TSMC 12nm.
Who controls whose supply is directly relevant to a company whose thesis is owned silicon
— and it is unmapped.

### B8 — No dated competitive-win timeline

Wins are scattered across slides. In date order they tell a story the deck never states:
ZF nomination (Dec 2025) → Aptiv+STRADVISION India CV (Jan 2026) → Sterling×MINIEYE
(Jan 2026) → bitsensing Series B (Apr 2026) → STRADVISION India lineup (Apr 2026) →
Netrasemi A2000 (May 2026) → drivebuddyAI $5.3m (Jun 2026). **Eight months, seven moves.**

### B9 — The Aptiv and STRADVISION India wins may be one deal · **CLOSED v6, slide 17**

Both describe an unnamed global/leading CV OEM selecting their stack for India, three
months apart, and Aptiv's camera *contains* STRADVISION's vision AI (`EV-APT-02`). The
dossier counts them as two competitive events. They may be one. Unresolved — and it must
be labelled unresolved rather than silently double-counted.

### B10 — No statement that ADAS pricing is unquotable

No public per-unit India price exists for any of these vendors; bitsensing's own
"pricing agreed case by case" corroborates that this is market structure, not a search
failure. Without saying so, every cost-advantage slide invites a question that cannot be
answered.

---

## C · Method faults that let A and B through

| # | Fault | Status |
|---|---|---|
| C1 | Evidence ledger was **reverse-engineered from slide headlines** — 639 rows, 12 supported, 37 with any source | **Fixed** — rebuilt source-first, 54 rows, all sourced |
| C2 | **Vendor press releases outranked gazette text** on a question of law | **Fixed** — source hierarchy enforced; A1 corrected |
| C3 | No check that a cited number is in `allowed-numbers.yaml` | **Fixed** — regenerated from ledger, 34 approved values |
| C4 | Claim IDs were **positional**; inserting a row silently renumbered 15 citations | **Fixed** — competitor-scoped stable IDs |
| C5 | No validator that citations resolve | **Fixed** — `src/check_citations.py`, runs clean |
| C6 | A single un-audited source could set a headline number with no contradiction check | **Open** — A2 is the instance; needs a rule |

---

## Priority order

1. **A1** — the regulatory citation. Client-facing, checkable by the client's own
   regulatory counsel, and the deck contradicts itself.
2. **A2** — Starkenn's number, which currently drives a threat ranking and a
   hostile-question answer.
3. **B3 / B4** — the brake-actuation split and the certification gate. These change the
   competitive conclusion, not just its evidence.
4. **B1 / B2** — company profiles and AI use cases *(requested)*.
5. **A3 / A4 / A5** — refresh the superseded and missing figures.
6. **B5–B10** — the analytical layers that are absent rather than wrong.

---

## v10 closure — 17 Aug 2026

The three items left open after v9 are now closed or precisely scoped:

- **Firmographics (source-or-cut).** Every firmographic field for Starkenn, Gahan
  AI, Netrasemi, Sterling Tools × MINIEYE and bitsensing is now individually
  ledger-linked (`outputs/evidence-ledger.csv`, 22 new rows; `EV-NTR-03` upgraded to
  the Economic Times press source, resolving the ₹107 Cr Series A vs ₹125 Cr
  cumulative discrepancy). Two Gahan fields are **cut**, not asserted: the "10 TB
  road data" and "Tata/Ather OEM pilots" are now "not independently verified" and
  "no public OEM confirmation". Starkenn funding ($2.0m) and headcount trend
  (−15.8% YoY), and Gahan's 10 patents, are recorded company/aggregator-asserted at
  LOW confidence — directional, not verified.
- **Foundry row (source-or-cut).** The supplier-side foundry row is now partially
  evidenced: the process node is sourced (TSMC 12nm for Netrasemi A2000,
  `EV-NTR-02`; India's domestic option Tata Electronics Dholera 28nm, ISM-approved,
  `EV-FND-01`). Mask cost, lead time and wafer commitment/NRE **remain a documented
  GAP** — no public per-program disclosure norm exists, and no citable source was
  retrievable this run. The standing rule is unchanged: do not carry an ASIC cost
  line into a board paper until the economics are sourced.
- **HTML artifact.** `client-package/site/index.html` — a self-contained 7-tab
  report (Act I–VI + Appendix), 135 slides, tabs↔sections 1:1, navigation QA passed.
