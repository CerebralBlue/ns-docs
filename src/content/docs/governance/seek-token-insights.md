---
title: "Token Insights"
description: "Token consumption for Seek — totals, per-Seek averages, generation speed, and which model is eating your budget. BYOLLM instances only."
---

:::note
BYOLLM only. This page only appears on instances configured to bring their own LLM — it isn't
shown otherwise.
:::

## What is it

A token-consumption dashboard scoped to Seek traffic: how many tokens you're using, how fast
they're generated, and which model is driving the cost.

## Why it matters

Token usage is where LLM cost actually lives. This is the page that tells you whether a cost
spike is coming from input size, output length, a specific model, or traffic volume — instead of
just seeing one combined bill.

## When to use it

- Investigating a token/cost spike and needing to know if it's volume, model choice, or verbose
  answers.
- Comparing token intensity across your configured models before consolidating on one.
- Sizing expected spend for a new integration based on current per-Seek token averages.

## How it works

**Metric cards:**
- **Total Tokens** — input tokens, generated tokens, and their sum for the period.
- **Total Token Cost** — cost broken into input-token cost, generated-token cost, and total.
- **Input Tokens** / **Generated Tokens** — min/average/max per Seek, so you see the range, not
  just a total.
- **Seek Cost** — cost per unit of Seek volume (for example, per 1,000 Seeks).
- **Token Speed** — token generation rate, in tokens per second.

**Charts:**
- **Tokens over Time** — a time series of total, input, and generated tokens.
- **Token Distribution** — a violin chart of token usage spread by model.
- **LLM Token Intensity** — total token intensity and the generated-token share per model, so you
  can see which model is eating your budget.
- **Cost Orbit** — a visualization of cost split across model, input, and generated usage.
- **Filter Landscape** — token/cost activity broken down by category, intent, and the runtime
  filters in play, sized by activity.

## FAQ

### Why don't I see this page?

Token Insights (and Cost Insights) only render on **BYOLLM** instances. If your instance uses
NeuralSeek-managed models exclusively, this page — and its mAIstro equivalent — won't appear in
the sidebar at all.

### What's the difference between this page and Cost Insights?

Token Insights is about token *volume* and *speed*. [Cost Insights](/ns-docs/governance/seek-cost-insights/)
is a focused comparison of $ cost across models. They're two views over the same underlying data.

### What's "LLM Token Intensity" actually measuring?

How token-heavy a model's usage is relative to others — a model with a high generated-token share
here is producing longer answers per Seek, which is worth knowing before assuming a cost
difference is purely about per-token pricing.
