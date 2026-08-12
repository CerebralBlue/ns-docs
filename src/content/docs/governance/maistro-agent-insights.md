---
title: "Agent Insights"
description: "The fleet-level dashboard for mAIstro agents — run volume, guardrail activity, per-node timing, and execution timeline across every agent on the instance."
---

:::note
This page replaces what older documentation called **"Flow Insights"**. That page no longer
exists — the panels below are the current dashboard.
:::

## What is it

The default landing dashboard for mAIstro Governance: aggregate metrics across every agent
running on the instance, for the selected date range and optional category/intent filter.

## Why it matters

Before drilling into one agent (see [Agent Details](/ns-docs/governance/maistro-agent-details/)),
this is where you spot fleet-wide problems — a spike in guardrail hits, one node type that's
slow everywhere, or a small number of agents dominating run volume.

## When to use it

- A daily/weekly check of overall agent health and run volume.
- Spotting which agents are running the most, so you know where to focus optimization.
- Finding which node type is the bottleneck across your whole agent fleet (not just one agent).
- Confirming guardrail enforcement is behaving as expected across mAIstro traffic.

## How it works

**Toolbar:** a date-range picker and a **Filter** button that opens a modal to filter the
dashboard by intent category.

**Metric cards:**
- **Total time** — aggregate execution time across agent runs in the period.
- **Model hits** (Equivalent Seeks) — how much LLM usage the agent fleet generated, expressed in
  Seek-equivalent units.
- **Concurrency delay** — time runs spent waiting because of concurrency limits.

**Charts:**
- **Template distribution** — a pie chart of runs by agent template.
- **Guardrails** — guardrail activity across the agent fleet.
- **Agent Run Ranking** — a wide chart ranking agents by run count/cost/duration, so you can see
  at a glance which agents dominate usage.
- **Component Timing (Guitar Chart)** — per-node timing across all runs on the instance, laid out
  so you can see which node *type* is the bottleneck across your whole agent fleet, not just one
  run.
- **Radar chart** and **Template time** chart — comparative timing views across templates.
- **Agent Execution Timeline** — a zoomable Gantt-style timeline of individual agent executions,
  showing **Concurrency Delay** (grey) and **Runtime** (blue) per run. Hover a bar for details,
  click a run to select it, and use **Zoom in** / **Zoom out** / **Reset zoom** to navigate. This
  is the fleet-wide timeline; for one agent's own execution history in isolation, use
  [Agent Timeline](/ns-docs/governance/maistro-agent-timeline/).

## FAQ

### What happened to "Flow Insights"?

Nothing here maps to a "flow" concept anymore — the feature was replaced by the current Agent
Insights dashboard. If older material references "Flow Insights", treat it as superseded by this
page.

### What's the difference between this page and Agent Timeline?

Agent Insights shows the timeline for *all* agents at once, alongside fleet-level metrics like
guardrails and run ranking. Agent Timeline is a dedicated page where you pick a single agent and
see only its execution history, without the rest of the fleet.

### What's the difference between this page and Agent Details?

Agent Insights is fleet-wide (every agent, aggregated). Agent Details is per-agent — pick one
agent and get latency percentiles, its invocation tree, and how it compares to the rest of your
fleet. See [Agent Details](/ns-docs/governance/maistro-agent-details/).
