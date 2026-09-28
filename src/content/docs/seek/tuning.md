---
title: 'Tuning answers'
description: 'Tuning NeuralSeek answers means checking a real answer on the Seek tab, then shaping it with the Answer Engineering & Preferences and Company / Organization Preferences sections of Neural Config, after KnowledgeBase Tuning has the right documents reaching the LLM.'
---

## What is it

Tuning is the work of getting better answers out of a KnowledgeBase that is already connected.
Every answer Seek generates is built from the passages the KnowledgeBase returns, so tuning has
two halves: controlling _which_ documentation reaches the LLM, and controlling _how_ the LLM writes
from it.

This page covers the second half. It documents two sections of the **Edit Configuration** dialog
on the Neural Config screen:

- **Answer Engineering & Preferences** — how long a typical answer is, whether answers must come
  from the KnowledgeBase, and regular-expression rewrites applied to your content and to answers.
- **Company / Organization Preferences** — your organization's display name, company affinity,
  and a Stump Speech passed to the LLM with every Seek.

The retrieval half — how many documents reach the LLM and how closely they must match — is on
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/). The prompt and sampling
controls (temperature, top probability, penalties, maximum tokens) are on
[Prompt Engineering](/configuration/neural-config/prompt-engineering/).

## Why it matters

An LLM asked a question with poor source material still answers. The failure is quiet: a fluent,
plausible, wrong response. Many answer-quality problems are retrieval problems that look like
generation problems — the model wrote a reasonable paragraph out of the wrong documents. That is
why the product asks you to look at a real answer, and the documents behind it, before moving
anything.

Once the right documents arrive, the settings on this page decide what the reader actually gets:
an answer of the right length, in your organization's voice, with text you never want shown
removed or replaced.

Tuning is the wrong tool when the documentation does not answer the question at all. No setting
turns a missing passage into a present one; fix the source content first.

## When to use it

- A new deployment whose answers have never been reviewed.
- Answers that are too long or too short for where they are shown.
- Answers that should refer to your organization by name, or that need a fixed piece of standing
  context every time.
- KnowledgeBase content or answers that contain text you need stripped or swapped, such as phone
  numbers or e-mail addresses.
- Answers that pull in irrelevant documents — start on
  [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) instead.

## How it works

Every setting on this page lives in one dialog. On the Neural Config screen, select the
**Default Config / Answer Generation** node on the routing tree to open **Edit Configuration**.
The dialog holds one expandable section per configuration area; its footer carries
**Propose Changes** and **Save**. See
[Using this page](/configuration/neural-config/using-this-page/) for how saving and proposals
behave, and [Configuration overview](/configuration/overview/) for the routing tree itself.

### Diagnose on the Seek tab first

The **KnowledgeBase Tuning** section of the same dialog opens with the product's own tuning
advice, and it sets the order of work:

> Tuning your Knowledgebase is an important part of creating a well performing system. Start by
> entering a seek on the seek tab, and looking at the documentation in the accordions below the
> answer. For an answer that is not good - is the top document correct and complete? If not
> adjust snippet size and use the slider bars to do pushdown KB training on supported KB's. Are
> you bringing back more than you need (irrelevant docs) - set a max docs per seek or lower
> document score window.

![The KnowledgeBase Tuning section: the tuning paragraph above the Document Score Range and Max Documents per Seek sliders](/img/neural-config/knowledgebase-tuning--document-score-range.png)

So the loop is:

1. Ask the failing question on the [Seek](/seek/overview/) tab and look at the source documents
   listed under the answer.
2. If the top document is wrong or incomplete, the problem is retrieval. Work on
   [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) first.
3. If irrelevant documents come back with the right one, the paragraph's own advice applies: cap
   **Max Documents per Seek** or narrow **Document Score Range**. Both are documented in full on
   [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).
4. Once the right documents arrive, shape the answer with the two sections below.

Change one setting at a time, save, and ask the same question again. Changing three settings
together tells you nothing about which one moved the answer. How an answer is scored against its
sources is covered in [Semantic model tuning](/configuration/semantic-model/); the sampling
controls that change how the LLM phrases an answer are on
[Prompt Engineering](/configuration/neural-config/prompt-engineering/).

### Answer Engineering & Preferences

Expand **Answer Engineering & Preferences** in the Edit Configuration dialog. It opens with two
controls, followed by the regular-expression table described in the next section.

**How verbose should an average answer be?** is a slider with `Very Concise` at the left end and
`Very Verbose` at the right. It has no number, no value box and no help text beside it: you set a
position, not a value.

![The How verbose should an average answer be? slider, from Very Concise to Very Verbose](/img/neural-config/answer-engineering-preferences--verbosity.png)

The screen ties this slider to the length of what the LLM is asked to generate. The
**Prompt Engineering** section describes its Maximum Tokens slider as "Maximum Tokens. Adjust our
baseline (varies per answer verbosity) requested maximum tokens." So the verbosity position sets
the baseline token budget, and Maximum Tokens shifts that baseline up or down. Move the slider
toward `Very Concise` when answers are longer than the place they are shown can hold, toward
`Very Verbose` when they are too clipped to be useful, then re-ask the same question and compare.

<!-- UNCONFIRMED: a more concise verbosity, together with fewer documents per Seek, helps answers that time out — previous MkDocs tuning guide -->

If answers time out, a more concise setting is one of the levers to try, together with fewer
documents per Seek. The timeout itself is set in
[Platform Preferences](/configuration/neural-config/platform-preferences/).

**Force Answers from the Knowledgebase** is a list with two options, `True` and `False`. The
screen gives no help text for it; its label is the only on-screen description.

![The Force Answers from the Knowledgebase list, with its label underneath](/img/neural-config/answer-engineering-preferences--force-answers.png)

![The open Force Answers from the Knowledgebase list, with True ticked](/img/neural-config/answer-engineering-preferences--options-force-answers.png)

<!-- UNCONFIRMED: set Force Answers from the Knowledgebase to True so answers stay grounded in your KnowledgeBase — previous MkDocs tuning guide recommendation; no screen text or test shows what True or False changes in an answer -->

The previous tuning guide recommended `True`, to keep answers grounded in your KnowledgeBase
rather than the model's general knowledge. If you are unsure which your deployment needs, ask the
same off-topic question with each value (save between them) and compare the answers before
settling on one.

### Rewriting text with regular expressions

Below the two controls, the section holds a replacement table. The screen describes it in its own
words (spelling as shown):

> Answer Engineering uses Javascript Regular Expressions to selectivley replace text in both the
> KnowledgeBase training data and the live generated answer. Use this to remove or swap phone
> numbers, emails, etc...

![The Answer Engineering & Preferences section as it opens in the Edit Configuration dialog, with the verbosity slider and the Force Answers list; the regular-expression table sits further down the section](/img/neural-config/answer-engineering-preferences-panel.png)

The table has two named columns, **Regular Expression** and **Replacement**, and a third, unnamed
column that holds an icon button whose tooltip reads **Add a new row.** Select it to add a row.
Each row pairs a pattern to match with the text that takes its place. An empty table shows the
header row and a single row holding only that button.

Because the rewrite applies to the KnowledgeBase training data as well as to the generated answer,
a broad pattern changes what the LLM sees, not only what the reader sees. Keep patterns narrow,
and after you save, re-ask a question whose answer exercises the pattern.

:::caution
This is a text substitution you write and maintain yourself, not a detector. For finding and
masking personal data, use [PII detection](/governance/pii-detection/).
:::

### Company / Organization Preferences

Expand **Company / Organization Preferences** in the same dialog. It holds three fields that add
standing context to every Seek. They change answers without changing retrieval, which is why they
belong to tuning.

**Enter the company or organization display name** is a text box for the name of your company or
organization. There is no help text beside it. Fill it in with the name your answers should use.

![The display name text box with its label, Enter the company or organization display name](/img/neural-config/company-organization-preferences--display-name.png)

**Company Response Affinity** is a list. Its full on-screen label is its only explanation:
"Company Response Affinity (add affinity to the company on top of any affinity that may be already
present in your KnowledgeBase and Stump Speeches)". The screenshot below shows it set to
`Do not add affinity`; the list's other options are not documented here yet. Leave it at `Do not add affinity`
when your KnowledgeBase and Stump Speech already say what you want said about your company.

![The Company Response Affinity list showing Do not add affinity, with its full label](/img/neural-config/company-organization-preferences--response-affinity.png)

**Stump Speech** is a multi-line text box whose full label reads "Stump Speech. A block of text
that will be passed to the LLM on every single seek as part of the provided documentation." Its
placeholder, `ABC company is a great company that can help you do things.`, is grey example text,
not a value.

![The Company / Organization Preferences section: the display name box, the Company Response Affinity list and the Stump Speech box with its placeholder; the Embedding Models card above it is also in frame](/img/neural-config/company-organization-preferences-panel.png)

Use the Stump Speech for facts every answer should be able to draw on — who you are, what you
offer — without depending on retrieval to find them. Because it is passed as part of the provided
documentation on every Seek, it takes up part of that documentation on every call; keep it to a
few sentences the model must always have rather than a marketing paragraph.

### Starting points from the previous guide

<!-- UNCONFIRMED: the starting points below (Document Score Range 0.6–0.8, Max Documents per Seek 4–5, verbosity toward Very Concise, Force Answers True) — previous MkDocs tuning guide; no screen states them as defaults or recommendations -->

These starting points come from the previous tuning guide. They are not product defaults, and the
right values depend on your content.

| Setting                                  | Where                                                                      | Starting point     |
| ---------------------------------------- | -------------------------------------------------------------------------- | ------------------ |
| Document Score Range                     | [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) | 0.6 to 0.8         |
| Max Documents per Seek                   | [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) | 4 to 5             |
| How verbose should an average answer be? | Answer Engineering & Preferences                                           | toward Very Concise |
| Force Answers from the Knowledgebase     | Answer Engineering & Preferences                                           | True               |

### What is tuned elsewhere

Several things people reach for while tuning are documented on their own pages:

- Generating and curating questions and answers in bulk — [Answer curation](/seek/curation/).
- Serving one consistent answer instead of small wording variations — [Caching](/seek/caching/)
  and [Intent matching & caching](/configuration/neural-config/intent-matching-caching/).
- Narrowing a large corpus by metadata — [Dynamic filters](/seek/dynamic-filters/) and
  [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).
- Choosing between keyword, vector and hybrid search —
  [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/).
- Answering in a language your documents are not written in — [Language](/configuration/language/).
- Timeouts, context turns and other platform-wide behaviour —
  [Platform Preferences](/configuration/neural-config/platform-preferences/).
- Saving and restoring a known-good configuration before you experiment —
  [Backup, restore & change logs](/configuration/backup-restore/).

## FAQ

### How do I make answers shorter?

Move **How verbose should an average answer be?**, in **Answer Engineering & Preferences**, toward
`Very Concise`, save, and re-ask the same question. The slider has no numeric value. Per the
**Prompt Engineering** section's own text, verbosity sets the baseline for maximum tokens, which
that section's Maximum Tokens slider then adjusts — see
[Prompt Engineering](/configuration/neural-config/prompt-engineering/).

### Can I strip phone numbers or e-mail addresses from answers?

Yes. Add a row to the **Regular Expression** / **Replacement** table in **Answer Engineering &
Preferences** with **Add a new row.**, then save. The section's text says the rewrite applies to
"both the KnowledgeBase training data and the live generated answer", so the pattern changes what
the LLM sees as well as what the reader sees. For personal data, prefer
[PII detection](/governance/pii-detection/).

### What is a Stump Speech?

The screen describes it as "A block of text that will be passed to the LLM on every single seek as
part of the provided documentation." It lives in **Company / Organization Preferences**. Because
it is sent with every Seek, keep it to a short piece of standing context the model must always
have.

### Where do I change how many documents reach the LLM?

In the **KnowledgeBase Tuning** section of the same dialog: **Max Documents per Seek** caps the
number, and **Document Score Range** narrows which scores qualify. Both are documented on
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

### Should Force Answers from the Knowledgebase be True?

<!-- UNCONFIRMED: True is the recommended value — previous MkDocs tuning guide -->

The screen offers `True` and `False` with no help text. The previous tuning guide recommended
`True`; if you are unsure, compare the answer to the same off-topic question under each value
before you settle on one.
