---
title: "Semantic model tuning"
description: "Semantic Model Tuning is the modal behind a configuration's Guardrails dialog that holds six penalties and weights controlling how NeuralSeek calculates the semantic score of an answer."
---

## What is it

**Semantic Model Tuning** is a modal inside NeuralSeek's Guardrails settings. It holds six
penalties and weights that decide how the semantic score of an answer is calculated: how hard the
model is penalised for search terms it could not attribute to the KnowledgeBase, for stitching an
answer across many source documents, and for an LLM that declines to answer — plus how much the
answer's overall coverage counts on its own.

The settings act **after** an answer has been generated. They change the score the answer is
given, not the text the LLM produces. Each on-screen description begins with the words "After
scoring…" for exactly that reason.

The scoring model itself, and the toggles that switch it on and feed it into the confidence
guardrails, live one level up on the **Semantic Scoring** tab — see
[Semantic scoring](/governance/guardrails/semantic-scoring/).

## Why it matters

The semantic score is not decoration. On an instance where
"Use Semantic Score as the basis for Warning & Minimum confidence." is enabled, it is the number
your warning and minimum-confidence guardrails act on, so an answer scored too harshly can be
flagged, replaced or suppressed even though it was correct. With
"Rerank the search results based on the Semantic Match" enabled, the score also decides which
source document is treated as the top one.

That makes a badly tuned semantic model expensive in both directions: too strict and good answers
are held back, too lenient and hallucinated or thinly-sourced answers score well enough to pass
the guardrails untouched.

## When to use it

Reach for these settings when the **pattern** of scores is wrong, not when a single answer is:

- Answers are consistently correct but score low, and the analysis blames source jumps or missing
  key terms.
- Your documentation is fragmented, so legitimate answers routinely stitch across many documents.
- Long, heavily stitched answers score abnormally low, or short answers score higher than they
  deserve.
- A product or brand name that is genuinely not in your KnowledgeBase is being treated as a
  hallucinated term on every answer.

Do not start here. Semantic model tuning is a fine-tuning exercise **after** data preparation and
KnowledgeBase tuning, not a first resort — see [Tuning answers](/seek/tuning/). These values apply
to every answer the configuration produces, so a change made to rescue one question moves the
score of everything else too; change them one at a time and re-test broadly.

It is also the wrong tool when there is no semantic score to tune. Semantic scoring is not
available in cross-language use cases — the tab says so itself — so with **Cross Language** on
(see [Platform Preferences](/configuration/neural-config/platform-preferences/)) these settings
have nothing to act on.

## How it works

### Where semantic model tuning lives

On the **Neural Config** page, click a **Guardrails** node on the routing tree. A dialog opens
whose header names the configuration it belongs to — `Guardrails: Default Config` for the default
one — with **Semantic Scoring** as its first tab. The **Semantic Model Tuning** button is the last
control on that tab, a black button with a tune icon below the six toggles.

![The Semantic Scoring tab of the Guardrails dialog, with the Semantic Model Tuning button below the toggles](/img/neural-config/guardrails-panel.png)

Each configuration has its own Guardrails dialog, so the tuning values you open belong to the
configuration whose node you clicked, not to the instance as a whole.

:::note
Older documentation sends you to a "Governance and Guardrails" dropdown on a Configure tab. That
route no longer exists; guardrails are reached from a **Guardrails** node on the Neural Config
routing tree. The tab strip around it is described in
[Guardrails overview](/governance/guardrails/overview/).
:::

### The six settings

The modal is one list of six sliders. Each runs from 0% to 100% and carries a value box beside it;
the values below are the ones the modal showed on the instance these screenshots came from, not
documented product defaults, so read yours from the screen before you change anything.

![The Semantic Model Tuning modal: six sliders with their descriptions and values, and the allow-terms box underneath](/img/configuration/semantic-model/semantic-model-tuning.png)

| Setting                             | What the screen says it does                                                                                                                                                                                                             | Value seen |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **Missing key search term penalty** | "After scoring, this penalty is applied for answers that are missing KnowledgeBase attribution of proper nouns that were included in the search."                                                                                         | 0.4        |
| **Missing search term penalty**     | "After scoring, this penalty is applied for answers that are missing KnowledgeBase attribution of other nouns that were included in the search."                                                                                          | 0.25       |
| **Source Jump penalty**             | "When answers join across many source documents it can be an indication of lost meaning or intent, depending on your source documentation."                                                                                              | 3          |
| **LLM Decline Penalty**             | "When LLM answers seem to indicate the question is unrelated to the documentation, or refuses to answer, apply additional penalty to the semantic score."                                                                                 | 1          |
| **Total Coverage Weight**           | "Looking at the answer, how much weight should be given to the total coverage alone, regardless of other penalty. Increasing this helps prevent abnormally low scores from long highly stitched answers. Decreasing will better catch hallucination in short answers" | 0.25       |
| **ReRank min coverage %**           | "What is the minimum coverage of the total answer that the top used source document needs to be reranked over the top KB-scored document."                                                                                               | 0.25       |

Two things about the list are worth knowing before you drag a slider:

- **The value boxes do not read as percentages.** The slider ends are labelled 0% and 100% while
  the boxes hold plain numbers such as `3` and `1`. Treat a value as a relative weight and compare
  it against the value it had before your change, not against 100.
- **ReRank min coverage % only matters while reranking is on.** It is the threshold used by
  "Rerank the search results based on the Semantic Match" on the
  [Semantic scoring](/governance/guardrails/semantic-scoring/) tab; with that toggle off, nothing
  consumes it.

Underneath the sliders is a text box with no field label of its own. Its description reads "Words
or phrases to always allow in responses without penalty (nouns, named entities). Separate multiple
by comma." and it is prefilled with the example placeholder `myCoolProduct, myCoolProduct v2`.
This is where a product or brand name that your KnowledgeBase never mentions goes, so that it
stops counting as an unattributed term on every answer.

:::caution[The modal's Close is not a save]
The tuning modal closes with **Close**. The control that commits the change is **Save** on the
Guardrails dialog behind it — leave the dialog without it and the values you typed go with it.
:::

### Which setting to change for which symptom

The screen's own descriptions imply the direction of each change; the effect of a saved change was
not observed while writing this page, so re-test after every adjustment rather than trusting the
table.

- **Answers are penalised for terms your documentation does not contain** — add the term to the
  allow box rather than lowering **Missing key search term penalty** for everything. The two
  penalties differ only in what they cover: proper nouns for the key-term penalty, other nouns for
  **Missing search term penalty**.
- **Answers legitimately stitch across many documents** — lower **Source Jump penalty**. Raising
  it pushes the model towards answers cited from one or few documents, which suits tightly
  organised documentation.
- **Long, stitched answers score abnormally low** — raise **Total Coverage Weight**, which is what
  the screen says increasing it prevents.
- **Short answers score better than they should** — lower **Total Coverage Weight**; the screen
  says decreasing it "will better catch hallucination in short answers".
- **The wrong source document is being promoted** — adjust **ReRank min coverage %**, the share of
  the answer the top used document must cover before it outranks the top KB-scored document.

### Reading a semantic score before you tune it

Tune from evidence, not from a hunch. Ask the question on the **Seek** page and read what the
answer was actually scored on: the **Semantic Match** percentage below the answer, and the
plain-English analysis beside it naming what lowered the score — jumps between source articles, a
primary source that does not match the full answer, key terms with no reference behind them.

![A Seek answer scored at 14% Semantic Match, with the analysis naming source jumps and unbacked key terms](/img/configuration/semantic-model/hallucinated-term-chatgpt.png)

For the per-factor breakdown, the **Statistical Details** button on that panel opens the
**Semantic Score Details** modal. Both controls belong to the Seek page and are described with the
rest of the answer panel in [Tuning answers](/seek/tuning/).

Read that analysis first, change the one setting it points at, and ask the same question again.

## FAQ

### Where do I find Semantic Model Tuning?

On the **Neural Config** page: click a **Guardrails** node on the routing tree, stay on the
**Semantic Scoring** tab, and click **Semantic Model Tuning** at the bottom of the tab. It is not
under a Configure tab or a "Governance and Guardrails" dropdown — that path is from older
documentation.

### My answers are correct but the Semantic Match is low — what do I change?

Read the analysis under the answer first. If it names jumps between source articles, lower
**Source Jump penalty**. If it names key terms that were not backed by a reference, the two
attribution penalties — **Missing key search term penalty** for proper nouns and **Missing search
term penalty** for other nouns — are what charged the answer. If the answer is simply long and
stitched, raise **Total Coverage Weight**.

### How do I stop NeuralSeek penalising a product name that is not in my KnowledgeBase?

Add it to the text box below the sliders in the Semantic Model Tuning modal, which allows "words
or phrases to always allow in responses without penalty (nouns, named entities)", comma-separated.
Then save the Guardrails dialog — the modal's **Close** does not commit anything.

### Does tuning change the answer or only the score?

Only the score. All six settings are described as applied after scoring, so the LLM still
generates the same answer; what changes is the number it is given and, through **ReRank min
coverage %**, which source document is treated as the top one. Because the confidence guardrails
can be driven by that number, a scoring change can still alter what a user finally sees.

### Why do I get no semantic score at all?

Two reasons to check. Semantic scoring is off when "Enable the Semantic Score Model" is disabled
on the **Semantic Scoring** tab, and it is not available in cross-language use cases — so a
question answered with **Cross Language** on will not carry one either.

### How often should I change these values?

Rarely, and one at a time. They apply to every answer the configuration produces, so a change that
rescues one question moves the score of every other answer with it. Do data preparation and
[KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/) first, then adjust a
single setting and re-test a broad set of questions before the next one.
