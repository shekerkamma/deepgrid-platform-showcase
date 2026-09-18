# DeepGrid Semi — sources/research-im-review-stage1-audit-part1

All figures are management projections from DeepGrid's fundraising materials.

## Stage 1 Audit — DeepGrid Semi Pre-Series A IM v2

Objective: decide whether IM v2 is investor-ready, or what must be fixed first. Source: DeepGrid Semi — IM — v2.pdf, June 2026, 27 pages, Emani Capital Advisory. Scope limit: single-source audit. This finds internal contradictions only. Nothing here is checked against the outside world — that is Stage 2's job, and it is not done. No recommendation is given in this stage, by design.

## 1. What we know with reasonable confidence

These are internally consistent and arithmetically check out. - The raise is USD $4.0–5.0M, pre-Series A, equity / compulsorily convertible. - The FY2032 revenue build is coherent across all three cross-tabs on p.21. Business line, product category, and revenue type each independently sum to the same total: 75.0 + 33.5 + 1229.5 + 50.0, and 75.0 + 33.5 + 153.0 + 966.2 + 110.3 + 50.0, and 75.0 + 1197.0 + 66.0 + 50.0. All three land on 1,388.0. - The P&L on p.20 is self-consistent: gross profit 1226.5 on revenue 1388.0 is the stated 88% GM; EBITDA 536.6 on 1388.0 is 38.7%. - The TOPS derivation is correct: 64 PCOREs x 512 MACs = 32,768 MACs; x 600 MHz x 2 ops = 39.3 TOPS INT8. Stated on p.8 and reproduced on p.15. - The MicroDC-A1 spec block is internally coherent: 4 chips x 4.19 PF = 16.76 PFLOPS; 4 x 280 W = 1,120 W; 1,024 tiles x 4 = 4,096. - FY2027 revenue of 6.0 Cr reconciles between the P&L and the business-line table. - Traction claims are specific and dated: 15 provisional patents filed Mar 2026 (IN2026/DGR/001-015), 1 Cr defence revenue received Q1 2026 on FPGA hardware, YOLOv11n at 40fps measured on Artix-7 200T.

## 2. What is being assumed

Assumptions presented in the document's own voice, with what would confirm each. - The mandate converts to purchases. GSR 184(E) is described as "a regulatory floor, not a forecast". Enforcement existing is not the same as fleets buying on schedule. Confirmed by: signed fleet orders, not the gazette notification. - ASIC economics arrive as modelled. Gross margin goes 53% - 88% between FY2027 and FY2032, resting on the FPGA-to-ASIC transition. Confirmed by: first silicon returning to spec, which the timeline places at Q4 2026. - Sales and marketing at 12–14% of revenue holds while revenue compounds from 6.0 Cr to 1,388.0 Cr — a 231x increase over five years on a roughly flat S&M ratio. Confirmed by: cost-per-design-win from the first fleet cohort. - "No indigenous alternative exists". Confirmed by: an independent scan, not by the company's own competitive slide. - The India-data moat compounds. Stated as structural. Confirmed by: a measured accuracy delta on Indian road data versus a foreign stack — a number the IM does not have.

## 3.1 The headline revenue number is wrong, and it is on the cover — CRITICAL

Location Figure p.3 cover stat " ₹1,128 Cr — Revenue FY2032E" p.21 slide title "Revenue to ₹1,128 Crore by FY2032" p.5 platform cascade " ₹1,388 Cr by FY32" p.6 investment thesis "Total group revenue: ₹1,388 Cr FY32" p.20 P&L, FY2032 row " 1388.0 " p.21's own table, directly beneath its title sums to 1,388.0 A ₹260 Cr gap, 23% of the number. It appears on the cover — the most-read figure in the document — and again as a slide title contradicting the table printed under it. The ₹1,388 Cr figure is the supported one: three independent cross-tabs and the P&L agree.

## 3.3 SAM exceeds TAM — structurally impossible

p.7: " ₹61,000 Cr India ADAS aftermarket TAM by 2030". p.14: "India SAM (5M+ trucks mandated) ₹85,000 Cr ". A serviceable available market cannot exceed the total addressable market it sits inside. p.14 also lists a "Retrofit market (9Cr vehicles) ₹4,50,000 Cr", which makes the ₹61,000 Cr TAM smaller than two other markets on the same page. Either the TAM is scoped far more narrowly than its label says, or the figures come from different definitions that were never reconciled.

## 3.4 Die cost stated three different ways — on a slide about not confusing costs

Location Die cost p.4 "the die is ~$30, not $6,000" p.8 " <$3 die · ~$30 board BOM" p.22 headline " <$4 Die Cost (at 1M chips)" p.22 body, same box "Die ( $3 ) + carrier board + connectors + packaging = ~$30" p.4 has mistaken the board BOM for the die. p.22 is titled "Cost Clarity — Three Numbers VCs Always Confuse" and contradicts itself between its own headline and body. This is the most quotable failure in the document, because the slide's entire purpose is precision about this number.

## 3.5 NRE / tapeout cost: five figures, never reconciled

$630K MPW shuttle (p.15, p.16) · $2M "we spend" (p.22) · $2.42M NRE (p.8, p.15) · ~$3M NRE headline (p.22) · $3.17M tapeout (p.5). Some of these are legitimately different things — an MPW shuttle is not full production NRE. The document never says which is which, and p.22 puts "~$3M" and "we spend $2M" in the same box.

## 3.6 Die area: 57.1mm² vs 42mm²

p.8, p.15 and p.6 all state ~ 57.1mm². p.16 states "68.7 effective TOPS on a 42mm² die". These are reconcilable — the six chiplet areas on p.15 (7+6+7+8+7+7) sum to exactly 42mm², so 42 is silicon area and 57.1 is the combo die. The document never says so, and p.16 calls 42mm² "a die". p.16 also introduces "68.7 effective TOPS" against 39.3 TOPS peak everywhere else, with no definition of "effective".

## 3.8 AD2 sensor count: 6 cameras, 9 cameras, or 6+LiDAR+ultrasonic

p.8 title: " 6 Cameras. One Chip." · p.9: " 9 CAM + 2 RADAR FUSED", itemising 7x RGB + 2 thermal + 2 radar = 11 channels, no LiDAR, no ultrasonic · p.13 pricing: AD2 = " 6 Cam + 2 Radar + LiDAR + 4 US " · p.15: A100 is " 6-camera MIPI CSI-2". Three different sensor configurations for the same AD2 product. The p.13 spec includes LiDAR and 4 ultrasonic sensors that the p.9 architecture diagram does not carry, which also puts the ₹2–2.5L kit BOM in question.

## 3.10 The "3 to 7x cheaper" claim does not match its own table

p.14 claims " 3 to 7x Cheaper Than Every Import" and lists imports at ₹5–8L (Mobileye), ₹8–12L (Continental), ₹12–18L (Nvidia), ₹10–15L (Qualcomm) against DGrid at ₹2–2.5L. Worst case against the cheapest import: ₹5L / ₹2.5L = 2.0x, below the claimed floor of 3x. Best case against the dearest: ₹18L / ₹2L = 9.0x, above the claimed ceiling of 7x. The true range from their own numbers is roughly 2x to 9x. The claim understates the strongest comparison and overstates the weakest. Separately, p.19 prices Mobileye SuperVision at "~₹3.5L" while p.14 puts Mobileye at ₹5–8L. Against ₹3.5L the multiple is 1.4x.

## 3.11 The 200x utilisation claim strains its own arithmetic

p.16 states competitors achieve " 1–5% hardware utilisation" and that DGrid's ALU is "active 200x longer per cycle". 200x of 1% is 200%, and of 5% is 1,000% — both impossible. The claim only works if the competitor baseline is at or below 0.5%, which is outside the range the same paragraph states.

## 4. Conclusions supported by more than one place in the document

- FY2032 revenue of ₹1,388 Cr — four independent locations (p.5, p.6, p.20 P&L, p.21 tables). - 39.3 TOPS INT8 peak — stated and independently derivable on p.8 and p.15. - 15 provisional patents, filed March 2026, expiring March 2027 — p.3, p.6, p.15, p.18, p.26 all agree. - ₹1 Cr defence revenue received — p.3, p.15, p.18, p.26 agree, and it is described as received rather than contracted. - TSMC 28nm HPC+, ~57.1mm², six chiplets — p.8, p.15 agree.

## 5. What is missing

Ranked by how much each would move an investment decision. 1. A cap table, current valuation, and the pre/post-money split. A $4–5M raise document with no ownership terms. p.18 says an IBBI valuation is "in progress" and "expected prior to term-sheet signing" — so the number does not exist yet. 2. Any historical financials. The P&L starts at FY2027 projections. There is no FY2025 or FY2026 actual, no balance sheet, no current cash position, no burn rate, no runway. For a company with ₹1 Cr of received revenue, the audited past is one page and it is absent. 3. Customer evidence behind the 231x revenue ramp. ₹88L MCEME pipeline is named; nothing else is. No LOIs, no named fleet pilots, no design-in commitments from the Tata or Mahindra evaluations the milestones reference. 4. Unit economics at the FY2027–2029 volumes, where FPGA GM is 46.7% on AD2. The 88% GM story is an FY2032 endpoint; the years that consume the raise are the thin-margin ones and they are not broken out per unit. 5. What happens if first silicon fails. 54% of proceeds go to ASIC tapeout NRE. There is no contingency, no second-shuttle budget, and no stated consequence for the revenue model if Q4 2026 silicon does not come back functional. 6. Founder/CTO equity, vesting,

## 6. Unanswered questions that could change the decision

- Is FY2032 revenue ₹1,128 Cr or ₹1,388 Cr — and if the deck cannot hold that number steady, what else moved? - What is the pre-money valuation, and against what evidence? - Is there a signed order beyond the ₹1 Cr defence receipt? - What is current cash and runway to first silicon? - Is the ₹61,000 Cr TAM or the ₹85,000 Cr SAM the real figure, and under whose definition? - Does the ₹2–2.5L AD2 kit price include the LiDAR and 4 ultrasonic sensors p.13 lists? - What is the accuracy delta of the India-trained model versus a foreign stack, measured?

## Limitations

Single-source audit. Every finding above is the document disagreeing with itself; none of it establishes whether any claim is true. The market sizing, the regulatory reading, the competitor prices, and the technical benchmarks are all unverified against external sources. Stage 2 has not been run.
