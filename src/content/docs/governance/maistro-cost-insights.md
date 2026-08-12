---
title: "Cost Insights (mAIstro)"
description: "A direct cost comparison across your configured models for agent runs, filterable by agent. BYOLLM instances only."
---

:::note
BYOLLM only. This page only appears on instances configured to bring their own LLM.
:::

## What is it

The agent-run equivalent of [Cost Insights (Seek)](/ns-docs/governance/seek-cost-insights/): a
single bar chart comparing model cost, scoped to mAIstro agent runs instead of Seek calls.

## Why it matters

[Token Insights (mAIstro)](/ns-docs/governance/maistro-token-insights/) gives you the full
breakdown; this page strips it down to the one comparison that usually drives a model decision —
which configured model costs the least for your agent traffic.

## When to use it

- Comparing your selected model's cost against other configured models for agent runs
  specifically (rather than Seek traffic).
- Narrowing the comparison to a single agent to see its model cost in isolation.

## How it works

**Model Cost Comparison** — a bar chart comparing cost across your configured models, scoped to
agent runs for the selected date range. Use the **Filter** button to switch the comparison to
**Filter By Agent** and see the cost picture for one agent instead of the whole fleet.

## FAQ

### Why don't I see this page?

Cost Insights only renders on **BYOLLM** instances, the same gating as Token Insights and their
Seek equivalents.

### How is this different from the Seek version of Cost Insights?

This one is scoped to agent runs (mAIstro), and adds the ability to filter the comparison down to
a single agent. The Seek version compares model cost across grounded-answer traffic instead.
