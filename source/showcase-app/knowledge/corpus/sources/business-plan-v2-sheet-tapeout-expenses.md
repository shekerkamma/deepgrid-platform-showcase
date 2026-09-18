# DeepGrid Semi — sources/business-plan-v2-sheet-tapeout-expenses

All figures are management projections from DeepGrid's fundraising materials.

## Tapeout Expenses · Business Plan v2

DeepGrid Semi Private Limited
Modelling Assumptions
A. PHASED TAPEOUT PROGRAM:
A100 block MPW (5mm2 x $13,800/mm2, 100 samples) — $ 69,000; Rs. Cr 0.65; Comment muSemi shared block, TSMC 28nm; compute block
R100 block MPW (5mm2 x $13,800/mm2, 100 samples) — $ 69,000; Rs. Cr 0.65; Comment muSemi shared block; radar DSP block
Full 57mm2 MPW prototype (1p8m 8-metal) — $ 232,000; Rs. Cr 2.18; Comment muSemi full block $220k + 5 proto wafers @ $2,400
SmartSoC backend -> GDSII (PD / DFT / integration / signoff) — $ 1,000,000; Rs. Cr 9.4; Comment After MPW blocks proven
Dedicated mask set (TSMC 28nm 1p8m, negotiable) — $ 1,000,000; Rs. Cr 9.4; Comment Full production mask, separate foundry cost
IP — PrimeSoC MIPI + PCIe4 + LPDDR5X — $ 300,000; Rs. Cr 2.82; Comment Controller IP bundle (one-time licence)
IP — Terminus Circuits PHY — $ 500,000; Rs. Cr 4.7; Comment PHY IP; $400-600k negotiable, midpoint
Total program NRE (one-time) — 3,170,000; 29.8; ~$3.2M total; validate A100/R100 blocks on MPW, then full die, then dedicated mask
B. PER-DIE COST AT VOLUME (derived from die size + yield):
SoC2 die area (mm2) — 57; Comment v7 single-die SoC2, TSMC 28nm HPC+

## Tapeout Expenses · Business Plan v2 (part 2)

Wafer diameter (mm) — 300; Comment Standard 300mm wafer
Gross die per wafer (edge-corrected) — 1,069; Comment GDPW formula: pi*r^2/A - pi*2r/sqrt(A)
Yield (mature 28nm) — 0.94; Comment Murphy model at ~0.1/cm2 defect density
Good die per wafer — 1,010; Comment Gross die x yield
28nm wafer cost ($/wafer) — 2,400; Comment Volume-committed price (~500k dies); TSMC 28nm
Wafer cost per die ($) — 2.38; Comment Wafer cost / good die
Assembly, test & packaging ($) — 1.5; Comment OSAT / QuikPak at volume
Per-die cost at volume ($) — 3.88; Comment Wafer/die + ATP
Incumbent ADAS SoC cost ($) — 3,000; Mobileye/Nvidia class: $3,000-8,000
Cost advantage vs incumbent (x) — 773.95
C. NRE BREAKEVEN
Chip contribution inside a kit ($/chip) — 22; ASIC replaces Rs65k FPGA module; priced inside kit BOM
Gross margin per chip ($) — 18.12
Breakeven volume (chips to recover NRE) — 174,908; Total NRE / gross margin per chip
D. SoC4 5nm SLIP SENSITIVITY
Silicon & Compute revenue FY32 (on-time) — 185.3; From Sales Summary
Haircut if SoC4 tapes out 12 months late — 0.3
Silicon & Compute revenue FY32 (slip case) — 129.71; ~Rs56 Cr lost; chip+box ramp pushed one year right
E. BEYOND FY32 — THE NEXT GROWTH WAVE

## Tapeout Expenses · Business Plan v2 (part 3)

SoC4 5nm is the option on the next two markets, both arriving post-FY32:
1. Robotaxi / L4 on Indian roads — SoC4 is the compute to win it; the company are chip-ready when the market arrives.
2. Datacenter-class chipset — a bigger bet: the same transformer-native architecture scaled to datacenter inference.
The Rs300 Cr cumulative R&D (FY28-32) is not a cost centre — it funds these two options from operating profit, so the
FY33+ growth wave needs no new external capital for silicon. This is why R&D runs high by design.
