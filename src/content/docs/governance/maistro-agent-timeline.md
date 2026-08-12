---
title: "Agent Timeline"
description: "Select a single agent and see its execution history as a zoomable timeline of concurrency delay and runtime, isolated from the rest of your agent fleet."
---

## What is it

A dedicated, single-agent version of the execution timeline. Search for and select one agent,
and the page renders only that agent's run history as a zoomable timeline — no fleet-wide charts,
no other agents mixed in.

## Why it matters

The same timeline exists embedded in [Agent Insights](/ns-docs/governance/maistro-agent-insights/),
but there it's showing every agent on the instance at once, which gets crowded fast. Agent
Timeline is the isolated view: pick one agent and see nothing but its own runs, which makes it
much easier to spot patterns (a run of slow executions, a burst of concurrency delay) that would
be lost in the fleet-wide chart.

## When to use it

- You already know which agent you care about and want its execution history without noise from
  every other agent.
- You're correlating a specific incident window against one agent's runs.
- You want a shareable, focused view of one agent's timeline rather than the whole fleet.

## How it works

1. **Select an agent** — use the search combobox at the top of the page. Until an agent is
   selected, the page shows an empty state prompting you to pick one.
2. Once selected, the page loads that agent's runs into a timeline showing:
   - **Concurrency Delay** — time a run spent waiting due to concurrency limits.
   - **Runtime** — actual execution time.
3. **Zoom in** / **Zoom out** / **Reset zoom** controls, plus hover-for-details and click-to-select
   on individual runs, work the same way as the timeline embedded in Agent Insights.
4. If the timeline fails to load for the selected agent, the page shows an explicit error state
   rather than a blank chart.

## FAQ

### How is this different from the timeline on Agent Insights?

Agent Insights shows the execution timeline for *every* agent on the instance, mixed together, as
one panel among several fleet-wide charts. Agent Timeline shows *one* agent's runs in isolation,
as the entire page.

### Can I compare two agents' timelines side by side?

No — the page shows one selected agent at a time. To compare agents against each other on
aggregate metrics rather than a run-by-run timeline, use
[Agent Details](/ns-docs/governance/maistro-agent-details/)'s "Agent compared to other agents"
panel.

### What does "concurrency delay" actually mean here?

It's the time a run spent queued before starting, caused by the instance's concurrency limits —
not the agent's own processing time. A high concurrency delay points at contention, not at the
agent being slow.
