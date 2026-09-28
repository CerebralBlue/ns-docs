---
title: "Semantic model tuning"
description: "The Semantic Model Tuning modal, opened from the Semantic Scoring tab of a configuration's Guardrails dialog, holds the six penalties and weights and the always-allowed terms that decide how NeuralSeek's semantic score rates an answer against its KnowledgeBase sources."
---

## What is it

The semantic score is NeuralSeek's rating of how well a generated answer is backed by the
KnowledgeBase passages it was built from. The **Semantic Scoring** tab of a configuration's
**Guardrails** dialog defines it in one line:

> The Semantic Scoring model checks the generated answer against the KnowledgeBase sources and
> rates the answer based on the quantity and focus. Semantic scoring is not available in
> cross-laguage usecases.

(The spelling `cross-laguage` is the screen's.)

The tab switches the model on and decides what the score feeds. **Semantic model tuning** is the
layer underneath: a button at the bottom of the tab, **Semantic Model Tuning**, opens a modal that
holds the settings the score is computed with — four penalties, a coverage weight, a rerank
threshold, and a box of words that are never penalised. This page covers that modal, and names the
tab's toggles only as far as they decide whether the modal has any effect.

A Seek response carries the result as `semanticScore`, next to the `KBscore` of the retrieved
documents.

## Why it matters

When **Use Semantic Score as the basis for Warning & Minimum confidence.** is on, the semantic
score is the number the warning and minimum-confidence guardrails compare against their
thresholds. When **Rerank the search results based on the Semantic Match** is on, it also has a
say in which source document counts as the top one. The penalties in the tuning modal are
therefore not cosmetic: set them too harshly and correct answers get a warning prepended or are
replaced by the minimum-confidence reply; set them too leniently and thinly sourced answers pass
the guardrails untouched.

The values apply to every answer the configuration produces. That is the reason to tune them
deliberately, one value at a time, and the reason not to use them to rescue a single question.

## When to use it

Open **Semantic Model Tuning** when you see a pattern across many answers:

- correct answers keep scoring low because they combine several documents, or because a
  question names a product or person your documents spell differently;
- short answers score higher than their sources justify;
- answers that legitimately use a term your KnowledgeBase never contains — a product name, a
  competitor, a named entity — are marked down for it;
- you want to change how much of the answer the top used source must cover before it is
  reranked over the top KB-scored document.

It is the wrong tool in three cases. When **Cross Language** is `True` on
[Platform Preferences](/configuration/neural-config/platform-preferences/) and the question's
language differs from the KB's, the answer comes from cross-language generation, semantic scoring
is disabled for it, and nothing in the modal acts. When the problem is one answer, look at that answer first
(see [Tuning answers](/seek/tuning/)), because a value changed here moves every score the
configuration produces.

<!-- UNCONFIRMED: semantic model tuning is a fine-tuning step after data preparation and KnowledgeBase tuning, not a first resort; change sparingly and re-test broadly — the old MkDocs "Semantic model tuning" page (Conclusions) -->

And when the KnowledgeBase itself is the problem: treat these settings as a last fine-tuning step
after data preparation and [KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/),
change them sparingly, and re-test broadly after each change.

## How it works

### Where semantic scoring lives

On the **Neural Config** page, click a **Guardrails** node on the routing tree. A dialog opens
whose title names the configuration it belongs to — `Guardrails: Default Config` for the default
one — with the **Semantic Scoring** tab selected. The tree carries further **Guardrails** nodes
under its categories; each node opens the dialog for its own configuration, so each configuration
has its own semantic scoring settings.

![The Guardrails: Default Config dialog over the Neural Config routing tree, open on the Semantic Scoring tab](/img/neural-config/guardrails.png)

The rest of the tab strip, in order, is **Prompt Injection**, **PII**, **Profanity (HAP)**,
**Attribution Protection**, **Warning Confidence**, **Min Confidence**, **Min Text**, **Max
Length** and **Custom Governance**; those tabs are described from the
[Guardrails overview](/governance/guardrails/overview/). The dialog's footer is a blue **Save**
bar; the × in its title bar is **Close**.

### The Semantic Scoring toggles

The tab holds six toggles, each a switch whose text reads `Enable` when it is on and `Disable`
when it is off. They are documented on [Semantic scoring](/governance/guardrails/semantic-scoring/);
here is what each means for tuning.

![The Semantic Scoring tab: the intro paragraph, the six toggles and the Semantic Model Tuning button](/img/neural-config/guardrails--guardrails.png)

- **Enable the Semantic Score Model** — switches the score on. While it is off there is no
  semantic score, so nothing in the tuning modal has anything to act on.
- **Use Semantic Score as the basis for Warning & Minimum confidence.** (the full stop is part of
  the label) — makes the **Warning Confidence** and **Min Confidence** guardrails use this score.
  With it on, the penalties below decide which answers cross those two thresholds.
- **Rerank the search results based on the Semantic Match** — lets the semantic match reorder the
  source documents. Its threshold is **ReRank min coverage %** in the modal.
- **Check document titles as part of the Semantic Match** — the screen gives the label only.
- **Check document URL's as part of the Semantic Match** — the screen gives the label only
  (`URL's` as on screen).
- **Remove sentences containing hallucinated key words** — the screen gives the label only.

### Opening Semantic Model Tuning

The last control on the tab is a black button labelled **Semantic Model Tuning**, with a tune
icon. It opens a modal titled `Semantic Model Tuning` over the Guardrails dialog.

![The Semantic Model Tuning modal: six sliders with their descriptions and number boxes, the allow-terms box and the Close bar](/img/neural-config/semantic-model-tuning.png)

Every slider in the modal has the same parts: a description line that starts with the setting's
name, a track labelled `0%` at the left and `100%` at the right, and a number box holding the
value. Set the value in the number box and read it there. Do not infer the unit from the track
labels: in the screenshot the **Source Jump penalty** box holds `3` and the **LLM Decline
Penalty** box holds `1` while both tracks still read 0% to 100%, so the boxes are not all
percentages. The values shown are one configuration's, not defaults.

The modal closes with the × at the top or the blue **Close** bar at the bottom; it has no Save of
its own. The Guardrails dialog behind it keeps its **Save** bar, which is the only commit control
on screen.

<!-- UNCONFIRMED: values changed in the Semantic Model Tuning modal are kept only once the Guardrails dialog's Save is pressed — inferred from the layout (the modal has only Close; the dialog behind it has Save); not exercised -->

Save the Guardrails dialog after changing values in the modal, then re-test.

### Missing key search term penalty

![The Missing key search term penalty slider, its 0% to 100% track and its number box](/img/neural-config/semantic-model-tuning--0.png)

**Missing key search term penalty** — the screen's description: "After scoring, this penalty is
applied for answers that are missing KnowledgeBase attribution of proper nouns that were included
in the search."

It targets proper nouns: a product, company or person named in the question that the answer uses
but its sources do not back. As guidance drawn from that description: raise it when answers that
drift away from the named thing in the question should score lower; lower it when correct answers
keep losing points over a proper noun your documents spell differently. For a specific term that
should never count against an answer, the allow-terms box below is the narrower fix.

### Missing search term penalty

![The Missing search term penalty slider, its 0% to 100% track and its number box](/img/neural-config/semantic-model-tuning--0-2.png)

**Missing search term penalty** — "After scoring, this penalty is applied for answers that are
missing KnowledgeBase attribution of other nouns that were included in the search."

The same check as the key-term penalty, for the question's other nouns — the ones that are not
proper nouns. The two can be set independently, so a configuration can be strict about names and
lenient about general vocabulary, or the reverse.

### Source Jump penalty

![The Source Jump penalty slider, its 0% to 100% track and its number box](/img/neural-config/semantic-model-tuning--0-3.png)

**Source Jump penalty** — "When answers join across many source documents it can be an
indication of lost meaning or intent, depending on your source documentation."

It penalises answers stitched together from many documents. The description's
"depending on your source documentation" is the decision point.

<!-- UNCONFIRMED: lower Source Jump penalty when good answers must combine many documents; raise it to favour citations from one or few documents — the old MkDocs "Semantic model tuning" page -->

Lower it when your documentation is split so that good answers routinely combine many documents;
raise it to favour answers cited from one or a few documents.

### LLM Decline Penalty

![The LLM Decline Penalty slider, its 0% to 100% track and its number box](/img/neural-config/semantic-model-tuning--0-4.png)

**LLM Decline Penalty** — "When LLM answers seem to indicate the question is unrelated to the
documentation, or refuses to answer, apply additional penalty to the semantic score."

This one looks at the answer's tone rather than its sources: an answer in which the LLM declines
or says the question is off-topic is pushed further down. With **Use Semantic Score as the basis
for Warning & Minimum confidence.** on, a higher value makes such answers more likely to fall
below the **Min Confidence** threshold and be replaced by that guardrail's reply; a lower value
lets them through with less of a drop.

### Total Coverage Weight

![The Total Coverage Weight slider, its 0% to 100% track and its number box](/img/neural-config/semantic-model-tuning--total-coverage-weight-looking-at-the-ans.png)

**Total Coverage Weight** — "Looking at the answer, how much weight should be given to the total
coverage alone, regardless of other penalty. Increasing this helps prevent abnormally low scores
from long highly stitched answers. Decreasing will better catch hallucination in short answers"

The description is its own tuning guide. Coverage is how much of the answer its sources account
for; this weight decides how much that figure counts on its own, before the penalties above.
Increase it when long answers built from many documents score abnormally low; decrease it when
short answers score better than their sources justify.

### ReRank min coverage %

![The ReRank min coverage % slider, its 0% to 100% track and its number box](/img/neural-config/semantic-model-tuning--rerank-min-coverage-what-is-the-minimum-.png)

**ReRank min coverage %** — "What is the minimum coverage of the total answer that the top used
source document needs to be reranked over the top KB-scored document."

The top KB-scored document is the one retrieval ranked first; the top used source is the leading
document among those the answer actually drew on. This value is how much of the answer that used source must cover
before it is moved above the KB's first pick. Reading the two labels together, it matters only
while **Rerank the search results based on the Semantic Match** is on. A higher value reranks
less often; a lower value lets the semantic match override retrieval more readily.

### Words or phrases to always allow

![The allow-terms text box with its placeholder and the label beneath it](/img/neural-config/semantic-model-tuning--words-or-phrases-to-always-allow-in-resp.png)

The last field in the modal is a text box labelled **Words or phrases to always allow in
responses without penalty** — in full: "Words or phrases to always allow in responses without
penalty (nouns, named entities). Separate multiple by comma." Its placeholder shows the format:
`myCoolProduct, myCoolProduct v2`.

Put here the nouns and named entities your answers legitimately use but your KnowledgeBase does
not contain — a product name, a version, a competitor — so they stop counting as unsupported
terms. It is narrower than lowering a penalty: the penalties keep working for every other term.

### Warning Confidence and Min Confidence

**Warning Confidence** and **Min Confidence** are two other tabs of the same Guardrails dialog,
and the two guardrails that **Use Semantic Score as the basis for Warning & Minimum confidence.**
points at. Their controls are documented on
[Minimum confidence](/governance/guardrails/min-confidence/) and from the
[Guardrails overview](/governance/guardrails/overview/). For this page, what matters is the
connection: each has a threshold, and the tuning values decide which answers fall under it.

![The Warning Confidence tab: "Prepend a warning message to an answer, based on answer confidence.", the Confidence % for warning slider and the warning text](/img/neural-config/warning-confidence--confidence-for-warning.png)

![The Min Confidence tab: "Block low confidence results for uncategorized intents." and the Minimum Confidence % slider with the controls below it](/img/neural-config/min-confidence--minimum-confidence.png)

After a tuning change, check both thresholds against a few representative questions: a harsher
penalty can push answers that used to pass under **Confidence % for warning** or
**Minimum Confidence %**.

### Cross Language

**Cross Language** is a `True` / `False` setting on
[Platform Preferences](/configuration/neural-config/platform-preferences/) in the Edit
Configuration dialog, not on this tab. Its help text: "Translate into the KB language when the KB
language is different than the Seek Language. Semantic Scoring is not possible on Cross-language
response generation, so it will be automatically disabled."

![The Cross Language setting on Platform Preferences with its help text](/img/neural-config/platform-preferences--cross-language.png)

With **Cross Language** set to `True`, a question in a language other than the KB's is answered
through cross-language generation, semantic scoring is switched off for it, and nothing on this
page acts on that answer. How the KB and Seek languages are decided is on
[Language handling](/configuration/language/).

## FAQ

### Where are the semantic score penalties?

On the **Neural Config** page, click the configuration's **Guardrails** node; the dialog opens on
**Semantic Scoring**. The **Semantic Model Tuning** button at the bottom of that tab opens the
modal with the six sliders and the allow-terms box.

### Correct answers get a low semantic score because they combine several documents. What do I change?

Two settings. **Source Jump penalty** is the penalty for joining across many source documents —
lower it. **Total Coverage Weight** says of itself that increasing it "helps prevent abnormally
low scores from long highly stitched answers". Change one, save, and re-test before touching the
other.

### How do I stop a product name being treated as unsupported?

Add it to **Words or phrases to always allow in responses without penalty** in the tuning modal,
separating several terms with commas (the placeholder shows `myCoolProduct, myCoolProduct v2`).

### Why does nothing I tune here change my scores?

Check that **Enable the Semantic Score Model** is on for the configuration you are testing — each
**Guardrails** node has its own — and that **Cross Language** on Platform Preferences is `False`.
Cross-language generation disables semantic scoring automatically.

### Is there a Save in the tuning modal?

No. The modal has only **Close** (the × and the blue bar). The Guardrails dialog behind it has
**Save**, and that is the only commit control on screen, so save the dialog after changing values
in the modal.

### Are the numbers in the modal percentages?

Not all of them. Every track reads `0%` to `100%`, but some number boxes hold values such as `3`
or `1`. Read and set each value in its number box rather than from the track.
