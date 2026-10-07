---
title: "Run Agents"
description: "Run Agents is the console screen where you open a dashboard and its panels run their mAIstro agents and show the results, so people can use agents without building them."
---

**Run Agents** is where people who use agents, rather than build them, go to get work done. Each item under **Agent Dashboards** is a dashboard, and each panel on a dashboard shows the result of a [mAIstro](/maistro/overview/) agent. When you open a dashboard, its agents run and their results appear in the panels. Run Agents works like the [custom dashboards](/governance/analytics/custom-dashboards/) in Governance, with the same toolbar and the same panels. The difference is what the panels are for: Governance dashboards track metrics, while Run Agents dashboards run agents that do work.

## Before you begin

- You need the **Run Agents** permission. Its card reads "Run available agents and automation workflows." An admin grants it under [Users and permissions](/configuration/administration/users-and-permissions/).
- **mAIstro** is a separate permission card, so an admin can grant the two separately.
- The agents that panels run are built and saved in mAIstro, in the [Agent Editor](/maistro/visual-editor/). An agent has to exist in mAIstro before a panel can run it.

## Open a dashboard

1. In the top navigation, select **Run Agents**.
2. In the side navigation, find the **Agent Dashboards** group. Its items are the dashboards you can open. If the list is hidden, select **Agent Dashboards** to expand it. Select it again to collapse it.
3. Select a dashboard, such as **Example Dashboard**. It opens in the main area, and its agents start running.

## What happens when a dashboard opens

You do not need to select anything to run a dashboard's agents, because opening the dashboard runs them. While an agent is still running, its panel lists the steps of the agent's plan, such as "Agent Plan: Call LLM" or "Call REST API". The toolbar status shows **Running:** followed by what is running. In this example, it reads **Running: Weather Forecast**, the name of the dashboard's only panel.

![A dashboard while its agent runs: the status Running: Weather Forecast with a spinner next to the Add Panel and Delete Dashboard buttons, and the Weather Forecast panel listing the agent's plan steps](/img/runagent/default.png)

When every panel has its result, the status changes to **All Agents finished.** and each panel shows its agent's output in place of the plan steps.

![The same dashboard after the run: the status All Agents finished. in the toolbar, and the Weather Forecast panel showing the agent's answer](/img/runagent/example-dashboard.png)

A panel's result can change from one visit to the next, so a dashboard suits current information, such as today's figures or a fresh summary.

<!-- UNCONFIRMED: every panel run is an agent run and counts like any other agent run for billing — the route's gap list; no screen shows cost -->

Every panel is a separate agent run, so a dashboard runs all of its agents each time anyone opens it. Keep slow or expensive agents off dashboards that people open often. If an agent needs to run on a timer rather than when someone opens a dashboard, use the [Agent Scheduler](/maistro/agent-scheduler/). To see what each step of an agent does, open the agent in mAIstro, run it there, and use the [Inspector](/maistro/inspector/).

## Change a dashboard

The toolbar above the panels has the controls for changing the dashboard you have open. Both buttons are greyed out while edit mode is off.

![The Run Agents toolbar with edit mode off: Add Panel and Delete Dashboard greyed out, the status All Agents finished., and the Edit switch (Toggle Edit mode) at the right end; the Agent Dashboards group is collapsed](/img/runagent/agent-dashboards.png)

1. Turn on the **Edit** switch (**Toggle Edit mode**) at the right end of the toolbar.
2. To add a panel to the open dashboard, select **Add Panel**.
3. To delete the open dashboard, select **Delete Dashboard**.

<!-- UNCONFIRMED: switching Edit on enables Add Panel and Delete Dashboard, and a panel binds an agent to a titled tile — inferred from both buttons being disabled with Edit off; the route's gap list -->

With edit mode on, **Add Panel** and **Delete Dashboard** become available. A new panel connects one agent to a tile on the dashboard and gives the tile a title.

:::caution
**Delete Dashboard** deletes the whole dashboard you have open, not just one panel. Before you select it, check which dashboard is selected under **Agent Dashboards**.
:::

<!-- UNCONFIRMED: a Set agent Parameters dialog (Cancel, Run) asks for an agent's parameters before a panel runs it — the dialog is in the page but was never seen open -->

A panel whose agent takes input parameters may ask for them in a **Set agent Parameters** dialog before it runs.

The toolbar, edit mode and panels work the same way on Governance dashboards. For more about them, see [Custom dashboards](/governance/analytics/custom-dashboards/).

## Verify the agents ran

- The toolbar status reads **All Agents finished.**
- Every panel shows its agent's result instead of a list of "Agent Plan" steps.

If the status still shows **Running:**, an agent has not finished yet. To check what an agent does or where it stops, open it in mAIstro, run it there, and step through it in the [Inspector](/maistro/inspector/).

## FAQ

### Do I have to press anything to run a dashboard's agents?

No. Opening the dashboard runs them. While an agent runs, the toolbar shows **Running:** followed by what is running. Once every panel has its result, the toolbar reads **All Agents finished.**

### Why are Add Panel and Delete Dashboard greyed out?

They are disabled while the **Edit** switch at the right end of the toolbar is off. To change the dashboard, turn on edit mode first. See [Change a dashboard](#change-a-dashboard).

### Where do the agents on a dashboard come from?

They are mAIstro agents, built and saved in the [Agent Editor](/maistro/visual-editor/). Run Agents runs those agents and shows their results. To change what an agent does, edit the agent in mAIstro.

## Related

- [Custom dashboards](/governance/analytics/custom-dashboards/): the Governance dashboards that share this toolbar, with **Add Dashboard**.
- [mAIstro overview](/maistro/overview/): where the agents behind every panel are built.
- [Agent Editor](/maistro/visual-editor/): build and save the agents that panels run.
- [Inspector](/maistro/inspector/): step through an agent run and read its output.
- [Agent Scheduler](/maistro/agent-scheduler/): run agents on a timer instead.
- [Users and permissions](/configuration/administration/users-and-permissions/): the **Run Agents** and **mAIstro** permissions.
