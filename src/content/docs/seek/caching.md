---
title: "Caching"
description: "NeuralSeek has three caches — the KnowledgeBase Query Cache on search results and the Edited and Normal answer caches on answers — each set in the Neural Config Edit Configuration dialog."
---

## What is it

NeuralSeek can answer a question by reusing work it has already done instead of doing it again.
It has three caches, each with its own setting:

- **KnowledgeBase Query Cache (minutes)** keeps KnowledgeBase query results for a set number of
  minutes. It is in the **KnowledgeBase Tuning** section.
- **Edited answer cache** serves an answer somebody curated by hand. It is in the **Intent
  Matching & Cache Configuration** section.
- **Normal answer cache** serves a recent generated answer — or an edited one, which takes
  priority. It sits next to the edited answer cache.

One cache works on KnowledgeBase queries; the other two work on answers. The screen that holds the
answer caches sums them up in one line: "NeuralSeek can serve cached answers to user questions in
order to speed up response times or produce more consistent results."

This page gives the caching angle on those settings. Each one is documented field by field on the
page that owns it: [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/),
[Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/) and, for the
timeout fallback, [Platform Preferences](/configuration/neural-config/platform-preferences/).

## Why it matters

A question answered from scratch waits for a KnowledgeBase search and for a new answer to be
generated. Questions that are asked again and again wait for that every time, for an answer that
has not changed. The answer caches let NeuralSeek serve the earlier answer instead, which is
faster, and it makes the same question come back with the same wording rather than a slightly
different one each time.

The cost is staleness: a cached answer can outlive the document it came from. The normal answer
cache guards generated answers against that — it serves a recent answer only "if the relevant
documentation has not changed". Edited answers have no such guard, and the screen says so:
"Edited answers are retained until updated or deleted, even if the source documentation changes -
so use caution to be sure your edited answers do not contain out-of-date information."

## When to use it

- **Frequently asked questions whose answers rarely change** — policies, definitions, plan
  limits. These are what the answer caches are for.
- **Answers you have curated** and want served as written rather than regenerated. That is the
  edited answer cache, and there the cache is the point rather than an optimisation.
- **Many similar questions that run the same KnowledgeBase search.** That is what the
  KnowledgeBase query cache shortens.
- **A chatbot platform with a hard response timeout**, where an earlier answer is better than
  none (see [Timeout: a cached answer as the fallback](#timeout-a-cached-answer-as-the-fallback)).

Caching is the wrong tool when the documentation changes through the day and users must see each
change at once, and when nobody reviews edited answers — nothing expires them for you. In those
cases keep the KnowledgeBase query cache at `Disabled` or short, and review curated answers in
[Curate](/seek/curation/).

## How it works

### The three caches at a glance

| Cache                                   | Section                               | What the number counts                     | How to turn it off    |
| --------------------------------------- | ------------------------------------- | ------------------------------------------ | --------------------- |
| **KnowledgeBase Query Cache (minutes)** | KnowledgeBase Tuning                  | Minutes (from the label)                   | Move it to `Disabled` |
| **Edited answer cache**                 | Intent Matching & Cache Configuration | Different edited answers for a question    | Set it to `0`         |
| **Normal answer cache**                 | Intent Matching & Cache Configuration | Different answers for a question           | Set it to `0`         |

Around the two answer caches, three more settings decide when a stored answer counts as a match:
**Intent Match Tolerance** above them, and **Require Cache to Follow Context?** and **Require
Cache to match the exact KB for the question and not the intent?** below them. A fourth setting,
**Timeout** in **Platform Preferences**, uses a cached answer as a fallback.

### KnowledgeBase Query Cache (minutes)

The **KnowledgeBase Query Cache (minutes)** slider sits in **KnowledgeBase Tuning**, in the left
column under **Document Date Penalty**. Its track runs from `Disabled` at the left end to `6000`
at the right, with a value box beside it; the screenshot shows the handle at `Disabled` and the
box at `0`. The screen carries no help text for it — the label gives the unit, minutes.

- **What it does:** keeps the result of a KnowledgeBase query for the number of minutes set, so a
  later Seek can reuse it instead of querying the KnowledgeBase again. It is the only one of the
  three caches that works on KnowledgeBase results rather than on answers, and the only one
  measured in time rather than in a count of answers.
- **When to change it:** raise it when the same material is searched repeatedly and your
  KnowledgeBase content changes rarely. The longer the window, the longer a Seek can run on a
  result that no longer reflects a re-ingested document.
- **What changes:** at `Disabled`, the cache is off and every Seek queries the KnowledgeBase.

<!-- UNCONFIRMED: the KnowledgeBase cache stores the processed content window (roughly 8,000–9,000 characters) that goes to the LLM together with a hash of it, and cached answers are hashed and compared with the current source at Seek time, with mismatches flagged as out of date in Curate — from the previous MkDocs page for this route (backlog ddff8daecf, 868f905450); no captured screen describes what is stored or how a change is detected. -->

The previous version of this page said the query cache holds the processed search result that is
passed to the LLM, hashed so that a later change to the source can be detected; treat that as
background until it is checked against the product. The rest of the section is documented in
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

![The KnowledgeBase Tuning field group: Document Score Range, Max Documents per Seek, Document Date Penalty, Expansion Window, the KnowledgeBase Query Cache (minutes) slider from Disabled to 6000, Max Raw Score and mAIstro Post-KB Agent](/img/neural-config/knowledgebase-tuning--document-score-range.png)

### Edited answer cache

**Edited answer cache** is in **Intent Matching & Cache Configuration**, under the paragraph
"NeuralSeek can serve cached answers to user questions in order to speed up response times or
produce more consistent results." It serves an answer a person curated in
[Curate](/seek/curation/). Its slider runs from `Disabled` at the left end to `5` at the right,
with a value box beside it. Its help text:

> Serve an edited answer when at least this many different edited answers exist for a user
> question. Edited answers are retained until updated or deleted, even if the source documentation
> changes - so use caution to be sure your edited answers do not contain out-of-date information.
> Set 0 to disable the edited answer cache.

- **What the number is:** how many different edited answers must already exist for a question
  before this cache serves one — a count, not a duration.
- **When to change it:** lower it when one reviewed answer is enough for you to trust it; raise it
  when you want several curated answers to exist before any is served.
- **What changes:** `0` turns the edited answer cache off.

Edited answers do not expire. They stay as written until a person updates or deletes them in
[Curate](/seek/curation/), whatever happens to the source document — so a curated answer has to be
corrected by hand when the documentation changes.

![The Edited answer cache heading, its help text and its slider on a Disabled to 5 range](/img/neural-config/intent-matching-cache-configuration--edited-answer-cache.png)

### Normal answer cache

**Normal answer cache** sits directly under the edited answer cache. It serves either a recent
generated answer or an edited one. Its slider also runs from `Disabled` to `5`, with a value box
beside it. Its help text:

> Serve a recent answer if the relevant documentation has not changed, or an edited answer when at
> least this many different answers exist for a user question. Edited answers have priority in the
> Normal Answer cache, followed by the most recent generated answer. Edited answers are retained
> until updated or deleted, even if the source documentation changes - so use caution to be sure
> your edited answers do not contain out-of-date information. Set 0 to disable the normal answer
> cache.

- **What the number is:** again a count of different answers that must already exist for a
  question, not a duration. A low value serves from the cache early; a high one waits until the
  question has been answered several different ways.
- **The order inside it is fixed:** edited answers first, then the most recent generated answer.
  Curating an answer in [Curate](/seek/curation/) therefore changes what both answer caches serve.
- **Staleness:** a generated answer is served only while "the relevant documentation has not
  changed". The screen does not say how that change is detected.
- **What changes:** `0` turns the normal answer cache off.

![The Normal answer cache heading, its help text and its slider on a Disabled to 5 range, with the Require Cache to Follow Context? and Require Cache to match the exact KB for the question and not the intent? selectors beneath it](/img/neural-config/intent-matching-cache-configuration--normal-answer-cache.png)

### Intent Match Tolerance

**Intent Match Tolerance** is the selector at the top of **Intent Matching & Cache
Configuration**, under the paragraph "NeuralSeek automatically generates and groups user input into
intents. When a user input does not match an existing intent, a new intent is created." It decides
how closely a new question has to match an existing intent to be grouped with it; the screenshot
shows `Exact Match`. It has five options, in this order:

- `Exact Match`
- `Vector Similarity`
- `Fuzzy Match`
- `Keyword Match`
- `Fuzzy Keyword Match`

![The Intent Matching & Cache Configuration section: the intents paragraph and the Intent Match Tolerance selector, the caching paragraph, both answer-cache sliders and the two Require Cache selectors](/img/neural-config/intent-matching-cache-configuration--intent-match-tolerance.png)

The screen does not describe any of the options. The answer-cache help texts count answers "for a
user question", and questions are grouped into intents by this setting.

<!-- UNCONFIRMED: what the four non-Exact Intent Match Tolerance options do, and that a looser tolerance lets more rephrasings reuse one cached answer — read from the option names and the section layout only; no Seek has compared the options (backlog 381fbbda33, 20639c6d64). -->

Going by the option names, `Exact Match` is the strictest, and the other four accept a question
worded differently from an existing intent — which would let more rephrasings share one cached
answer, at the risk of grouping questions that only look alike. After changing it, ask a few
rephrasings of the same question on the Seek tab and compare. Field-by-field detail is in
[Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).

![The Intent Match Tolerance menu open, listing Exact Match, Vector Similarity, Fuzzy Match, Keyword Match and Fuzzy Keyword Match](/img/neural-config/intent-matching-cache-configuration--options-intent-match-tolerance.png)

### Require Cache to Follow Context? and the exact-KB selector

Two selectors sit directly under the **Normal answer cache** slider. Neither carries help text.

**Require Cache to Follow Context?** — the screenshot shows it set to `Yes`. It is drawn inside the
Normal answer cache group; the screen does not say whether it also governs the edited answer
cache, or what "context" is compared against. How NeuralSeek carries conversation context from one
turn to the next is explained in [Conversational context](/seek/conversational-context/).

**Require Cache to match the exact KB for the question and not the intent?** — its options are
`Yes` and `No`; the screenshot shows `No`. The screen does not explain it beyond its label, which
contrasts matching a cached answer on the exact KB for the question with matching it on the
intent.

![The Require Cache to match the exact KB for the question and not the intent? menu open, offering Yes, under the Require Cache to Follow Context? selector](/img/neural-config/intent-matching-cache-configuration--options-require-cache-to-match-the-exact-kb-for-.png)

### Timeout: a cached answer as the fallback

The answer caches also serve as a fallback when generation is slow. **Timeout** in **Platform
Preferences** (owned by [Platform Preferences](/configuration/neural-config/platform-preferences/))
is a slider from `4000` to `90000`, with a value box beside it. Its help text:

> Language Generation Timeout (milliseconds). Set this to a few seconds less than the timeout of
> your chatbot platform. When timeout is reached Neuralseek will attempt to catch the timeout by
> serving the closest possible cached answer, if one is available.

So when generating an answer takes longer than **Timeout**, a cached answer can still reach the
user — but only "if one is available". With both answer caches at `0`, there may be no cached
answer to fall back on.

![The Timeout slider in Platform Preferences, from 4000 to 90000, under the last line of its help text about serving the closest possible cached answer](/img/neural-config/platform-preferences--timeout.png)

### Where the settings live, and saving the change

All of these settings are in the **Edit Configuration** dialog on the
[Neural Config](/configuration/neural-config/using-this-page/) screen. On the routing tree, open
the **Default Config** node (its second line reads **Answer Generation**), then
**Edit Configuration**. The dialog titled **Configuration: Default Config** lists accordion sections;
open **KnowledgeBase Tuning** for the query cache, **Intent Matching & Cache Configuration** for
the answer caches and the settings around them, and **Platform Preferences** for **Timeout**.

Nothing applies until the dialog is saved. Its footer carries **Propose Changes** and **Save**,
both described in [Using the Neural Config page](/configuration/neural-config/using-this-page/). A
category with its own custom configuration has its own copy of these sections — see
[Configuration overview](/configuration/overview/).

![The Configuration: Default Config dialog scrolled to Platform Preferences, showing Timeout with its help text, above the Propose Changes and Save footer](/img/neural-config/platform-preferences-panel.png)

### Telling whether an answer came from the cache

<!-- UNCONFIRMED: the Cached label next to Total Response Time on the Seek tab — from the previous MkDocs page for this route (backlog f9b4f749d3); the Seek tab has not been captured for this page. -->

The previous version of this page said the **Seek** tab marks a cached answer with a `Cached` label next to **Total Response Time**.
That has not been re-checked against the current product; the Seek tab itself is described in
[Seek overview](/seek/overview/).

## FAQ

### How many caches does NeuralSeek have, and where are they?

Three, all in the **Edit Configuration** dialog on Neural Config: **KnowledgeBase Query Cache
(minutes)** under **KnowledgeBase Tuning**, and **Edited answer cache** plus **Normal answer cache**
under **Intent Matching & Cache Configuration**. The first works on KnowledgeBase queries, the
other two on answers.

### How do I turn caching off completely?

Move **KnowledgeBase Query Cache (minutes)** to `Disabled`, and set both answer caches to `0` — the
help texts say "Set 0 to disable the edited answer cache" and "Set 0 to disable the normal answer
cache". Then save the dialog.

### If both an edited and a generated answer exist, which is served?

The edited one. The **Normal answer cache** help text fixes the order: "Edited answers have
priority in the Normal Answer cache, followed by the most recent generated answer."

### My documentation changed — do cached answers update?

Generated answers are guarded: the normal answer cache serves "a recent answer if the relevant
documentation has not changed". Edited answers are not: they "are retained until updated or
deleted, even if the source documentation changes", so a curated answer has to be corrected by
hand in [Curate](/seek/curation/).

### Why is a repeated question not answered from the cache?

Check four things: whether enough different answers exist yet for the question (the answer-cache
sliders are counts), whether the question joins the same intent under **Intent Match Tolerance**,
and how **Require Cache to Follow Context?** and **Require Cache to match the exact KB for the
question and not the intent?** are set.

### Can a cached answer be served when the LLM is too slow?

Yes, if one exists. The **Timeout** help text in Platform Preferences says that when the timeout
is reached, NeuralSeek "will attempt to catch the timeout by serving the closest possible cached
answer, if one is available."
