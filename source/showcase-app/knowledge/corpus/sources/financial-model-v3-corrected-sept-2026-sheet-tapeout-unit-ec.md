# DeepGrid Semi — sources/financial-model-v3-corrected-sept-2026-sheet-tapeout-unit-ec

All figures are management projections from DeepGrid's fundraising materials.

## Tapeout Unit Economics · Financial Model v3 (corrected, Sept 2026)

SoC2 Tapeout — Unit Economics
What the raise funds. One-time NRE turns into a chip that costs ~$3 at volume vs $3,000-8,000 incumbents. Blue = input, black = formula.
A. PHASED TAPEOUT PROGRAM (what the raise funds):
A100 block MPW (5mm2 x $13,800/mm2, 100 samples) — $ 69,000; Rs Cr 0.65; muSemi shared block, TSMC 28nm; compute block
R100 block MPW (5mm2 x $13,800/mm2, 100 samples) — $ 69,000; Rs Cr 0.65; muSemi shared block; radar DSP block
Full 57mm2 MPW prototype (1p8m 8-metal) — $ 232,000; Rs Cr 2.18; muSemi full block $220k + 5 proto wafers @ $2,400
SmartSoC backend -> GDSII (PD / DFT / integration / signoff) — $ 1,000,000; Rs Cr 9.4; After MPW blocks proven
Dedicated mask set (TSMC 28nm 1p8m, negotiable) — $ 1,000,000; Rs Cr 9.4; Full production mask, separate foundry cost
IP — PrimeSoC MIPI + PCIe4 + LPDDR5X — $ 300,000; Rs Cr 2.82; Controller IP bundle (one-time licence)
IP — Terminus Circuits PHY — $ 500,000; Rs Cr 4.7; PHY IP; $400-600k negotiable, midpoint
Total program NRE (one-time) — $ 3,170,000; Rs Cr 29.8; ~$3.2M total; validate A100/R100 blocks on MPW, then full die, then dedicated mask
B. PER-DIE COST AT VOLUME (derived from die size + yield)

## Tapeout Unit Economics · Financial Model v3 (corrected, Sept 2026) (part 2)

SoC2 die area (mm2) — 57; v7 single-die SoC2, TSMC 28nm HPC+
Wafer diameter (mm) — 300; Standard 300mm wafer
Gross die per wafer (edge-corrected) — 1,069; GDPW formula: pi*r^2/A - pi*2r/sqrt(A)
Yield (mature 28nm) — 0.94; Murphy model at ~0.1/cm2 defect density
Good die per wafer — 1,010; Gross die x yield
28nm wafer cost ($/wafer) — 2,400; Volume-committed price (~500k dies); TSMC 28nm
Wafer cost per die ($) — 2.38; Wafer cost / good die
Assembly, test & packaging ($) — 1.5; OSAT / QuikPak at volume
Per-die cost at volume ($) — 3.88; Wafer/die + ATP
Incumbent ADAS SoC cost ($) — 3,000; Mobileye/Nvidia class: $3,000-8,000
Cost advantage vs incumbent (x) — 773.95
C. NRE BREAKEVEN
Chip contribution inside a kit ($/chip) — 22; ASIC replaces Rs65k FPGA module; priced inside kit BOM
Gross margin per chip ($) — 18.12
Breakeven volume (chips to recover NRE) — 174,908; Total NRE / gross margin per chip
Phased path de-risks the spend: prove A100 & R100 blocks on shared MPW, then a full-die
prototype, and commit to the dedicated mask only once silicon works. Post-breakeven, every chip is near-pure margin.

## Tapeout Unit Economics · Financial Model v3 (corrected, Sept 2026) (part 3)

Production is demand-driven (~217k dies through FY32); the dedicated mask is built for a ~500k-die
lifetime target, and that volume commitment is what earns the ~$2,400/wafer price used above.
D. SoC4 5nm SLIP SENSITIVITY
Silicon & Compute revenue FY32 (on-time) — 194.3
Haircut if SoC4 tapes out 12 months late — 0.3
Silicon & Compute revenue FY32 (slip case) — 136.01; ~Rs58 Cr lost; chip+box ramp pushed one year right
If SoC4 5nm slips 12 months, FY32 Silicon & Compute revenue falls ~30% (~Rs58 Cr). Core road-ADAS business on SoC2 is unaffected.
E. BEYOND FY32 — THE NEXT GROWTH WAVE
SoC4 5nm is the option on the next two markets, both arriving post-FY32:
1. Robotaxi / L4 on Indian roads — SoC4 is the compute to win it; we are chip-ready when the market arrives.
2. Datacenter-class chipset — a bigger bet: the same transformer-native architecture scaled to datacenter inference.
The Rs300 Cr cumulative R&D (FY28-32) is not a cost centre — it funds these two options from operating profit, so the
FY33+ growth wave needs no new external capital for silicon. This is why R&D runs high by design.
