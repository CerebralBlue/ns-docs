---
title: "Semantic scoring"
description: "The Semantic Scoring tab of the Guardrails dialog turns on NeuralSeek's semantic score, which rates each generated answer against its KnowledgeBase sources, and decides whether that score drives the confidence thresholds, reorders sources and removes unsupported sentences."
---

Semantic scoring checks every generated answer against the KnowledgeBase documents it was built from and gives the answer a score for how well those documents back it. The **Semantic Scoring** tab of the [Guardrails](/governance/guardrails/overview/) dialog holds six switches: one turns the score on, the other five decide what it is used for. Use this page when you want to block or flag answers that their sources do not support, show readers the document an answer actually came from, or strip unsupported sentences out of answers. How strict the score is gets set separately, in [Semantic model tuning](/configuration/semantic-model/).

## Where to find it

1. Open **Neural Config**. The routing tree shows a **Guardrails** node under **Default Config** and under each category that has a Custom Configuration (see [Configuration overview](/configuration/overview/)).
2. Select the **Guardrails** node for the configuration you want to change. The dialog opens with a title that names it, for example **Guardrails: Default Config**.
3. Stay on the **Semantic Scoring** tab.

The tab describes the model this way: "The Semantic Scoring model checks the generated answer against the KnowledgeBase sources and rates the answer based on the quantity and focus. Semantic scoring is not available in cross-laguage usecases."

Each **Guardrails** node keeps its own copy of these settings, so a category with a Custom Configuration can be scored differently from the default. Check the dialog title before you change anything.

## Settings

Each setting is a two-position **Disable** / **Enable** switch.

### Enable the Semantic Score Model

![The Guardrails: Default Config dialog on the Semantic Scoring tab: the tab description, the switches Enable the Semantic Score Model, Use Semantic Score as the basis for Warning & Minimum confidence., Rerank the search results based on the Semantic Match, Check document titles as part of the Semantic Match, Check document URL's as part of the Semantic Match and Remove sentences containing hallucinated key words, and the Semantic Model Tuning button below them](/img/neural-config/guardrails-panel.png)

| Setting                                                               | What it does                                                                                 | When to change it                                                                          |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Enable the Semantic Score Model**                                   | Computes a semantic score for every generated answer.                                        | Turn on whenever you want any of the other five settings, or the score itself, to apply.   |
| **Use Semantic Score as the basis for Warning & Minimum confidence.** | Makes the semantic score the number the warning and minimum-confidence thresholds check.     | Turn on to warn or block answers that their sources do not back.                           |
| **Rerank the search results based on the Semantic Match**             | Lets the document the answer drew on most move ahead of the one retrieval ranked first.      | Turn on when the source listed first should be the one the answer came from.               |
| **Check document titles as part of the Semantic Match**               | Counts a document's title, as well as its text, when matching the answer to its sources.     | Turn on when answers name things that appear only in document titles.                      |
| **Check document URL's as part of the Semantic Match**                | Counts a document's URL when matching the answer to its sources.                             | Turn on when meaningful terms live in your document URLs.                                  |
| **Remove sentences containing hallucinated key words**                | Removes, from the answer, sentences whose key words the sources do not contain.              | Turn on when an unsupported claim costs more than a sentence occasionally dropped wrongly. |

**Enable the Semantic Score Model** is the master switch. With it on, NeuralSeek compares each answer with the KnowledgeBase sources it was generated from and rates it on how much of the answer the sources cover and how focused it is on them. The result is the **Semantic Match** shown under each answer in the [Seek](/seek/overview/) tab and returned as `semanticScore` by the [REST `/seek` call](/integrations/rest-and-console-api/), next to the KnowledgeBase score that rates the documents against the question.

The other five settings all act on that score, so they only take effect while this switch is on. Score trends across many answers are on [Semantic analytics](/governance/semantic-analytics/), and the Governance landing dashboard summarises them (see [Seek overview dashboard](/governance/analytics/seek-overview/)).

### Use Semantic Score as the basis for Warning & Minimum confidence.

This setting connects the semantic score to two other tabs of the Guardrails dialog, both documented on [Minimum confidence](/governance/guardrails/min-confidence/):

- **Warning Confidence** — "Prepend a warning message to an answer, based on answer confidence." Its threshold is **Confidence % for warning**.
- **Min Confidence** — "Block low confidence results for uncategorized intents." Its threshold is **Minimum Confidence %**.

With the setting on, an answer whose semantic score falls below **Confidence % for warning** gets the warning prepended, and, for questions that match no intent, an answer whose semantic score falls below **Minimum Confidence %** is replaced by the minimum-confidence reply. Turn it on when the question you care about is whether the answer is backed by your documents, rather than whether relevant documents were found.

Because the score now decides which answers are warned or blocked, the penalties and weights in [Semantic model tuning](/configuration/semantic-model/) also change how many answers reach your users unchanged. Revisit both thresholds after you change the tuning.

### Rerank the search results based on the Semantic Match

Retrieval ranks documents by how well they match the question. The answer, though, may draw mostly on a document further down that list. With this setting on, the semantic match can move that document to the top, so the source listed first is the one the answer actually came from.

When a document moves is set by **ReRank min coverage %** in Semantic Model Tuning: "What is the minimum coverage of the total answer that the top used source document needs to be reranked over the top KB-scored document." The setting itself is documented on [Semantic model tuning](/configuration/semantic-model/).

### Check document titles and URLs

**Check document titles as part of the Semantic Match** and **Check document URL's as part of the Semantic Match** widen what counts as backed by a source: as their labels say, the document's title and its URL are matched against the answer as well as its text.

<!-- UNCONFIRMED: words in the answer that appear in a source's title or URL count as attributed; how titles and URLs are weighted in the score — inferred from the labels, no screen text or experiment shows it -->

Turn the title check on when answers legitimately use a name that appears only in page titles, such as a product name used as the title of its documentation page, and are scored down for it. The URL check does the same for terms that appear in your document addresses, such as a product or section name in the path.

### Remove sentences containing hallucinated key words

This setting changes the answer text itself, where the other settings change scores and ordering. With it on, sentences whose key words are not found in the KnowledgeBase sources are removed from the answer before it is returned.

To see what was removed from a given answer, look for the **Removed Sentences** line in the Seek tab: in the answer's **Semantic Analysis** row, select **Statistical Details** to open the **Semantic Score Details** window.

<!-- UNCONFIRMED: a correct sentence can be dropped when it uses a term the documents never contain — inferred from the label -->

The trade-off: unsupported claims disappear from answers, but a correct sentence can be dropped too when it uses a term your documents never contain, such as a product nickname or an acronym. The always-allowed terms in [Semantic model tuning](/configuration/semantic-model/) remove the score penalty for the words you list there, which may help with such terms.

### Semantic Model Tuning

The **Semantic Model Tuning** button at the bottom of the tab opens the penalties, weights and always-allowed terms that decide how strict the score is. The switches on this tab decide whether a score exists and what it drives; the tuning decides how an answer earns it. All of it is documented on [Semantic model tuning](/configuration/semantic-model/).

## Saving and cross-language answers

Changes on this tab take effect when you select **Save** in the Guardrails dialog footer. One **Save** keeps the changes on every tab of the dialog at once. To keep a change for review instead, or to roll one back, see [Using the Neural Config page](/configuration/neural-config/using-this-page/).

Semantic scoring does not run on answers generated across languages. The **Cross Language** setting in [Platform Preferences](/configuration/neural-config/platform-preferences/) says so in its own description: "Translate into the KB language when the KB language is different than the Seek Language. Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled." When Cross Language is on and a question arrives in a language other than the KnowledgeBase's, the six settings on this tab have no effect on that answer. For how NeuralSeek handles languages, see [Language handling](/configuration/language/).

## FAQ

### Why does an answer get a low semantic score when the documents match the question?

The two scores measure different things. The KnowledgeBase score rates the documents against the question; the semantic score rates the answer against the documents. An answer can be built from well-matched documents and still add, join or rephrase content they do not support. To make the score more or less strict, change [Semantic model tuning](/configuration/semantic-model/), not the switches on this tab.

### Will turning on "Use Semantic Score as the basis for Warning & Minimum confidence." block more answers?

Only when **Minimum Confidence %** or **Confidence % for warning** is set above **Disable**. The thresholds then check the semantic score, so an answer whose semantic score is lower than the confidence it was checked against before can now fall under a threshold: it gets the warning, or, for a question that matches no intent, the minimum-confidence reply. Set the thresholds on [Minimum confidence](/governance/guardrails/min-confidence/).

### Does semantic scoring work when users ask in a language other than the KnowledgeBase's?

Not when Cross Language translation is used. Its description says semantic scoring "will be automatically disabled" for cross-language response generation, so those answers carry no semantic score for these settings to act on.

### Can one category be scored differently from the rest?

Yes. A category with a Custom Configuration has its own **Guardrails** node, and with it its own copy of this tab. The dialog title tells you which configuration you are editing.

## Related

- [Guardrails overview](/governance/guardrails/overview/)
- [Semantic model tuning](/configuration/semantic-model/)
- [Minimum confidence](/governance/guardrails/min-confidence/)
- [Attribution protection](/governance/guardrails/attribution-protection/) — the other guardrail that checks answers against their sources
- [Seek overview](/seek/overview/)
- [Semantic analytics](/governance/semantic-analytics/)
- [Seek overview dashboard](/governance/analytics/seek-overview/)
