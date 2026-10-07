---
title: 'Tuning answers'
description: 'Tuning NeuralSeek answers means checking a real answer on the Seek tab, then shaping it with the Answer Engineering & Preferences and Company / Organization Preferences sections of Neural Config, after KnowledgeBase Tuning has the right documents reaching the LLM.'
---

Tuning is the work of getting better answers out of a KnowledgeBase that is already connected.
Every answer NeuralSeek generates is written from the passages the KnowledgeBase returns, so tuning
has two halves: controlling _which_ documentation reaches the LLM, and controlling _how_ the LLM
writes from it. This page gives the order of work and documents the settings that shape the answer
itself — its length, its grounding, text rewrites, and your company's identity.

## How answer tuning works

Every setting on this page is in the **Edit Configuration** dialog. On the Neural Config screen,
select the **Default Config / Answer Generation** node on the routing tree, then expand the section
you need. Nothing takes effect until you select **Save** at the foot of the dialog; see
[Using this page](/configuration/neural-config/using-this-page/) for how saving, proposals and
versions behave.

Change one setting at a time, save, and ask the same question again. Changing three settings
together tells you nothing about which one moved the answer.

### Start from a real answer

An LLM given poor source material still answers, fluently and wrongly. Many answer-quality problems
are retrieval problems that look like writing problems, so look at what the model was given before
you change how it writes. The **KnowledgeBase Tuning** section opens with the product's own advice,
and it sets the order of work:

> Tuning your Knowledgebase is an important part of creating a well performing system. Start by
> entering a seek on the seek tab, and looking at the documentation in the accordions below the
> answer. For an answer that is not good - is the top document correct and complete? If not
> adjust snippet size and use the slider bars to do pushdown KB training on supported KB's. Are
> you bringing back more than you need (irrelevant docs) - set a max docs per seek or lower
> document score window.

In practice:

1. Ask the failing question on the [Seek](/seek/overview/) tab and read the source documents listed
   under the answer.
2. If the top document is wrong or incomplete, the problem is retrieval: fix the content, or work
   on [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/), which sets how
   much of each document is retrieved.
3. If the right document is there but irrelevant ones come with it, send fewer documents (next
   section).
4. Once the right documents arrive, shape the answer with **Answer Engineering & Preferences** and
   **Company / Organization Preferences**.

### Send fewer, better documents

Two sliders in **KnowledgeBase Tuning** decide how much documentation reaches the LLM. They are
documented in full on [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/);
for tuning, this is what they are for:

- **Max Documents per Seek** (from `Unlimited` to `30`) caps how many documents are passed to the
  LLM. Lower it when answers pull in material from documents that have nothing to do with the
  question.
- **Document Score Range** (from `0%` to `100%`) is the "document score window" in the advice
  above: it keeps a share of the retrieved documents by score. Lower it to drop more of the
  low-scoring ones.

![The KnowledgeBase Tuning section: the tuning advice above the Document Score Range and Max Documents per Seek sliders](/img/neural-config/knowledgebase-tuning--document-score-range.png)

Change one of the two, then read the documents under the answer again before you touch the other: a
limit set too low can drop the document that holds the answer.

### Set answer length and grounding

Expand **Answer Engineering & Preferences**. Its first two controls decide how long an answer is
and whether it must come from your KnowledgeBase.

**How verbose should an average answer be?** is a slider from `Very Concise` to `Very Verbose`. You
set a position on the scale rather than a number. Move it toward `Very Concise` when answers are
longer than the place they are shown can hold — a chat bubble, a voice response — and toward
`Very Verbose` when they are too clipped to be useful.

![The How verbose should an average answer be? slider, from Very Concise to Very Verbose](/img/neural-config/answer-engineering-preferences--how-verbose-should-an-average-answer-be.png)

The slider changes how much text the LLM is asked to produce. The **Prompt Engineering** section
describes its own token setting as "Maximum Tokens. Adjust our baseline (varies per answer
verbosity) requested maximum tokens." — so verbosity sets the baseline token budget, and
[Prompt Engineering](/configuration/neural-config/prompt-engineering/) shifts that baseline up or
down. Set the verbosity first; adjust tokens there only if the baseline is still wrong, and note
that enabling Prompt Engineering ends support for the instance.

**Force Answers from the Knowledgebase** is a list with two options, `True` and `False`.

<!-- UNCONFIRMED: True adds extra prompting that pushes answers toward the returned documentation; keeping it enabled is generally best — previous MkDocs Configure page (ui/configure); no experiment has compared the two values -->

`True` adds extra prompting that pushes the answer toward the documentation the KnowledgeBase
returned, and keeping it on is the usual choice. To see what it changes on your own content, ask the
same off-topic question under each value, saving in between.

### Rewrite text with regular expressions

Below those two controls, **Answer Engineering & Preferences** holds a replacement table. The
section describes it in its own words (spelling as shown):

> Answer Engineering uses Javascript Regular Expressions to selectivley replace text in both the
> KnowledgeBase training data and the live generated answer. Use this to remove or swap phone
> numbers, emails, etc...

![The Answer Engineering & Preferences section: the verbosity slider, the Force Answers list, the explanation, and the Regular Expression and Replacement table with its add-row button](/img/neural-config/answer-engineering-preferences-panel.png)

To add a rewrite:

1. Select the **Add a new row.** button in the table's last column.
2. In **Regular Expression**, enter the JavaScript regular expression to match — for example a
   phone-number pattern.
3. In **Replacement**, enter the text that takes its place, such as a central support number.
   <!-- UNCONFIRMED: an empty Replacement removes the matched text — inferred from the section's "remove or swap" wording -->
   To remove the match instead of swapping it, leave **Replacement** empty.
4. Select **Save**, then re-ask a question whose answer exercises the pattern.

Because the rewrite applies to the KnowledgeBase training data as well as to the generated answer, a
broad pattern changes what the LLM sees, not only what the reader sees. Keep patterns narrow and
anchored to the text you mean.

:::caution
This is a text substitution you write and maintain yourself, not a detector. For finding and masking
personal data, use [PII detection](/governance/pii-detection/).
:::

### Give answers your company's identity

Expand **Company / Organization Preferences**. Its three fields tell NeuralSeek who your
organization is and how answers should treat it. They change answers without changing retrieval,
which is why they belong to tuning.

**Enter the company or organization display name** takes your organization's name as you want it to
appear — the company that the affinity setting below refers to.

<!-- UNCONFIRMED: the display name aligns user queries to the company KB, so "your product" targets this value — previous MkDocs Configure page (ui/configure), Company Name -->

It also gives "you" and "your" in a user's question a referent: "How do I use your product?" is read
as a question about this company.

**Company Response Affinity** is a list whose full label explains it: "Company Response Affinity
(add affinity to the company on top of any affinity that may be already present in your
KnowledgeBase and Stump Speeches)". It has two options:

- `Add company affinity` — leans answers toward your company, on top of whatever your documentation
  and Stump Speech already say about it.
- `Do not add affinity` — answers carry only the affinity that is already in your KnowledgeBase and
  Stump Speech.

![The open Company Response Affinity list: Add company affinity and Do not add affinity](/img/neural-config/company-organization-preferences--options-company-response-affinity-add-affinity-t.png)

Keep `Do not add affinity` when your own content already speaks for the company, and for neutral
uses such as an internal knowledge assistant. Choose `Add company affinity` for a customer-facing
assistant that should present your products favourably.

**Stump Speech** is a multi-line text box. Its label describes it as "A block of text that will be
passed to the LLM on every single seek as part of the provided documentation." The placeholder,
`ABC company is a great company that can help you do things.`, is an example, not a value.

![The Company / Organization Preferences section: the display name box, the Company Response Affinity list and the Stump Speech box with its example text](/img/neural-config/company-organization-preferences-panel.png)

Use the Stump Speech for facts every answer should be able to draw on — who you are, what you offer
— without depending on retrieval to find them. Because it travels with the documentation on every
Seek, it takes space from that documentation on every call: keep it to a few sentences the model
must always have, not a marketing paragraph.

## When to use it

- A new deployment whose answers have never been reviewed against their sources.
- Answers that are too long or too short for where they are shown.
- Answers that should refer to your organization by name, lean toward it, or rely on a fixed piece
  of standing context.
- KnowledgeBase content or answers containing text you need swapped or removed, such as phone
  numbers or e-mail addresses.

Tuning is the wrong tool when:

- **The documentation does not answer the question.** No setting turns a missing passage into a
  present one; add or fix the content first. Splitting long source documents so that each speaks to
  one subject is often the change that helps most.
- **You need one fixed answer to a known question.** Edit it in [Answer curation](/seek/curation/)
  or serve it from the [cache](/seek/caching/).
- **You want to stop weak answers from being shown.** That is a guardrail:
  [Minimum confidence](/governance/guardrails/min-confidence/) and
  [Semantic scoring](/governance/guardrails/semantic-scoring/).
- **You need to mask personal data.** Use [PII detection](/governance/pii-detection/).

## Starting points for a new deployment

<!-- UNCONFIRMED: the starting points below (Document Score Range 0.6–0.8, Max Documents per Seek 4–5, verbosity toward Very Concise, Force Answers True) — previous MkDocs tuning guide; no screen states them as defaults or recommendations -->

These starting points come from earlier tuning guidance. They are not product defaults, and the
right values depend on your content.

| Setting                                  | Section                                                                    | Starting point      |
| ---------------------------------------- | -------------------------------------------------------------------------- | ------------------- |
| Document Score Range                     | [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) | 0.6 to 0.8          |
| Max Documents per Seek                   | [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) | 4 to 5              |
| How verbose should an average answer be? | Answer Engineering & Preferences                                           | toward Very Concise |
| Force Answers from the Knowledgebase     | Answer Engineering & Preferences                                           | True                |

## FAQ

### My answers are long and wander — what do I change first?

Look at the documents under the answer on the Seek tab first. If several of them are irrelevant,
lower **Max Documents per Seek** or narrow **Document Score Range** in
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/). Then move **How verbose
should an average answer be?** toward `Very Concise`, save, and ask the same question again.

### Can I strip phone numbers or e-mail addresses from answers?

Yes. In **Answer Engineering & Preferences**, select **Add a new row.**, enter a JavaScript regular
expression in **Regular Expression** and the text to put in its place in **Replacement**, then save.
The rewrite applies to both the KnowledgeBase training data and the live generated answer. For
personal data in general, prefer [PII detection](/governance/pii-detection/).

### Where do I put text the LLM should always know about my company?

In **Stump Speech**, under **Company / Organization Preferences**. It is passed to the LLM on every
Seek as part of the provided documentation, so keep it short.

### Do my changes apply immediately?

Only after you select **Save** in the Edit Configuration dialog. Saving and proposing changes are
covered in [Using this page](/configuration/neural-config/using-this-page/).

## Related

- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)
- [Prompt Engineering](/configuration/neural-config/prompt-engineering/)
- [Seek overview](/seek/overview/)
- [Using this page](/configuration/neural-config/using-this-page/)
- [Answer curation](/seek/curation/)
- [PII detection](/governance/pii-detection/)
