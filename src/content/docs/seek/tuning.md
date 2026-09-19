---
title: 'Tuning answers'
description: 'Tuning a NeuralSeek agent means controlling which documentation reaches the LLM and how the LLM is told to use it — diagnosed on the Seek tab and changed in the Edit Configuration dialog.'
---

## What is it

Tuning is the work of getting better answers out of a KnowledgeBase that is already connected.
The KnowledgeBase is the ground truth: everything Seek generates is built from the passages it
returns, so tuning is mostly about controlling _which_ documentation reaches the LLM and _how
much_ of it, plus a small number of settings that tell the LLM how to write what comes back.

It happens in two places. You diagnose on the [Seek](/seek/overview/) tab, where an answer
arrives with its scores and the source documents that produced it. You change settings in the
**Edit Configuration** dialog on the Neural Config screen, in the accordions named below.

## Why it matters

An LLM asked a question with poor source material still answers. The failure is quiet: a fluent,
plausible, wrong response. Most answer-quality problems in a NeuralSeek deployment are retrieval
problems wearing a generation problem's clothes — the model wrote a reasonable paragraph out of
the wrong documents.

The controls here also carry trade-offs in both directions. More documents per Seek is not
better, and a longer answer is not better. Each lever has a direction that helps a given
deployment and a direction that hurts it, which is why the product asks you to look at a real
answer before moving anything.

## When to use it

- A new instance whose answers have never been reviewed.
- Answers that are irrelevant or inaccurate, or that vary between identical questions.
- A semantic score that is low, or high on an answer that is visibly wrong.
- Answers that are too long, too short, or that drift away from your own documentation.

## How it works

Every setting on this page lives in one dialog. On the Neural Config screen, select the
**Default Config** node on the routing tree, then **Edit Configuration**. The dialog opens with
one accordion per configuration section, and its footer carries **Propose Changes** and
**Save** — nothing you change takes effect until you select **Save**. See
[Using this page](/configuration/neural-config/using-this-page/) for how saving and proposals
behave, and [Neural Config overview](/configuration/overview/) for the routing tree itself.

![The Edit Configuration dialog for Default Config, listing its accordion sections](/img/neural-config/edit-configuration.png)

### Start with the answer, not the settings

The **KnowledgeBase Tuning** section states the product's own tuning loop, and it is the right
order of work:

> Tuning your Knowledgebase is an important part of creating a well performing system. Start by
> entering a seek on the seek tab, and looking at the documentation in the accordions below the
> answer. For an answer that is not good - is the top document correct and complete? If not
> adjust snippet size and use the slider bars to do pushdown KB training on supported KB's. Are
> you bringing back more than you need (irrelevant docs) - set a max docs per seek or lower
> document score window.

Two things follow from that. First, the source documentation is checked before any slider is
touched: if the passage the KnowledgeBase returned does not answer the question, no setting on
this page will make the answer correct. Second, the fix for a bad answer is usually a retrieval
fix, not a prompt fix.

### Reading the scores

<!-- UNCONFIRMED: what the Seek tab shows beside an answer (semantic score, semantic analysis text, KnowledgeBase coverage and confidence) — the Seek tab was not captured for this page; the source accordions are the part the product's own tuning paragraph names -->

A Seek answer comes back with a semantic score, a short semantic analysis, KnowledgeBase scoring
and the source documents in expandable accordions. What to look at, in order:

- **The source accordions.** Expand them to see exactly what the KnowledgeBase sent to the LLM.
  This is the single most informative thing on the screen — everything else describes it.
- **The semantic score.** It measures how well the generated answer is attributed back to those
  sources. The penalties that shape it (missing key search terms, source jumps, LLM declines)
  are described on [Semantic model tuning](/configuration/semantic-model/); whether the score
  blocks or warns is set in [Semantic scoring](/governance/guardrails/semantic-scoring/).
- **The semantic analysis text.** The explanation beside the score says whether the answer drew
  terms from many documents or leaned on one.
- **KnowledgeBase coverage and confidence.** Low coverage means few documents matched the
  question; high coverage means many matched, or a few matched exactly. Low confidence means the
  KnowledgeBase does not think it found good matches; high confidence means it found good
  matches, which is not the same as matches that answer the question.

<!-- UNCONFIRMED: the "below 20% / above 60%" semantic-score thresholds — from the previous MkDocs tuning guide; no captured screen states them -->

As rules of thumb from the previous tuning guide, a semantic score below about 20% points at
documentation that does not compare well with the question, while a score above about 60% on a
bad answer points the other way: conflicting content, or source wording that mirrors the
question without answering it. Treat both as starting points for investigation, not as product
thresholds.

### Retrieval: how much documentation reaches the LLM

These sliders live in the **KnowledgeBase Tuning** accordion and are documented on
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/). In tuning terms:

- **Document Score Range** — widens or narrows the top share of scored documents considered.
- **Max Documents per Seek** — caps how many documents reach the LLM, so a good answer is not
  diluted by near-misses.
- **Document Date Penalty** — downweights older documents.
- **Expansion Window** — how many chunks to grab before and after the target chunk.

For most deployments, a few high-quality documents beat many low-quality or loosely related
ones. If an answer stitches together unrelated material, lower **Max Documents per Seek** before
anything else.

<!-- UNCONFIRMED: "Snippet Size" as a configurable control — named in the KnowledgeBase Tuning paragraph above and in the previous MkDocs guide, but no such control appears in the captured KnowledgeBase Tuning section; it may exist only for some KnowledgeBase types -->

The tuning paragraph above mentions adjusting snippet size. No **Snippet Size** control appears
in the KnowledgeBase Tuning section captured for this page, so check your own instance for it —
it may be specific to certain KnowledgeBase types. See
[Supported knowledge bases](/knowledge/supported-knowledgebases/).

### Answer shape — verbosity and grounding

Two controls in the **Answer Engineering & Preferences** accordion decide how long an average
answer is and how strictly it must come from your documentation.

![The Answer Engineering & Preferences section, with the verbosity slider, Force Answers from the Knowledgebase, and the regular-expression replacement table](/img/neural-config/intent-matching-cache-configuration.png)

**How verbose should an average answer be?** is a slider running from `Very Concise` to
`Very Verbose`. It carries no numeric readout — you set a position, not a value. On the instance
captured here the handle sits left of centre, toward the concise end. Move it toward
`Very Concise` when answers are long, padded or slow to arrive; move it toward `Very Verbose`
when answers are too clipped to be useful. The setting also decides how much there is to
generate: the **Prompt Engineering** section describes NeuralSeek's requested maximum tokens as a
baseline that "varies per answer verbosity", so a more concise setting is one of the levers to
reach for when answers are arriving late or cut short. See
[Platform Preferences](/configuration/neural-config/platform-preferences/) for the language
generation timeout itself.

**Force Answers from the Knowledgebase** is a list with the value `True` on the instance
captured here. It is the control to check first when the LLM is answering from general knowledge
instead of from your documents. The label is the whole of its on-screen description; there is no
help text beside it.

### Rewriting text on the way out

The same accordion holds a replacement table, described on screen as:

> Answer Engineering uses Javascript Regular Expressions to selectivley replace text in both the
> KnowledgeBase training data and the live generated answer. Use this to remove or swap phone
> numbers, emails, etc...

Each row pairs a **Regular Expression** with a **Replacement**, and the control at the end of
the row adds another (its tooltip reads **Add a new row.**). The table carries no filled-in rows
on the instance captured here. Because the expression is applied to the training data as well as to the
generated answer, a broad pattern changes what the LLM sees, not only what the reader sees —
keep the patterns narrow and specific.

:::caution
This is a text substitution, not a redaction guarantee. For detecting and masking personal data,
use [PII detection](/governance/pii-detection/) rather than a regular expression here.
:::

### Telling the LLM who you are

The **Company / Organization Preferences** accordion adds standing context to every Seek, which
is why it belongs to tuning: it changes answers without changing retrieval.

![The Company / Organization Preferences section, with the display name, Company Response Affinity and Stump Speech fields](/img/neural-config/company-org-preferences.png)

- **Enter the company or organization display name** — the name the answers speak as. The
  instance captured here holds `Neuralseek`.
- **Company Response Affinity** — on screen, "add affinity to the company on top of any affinity
  that may be already present in your KnowledgeBase and Stump Speeches". The value seen here is
  `Do not add affinity`.
- **Stump Speech** — on screen, "A block of text that will be passed to the LLM on every single
  seek as part of the provided documentation". It is empty on this instance, with a placeholder
  showing the shape of one.

Because the stump speech is passed on every single Seek, it consumes context on every call. Keep
it to facts the model must never get wrong — not a marketing paragraph.

### Settings that work for most deployments

<!-- UNCONFIRMED: the recommended ranges below (score range 0.6-0.8, 4-5 documents, 10-20% confidence) — carried over from the previous MkDocs tuning guide; no captured screen or probe states them as product defaults or recommendations -->

These are starting points carried over from the previous tuning guide, not product defaults.
The values on your instance will differ.

| Setting                                  | Where                                                                       | Starting point        |
| ---------------------------------------- | --------------------------------------------------------------------------- | --------------------- |
| Document Score Range                     | [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)   | `0.6` – `0.8`         |
| Max Documents per Seek                   | [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)   | `4` – `5`             |
| How verbose should an average answer be? | Answer Engineering & Preferences                                             | toward `Very Concise` |
| Force Answers from the Knowledgebase     | Answer Engineering & Preferences                                             | `True`                |
| Warning and minimum confidence           | [Minimum confidence](/governance/guardrails/min-confidence/)                 | around 10–20%         |

Change one at a time and re-ask the same question on the Seek tab. Changing three settings
together tells you nothing about which one moved the answer.

### What is tuned elsewhere

Several things people reach for while tuning are documented on their own pages:

- Generating and curating questions and answers in bulk — [Answer curation](/seek/curation/).
- Serving one consistent answer instead of small wording variations —
  [Caching](/seek/caching/) and
  [Intent matching & caching](/configuration/neural-config/intent-matching-caching/).
- Narrowing a large corpus by metadata — [Dynamic filters](/seek/dynamic-filters/).
- Lucene, vector and hybrid retrieval —
  [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/) and
  [Supported knowledge bases](/knowledge/supported-knowledgebases/).
- Answering in a language your documents are not written in —
  [Language](/configuration/language/).
- Timeouts, context turns and other platform-wide behaviour —
  [Platform Preferences](/configuration/neural-config/platform-preferences/).
- Re-running a previous answer against new settings — [Replay](/governance/replay/).
- Exporting a saved configuration to run a call against different settings —
  [Backup & restore](/configuration/backup-restore/).

## FAQ

### My answers are too long. What do I change?

**How verbose should an average answer be?**, in the **Answer Engineering & Preferences**
accordion of the Edit Configuration dialog. It is a slider from `Very Concise` to
`Very Verbose` with no numeric value, so move the handle toward `Very Concise`, select **Save**,
and re-ask the same question. The verbosity setting also drives the maximum tokens NeuralSeek
requests, so a more concise answer is less to generate.

### The LLM is answering from general knowledge instead of my documents. What now?

Check **Force Answers from the Knowledgebase** in the same accordion — it is `True` on the
instance documented here. If it is already set and the answer still drifts, the problem is
upstream: expand the source accordions under the answer and see whether the KnowledgeBase
returned anything that answers the question at all.

### Too many irrelevant documents reach the LLM. Which control?

Lower **Max Documents per Seek** or narrow **Document Score Range**, both in the
**KnowledgeBase Tuning** accordion — this is the product's own first advice for bringing back
more than you need. See
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

### Where do I start when an answer is bad?

On the Seek tab. Ask the failing question, open the documentation accordions under the answer,
and read what the KnowledgeBase actually returned. If the top document is neither correct nor
complete, fix the documentation first — it is the ground truth, and it is the highest-leverage
change available.

### Does tuning change the score or the answer?

Both, but not with the same controls. The retrieval settings change what reaches the LLM, so
they change the answer and the score with it. The semantic-model settings on
[Semantic model tuning](/configuration/semantic-model/) change only how an answer is scored —
useful when the answers are fine and the scores are not.

### What does the Stump Speech do that the KnowledgeBase cannot?

It passes a fixed block of text to the LLM on every single Seek, as part of the provided
documentation, without it having to be retrieved. That makes it suitable for a small amount of
standing context the model must always have. It costs context on every call, so it is a poor
substitute for a document in the KnowledgeBase.
