---
title: "Semantic analytics"
description: "While the semantic score model is enabled, NeuralSeek compares each Seek answer with the source passages it was generated from, and the Semantic Insights dashboard aggregates those scores and source-coverage measurements over a date range so you can see how well answers stay grounded in your documents."
---

NeuralSeek checks each answer it generates against the KnowledgeBase passages it was built from:
how closely the answer's meaning matches its sources, how much of the answer those sources cover,
and which words in the answer the sources never contain. Semantic analytics is the aggregate view
of those checks. Admins and content owners use it on the **Semantic Insights** dashboard in
Governance to judge whether answers stay grounded in their documents over a period, and to find
the terms the model keeps adding on its own.

## How semantic analytics works

### What NeuralSeek measures on each answer

When [Seek](/seek/overview/) answers a question, it retrieves passages from your KnowledgeBase and
an LLM writes the answer from them. NeuralSeek then compares the finished answer with those
passages. This happens while **Enable the Semantic Score Model** is on in the
[Semantic Scoring guardrail](/governance/guardrails/semantic-scoring/); with it off there is no
score. The result is a semantic score, reported with the answer next to the KnowledgeBase score,
plus measurements of how the answer used its sources: how much of it the sources cover, how much
the most-used source covers, how long the longest phrase copied from a source is, and how
often the answer switches from one source to another. Key words in the answer that none of the
sources contain are flagged as hallucinated terms.

On a single answer, you see the same measurements in the Seek tab: the answer's **Semantic Match**
and **Semantic Analysis** rows show the score, and **Statistical Details** in the Semantic
Analysis row opens the **Semantic Score Details** window, which lists Source Jumps, Standard
Deviation, Top Source Coverage, Total Coverage and Longest Phrase for that one answer — the values
this dashboard aggregates. How the score is calculated, the penalties and weights that shape it,
and how to read that window are covered in [Semantic model tuning](/configuration/semantic-model/).
What the score is used for — confidence, reranking results, or removing sentences with
hallucinated key words — is set in the same Semantic Scoring guardrail.

### The Semantic Insights dashboard

To open the dashboard, select **Governance** in the top navigation, then **Semantic Insights**
under **Seek Governance** in the side navigation (the
[Governance overview](/governance/overview/) describes the whole navigation).

![The Semantic Insights dashboard: the Open filters button with an active Intent filter chip and the Select report date range button above the metric cards Semantic Confidence, Longest Source Phrase in Answer, Top Source Coverage, Total Coverage, Total Answer Length and Answer Source Standard Deviation, each with Min, Average and Max and a range bar](/img/governance/semantic-insights.png)

Everything on the dashboard covers the questions in the selected period. Narrow it with
**Open filters** (to one category or intent, see
[Intent categorization](/governance/intent-categorization/); an active filter shows as a chip
beside the button) and **Select report date range**. Both work the same on every Governance dashboard and are
described in [Reading the dashboards](/governance/analytics/reading-the-dashboards/).

**The metric cards.** Seven cards each summarise one measurement across the answers in the
period. A card shows a headline value, the **Min**, **Average** and **Max** for the period, and a
range bar that marks where Min, Avg and Max fall on the metric's scale.

| Card                                 | What it shows (the card's subtitle)               | Unit       |
| ------------------------------------ | ------------------------------------------------- | ---------- |
| **Semantic Confidence**              | Semantic score distribution                       | percentage |
| **Longest Source Phrase in Answer**  | Longest copied source phrase observed in answers  | tokens     |
| **Top Source Coverage**              | Share of answer covered by the most-used source   | percentage |
| **Total Coverage**                   | Total grounded source coverage                    | percentage |
| **Total Answer Length**              | Answer length distribution                        | chars      |
| **Answer Source Standard Deviation** | Variation in answer source usage                  | 0.0 to 1.0 |
| **Answer Source Jumps**              | Source transition count distribution              | count      |

Two more cards show how questions were handled rather than how answers were built:

- **Question Resolution** — "Questions above versus below minimum confidence." It splits the
  period's questions into **Responded** and **Below**, with the **Total** count; the chart legend
  reads "Responded" and "Below minimum confidence". The threshold is the one set in the
  [Minimum confidence guardrail](/governance/guardrails/min-confidence/). The same measure appears
  on the [Seek overview dashboard](/governance/analytics/seek-overview/).
- **Cache Hit %** — "Cached, edited, and uncached answer behavior." It splits answers into
  **Cached**, **Edited** and **UnCached**.

<!-- UNCONFIRMED: Cache Hit % "Edited" counts answers served from the Edited answer cache (hand-edited answers) and "Cached" answers served from the Normal answer cache — inferred from the card subtitle and the caching settings -->

Cached answers came from the answer cache, edited ones from answers someone edited by hand in
[Curate](/seek/curation/), and
uncached ones were generated fresh. The two answer caches are explained in
[Caching](/seek/caching/).

**Advanced visual analytics.** Below the cards, four panels show the same data in other shapes:

- **Semantic Distribution** — "Normalized distribution of semantic metrics." One series per card
  metric (Semantic Confidence through Answer Source Jumps), normalised to 0–100 % so you can
  compare their spread side by side.
- **Semantic Quality** — "Min, average, and max values across key quality strings." A chart with
  one axis each for Semantic Confidence, Top Source Coverage, Total Coverage, Question Resolution
  and Cache Hit, showing the minimum, average and maximum of each.
- **Hallucination Bloom** — "Radial view of hallucinated term frequency." The terms flagged as
  hallucinated in the period, drawn as a radial chart of how often each was flagged.
- **Top Hallucinated Terms** — "Most frequently flagged terms. Click a term to allow-list it."
  The flagged terms ranked by frequency.

![Screenshot pending: the Advanced visual analytics panels of the Semantic Insights dashboard — Semantic Distribution, Semantic Quality, Hallucination Bloom and Top Hallucinated Terms](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/governance/semantic-insights--advanced-visual-analytics.png — Governance > Seek Governance > Semantic Insights, scroll to the "Advanced visual analytics" region; capture it with at least one hallucinated term listed. Why: the four panels are below the fold and the reader has no picture of them -->

When the period has no flagged terms, both hallucination panels say "No hallucinated terms found
for this period." Before reading that as a clean result, check the cards above: if **Total
Coverage** and **Longest Source Phrase in Answer** read zero as well, the empty panels do not show
that the answers were grounded. Widen the date range, and check that **Enable the Semantic Score
Model** is on for the configuration that answered.

<!-- UNCONFIRMED: selecting a term opens an Allow Term confirmation with Cancel and Allow this term, and the term is added to the semantic model's always-allowed terms — the dialog's labels are on the screen, the flow and its target list were not observed -->

To stop a term from being flagged — a product name, a version or a domain word that your answers
use correctly but your documents spell differently or never mention — select it in
**Top Hallucinated Terms** and confirm with **Allow this term**. Allowed terms are no longer
penalised by the semantic score; you can review the list in the allowed-terms box of
[Semantic model tuning](/configuration/semantic-model/).

## When to use it

Open Semantic Insights when you want to know how well answers are grounded across many questions,
not one:

- **After a content or configuration change.** Compare the same date range before and after you
  load new documents, change [KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/)
  or adjust the semantic model. As a reading guide, a drop in **Total Coverage** suggests answers
  now lean more on the model's own wording; a drop in **Semantic Confidence** can have other
  causes too, such as the penalties for missing search terms or declined answers. Open
  **Semantic Score Details** on a few of the period's answers to find which measurement fell.
- **To find terms worth allowing.** A product or company name near the top of
  **Top Hallucinated Terms** usually needs allowing, not a content fix. A term that is genuinely
  wrong points to a gap in your documents or a prompt that invites the model to improvise.
- **To understand how answers are assembled.** As a reading guide: a high **Top Source Coverage**
  with few **Answer Source Jumps** suggests answers drawn mostly from one document; many jumps
  with a high **Answer Source Standard Deviation** suggest answers stitched from several sources.
  If stitched answers are expected for your content and they score low, that is a case for
  lowering the **Source Jump penalty** in Semantic model tuning.
- **Per intent.** Filter to one intent or category with **Open filters** to see whether a weak
  area of your documentation is dragging the averages down.

It is the wrong tool for a single bad answer — ask the question in Seek and look at that answer's
score and sources. To find which questions scored low, use the logs described in
[Seek logs and configuration insights](/governance/analytics/seek-logs-and-config-insights/). To
change what happens to a low-scoring answer, use the
[Semantic Scoring](/governance/guardrails/semantic-scoring/) and
[Minimum confidence](/governance/guardrails/min-confidence/) guardrails.

## FAQ

### The Hallucination Bloom says "No hallucinated terms found for this period." Is something wrong?

Not necessarily. The panels show it whenever no term was flagged in the selected period, which is
not the same as every answer being grounded. If **Total Coverage** and **Longest Source Phrase in
Answer** also read zero, the period gave the dashboard little to measure: widen the date range or
clear the filters to check a larger set of answers, and confirm that **Enable the Semantic Score
Model** is on in the Semantic Scoring guardrail.

### A product name keeps showing up in Top Hallucinated Terms. How do I stop it being flagged?

Select the term in **Top Hallucinated Terms** to allow-list it, as the panel's subtitle says. To
allow a term before it is ever flagged, add it to the allowed-terms box in
[Semantic model tuning](/configuration/semantic-model/).

### What does Question Resolution count as "Below"?

Questions whose answer scored below the minimum confidence threshold set in the
[Minimum confidence guardrail](/governance/guardrails/min-confidence/). Those questions received
the guardrail's reply instead of a generated answer.

## Related

- [Reading the dashboards](/governance/analytics/reading-the-dashboards/) — filters and date range
- [Semantic Scoring guardrail](/governance/guardrails/semantic-scoring/)
- [Semantic model tuning](/configuration/semantic-model/)
- [Minimum confidence](/governance/guardrails/min-confidence/)
- [Caching](/seek/caching/)
- [Seek overview dashboard](/governance/analytics/seek-overview/)
