---
title: "Intent Matching & Cache"
description: "The Intent Matching & Cache Configuration section of a NeuralSeek configuration sets how questions are grouped into intents and when an edited or recent answer may be served from cache instead of being generated."
---

## What is it

**Intent Matching & Cache Configuration** is one section of the configuration dialog on the
[Neural Config](/configuration/neural-config/using-this-page/) screen. It has two halves, and each
opens with a sentence from the product:

- **Intent matching.** "NeuralSeek automatically generates and groups user input into intents.
  When a user input does not match an existing intent, a new intent is created." The
  **Intent Match Tolerance** selector sits under this sentence.
- **Answer caching.** "NeuralSeek can serve cached answers to user questions in order to speed up
  response times or produce more consistent results." Two sliders, **Edited answer cache** and
  **Normal answer cache**, say when a stored answer may be served. Two selectors below them,
  **Require Cache to Follow Context?** and
  **Require Cache to match the exact KB for the question and not the intent?**, add conditions.

This page covers the settings. How the caches look from the side of the person asking, including
the KnowledgeBase query cache that lives in another section, is on [Caching](/seek/caching/).

## Why it matters

The caching settings trade freshness for speed and consistency. The two sliders do not treat
freshness the same way. The **Normal answer cache** serves a recent answer only "if the relevant
documentation has not changed". Edited answers carry no such check, and the section says so in
both help texts:

> Edited answers are retained until updated or deleted, even if the source documentation
> changes - so use caution to be sure your edited answers do not contain out-of-date information.

Read that sentence before you raise either slider on a KnowledgeBase that changes often.

The two halves share a section because they meet in its last selector, which chooses whether the
cache must match "the exact KB for the question" or can match "the intent". Changing how questions
are grouped into intents is therefore worth checking together with the cache settings.

## When to use it

- **The same questions are asked again and again** and their answers do not change. A cached
  answer is returned without being generated again.
- **You curate answers** and want people to see the curated wording. That is what the
  **Edited answer cache** is for. Edited answers are written on the Curate tab; see
  [Answer curation](/seek/curation/).
- **Answers must be consistent**, for example so a support script sees the same wording each time
  a question is asked. The section itself names "more consistent results" as a reason to cache.

Set both sliders to `0` (the `Disabled` end) when the source documentation changes often and
readers must see each change at once, or when nobody reviews edited answers. Nothing in this
section expires an edited answer.

Two related settings live elsewhere:

- **KnowledgeBase Query Cache (minutes)** is a separate cache, measured in minutes, on
  [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/). The sliders on this
  page are not a time limit.
- **Language Generation Timeout (milliseconds)** on
  [Platform Preferences](/configuration/neural-config/platform-preferences/) says: "When timeout is
  reached Neuralseek will attempt to catch the timeout by serving the closest possible cached
  answer, if one is available."

## How it works

On the **Neural Config** screen, click the **Default Config / Answer Generation** node in the
routing tree, then **Edit Configuration**. The dialog that opens is titled
**Configuration: Default Config**.

![The Neural Config screen with the Configuration: Default Config dialog open over the routing tree, scrolled to the Intent Matching & Cache Configuration section](/img/neural-config/intent-matching-cache-configuration.png)

The values quoted in each section below are the values shown in the screenshots. The screen does
not mark any of them as a default.

### Where the section is

**Intent Matching & Cache Configuration** is the twelfth accordion in the dialog, between
**Answer Engineering & Preferences** and **mAIstro Configuration**. Click its header to expand it.
Expanding it does not close the accordions above it, so several sections can be open at once. The
dialog's footer carries **Propose Changes** and **Save**.

![The Configuration: Default Config dialog with Answer Engineering & Preferences still expanded above the Intent Matching & Cache Configuration header, the intent paragraph, the Intent Match Tolerance selector and the Propose Changes and Save footer](/img/neural-config/intent-matching-cache-configuration-panel.png)

A category in the routing tree that has its own Custom Configuration has its own
**Intent Matching & Cache Configuration** section in that configuration's dialog, so a category can
be set up differently from **Default Config**. How category configurations work is on
[Configuration overview](/configuration/overview/). The steps on this page use **Default Config**.

### Intent Match Tolerance

**Intent Match Tolerance** is the selector directly under the intent paragraph. It has no help
text of its own; the paragraph above it is the only explanation on the screen. That paragraph says
that input which "does not match an existing intent" creates a new intent, so this selector decides
what counts as a match. The screenshot shows `Exact Match`.

![The Intent Matching & Cache Configuration body: the intent paragraph and Intent Match Tolerance showing Exact Match, the caching paragraph, both cache sliders and the two Require Cache selectors](/img/neural-config/intent-matching-cache-configuration--intent-match-tolerance.png)

The selector has five options, in this order: `Exact Match`, `Vector Similarity`, `Fuzzy Match`,
`Keyword Match` and `Fuzzy Keyword Match`. The screen names them but does not describe them.

![The Intent Match Tolerance menu open, listing Exact Match (checked), Vector Similarity, Fuzzy Match, Keyword Match and Fuzzy Keyword Match](/img/neural-config/intent-matching-cache-configuration--options-intent-match-tolerance.png)

The table below is read from the option names only.

<!-- UNCONFIRMED: what Vector Similarity, Fuzzy Match, Keyword Match and Fuzzy Keyword Match do — read from the option names only; no Seek has compared them (backlog 381fbbda33). -->

| Option                | Read from the option name                                                 |
| --------------------- | ------------------------------------------------------------------------- |
| `Exact Match`         | Input joins an intent only when it matches it exactly.                    |
| `Vector Similarity`   | Input is compared with intents as vectors, by meaning.                    |
| `Fuzzy Match`         | Small differences in spelling or wording are tolerated.                   |
| `Keyword Match`       | Input that shares key words with an intent joins it.                      |
| `Fuzzy Keyword Match` | Keyword matching that also tolerates small differences in spelling.       |

Before you rely on an option other than `Exact Match`, save the change, then ask a few rephrasings
of the same question on the Seek tab and compare what comes back for each.

For `Vector Similarity`, the embedding models matter. On
[Embedding models](/configuration/neural-config/embedding-models/), each embedding card has an
**Embedding Functions** group with the checkboxes **KB Search**, **mAIstro** and **Vector Intent**.

<!-- UNCONFIRMED: that the model ticked for Vector Intent is the one intent vectors are computed with, and that Vector Similarity and Rebuild Vector Intents depend on it — the screen does not connect them. -->

The model ticked for **Vector Intent** is presumably the one that intent vectors are computed with.

Two related tools appear on the **Neural Config** screen as dialogs. Where each is opened from is
not shown on the screen:

- **Rebuild Vector Intents** is a confirmation dialog with the buttons **Cancel** and
  **Confirm Rebuild**. The screen does not say what it recomputes or what it costs. The one
  statement about cost is on the Embedding Models section, and it is about switching embedding
  models: "Use caution when switching between models in an active instance, as all existing
  vectors will need to be recomputed for the new model - which will incur time and expense."
  Whether **Confirm Rebuild** triggers that kind of recomputation is not stated.
- **Intent Similarity Testing** has a **Test** button and a results table with the columns
  **Intent** and **Score**.

### Edited answer cache

**Edited answer cache** is a slider with a **Slider value** box beside it where you can type the
number. The track runs from `Disabled` at the left to `5` at the right. The screenshot shows `3`.

![The Edited answer cache slider with its help text, the track from Disabled to 5, and the Slider value box reading 3](/img/neural-config/intent-matching-cache-configuration--edited-answer-cache.png)

The help text:

> Serve an edited answer when at least this many different edited answers exist for a user
> question. Edited answers are retained until updated or deleted, even if the source documentation
> changes - so use caution to be sure your edited answers do not contain out-of-date information.
> Set 0 to disable the edited answer cache.

What follows from that wording:

- The number is a count of different edited answers for a question. It is not a duration and not
  a confidence.
- A lower number lets a curated answer be served once fewer edited answers exist for the question;
  a higher number needs more of them first.
- `0`, the `Disabled` end of the track, turns this cache off.
- Edited answers do not expire when the documentation changes. Update or delete them yourself on
  the Curate tab; see [Answer curation](/seek/curation/).

### Normal answer cache

**Normal answer cache** is the second slider, with the same `Disabled` to `5` track and its own
**Slider value** box. The screenshot shows `5`, the right end of the track.

![The Normal answer cache slider at 5 with its help text, and the Require Cache to Follow Context? and Require Cache to match the exact KB for the question and not the intent? selectors beneath it](/img/neural-config/intent-matching-cache-configuration--normal-answer-cache.png)

The help text:

> Serve a recent answer if the relevant documentation has not changed, or an edited answer when at
> least this many different answers exist for a user question. Edited answers have priority in the
> Normal Answer cache, followed by the most recent generated answer. Edited answers are retained
> until updated or deleted, even if the source documentation changes - so use caution to be sure
> your edited answers do not contain out-of-date information. Set 0 to disable the normal answer
> cache.

What follows from that wording:

- Inside this cache the order is fixed: an edited answer first, then the most recent generated
  answer. Curating an answer changes what this cache serves, even though curation has its own
  slider.
- Only this cache carries the condition "if the relevant documentation has not changed". The
  **Edited answer cache** has no such condition.
- `0`, the `Disabled` end of the track, turns this cache off.

### Require Cache to Follow Context?

**Require Cache to Follow Context?** is the selector directly under the **Normal answer cache**
slider. The screenshot shows `Yes`. It has no help text.

![The whole Intent Matching & Cache Configuration section down to Require Cache to Follow Context? showing Yes, above the Propose Changes and Save footer](/img/neural-config/intent-matching-cache-configuration--intent-matching-cache-configuration.png)

<!-- UNCONFIRMED: that this setting only lets a cached answer be served when the conversation context matches, and whether it governs the Edited answer cache too or only the Normal answer cache it sits under (backlog 86ebc9a7d0) — neither is on screen. -->

The screen does not say what "follow context" checks, or whether the condition applies to the
**Edited answer cache** as well as to the **Normal answer cache** it sits under. How NeuralSeek
keeps track of a conversation is explained on
[Conversational context](/seek/conversational-context/).

### Require Cache to match the exact KB for the question and not the intent?

**Require Cache to match the exact KB for the question and not the intent?** is the last selector
in the section. It has two options, `Yes` and `No`. The screenshot shows `No`. It has no help text;
the label itself states the choice:

- `No` — a cached answer can be matched on the question's intent.
- `Yes` — a cached answer must match "the exact KB for the question", not only the intent.

![The Require Cache to match the exact KB for the question and not the intent? menu open under the No value, offering Yes](/img/neural-config/intent-matching-cache-configuration--options-require-cache-to-match-the-exact-kb-for-.png)

The screen does not say how often each value lets a cached answer be served. To see the effect,
save the change and ask the same question more than once on the Seek tab.

### Saving the change

Nothing in this section takes effect until you use the dialog's footer: **Propose Changes** or
**Save** (see the footer in the image under [Where the section is](#where-the-section-is)). What
each button does is on [Using the Neural Config page](/configuration/neural-config/using-this-page/).
Going back to an earlier version is on [Backup, restore & change logs](/configuration/backup-restore/).

## FAQ

### How do I turn answer caching off?

Set both **Edited answer cache** and **Normal answer cache** to `0`, the `Disabled` end of each
slider. The help texts say "Set 0 to disable the edited answer cache" and "Set 0 to disable the
normal answer cache". The KnowledgeBase query cache is separate: it is
**KnowledgeBase Query Cache (minutes)** on
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

### What is the difference between the Edited answer cache and the Normal answer cache?

The **Edited answer cache** serves a curated answer once at least the set number of different
edited answers exists for the question. The **Normal answer cache** serves "a recent answer if the
relevant documentation has not changed, or an edited answer when at least this many different
answers exist". Inside it, edited answers come first, then the most recent generated answer. Only
the normal cache checks whether the documentation has changed.

### My edited answer is out of date — will NeuralSeek notice?

No. Both help texts say: "Edited answers are retained until updated or deleted, even if the source
documentation changes." Update or delete the answer yourself on the Curate tab; see
[Answer curation](/seek/curation/).

### Which Intent Match Tolerance should I pick?

The screen lists five options — `Exact Match`, `Vector Similarity`, `Fuzzy Match`,
`Keyword Match` and `Fuzzy Keyword Match` — and describes none of them. If you change it, save the
change and ask a few rephrasings of a real question on the Seek tab before you rely on it.

### What does Rebuild Vector Intents do?

The screen shows only its confirmation dialog, with **Cancel** and **Confirm Rebuild**. What it
recomputes, what it costs and where it is opened from are not stated on the screen.

### Can one category cache differently from the rest?

Yes. A category with its own Custom Configuration has its own
**Intent Matching & Cache Configuration** section in its configuration dialog. See
[Configuration overview](/configuration/overview/).
