---
title: "mAIstro Logs"
description: "The run-level log table behind the Agent Details aggregates — every agent run, who triggered it, how long it took, and a replay link when Corporate Logging is on."
---

## What is it

A searchable, sortable table of individual agent runs — the row-level record that
[Agent Details](/ns-docs/governance/maistro-agent-details/)'s aggregate metrics (Invocations,
P50/P95, latency charts) are computed from.

## Why it matters

Aggregates tell you *that* something is slow or failing; this page is where you find the actual
run to look at. It's the equivalent, for agents, of the **Seek Logs** page (Seek Governance) for
grounded answers.

## When to use it

- You saw a spike in an Agent Details metric and want to find the specific runs behind it.
- You need to confirm which user or session triggered a particular agent run.
- You want to replay a past run to see exactly what happened, step by step.

## How it works

The table lists one row per agent run, with columns:

| Column | What it shows |
|---|---|
| **Date** | When the run happened |
| **RunId** | The run's unique identifier |
| **User** | The user associated with the run |
| **Agent** | Which agent ran |
| **Runtime (ms)** | How long the run took |
| **Link** | A replay link, when available |

- Click any column header to sort by it (ascending → descending → unsorted).
- Rows can be paged and searched.
- Every row can be exported — a CSV download is available for the current view.
- **Replay** only appears when **Corporate Logging** is enabled on the instance. With logging
  enabled, each row's Link opens `./maistro?replay=<runid>` — the same run, replayed step by step.
  Without it, the Link column has nothing to open. See
  [Real-time logging](/ns-docs/governance/logging/) to turn Corporate Logging on.

## FAQ

### Why can't I replay a run?

Replay depends on **Corporate Logging** being enabled on the instance at the time the run
happened — logging has to be on *before* the run, not just before you try to replay it. Runs that
happened while logging was off have nothing to replay.

### Can I filter the log table by agent or user?

Yes — use the table's search to narrow the rows to a specific agent name or user, the same way you
would on the Seek Logs page.

### Is this the same data as Agent Details?

It's the same underlying runs, but presented differently: Agent Details aggregates them into KPIs
and charts for one selected agent; mAIstro Logs is the flat, searchable list of every run across
every agent.
