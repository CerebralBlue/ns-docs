---
title: "Documentation Insights"
description: "How your knowledge base performs as a source: confidence and coverage, which documents and URLs actually get used, and what users think of the answers."
---

## What is it

A dashboard that scores your **knowledge base**, not the model — confidence, coverage, which
documents and URLs are actually pulling weight, and how users rate the answers those documents
produced.

## Why it matters

A model can only be as good as what it's grounded on. This page tells you whether your knowledge
base is thin, whether a handful of documents are carrying all the traffic, and whether users
are actually satisfied with the answers your content supports.

## When to use it

- Deciding what to add to or clean up in your knowledge base.
- Finding your most-relied-on documents and URLs, so you know what breaks answer quality if it
  goes stale or gets removed.
- Pulling user satisfaction data on documentation quality for a review.

## How it works

**Toolbar:** date range and the standard **Filter** modal (Filter By Category / Filter By
Filter).

**Metric cards:**
- **KnowledgeBase Confidence** — min/average/max confidence score across the instance.
- **KnowledgeBase Coverage** — min/average/max coverage percentage: how much of the relevant
  material actually gets surfaced.

**Charts:**
- **Most Referenced Documents** — which documents get pulled into answers most often.
- **Most Referenced URLs** — the same breakdown at the URL level.
- **User Ratings** (violin chart) — the distribution of user ratings on answers, not just an
  average.
- **Guitar chart** — per-document or per-source timing/usage comparison.
- **Document flow (Sankey)** and **chord diagram** — how documents relate to and feed into the
  answers generated across your traffic.
- **Ratings** panel — the underlying rating detail feeding the User Ratings chart.

**Download ratings CSV** — exports the underlying user-rating data for offline analysis.

## FAQ

### What counts toward "Most Referenced Documents"?

Any knowledge base document that was actually cited or used to generate an answer during the
selected period — not just documents that exist in the KB.

### Can I export anything besides ratings?

The **Download ratings CSV** button is scoped to rating data specifically. For raw Seek/answer
logs, use the Seek Logs dashboard instead.

### How is "Coverage" different from "Confidence"?

Confidence is how sure the system is about the match it found. Coverage is how much of the
*relevant* material in your knowledge base actually got surfaced for a given question — a
low-coverage, high-confidence result usually means your KB has a gap next to the one document
it did find.
