---
title: "Seek tokens & cost"
description: "The Token Insights and Cost Insights dashboards show how many tokens Seek traffic consumes, its estimated cost per seek and per 1,000 seeks, and how model prices compare."
---

Two Seek Governance dashboards tell you what your Seek traffic costs to run. **Token Insights** measures how many tokens each seek sends to and receives from the model, what that is estimated to cost, and how fast the model generates. **Cost Insights** compares the cost of the available models, so you can weigh a model change before you make it. Use them to size a budget, to explain a jump in spend, and to see whether a configuration change made answers more expensive. The cost figures are estimates computed from a public pricing table, not your provider's invoice.

## Where to find it

Select **Governance** in the top navigation, expand **Seek Governance** in the left panel, and select **Token Insights** or **Cost Insights**.

The **mAIstro Governance** group has its own **Token Insights** and **Cost Insights** pages. Those count tokens for agent runs rather than Seek traffic and are described in [mAIstro logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/).

On Token Insights, **Open filters** and the date range at the top right scope every panel to one category or intent and one time window — see [Reading the dashboards](/governance/analytics/reading-the-dashboards/). Filtering by category or intent is how you find which kind of question consumes the most tokens.

<!-- UNCONFIRMED: Token Insights and Cost Insights appear only on instances that bring their own LLM (BYOLLM) — old map gap and the old hand-written Token/Cost Insights pages -->

:::note
Token Insights and Cost Insights are available on instances that bring their own LLM.
:::

## Dashboard panels and settings

### Token Insights

![Token Insights: the filter bar with an active Intent filter and the date range, the six token and cost cards, and the title of Tokens over Time at the bottom](/img/governance/token-insights.png)

The top of the dashboard is six cards. Each one shows a headline figure for the selected date range and filters, with chips that break it down. The per-seek cards show the **Min**, **Average** and **Max** across the seeks in range, with a scale beneath them.

| Panel                           | What it shows                                                                                                                                                       | Use it to                                                                                                                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Total Tokens**                | "Input and generated token volume": the total in `tokens`, **Input** and **Generated** chips, and a split bar with the share of each in percent.                    | See the overall volume and whether prompts or answers make up most of it.                                                                                                                                                                       |
| **Total Token Cost**            | "Estimated provider cost from pricing table": the total in `USD`, **Input** and **Generated** cost chips, and a split bar with the share of each.                    | Track estimated spend for the period. For actual charges, use your provider's billing.                                                                                                                                                          |
| **Input Tokens per Seek**       | "Prompt/context tokens sent to the model": **Min**, **Average** and **Max** per seek.                                                                               | Check how much prompt and context each question carries. The context includes the knowledge-base passages sent with the question, so this figure follows your [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) settings. |
| **Generated Tokens per Seek**   | "Tokens returned by the model": **Min**, **Average** and **Max** per seek.                                                                                          | Check answer length. It grows when answers get longer.                                                                                                                                                                                          |
| **Cost per 1k Seeks**           | "Estimated cost normalized to 1,000 seeks": in `USD`, with **Min**, **Average** and **Max**.                                                                        | Estimate what more traffic will cost: multiply by your expected volume in thousands of seeks.                                                                                                                                                   |
| **Token Generation per Second** | "Observed model generation throughput": in `tok/s`, with **Min**, **Average** and **Max**.                                                                          | Compare how fast the model produces answers, for example before and after a model change.                                                                                                                                                       |

#### Tokens over Time

**Tokens over Time** is an "interactive time-series view of total, input, and generated tokens", with one line for each of **Total**, **Input** and **Generated**. Use it to spot when token use changed and to line the change up with a configuration change or a traffic spike.

#### Advanced token visualizations

![The advanced token visualizations below Tokens over Time: Token Distribution, LLM Token Intensity, Cost Orbit and Filter Landscape](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/governance/token-insights--advanced.png — Governance > Seek Governance > Token Insights, scrolled below Tokens over Time: the four advanced visualization panels. Why: none of these panels is captured yet. -->

Below the time series, four panels show which model and which slice of traffic drives tokens and cost:

- **Token Distribution** — "Distribution of token usage by model." Use it when your instance uses more than one model, for example with [multiple LLMs](/configuration/multi-llm/).
- **LLM Token Intensity** — "Total token intensity and generated-token share." Use it to compare models by how many tokens they consume and how much of that is generated output.
- **Cost Orbit** — "Token cost split by model, input, and generated usage." Prices come from [llm-stats.com](https://llm-stats.com), as the note under the panel says. When none of the tokens in range can be priced, the panel shows "No priced token cost data available."
- **Filter Landscape** — "Categories, intents, and filters sized by activity." Use it to see which [categories and intents](/governance/intent-categorization/) carry the most traffic, then filter the dashboard to one of them.

<!-- UNCONFIRMED: a model with no price on llm-stats.com adds tokens but no cost — inferred from the Cost Orbit empty state and the "Estimated provider cost from pricing table" subtitle -->

A model that has no price in the pricing table still counts towards the token panels but adds nothing to the cost panels.

### Cost Insights — Model Cost Comparison

![Cost Insights: the date range at the top right and the Model Cost Comparison bar chart, one bar per model labelled with its number, name and provider](/img/governance/cost-insights.png)

**Model Cost Comparison** is a horizontal bar chart with one bar per model, measured on a `Cost` axis. Each bar is labelled `<number>: <model name> (<provider>)` — for example `Claude 4.5 Sonnet (awsbedrock)` — so the same model offered by two providers appears twice. The list covers the models available in your NeuralSeek release, across providers.

<!-- UNCONFIRMED: Model Cost Comparison compares model prices, not this instance's spend — the old Governance page ("compare your selected model cost against other popular models"); the bars are non-zero while Total Token Cost was $0.00 -->

Use the chart to compare your current model's price with the alternatives before you change the model in [LLM Details](/configuration/neural-config/llm-details/). To check whether a cheaper model still answers well, run the same question through several models with [Model Comparison](/governance/analytics/model-comparison/). For the full list of models and what each needs, see [Supported LLMs](/configuration/supported-llms/).

## FAQ

### Is Total Token Cost what my LLM provider will bill?

No. The panel is an "Estimated provider cost from pricing table", with prices taken from llm-stats.com. Your provider's own pricing, discounts and billing rules decide what you are charged, so use its billing for actual costs.

### Why is Cost Orbit empty?

Cost Orbit shows "No priced token cost data available." when none of the tokens in the selected date range and filters can be priced from the pricing table. Widen the date range, clear the filters, or check that the models you use have published prices.

### How do I estimate the cost of more traffic?

Set the date range to a representative period, then read **Cost per 1k Seeks** — the estimated cost normalized to 1,000 seeks. Multiply its **Average** by your expected volume in thousands of seeks. Use **Max** for a cautious upper bound.

## Related

- [Reading the dashboards](/governance/analytics/reading-the-dashboards/) — the filter bar, the date range and the Filter dialog.
- [mAIstro logs, tokens & cost](/governance/analytics/agent-logs-tokens-cost/) — token use and cost for agent runs.
- [LLM Details](/configuration/neural-config/llm-details/) — choose and configure the model Seek uses.
- [Supported LLMs](/configuration/supported-llms/) — the models you can connect.
- [Multi-LLM](/configuration/multi-llm/) — use several models at once.
- [Model Comparison](/governance/analytics/model-comparison/) — run one Seek across models and compare the answers.
- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) — how much knowledge-base context goes to the model.
- [Intent categorization](/governance/intent-categorization/) — the categories and intents the dashboards filter by.
