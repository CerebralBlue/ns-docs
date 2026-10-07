---
title: "Seek overview dashboard"
description: "The Overview dashboard is the Governance landing page: eleven panels that show how confident Seek answers are, how often each guardrail fired, and which intents and categories carry the traffic."
---

The **Overview** dashboard is the first screen you see in Governance. It answers three questions about your Seek traffic in one place: are the answers well supported by your sources, how often did the guardrails step in, and which intents and categories are people asking about. Use it as a daily health check, then open the detailed dashboard for whatever looks wrong. Every panel reflects the filters and date range set at the top of the page, so scope them first.

## Where to find it

Select **Governance** in the top navigation. The **Overview** dashboard under **Seek Governance** opens by default; to come back to it from another dashboard, select **Seek Governance** > **Overview** in the side navigation. For the rest of the Governance screen and its navigation, see [Governance overview](/governance/overview/).

![The Governance screen with Seek Governance > Overview selected in the side navigation and the first six panels of the Overview dashboard](/img/governance/overview.png)

## Panels and filter settings

The dashboard has two controls and eleven panels. The controls decide which seeks the panels count; the panels have nothing to set.

### Filter and date range

![The Filter dialog opened from the funnel button, with Filter By Category and Filter By Filter](/img/governance/open-filters-panel.png)

- **Open filters** — the funnel button at the top left opens the Filter dialog, where you pick a category, then an intent within it. Every panel on the dashboard narrows to that selection, so you can read **Question Resolution** or **Prompt Injection** for one category at a time. Each active filter shows as a chip beside the button (for example **Intent** followed by the intent name); select × on a chip to remove it. The dialog itself is described in [Reading the dashboards](/governance/analytics/reading-the-dashboards/).
- **Select date range** — the date and time window at the top right (calendar icon, start and end time, caret). Every panel covers only the seeks in this window. Widen it when a panel has too few questions to read; narrow it to check the effect of a configuration change you made on a known date.

### Answer quality and guardrail rates

The first two rows of the dashboard hold six rate panels. Each one has a title and a one-line subtitle that says what it measures.

![The first two rows of the Overview dashboard: Semantic Confidence, Question Resolution, Hate, Abuse, Profanity Block, Prompt Injection, Prompt Injection Action and Questions containing PII](/img/governance/default.png)

| Panel                            | Subtitle on screen                          | What it shows                                                                                                                                                                                                                  | Where the behaviour is set                                         |
| -------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| **Semantic Confidence**          | Min, average, and max semantic score        | The semantic score of the answers — how well each answer is supported by its source documents — as a large percentage, **Min**, **Average** and **Max** chips, and a 0–100 scale marking all three. Tagged **Current metric**. | [Semantic scoring](/governance/guardrails/semantic-scoring/)       |
| **Question Resolution**          | Responded vs below min confidence           | A donut with the share of questions that got an answer (**responded**) in the centre; the legend splits **Responded** from **Other**.                                                                                          | [Minimum confidence](/governance/guardrails/min-confidence/)       |
| **Hate, Abuse, Profanity Block** | Detected HAP filter rate                    | A donut with the share of questions the HAP filter blocked (**blocked**); the legend splits **HAP** from **Other**.                                                                                                            | [Profanity (HAP) filter](/governance/guardrails/profanity-hap/)    |
| **Prompt Injection**             | Min, average, and max prompt injection risk | How risky the incoming questions scored, as a large percentage, **Min**, **Average** and **Max** chips, and a 0–100 scale. Tagged **Safety**.                                                                                  | [Prompt injection](/governance/guardrails/prompt-injection/)       |
| **Prompt Injection Action**      | Block, remove, or no action                 | The share of questions NeuralSeek acted on (**% acted**), a stacked bar, and the percentage for each outcome: **Block**, **Remove** and **No Action**.                                                                         | The same prompt injection guardrail                                |
| **Questions containing PII**     | PII detection rate                          | A donut with the share of questions in which personal information was detected (**PII**); the legend splits **PII** from **Other**.                                                                                            | [PII detection](/governance/pii-detection/)                        |

Read **Prompt Injection** and **Prompt Injection Action** together. The first is exposure: how risky the questions people sent were. The second is enforcement: what NeuralSeek did with them. Risk scores that climb while **No Action** stays near 100 % mean the guardrail is letting risky input through.

<!-- UNCONFIRMED: Block and Remove correspond to the Prompt Injection guardrail's two thresholds (Prompt Injection Threshold blocks the question, Prompt Injection Removal Threshold strips the risky part) — inferred from the panel's labels and the guardrail page; not shown on the dashboard -->

**Block** and **Remove** match the two thresholds of the prompt injection guardrail: one blocks the question outright, the other strips the risky part and lets the rest through. If risky questions are getting through, review those thresholds.

To change what these rates mean for your users — the confidence a question needs to be answered, or which guardrails are on — open the [Guardrails](/governance/guardrails/overview/) settings.

### Intent charts

Three full-width charts below the rate panels break answer quality down by intent. Use them to find the intents that need work, then fix the content or the configuration behind them.

![The Top Intents, Intent Confidence Distribution and Intent Semantic-to-KB Relationship charts of the Overview dashboard](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/governance/default--intent-charts.png — Governance > Seek Governance > Overview, scroll the main area below the second row: crop the Top Intents, Intent Confidence Distribution and Intent Semantic-to-KB Relationship panels. Why: the three chart types are hard to picture from text alone -->

- **Top Intents** — "Semantic score, KB confidence, and frequency by intent." A bubble chart (tagged **Bubble size = volume**) that places each intent by its **Average Semantic Score** and **Average KB Confidence**, both on a 0–100 scale. The bigger the bubble, the more seeks that intent received. A large bubble that is low on both scores is a frequent question your knowledge base answers poorly — the first one to fix.
- **Intent Confidence Distribution** — "Semantic confidence spread across top intents." One violin per intent along a **Semantic Confidence** axis from 0 to 100. A narrow violin means the answers for that intent are consistently scored; a wide one means some answers are well supported and others are not, which usually points to uneven source documents for that topic.
- **Intent Semantic-to-KB Relationship** — "Semantic score compared with KB confidence by intent." Two values per intent on a 0 %–100 % scale: **Semantic score** and **KB confidence**. KB confidence reflects how well the knowledge base search matched the question (tuned in [KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/)).

<!-- UNCONFIRMED: Intent Semantic-to-KB Relationship separates bad retrieval from bad generation — from the documentation gap list for this page, an interpretation not stated on screen -->

Comparing the two values tells you where an intent goes wrong. Low KB confidence means retrieval is the problem: the knowledge base found weak sources, so add or improve the content for that topic. Good KB confidence with a low semantic score means generation is the problem: the answer drifted from the sources it was given.

For the semantic score in more depth — per answer, with the details behind each score — use [Semantic analytics](/governance/semantic-analytics/).

### Summary panels

The last row sums up the guardrails in one panel and the traffic in another.

![The Governance Rings and Category Landscape panels of the Overview dashboard](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/governance/default--summary-panels.png — Governance > Seek Governance > Overview, scroll to the bottom of the main area: crop the Governance Rings and Category Landscape panels. Why: shows how the four rings and the category tiles look -->

- **Governance Rings** — "Resolution, HAP, prompt injection, and PII indicators." Concentric rings with the **resolved** percentage in the centre and a legend listing **Question Resolution**, **HAP**, **Prompt Injection** and **PII**, each with its percentage. It repeats four of the rate panels above in one view, which makes it the panel to glance at when you only have a moment.
- **Category Landscape** — "Top categories or intents by volume." Tiles sized by volume, each labelled with a category name and its number of seeks. It shows where your traffic goes, so you know which categories deserve the most attention. The categories come from [intent categorization](/governance/intent-categorization/).

## FAQ

### What counts as a resolved question?

**Question Resolution** splits seeks into **Responded** and **Other**. As its subtitle "Responded vs below min confidence" says, a question counts as unresolved when its answer fell below the minimum confidence threshold. That threshold is set in the Minimum confidence guardrail (linked from the table above).

### Prompt Injection shows risk, but Prompt Injection Action shows No Action. Is that a problem?

It can be. **Prompt Injection** scores the questions; **Prompt Injection Action** shows what was done with them. Risky questions with **No Action** mean the prompt injection thresholds are disabled or set above the scores you see. Review them in the prompt injection guardrail.

### How do I see these numbers for one category or intent?

Select **Open filters**, pick the category and then the intent. All eleven panels narrow to that selection until you remove the chip.

## Related

- [Reading the dashboards](/governance/analytics/reading-the-dashboards/) — the Filter dialog and date range shared by every dashboard
- [Governance overview](/governance/overview/) — the Governance screen and its navigation
- [Guardrails overview](/governance/guardrails/overview/) — the settings behind the rate panels
- [Semantic analytics](/governance/semantic-analytics/) — semantic scores in depth
- [Intent categorization](/governance/intent-categorization/) — where the intents and categories come from
