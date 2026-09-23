---
title: "Semantic model tuning"
description: "The Semantic Scoring tab of a configuration's Guardrails dialog switches NeuralSeek's semantic score model on, decides whether that score drives the Warning and Minimum confidence guardrails and reranking, and opens the Semantic Model Tuning modal that holds its penalties and weights."
---

## What is it

**Semantic Scoring** is the first tab of the **Guardrails** dialog that belongs to each
configuration on the Neural Config routing tree. The tab's own description is the shortest
definition of the feature:

> The Semantic Scoring model checks the generated answer against the KnowledgeBase sources and
> rates the answer based on the quantity and focus. Semantic scoring is not available in
> cross-laguage usecases.

(The spelling `cross-laguage` is the screen's.)

The tab holds six toggles and one button. The first toggle, **Enable the Semantic Score Model**,
switches the model on; the other five decide what the score feeds and what the match is allowed
to look at; the **Semantic Model Tuning** button opens the modal with the penalties and weights
behind the score. This page covers all of them. What the tab produces is a _score_ on an answer —
the `semanticScore` a Seek response carries — not a change to the answer text, with one exception
named below.

## Why it matters

The semantic score is the number NeuralSeek gives an answer for how well it is backed by the
KnowledgeBase passages it was generated from. On the playground, a Seek asked through the MCP
while the model was on came back with the score next to the KnowledgeBase score:

```text
"confidence": 18,
"KBscore": 100,
"semanticScore": 18,
```

(input: "How does NeuralSeek calculate the semantic score of an answer?", via the MCP)

Two toggles turn that number into behaviour. With **Use Semantic Score as the basis for Warning &
Minimum confidence.** on, it is the score the warning and minimum-confidence guardrails act on, so
a harshly scored answer can be flagged or held back even though it was correct. With **Rerank the
search results based on the Semantic Match** on, it also has a say in which source document is
treated as the top one. A badly tuned model is therefore expensive in both directions: too strict
and good answers are held back; too lenient and thinly sourced answers pass the guardrails
untouched.

## When to use it

Open this tab when you need to:

- turn the semantic score on or off for a configuration;
- decide whether the confidence guardrails judge answers by the semantic score;
- let the semantic match rerank the search results, or extend the match to document titles and
  URLs;
- strip sentences built on key words the KnowledgeBase never mentioned;
- adjust the penalties and weights behind the score, through **Semantic Model Tuning**.

It is the wrong tool in two cases. When **Cross Language** is `True` on
[Platform Preferences](/configuration/neural-config/platform-preferences/), there is no semantic
score to tune — both that setting's help text and this tab say semantic scoring is not available
cross-language. And when a single answer scores badly, read its analysis on the Seek tab first
(see [Tuning answers](/seek/tuning/)): the tuning values apply to every answer the configuration
produces, so a change made to rescue one question moves the score of everything else too.

The older documentation for this feature gave one piece of method advice: treat semantic model
tuning as a fine-tuning exercise after data preparation and
[KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/), not a first resort,
and change one value at a time before re-testing broadly. Nothing on the current screen confirms
or contradicts it — it is working advice carried over from that page, not a screen fact, and it
was not re-checked against the present product.

## How it works

![The Neural Config page with the Guardrails dialog open on its Semantic Scoring tab](/img/neural-config/guardrails.png)

### Where semantic scoring lives

On the **Neural Config** page, click a **Guardrails** node on the routing tree. A dialog opens
whose title names the configuration it belongs to — `Guardrails: Default Config` for the default
one — with **Semantic Scoring** already selected. The rest of the tab strip, in order, is
**Prompt Injection**, **PII**, **Profanity (HAP)**, **Attribution Protection**, **Warning
Confidence**, **Min Confidence**, **Min Text**, **Max Length** and **Custom Governance**; those
tabs are described from [Guardrails overview](/governance/guardrails/overview/), not here.

![The Guardrails: Default Config dialog on its Semantic Scoring tab: the tab strip, the intro paragraph, six toggles, the Semantic Model Tuning button and the Save bar](/img/neural-config/guardrails-panel.png)

The dialog's footer is a blue **Save** bar; the × in the title bar is **Close**. Nothing on this
page was saved while it was written.

The tree shows further **Guardrails** nodes under the categories of a multi-agent configuration,
so each node opens the dialog for its own configuration. Whether a category's tab starts from the
default configuration's values or from its own was not checked; read the toggles on the dialog
you actually opened.

:::note
Older documentation sends you to a "Governance and Guardrails" dropdown on a Configure tab. On
the current console the tab is reached from a **Guardrails** node on the Neural Config routing
tree.
:::

### The Semantic Scoring toggles

Each control on the tab is a checkbox drawn as a toggle whose text reads `Enable` when it is on
and `Disable` when it is off. The screen carries the labels only — there is no help text per
toggle — so what follows is the label, the value the playground showed, and what the label
implies.

![The six Semantic Scoring toggles under the tab's intro paragraph](/img/neural-config/guardrails-panel.png)

- **Enable the Semantic Score Model** — `Enable` on the playground. This is the switch the
  other five presuppose: they concern the score this one produces, so with it off there is
  nothing for them to act on.
- **Use Semantic Score as the basis for Warning & Minimum confidence.** — `Enable` on the
  playground (the trailing full stop is part of the label). "Warning & Minimum confidence" are two
  other tabs of the same dialog: **Warning Confidence**, whose controls are `Confidence % for
  warning` and `Prepend a warning on low confidence results`, and **Min Confidence**, described
  in [Minimum confidence](/governance/guardrails/min-confidence/). With this toggle on, those
  guardrails take the semantic score as their basis; which score they use when it is off is not
  stated on the screen.
- **Rerank the search results based on the Semantic Match** — `Enable` on the playground. The
  only text on the screen that says what threshold a rerank uses is the `ReRank min coverage %`
  description in the tuning modal (below).
- **Check document titles as part of the Semantic Match** — `Disable` on the playground. By its
  label, it lets the document title count towards the match as well as the passage text.
- **Check document URL's as part of the Semantic Match** — `Disable` on the playground (`URL's`
  as on screen). By its label, the same for the document URL.
- **Remove sentences containing hallucinated key words** — `Disable` on the playground. By its
  label this is the one toggle on the tab that changes what the user reads rather than a score:
  it drops sentences that rest on key words with no KnowledgeBase attribution. The behaviour was
  not observed while writing this page.

Whether a change to any toggle commits with the dialog's **Save** was not exercised; the Save bar
is the only commit control the dialog shows.

### Semantic Model Tuning

The last control on the tab is a black button labelled **Semantic Model Tuning** with a tune
icon. It opens a modal titled `Semantic Model Tuning` that lists the six settings behind the
score and closes with **Close**.

![The Semantic Model Tuning button at the bottom of the Semantic Scoring tab](/img/neural-config/guardrails-panel.png)

![Screenshot needed — the Semantic Model Tuning modal](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config > Guardrails node > Semantic Scoring tab > click "Semantic Model Tuning": the modal with its six settings, their controls and current values, and whatever sits below them. Why: the modal was never opened in this capture, so no image, value or control type is confirmed. -->

The modal was not opened for this page, so no value, control type or range is confirmed here —
read the current values from your screen. What the screen does carry, verbatim, is the name and
description of each setting:

- **Missing key search term penalty.** "After scoring, this penalty is applied for answers that
  are missing KnowledgeBase attribution of proper nouns that were included in the search."
- **Missing search term penalty.** "After scoring, this penalty is applied for answers that are
  missing KnowledgeBase attribution of other nouns that were included in the search."
- **Source Jump penalty.** "When answers join across many source documents it can be an
  indication of lost meaning or intent, depending on your source documentation."
- **LLM Decline Penalty.** "When LLM answers seem to indicate the question is unrelated to the
  documentation, or refuses to answer, apply additional penalty to the semantic score."
- **Total Coverage Weight.** "Looking at the answer, how much weight should be given to the total
  coverage alone, regardless of other penalty. Increasing this helps prevent abnormally low scores
  from long highly stitched answers. Decreasing will better catch hallucination in short answers"
- **ReRank min coverage %.** "What is the minimum coverage of the total answer that the top used
  source document needs to be reranked over the top KB-scored document."

The descriptions give the direction of each change. The two attribution penalties differ only in
what they cover — proper nouns for the key-term penalty, other nouns for the plain one. Lowering
**Source Jump penalty** suits documentation where legitimate answers routinely stitch across many
documents; raising it pushes towards answers cited from one or few. **Total Coverage Weight** goes
up when long, stitched answers score abnormally low and down when short answers score better
than they should. **ReRank min coverage %** only matters while **Rerank the search results based
on the Semantic Match** is on: it is the share of the answer the top used source document must
cover before it outranks the top KB-scored document.

<!-- UNCONFIRMED: below the six settings the modal has a text box described as "Words or phrases to always allow in responses without penalty (nouns, named entities). Separate multiple by comma." — old MkDocs page ("Allowed Terms") and the run-1204 page; not in any snapshot of this capture -->

Older documentation also describes an allowed-terms text box at the bottom of the modal, for
product or brand names that your KnowledgeBase never mentions and that should not count as
unattributed terms. It is not in this capture; check the modal on your screen.

The modal's own button is **Close** and the dialog behind it has **Save**, so the values you type
are most likely committed by the dialog's Save, not by closing the modal. That is read from the
structure of the two windows; the behaviour was not exercised.

### Cross Language

**Cross Language** lives on
[Platform Preferences](/configuration/neural-config/platform-preferences/) in the Edit
Configuration dialog, not on this tab, and it is the one setting elsewhere that switches semantic
scoring off regardless of the toggles above. Its help text: "Translate into the KB language when
the KB language is different than the Seek Language. Semantic Scoring is not possible on
Cross-language response generation, so it will be automatically disabled." It was `False` on the
playground.

![The Cross Language setting on Platform Preferences, with its help text and the value False](/img/neural-config/platform-preferences--cross-language.png)

How the KB and Seek languages are decided is on [Language handling](/configuration/language/).

### Reading the score on the Seek tab

The number these toggles produce is shown with each answer on the **Seek** page.

<!-- UNCONFIRMED: the Seek page's "Statistical Details" button opens a "Semantic Score Details" modal with the per-factor breakdown — old MkDocs page (semantic model tuning) and the pipeline's v2-run screen notes (conventions.md); the Seek tab is not in this capture -->

A **Statistical Details** button there is said to open the **Semantic Score Details** modal
with the per-factor breakdown. Neither belongs to this dialog and neither was captured for this
page, so treat those two names as unverified until the Seek tab is captured; the answer panel is
described in [Tuning answers](/seek/tuning/). Read that breakdown before changing a tuning value,
so the change targets the penalty that actually lowered the score.

## FAQ

### Where do I turn semantic scoring on?

On the **Neural Config** page, click the **Guardrails** node of the configuration. The dialog
opens on **Semantic Scoring**, and **Enable the Semantic Score Model** is its first toggle.

### Why is there no semantic score on my answers?

Two settings to check. Either **Enable the Semantic Score Model** is off on this tab, or
**Cross Language** is `True` on Platform Preferences — both screens say semantic scoring is not
available cross-language, and the Platform Preferences help text says it is disabled
automatically in that case.

### Does the semantic score change the answer text?

Only **Remove sentences containing hallucinated key words** touches the answer, by its label. The
other five toggles govern the score itself, whether it is the basis for the Warning and Minimum
confidence guardrails, and reranking — and the six tuning settings change the score, not the
text. A score change can still change what a user finally sees, because the confidence guardrails
act on it.

### What does "Use Semantic Score as the basis for Warning & Minimum confidence." do?

It makes the **Warning Confidence** and **Min Confidence** guardrails act on the semantic score.
The label says "basis for"; which score those tabs use when the toggle is off is not stated on
the screen.

### Where are the penalty values?

Behind **Semantic Model Tuning** at the bottom of the tab — six settings: missing key search term
penalty, missing search term penalty, source jump penalty, LLM decline penalty, total coverage
weight and ReRank min coverage %. Their current values are read from your screen; this page does
not list them.

### Do the toggles apply to every configuration?

Each **Guardrails** node on the routing tree opens the dialog for its own configuration — the
title says which, `Guardrails: Default Config` for the default one — so the toggles you set belong
to that configuration. Whether a category starts from the default's values was not checked.
