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
  Yes/No settings add conditions on top.

The concepts behind the caches, including the third cache that is not on this panel, are on
[Caching](/seek/caching/). This page is the settings.

## Why it matters

The intent is the key everything else hangs off. A question that joins the wrong intent inherits
that intent's cached answers, and a question that starts a new intent every time can never be
served from cache at all — so **Intent Match Tolerance** decides how much caching you actually
get, not only how questions are grouped for reporting.

The caches then trade freshness for speed and consistency. The normal answer cache guards the
generated side itself — it serves a recent answer only while the relevant documentation has not
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

These settings are also not a time-to-live. Reusing a **KnowledgeBase** query result for a number
of minutes is a different cache with its own slider — **KnowledgeBase Query Cache (minutes)** on
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

## How it works

Open the configuration you want to change from the routing tree on the **Neural Config** screen —
for the instance-wide settings that is the **Default Config** node — then **Edit Configuration**,
then the **Intent Matching & Cache Configuration** accordion header. Every setting below lives in
that one section, and nothing takes effect until the dialog is saved.

![The Edit Configuration dialog open on the Intent Matching & Cache Configuration section, showing its lead-in text and the Intent Match Tolerance selector](/img/neural-config/intent-matching-cache-configuration.png)

Each configuration in the routing tree carries its own copy of this section, so a category can in
principle cache differently from the default; that has not been verified against a custom
configuration here.

### How a question is matched to an intent

**Intent Match Tolerance** is a single selector directly under the section's opening text. On the
instance captured for this page it is set to `Exact Match` — a question is matched to an existing
intent only when it is the same question, so near-misses start their own intent.

<!-- UNCONFIRMED: the further options "Fuzzy Match" and "Exact Match, exact conversational context", and the claim that the context-sensitive option is offered for normal answers but not for edited ones — from the previous MkDocs caching page. The option list was not opened in the capture behind this page, so `Exact Match` is the only value evidenced here. -->

The previous version of the caching documentation described a looser `Fuzzy Match` and an
`Exact Match, exact conversational context` alongside it. Those names have not been re-checked
against the current product; open the selector on your own instance to see what it offers.

Which embedding model computes the vectors behind intent matching is a different setting —
**Vector Intent**, on
[Embedding models](/configuration/neural-config/embedding-models/). What the resulting intents
look like in aggregate is reported on [Intent Insights](/governance/seek-intent-insights/).

### The two answer caches

Both caches are thresholds, set with a slider that runs from `Disabled` to `5` and a
**Slider value** box next to it for typing the number directly.

![Screenshot needed — Intent Matching & Cache Configuration, the Edited answer cache and Normal answer cache sliders with their Slider value boxes and the two Yes/No selectors below them](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config > Default Config > Edit Configuration > Intent Matching & Cache
     Configuration, scrolled down so both cache sliders, their Slider value boxes and the two
     Require Cache selectors are visible in one shot.
     Why: the capture above stops at Intent Match Tolerance, and the threshold's meaning is not
     guessable from the slider alone. -->

**Edited answer cache** — "Serve an edited answer when at least this many different edited answers
exist for a user question. Edited answers are retained until updated or deleted, even if the
source documentation changes - so use caution to be sure your edited answers do not contain
out-of-date information. Set 0 to disable the edited answer cache." It is `3` on the captured
instance.

**Normal answer cache** — "Serve a recent answer if the relevant documentation has not changed,
or an edited answer when at least this many different answers exist for a user question. Edited
answers have priority in the Normal Answer cache, followed by the most recent generated answer.
Edited answers are retained until updated or deleted, even if the source documentation changes -
so use caution to be sure your edited answers do not contain out-of-date information. Set 0 to
disable the normal answer cache." It is `5` on the captured instance.

So the number is a count of stored answers, not a confidence or a duration:

| Value      | Effect                                                                     |
| ---------- | -------------------------------------------------------------------------- |
| `Disabled` | That cache never serves. The panel's own wording is "Set 0 to disable".     |
| A low number | Caching starts early, after few different answers exist for the question. |
| `5`        | Nothing is served until five different answers exist for that question.    |

Two consequences worth holding on to. Inside the **Normal answer cache** the order is fixed —
edited answers first, then the most recent generated answer — so curating one answer changes what
this cache serves even though the setting is on the other slider. And the two caches are counted
separately: the edited threshold counts *edited* answers for the question, the normal threshold
counts answers in general.

### Two extra conditions on a cache hit

Passing the threshold is not on its own enough. Two selectors below the sliders add conditions,
and both are plain Yes/No.

- **Require Cache to Follow Context?** — `Yes` on the captured instance. With it on, a stored
  answer is served only when it fits the conversation so far, not the question text in isolation.
  This is the setting that stops a cached answer landing in the middle of a multi-turn exchange
  where it no longer makes sense; see [Conversational context](/seek/conversational-context/) for
  how NeuralSeek tracks that conversation.
- **Require Cache to match the exact KB for the question and not the intent?** — `No` on the
  captured instance. With it off, matching is on the intent, which is the looser and more
  cache-friendly behaviour. Turning it on ties a stored answer to the KnowledgeBase material
  behind the question, so a question that matched the intent but draws on different documents
  will not reuse the answer.

Neither selector carries help text on screen; the label is the whole explanation the product
gives.

### Rebuilding intent vectors

**Rebuild Vector Intents** recomputes the vectors behind every intent that already exists. It is
guarded by a confirmation with **Cancel** and **Confirm Rebuild** buttons, which is a fair signal
of its cost — it is not a setting you toggle, it is a job that reprocesses everything already
grouped.

<!-- UNCONFIRMED: that a rebuild is what you run after changing the Vector Intent embedding model — inferred from what the two settings do, not stated anywhere on the screen or in an answer. -->

Changing the embedding model on
[Embedding models](/configuration/neural-config/embedding-models/) is the change that would make
existing vectors inconsistent with new ones, so a rebuild is the plausible follow-up; nothing on
the screen says so, and this page does not claim it.

:::caution[Entry point not yet documented]
The confirmation dialog for **Rebuild Vector Intents** is present in the **Neural Config** screen
in every state captured for this page, but the control that opens it was not found. Rather than
send you to a button that may not be where we guess, this page names the action and stops there.
:::

### Checking how a question matches

**Intent Similarity Testing** scores a question you type against the intents that already exist
and lists the results in an **Intent** / **Score** table, behind a **Test** action. It answers the
question this panel otherwise leaves open — whether a given phrasing lands on the intent you
expect, and by how much — which is what you want before and after changing
**Intent Match Tolerance**.

The same caveat as above applies: the dialog is in the **Neural Config** screen's markup in every
captured state, but the control that opens it was not identified, so this page does not give a
click path for it.

## FAQ

### How do I turn caching off?

Set the **Normal answer cache** and the **Edited answer cache** sliders to `0` — the panel says
"Set 0 to disable the normal answer cache" and "Set 0 to disable the edited answer cache". That
leaves the KnowledgeBase-side cache untouched; to stop that one as well, move
**KnowledgeBase Query Cache (minutes)** on
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) to `Disabled`.

### What is the difference between the two caches?

The **Edited answer cache** serves an answer a person curated. The **Normal answer cache** serves
"a recent answer if the relevant documentation has not changed, or an edited answer when at least
this many different answers exist" — and inside it edited answers take priority over the most
recent generated one. Only the normal cache has the "documentation has not changed" guard.

### My edited answer is out of date — will NeuralSeek notice?

No. The panel is explicit: "Edited answers are retained until updated or deleted, even if the
source documentation changes." Correcting one is a manual job in [Curate](/seek/curation/).

### Will a cached answer be reused in the middle of a conversation?

Only if **Require Cache to Follow Context?** allows it. Set to `Yes`, as it is on the instance
captured here, the stored answer has to fit the conversation so far; set to `No`, the question
alone decides.

### Does a cached answer have to come from the same documents?

That is **Require Cache to match the exact KB for the question and not the intent?**. It is `No`
on the instance captured here, so a cache hit is decided on the matched intent. Setting it to
`Yes` requires the same KnowledgeBase material behind the question as behind the stored answer.

### Why is a repeated question still not being served from cache?

Work down the panel in order. The threshold may not be reached yet — nothing is served until that
many different answers exist for the question. **Intent Match Tolerance** may not be treating the
new phrasing as the same question at all, which is what **Intent Similarity Testing** is for. And
**Require Cache to Follow Context?** can reject an otherwise valid hit because the conversation
has moved on.
