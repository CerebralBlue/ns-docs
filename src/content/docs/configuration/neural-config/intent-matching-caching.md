---
title: "Intent Matching & Cache"
description: "The Intent Matching & Cache Configuration section of a NeuralSeek configuration sets how questions are grouped into intents and when an edited or recent answer may be served from cache instead of being generated."
---

NeuralSeek groups the questions people ask into **intents**, and both answer caches are keyed on
that grouping rather than on the exact wording of a question. The
**Intent Matching & Cache Configuration** section of a configuration holds the settings that
decide what counts as the same question, how many stored answers must exist before a cache starts
serving, and what else has to match before a stored answer is allowed through.

## What is it

One section inside the **Edit Configuration** dialog on the
[Neural Config](/configuration/neural-config/using-this-page/) screen. It carries two jobs, and
they share a panel because the second one depends on the first:

- **Intent matching.** The section opens by stating what the product does on its own:
  "NeuralSeek automatically generates and groups user input into intents. When a user input does
  not match an existing intent, a new intent is created." **Intent Match Tolerance** is how
  strictly an incoming question has to resemble an existing intent to join it.
- **Answer caching.** "NeuralSeek can serve cached answers to user questions in order to speed
  up response times or produce more consistent results." Two thresholds — the
  **Edited answer cache** and the **Normal answer cache** — say when that is allowed, and two
  Yes/No selectors add conditions on top.

The behaviour of the caches, including the third cache that is not on this panel, is on
[Caching](/seek/caching/). This page is the settings.

## Why it matters

The intent is the key everything else hangs off. A question that joins the wrong intent inherits
that intent's cached answers, and a question that starts a new intent every time can never be
served from cache at all — so **Intent Match Tolerance** decides how much caching you actually
get, not only how questions are grouped for reporting.

The caches then trade freshness for speed and consistency. The normal answer cache guards the
generated side — it serves a recent answer only while the relevant documentation has not
changed — but nothing guards the edited side. The product says so in the panel itself:

> Edited answers are retained until updated or deleted, even if the source documentation changes - so
> use caution to be sure your edited answers do not contain out-of-date information.

That is the sentence to read twice before raising either threshold on a knowledge base that moves.

## When to use it

- **A small set of questions is asked constantly** and the answer does not change. Lower the
  thresholds so those questions start being served from cache sooner.
- **You curate answers** and want the curated wording served rather than a fresh generation. That
  is the **Edited answer cache**, and it is the case where caching is the goal rather than an
  optimisation. Edited answers are written on the Curate tab — see
  [Answer curation](/seek/curation/).
- **Answers need to be reproducible** — the same question coming back with the same wording for
  auditing or for screenshots in your own documentation.

Leave it alone, or set the thresholds to `0`, when the source documentation changes through the
day and readers must see the change immediately, and when nobody is reviewing edited answers:
nothing on this panel expires them.

These settings are not a time-to-live. Reusing a **KnowledgeBase** query result for a number of
minutes is a different cache with its own slider — **KnowledgeBase Query Cache (minutes)** on
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

## How it works

Open the configuration you want to change from the routing tree on the **Neural Config** screen —
for the instance-wide settings that is the **Default Config / Answer Generation** node — then
**Edit Configuration**, then the **Intent Matching & Cache Configuration** accordion header. It is
the twelfth of the fourteen headers, between **Answer Engineering & Preferences** and
**mAIstro Configuration**. Every setting below lives in that one section, and nothing takes
effect until the dialog is saved.

![The Edit Configuration dialog for Default Config with the Intent Matching & Cache Configuration accordion expanded, showing its lead-in text and the Intent Match Tolerance selector](/img/neural-config/intent-matching-cache-configuration.png)

<!-- UNCONFIRMED: that every configuration in the routing tree carries its own copy of this section — from the previous docs; the category nodes exist in the tree, but no category's Edit Configuration was opened in the capture behind this page. -->

Each configuration in the routing tree is expected to carry its own copy of this section, so a
category could in principle cache differently from the default; that has not been verified
against a custom configuration here.

The values quoted below are the ones on the instance captured for this page. Nothing on the
accordion marks a value as the default.

### Where the section lives

The accordion body has two halves, each introduced by one sentence from the product. The first
half is intent matching: "NeuralSeek automatically generates and groups user input into intents.
When a user input does not match an existing intent, a new intent is created." Under it sits the
single **Intent Match Tolerance** selector. The second half is caching: "NeuralSeek can serve
cached answers to user questions in order to speed up response times or produce more consistent
results." Under it sit the two cache sliders and, inside the second slider's group, the two Yes/No
selectors.

![The whole Intent Matching & Cache Configuration body: the intent-matching lead-in and the Intent Match Tolerance selector, then the caching lead-in, the Edited answer cache and Normal answer cache sliders, and the two Require Cache selectors](/img/neural-config/intent-matching-cache-configuration--intent-match-tolerance.png)

Expanding this header does not collapse the others — several sections of the dialog can be open
at once.

### Intent Match Tolerance

**Intent Match Tolerance** is a selector directly under the section's opening sentence; its label
sits beneath the control, and it has no help text of its own. It decides how closely an incoming
question must resemble an existing intent before it joins that intent — and therefore before it
can ever hit an answer cache. On the instance captured for this page it is `Exact Match`.

The selector offers five options:

- `Exact Match`
- `Vector Similarity`
- `Fuzzy Match`
- `Keyword Match`
- `Fuzzy Keyword Match`

![The Intent Match Tolerance menu open, listing Exact Match, Vector Similarity, Fuzzy Match, Keyword Match and Fuzzy Keyword Match](/img/neural-config/intent-matching-cache-configuration--options-intent-match-tolerance.png)

The screen does not describe what any option does. Reading only the names — and this is an
inference, not a verified behaviour — `Exact Match` matches an identical input, so a rephrased
question starts its own intent; `Vector Similarity` would compare embeddings, so a rephrase could
land on the same intent; `Fuzzy Match`, `Keyword Match` and `Fuzzy Keyword Match` name tolerant
string matching, shared-keyword matching, and the two combined.

<!-- UNCONFIRMED: the behaviour of Vector Similarity, Fuzzy Match, Keyword Match and Fuzzy Keyword Match — inferred from the option names only; no probe has exercised them (backlog 381fbbda33 is open). -->

Until those four options have been exercised, treat the readings above as the names' plain
meaning and nothing more. Before relying on one, test a few phrasings on your own instance.

The vectors behind `Vector Similarity` come from whichever embedding model has **Vector Intent**
ticked on [Embedding models](/configuration/neural-config/embedding-models/). What the resulting
intents look like in aggregate is reported on [Intent Insights](/governance/seek-intent-insights/).

### Edited answer cache

**Edited answer cache** is a slider with a **Slider value** box next to it for typing the number
directly. The track runs from `Disabled` at the left end to `5` at the right; the help text says
"Set 0 to disable the edited answer cache", so `Disabled` is the `0` position. On the instance
captured for this page it is `3`.

![The Edited answer cache slider with its help text, the track from Disabled to 5, and the Slider value box reading 3](/img/neural-config/intent-matching-cache-configuration--edited-answer-cache.png)

The help text in full:

> Serve an edited answer when at least this many different edited answers exist for a user
> question. Edited answers are retained until updated or deleted, even if the source documentation
> changes - so use caution to be sure your edited answers do not contain out-of-date information.
> Set 0 to disable the edited answer cache.

So the number is a count of different edited answers stored for the question, not a confidence
and not a duration. Edited answers are the ones a person wrote or corrected on the Curate tab —
[Answer curation](/seek/curation/) covers how they are made; how the cache then serves them is on
[Caching](/seek/caching/).

### Normal answer cache

**Normal answer cache** is the second slider, with the same `Disabled` … `5` track and its own
**Slider value** box. On the instance captured for this page it is `5`, the right end of the
track. Its help text:

> Serve a recent answer if the relevant documentation has not changed, or an edited answer when
> at least this many different answers exist for a user question. Edited answers have priority in
> the Normal Answer cache, followed by the most recent generated answer. Edited answers are
> retained until updated or deleted, even if the source documentation changes - so use caution to
> be sure your edited answers do not contain out-of-date information. Set 0 to disable the normal
> answer cache.

Two things follow from that wording. Inside the normal cache the order is fixed — edited answers
first, then the most recent generated answer — so curating one answer changes what this cache
serves even though the setting is on the other slider. And only the normal cache carries the
"relevant documentation has not changed" guard; the edited cache has no equivalent.

![The Normal answer cache slider at 5 with the Require Cache to Follow Context? selector set to Yes and the Require Cache to match the exact KB for the question and not the intent? selector set to No beneath it](/img/neural-config/intent-matching-cache-configuration--normal-answer-cache.png)

Two Yes/No selectors sit inside the same field group as the slider, which is why the crop above
shows them together. Neither carries help text; the label is the whole explanation the product
gives.

- **Require Cache to Follow Context?** — `Yes` on the instance captured for this page. Options:
  `Yes` and `No`. Read from the label alone, `Yes` means a stored answer is served only when it
  fits the conversation so far rather than the question text in isolation; how NeuralSeek tracks
  that conversation is on [Conversational context](/seek/conversational-context/). Whether this
  selector also governs the **Edited answer cache**, or only the **Normal answer cache** it sits
  under, is not shown on screen and is an open question.

  ![The Require Cache to Follow Context? menu open, listing Yes and No](/img/neural-config/intent-matching-cache-configuration--options-require-cache-to-follow-context.png)

- **Require Cache to match the exact KB for the question and not the intent?** — `No` on the
  instance captured for this page. Options: `Yes` and `No`. The label itself says what the two
  positions key on: at `No` a cache hit is decided on the matched intent, the looser and more
  cache-friendly behaviour; at `Yes` the stored answer must also come from the same KnowledgeBase
  as the question.

  ![The Require Cache to match the exact KB for the question and not the intent? menu open, listing Yes and No](/img/neural-config/intent-matching-cache-configuration--options-require-cache-to-match-the-exact-kb-for-.png)

What a cache hit looks like from the outside: asked twice through the MCP `seek` tool, "What is
NeuralSeek?" came back byte-identical both times — same answer text, same scores, same two sources
in the same order. The start of the answer, as returned:

```text
NeuralSeek employs several NLP models to identify and extract meaning, intent, and main subject from user questions and generated responses.
```

The MCP tool exposes no timing field, so "faster the second time" was not measured; the identical
result is what a cache hit produces, though it is consistent with one rather than proof of one.

### Rebuild Vector Intents

**Rebuild Vector Intents** recomputes the stored vectors behind every intent that already exists.
It is guarded by a confirmation dialog with **Cancel** and **Confirm Rebuild** buttons, which is a
fair signal of its cost — it is not a setting you toggle, it is a job that reprocesses everything
already grouped.

![Screenshot needed — the Rebuild Vector Intents confirmation dialog with its Cancel and Confirm Rebuild buttons](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config > Default Config > Edit Configuration > Intent Matching & Cache
     Configuration: locate the control that opens the Rebuild Vector Intents confirmation (it may
     only render when Intent Match Tolerance is not Exact Match) and capture the dialog open.
     Do not press Confirm Rebuild. Why: the dialog exists in the page markup but its opener was
     not found in any captured state. -->

<!-- UNCONFIRMED: that a rebuild is what you run after changing the Vector Intent embedding model — inferred from what the two settings do, not stated anywhere on the screen or in an answer. -->

Changing the model that has **Vector Intent** ticked on
[Embedding models](/configuration/neural-config/embedding-models/) is the change that would make
existing vectors inconsistent with new ones, so a rebuild is the plausible follow-up; nothing on
the screen says so, and this page does not claim it.

:::caution[Entry point not yet documented]
The **Rebuild Vector Intents** confirmation dialog is present in the **Neural Config** screen's
markup in every state captured for this page, but the control that opens it was not found — the
expanded accordion holds only the selector, the two sliders and the two Yes/No selectors. Rather
than send you to a button that may not be where we guess, this page names the action and stops
there.
:::

### Intent Similarity Testing

**Intent Similarity Testing** scores a question you type against the intents that already exist.
The dialog has a **Test** button and a results table with two columns, **Intent** and **Score**.
It answers the question this panel otherwise leaves open — whether a given phrasing lands on the
intent you expect, and by how much — which is what you want to know before and after changing
**Intent Match Tolerance**.

![Screenshot needed — the Intent Similarity Testing dialog with the Test button and the Intent / Score results table](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config screen: locate the control that opens the Intent Similarity Testing
     dialog, type a question, press Test, and capture the dialog with a populated Intent / Score
     table. Why: the dialog exists in the page markup but its opener was not found in any captured
     state, so the page cannot give a click path. -->

The same caveat as above applies: the dialog is in the **Neural Config** screen's markup in every
captured state, but the control that opens it was not identified, so this page does not give a
click path for it.

## FAQ

### How do I turn answer caching off?

Set both sliders to `0` — the panel says "Set 0 to disable the edited answer cache" and "Set 0 to
disable the normal answer cache", and the left end of each track reads `Disabled`. That leaves the
KnowledgeBase-side cache untouched; to stop that one as well, move
**KnowledgeBase Query Cache (minutes)** on
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) to `Disabled`.

### What is the difference between the two caches?

The **Edited answer cache** serves an answer a person curated, once that many different edited
answers exist for the question. The **Normal answer cache** serves "a recent answer if the
relevant documentation has not changed, or an edited answer when at least this many different
answers exist for a user question" — and inside it "Edited answers have priority in the Normal
Answer cache, followed by the most recent generated answer." Only the normal cache has the
"documentation has not changed" guard.

### My edited answer is out of date — will NeuralSeek notice?

No. The panel is explicit: "Edited answers are retained until updated or deleted, even if the
source documentation changes." Correcting one is a manual job in [Curate](/seek/curation/).

### Which Intent Match Tolerance should I pick?

The five options — `Exact Match`, `Vector Similarity`, `Fuzzy Match`, `Keyword Match`,
`Fuzzy Keyword Match` — are named on screen and not described. `Exact Match`, the value on the
instance captured here, matches identical input only, so every rephrase becomes a new intent. The
other four are looser by name; their behaviour is not documented on the screen, so test a few
phrasings before relying on one.

### Does a cached answer respect the conversation?

Only when **Require Cache to Follow Context?** is `Yes`, as it is on the instance captured here —
read from the label, the stored answer then has to fit the conversation so far; at `No`, the
question alone decides.

### Where do I test whether a phrasing lands on the intent I expect?

**Intent Similarity Testing**: it scores your question against the existing intents in an
**Intent** / **Score** table behind a **Test** button. The control that opens it was not located on
the captured screen, so this page cannot give the click path yet.
