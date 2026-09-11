# Metric definitions — defined before any scoring

The contract requires every ranked or charted metric to be defined before scores exist.
The central failure this prevents is the one already retired twice in this corpus: the
"12.9× cheaper than Mobileye" claim, which compared a competitor's **ASP** to DeepGrid's
**die cost**. Two different metrics, one ratio, wrong by roughly 5.6×.

## M1 — `price_scope` (categorical, must be stated before any price comparison)

| Value | Meaning |
|---|---|
| `die` | Bare silicon cost at a stated volume |
| `compute_module` | Compute board only |
| `kit` | Compute + software + sensors, installed |
| `device` | Standalone compliance box (VLTD or warning-only ADAS) |
| `tco_3yr` | Device + SIM + platform + install + AMC + registration over 3 years |
| `per_vehicle_month` | Subscription pricing |

**Rule: a price ratio may only be computed between two values of the same `price_scope`.**
Any cross-scope ratio must be labelled as such and is not a competitive claim.

## M2 — `unit_price_inr`
Point value or range, in INR, at the stated `price_scope`. Loaded cost (including NRE
amortisation at plan volume) is preferred over marginal cost where both exist.

## M3 — `certification_status_india`
`held` · `path` (in progress, not held) · `not_held` · `not_applicable` · `unknown`.
Applies to AIS-162 (AEBS), AIS-188 (LDWS), AIS-184/186/187 (rule 125Q).
No vendor in this cohort is evidenced as `held`.

## M4 — `function_scope`
`warning_only` · `warning_plus_aeb` · `perception_supply` · `tracking_only`.
This is the metric that separates DeepGrid from the substitute band, and it is the
metric the pricing argument should run on rather than unit price.

## M5 — `source_type` (evidence provenance)
`regulatory_gazette` / `regulatory_primary` > `vendor_primary` > `trade_press` >
`vendor_guide` > `derived_prior_run` > `none_found`.

## M6 — `evidence_strength`
`primary` (the instrument or the vendor itself) · `secondary` (reported) ·
`derived_prior_run` (carried from GBrain compiled findings, source rows not on this host) ·
`none`.

## M7 — `freshness`
`current` (≤12 months) · `older_than_12m` · `unknown_date`. Anything not `current` is
labelled wherever it appears.

## M8 — `confidence`
`high` (primary + current + corroborated) · `medium` (single credible source, or
derived) · `low` (single uncorroborated secondary) · `none` (UNVERIFIED).

## Deliberate non-metric

**No composite competitor score is produced.** With four of the seven cohort members at
`unit_price = UNVERIFIED` and no vendor holding certification, any ranked score would be
a ranking of source availability, not of competitive position. Producing one would breach
the contract's fail condition on undefined metrics behind charts. See `scoring-model.md`.
