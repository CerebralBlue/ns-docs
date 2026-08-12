---
title: "Agent Details"
description: "The per-agent drill-down dashboard — latency percentiles, guardrail hits, the invocation tree, and how one agent compares to the rest of your fleet."
---

## What is it

A drill-down dashboard for a single agent, selected from a search combobox. Where
[Agent Insights](/ns-docs/governance/maistro-agent-insights/) is fleet-wide, this page is the one
an engineer opens to debug why *one* agent is slow, failing, or expensive.

## Why it matters

Fleet averages hide the timeouts your users actually notice — especially when the agent is
called from a chat platform with a hard response timeout. This page surfaces the tail (P95,
Peak), not just the mean, and it's the only place in the product that reports guardrail
enforcement scoped to a single agent.

## When to use it

- An agent is timing out or running slower than expected and you need to know why.
- You need to know whether a specific agent trips guardrails more than others.
- You're mapping out which sub-agents a multi-agent flow actually calls, and how deep the chain
  goes (relevant for `maistro`, `maistroSandbox`, and `customConnector` nodes).
- You want to know if an agent's slowness is normal for it, or unusual compared to your other
  agents.

## How it works

Pick an agent from the **Agent** search box, then choose a date range. The dashboard loads:

**KPI cards:**
- **Invocations** — how many times the agent ran in the selected period.
- **Average run time** — mean latency.
- **P50** — median latency.
- **P95** — tail latency. This is the number that matters against a hard timeout: averages can
  look healthy while a meaningful share of runs are timing out.
- **Peak** — the single slowest observed run.
- **Guardrails hit** — how many times this agent's runs tripped a guardrail.

**Agent invocation tree** — which child agents this agent calls, and how deep the chain runs.
Essential once agents start calling other agents through `maistro`, `maistroSandbox`, or
`customConnector` nodes. A control lets you switch what the link width represents: **Equivalent
Seeks**, **Runtime**, or **Invocations**.

**Time in phase** / **Phase mix** — where the agent's run time goes, broken down by execution
phase (as an average-time chart and a share-of-runtime donut, respectively).

**Latency over period** — per-run runtime plotted across the selected date range, so you can spot
trends or a specific bad day.

**Latency distribution** — a violin plot of observed run latency, showing the *shape* of latency
(bimodal vs. consistent), which a single average can't.

**Time of day of runs** — invocation volume by hour of day, useful for spotting when this agent's
load actually happens.

**Agent compared to other agents** — this agent's metrics laid out against the average across the
rest of your agent fleet, so you know whether what you're seeing is normal for this agent or an
outlier.

## FAQ

### Why does P95 matter more than the average here?

Because a chat integration or virtual agent usually has a fixed timeout. An agent can have a
perfectly reasonable average run time while a meaningful share of its runs blow past that
timeout — P95/Peak is what tells you that's happening.

### Does "Guardrails hit" tell me *which* guardrail?

The KPI reports the count of guardrail activations for this agent; for what was actually blocked
and why, check the agent's run logs — see [mAIstro Logs](/ns-docs/governance/maistro-logs/).

### How deep can the invocation tree go?

As deep as your agents actually call each other — the tree reflects real `maistro` /
`maistroSandbox` / `customConnector` calls, so a flow with several layers of sub-agents will show
several layers in the tree.
