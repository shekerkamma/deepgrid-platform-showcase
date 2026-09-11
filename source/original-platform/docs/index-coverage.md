# The retrieval problem was the corpus, not the ranker

**478 of 816 passages share a title with another passage.** The master deck and
its narration are two renderings of the same slides, and the benchmark scored
retrieval wrong every time it returned the twin — which answers the question
just as well.

Date: 2026-09-04.

## Finding 1 — question expansion covered a third of the corpus, because of two bugs

`build-knowledge-index.mjs` reported `question expansion: 1005 questions
attached to 247 passages`. 569 of 816 passages had none, and the index weights
questions double (`title title q q body`). All 328 video-narration passages had
zero.

It was not a quota ceiling. Two bugs in `scripts/expand-questions.mjs` made a
working free tier look exhausted:

- **`thinkingConfig` was sent to every model.** The `-lite` models answer that
  with a bare HTTP 400, and the error branch treats 400 as exhaustion — so the
  cheapest, highest-quota model was discarded on its first call of every run.
  `proxy/rerank-worker.js` already keys this off the model name; the expander
  never got the fix.
- **A per-minute 429 was treated as per-day exhaustion.** `PerDay` genuinely is
  exhaustion and pacing cannot clear it; `PerMinute` clears in ~30s and the
  response carries a `RetryInfo` saying how long to wait. Conflating them
  dropped a model permanently on its first busy moment, then reported "no model
  has quota left" over a tier that was fine.

Fixed, one model completed all 37 remaining requests. Coverage is now **816/816**.

## Finding 2 — expansion helps the passage that gets it, and slightly hurts its neighbours

On the 159 multi-hop questions, which were never indexed in either build:

| index | B@1 | B@4 | B@8 |
|---|---|---|---|
| old (247/816 expanded) | 15.7% | 51.6% | 69.8% |
| new (816/816 expanded) | 21.4% | 56.6% | 75.5% |

+5.7pp, but paired McNemar χ² = 2.78 — **not significant** at n=159. And on the
original 974 questions over the same 247 gold passages, the new index is
marginally *worse* (r@1 30.7% → 29.7%): 569 newly-expanded passages are 569 new
competitors. Expansion is worth doing for coverage, not because it lifts the
passages that already had it.

## Finding 3 — the real number was never 30.2%, and the real defect is duplication

30.2% r@1 was only ever measured on the 247 best-described passages. Measured
across all 816 with the full question set (2,855 questions):

| kind | r@1 strict | r@1 counting the twin | r@4 strict | r@4 +twin | n |
|---|---|---|---|---|---|
| Video narration | **6.8%** | **71.4%** | 40.4% | 88.7% | 1,075 |
| Slide | 21.5% | 51.0% | 52.4% | 75.9% | 643 |
| **Competitor** | **5.0%** | **10.8%** | **12.5%** | **20.8%** | 279 |
| Market research | 47.8% | 47.8% | 78.5% | 78.5% | 274 |
| Investor memorandum | 20.5% | 33.2% | 50.0% | 62.7% | 268 |
| **ALL** | **17.5%** | **50.3%** | **46.3%** | **71.8%** | 2,855 |

Narration goes from 6.8% to 71.4% once its twin counts as correct. The ranker
was finding a right answer and being marked wrong for it.

## What to do

1. **Deduplicate the corpus.** Merge each slide with its narration into one
   unit keyed on normalised title. 478 passages are involved; the corpus drops
   toward ~570, the largest source of wrong top-1 disappears, and the download
   shrinks. The index builder already has a Jaccard near-duplicate drop but
   applies it only to `published-pages.json` — it never runs across the
   slide/narration boundary.
2. **Fix the Competitor passages.** 5.0% r@1 and only 10.8% with twins, 20.8%
   r@4 — they are genuinely unretrievable, and duplication does not explain it.
   84 passages, the highest-value remaining defect.
3. **Re-baseline everything after 1 and 2.** The reranker's 33.0% → 50.5% was
   measured on the same easy 247 and needs re-measuring corpus-wide.
