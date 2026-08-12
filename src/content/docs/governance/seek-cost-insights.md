---
title: "Cost Insights"
description: "A direct cost comparison across your configured models for Seek traffic. BYOLLM instances only."
---

:::note
BYOLLM only. This page only appears on instances configured to bring their own LLM — it isn't
shown otherwise.
:::

## What is it

A single, focused chart comparing the cost of your configured models against each other for
Seek traffic.

## Why it matters

[Token Insights](/ns-docs/governance/seek-token-insights/) gives you the full breakdown of token
volume and speed; Cost Insights strips that down to the one question that usually matters when
you're choosing a model: which one is cheaper for what you're actually running.

## When to use it

- Comparing your selected model's cost against other configured or popular models before
  switching.
- Justifying a model change with a direct cost comparison rather than a vendor price sheet.

## How it works

**Model Cost Comparison** — a bar chart comparing the cost associated with each model configured
on the instance, scoped to Seek usage for the selected date range and filters.

## FAQ

### Why don't I see this page?

Cost Insights only renders on **BYOLLM** instances, the same gating as Token Insights and their
mAIstro equivalents.

### Does this include models I'm not currently using?

The comparison is scoped to your **configured** models — add a model card first if you want it
represented here, the same models used in [Model Comparison](/ns-docs/governance/seek-model-comparison/).

### How does this relate to Model Comparison?

Model Comparison runs a live test question across models and compares answer quality alongside
cost/latency. Cost Insights is a pure cost view over your actual historical Seek traffic, not a
one-off test run.
