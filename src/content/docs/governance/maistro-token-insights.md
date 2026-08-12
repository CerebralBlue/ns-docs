---
title: "Token Insights (mAIstro)"
description: "Token consumption for agent runs — totals, per-run averages, cache savings, and which model is driving cost across your agent fleet. BYOLLM instances only."
---

:::note
BYOLLM only. This page only appears on instances configured to bring their own LLM.
:::

## What is it

The agent-run equivalent of [Token Insights (Seek)](/ns-docs/governance/seek-token-insights/):
token consumption, cost, and cache savings scoped to mAIstro agent runs instead of Seek calls.

## Why it matters

Agents can be far more token-hungry than a single Seek — a multi-step flow can call several
models across several nodes in one run. This page breaks that down per run and per model, and
surfaces how much your cache is actually saving you, which the Seek version doesn't show as
prominently.

## When to use it

- Investigating why agent costs jumped, and whether it's volume, a specific model, or longer
  outputs.
- Sizing expected spend for a new agent before rolling it out broadly.
- Checking whether caching is meaningfully reducing token spend for repeat runs.

## How it works

**Metric cards:**
- **Total Tokens** — input + generated token volume for the period.
- **Total Token Cost** — estimated spend by token direction (input vs. generated).
- **NeuralSeek Cache Savings** — estimated cost avoided because a run was served from cache
  instead of re-generating.
- **Token Generation per Second** — generation speed distribution (min/avg/max).
- **Input Tokens per Run** / **Generated Tokens per Run** — prompt and output token distribution
  per run.
- **Cost per 1k Runs** — estimated cost per 1,000 runs, from your configured model pricing.
- **Cached Input Tokens per Run** / **Cached Generated Tokens per Run** — the same distributions,
  scoped to cached runs specifically.
- **Cache Savings per 1k Runs** — estimated per-run savings attributable to cache reuse.
- **Cached Token Volume** / **Token Direction Mix** — how much of your total token volume was
  served from cache, and the input/generated split for the selected range.

**Charts:**
- **Tokens over Time** — total tokens plus input/generated detail, broken out by model.
- **Token Distribution** — a violin chart of token events across the range.
- **Agent Runs** — a donut chart of run volume by agent (filterable by agent from the Filter
  button).
- **Agent Run Ranking** — every agent ordered by run count.
- **LLM Cost Ranking** — estimated token cost by model.
- **LLM Token Mix** — total input and generated token volume by model.

## FAQ

### Why don't I see this page?

Token Insights (and Cost Insights) only render on **BYOLLM** instances — the same gating as the
Seek versions.

### What's the "Cache Savings" framing that Seek's Token Insights doesn't emphasize as much?

Agent runs are more likely to repeat similar inputs (scheduled runs, recurring dashboards), so
cache reuse tends to matter more for cost. This page surfaces cache savings as first-class
metrics rather than a side note.

### Can I filter this down to one agent?

Yes — use the **Filter** button; **Agent Runs** and related charts respond to a "Filter By Agent"
selection.
