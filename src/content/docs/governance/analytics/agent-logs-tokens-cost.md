---
title: "mAIstro logs, tokens & cost"
description: "mAIstro Logs lists every agent run with its date, run ID, user, agent and runtime, and the mAIstro Governance group's Token Insights and Cost Insights pages report agent token use and spend."
---

**mAIstro Logs** is the run-by-run record of your [mAIstro](/maistro/overview/) agents: one row per run, with when it ran, which agent it was, who it is attributed to and how long it took. The charts on [Agent Insights and Agent Details](/governance/analytics/agent-insights-and-details/) are aggregates of these runs. When an aggregate tells you that an agent got slower or busier, this table is where you find the individual runs. It is the agent counterpart of [Seek Logs](/governance/analytics/seek-logs-and-config-insights/), which lists Seek questions and answers.

The same navigation group also holds **Token Insights** and **Cost Insights** for agent runs, covered at the end of this page.

## Where to find it

In the top navigation, select **Governance**. In the left Governance navigation, expand **mAIstro Governance** and select **mAIstro Logs**. **Token Insights** and **Cost Insights** are further down the same group.

## mAIstro Logs settings and columns

### mAIstro Logs

![mAIstro Logs: the run table with the Date, RunId, User, Agent, Runtime (ms) and Link columns, the search and Download Logs to CSV icons above it, and the paging bar below it](/img/governance/maistro-logs.png)

Each row is one agent run, newest first.

| Column           | What it shows                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Date**         | When the run happened, as date and time (for example `2026-10-01 16:47:38`).                                     |
| **RunId**        | The run's unique identifier, which tells one run apart from every other run.                                     |
| **User**         | The user the run is attributed to.                                                                               |
| **Agent**        | The name of the agent that ran.                                                                                  |
| **Runtime (ms)** | How long the run took, in milliseconds. Scan this column to find the slow runs behind a latency spike.            |
| **Link**         | A link to the run, when one is available.                                                                        |

<!-- UNCONFIRMED: selecting a column header sorts the table by that column (ascending, descending, unsorted) — old mAIstro Logs page; not exercised in the capture -->

To sort the table, select a column header.

<!-- UNCONFIRMED: the Link column holds a replay link only when Corporate Logging is on, and only for runs that happened while it was on — old mAIstro Logs page; every Link cell in the capture was empty -->

The **Link** column fills in only when [Corporate Logging](/governance/logging/) is enabled on the instance, and only for runs that happened while it was on. The link opens the run in [Replay](/governance/replay/) so you can follow it step by step. Turn logging on before the runs you want to investigate; it cannot be applied to past runs.

The controls around the table:

| Control                                       | What it does                                                                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search (magnifier icon)                       | Opens a search box above the table, to narrow the rows you are looking at.                                                                          |
| **Download Logs to CSV**                      | Downloads the run log as a CSV file, for analysis in a spreadsheet or for keeping outside NeuralSeek.                                              |
| **Items per page:**                           | How many runs one page shows: `10`, `50` or `100`. The text next to it gives the range and total, for example "1–10 of 276 items".                 |
| Page number, **Previous page**, **Next page** | Move through the pages. The page number list jumps straight to a page, and the text beside it gives the page count, for example "of 28 pages". |

Set **Items per page:** to `100` when you scan for outliers in **Runtime (ms)**; fewer page turns make an unusually long run easier to spot.

## Agent token and cost reporting

Token use and estimated spend for agent runs have their own pages in the **mAIstro Governance** group:

- **Token Insights** — token volume for agent runs.
<!-- UNCONFIRMED: mAIstro Cost Insights compares model cost for agent runs and can be filtered to one agent — old Cost Insights (mAIstro) page; the page was not captured -->
- **Cost Insights** — a comparison of model cost for agent runs, like its Seek counterpart, which you can narrow to one agent.

They are the agent-run versions of the **Token Insights** and **Cost Insights** pages under **Seek Governance**, which report Seek traffic instead. The two pairs share their names, so check which group you are in. For how token and cost dashboards read, see [Seek tokens & cost](/governance/analytics/seek-tokens-cost/); for date ranges and filters, see [Reading the dashboards](/governance/analytics/reading-the-dashboards/).

<!-- UNCONFIRMED: the mAIstro Token Insights and Cost Insights pages appear only on instances that bring their own LLM (BYOLLM) — old Token Insights (mAIstro) and Cost Insights (mAIstro) pages -->

These two pages are shown on instances that bring their own LLM.

## FAQ

### How is mAIstro Logs different from Seek Logs?

mAIstro Logs lists agent runs: the agent, the user, the run ID and the runtime. [Seek Logs](/governance/analytics/seek-logs-and-config-insights/) lists Seek questions and the answers they got. Use mAIstro Logs for anything built and run in mAIstro, and Seek Logs for traffic to the Seek endpoint.

### How do I find the runs behind a slow agent on Agent Details?

Open **mAIstro Logs**, look for that agent's name in the **Agent** column, and compare the **Runtime (ms)** values around the time of the spike shown in **Date**. Raising **Items per page:** to `100` puts more runs on one screen.

### Can I keep a copy of the run log?

Yes. Select **Download Logs to CSV** above the table to download the run log as a CSV file.

## Related

- [Agent insights & details](/governance/analytics/agent-insights-and-details/)
- [Seek logs & configuration insights](/governance/analytics/seek-logs-and-config-insights/)
- [Seek tokens & cost](/governance/analytics/seek-tokens-cost/)
- [Reading the dashboards](/governance/analytics/reading-the-dashboards/)
- [Corporate logging](/governance/logging/)
- [Replay](/governance/replay/)
- [mAIstro overview](/maistro/overview/)
