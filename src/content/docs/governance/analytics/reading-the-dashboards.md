---
title: "Reading the dashboards"
description: "How to read any NeuralSeek Governance dashboard: narrow it by category, intent and date range with the filter bar, read its panels, and trace each metric back to the setting behind it."
---

The [Governance](/governance/overview/) dashboards turn every Seek and agent run into numbers you can act on: how confident answers are, how often [guardrails](/governance/guardrails/overview/) fire, what traffic costs. The Seek dashboards share one filter bar and one way of drawing a panel, so this page explains both once — how to scope a dashboard to the traffic you care about, how to read what a panel shows, which setting moves which metric, and where each analytics page lives.

## How the dashboard filters work

Every panel on a dashboard is computed over two things: the date range and the active filters. Change either and every panel recalculates for that slice of traffic. That is what makes the dashboards useful for diagnosis — you can look at one category of questions, or one intent within it, over exactly the window when something went wrong.

### The filter bar

![The filter bar across the top of a Seek Governance dashboard: the funnel button, an active Intent filter chip, and the date range at the right](/img/governance/semantic-insights.png)

The filter bar runs across the top of a Seek Governance dashboard, such as [Overview](/governance/analytics/seek-overview/), Semantic Insights and Token Insights.

- **Open filters** — the funnel button at the left. Select it to open the **Filter** dialog, where you pick a category or intent (next section).
- Filter chips — each active filter appears beside the funnel as a chip: the field name in bold (`Category` or `Intent`) followed by the value, with a × mark at its left. The chips are the quickest way to check what a dashboard is scoped to before you trust its numbers. An active filter stays in force as you move between the Seek Governance dashboards, so a chip you set on Overview still applies when you open Semantic Insights.
- **Select report date range** — the date range control at the top right, shown as a calendar icon, a start and end time (`MM/DD hh:mm AM - MM/DD hh:mm PM`) and a caret. Select it to change the window the panels cover. The same control sits at the top of the [mAIstro Agent Insights](/governance/analytics/agent-insights-and-details/) dashboard.

### The Filter dialog

![The Filter dialog: the active filter chip with Clear all, Filter By Category with its donut and category pills, and Filter By Filter](/img/governance/open-filters-panel.png)

The **Filter** dialog opens from **Open filters**. Each choice is a donut segment or pill with its count, so you see how much traffic it carries before you pick it.

- The chip row at the top repeats the active filters, the same chips the filter bar shows.
- **Clear all** — at the right of the chip row. Select it to clear the active filters.
- **Filter By Category** — "Select a segment or pill." A donut with the number of categories in its centre, and one pill per category showing its name and how many seeks it holds in the date range. Select a donut segment or a pill to scope the dashboard to that category. Categories come from [intent categorization](/governance/intent-categorization/).
- **Filter By Filter** — "Apply governance filter grouping." When there is nothing to group, the block shows **No filter data**.

<!-- UNCONFIRMED: Filter By Filter groups by the runtime Filter value passed with a Seek — old map gap "slice any dashboard by intent category or by runtime filter"; the capture showed only "No filter data" -->

**Filter By Filter** groups traffic by the filter value sent with each Seek, so you can slice a dashboard by a runtime filter as well as by category.

Close the dialog with its × when you are done; the chips in the filter bar show what you picked.

### Narrowing a category to one intent

![The Filter dialog after a category is picked: Category and Intent chips at the top, and Filter By Intent listing that category's intents with their counts](/img/governance/other-64.png)

Picking a category does two things. A `Category` chip joins the chip row and the dashboard's filter bar, and the donut block turns into **Filter By Intent** — the same "Select a segment or pill." donut, now listing the intents inside that category, each with its count. Select an intent's segment or pill to narrow the dashboard to that one intent. This is the way to go from "billing questions look bad" to the specific question type that is dragging the numbers down.

### Reading a panel

![The Seek Governance Overview dashboard: score panels with Min, Average and Max, and rate panels drawn as donuts](/img/governance/default.png)

The Seek dashboards draw their metrics in a few repeating shapes, so once you can read one panel you can read them all. Each dashboard page then only has to explain what its own metrics mean — see the [Seek overview dashboard](/governance/analytics/seek-overview/) for the panels in the image above.

- Title and subtitle: the subtitle says exactly what is measured, for example "Min, average, and max semantic score". When a number surprises you, read the subtitle first.
- Score panels show a large current value, then **Min**, **Average** and **Max** chips for the date range, and a 0–100 scale with markers for Min, Avg and Max. A wide gap between Min and Max tells you the average hides a spread of very good and very poor results.
- Rate panels show a donut with the share in the centre and a word under it (`responded`, `blocked`, `PII`), plus a two-entry legend: the measured share and `Other`.
- Tags at the top right of some panels add context: `Current metric` on Semantic Confidence, `Safety` on Prompt Injection, `Bubble size = volume` on Top Intents.

Every value is computed over the date range and the active filters — a dashboard that looks empty or too good is often just scoped to a narrow slice.

## When to use the dashboards

Use the dashboards to watch answer quality and guardrail activity over time, to confirm that a configuration change did what you expected, and to find the slice of traffic behind a problem before you change anything. To inspect individual questions and answers rather than aggregates, use [Seek logs](/governance/analytics/seek-logs-and-config-insights/) instead.

### Which setting each Overview metric reflects

When a panel looks wrong, the fix is almost always a setting, not the dashboard. The panel subtitles name the guardrail behind each metric:

<!-- UNCONFIRMED: Prompt Injection Action's Block and Remove shares map to the block and removal thresholds on the Prompt Injection tab — inferred from the panel subtitle and that tab's help text, not compared on screen -->

| Panel (Overview)                                                                                       | Subtitle on screen                             | Setting that moves it                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantic Confidence                                                                                    | Min, average, and max semantic score           | [Semantic scoring](/governance/guardrails/semantic-scoring/); tune the model on [Semantic model](/configuration/semantic-model/)                                            |
| Question Resolution                                                                                    | Responded vs below min confidence              | [Minimum confidence](/governance/guardrails/min-confidence/)                                                                                                                |
| Hate, Abuse, Profanity Block                                                                           | Detected HAP filter rate                       | [Profanity (HAP) filter](/governance/guardrails/profanity-hap/)                                                                                                             |
| Prompt Injection                                                                                       | Min, average, and max prompt injection risk    | [Prompt injection](/governance/guardrails/prompt-injection/) scoring                                                                                                        |
| Prompt Injection Action                                                                                | Block, remove, or no action                    | The removal and block thresholds on [Prompt injection](/governance/guardrails/prompt-injection/) |
| Questions containing PII                                                                               | PII detection rate                             | [PII detection](/governance/pii-detection/)                                                                                                                                 |
| Top Intents, Intent Confidence Distribution, Intent Semantic-to-KB Relationship, Category Landscape    | Intent and category charts                     | [Intents and categories](/governance/intent-categorization/)                                                                                                                |
| Token Insights panels (Seek)                                                                           | Estimated provider cost from pricing table, … | The models selected in [LLM Details](/configuration/neural-config/llm-details/); see [Seek tokens & cost](/governance/analytics/seek-tokens-cost/)                          |

All of these guardrails are set in one place; see the [Guardrails overview](/governance/guardrails/overview/).

### The analytics pages

The Governance side navigation groups the dashboards in three sections. In navigation order:

**Seek Governance**

- **Overview** — the guardrail and intent summary described above. [Seek overview dashboard](/governance/analytics/seek-overview/)
- **Semantic Insights** — semantic confidence, source coverage and answer length. [Semantic analytics](/governance/semantic-analytics/)
- **Documentation Insights** — the documentation view of Seek traffic. [Content analytics](/governance/content-analytics/)
- **Intent Insights** — the intent view of Seek traffic. [Intent categorization](/governance/intent-categorization/)
- **Token Insights** and **Cost Insights** — token volume and estimated provider cost for Seek. [Seek tokens & cost](/governance/analytics/seek-tokens-cost/)
- **Seek Logs** — the individual questions and answers. [Seek logs & configuration insights](/governance/analytics/seek-logs-and-config-insights/)
- **Model Comparison** — select models, enter a question, and compare their answers side by side. [Model comparison](/governance/analytics/model-comparison/)
- **Configuration Insights** — a timeline of your configuration versions. [Seek logs & configuration insights](/governance/analytics/seek-logs-and-config-insights/)

**mAIstro Governance**

- **Agent Insights**, **Agent Details** and **Agent Timeline** — agent runs, run times and execution timelines. [Agent insights & details](/governance/analytics/agent-insights-and-details/)
- **Red Team Testing** — test results, risks and recommended strategies. [Red team testing](/governance/red-team-testing/)
- **mAIstro Logs** — agent run logs. [mAIstro logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/)
- **Agent Task Manager** — every mAIstro run in flight, refreshed every few seconds. [Governance overview](/governance/overview/)
- **Token Insights** and **Cost Insights** — token volume and estimated cost for agent runs. [mAIstro logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/)
- **Model Comparison** — the same side-by-side model comparison, reached from the mAIstro group. [Model comparison](/governance/analytics/model-comparison/)

<!-- UNCONFIRMED: the Seek and mAIstro Token Insights / Cost Insights pages appear only on instances that bring their own LLM (BYOLLM) — old map gap and old Token/Cost Insights pages -->

The Token Insights and Cost Insights pages, in both groups, appear on instances that bring their own LLM.

**Custom Governance**

- **Agent Growth**, **Users** and **Add Dashboard** — dashboards you build yourself. [Custom dashboards](/governance/analytics/custom-dashboards/)

Below the three groups, **Usage**, **System Performance** and **System Log** cover account usage and platform health.

## FAQ

### Why does a dashboard show fewer seeks than I expect?

Check the filter chips beside the funnel button and the date range at the top right — every panel is computed over both. An active filter stays in force as you move between dashboards, so a chip set earlier may still be narrowing what you see. Open the **Filter** dialog and select **Clear all** to clear the active filters.

### How do I look at one intent instead of a whole category?

Select **Open filters**, then pick the category under **Filter By Category**. The block becomes **Filter By Intent** and lists that category's intents with their counts; pick the intent you want.

### Which setting do I change when Question Resolution drops?

Question Resolution compares answers that responded with those that fell below the minimum confidence. Start with the [Minimum confidence](/governance/guardrails/min-confidence/) guardrail, and check Semantic Confidence over the same date range to see whether answers really got weaker.

## Related

- [Governance overview](/governance/overview/)
- [Seek overview dashboard](/governance/analytics/seek-overview/)
- [Guardrails overview](/governance/guardrails/overview/)
- [Intent categorization](/governance/intent-categorization/)
- [Seek tokens & cost](/governance/analytics/seek-tokens-cost/)
