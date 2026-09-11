# Does a knowledge graph replace passage retrieval for the A2UI dossier agent?

**The extraction is worth keeping. The graph is not.** LLM-written entity labels
used as a second index lift r@1 from 30.2% to 32.4% (χ² = 5.01, significant).
Graph *traversal* makes retrieval worse, and on every test the real edges
perform no better than edges rewired at random.

Date: 2026-09-04. Corpus: the 816 passages behind the A2UI Briefing Agent.
Graph: 1,113 nodes, 1,718 edges, 29 hyperedges from 8 extraction chunks.

## Setup

Semantic extraction over the full dossier: 816 passages exported to 17
source-grouped markdown files (~520 kB), extracted against
`graphify/references/extraction-spec.md`. Graph provenance is file-level —
`source_location` is null on 65% of nodes — so nodes were re-linked to passages
deterministically by scoring each node label against only the passages from its
own source file. At a 0.5 link threshold, 67.8% of passages carry a node.

## Test 1 — factoid retrieval (1,001 questions, leave-one-out)

Identical protocol to `scripts/eval-rerank.mjs`. Each question is subtracted
from its own passage before scoring; without that, lexical scores 98%.

| retriever | r@1 | r@4 |
|---|---|---|
| lexical (live engine's BM25) | 30.2% | 58.2% |
| graph traversal alone | 17.2% | 35.2% |
| **BM25 + node labels, no traversal** | **32.4%** | **60.2%** |

The hybrid gain is real and stable across boost 0.2–0.45 — paired McNemar
χ² = 5.01 at the best setting (th 0.5, hops 0, boost 0.3).

**An earlier run of this same benchmark said the gain was noise (χ² = 0.52).
That was measured on 6 of 8 chunks, before the competitor and research
extractions landed, at 42.9% passage coverage instead of 81.2%. The conclusion
inverted when the data completed.**

## Test 2 — the relational claim (159 multi-hop questions)

Factoid questions are what GraphRAG is known to lose at, so the relational case
needed its own test. Construction: a model reads passage A and writes a question
whose *answer* lives in passage B from a **different source document**, without
quoting B's distinctive terms. Gold is B. Nothing in the construction touches the
graph — building questions from the graph and then testing the graph is circular.

| retriever | answer B in top-4 | top-8 |
|---|---|---|
| lexical | **51.6%** | **69.8%** |
| graph traversal | 8.8% | 19.5% |
| hybrid | 48.4% | 67.9% |

The graph loses badly, and the hybrid is *worse than lexical alone* here.

Two earlier constructions of this test were invalid and were thrown away. The
first paired entities and put **both** endpoints in the query — a two-term
lexical lookup, which BM25 "won" at 96.5%. The second built an entity vocabulary
from capitalisation, which on OCR'd ALL-CAPS text admitted *operating*, *proven*
and *their counter* as entities. Both produced a confident number that measured
nothing.

## The finding that settles it: random edges beat real edges

The negative control, run on both tests — rewire every edge to a random target:

| test | real edges | **randomly rewired** | no edges |
|---|---|---|---|
| factoid, graph r@1 | 17.2% | 16.7% | **19.7%** |
| multi-hop, graph B@8 | 19.5% | **21.4%** | — |
| multi-hop, hybrid B@8 | 67.9% | **69.8%** | — |

Rewiring the graph at random does not degrade it. Deleting the edges entirely
improves it. The edges carry no relational signal on either workload, and
traversing them pulls in unrelated passages — hops 0 → 19.7%, hops 1 → 17.2%,
hops 2 → 15.4%.

What *does* work is the node labels: LLM-written, distilled restatements of
passage content, matched lexically. That is document expansion, a well-known
technique, and it does not need a graph. A second contributing factor is that
cross-document entity unification never happened — exact dedup found 11
cross-file nodes in 1,113, because each extraction agent invented its own label
vocabulary ("SoC2 — the 28 nm perception die", "SoC2 Six-Chiplet Combo Die",
"28 nm Perception SoC (the shared die)"). A code-token resolution pass raised
that to 25 and changed nothing measurable (χ² = 0.10).

## Recommendation

**Ship:** BM25 + the extracted node labels as a second lexical index, boost 0.3,
**zero traversal**. +2.2pp r@1, +2.0pp r@4, free at query time. Drop the edges
and hyperedges from anything that ships.

**Keep:** the Gemini reranker (33.0% → 50.5% r@1 at 0.25s). It is a ranking fix
applied where recall already exists, and it is worth an order of magnitude more
than the graph.

**Do not:** put graph traversal in the retrieval path.

## Caveats

- The multi-hop questions are only partially decontaminated: question terms
  appear in the answer passage 34.0% of the time against 36.1% for the anchor
  passage and a 4.2% random floor. So lexical can partly reach B by vocabulary,
  and the absolute difficulty of Test 2 is softer than intended. **The
  shuffled-edge control is unaffected by this** — it is a within-graph
  comparison — so the verdict on the edges holds regardless.
- Figures sourced only from OCR passages were extracted as AMBIGUOUS at ≤0.3 so
  `1,338 Cr` cannot enter as a confident fact. That adjudication is still open.

## Status, added 2026-09-05

**The graph this benchmarked no longer exists.** It was built under
`/tmp/dossier-graph/`, which is gone; `graphify-out/` in this repo is a
different artifact — a graph of the TypeScript source, nodes `Hit`, `KIndex`,
`KUnit`, `SkuData` — and is gitignored. The reproduce steps below need the
extraction re-run.

**The shippable recommendation has not been re-validated and should not be
taken on trust.** It rests on leave-one-out r@1 rising 30.2% → 32.4%, and that
metric was since established as invalid for answer quality: the gold label
points at whatever passage a question was generated from, OCR'd pages included.
A fifth of the corpus is OCR sludge, and `retrieve()` now demotes it, which cost
12 points of r@1 on purpose. So +2.2pp on r@1 may be a gain in returning *more*
of what the readability work removed.

If document expansion is retried, judge it on
`loops/ask-dossier/harness/answer-quality.mjs` (fatal-free queries out of 64)
and the `sweep.mjs` out-of-scope control, not on r@1 alone. Node labels are a
reasonable idea on their own merits — they are distilled restatements, which is
document expansion and needs no graph — but the number quoted above is not
evidence for it under the current engine.

**What still holds unchanged** is the negative result, because it is a
within-graph comparison unaffected by any of this: rewiring every edge at random
does not degrade the graph, and deleting the edges improves it. Do not put graph
traversal in the retrieval path.

## Reproduce

    python3 /tmp/dossier-graph/build/merge_graph.py
    python3 /tmp/dossier-graph/build/link_passages.py 0.5
    node    /tmp/dossier-graph/build/bench-graph.mjs --th 0.5 --boost 0.3 --hops 0
    node    /tmp/dossier-graph/build/bench-graph.mjs --th 0.5 --hops 2 --shuffle-edges
    node    /tmp/dossier-graph/build/gen-multihop.mjs --n 160     # Gemini, 15 RPM
    node    /tmp/dossier-graph/build/score-multihop.mjs --k 8 --th 0.5
    node    /tmp/dossier-graph/build/score-multihop.mjs --k 8 --th 0.5 --shuffle-edges
