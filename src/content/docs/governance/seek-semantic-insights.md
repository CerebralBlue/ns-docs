---
title: "Semantic Insights"
description: "How well Seek's answers are backed by your documentation — semantic score distribution, quality, hallucinated terms, and the allow-list flow that tunes future scoring."
---

## What is it

A dashboard focused entirely on semantic grounding: how closely Seek's answers track your
knowledge base, where they drift, and which terms the model tends to invent.

## Why it matters

Semantic score is the single best signal for "is this answer actually backed by our
documentation, or is the model filling gaps." This page is where you watch that signal move, and
it's the only place that lets you act directly on a specific problem term via **Allow Term**.

## When to use it

- Investigating a drop in answer quality or a spike in low-confidence answers.
- Finding recurring hallucinated terms so you can allow-list legitimate vocabulary your
  documentation doesn't literally contain (brand names, internal shorthand, etc.).
- Comparing semantic performance across the instance's category/intent/filter breakdown.

## How it works

**Toolbar:** date range and a **Filter** button opening a modal with two independent filters —
**Filter By Category** (segment your intent categories) and **Filter By Filter** (slice by the
runtime filters your Seek calls pass).

**Charts:**
- **Semantic Distribution** — a violin-style view of the normalized distribution of semantic
  metrics across traffic, so you see the shape of scores, not just an average.
- **Semantic Quality** — min/average/max across the instance's key quality metrics.
- **Hallucination Bloom** — a radial visualization of hallucinated-term frequency: terms the
  model generated that aren't backed by your source material, clustered by how often they occur.
- **Top Hallucinated Terms** — the most frequently flagged terms, listed alongside the bloom
  chart.

**Allow Term flow:** click any term in Top Hallucinated Terms and a confirmation modal opens —
*"Allow the term: '\<term\>'?"* Confirming adds it to your instance's **allowedWords** list.
Allow-listed terms stop counting as hallucinations and no longer take a semantic-match penalty.
You can verify this landed by checking **Configuration → Semantic model tuning → Semantic
Scoring** — the allowed term appears in the list of phrases exempt from penalty.

## FAQ

### What's the difference between this page and the "Semantic analytics" concept page?

[Semantic analytics](/ns-docs/governance/semantic-analytics/) explains the *concept* — what
semantic scoring is and how it works generally. This page is the live *dashboard* — the actual
charts showing your instance's current semantic performance.

### Where do older metrics like "Longest Source Phrase" or "Answer Source Jumps" show up now?

Those metrics still exist as `semanticDetails` fields on the `/seek` API response, but they are
no longer presented as panels on this dashboard — they're API-level detail now, not a governance
chart.

### Does allow-listing a term affect past answers?

No — it changes scoring for future Seeks. Past logged answers keep whatever semantic score they
were given at the time.

### Can I filter this dashboard the same way as other Governance pages?

Yes — the **Filter** modal here supports both **Filter By Category** and **Filter By Filter**,
the same pattern used across most Governance dashboards.
