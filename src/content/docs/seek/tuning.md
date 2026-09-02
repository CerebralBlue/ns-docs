---
title: 'Tuning answers'
description: 'How to improve the answers Seek generates — reading the scores, controlling how much documentation reaches the LLM, choosing Lucene or vector search, and the settings that work for most deployments.'
---

## What is it

Tuning is the work of getting better answers out of the KnowledgeBase you have already connected.
That KnowledgeBase is your ground truth: everything Seek generates is built from what it returns,
so tuning is mostly about controlling *which* documentation reaches the LLM and *how much* of it.

This page covers bootstrapping a new instance, diagnosing a bad answer, the settings that matter,
and the ones that are usually to blame when something is wrong.

## Why it matters

An LLM asked a question with poor source material will still answer. The failure is not loud —
you get a fluent, plausible, wrong response. Almost every quality problem in a NeuralSeek
deployment is a retrieval problem wearing a generation problem's clothes.

The controls here are also where the trade-offs live: more documents per Seek is not better,
vector search is not better, and a longer answer is not better. Each has a direction that helps
and a direction that hurts.

## When to use it

- A new instance that has never been curated.
- Answers that are irrelevant, inaccurate, or inconsistent between runs.
- Semantic scores that are low, or high on answers that are visibly wrong.
- Responses that get cut off, or take too long to arrive.

## Bootstrapping a new instance

Three options under **Admin Tools > QA Tools**, on the panel headed "Seek (Retrieval Augmented
Generation) Tools", get a new agent from empty to useful:

- **Auto-Generate Questions** — runs a query against the connected KnowledgeBase, generates a
  list of questions relevant to your subject matter, then behaves as if you had entered them
  manually.
- **Manually Input Questions** — takes newline-separated questions and performs a Seek for each.
  This populates the Curate tab and produces a report spreadsheet you can circulate to
  subject-matter experts for review and edits. The Curate tab exports a similar spreadsheet.
- **Upload Test Questions** — upload a CSV of questions, which are run through the Seek endpoint
  in parallel and scored. A template is linked in the panel; input files must keep its column
  titles at a minimum, and you may add extra payload columns. A **Configuration** selector lets
  you run the batch against a specific saved configuration rather than the current one.

Bring subject-matter edits back in through the Curate tab's **Load Q&A** upload — see
[Answer curation](/seek/curation/).

That loop — generate, distribute, edit, upload — is the fastest way to tune an agent against the
subjects that actually matter to you.

## Diagnosing an answer

Start on the [Seek tab](/seek/overview/) and ask the question that is going wrong.

**Semantic Match %.** Below 20% usually means the documentation does not compare well to the
question, or the answer jumps between many sources with unattributed terms. Above 60% on a
low-quality answer points the other way: conflicting answers in your documentation, or source
wording that closely mirrors the query without answering it.

**Semantic Analysis.** The text beside the score explains it — whether the answer drew terms from
many documents or leaned on one.

**KnowledgeBase scores.**

| Score | Reading |
| --- | --- |
| Low coverage | Few documents match the query |
| High coverage | Many documents match, or a few match exactly |
| Low confidence | The KnowledgeBase does not think it found good matches |
| High confidence | Good matches found — though they may still not answer the question directly |

**The sources themselves.** Expand the accordions under the answer to see exactly what the
KnowledgeBase sent to the LLM. If that text does not answer the question, no amount of tuning
will fix the answer — the documentation has to change.

## How it works

Tuning comes down to three controls over what the KnowledgeBase hands the LLM.

### The three controls

They live in **Neural Config > KnowledgeBase Tuning**, which only appears after you select
**Show Advanced Options**.

- **Document Score Range** — widens or narrows the top percentage of documents considered.
- **Max Documents per Seek** — targets only the best-matching documents instead of burying the LLM
  in near-misses. `0` means unlimited; the slider tops out at 30.
- **Snippet Size** — narrows passages out of blocks of unrelated text, or widens the window for
  long paragraphs that mention your subject once.

Three more sit alongside them:

- **Document Date Penalty** — downweights older documents. This is what the Seek tab means when it
  reports results "filtered by Date Penalty or Score Range".
- **Expansion Window** — how many chunks to grab before and after the target chunk, 1 to 10.
- **Max Raw Score** — read-only, with a reset control beside it.

![Screenshot needed — Configure ▸ KnowledgeBase Tuning, showing Document Score Range, Max Documents per Seek and Snippet Size](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config > Show Advanced Options > KnowledgeBase Tuning, with Document
     Score Range, Max Documents per Seek and Snippet Size all in frame with their current values.
     Why: these three interact — the old guide could only teach it with paired before/after
     screenshots — and a reader needs to see them together to understand they are one dial. -->

Set max documents to 1 with snippet size at 2000 and you get a single document, a high semantic
score, and a large passage. Set max documents to 3 with snippet size at 400 and you
get more documents, a lower semantic score, and more source jumps in the answer.

For most use cases a few high-quality documents beat many low-quality or unrelated ones.

### Replaying a previous answer

You can pull previous answers from Logs with the Replay feature, which requires Corporate Logging
against an Elasticsearch instance. See [Replay](/governance/replay/).

## Settings that work for most deployments

**[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)** (under
**Show Advanced Options**)

- Document Score Range: `0.6 – 0.8`
- Max Documents per Seek: `4 – 5`
- Snippet Size: `400 – 600` for documents made of short unrelated paragraphs, such as an FAQ; the
  maximum available for large reference manuals with long passages. Splitting documents that
  contain unrelated information is always better than tuning around them.

**Answer Engineering & Preferences**

- **Answer Verbosity** toward the "Very Concise" end
- **Force Answers from the KnowledgeBase** enabled

**Guardrails** (see [Minimum confidence](/governance/guardrails/min-confidence/) and
[Semantic scoring](/governance/guardrails/semantic-scoring/))

- **Warning Confidence** around ±20%
- **Minimum Confidence** around ±10–20% — answers scoring below it get substitute text
- **Minimum Text** around 1–3 words — the shortest answer accepted before substitution
- **Maximum Length** around 20 words

## Improving the source documentation

This is the highest-leverage change available, and it is not a NeuralSeek setting.

One customer had a very large document defining an acronym near the top, with the acronym then
used hundreds of times across many pages. The KnowledgeBase kept returning the paragraph with the
most occurrences, even though it did not answer the question. Splitting the document by page,
raising the score range and lowering the snippet size let the KnowledgeBase return the relevant
passages instead.

The general rule: **individual documents that speak directly to the subject you want to answer**.

## Hybrid and vector search

NeuralSeek supports vector search on some KnowledgeBase platforms — check the supported
KnowledgeBases page for which.

Vector similarity finds *similar* words; Lucene matches *exact* terms. Search `Animal` under
vector search and you may also get `Cat`, `Dog`, `Mouse`, `Lizard`.

:::caution
Pure vector search is not recommended in any RAG pattern. Search `8.1.0` and Lucene returns only
that term, while vector similarity may also return `8.0.1` or `8.10` — which is how a version
number turns into a hallucination.
:::

If you want vector search, use the **Hybrid** implementation: NeuralSeek boosts the Lucene
results and offers vector results as a fallback.

## Answer variations

Generative models produce small variations of the same answer for the same query. Two ways to
stop that:

- Set the **edited** answer cache to 1 and edit the answer on the Curate tab.
- Set the **normal** answer cache to 1.

Either produces consistent, identical answers and cuts the number of generation calls. See
[Caching](/seek/caching/).

:::note
Edited answers always return a Semantic Score of 100%.
:::

## Filtering documentation

You can filter on any metadata field the KnowledgeBase exposes: set the field in the
**KnowledgeBase Connection** settings and pass a value on the Seek call. With
`metadata.document_type` as the field and `PDF` as the value, only PDFs come back.
Comma-separated values act as an OR.

For richer expressions — ranges, negation, nested fields — see
[Dynamic filters](/seek/dynamic-filters/).

:::note[Watson Discovery users]
To filter by Collection ID, enable the Advanced Schema under KnowledgeBase Connection and enter
`collection_id` in the filter field manually.

`DQL_Pushdown` is also available: select it and pass
[DQL syntax](https://cloud.ibm.com/docs/discovery-data?topic=discovery-data-query-dql-overview)
in the filter value on Seek calls.
:::

The **Re-Sort values list** option prioritizes some documents over others without excluding
anything — internal uploads ahead of a general website scrape, say, or PDFs ahead of DOCX files.

## Avoiding timeouts

NeuralSeek has a limited window to generate a response, bounded further by the LLM's context
window and by the KnowledgeBase's own timeout. When an answer runs out of room it can end mid-thought; NeuralSeek detects these dangling
responses and trims them back to a complete sentence.

Contributing factors: KnowledgeBase retrieval speed, LLM generation speed, chatbot timeout
settings, and network latency.

What helps:

- Reduce the maximum number of documents returned from the KnowledgeBase.
- Use a faster LLM.
- Reduce verbosity in the NeuralSeek configuration.
- Raise the chatbot's timeout threshold.
- Provision services in the same region.

:::note
Verbosity moves both ways — "more concise" for shorter answers, "more verbose" for longer and
more descriptive ones.
:::

## KnowledgeBase translation

When the source documentation is in one language and you need answers in another, enable
**Cross Language** in **Neural Config > Platform Preferences** and set **Default Output
Language**. The setting's own description: "Translate into the KB language when the KB language is
different than the Seek Language."

:::caution
Semantic scoring is **not possible** on cross-language response generation, so NeuralSeek disables
it automatically. You lose the Semantic Match score on every cross-language answer.
:::

A Spanish question against English documentation then runs: accept in Spanish → translate to
English → search in English → generate in English → translate the answer to Spanish.

:::caution[Bring-your-own-LLM users]
Not every model handles cross-language work well. Use a capable one — GPT, Llama 70b or Mixtral.
:::

**Default Language** in the same section sets the platform default; the Seek tab's language
selector and the API's `language` option both override it. You can also set the output language to
**Match Input** to answer in the language of the query, or let the chatbot control it — some chatbots can pass the language to the NeuralSeek API as a
context variable, sourced from the browser language or from part of the chatbot's URL.

## Using multiple data sources

NeuralSeek can run against several configurations on demand, overriding whatever is currently in
the Configure tab. This is how you use multiple KnowledgeBase sources or project IDs, and how you
get past the limits of a single UI configuration.

1. Configure NeuralSeek with the parameters you want and save.
2. Select **Download Settings**, at the bottom of the Configure tab. You get a `.dat` file containing an encoded string of every
   current setting — KnowledgeBase details, project IDs, LLMs and the rest.
3. On a Seek API call, set `options.override` to that encoded string.

That call runs against the saved settings and ignores the current ones in the UI.

## FAQ

### My Semantic Match % is high but the answer is wrong. Why?

A high score means the answer tracks the source closely — so the source is the problem. Look for
conflicting content in your documentation, or passages whose wording closely mirrors the question
without answering it.

### Should I use vector search?

Only as part of Hybrid. Pure vector search materially raises the chance of hallucination,
because "similar" is not "correct" — especially for version numbers, part numbers and codes.

### Why do I get slightly different wording each time I ask the same question?

That is normal generation variance. Set the normal or edited answer cache to 1 to serve one
consistent answer instead.

### Why do my answers get cut off mid-sentence?

The response ran out of time or context. NeuralSeek trims the dangling text back to a complete
sentence, so the symptom is a short answer that stops early. Reduce the maximum documents per
Seek, lower verbosity, use a faster LLM, or raise the chatbot's timeout.

### Can NeuralSeek answer in a language my documents are not written in?

Yes. Enable the cross-language toggle in Platform Preferences and set the output language;
NeuralSeek translates the question into the documentation's language, searches and generates
there, then translates the answer back. Bring-your-own-LLM deployments need a capable model for
this.

### Can one instance answer against more than one KnowledgeBase?

Yes, per call. Save the configuration you want, select **Download Settings**, and pass the
encoded string as `options.override` on the Seek call. That call ignores the current UI settings.
