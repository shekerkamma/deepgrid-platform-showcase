# DeepGrid Semi — sources/research-brief

All figures are management projections from DeepGrid's fundraising materials.

## Demand & TAM — what the tab actually claims, and where it breaks

Source: Deepgrid Semi Financial Model Corrected v3-sept.xlsx, tab Demand & TAM, FY32 column. Read via formulas, not values — every finding below traces to a cell reference. Date: 2026-08-30. Status: reviewed.

## Verdict

The arithmetic is clean. Every stated capture % reproduces exactly from its own formula, and the revenue build ties to the P&L to the rupee (₹1,128.45 Cr FY32, 15 lines). The problem is not the numbers — it is that one column silently mixes two incompatible denominators, and the product the whole story rests on is the one using the flattering basis. The tab's own closing claim — "our FY32 volumes are a single-digit share of each pool" — is false for AD2 on the sheet's own dominant methodology and its own stated TAM.

## Finding 1 — "Capture %" is two different metrics in one column

Basis Products Formula shape Revenue ÷ revenue AD0, Seaport AGV, A100, Chipset, Thermal, 4D radar (6) ='Revenue Build'!J61 10000000/Assumptions!$C$6/1e9/3.09 Units ÷ units AD2, Autonomous TaaS (2) =C22/1000000 None given AD1, H100, D-HUMR, D100 (4) — Six rows convert ₹Cr → USD at ₹94/$ and divide by a dollar market. Two divide unit counts by unit counts. They sit under one header, in one column, and are summarised in one sentence. They are not comparable, and the column gives the reader no way to know.

## Finding 2 — On its own revenue basis, AD2 is 23.9%, not 1.8%

AD2 is the mandate story: 18,000 units, ₹450 Cr, 40% of FY32 revenue. - As shown: 18,000 ÷ 1,000,000 units = 1.8% - On the sheet's dominant basis: ₹450 Cr = $47.9M against the sheet's own row 8, "TAM — mandated ADAS (AIS-184/186/187/188) annual = $200M" → 23.9% Both use the sheet's own numbers. A 13x swing rests on a choice the sheet never states. 23.9% of a regulated market by FY32 is a defensible plan — but it is a different plan from the one "1.8%" describes, and it invites a different diligence question.

## Finding 3 — The 1.0M SAM adds a flow to a stock

Row 9 builds SAM as ~500k new/yr + ~500k retrofit. The first is an annual flow; the second is a one-time stock of existing N2/N3 vehicles, mandated from Oct 2026. By FY32 — five years into the retrofit window — that stock is substantially converted, so it should not still sit in an FY32 denominator at full value. On the annual flow alone, AD2 capture is 3.6%.

## Finding 4 — Two sheets disagree on whether AD0 is mandate-driven

AD0 is 54,000 units and ₹270 Cr — 24% of FY32 revenue, the second-largest line. - Revenue Build J44 labels it: "AD0 Smart Mirror (mandate retrofit)" - Demand & TAM row 17 says: "NOT mandated — voluntary safety/convenience buy" Mandate-driven and voluntary demand carry different risk, different sales cycles, and different defensibility. One of these is wrong, and a quarter of FY32 revenue turns on which.

## Finding 5 — 13.5% of FY32 revenue has no sized pool

₹Cr % of FY32 revenue Products with a capture % 976.45 86.5% Listed but not sized (AD1, H100, D-HUMR, D100) 102.00 9.0% Absent from the tab entirely (T100 AI licence, 50 units) 50.00 4.4% Total 1,128.45 100% The tab states "every product tied to a sized, sourced demand pool" and "every line maps to a real, sized market." Four of twelve listed products carry —, and a thirteenth revenue line never appears.

## What to change before this goes in front of an investor

1. Split the column in two — Capture % (revenue) and Capture % (units) — or convert everything to revenue ÷ revenue. Do not leave one header over two metrics. 2. Show AD2 on the revenue basis and defend 23.9%. The mandate is the strongest thing in this plan. A sophisticated reader will recompute it, find 23.9%, and wonder why 1.8% was the number on the page. Leading with 23.9% and the mandate floor is the stronger position. 3. Split SAM into flow and stock with a retrofit-conversion curve, so the FY32 denominator is an FY32 denominator. 4. Resolve the AD0 mandate question and make both sheets say the same thing. 5. Size the remaining four, or say plainly they are unsized — and add T100.

## Checks

Verified - Every stated capture % recomputed independently from its formula and source cells; all 9 tie exactly. - Revenue build FY32 (15 lines) = ₹1,128.45 Cr = P&L row 6 FY2032. Exact. - Unit counts on this tab traced cell-by-cell to Revenue Build J44–J58; all 12 tie. - FX ₹94/$ read from Assumptions!C6, the same cell every revenue-basis formula uses. - AD2 $47.9M and the $200M TAM both taken from this workbook, not from outside sources. Not verified - No external market size was checked. IMARC, EMR, Dataintelo, SNS Insider, Verified MR and the rest are taken as stated. The $200M mandated-ADAS TAM in particular drives Finding 2 and was not independently sourced. - The business-plan workbook was not analysed — this brief covers the financial model only. - Retrofit-conversion timing in Finding 3 is a stated assumption; the sheet carries no curve to test. - The regulatory claims (GSR 184(E) dates, the AEBS deferral to Oct 2027) were not checked. Blocked - The workbook was open in Excel during analysis ( ~$ lock file present). Read from the saved copy; any unsaved edits are not reflected.
