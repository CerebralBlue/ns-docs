---
title: "Model comparison"
description: "Model Comparison in Governance runs one question through Seek on each LLM you select from your configured models and shows response time, Semantic Score and LLM Rank side by side."
---

Model Comparison answers a practical question: which of the LLMs configured on your instance gives the best answer to _your_ questions, from _your_ KnowledgeBase? You pick models, enter one question, and the page runs it through [Seek](/seek/overview/) on each selected model, then lines the results up side by side. Use it when you choose a model for a use case, or to re-check answer quality and speed after a provider releases a new model version. It compares models on one question at a time, so it complements rather than replaces the traffic dashboards in Governance.

## Where to find it

Open **Governance** in the top navigation. Model Comparison appears twice in the Governance navigation:

- **Seek Governance** > **Model Comparison** opens the **Seek LLM Comparison** page, which compares grounded Seek answers. Most of this page describes it.
- **mAIstro Governance** > **Model Comparison** compares an agent across models; see [Comparing an agent across models](#comparing-an-agent-across-models).

## Settings

### Choosing the models

The **Configured Models** section has one card for each LLM configured on your instance. Each card shows the provider's logo, the provider name (for example OpenAI) and, in bold, the model name. Select a card to include that model in the comparison, and select it again to leave it out.

![The Seek LLM Comparison page: the Configured Models cards, each with the provider's logo, the provider name and the model name, the New Comparison and Previous Runs tabs, the Comparison Question box with Run Comparison, and the empty Comparison Results area](/img/governance/model-comparison.png)

The cards come from [LLM Details](/configuration/neural-config/llm-details/). To compare a model that has no card yet, add it there first; running several models side by side on one instance is described in [Multiple LLMs](/configuration/multi-llm/). Compare models that could realistically serve the same job — for example a small, fast model against a larger one — so the result helps you decide something.

### Running a comparison

1. Select the models to compare under **Configured Models**.
2. On the **New Comparison** tab, type a question into **Comparison Question**.
3. Select **Run Comparison**.
4. Read the outcome under **Comparison Results** (see [Reading the comparison results](#reading-the-comparison-results)).

Use a question your users actually ask, phrased the way they ask it. The comparison runs against your own KnowledgeBase, so a representative question tells you how each model performs on your content, which a generic benchmark cannot.

<!-- UNCONFIRMED: each selected model is a separate Seek call, so a comparison across N models uses about N Seeks — old page governance/seek-model-comparison -->
Each selected model runs its own Seek, so a comparison across several models counts like several Seek requests. Keep the selection to the models you are really choosing between.

### Reopening a previous run

The **Previous Runs** tab lets you open an earlier comparison and show its results under **Comparison Results** again, without running the question a second time. Use it to compare today's results with an earlier run, for example after a provider updates a model.

<!-- UNCONFIRMED: every comparison run is saved under Previous Runs automatically and is picked from a dropdown — old page governance/seek-model-comparison -->
Comparisons are saved there automatically, and you pick the one to reopen from a list.

## Reading the comparison results

**Comparison Results** stays empty until you run a comparison or reopen a previous run. It then shows a written summary of the run, a radar chart that plots the selected models against each other, and a results table with one row per model:

| Column                 | What it shows                                                                                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Model**              | The model that produced this answer.                                                                                                                                                    |
| **Provider**           | The provider of that model.                                                                                                                                                             |
| **Response Time (ms)** | How long this model took to answer, in milliseconds.                                                                                                                                   |
| **Semantic Score**     | How well the answer is backed by your KnowledgeBase content — the same score Seek computes for every answer. See [Semantic model](/configuration/semantic-model/) for how it is scored. |
| **LLM Rank**           | The model's position in this comparison.                                                                                                                                                |

![Comparison Results after a run: the summary, the radar chart and the results table](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/governance/model-comparison--results.png — Governance > Seek Governance > Model Comparison > select two models, run a comparison > Comparison Results with the summary, radar chart and a filled results table. Why: readers need to see what a finished comparison looks like before spending Seeks on one -->

Read Response Time and Semantic Score together: a fast model with a low Semantic Score is answering less from your content, which usually matters more than the milliseconds saved. To see how Semantic Scores behave across all your Seek traffic rather than one question, use [Semantic analytics](/governance/semantic-analytics/); for what each model costs over time, see [Seek tokens and cost](/governance/analytics/seek-tokens-cost/).

## Comparing an agent across models

**Model Comparison** under **mAIstro Governance** does the same job for an [agent](/maistro/overview/): it runs one agent on each selected model and compares the runs, which shows how a change of model affects the whole agent flow, not only the wording of one answer.

<!-- UNCONFIRMED: the mAIstro Model Comparison page has an Agent Selection dropdown, takes the agent's parameters, runs the agent once per selected model, and its results table has the columns Model, Provider, Response Time (ms), Response Score and Agent Score — old page governance/maistro-model-comparison -->
You choose the agent under **Agent Selection**, set its parameters as you would for a normal run, and select **Run Comparison**; the agent runs once per selected model. The results table shows **Model**, **Provider**, **Response Time (ms)**, **Response Score** and **Agent Score** for each model. Because every model is a full agent run, a comparison of an agent that calls other agents or external services costs accordingly. To follow an agent's performance over time without comparing models, use [Agent insights and details](/governance/analytics/agent-insights-and-details/).

## FAQ

### Which models can I compare?

The LLMs configured on your instance — each appears as a card under **Configured Models**. To compare another model, add it in [LLM Details](/configuration/neural-config/llm-details/) first.

### Can I see an earlier comparison without running it again?

Yes. Open the **Previous Runs** tab and pick the run; its results appear under **Comparison Results**.

## Related

- [LLM Details](/configuration/neural-config/llm-details/) — configure the models that appear as cards
- [Multiple LLMs](/configuration/multi-llm/) — run several models on one instance
- [Semantic model](/configuration/semantic-model/) — how the Semantic Score is computed
- [Seek tokens and cost](/governance/analytics/seek-tokens-cost/) — what each model costs over time
- [Agent insights and details](/governance/analytics/agent-insights-and-details/) — agent performance over time
- [Governance overview](/governance/overview/)
