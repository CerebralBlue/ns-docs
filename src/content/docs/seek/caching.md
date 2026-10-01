---
title: "Caching"
description: "NeuralSeek caches at two levels — KnowledgeBase search results for a set number of minutes, and finished answers through the Edited answer cache and the Normal answer cache — to answer repeated questions faster and with the same wording."
---

NeuralSeek can reuse work it has already done instead of repeating it for every question. It
caches at two levels: the **KnowledgeBase Query Cache** keeps search results for a set number of
minutes, and two answer caches — **Edited answer cache** and **Normal answer cache** — serve a
stored answer instead of generating a new one. Caching makes frequently asked questions faster
and their answers consistent; the price is freshness, because a cached answer can outlive the
documentation it came from. Each setting is documented field by field on the configuration page
that owns it; this page explains how they work together and when to use them.

## How caching works

### Two levels of cache

A Seek normally runs two expensive steps: it searches your KnowledgeBase, then generates an
answer from what it found. Each level of cache skips one of them. As the configuration screen puts
it: "NeuralSeek can serve cached answers to user questions in order to speed up response times or
produce more consistent results."

| Cache                                   | What it keeps                       | Section of Edit Configuration         | How to turn it off    |
| --------------------------------------- | ----------------------------------- | ------------------------------------- | --------------------- |
| **KnowledgeBase Query Cache (minutes)** | KnowledgeBase search results        | KnowledgeBase Tuning                  | Move it to `Disabled` |
| **Edited answer cache**                 | Answers someone edited by hand      | Intent Matching & Cache Configuration | Set it to `0`         |
| **Normal answer cache**                 | Recent generated and edited answers | Intent Matching & Cache Configuration | Set it to `0`         |

All three are in the **Edit Configuration** dialog of the **Default Config** node on Neural
Config, and a change applies only once you save the dialog — see
[Using the Neural Config page](/configuration/neural-config/using-this-page/). A category with its
own custom configuration carries its own copy of these settings, so one category can cache
differently from the rest (see [Configuration overview](/configuration/overview/)).

### Search results: KnowledgeBase Query Cache (minutes)

**KnowledgeBase Query Cache (minutes)** is a slider in
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/), with its track running
from `Disabled` to `6000` minutes. It sets how long the results of a KnowledgeBase query are reused
before NeuralSeek searches the KnowledgeBase again for the same query. At `Disabled`, every Seek
searches.

Raise it when the same material is searched over and over and your KnowledgeBase content changes
rarely. Keep it short, or at `Disabled`, when documents are re-ingested through the day: for as
long as the window lasts, a Seek can run on results that predate the latest version of a document.

![The KnowledgeBase Tuning sliders, with KnowledgeBase Query Cache (minutes) in the left column running from Disabled to 6000](/img/neural-config/knowledgebase-tuning--document-score-range.png)

### Grouping questions into intents: Intent Match Tolerance

The answer caches do not look up the literal question; they count and serve answers per intent.
The section that holds them starts by explaining intents: "NeuralSeek automatically generates and
groups user input into intents. When a user input does not match an existing intent, a new intent
is created." **Intent Match Tolerance** sets what counts as a match, and so which rephrasings of a
question can receive the same cached answer. The intents themselves are what you analyse in
[Intent Insights](/governance/seek-intent-insights/).

![The Intent Matching & Cache Configuration section: the intents paragraph and Intent Match Tolerance, then the caching paragraph with the Edited answer cache and Normal answer cache sliders and the two Require Cache selectors](/img/neural-config/intent-matching-cache-configuration--intent-match-tolerance.png)

<!-- UNCONFIRMED: what each Intent Match Tolerance option does — read from the option names; no Seek has compared the options (brief open question; backlog 381fbbda33). -->

| Option                | What choosing it does for caching                                               |
| --------------------- | ------------------------------------------------------------------------------- |
| `Exact Match`         | Only the same wording reaches an existing intent and its cached answers.        |
| `Vector Similarity`   | Questions that mean the same thing, however worded, share an intent.            |
| `Fuzzy Match`         | Small spelling or wording differences still reach the same intent.              |
| `Keyword Match`       | Questions that share the key terms of an intent join it.                        |
| `Fuzzy Keyword Match` | Keyword matching that also tolerates misspelt key terms.                        |

A looser tolerance lets more rephrasings share one cached answer, at the risk of grouping
questions that only look alike. After changing it, ask a few rephrasings of one real question on
the [Seek](/seek/overview/) tab, then check in Intent Insights that they landed under the intent you
expect. The options are described
setting by setting in [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).

![The Intent Match Tolerance menu open, listing Exact Match, Vector Similarity, Fuzzy Match, Keyword Match and Fuzzy Keyword Match](/img/neural-config/intent-matching-cache-configuration--options-intent-match-tolerance.png)

### Edited answers: Edited answer cache

**Edited answer cache** serves answers that someone has edited by hand in
[Answer curation](/seek/curation/). Its slider runs from `Disabled` to `5`, and its help text
reads:

> Serve an edited answer when at least this many different edited answers exist for a user
> question. Edited answers are retained until updated or deleted, even if the source documentation
> changes - so use caution to be sure your edited answers do not contain out-of-date information.
> Set 0 to disable the edited answer cache.

The number is a count, not a duration: how many different edited answers must exist for a
question before one is served from this cache. Lower it when one reviewed answer is enough for you
to trust it; raise it when you want several curated answers to exist first.

Edited answers never expire on their own. When the documentation behind one changes, the edited
answer keeps being served as written until a person updates or deletes it — so the edited answer
cache is only as current as your curation.

![The Edited answer cache heading, its help text and its slider from Disabled to 5](/img/neural-config/intent-matching-cache-configuration--edited-answer-cache.png)

### Generated answers: Normal answer cache

**Normal answer cache** reuses a recent generated answer, and serves edited answers ahead of it.
Its slider also runs from `Disabled` to `5`, and its help text reads:

> Serve a recent answer if the relevant documentation has not changed, or an edited answer when at
> least this many different answers exist for a user question. Edited answers have priority in the
> Normal Answer cache, followed by the most recent generated answer. Edited answers are retained
> until updated or deleted, even if the source documentation changes - so use caution to be sure
> your edited answers do not contain out-of-date information. Set 0 to disable the normal answer
> cache.

Two rules follow from it:

- **The order is fixed.** An edited answer wins; otherwise the most recent generated answer is
  served. Curating an answer therefore changes what this cache returns as well.
- **Generated answers are guarded against change.** A generated answer is reused only if the
  relevant documentation has not changed since it was produced. Edited answers carry no such
  guard.

Set it to `0` when every answer must reflect the latest documentation, or while you test prompt
and LLM changes and need a freshly generated answer every time.

![The Normal answer cache heading, its help text and its slider from Disabled to 5, with the Require Cache to Follow Context? and Require Cache to match the exact KB for the question and not the intent? selectors beneath it](/img/neural-config/intent-matching-cache-configuration--normal-answer-cache.png)

### When a cached answer counts as a match

Two selectors under **Normal answer cache** add conditions a cached answer must meet before it is
served. **Require Cache to match the exact KB for the question and not the intent?** offers `Yes`
and `No`.

<!-- UNCONFIRMED: the option list of Require Cache to Follow Context? (only its value Yes was captured; backlog 310ee96994), and what Yes does on Require Cache to Follow Context? and on Require Cache to match the exact KB for the question and not the intent? — read from the labels; no Seek has compared Yes and No, and whether Follow Context also governs the Edited answer cache is open. -->

- **Require Cache to Follow Context?** — with `Yes`, a cached answer is served only when the
  conversation context matches, so a follow-up such as "and for the other plan?" is not answered
  with a reply cached for a different conversation. Choose `Yes` when your users ask follow-up
  questions whose meaning depends on earlier turns. How NeuralSeek carries context from one turn
  to the next is explained in [Conversational context](/seek/conversational-context/).
- **Require Cache to match the exact KB for the question and not the intent?** — with `Yes`, a
  cached answer must come from the same KnowledgeBase results for that question, not merely from
  the same intent. Choose `Yes` when your **Intent Match Tolerance** is loose and questions in one
  intent can need different source documents. With `No`, a cached answer is matched on the intent,
  so **Intent Match Tolerance** alone decides which questions share it.

![The Require Cache to match the exact KB for the question and not the intent? menu open, offering Yes and No](/img/neural-config/intent-matching-cache-configuration--options-require-cache-to-match-the-exact-kb-for-.png)

### Cached answers as a timeout fallback

The answer caches also protect a chatbot from slow generation. **Timeout** in
[Platform Preferences](/configuration/neural-config/platform-preferences/) is the language
generation timeout, set in milliseconds on a slider from `4000` to `90000`. Its help text reads:

> Language Generation Timeout (milliseconds). Set this to a few seconds less than the timeout of
> your chatbot platform. When timeout is reached Neuralseek will attempt to catch the timeout by
> serving the closest possible cached answer, if one is available.

When generating an answer takes longer than **Timeout**, NeuralSeek tries to send the closest
cached answer rather than nothing — but only if one exists.

![The Timeout slider in Platform Preferences, from 4000 to 90000, under the end of its help text about serving the closest possible cached answer](/img/neural-config/platform-preferences--timeout.png)

### Telling whether an answer came from the cache

<!-- UNCONFIRMED: the Cached label next to Total Response Time on the Seek tab — from the previous MkDocs page for this route (backlog f9b4f749d3); the Seek tab has not been captured for this page. -->

On the **Seek** tab, an answer served from the cache is marked **Cached** next to **Total Response
Time**. Use it to check your settings: ask the same question twice and look for the label on the
second answer.

## When to use caching

Caching fits when the same questions come back again and again and their answers rarely change:

- **Frequently asked questions over stable content** — policies, definitions, plan limits. The
  **Normal answer cache** serves them faster and with the same wording each time.
- **Answers you have curated** and want served exactly as written. That is the **Edited answer
  cache**; here the cache is the point rather than an optimisation.
- **Many similar questions that run the same KnowledgeBase search.** The **KnowledgeBase Query
  Cache (minutes)** shortens those.
- **A chatbot platform with a hard response timeout**, where an earlier answer is better than
  none.

It is the wrong tool when your documentation changes through the day and users must see each
change at once — keep the KnowledgeBase query cache at `Disabled` or short — and when nobody
reviews edited answers, because nothing expires them for you. While you tune prompts, the LLM or
KnowledgeBase settings, turn the answer caches off so every Seek shows the effect of your change.

## FAQ

### How do I turn caching off completely?

Move **KnowledgeBase Query Cache (minutes)** to `Disabled`, set **Edited answer cache** and
**Normal answer cache** to `0`, and save the configuration.

### Will a cached answer go stale when my documents change?

A generated answer will not: the **Normal answer cache** reuses one only "if the relevant
documentation has not changed". An edited answer can: edited answers "are retained until updated or
deleted, even if the source documentation changes", so review them in
[Answer curation](/seek/curation/) whenever the content they cover is updated.

### If both an edited and a generated answer exist, which is served?

The edited one. In the **Normal answer cache**, edited answers have priority, followed by the most
recent generated answer.

### Why did a rephrased question not get a cached answer?

Either it was filed under a different intent — **Intent Match Tolerance** at `Exact Match` treats a
rewording as a new question — or one of the two **Require Cache** conditions was not met. Check
also that enough answers exist for the question yet: both answer-cache sliders are counts.

### Can a cached answer be served when the LLM is too slow?

Yes, if one exists. When the **Timeout** in Platform Preferences is reached, NeuralSeek "will
attempt to catch the timeout by serving the closest possible cached answer, if one is available."

## Related

- [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/) — the answer-cache settings one by one
- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) — the KnowledgeBase query cache
- [Platform Preferences](/configuration/neural-config/platform-preferences/) — Timeout
- [Answer curation](/seek/curation/) — where edited answers come from
- [Conversational context](/seek/conversational-context/)
- [Intent Insights](/governance/seek-intent-insights/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/)
- [Configuration overview](/configuration/overview/) — per-category configurations
