---
title: "Seek overview"
description: "The Seek tab is NeuralSeek's answer playground: ask a question, read the generated answer, and inspect the provenance, statistics and source passages behind it."
---

## What is it

The Seek tab is NeuralSeek's answer playground. You type a question, choose a language,
press **Seek**, and an answer generates below with a full breakdown of how it was formed —
the phrases carried in from your KnowledgeBase, a statistics table of per-answer metrics, and
the source documents that backed the answer.

Everything on the screen after you ask a question is diagnostic: the answer text, the Session
Options beside it, the statistics table, and the KnowledgeBase Context accordion all describe
one answer so you can see why NeuralSeek returned what it did.

## Why it matters

Seek is where you test how your KnowledgeBase, [Neural Config](/configuration/neural-config/)
settings and [tuning](/seek/tuning/) combine, before that combination answers real traffic
through the API. Because every answer arrives with its provenance highlighting and its scoring
table, you can tell a trustworthy answer from a weak one at a glance, and you can debug a low
score down to the specific unattributed term or source jump that lowered it.

It is the wrong place to judge exactly what production users will see. A playground answer
runs under the tab's own session settings — the **Configuration** you picked (often
`Current`), a test **User ID**, and whatever the cache already holds (a **Cached** badge means
the answer was not freshly generated) — so confirm behaviour that matters through the API
before you rely on it.

## When to use it

- Iterating on a configuration or KnowledgeBase change and checking the effect on real
  questions.
- Debugging a low **Semantic Match** — the statistics table and the Semantic Score Details
  modal show exactly what pulled the score down.
- Confirming which source documents a KnowledgeBase returns for a question, and the passage
  used from each.
- Checking caching and curation behaviour (a repeated question, a curated answer).

It is not the production path. Answers your application serves go through the
[Seek API](/integrations/rest-and-console-api/); the Seek tab is for testing and inspection with a real, human-typed
question.

## How it works

![The Seek tab after a question, showing the question box, language selector, Seek and Personalize buttons, the answer with provenance highlighting, Session Options, the statistics table and the KnowledgeBase Context accordion](/img/seek/default.png)

### Asking a question

Type your question into the question box at the top of the tab (the captured screen shows
`What is NeuralSeek?`), choose the language, and press **Seek**. The answer generates in the
Answer panel below.

- **Seek** runs the search on the text in the question box.
- **English** is the language selector for the question. Its list opens with **Match Input**
  (answer in the same language the question was asked in), followed by the full set of
  languages in alphabetical order — **Abkhazian**, **Afar**, **Afrikaans**, **Akan** and so
  on. `English` is the captured default.

  ![The language list open under the English selector, starting with Match Input, Abkhazian, Afar, Afrikaans, Akan and Albanian](/img/seek/english--options-english.png)
- **Personalize** opens a modal that tailors the next seek to a test customer. It is described
  in full on [Personalization](/seek/personalization/); on this tab it is the entry point.
- **Filter** — the funnel button — narrows the KnowledgeBase for the next seek. The filter
  syntax and the **Filter Text** box live on [Dynamic filters](/seek/dynamic-filters/); on
  this tab it is the entry point.

  ![The Filter dialog opened from the funnel button, with the Filter Text box and its Clear and Save buttons](/img/seek/filter.png)

A repeated, identical question can return the same answer: sending `What is NeuralSeek?` twice
through the API returned identical answer text and scores both times. Separately, the Seek tab
marks an answer with a **Cached** badge next to Total Response Time (see
[the statistics table](#the-statistics-table) below). What the cache stores and when it is used
is covered on [Caching](/seek/caching/).

### The answer panel and provenance

The **Answer** panel shows the generated answer text. When **Provenance** is On (in Session
Options), the phrases that were carried in from the KnowledgeBase are highlighted in the
answer — on the captured screen the shaded phrases include "from the KnowledgeBase", "formation"
and "to speed up response times and". The highlighting is the on-screen effect of Provenance:
it shows you which parts of the answer are grounded in a source rather than generated freely.

At the bottom-right of the Answer panel are **Thumbs Up** and **Thumbs Down** icons for rating
the answer. See [Feedback](/integrations/feedback/) for how ratings are stored and for the
`/rate` API.

What happens to an answer that scores too low is not set on this tab; see
[minimum confidence](/governance/guardrails/min-confidence/).

### Session Options

The Session Options panel sits beside the answer and holds the per-session settings for the
seek.

![The Session Options panel after a second question: User ID 12345, the Session id, Session Turns 2 with the red New Session reset arrow, Provenance On, Streaming On and Configuration Current](/img/seek/seek.png)

- **User ID** (labelled `User ID:`, placeholder `12345`) — a user id to test conversations
  under, so you can see how NeuralSeek behaves across turns for a given user.
- **Session** (labelled `Session:`) — the read-only session id NeuralSeek generated for this
  conversation (`MC44-MzQ3-ODQy` on screen).
- **Session Turns** (labelled `Session Turns:`) — the read-only count of turns in the current
  session (`1` on screen).
- **New Session** — the red reset arrow beside Session Turns. It starts a fresh session with a
  new Session id. (Its icon alt text reads `Reset Context`.)
- **Provenance** (labelled `Provenance:`, captured On) — when On, the answer highlights the
  phrases that came from the KnowledgeBase, as described above.
- **Streaming** (labelled `Streaming:`, captured On) — when On, the answer generates
  word-by-word. If Streaming is Off, the whole answer appears at once.
- **Configuration** (labelled `Configuration:`, captured value `Current`) — selects which
  saved configuration the seek runs against. The list opens with **Current** (the live
  configuration) followed by the instance's saved configuration versions, each shown by its id
  (for example `516263:` and `861640:` on the captured instance).

  ![The Configuration list open, showing Current followed by the saved versions 516263: and 861640:](/img/seek/current--options-current.png)

### The statistics table

Below the answer, a table reports the metrics NeuralSeek computed for this answer. The rows are
read-only; the values below are from the captured answer. The row names and values are
from the screen; the scoring metrics themselves are defined on
[the semantic model](/configuration/semantic-model/).

![The top of the statistics table: Time, Total Response Time 3.647 seconds with a Cached badge, Semantic Match 20% and the Semantic Analysis summary ending in the Statistical Details button](/img/seek/default--statistics-table.png)

<!-- SCREENSHOT: /img/seek/default--statistics-table.png — the crop shows only the first four rows. Recapture the full table (down to Intent Other-neuralseek, Category ID / Answer ID, KnowledgeBase Results and Agents Run) as a section crop on the next seek capture. -->

| Row | What it reports (captured value) |
| --- | --- |
| **Time** | Timestamp of the answer. |
| **Total Response Time** | Total seconds to produce the answer (`3.647 seconds`). A **Cached** badge appears in this cell when the answer was served from cache rather than freshly generated. |
| **Semantic Match** | The overall semantic match percentage (`20%`), broken down in **Statistical Details**. |
| **Semantic Analysis** | A plain-language summary of why the score was what it was, ending in the **Statistical Details** button. |
| **KnowledgeBase Confidence** | How confident the KnowledgeBase is that the retrieved sources relate to the question (`75%`). |
| **KnowledgeBase Coverage** | How much of the retrieved sources relate to the question (`100%`). |
| **KnowledgeBase Response Time** | Time for the KnowledgeBase to return sources (`1.975 seconds`). |
| **Category Selection Time** | Time to select the category (`0.213 seconds`). |
| **Prompt Injection Time** | Time to score the input against the prompt-injection model (`0 seconds`). |
| **Scoring Time** | Time the scoring model ran to compare the answer to the sources (`1.022 seconds`). |
| **Intent** | A link to the matched intent in Curate (`Other-neuralseek`, opening the Curate page for that intent). |
| **Category ID / Answer ID** | `0 / 1790731229555`. The Answer ID is the id you pass to the `/rate` endpoint to score the answer — see [Feedback](/integrations/feedback/). |
| **KnowledgeBase Results** | `2, with 0 filtered by Date Penalty or Score Range` — the number of sources returned and how many were filtered out. |
| **Agents Run** | Any mAIstro agents run for this answer (empty on the captured answer). |

The **Cached** badge on **Total Response Time** is how the Seek tab surfaces a cache hit: on
the captured answer the cell read `3.647 seconds` with a **Cached** badge, confirming that the
badge appears next to Total Response Time. What is cached and for how long is covered on
[Caching](/seek/caching/).

### Statistical Details — the Semantic Score Details modal

The **Statistical Details** button in the Semantic Analysis cell opens a modal titled
**Semantic Score Details** — the breakdown behind the **Semantic Match** percentage.

![The Semantic Score Details modal listing Semantic Match %, Source Jumps, Standard Deviation, Top Source Coverage, Total Coverage, Normalized Answer Length, Longest Phrase, Unattributed Key Terms, Unattributed Terms, Unattributed Numbers and Removed Sentences](/img/seek/statistical-details-panel.png)

It is a read-only table. On the captured answer:

| Row | Value |
| --- | --- |
| **Semantic Match %** | `20%` |
| **Source Jumps** | `15` |
| **Standard Deviation** | `34.5` |
| **Top Source Coverage** | `56%` |
| **Total Coverage** | `79%` |
| **Normalized Answer Length** | `218` |
| **Longest Phrase** | `20` |
| **Unattributed Key Terms** | `NLP` |
| **Unattributed Terms** | `subject, insights` |
| **Unattributed Numbers** | (empty) |
| **Removed Sentences** | (empty) |

**Close** dismisses the modal. What each metric means, and how the scoring model weighs them,
is documented on [the semantic model](/configuration/semantic-model/); this modal is where you
read the values for one answer.

### KnowledgeBase Context — the source passages

Under the statistics table, the **KnowledgeBase Context** accordion lists every source
document that backed the answer, each as a collapsible row with a relevancy percentage.

![The KnowledgeBase Context accordion listing two source documents, each with a relevancy percentage](/img/seek/default--knowledgebase-context.png)

On the captured answer the two sources are
`https://documentation.neuralseek.com/ui/seek/` at **100%** and
`https://documentation.neuralseek.com/features/caching/` at **97%**. The percentage beside
each source is that source's relevancy — how well it matched the question. It is a display
value with a chevron, not an editable control.

Clicking a source row expands the passage used from that document, so you can read the exact
text the answer drew on.

![A source row expanded to show the passage used from that document, with the provenance-highlighted text and its relevancy percentage](/img/seek/knowledgebase-context-panel.png)

### Trained Answers and Stump Speech

Two panels can appear in the Seek breakdown when the answer involves curation or a company
stump speech. Neither was present on the captured answer — it was a fresh generation from two
KnowledgeBase sources — so the following describes what each would indicate.


- A **Trained Answers** panel signals that a curated answer from
  [Curate](/seek/curation/) was served instead of a fresh generation — the answer you see was
  the pinned, trained answer for that question rather than one built on the fly.


- A **Stump Speech** panel reflects the always-appended company text configured in Company /
  Organization Preferences — it shows whether that pinned text contributed to the answer. The
  stump speech is set on [Tuning](/seek/tuning/).

## FAQ

### How do I know which documents my answer came from?

The **KnowledgeBase Context** accordion under the answer lists each source document with a
relevancy percentage. Click a source to expand the passage used from that document.

### What does the Cached badge next to Total Response Time mean?

The answer was served from NeuralSeek's cache rather than freshly generated. A repeated,
identical question returns the same cached answer; see [Caching](/seek/caching/).

### Why is my Semantic Match percentage low?

Open **Statistical Details** for the Semantic Score Details breakdown. Source jumps, low top-
source coverage and unattributed key terms all lower the score — on the captured answer, 15
source jumps and the unattributed term `NLP` were among the causes.

### What is the Answer ID for?

It is the id you pass to the `/rate` endpoint to score an answer. Read it from the
**Category ID / Answer ID** row of the statistics table; see [Feedback](/integrations/feedback/).

### Do the highlighted phrases in the answer mean anything?

Yes. With **Provenance** On, the highlighted phrases are the parts of the answer that were
carried in from the KnowledgeBase, rather than generated freely.
