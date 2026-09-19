---
title: "Caching"
description: "NeuralSeek has three caches — one on KnowledgeBase queries and two on answers (edited and normal) — each with its own setting in the Neural Config Edit Configuration dialog."
---

NeuralSeek can answer a question without searching the KnowledgeBase or calling an LLM again, by
reusing work it has already done. This page explains the three caches that make that happen,
where each one is configured, and what decides whether a stored answer may be used for the
question in front of it. The settings themselves are documented on the Neural Config pages that
own them; this page gives them the caching angle and links there.

## What is it

NeuralSeek has three caches, and they are independent of each other:

- **The KnowledgeBase query cache** keeps a KnowledgeBase query result for a set number of
  minutes, so a later question needing the same material skips the search. It is the
  **KnowledgeBase Query Cache (minutes)** slider in **KnowledgeBase Tuning**.
- **The edited answer cache** serves an answer somebody curated by hand instead of generating a
  new one. It is the **Edited answer cache** slider in **Intent Matching & Cache Configuration**.
- **The normal answer cache** serves a recent generated answer — or an edited one, which takes
  priority — instead of generating a new one. It is the **Normal answer cache** slider, next to
  the edited one.

A question can hit any of the three, all of them, or none. The product's own summary of the two
answer caches is on the screen that holds them: "NeuralSeek can serve cached answers to user
questions in order to speed up response times or produce more consistent results."

## Why it matters

An uncached question pays for a KnowledgeBase search and an LLM call every time it is asked.
Frequently asked questions pay that repeatedly for an answer that does not change, so caching
removes both the response time and the token spend — and it makes the same question come back
with the same wording rather than a slightly different one each time.

The cost is staleness. A cached answer can outlive the document it came from. NeuralSeek guards
the generated side of this itself — the normal answer cache serves a recent answer only "if the
relevant documentation has not changed" — but it does not guard the edited side. The product is
explicit about that: "Edited answers are retained until updated or deleted, even if the source
documentation changes - so use caution to be sure your edited answers do not contain out-of-date
information."

## When to use it

- High-volume questions whose answers rarely change — policies, definitions, plan limits.
  These are what the answer caches are for.
- Answers you have curated and want served verbatim rather than regenerated. That is the
  edited answer cache, and it is the one case where the cache is the point rather than an
  optimisation.
- Source material that is expensive to search — a long-running KnowledgeBase query behind
  many similar questions is what the query cache shortens.

Caching is the wrong tool when the underlying documentation changes through the day and readers
must see the change immediately, and when an edited answer would go unreviewed: nothing expires
it for you. In both cases keep the query cache short or `Disabled`, and keep an eye on
[Curate](/seek/curation/).

## How it works

### Where the caches are configured

All three settings live in the **Edit Configuration** dialog on the
[Neural Config](/configuration/neural-config/using-this-page/) screen. On the routing tree, open
the **Default Config** node (its second line reads **Answer Generation**), then
**Edit Configuration** — the dialog titled
**Configuration: Default Config** opens with a list of accordion sections. Two of them hold the
caches: **KnowledgeBase Tuning** (the query cache) and **Intent Matching & Cache Configuration**
(the two answer caches and the three conditions that gate them). The dialog's opener and its
**Propose Changes** / **Save** footer are described in
[Using this page](/configuration/neural-config/using-this-page/).

![The Configuration: Default Config dialog with its accordion sections listed and Intent Matching & Cache Configuration expanded at the bottom, above the Propose Changes and Save footer](/img/neural-config/intent-matching-cache-configuration.png)

### The KnowledgeBase query cache

The **KnowledgeBase Query Cache (minutes)** slider sits in the **KnowledgeBase Tuning** section,
bottom-left of the field group. It runs from `Disabled` at the left end to `6000` at the right,
and the unit in its label is the point: this is how long a KnowledgeBase query result is kept,
not how many answers must exist. On the instance captured for this page it reads `0`, with the
handle on `Disabled`, so every Seek there runs a fresh KnowledgeBase query. The accordion's
opening paragraph is about KB tuning generally and says nothing about the cache; the rest of that
section is documented in
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

![The KnowledgeBase Tuning field group, with the KnowledgeBase Query Cache (minutes) slider at bottom-left set to Disabled](/img/neural-config/knowledgebase-tuning--document-score-range.png)

<!-- UNCONFIRMED: the KnowledgeBase cache stores the processed content window of roughly 8,000–9,000 characters that goes to the LLM, and NeuralSeek derives a hash of it — from the previous MkDocs page for this route; nothing on the captured screen says what the query cache stores. -->

What the query cache stores is not shown on screen. The previous version of this page said it is
the processed content window of roughly 8,000–9,000 characters that goes to the LLM, hashed so
that a later change to the source can be detected; treat that as an explanation candidate, not a
documented mechanism.

### The two answer caches

The **Intent Matching & Cache Configuration** section holds every answer-cache control on one
panel: the intent paragraph and **Intent Match Tolerance** at the top, then the cache paragraph,
the two sliders with their help text and value boxes, and the two `Yes` / `No` selectors under
the second slider.

![The Intent Matching & Cache Configuration accordion body: Intent Match Tolerance, then the Edited answer cache and Normal answer cache sliders with their help text, and the two Yes/No selectors](/img/neural-config/intent-matching-cache-configuration--intent-match-tolerance.png)

Both sliders share the same range, `Disabled` at the left end and `5` at the right, and each has
a value box beside it. On the instance captured for this page they hold different values:

| Cache                   | Range            | On the instance captured here |
| ----------------------- | ---------------- | ----------------------------- |
| **Edited answer cache** | `Disabled` … `5` | `3`                           |
| **Normal answer cache** | `Disabled` … `5` | `5`                           |

**Edited answer cache** serves an answer a person curated in [Curate](/seek/curation/),
verbatim. Its help text: "Serve an edited answer when at least this many different edited
answers exist for a user question. Edited answers are retained until updated or deleted, even if
the source documentation changes - so use caution to be sure your edited answers do not contain
out-of-date information. Set 0 to disable the edited answer cache."

![The Edited answer cache heading, help text and slider, set to 3 on a Disabled to 5 range](/img/neural-config/intent-matching-cache-configuration--edited-answer-cache.png)

**Normal answer cache** serves either a recent generated answer or an edited one. Its help text:
"Serve a recent answer if the relevant documentation has not changed, or an edited answer when at
least this many different answers exist for a user question. Edited answers have priority in the
Normal Answer cache, followed by the most recent generated answer. Edited answers are retained
until updated or deleted, even if the source documentation changes - so use caution to be sure
your edited answers do not contain out-of-date information. Set 0 to disable the normal answer
cache."

So in both cases the number is a count of different answers that must already exist for a
question before that cache starts serving — it is not a duration. A low value caches early; a
high one waits until the question has been answered several different ways. `0` turns that cache
off, in the product's own words. And inside the normal answer cache the order is fixed: edited
answers first, then the most recent generated answer — so curating an answer changes what both
caches serve.

Both sliders, and the three conditions below, are owned by
[Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).

### When a cached answer is allowed

Reaching the threshold is not enough on its own. Three more settings in the same section decide
whether a stored answer may be used for the question in front of it.

**Intent Match Tolerance** decides what counts as "the same question" in the first place. It sits
directly under the paragraph "NeuralSeek automatically generates and groups user input into
intents. When a user input does not match an existing intent, a new intent is created." The
cache is keyed on the intent a question matches, so this selector decides how often a cached
answer can be reused at all. Its options are `Exact Match`, `Vector Similarity`, `Fuzzy Match`,
`Keyword Match` and `Fuzzy Keyword Match`; the instance captured for this page is set to
`Exact Match`. The screen does not describe what each option does. Reading only the names:
`Exact Match` matches an identical input, so on this instance a rephrase creates a new intent and
cannot hit the cache; `Vector Similarity` would match by embedding similarity, letting a rephrased
question land on the same intent; `Fuzzy Match`, `Keyword Match` and `Fuzzy Keyword Match` name
tolerant string matching, shared-keyword matching, and the two combined. None of those readings
has been verified against the product.

![The Intent Match Tolerance menu open, listing Exact Match, Vector Similarity, Fuzzy Match, Keyword Match and Fuzzy Keyword Match](/img/neural-config/intent-matching-cache-configuration--options-intent-match-tolerance.png)

The two `Yes` / `No` selectors are rendered inside the Normal answer cache group, directly under
its slider; neither has help text, so the label is the only description:

- **Require Cache to Follow Context?** — `Yes` on the instance captured here. Inferred from the
  label: with `Yes` a cached answer is served only when the conversation so far matches too, not
  on the question text alone; with `No` the question alone can hit the cache. See
  [Conversational context](/seek/conversational-context/). Its placement under the Normal answer
  cache is visible on screen; whether it also governs the Edited answer cache is not.
- **Require Cache to match the exact KB for the question and not the intent?** — `No` on the
  instance captured here. The label says the cache is normally matched on the intent; `Yes`
  would instead require the cached answer to have come from the same KnowledgeBase result as the
  current question. What "the exact KB for the question" is compared against is not shown.

![The Normal answer cache slider with the Require Cache to Follow Context? selector set to Yes and the Require Cache to match the exact KB for the question and not the intent? selector set to No beneath it](/img/neural-config/intent-matching-cache-configuration--normal-answer-cache.png)

### Staleness

For generated answers the guard is in the normal answer cache's own definition: a recent answer
is served only while "the relevant documentation has not changed". Edited answers have no such
guard at all. They stay exactly as written until a person updates or deletes them in
[Curate](/seek/curation/), whatever happens to the source document.

<!-- UNCONFIRMED: every cached answer is hashed and compared to the current source at Seek time, a mismatch flags the answer as out of date in Curate ("delete and reload it, or edit it and mark it as current"), and answers are re-checked asynchronously during round-trip logging — from the previous MkDocs page for this route; none of it appears on any screen captured for this page. -->

The previous version of this page described the mechanism behind that guard: each cached answer
is hashed, the hash is compared with the current source when the answer is next used at Seek
time, a mismatch flags the answer as out of date so you either delete and reload it or edit it
and mark it current, and frequently returned answers are re-checked asynchronously during
round-trip logging. None of that is visible on the screens captured for this page; treat it as
background until it is re-checked.

### Telling whether an answer came from the cache

<!-- UNCONFIRMED: the `Cached` label next to `Total Response Time` on the Seek tab — from the previous MkDocs page for this route; the Seek tab was not captured for this page and a UI label cannot be verified from an API response. -->

The previous version of this page said the **Seek** tab marks a cached answer with a `Cached`
label next to **Total Response Time**. That has not been re-checked against the current product —
see [Seek overview](/seek/overview/) for the Seek tab itself.

## FAQ

### How many caches does NeuralSeek have, and where are they?

Three, all in the Edit Configuration dialog on Neural Config: **KnowledgeBase Query Cache
(minutes)** under **KnowledgeBase Tuning**, and **Edited answer cache** plus
**Normal answer cache** under **Intent Matching & Cache Configuration**.

### How do I turn caching off completely?

Set both answer-cache sliders to `0` — the help text says "Set 0 to disable the edited answer
cache" and "Set 0 to disable the normal answer cache" — and move
**KnowledgeBase Query Cache (minutes)** to `Disabled`, which is `0`.

### If both an edited and a generated answer exist, which is served?

The edited one. The **Normal answer cache** help text fixes the order: "Edited answers have
priority in the Normal Answer cache, followed by the most recent generated answer."

### My documentation changed — do cached answers update?

Generated answers are guarded: the normal answer cache serves "a recent answer if the relevant
documentation has not changed". Edited answers are not: they "are retained until updated or
deleted, even if the source documentation changes", so a curated answer has to be corrected by
hand in [Curate](/seek/curation/).

### Why does a slightly reworded question not get the cached answer?

The cache is keyed on the matched intent, and **Intent Match Tolerance** decides how loosely a
question matches one. At `Exact Match` — the setting on the instance captured here — only the
same input matches; the other four options (`Vector Similarity`, `Fuzzy Match`, `Keyword Match`,
`Fuzzy Keyword Match`) are looser, though their exact behaviour is not described on screen.

### Does a cached answer ignore the conversation so far?

Not while **Require Cache to Follow Context?** is `Yes`, which is how the instance captured for
this page is set. Inferred from the label: `No` lets the question alone hit the cache.
