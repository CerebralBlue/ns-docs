---
title: "Custom dashboards"
description: "Custom dashboards live in the Custom Governance group of Governance: open the Agent Growth and Users dashboards, start a new one with Add Dashboard, and use the Edit switch that Add Panel and Delete Dashboard depend on."
---

Custom dashboards are the part of [Governance](/governance/overview/) you shape yourself. The built-in Seek Governance and mAIstro Governance dashboards cover what NeuralSeek measures out of the box; a custom dashboard holds the views they do not have — a growth curve, a user count, a list of who logged in — each in its own panel, drawn by a [mAIstro agent](/maistro/overview/). This page is for admins who read those dashboards and for the developers who build what goes on them.

The **Custom Governance** group here is not the same thing as [custom governance agents](/governance/guardrails/custom-governance-agents/), which check answers inside [Guardrails](/governance/guardrails/overview/). The two only share a name.

## Where to find it

Select **Governance** in the top navigation. In the Governance side navigation, open the **Custom Governance** group, below Seek Governance and mAIstro Governance, and select a dashboard by name. Each dashboard opens at its own address, so you can bookmark the one you use most. **Add Dashboard** is the last item in the group.

## Dashboard settings

### Custom Governance dashboards

![The Agent Growth dashboard: the Custom Governance group (Agent Growth, Users) in the Governance side navigation, and above the Agent Growth panel the toolbar with Add Panel, Delete Dashboard, the status All Agents finished. and the Toggle Edit mode switch, labelled Edit, turned off](/img/governance/agent-growth.png)

Every dashboard in the group is a link; select one to open it.

<!-- UNCONFIRMED: Agent Growth and Users are seeded automatically the first time anyone opens Custom Governance — old Custom Governance page and the route's gap list -->

Two dashboards, **Agent Growth** and **Users**, are created for you the first time anyone opens Custom Governance, so you will find them in the group even if nobody on your team built them.

| Dashboard         | Panels, by title                                    | What they show                                                                                                                                                   |
| ----------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Agent Growth**  | **Agent Growth**                                    | A line chart titled Agent Growth that plots the number of agents, under the legend "Agents".                                                     |
| **Users**         | **GUI Logins**, **Seek Users**, **mAIstro Users**   | **GUI Logins** lists the console users with the date each one last logged in; **Seek Users** shows a single count; **mAIstro Users** is the third panel, below them. |

The title above a panel belongs to the panel. The content inside it can carry its own heading: the **GUI Logins** panel, for example, shows its list under the heading "GUI Users".

To start a new dashboard, select **Add Dashboard** at the end of the **Custom Governance** group.

### Toolbar and edit mode

A toolbar runs across the top of every custom dashboard, above its panels:

| Control              | What it does                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **Add Panel**        | Adds a panel to the dashboard you have open. Disabled while **Edit** is off.                     |
| **Delete Dashboard** | Deletes the dashboard you have open. Disabled while **Edit** is off.                             |
| Status text          | Reads **All Agents finished.** once every panel on the dashboard has loaded.                     |
| **Edit**             | The switch at the right end of the toolbar that turns edit mode on and off.                      |

With **Edit** off, **Add Panel** and **Delete Dashboard** are greyed out. To toggle Edit mode, select the **Edit** switch.

<!-- UNCONFIRMED: switching Edit on enables Add Panel and Delete Dashboard, and Add Panel asks for the agent, a title and the tile size (columns and rows) — inferred from both buttons being disabled with Edit off; old Custom Governance page -->

With edit mode on, **Add Panel** and **Delete Dashboard** become available. **Add Panel** asks which agent fills the panel, what title it shows and how large the tile is.

:::caution
**Delete Dashboard** deletes the whole dashboard you have open, not a single panel. Check the dashboard name in the side navigation before you select it.
:::

<!-- UNCONFIRMED: each panel is a mAIstro agent that runs when the dashboard opens, and every panel load is an agent run — old Custom Governance page and the route's gap list; the status text "All Agents finished." is consistent with it -->

What a panel shows is the output of a mAIstro agent, which runs when you open the dashboard; the status text tells you when every panel's agent has finished. Every panel load is an agent run, so a dashboard with many panels runs as many agents each time you open it. To build an agent whose output a panel can draw, use the chart and telemetry nodes described in [Charts and telemetry](/maistro/ntl/charts-and-telemetry/). To run an agent on demand rather than from a dashboard panel, use [Run agents](/maistro/run-agents/).

## FAQ

### Why are Add Panel and Delete Dashboard greyed out?

<!-- UNCONFIRMED: switching Edit on enables Add Panel and Delete Dashboard — inferred from both buttons being disabled with Edit off; the route's gap list -->

Both buttons are disabled while the **Edit** switch at the right end of the toolbar is off. Switch it on to change the dashboard — see [Toolbar and edit mode](#toolbar-and-edit-mode).

### Where do I create a new dashboard?

Select **Add Dashboard**, the last item of the **Custom Governance** group in the Governance side navigation.

## Related

- [Governance overview](/governance/overview/) — the side navigation and its Seek Governance, mAIstro Governance and Custom Governance groups.
- [Reading the dashboards](/governance/analytics/reading-the-dashboards/) — filters and date ranges on the built-in dashboards.
- [mAIstro overview](/maistro/overview/) — the agents behind dashboard panels.
- [Charts and telemetry](/maistro/ntl/charts-and-telemetry/) — the NTL nodes an agent uses to draw a chart.
- [Run agents](/maistro/run-agents/) — run agents from the console on demand.
- [Custom governance agents](/governance/guardrails/custom-governance-agents/) — a different feature: agents that check answers in Guardrails.
