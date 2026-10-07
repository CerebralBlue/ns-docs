---
title: "Semantic model tuning"
description: "Semantic model tuning sets the four penalties, two weights and the always-allowed terms that decide how NeuralSeek's semantic score rates a generated answer against the KnowledgeBase sources it was built from."
---

The semantic score is NeuralSeek's rating of how well a generated answer is backed by the
KnowledgeBase passages it came from. The **Semantic Model Tuning** settings decide how that score
is computed: how much an answer loses for nouns its sources do not back, for stitching many
documents together or for declining to answer, and which terms never count against it. Tune them
when correct answers keep scoring low, or weak answers keep scoring high, across many questions —
the values apply to every answer the configuration produces.

## How semantic model tuning works

### Where the tuning lives

The tuning belongs to a configuration's guardrails. On [Neural Config](/configuration/neural-config/),
select the configuration's [**Guardrails**](/governance/guardrails/overview/) node. The dialog that opens is titled after the
configuration (`Guardrails: Default Config` for the default one) and starts on the **Semantic
Scoring** tab, which describes the model this way: "The Semantic Scoring model checks the
generated answer against the KnowledgeBase sources and rates the answer based on the quantity and
focus."

![The Guardrails: Default Config dialog on the Semantic Scoring tab, with six toggles and the Semantic Model Tuning button below them](/img/neural-config/guardrails-panel.png)

The six toggles on that tab decide whether a score is computed and what it is used for:
**Enable the Semantic Score Model**, **Use Semantic Score as the basis for Warning & Minimum
confidence.**, **Rerank the search results based on the Semantic Match**, **Check document titles
as part of the Semantic Match**, **Check document URL's as part of the Semantic Match** and
**Remove sentences containing hallucinated key words**. Each is explained on
[Semantic scoring](/governance/guardrails/semantic-scoring/). The tuning only matters while
**Enable the Semantic Score Model** is on — with it off there is no score for the settings to
shape.

To open the tuning, select **Semantic Model Tuning** at the bottom of the tab. A **Semantic Model
Tuning** window opens over the Guardrails dialog. Because each **Guardrails** node opens the
dialog for its own configuration, check the dialog title before you change anything.

### The score on an answer

Each Seek answer carries two scores. **KnowledgeBase Confidence** rates how well the retrieved
documents match the question; **Semantic Match** rates how well the answer itself is backed by
those documents. In the [Seek](/seek/overview/) tab both appear as rows under the answer; the REST
response returns them as `KBscore` and `semanticScore`.

The two can disagree. Asked `What is semantic scoring in NeuralSeek?`, NeuralSeek returned a
`KBscore` of 100 and a `semanticScore` of 25: the documents matched the question fully, yet the
answer was rated as only partly backed by them. A gap like this is what the tuning works on.
Trends across many answers are on [Semantic analytics](/governance/semantic-analytics/).

Before you change a value, find out what lowered the score. In the answer's **Semantic Analysis**
row, select **Statistical Details**. The **Semantic Score Details** window lists Semantic Match %,
Source Jumps, Standard Deviation, Top Source Coverage, Total Coverage, Normalized Answer Length,
Longest Phrase, Unattributed Key Terms, Unattributed Terms, Unattributed Numbers and Removed
Sentences.

<!-- UNCONFIRMED: mapping of Semantic Score Details lines to tuning settings (Unattributed Key Terms → Missing key search term penalty, Unattributed Terms → Missing search term penalty, Source Jumps → Source Jump penalty, Total Coverage → Total Coverage Weight) — inferred from the names and the old MkDocs "Semantic model tuning" page -->

Match the line to a setting: Unattributed Key Terms to **Missing key search term penalty**,
Unattributed Terms to **Missing search term penalty**, Source Jumps to **Source Jump penalty**,
and a low Total Coverage on a long answer to **Total Coverage Weight**. Change that setting, save,
and ask the same question again.

### The penalties

Four penalties lower the score when an answer shows a sign of weak backing. Each has a description
that starts with its name, a slider whose track is labelled `0%` to `100%`, and a number box beside
the track that shows the value.

![The Semantic Model Tuning window: four penalties and two weights, each with a track and a number box, and the allowed-terms box below them](/img/neural-config/semantic-model-tuning.png)

| Setting                             | What the penalty is for (the screen's description)                                                                                                                         | When to lower it                                                                   |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Missing key search term penalty** | "After scoring, this penalty is applied for answers that are missing KnowledgeBase attribution of proper nouns that were included in the search."                          | Correct answers lose points over product, company or person names in the question. |
| **Missing search term penalty**     | "After scoring, this penalty is applied for answers that are missing KnowledgeBase attribution of other nouns that were included in the search."                           | Correct answers lose points over the question's general vocabulary.                |
| **Source Jump penalty**             | "When answers join across many source documents it can be an indication of lost meaning or intent, depending on your source documentation."                               | Good answers in your content routinely combine several documents.                  |
| **LLM Decline Penalty**             | "When LLM answers seem to indicate the question is unrelated to the documentation, or refuses to answer, apply additional penalty to the semantic score."                   | Declining answers are replaced by the minimum-confidence reply more often than you want (see below). |

Raise a penalty to be stricter about its cause. The two missing-term penalties can be set
independently, so a configuration can be strict about names and lenient about general vocabulary,
or the reverse. The track labels do not describe the scale of every number box, so read and
compare values in the boxes, not by the position of the slider.

**LLM Decline Penalty** looks at the answer's tone rather than its sources: an answer in which the
LLM declines, or says the question is off-topic, is pushed further down. With **Use Semantic
Score as the basis for Warning & Minimum confidence.** on, a higher value makes such answers more
likely to fall below the [Minimum confidence](/governance/guardrails/min-confidence/) threshold,
where that guardrail's reply replaces them; a lower value lets them through with less of a drop.

<!-- UNCONFIRMED: lower Source Jump penalty when good answers must stitch many documents; raise it to favour answers from one or few documents — old MkDocs "Semantic model tuning" page -->

The **Source Jump penalty** depends most on how your documentation is split: lower it when
answers usually have to stitch many documents together, and raise it to favour answers drawn from
one or a few documents.

### The weights

Two more settings in the same window balance the penalties against how much of the answer its
sources cover.

- **Total Coverage Weight** — "Looking at the answer, how much weight should be given to the
  total coverage alone, regardless of other penalty. Increasing this helps prevent abnormally low
  scores from long highly stitched answers. Decreasing will better catch hallucination in short
  answers". Increase it when long answers built from many documents score abnormally low;
  decrease it when short answers score better than their sources justify.
- **ReRank min coverage %** — "What is the minimum coverage of the total answer that the top used
  source document needs to be reranked over the top KB-scored document." The top KB-scored
  document is the one retrieval ranked first; the top used source is the leading document among
  those the answer drew on. A higher value reranks less often, a lower value lets the semantic
  match override retrieval more readily. It works together with **Rerank the search results based
  on the Semantic Match** on the Semantic Scoring tab.

### Terms that are never penalised

Some terms legitimately appear in answers but never in your documents — a product name, a
version, a competitor. The box at the bottom of the window, **Words or phrases to always allow in
responses without penalty (nouns, named entities). Separate multiple by comma.**, takes those
terms; its placeholder shows the format, `myCoolProduct, myCoolProduct v2`.

![The allowed-terms box with its placeholder and its label](/img/neural-config/semantic-model-tuning--words-or-phrases-to-always-allow-in-resp.png)

An allowed term is narrower than a lower penalty: the penalties keep working for every other
term, so add the name here before you lower **Missing key search term penalty** for everyone.

### Saving the tuning

The tuning window has only **Close**. To keep your changes, close the window, then select
**Save** in the Guardrails dialog behind it. How a save becomes a version of the configuration,
and how to propose a change for review instead, is on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

## When to use it

Open **Semantic Model Tuning** when you see the same pattern across many answers:

- correct answers keep scoring low because they combine several documents, or because the
  question names a product or person your documents spell differently;
- short answers score higher than their sources justify;
- answers that rightly use a term your KnowledgeBase never contains are marked down for it;
- answers are warned or blocked by Minimum confidence and the warning guardrail more or less often than they should be, and **Use Semantic Score as
  the basis for Warning & Minimum confidence.** is on.

It is the wrong tool in three cases:

- **One answer is wrong.** A value here moves every score the configuration produces; look at that
  answer first with [Tuning answers](/seek/tuning/).
- **The answer is generated across languages.** With **Cross Language** on in
  [Platform preferences](/configuration/neural-config/platform-preferences/), NeuralSeek
  translates into the KB language when it differs from the Seek language, and "Semantic Scoring
  is not possible on Cross-language response generation, so it will be automatically disabled."
  The tuning has no effect on those answers. See [Language handling](/configuration/language/).
- **Retrieval brings back the wrong documents.** Fix the content and
  [KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/) first.

<!-- UNCONFIRMED: semantic model tuning is a last fine-tuning step after data preparation and KnowledgeBase tuning; change sparingly and re-test broadly — old MkDocs "Semantic model tuning" page -->

Treat semantic model tuning as the last step after data preparation and KnowledgeBase tuning:
change one value at a time, and re-test a broad set of questions after each change.

## FAQ

### A correct answer gets a low semantic score. What do I change?

Find which penalty applies — proper nouns from the question, other nouns, many source documents,
or an answer that declines — and lower that one. If the cause is a single term your documents
never contain, add it to the allowed-terms box instead. For long answers stitched from many
documents, **Total Coverage Weight** is the other setting to try.

### Does tuning change which answers are warned or blocked?

Only when **Use Semantic Score as the basis for Warning & Minimum confidence.** is on in the
Semantic Scoring tab. Then the semantic score is what the warning and
[minimum confidence](/governance/guardrails/min-confidence/) thresholds are compared against, and
a harsher penalty can push answers under them.

### Where do I save the tuning?

In the Guardrails dialog. The tuning window has only **Close**; close it and select **Save** in
the dialog behind it.

### Why does tuning change nothing for some answers?

Check that **Enable the Semantic Score Model** is on in the configuration you are testing — each
**Guardrails** node has its own settings — and that the answer is not generated across languages,
where semantic scoring is not available.

## Related

- [Semantic scoring](/governance/guardrails/semantic-scoring/) — the six toggles on the Semantic
  Scoring tab
- [Guardrails overview](/governance/guardrails/overview/) — every tab of the Guardrails dialog
- [Minimum confidence](/governance/guardrails/min-confidence/) — the thresholds the semantic score
  can feed
- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — saving and
  proposing changes
- [Seek](/seek/overview/) and [Semantic analytics](/governance/semantic-analytics/) — where the
  score is shown
- [Language handling](/configuration/language/) — cross-language answers
