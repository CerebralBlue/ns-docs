---
title: "Governance overview"
description: "Governance is the NeuralSeek console area that reports on Seek answers, mAIstro agent runs, usage and instance health, organised into Seek Governance, mAIstro Governance and Custom Governance dashboards."
---

Governance is where you check how your NeuralSeek instance is behaving: how confident and safe its [Seek](/seek/overview/) answers are, what your [mAIstro](/maistro/overview/) agents are doing, how many tokens and how much usage you consume, and what went wrong when something failed. It gathers this from the traffic your instance already handles (questions answered through Seek, Chat and the API, and agent runs), so you get one place to audit retrieval-augmented generation instead of piecing it together from logs. Governance only reports; the controls that change behaviour, such as blocking prompt injection, are set in the [Guardrails](/governance/guardrails/overview/) of [Neural Config](/configuration/neural-config/).

## How the Governance screen is organised

Select **Governance** in the top navigation. The screen opens on the **Overview** dashboard of Seek Governance, with the Governance side navigation on the left. The navigation is headed **Governance**, "Insights, monitoring and controls", and ends with a line showing the NeuralSeek version your instance runs. To collapse the navigation, select **Toggle governance navigation**; select it again to expand it.

![The Governance screen: the side navigation on the left with Seek Governance expanded and Overview selected, and the Overview dashboard on the right](/img/governance/default.png)

The navigation has three groups of dashboards (Seek Governance, mAIstro Governance and Custom Governance), each of which you can expand or collapse by selecting its name, followed by three instance-level pages. The Seek Governance dashboards can be narrowed to an intent or category with **Open filters** and to a time window with the date range at the top right; [Reading the dashboards](/governance/analytics/reading-the-dashboards/) explains both. Agent Insights has its own filter and date range.

### Seek Governance

**Seek Governance** reports on Seek traffic: the questions your instance answered and how well it answered them. Each entry is documented on its own page.

| Entry                                    | What it reports                                                                                                                                  | Page                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Overview                                 | The landing dashboard: semantic confidence, question resolution, and the safety indicators for hate, abuse and profanity, prompt injection and PII | [Seek overview dashboard](/governance/analytics/seek-overview/)                           |
| Semantic Insights                        | How closely answers follow their sources                                                                                                         | [Semantic analytics](/governance/semantic-analytics/)                                     |
| Documentation Insights                   | Which documents and sources your answers draw on                                                                                                 | [Content analytics](/governance/content-analytics/)                                       |
| Intent Insights                          | Coverage and confidence per intent                                                                                                               | [Intent categorization](/governance/intent-categorization/)                               |
| Token Insights, Cost Insights            | Token volume and estimated cost of Seek calls                                                                                                    | [Seek tokens & cost](/governance/analytics/seek-tokens-cost/)                             |
| Seek Logs, Configuration Insights        | Individual logged questions and answers, and the history of configuration changes                                                                | [Seek logs & configuration insights](/governance/analytics/seek-logs-and-config-insights/) |
| Model Comparison                         | The same question run against several configured models, side by side                                                                           | [Model comparison](/governance/analytics/model-comparison/)                               |

The safety indicators on the Overview report what your [prompt injection](/governance/guardrails/prompt-injection/), [profanity (HAP)](/governance/guardrails/profanity-hap/) and [PII detection](/governance/pii-detection/) settings caught, and its **Question Resolution** panel compares answered questions with those below your [minimum confidence](/governance/guardrails/min-confidence/).

### mAIstro Governance

**mAIstro Governance** reports on mAIstro agent runs rather than on Seek. It has its own token, cost and model-comparison pages, so you can read what agents consume apart from Seek.

![The Agent Task Manager page, with the mAIstro Governance group expanded in the side navigation](/img/governance/agent-task-manager.png)

| Entry                                       | What it reports                                                  | Page                                                                                   |
| ------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Agent Insights, Agent Details, Agent Timeline | Run times, invocations and the timeline of agent runs | [Agent insights & details](/governance/analytics/agent-insights-and-details/)          |
| Red Team Testing                            | An agent's security posture, identified risks and recommended mitigations | [Red team testing](/governance/red-team-testing/)                                      |
| mAIstro Logs, Token Insights, Cost Insights | Logged agent runs, and the tokens and estimated cost they used   | [mAIstro logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/)           |
| Model Comparison                            | The mAIstro counterpart of the Seek group's Model Comparison     | [Model comparison](/governance/analytics/model-comparison/)                            |
| Agent Task Manager                          | The agent runs in progress right now                             | Described below                                                                        |

**Agent Task Manager** is a live view of "every mAIstro run in flight on this instance", refreshed every three seconds. Its counters (**Instance**, **Busiest IP** and **Total**) show how many run slots are in use. **Total** counts every run on the instance, top-level and nested alike, and is the hard cap. A top-level run is admitted only while it leaves 10 slots free, while a run at maximum depth may take the last one, so a nested chain can always finish; a run that cannot be admitted waits for a slot rather than fail. Open it when agents seem slow to start, to see whether the run slots are full; the **Concurrency Delay** panel of Agent Insights shows how long runs waited before they started.

### Custom Governance

**Custom Governance** holds dashboards you build yourself, from panels driven by your own mAIstro agents. Each dashboard you create appears as an entry in the group, and **Add Dashboard** at the end of the group creates a new one. [Custom dashboards](/governance/analytics/custom-dashboards/) explains how to build and edit them.

![A custom dashboard selected in the Custom Governance group, showing its chart and the dashboard toolbar](/img/governance/agent-growth.png)

These dashboards are separate from the Custom Governance tab of the Guardrails dialog in Neural Config, which is covered in [Custom governance agents](/governance/guardrails/custom-governance-agents/).

### Usage, System Performance and System Log

Three pages at the foot of the navigation report on the instance as a whole rather than on one kind of traffic.

![The Usage page, with its summary cards and the start of the Usage over time chart](/img/governance/usage.png)

<!-- UNCONFIRMED: System Performance charts response time (old page: "measured in milliseconds") — old Governance page "Instance Performance"; the capture shows the series names and a date range but no unit -->

- **Usage** — "Explore billing quantity, source activity, and usage patterns over time." It shows your billable usage over a date range, broken down by source and by day, with panels such as **Usage over time**, **Source mix** and **Usage calendar**. Use it to see what is driving your consumption.
- **System Performance** — charts how long your instance takes to respond over the selected date range. The series buttons above the chart (**Total Time**, **NeuralSeek KB** and one per model in use) turn each line on or off, so you can see which component is adding time.
- **System Log** — the instance's log of warnings and errors. Each row has a **Time**, **Severity**, **Source**, **Code** and **Message**; narrow the list with the **Severity** and **Source** filters, and select **Refresh** to load new entries.

## When to use Governance

- After a configuration change, to check answer quality and safety: the Overview and Semantic Insights show whether confidence moved, and the safety indicators show what the guardrails caught.
- To follow your spend: Token Insights and Cost Insights in both groups show what Seek and agents consume; Usage shows your billable usage by source.
- To investigate one question or one run: Seek Logs and mAIstro Logs list individual records. For Seek, [Replay](/governance/replay/) lets you replay logged questions and analyse their semantic scores.
- To find out why something failed or is slow: System Log lists warnings and errors, System Performance shows where time goes, Agent Task Manager shows whether the run slots are full, and Agent Insights shows how long runs waited to start.

Governance is the wrong place to change behaviour. To block, mask or require something, change the [Guardrails](/governance/guardrails/overview/) in Neural Config, then come back to Governance to confirm the effect.

## FAQ

### Where do I change what Governance reports on, for example to block prompt injection?

In Neural Config, not in Governance. Governance only reports on what happened; the protections themselves are set in the Guardrails dialog. See the [Guardrails overview](/governance/guardrails/overview/).

### Why are Seek and mAIstro reported separately?

They are different kinds of traffic: Seek Governance covers questions answered through Seek, while mAIstro Governance covers agent runs. Each group has its own token, cost and model-comparison pages, so you can see what each one costs on its own.

### Can I build my own dashboard?

Yes. Select **Add Dashboard** at the end of the Custom Governance group, then add panels to it. See [Custom dashboards](/governance/analytics/custom-dashboards/).

### Why does a mAIstro run wait before it starts?

Every instance has a cap on how many runs can be in flight at once, shown by the **Total** counter in Agent Task Manager. A top-level run starts only while it leaves 10 slots free for nested runs, so it can wait before **Total** reaches its cap; a run that cannot be admitted waits for a free slot instead of failing.

## Related

- [Reading the dashboards](/governance/analytics/reading-the-dashboards/)
- [Seek overview dashboard](/governance/analytics/seek-overview/)
- [Guardrails overview](/governance/guardrails/overview/)
- [Custom dashboards](/governance/analytics/custom-dashboards/)
- [Logging](/governance/logging/)
- [Replay](/governance/replay/)
