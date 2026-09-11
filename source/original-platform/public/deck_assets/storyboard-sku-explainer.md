# Storyboard — DeepGrid Semi SKU explainer deck (animated)

## Decision
**76 slides.** A reference explainer, not a pitch: uniform depth per SKU so a reader can
open at any product and get the whole answer. The pitch deck (20 slides) stays separate;
this one is what a technical diligence reader or a sales engineer works from.

## BLUF
One 28 nm chip becomes fifteen sellable products. This deck explains each one — what it is,
how it works on the shared silicon, who buys it, and what it contributes.

## Narrative arc

| Part | Slides | Role |
|---|---|---|
| 0 · The case | 6 | Why the portfolio exists at all: mandate → imported silicon → our chip → the map |
| 1 · Road autonomy | 13 | 3 SKUs × 4, ₹762 Cr, the mandated volume core |
| 2 · Silicon & compute | 21 | 5 SKUs × 4, ₹194.3 Cr, where the margin lives |
| 3 · Fleet & mobility | 9 | 2 SKUs × 4, ₹88.65 Cr, highest revenue per unit |
| 4 · Sensors & robotics | 21 | 5 SKUs × 4, ₹83.5 Cr, capability and second cycles |
| 5 · Portfolio economics | 5 | Concentration, sequencing, domains, margin ladder, headroom |
| 6 · Close | 1 | Fund the silicon; the portfolio follows |

## The repeatable SKU unit — four slides, same order every time

The unit is the deck's grammar. A reader learns it once and can navigate all fifteen.

| # | Slide | Question answered | Build sequence (all entrance) |
|---|---|---|---|
| A | **What it is** | If I held one, what would I be holding? | title → form-factor card → what's in it → price/positioning |
| B | **How it works** | What does the silicon actually do here? | signal chain L→R: sense → SoC2 → decide → output |
| C | **Who buys it, and why now** | Who signs, through what channel, against what trigger | buyer card → channel → demand pool → capture bar |
| D | **How it fits** | What does it contribute, and what does it depend on? | unit ramp → revenue ramp → margin → dependency note |

Slide D always closes the unit on the portfolio, so every SKU is returned to the whole.

## Motion contract
`motion-config.json`: transitions **fade only**, ≤600 ms; effect classes **entrance and
emphasis only**; ≤8 build steps per slide; every slide must declare a transition.

**No exits.** `MOTION_EXIT_BREAKS_REST_STATE` is a non-waivable error, and content that
exits is absent from the resting frame — so it would vanish from PDF export, contact
sheets and render QA. Every build ends with the complete slide on screen.

Authoring is `officecli` against a **Windows path** (writes do not persist to WSL paths),
verified by `lint_motion.py` reading the XML back independently — never by `officecli get`,
which reads the resident's memory rather than the file.

## Evidence rules carried forward
- Figures from the financial model workbook: Revenue Build rows 44–58 (units, price,
  segment) and 61–75 (revenue, domain); surfaces from the section-A sum formulas.
- Demand pools, capture rates and sources from Demand & TAM section B. T100 has no
  separately sized pool and says so. The three A100 SKUs share one pool row.
- No competitor per-unit price is quoted. The die-vs-module comparison carries its
  like-for-like caveat wherever it appears.
- Every figure is a management projection, stated on the cover and the close.


---

## As built — 81 slides

The four-slide unit grew a conditional fifth, and Part 0 gained a silicon spec
slide, after the company's own pre-Series A deck and four product simulators
were folded in as source.

| Part | Slides | Content |
|---|---|---|
| 0 · The case | 1–6 | Cover · how to read · why now · the move · **the silicon** · the portfolio |
| 1 · Road autonomy | 7–21 | 3 SKUs · ₹762 Cr · 67.5% |
| 2 · Silicon & compute | 22–42 | 5 SKUs · ₹194 Cr · 17.2% |
| 3 · Fleet & mobility | 43–52 | 2 SKUs · ₹88.7 Cr · 7.9% |
| 4 · Sensors & robotics | 53–74 | 5 SKUs · ₹83.5 Cr · 7.4% |
| 5 · Portfolio economics | 75–80 | Concentration · sequencing · domains · margin · headroom |
| 6 · Close | 81 | The ask |

**The SKU unit:** A what it is · B how it works · C who buys it, and why now ·
D how it fits · **E proven in a working simulator** · **F the simulator,
running** — an embedded, playable clip of the console itself (both E and F only
where a demonstrator exists: Smart Truck, AD1 Indoor L4, Seaport AGV, Defence
D-HUMR). 85 slides with the F slides added.

E is conditional on purpose. Four SKUs have a running simulator; inventing an
E slide for the other eleven would turn evidence into decoration.

## Evidence added from the supplied sources

| Source | What it grounded |
|---|---|
| `Deepgrid_Speciale_Deck.html` | SoC2 spec slide — 28 nm, ~57 mm², 32,768 MACs at 600 MHz, 39.3 TOPS, 102.4 GB/s LPDDR5, hardware softmax, lockstep + root of trust; and the 11-channel / 8.6 ms / 74%-headroom fusion figure that explains the whole SKU fan-out |
| `ddrive-adas-sim-v2.html` | Smart Truck E slide — three road profiles, 550 kg / 2.10 m / μ 0.75 plant model, planner view off the fused object list |
| `forklift-sim.html` | AD1 E slide — 24 m LiDAR at 5 Hz, 57° camera, 1.5 m/s, ring-fenced safety zone, graded alert policy, explicit stuck-recovery |
| `yard-sim.html` | Seaport AGV E slide — PS18; 7 cm open / 22 cm under crane against RTK-GNSS alone, FIFO vs predictive-ETA dispatch, shadow mode |
| `sentinel-sim.html` | D-HUMR E slide — PS16; correlate → escalate → hand off, and restraint on benign tracks as the actual feature |

The Speciale deck is a **raise** document with its own valuation and revenue
claims. It was used here for product and silicon vocabulary only; every figure
on these slides still comes from the two workbooks.
