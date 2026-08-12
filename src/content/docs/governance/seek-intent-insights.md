---
title: "Intent Insights"
description: "Coverage and confidence broken down by intent, over an adjustable lookback period, so you can see which intents are well-supported and which aren't."
---

## What is it

A dashboard that breaks Seek's coverage and confidence down **by intent** — the categories your
questions get classified into — instead of showing one instance-wide number.

## Why it matters

An instance-wide average can hide a badly-served intent behind a handful of well-served ones.
This page shows you per-intent performance directly, sorted by frequency, so you can tell exactly
which category of questions needs attention.

## When to use it

- Finding which intents are under-covered or low-confidence, so you know where to focus
  documentation or configuration effort.
- Checking whether a recent change (new content, a config tweak) improved a specific intent's
  performance.
- Adjusting your analysis window to see whether a problem is recent or long-standing.

## How it works

- **Lookback Period (Days)** — a slider (1–30 days) that controls how far back the charts look.
  Move it to see coverage and confidence over a shorter or longer recent window.
- **Coverage Insights** — a distribution chart of coverage percentage per intent, sorted by how
  frequently each intent occurs. High coverage means questions in that intent are well supported
  by your knowledge base; low coverage flags a gap.
- **Confidence Insights** — the same layout for confidence: how sure the system is about the
  answers it gives within each intent, again sorted by frequency.

## FAQ

### What counts as an "intent" here?

The same intent categories used across the rest of the product — the classification your Seek
traffic gets grouped into, editable from Configure → Multi-agent routing & categories.

### Why is this sorted by frequency instead of alphabetically?

So the intents that actually matter most to your traffic show up first — a rarely-hit intent with
low coverage is a much lower priority than a high-volume one with the same problem.

### Does the lookback period affect other Seek Governance pages too?

No — the Lookback Period slider on this page is scoped to Intent Insights. Other dashboards use
the shared date-range picker in their own toolbar.
