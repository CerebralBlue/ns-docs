---
title: "Custom Governance"
description: "Build your own governance dashboards where every panel is a mAIstro agent — pick a template, size the tile, and NeuralSeek runs the agent and renders its output on load."
---

## What is it

Custom Governance is a dashboard builder built directly into the Governance section. Unlike every
other page in Governance, its panels aren't fixed, product-defined charts — **every panel is a
mAIstro agent**. You choose which agent template backs each panel, size the tile, give it a
title, and NeuralSeek runs that agent and renders whatever it returns.

This is the key thing to understand about the whole feature: you build a custom governance view
not by configuring a chart, but by writing (or picking) an agent that pulls telemetry from your
instance and renders it with a chart node.

## Why it matters

The built-in Governance dashboards (Seek Governance, mAIstro Governance) cover what NeuralSeek
ships out of the box. Custom Governance is the escape hatch for everything else: any metric,
combination, or visualization you can express as an agent, you can pin to a dashboard here and
have it run automatically every time you open it.

## When to use it

- You need a metric or cross-cutting view the built-in dashboards don't have.
- You want a single-screen dashboard combining data that normally lives on separate pages.
- You're already building instance-telemetry agents and want a home to display their output
  besides re-running them manually every time.

## How it works

### Dashboards

- Each dashboard is a named tab in the **Custom Governance** section of the sidebar. Dashboards
  persist server-side, with a `localStorage` fallback keyed to your instance if the server call
  fails.
- **Add Dashboard** creates a new, empty dashboard. **Delete Dashboard** removes the current one
  (only available with more than one dashboard on the instance, so you're never left with zero).

### The two dashboards you'll see on first visit

The first time anyone opens Custom Governance, NeuralSeek seeds two dashboards automatically so
the section isn't empty:

- **Agent Growth** — one panel running the built-in `ex_Agent_Growth` template.
- **Users** — three panels: `ex_User_Logins` (GUI logins), `ex_seek_users` (Seek users), and
  `ex_maistro_users` (mAIstro users).

If you see these and didn't create them, that's why — they're the default seed, not something a
teammate built.

### Panels

- **Edit mode** (toggle at the top of the dashboard) lets you add, resize, and reconfigure panels.
  Turn it off and the dashboard runs in **run mode** — panels execute in sequence as the dashboard
  loads, with no editing controls visible.
- **Add Panel** creates a new tile. For each panel you choose:
  - **Template** — which agent backs this panel.
  - **Cols** / **Rows** — how large the tile is in the dashboard grid.
  - **Title** — the panel's display title.
- **Set agent Parameters** — a per-panel modal where you set the parameters passed into the
  agent every time it runs, so the same agent template can power different panels with different
  inputs.
- Panels run **sequentially**, not all at once, when a dashboard loads.

### What makes an agent panel-eligible

Any agent can technically be picked as a panel's template, but a panel is only useful if the agent
actually returns something worth rendering. In practice that means the agent uses:

- One of the **telemetry nodes** to pull instance data: `usersData`, `seekUsersData`,
  `maistroUsersData`, or `agentsData`.
- One of the **chart nodes** to render it: `barChart`, `lineChart`, `pieChart`, `areaChart`,
  `doughnutChart`, or `bubbleChart`.

Put together: a custom governance panel is an agent that pulls telemetry with one of the four
telemetry nodes and renders it with one of the six chart nodes. That's the whole pattern behind
every panel on this page, including the two seeded dashboards above.

## FAQ

### Do I need to write NTL to use Custom Governance?

To use an *existing* agent template as a panel, no — just pick it from the template list when
adding a panel. To build a *new* kind of panel, yes: you (or whoever owns your agents) write a
mAIstro agent using a telemetry node plus a chart node.

### Can two people share the same dashboard?

Dashboards are stored per instance, so anyone with access to the instance's Governance section
sees the same set of dashboards and panels.

### Why does a panel show nothing after I add it?

Either the template hasn't been assigned yet, or the underlying agent didn't return chart data —
check that the panel's template is set and that the agent actually uses a telemetry + chart node
pair as described above.

### Is this the same engine as Run Agents?

Custom Governance and **Run Agents** share the same underlying panel/agent-runner model — an
agent template, its parameters, and a rendered output. If you're already familiar with Run Agents,
the panel-configuration pattern here will feel familiar.
