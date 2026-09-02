---
title: 'Seek overview'
description: 'The Seek tab: ask a question against your KnowledgeBase, see which sources produced the answer, and read the scores that tell you whether to trust it.'
---

## What is it

Seek is the tab where you ask your KnowledgeBase a question and get the generated answer back,
one query at a time. Alongside the answer it shows where the content came from and how closely
the answer tracks it — a semantic match score comparing the generated text against the source
documents, plus timings and confidence figures for each stage.

It is the console's test bench for retrieval: the place to ask a question and see the reasoning
behind the answer rather than just the answer.

## Why it matters

An answer on its own tells you nothing about whether it is safe to ship. Seek shows the sources
behind it and scores the alignment, so a wrong answer is diagnosable: you can see whether the
KnowledgeBase returned the wrong documents, or returned the right ones and the answer drifted
from them.

Seek and the [Chat client](/seek/chat-client/) differ in surface, not in memory — both keep
conversational context. Seek scores one question at a time and shows the sources behind it, which
is what makes it the tool for tuning. Chat is a continuous conversation with the widget
configuration beside it, which makes it the tool for judging the deployed experience.

## When to use it

- Checking whether a question your users actually ask returns a usable answer.
- Diagnosing a bad answer — retrieval problem, or generation problem.
- Testing conversational behaviour under a fixed User ID and Session ID.
- Previewing personalization and filters before wiring them into an integration.

## How it works

Seek answers from your connected KnowledgeBase, so an instance with no
[KnowledgeBase connection](/configuration/neural-config/knowledgebase-connection/) has nothing to
answer from.

Type a query, set its language, and select **Seek**. The answer generates below.

The controls beside the query:

- **User ID** — view and set a User ID to test conversations.
- **Session** — a unique session number, generated for you. Start a fresh session with the red
  arrow next to **Session Turns**.
- **Session Turns** — how many turns have been generated under the current session.
- **Provenance** — highlights, inside the answer, which text came from the KnowledgeBase and which
  from the trained answer. On or off.
- **Streaming** — on, the response arrives word by word; off, it appears all at once.
- **Configuration** — which saved configuration this question runs against. `Current` uses the
  settings as they stand in Neural Config.

### Reading the output

![The Seek tab after a question has been answered — the query box, the answer with provenance highlighting, Session Options, the full output table and KnowledgeBase Context](/img/seek/overview/seek-tab.png)

| Information output | Description |
| --- | --- |
| **Time** | When the answer was generated, with the timezone. |
| **Total Response Time** | Total time for the response to generate, in seconds. A `Cached` badge beside it means the answer was served from cache rather than generated. |
| **Semantic Match** | Overall match score — how well NeuralSeek believes the response aligns with the ground truth in the KnowledgeBase. Higher is more accurate and more relevant to the source. |
| **Semantic Analysis** | A plain-language summary of why that score was calculated, so a high or low score can be understood rather than guessed at. A **Statistical Details** link opens the breakdown behind it. |
| **KnowledgeBase Confidence** | How likely it is that the information found in the KnowledgeBase and used in the response is correct. |
| **KnowledgeBase Coverage** | How many documents, or sections of documents, discuss the subject area of the question. |
| **KnowledgeBase Response Time** | Time for the KnowledgeBase to return a response, in seconds. |
| **Category Selection Time** | Category selection time. |
| **Prompt Injection Time** | Time taken to score the input against the prompt-injection model. Input is scored for injection attempts; problematic words are filtered out, and the whole input can be blocked depending on the probability. |
| **Scoring Time** | Total time the internal model takes to compare the answer against the source documentation. |
| **Intent** | The intent of the answer. |
| **Category ID/Answer ID** | The category ID of the answer. Use it to refer to the answer from other endpoints, such as the Rating endpoint. |
| **KnowledgeBase Results** | How many retrieved sources the KnowledgeBase considers related to the question, and how many of those were filtered out by Date Penalty or Score Range. |
| **Agents Run** | Which agents ran while answering, if any. |

:::tip
[Semantic analytics](/governance/semantic-analytics/) covers what NeuralSeek does with these
scores across an instance rather than a single answer.
:::

### Other things you can do here

Rate an answer with the **Thumbs Up** or **Thumbs Down** icons.

Personalize and filter across your KnowledgeBase documents from this tab —
see [Personalization](/seek/personalization/) and [Dynamic filters](/seek/dynamic-filters/).

**Minimum confidence** is a threshold set in the configuration: an answer scoring below it is
replaced by substitute text. When that happens a red **Minimum Confidence** badge appears under
the answer, reading "Click to view generated answer" — select it to see what would have been
returned. See [Minimum confidence](/governance/guardrails/min-confidence/).

### The panels below the table

- **KnowledgeBase Context** — each source document that contributed, with its score and a chevron
  to expand the passage that was used.
- **Stump Speech** — the always-pinned content, and any personalization details passed with the
  request.

## Guides

Guides that relate to the Seek tab:

- [Tuning answers](/seek/tuning/)
- [Virtual KB](/seek/virtual-kb/)
- [Dynamic filters](/seek/dynamic-filters/)
- [Semantic model tuning](/configuration/semantic-model/)
- [Training virtual agents](/integrations/training-virtual-agents/)

## FAQ

### What does a low Semantic Match % actually mean?

That the generated answer does not track the source documents closely. Read **Semantic Analysis**
next to it — it says why the score came out where it did, which usually points at either the
wrong sources being retrieved or an answer that went beyond them.

### What is the difference between the three percentages?

**Semantic Match %** compares the generated answer against the source documents — how closely the
answer tracks what the documentation actually says. **KnowledgeBase Coverage %** is about the
documentation itself: how many documents or sections discuss the subject at all.
**KnowledgeBase Confidence %** is how likely the retrieved information is to be correct.

Read coverage and confidence together. Low confidence with low coverage usually means there is
little or no documentation on the subject; low confidence with high coverage usually means your
sources contradict each other.

### Why does my answer differ from one run to the next?

Check whether the answer is being served from cache. A cached answer is identical every time; a
freshly generated one need not be. See [Caching](/seek/caching/).

### How do I test a multi-turn conversation here?

Set a **User ID** and keep the same **Session ID** across questions — **Session Turns** counts
them. See [Conversational context](/seek/conversational-context/) for how context is carried.
