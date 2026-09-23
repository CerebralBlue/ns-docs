---
title: 'Tuning answers'
description: 'Tuning a NeuralSeek agent means controlling which documentation reaches the LLM and how the LLM is told to write from it — diagnosed on the Seek tab and changed in the Edit Configuration dialog of Neural Config.'
---

## What is it

Tuning is the work of getting better answers out of a KnowledgeBase that is already connected.
The KnowledgeBase is the ground truth: everything Seek generates is built from the passages it
returns, so tuning is mostly about controlling _which_ documentation reaches the LLM and _how
much_ of it, plus a small number of settings that tell the LLM how to write what comes back.

It happens in two places. You diagnose on the [Seek](/seek/overview/) tab, where an answer
arrives with the source documents that produced it. You change settings in the
**Edit Configuration** dialog on the Neural Config screen, in three accordions: **KnowledgeBase
Tuning** for retrieval, **Answer Engineering & Preferences** for the shape of the answer, and
**Company / Organization Preferences** for the standing context every answer carries.

## Why it matters

An LLM asked a question with poor source material still answers. The failure is quiet: a fluent,
plausible, wrong response. Most answer-quality problems in a NeuralSeek deployment are retrieval
problems wearing a generation problem's clothes — the model wrote a reasonable paragraph out of
the wrong documents.

The controls here also carry trade-offs in both directions. More documents per Seek is not
better, and a longer answer is not better. Each lever has a direction that helps a given
deployment and a direction that hurts it, which is why the product asks you to look at a real
answer before moving anything.

Tuning is the wrong tool when the documentation itself does not answer the question. No slider
turns a missing passage into a present one; fix the source and come back.

## When to use it

- A new instance whose answers have never been reviewed.
- Answers that are irrelevant or inaccurate, or that vary between identical questions.
- Answers that are too long, too short, or that drift away from your own documentation.
- Answers that should carry your organization's name or a fixed piece of standing context.
- Answers or training data that contain text you need stripped or swapped, such as phone
  numbers or email addresses.

## How it works

Every setting on this page lives in one dialog. On the Neural Config screen, select the
**Default Config / Answer Generation** node on the routing tree, then **Edit Configuration**.
The dialog is titled **Configuration: Default Config** and opens with one accordion per
configuration section; its footer carries **Propose Changes** and **Save** — nothing you change
takes effect until you select **Save**. See
[Using this page](/configuration/neural-config/using-this-page/) for how saving and proposals
behave, and [Configuration overview](/configuration/overview/) for the routing tree itself.

![The Configuration: Default Config dialog with the Answer Engineering & Preferences accordion open, and Propose Changes and Save in the footer](/img/neural-config/answer-engineering-preferences.png)

### Start on the Seek tab, then narrow what reaches the LLM

The **KnowledgeBase Tuning** accordion opens with the product's own tuning loop, and it is the
right order of work:

> Tuning your Knowledgebase is an important part of creating a well performing system. Start by
> entering a seek on the seek tab, and looking at the documentation in the accordions below the
> answer. For an answer that is not good - is the top document correct and complete? If not
> adjust snippet size and use the slider bars to do pushdown KB training on supported KB's. Are
> you bringing back more than you need (irrelevant docs) - set a max docs per seek or lower
> document score window.

So the source documentation is checked before any slider is touched: ask the failing question on
the [Seek](/seek/overview/) tab, open the accordions under the answer, and read what the
KnowledgeBase actually sent to the LLM. If that passage does not answer the question, no setting
on this page will make the answer correct. How the answer is scored against those sources is
covered on [Semantic model tuning](/configuration/semantic-model/).

![The KnowledgeBase Tuning accordion: the tuning paragraph above the Document Score Range and Max Documents per Seek sliders](/img/neural-config/knowledgebase-tuning--document-score-range.png)

When the top document is right but the answer still mixes in unrelated material, the paragraph
names the two retrieval controls to reach for. Both live in the same accordion and are documented
in full on [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/); in tuning
terms:

- **Max Documents per Seek** — the paragraph's first suggestion for irrelevant documents ("set a
  max docs per seek"). It caps how many documents reach the LLM, so a good answer is not diluted
  by near-misses. The slider runs from `Unlimited` to `30`; the instance captured here holds `2`.
- **Document Score Range** — the paragraph's "document score window". Lowering it narrows the
  share of scored documents considered. The slider runs from `0%` to `100%`; the instance
  captured here holds `0.8`.

For most deployments a few high-quality documents beat many loosely related ones. If an answer
stitches together unrelated material, lower **Max Documents per Seek** before anything else.

The paragraph also mentions adjusting snippet size. No control by that name exists in the
KnowledgeBase Tuning accordion captured for this page, whose KnowledgeBase Type is NeuralSeek KB
— so on that configuration there is nothing to adjust, and the sliders above are the retrieval
levers you have.

### How long an answer should be

The first control in the **Answer Engineering & Preferences** accordion is
**How verbose should an average answer be?** — a slider running from `Very Concise` on the left
to `Very Verbose` on the right. Unlike the other sliders in the dialog it carries no number and
no value box: you set a position, not a value. On the instance captured here the handle sits left
of centre, about a third of the way from `Very Concise`. There is no help text beside it.

![The How verbose should an average answer be? slider, from Very Concise to Very Verbose](/img/neural-config/answer-engineering-preferences--how-verbose-should-an-average-answer-be.png)

Move it toward `Very Concise` when answers are long or padded; move it toward `Very Verbose` when
answers are too clipped to be useful. The setting also feeds how much the LLM is asked to
generate: the **Prompt Engineering** accordion describes its **Maximum Tokens** control as
"Adjust our baseline (varies per answer verbosity) requested maximum tokens", so a more concise
setting is one of the levers to reach for when answers arrive late or cut short. See
[Prompt Engineering](/configuration/neural-config/prompt-engineering/) for that control.

### Keeping answers inside your documentation

**Force Answers from the Knowledgebase** is a list in the same accordion with two options,
`True` and `False`; the instance captured here is set to `True`. The label is the whole of its
on-screen description — there is no help text — and it is the control to check first when the
LLM is answering from general knowledge instead of from your documents.

![The Force Answers from the Knowledgebase list, set to True](/img/neural-config/answer-engineering-preferences--force-answers-from-the-knowledgebase.png)

![The open Force Answers from the Knowledgebase list showing its two options, True and False](/img/neural-config/answer-engineering-preferences--options-force-answers-from-the-knowledgebase.png)

With the setting at `True`, a question the KnowledgeBase cannot answer comes back as a decline
rather than as the model's own knowledge. Asked "What is the capital of France?" via the MCP,
the instance captured here answered:

```text
The documentation does not contain information about the capital of France.
```

The answer came back with a KB score of 10 and a semantic score of 11 — the decline is what a
low-scoring retrieval looks like with this setting on. If the setting is already `True` and
answers still drift, the problem is upstream: the retrieved documents are the thing to inspect.

### Rewriting text with regular expressions

The same accordion holds a replacement table, described on screen as:

> Answer Engineering uses Javascript Regular Expressions to selectivley replace text in both the
> KnowledgeBase training data and the live generated answer. Use this to remove or swap phone
> numbers, emails, etc...

![The Answer Engineering & Preferences accordion: verbosity slider, Force Answers from the Knowledgebase, and the Regular Expression / Replacement table with its add-row button](/img/neural-config/answer-engineering-preferences-panel.png)

Each row pairs a **Regular Expression** with a **Replacement**. The instance captured here has a
single empty row; the only control in it is the icon button at the end of the row, whose tooltip
reads **Add a new row.** — the same button the Secrets table uses (see
[Secrets](/configuration/neural-config/secrets/)). Because the expression is applied to the
training data as well as to the generated answer, a broad pattern changes what the LLM sees, not
only what the reader sees — keep patterns narrow and specific.

:::caution
This is a text substitution, not a redaction guarantee. For detecting and masking personal data,
use [PII detection](/governance/pii-detection/) rather than a regular expression here.
:::

### Telling the LLM who you are

The **Company / Organization Preferences** accordion adds standing context to every Seek, which
is why it belongs to tuning: it changes answers without changing retrieval. It holds three
fields.

**Enter the company or organization display name** is a text box; the label sits under it. The
instance captured here holds `Neuralseek`. There is no help text.

![The display name text box, holding Neuralseek, with its label underneath](/img/neural-config/company-organization-preferences--enter-the-company-or-organization-displa.png)

**Company Response Affinity** is a list whose full on-screen label reads "Company Response
Affinity (add affinity to the company on top of any affinity that may be already present in
your KnowledgeBase and Stump Speeches)". Its two options are `Add company affinity` and
`Do not add affinity`; the instance captured here is set to `Do not add affinity`. The
parenthetical is the only description of what affinity means: a pro-company slant added on top
of whatever your documents and stump speech already carry.

![The Company Response Affinity list, set to Do not add affinity, with its full label](/img/neural-config/company-organization-preferences--company-response-affinity-add-affinity-t.png)

![The open Company Response Affinity list showing Add company affinity and Do not add affinity](/img/neural-config/company-organization-preferences--options-company-response-affinity-add-affinity-t.png)

**Stump Speech** is a multi-line text box whose full label reads "Stump Speech. A block of text
that will be passed to the LLM on every single seek as part of the provided documentation." It
is empty on the instance captured here; the grey text `ABC company is a great company that can
help you do things.` is the box's placeholder, not a value.

![The Company / Organization Preferences accordion: display name, Company Response Affinity, and the empty Stump Speech box showing its placeholder](/img/neural-config/company-organization-preferences-panel.png)

Because the stump speech is passed on every single Seek, it takes up context on every call. Keep
it to facts the model must always have — not a marketing paragraph.

### Starting points from the previous guide

<!-- UNCONFIRMED: the starting points below (Document Score Range 0.6–0.8, Max Documents per Seek 4–5, verbosity toward Very Concise, Force Answers True) — carried over from the previous MkDocs tuning guide; no captured screen or probe states them as product defaults or recommendations -->

These are starting points carried over from the previous tuning guide, not product defaults.
The values on your instance will differ.

| Setting                                  | Where                                                                      | Starting point        |
| ---------------------------------------- | -------------------------------------------------------------------------- | --------------------- |
| Document Score Range                     | [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) | `0.6` – `0.8`         |
| Max Documents per Seek                   | [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) | `4` – `5`             |
| How verbose should an average answer be? | Answer Engineering & Preferences                                           | toward `Very Concise` |
| Force Answers from the Knowledgebase     | Answer Engineering & Preferences                                           | `True`                |

Change one setting at a time and re-ask the same question on the Seek tab. Changing three
settings together tells you nothing about which one moved the answer.

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
and re-ask the same question. The Prompt Engineering accordion says its requested maximum
tokens baseline "varies per answer verbosity", so a more concise answer is also less to generate.

### The LLM is answering from general knowledge instead of my documents. What now?

Check **Force Answers from the Knowledgebase** in the same accordion — its options are `True`
and `False`, and it is `True` on the instance documented here. If it is already `True` and the
answer still drifts, the problem is upstream: start on the Seek tab as the product's own tuning
paragraph says, open the source accordions under the answer, and see whether the KnowledgeBase
returned anything that answers the question at all.

### Can I strip phone numbers or emails from answers?

Yes. Use the **Regular Expression** / **Replacement** table in **Answer Engineering &
Preferences**. The on-screen text says it applies to "both the KnowledgeBase training data and
the live generated answer", so the pattern changes what the LLM sees as well as what the reader
sees. Add rows with the **Add a new row.** button at the end of the last row. For personal data,
prefer [PII detection](/governance/pii-detection/).

### How do I make every answer know my company name?

Fill in **Enter the company or organization display name** in the **Company / Organization
Preferences** accordion. To add a pro-company slant on top of whatever your documents already
carry, set **Company Response Affinity** to `Add company affinity`; the instance documented here
leaves it at `Do not add affinity`.

### What is a Stump Speech?

On screen: "A block of text that will be passed to the LLM on every single seek as part of the
provided documentation." It is a fixed piece of context the model always receives without having
to retrieve it, which makes it suitable for a small amount of standing text the model must
always have. It is empty on the instance documented here.

### Too many irrelevant documents reach the LLM. Which control?

Lower **Max Documents per Seek** or narrow **Document Score Range**, both in the
**KnowledgeBase Tuning** accordion — this is the product's own advice for "bringing back more
than you need". Both controls are documented in full on
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).
