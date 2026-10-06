---
title: "Agent insights & details"
description: "The mAIstro Governance dashboards for agents: Agent Insights reports run time, usage, guardrail activations and timing across all agents, Agent Details drills into one agent's latency and invocation tree, and Agent Timeline steps through one agent's events."
---

Three dashboards under **mAIstro Governance** report on how your [mAIstro agents](/maistro/overview/) run. **Agent Insights** aggregates every agent over a date range, so you can see which agents carry the volume, how long runs take and where time goes. **Agent Details** focuses on one agent you pick: its latency percentiles, guardrail activations, the child agents it calls and how it compares with the rest of your agents. **Agent Timeline** lays one agent's events out on a zoomable timeline. Start on Agent Insights to find the agent that stands out, then open it in Agent Details.

## Where to find the agent dashboards

Select **Governance** in the top navigation, then in the left navigation expand **mAIstro Governance** and select **Agent Insights**, **Agent Details** or **Agent Timeline**.

<!-- UNCONFIRMED: Agent Insights replaced the dashboard that older documentation called "Flow Insights" — old Agent Insights page -->
Older material that mentions "Flow Insights" refers to what is now Agent Insights.

For the run-by-run records behind these aggregates, use the agent logs described in [Agent logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/).

## Dashboard settings and panels

### Agent Insights

![Agent Insights with the Filter button, the Select report date range button, the Time per run, Equivalent Seeks per run and Concurrency Delay cards, and the Agent Runs, Guardrail Activations and Agent Run Ranking charts](/img/governance/agent-insights.png)

Agent Insights is the fleet view: every panel aggregates all agents that ran in the selected period.

#### Date range and filter

| Control                      | What it does                                                                                                                                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Filter**                   | Opens the dashboard filter, to narrow what the panels report on. How filters behave across the Governance dashboards is covered in [Reading the dashboards](/governance/analytics/reading-the-dashboards/).            |
| **Select report date range** | Shows the current period (for example, `9/06 08:15 PM - 10/05 08:15 PM`) and opens a date-range picker. Every panel on the page recalculates for the range you pick. Widen it when an agent runs rarely. |

#### Run distributions

Three cards summarise every run in the period. Each shows the average as a large number, the **Min**, **Average** and **Max** values beneath it, and a range bar marking the three.

| Panel                        | Subtitle on screen          | What it tells you                                                                                                                                                              |
| ---------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Time per run**             | Total runtime distribution  | How long agent runs take end to end. A **Max** far above the **Average** means a few runs are much slower than the rest — find them in Agent Details or the Agent Execution Timeline. |
| **Equivalent Seeks per run** | Seek usage distribution     | How much usage a run consumes, expressed in seeks.                                                                                                                             |
| **Concurrency Delay**        | Queue wait before execution | How long runs wait in the queue before they start executing. This time is spent before the agent's own steps begin, so a high value points at runs competing to start, not at a slow agent. |

<!-- UNCONFIRMED: Equivalent Seeks = "the amount of seeks that would be used to complete a mAIstro agent" — documentation.neuralseek.com/ui/governance/ -->
Equivalent Seeks are the number of Seeks it would take to complete an agent run.

#### Volume and guardrails

| Panel                     | Subtitle on screen                                                                  | What it tells you                                                                                                                                                                                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Agent Runs**            | Run volume by agent. Hover for volume, click to filter.                             | A donut chart with the total number of runs in the centre and one legend entry per agent with its run count. Select an agent to filter the dashboard to it.                                                                                                                                   |
| **Guardrail Activations** | Guardrail trigger volume. Hover or click to inspect.                                | A donut chart of how often [guardrails](/governance/guardrails/overview/) triggered on agent runs, split by guardrail type (for example **PII**, from [PII detection](/governance/pii-detection/)), with the total in the centre. Use it to confirm guardrails fire on agent traffic as you expect. |
| **Agent Run Ranking**     | All agents ordered by run count. Hover for details, click an agent to filter.       | One horizontal bar per agent, longest first. It shows at a glance whether a few agents dominate your volume, which is where tuning pays off most. Select an agent to filter the dashboard to it.                                                                                               |

#### Component timing

The **Component Timing Guitar Chart** ("Each agent is a string. Colored notes show average component timing in milliseconds.") draws one string per agent and places a coloured note for the average time that agent spends in each kind of component:

- **Parallel Run Time**
- **LLM**
- **KB**
- **ML Models**
- **REST**

Reading across the strings shows which component type is the bottleneck across your agents, not just in one run: if the **LLM** notes sit far to the right on most strings, model calls dominate run time everywhere; if one agent's **REST** note stands apart, that agent waits on an external service. Hover a note for its timing, or select it.

Below it, **Average Total Component Time by Agent** shows the same five components as a bar per agent, for comparing totals rather than positions.

#### Agent Execution Timeline

**Agent Execution Timeline** ("Concurrency delay and runtime by agent execution") plots every agent run in the period on a time axis, one row per agent, with each run split into **Concurrency Delay** (the queue wait) and **Runtime**. A **Concurrency** track above the rows counts the agents running at each moment, and each row lists the agent's number of runs. Use it to see when agents ran, which runs overlapped, and whether a burst of activity coincides with longer queue waits.

Hover a run for its details, or select it. To change the visible span, drag on the chart or use the controls:

- **Zoom in** — narrow the span to look at a busy period.
- **Zoom out** — widen the span.
- **Reset zoom** — return to the full date range.

### Agent Details

![Agent Details with the Agent search box, the date range, the Invocations, Average run time, P50, P95, Peak and Guardrails hit cards, and the Agent invocation tree with its Equivalent Seeks, Runtime and Invocations metric switch](/img/governance/agent-details.png)

Agent Details answers questions about one agent: why it is slow, how often it trips a guardrail, which agents it calls, and whether its numbers are normal compared with your other agents.

#### Choosing the agent and the period

1. In **Agent**, type part of the agent's name to search, or select **Show agents** to browse the list headed **Select an agent**, which shows how many agents you have.
2. Select the agent. Every panel loads for it.
3. To change the period, select the date range at the top right of the page and pick a new range.

The same agent picker appears on Agent Timeline and on [Red Team Testing](/governance/red-team-testing/).

#### Latency and guardrail cards

| Card                 | Subtitle on screen   | What it tells you                                                    |
| -------------------- | -------------------- | -------------------------------------------------------------------- |
| **Invocations**      | Selected period      | How many times the agent ran in the period.                          |
| **Average run time** | Mean latency         | The mean run time.                                                   |
| **P50**              | Median latency       | Half of the runs finished faster than this.                          |
| **P95**              | Tail latency         | 95% of the runs finished faster than this; the slowest 5% took longer. |
| **Peak**             | Max observed latency | The slowest single run in the period.                                |
| **Guardrails hit**   | Activations          | How many times a guardrail triggered on this agent's runs.           |

Read **P95** and **Peak** before the average. A handful of slow runs barely moves the mean, but those are the runs your users notice — for example when the agent sits behind a chat channel with a fixed response timeout. If **P95** approaches that timeout, part of your traffic is failing even though the average looks healthy.

<!-- UNCONFIRMED: the run logs show what a guardrail did on a given run; Guardrails hit is only a count — old Agent Details page -->
**Guardrails hit** is a count. To see what a guardrail did on a particular run, open that run in the agent logs ([Agent logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/)).

#### Agent invocation tree

The **Agent invocation tree** ("Child agents called by the selected agent") draws the selected agent as the root and links it to every [agent it calls](/maistro/ntl/multi-agent/), so you can see which agents it calls and which child agent carries the cost. Above the tree, counters total the root invocations, child calls, unique agents, equivalent seeks and child runtime for the period.

Use the metric switch to choose what the width of each link represents:

| Option               | Link width represents                                                         |
| -------------------- | ----------------------------------------------------------------------------- |
| **Equivalent Seeks** | The usage each child call consumed — find the child that drives usage.        |
| **Runtime**          | The time spent in each child — find the child that makes the parent slow.    |
| **Invocations**      | How often each child is called — find the calls that repeat more than needed. |

#### Phases, latency and time of day

| Panel                    | Subtitle on screen                         | What it tells you                                                                                                                                       |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Time in phase**        | Average component time in milliseconds     | Where the agent's run time goes, as average time per phase.                                                                                             |
| **Phase mix**            | Share of average runtime by phase          | The same breakdown as a share of the average run time, to see which phase dominates.                                                                   |
| **Latency over period**  | Per-run runtime across the selected range  | Each run's runtime across the date range — spot a trend or one bad day.                                                                                 |
| **Latency distribution** | Violin plot of observed run latency        | The shape of the latency: one tight cluster means consistent runs; two bulges mean two kinds of run (for example, with and without a slow branch).       |
| **Time of day of runs**  | Invocation volume by hour of day           | When the agent's load arrives, to plan around peaks or schedule work for quiet hours.                                                                   |

When no runs are counted for the agent in the period, these panels show "No latency data available." and "No latency distribution data available." Try a wider date range.

#### Agent compared to other agents

**Agent compared to other agents** ("Selected agent metrics versus averages across the rest of your agents") sets the agent's **Selected agent** values against the **Average of other agents** for six metrics: Invocations, Average run time, P50 latency, P95 latency, Peak latency and Avg concurrency delay. Each row says how many other agents it was compared with and shows the difference as a percentage, or "No change" when the two values match. Use it to decide whether a slow or busy agent is unusual, or simply in line with the rest of your agents. To compare models rather than agents, use [Model comparison](/governance/analytics/model-comparison/).

### Agent Timeline

![Agent Timeline with the Agent search box, the title card, the Next arrow, the Return to start, Zoom out, Zoom in and Go to end controls, and the timeline strip with an Agent Run event](/img/governance/agent-timeline.png)

Agent Timeline shows one agent's events in time order, without the rest of your agents around them. Use it to step through what one agent did during an incident window.

1. Pick the agent with **Agent** or **Show agents** — the same picker as Agent Details.
2. The page opens on a title card with the agent's name. Select **Next: Agent Run** (the arrow on the right) to step to the first event.
3. Follow the events on the timeline strip at the bottom: it places one marker per event, labelled with its date and event type, such as **Agent Run**.

The timeline controls move and scale the strip:

- **Return to start** — jump to the first event.
- **Zoom out** — show a longer span.
- **Zoom in** — show a shorter span in more detail.
- **Go to end** — jump to the latest event.

The same controls drive the timeline in [Configuration Insights](/governance/analytics/seek-logs-and-config-insights/).

## FAQ

### Which dashboard should I open first?

Agent Insights, for the whole fleet. When an agent stands out — at the top of **Agent Run Ranking**, with a long **Runtime** in the **Agent Execution Timeline**, or with a far-right note on the **Component Timing Guitar Chart** — open it in Agent Details.

### Why look at P95 and Peak instead of the average?

A few slow runs barely move the average, but they are the ones that hit a channel's response timeout. **P95** shows how slow the slowest 5% of runs are, and **Peak** shows the worst single run.

### Can I see which agents an agent calls?

Yes. The **Agent invocation tree** on Agent Details shows every child agent the selected agent calls. Switch the link width between **Equivalent Seeks**, **Runtime** and **Invocations** to find the child that drives usage, time or call volume.

### What does Concurrency Delay measure?

The time a run waits in the queue before it starts executing. It is not time spent in the agent's own steps, so a high **Concurrency Delay** with a normal **Runtime** means runs are competing to start rather than the agent being slow.

### Why does Agent Details show zeros and "No latency data available."?

No runs were counted for the selected agent in the selected period. Try a wider date range, or check **Agent Runs** on Agent Insights to see which agents have runs in the period.

## Related

- [mAIstro overview](/maistro/overview/) — building the agents these dashboards report on
- [Reading the dashboards](/governance/analytics/reading-the-dashboards/) — date ranges and filters across Governance
- [Agent logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/) — the individual runs behind these figures
- [Model comparison](/governance/analytics/model-comparison/) — running the same agent on several models
- [Red Team Testing](/governance/red-team-testing/) — test results for one agent, picked with the same agent picker
- [Guardrails overview](/governance/guardrails/overview/) — what Guardrail Activations and Guardrails hit count
- [Seek logs and Configuration Insights](/governance/analytics/seek-logs-and-config-insights/) — the Seek-side dashboards, with the same timeline controls
