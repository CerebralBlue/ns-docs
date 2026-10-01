---
title: "Intent Matching & Cache"
description: "The Intent Matching & Cache Configuration section of a NeuralSeek configuration sets how questions are grouped into intents and when an edited or recent answer may be served from cache instead of being generated."
---

The **Intent Matching & Cache Configuration** section decides two things: how NeuralSeek groups
incoming questions into intents, and when it may answer a question from cache — with an edited
answer or a recent generated one — instead of generating a new answer. Caching makes answers
faster and more consistent; the cost is freshness, because a cached answer can outlive the
documentation it came from. This page covers the settings one by one. For how these answer caches
work together with the KnowledgeBase query cache from the point of view of someone asking a
question, see [Caching](/seek/caching/).

## Where to find it

On **Neural Config**, select the **Default Config / Answer Generation** node, select
**Edit Configuration**, then expand **Intent Matching & Cache Configuration**.

![The Intent Matching & Cache Configuration section expanded in the Edit Configuration dialog: Intent Match Tolerance, the Edited answer cache and Normal answer cache sliders, the Require Cache to Follow Context? selector, and the Propose Changes and Save footer](/img/neural-config/intent-matching-cache-configuration-panel.png)

A category that carries its own Custom Configuration has the same section in its own
configuration dialog, so one category can match and cache differently from the rest of the
instance. How category configurations relate to **Default Config** is explained in
[Configuration overview](/configuration/overview/).

Select **Save** to apply a change. On **Default Config** you can select **Propose Changes**
instead — see [Using the Neural Config page](/configuration/neural-config/using-this-page/).

## Settings

### Intent Match Tolerance

NeuralSeek files every question under an intent. When a question matches no existing intent,
NeuralSeek creates a new one. **Intent Match Tolerance** sets what counts as a match.
A strict setting produces many small intents; a looser one gathers rephrasings of the same question
under one intent. Intents are what you see when you analyse questions in
[Intent Insights](/governance/seek-intent-insights/).

![The Intent Match Tolerance menu open, listing Exact Match, Vector Similarity, Fuzzy Match, Keyword Match and Fuzzy Keyword Match](/img/neural-config/intent-matching-cache-configuration--options-intent-match-tolerance.png)

<!-- UNCONFIRMED: what each option does — read from the option names; no comparison of the options has been run and the product text describes none of them individually. -->

| Option                | What choosing it does                                                                |
| --------------------- | ------------------------------------------------------------------------------------ |
| `Exact Match`         | A question joins an intent only when its wording matches; any rewording starts a new intent. |
| `Vector Similarity`   | Questions are compared by meaning, so differently worded questions that ask the same thing join one intent. |
| `Fuzzy Match`         | Small differences in spelling or wording are tolerated.                              |
| `Keyword Match`       | A question that shares the key words of an intent joins it.                          |
| `Fuzzy Keyword Match` | Keyword matching that also tolerates misspelt key words.                             |

**When to change it.** Loosen the tolerance when your users ask the same thing in many different
ways and you want those questions counted together. Keep `Exact Match` when two similar-looking
questions must get different answers. After a change, save it, ask a few rephrasings of one real
question in [Seek](/seek/overview/), and check in Intent Insights whether they were grouped under
one intent.

<!-- UNCONFIRMED: that Vector Similarity compares questions with the embedding model ticked for Vector Intent — inferred from the checkbox name; the screen does not connect the two. -->

For `Vector Similarity`, the embedding model matters: each model on
[Embedding Models](/configuration/neural-config/embedding-models/) has a **Vector Intent**
checkbox among its embedding functions.

### Edited answer cache

NeuralSeek can serve cached answers to user questions to speed up response times or produce more
consistent results. **Edited answer
cache** serves answers that someone has edited — the curated answers you maintain in
[Answer curation](/seek/curation/).

![The Edited answer cache slider with its help text, running from Disabled to 5, with the Slider value box beside it](/img/neural-config/intent-matching-cache-configuration--edited-answer-cache.png)

Set the number with the slider or type it in the **Slider value** box. The track runs from
`Disabled` to `5`. The help text:

> Serve an edited answer when at least this many different edited answers exist for a user
> question. Edited answers are retained until updated or deleted, even if the source documentation
> changes - so use caution to be sure your edited answers do not contain out-of-date information.
> Set 0 to disable the edited answer cache.

- **What the number means:** how many different edited answers must exist for a question before
  NeuralSeek serves one from this cache. A lower number lets curated answers take over sooner; a
  higher number waits until more of them exist.
- **When to change it:** lower it when your team curates answers and wants people to see the
  reviewed wording; set it to `0` when nobody keeps edited answers current.
- **What to watch:** edited answers do not expire when the documentation changes. Review and update
  them yourself whenever the source content moves on.

### Normal answer cache

**Normal answer cache** serves a recent generated answer again, as long as the documentation behind
it has not changed — and it serves edited answers too, ahead of generated ones.

![The Normal answer cache slider with its help text, running from Disabled to 5, with the Require Cache to Follow Context? and Require Cache to match the exact KB for the question and not the intent? selectors beneath it](/img/neural-config/intent-matching-cache-configuration--normal-answer-cache.png)

It has the same `Disabled` to `5` slider and its own **Slider value** box. The help text:

> Serve a recent answer if the relevant documentation has not changed, or an edited answer when at
> least this many different answers exist for a user question. Edited answers have priority in the
> Normal Answer cache, followed by the most recent generated answer. Edited answers are retained
> until updated or deleted, even if the source documentation changes - so use caution to be sure
> your edited answers do not contain out-of-date information. Set 0 to disable the normal answer
> cache.

- **What it serves, in order:** an edited answer first, then the most recent generated answer.
  Curating an answer therefore changes what this cache returns as well.
- **Freshness:** a generated answer is reused only if the relevant documentation has not changed
  since. Edited answers carry no such check.
- **When to change it:** use it for questions that are asked again and again over documentation
  that changes rarely. Set it to `0` when every answer must reflect the latest documentation, or
  when you test prompt and LLM changes and need a fresh answer each time.

### Cache conditions

Two selectors under **Normal answer cache** add conditions a cached answer must meet before it is
served.

![The Require Cache to match the exact KB for the question and not the intent? menu open, offering Yes and No](/img/neural-config/intent-matching-cache-configuration--options-require-cache-to-match-the-exact-kb-for-.png)

<!-- UNCONFIRMED: the option list of Require Cache to Follow Context? (Yes / No; the open list was not captured) and what each selector checks — both meanings are read from the labels, no Seek has compared Yes and No. -->

| Setting                                                                     | Options      | What `Yes` does                                                                                                   | When to choose `Yes`                                                                                   |
| --------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Require Cache to Follow Context?**                                        | `Yes` · `No` | A cached answer is served only when the conversation context matches, so a follow-up is not answered out of context. | Your users ask follow-up questions whose meaning depends on the earlier turns ("and for the other plan?"). |
| **Require Cache to match the exact KB for the question and not the intent?** | `Yes` · `No` | A cached answer must come from the same knowledge-base results for that question, not just from the same intent.  | Your tolerance is loose and questions in one intent can need different source documents.               |

With `No`, the condition is dropped: a cached answer can be served regardless of the conversation,
or matched on the question's intent. How NeuralSeek tracks a conversation is explained in
[Conversational context](/seek/conversational-context/).

The last selector is where the two halves of the section meet: with `No`, a cached answer is
matched on the intent, so **Intent Match Tolerance** also decides which questions share a cached
answer.

## FAQ

### How do I turn answer caching off?

Set both **Edited answer cache** and **Normal answer cache** to `0`, the `Disabled` end of each
slider. The KnowledgeBase query cache is a separate setting, **KnowledgeBase Query Cache
(minutes)**, on [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

### Will an edited answer go stale when my documents change?

It can. Edited answers are kept until you update or delete them, even if the source documentation
changes, so review them in [Answer curation](/seek/curation/) whenever the content they cover is
updated. Generated answers in the **Normal answer cache** are reused only while the relevant
documentation is unchanged.

### Which answer is served when both an edited and a generated answer are cached?

The edited answer. In the **Normal answer cache**, edited answers have priority, followed by the
most recent generated answer.

### Why does a rephrased question not get a cached answer?

<!-- UNCONFIRMED: that a rewording under Exact Match starts a new intent, that exact-KB = Yes requires the same knowledge-base results, and that answers are cached per intent — read from the option names and the selector label; no Seek has compared them. -->

Two settings can stop it. With **Intent Match Tolerance** at `Exact Match`, a reworded question
may be filed under a new intent, and with **Require Cache to match the exact KB for the question
and not the intent?** at `Yes` the cached answer may also have to come from the same
knowledge-base results. Loosening the tolerance, or setting the exact-KB condition to `No`, can let
more rephrasings share a cached answer.

### Can a slow LLM fall back to a cached answer?

Yes. **Language Generation Timeout (milliseconds)** on
[Platform Preferences](/configuration/neural-config/platform-preferences/) says: "When timeout is
reached Neuralseek will attempt to catch the timeout by serving the closest possible cached answer,
if one is available."

## Related

- [Caching](/seek/caching/) — the three caches together, seen from Seek
- [Answer curation](/seek/curation/) — where edited answers come from
- [Conversational context](/seek/conversational-context/)
- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) — the KnowledgeBase query cache
- [Embedding Models](/configuration/neural-config/embedding-models/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/)
- [Neural Config](/configuration/neural-config/)
