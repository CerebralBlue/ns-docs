---
title: "KnowledgeBase Tuning"
description: "KnowledgeBase Tuning is the Neural Config section that shapes what retrieval hands the LLM: how many documents a Seek uses, how they are scored and dated, how much text around a match comes with it, how long query results are cached, and whether a mAIstro agent processes them first."
---

KnowledgeBase Tuning controls what comes back from your knowledge base on each Seek and reaches the LLM: which documents are kept, how many, how much surrounding text comes with each match, whether a KnowledgeBase query result is cached, and whether a mAIstro agent works on the results first. [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) decides _which_ store NeuralSeek searches; this section decides _what it hands on_. Change it when the documents behind an answer are wrong: irrelevant, too many, out of date, or cut off before the detail the answer needs.

## Where to find KnowledgeBase Tuning

Open **Neural Config**, select the **Default Config / Answer Generation** node, then **Edit Configuration**, and expand **KnowledgeBase Tuning**, the second section of the dialog. To apply your changes, select **Save** at the bottom of the dialog. **Propose Changes** records them for review instead of applying them; [Using the Neural Config page](/configuration/neural-config/using-this-page/) explains both.

![The Configuration: Default Config dialog open over the Neural Config routing tree, with KnowledgeBase Tuning expanded under KnowledgeBase Connection and the Propose Changes and Save buttons at the bottom](/img/neural-config/knowledgebase-tuning.png)

## KnowledgeBase Tuning settings

Every slider has a number box to its right: drag the handle or type a value. The values in the images are one account's settings, not defaults or recommendations.

### How to tune retrieval

![KnowledgeBase Tuning expanded: the help paragraph, then Document Score Range, Max Documents per Seek, Document Date Penalty, Expansion Window, KnowledgeBase Query Cache (minutes), the read-only Max Raw Score box with the Reset Score button, and the mAIstro Post-KB Agent dropdown](/img/neural-config/knowledgebase-tuning--document-score-range.png)

The section opens with its own tuning advice:

> Tuning your Knowledgebase is an important part of creating a well performing system. Start by entering a seek on the seek tab, and looking at the documentation in the accordions below the answer. For an answer that is not good - is the top document correct and complete? If not adjust snippet size and use the slider bars to do pushdown KB training on supported KB's. Are you bringing back more than you need (irrelevant docs) - set a max docs per seek or lower document score window.

In practice that is a loop. Ask a question on the [Seek](/seek/overview/) tab, read the documents listed below the answer, change one setting here, save, and ask the same question again. Change one setting at a time, so you can tell which change made the difference. [Tuning answers](/seek/tuning/) walks through the same loop from the Seek side.

This section is the wrong place to look when the documents are already right. If the top document is correct and complete and the answer is still wrong, retrieval has done its job; see [Limits and interactions](#limits-and-interactions).

### Document Score Range, Max Documents per Seek and Document Date Penalty

These three sliders decide which of the retrieved documents are kept and how many go on to the LLM. They answer the help paragraph's question "Are you bringing back more than you need?".

<!-- UNCONFIRMED: Document Score Range keeps the top-scoring share of documents (0.8 or 80% keeps the top 80% and drops the lowest 20%; smaller = stricter; best set high together with Max Documents per Seek); Max Documents per Seek usually works best at 4–5; Document Date Penalty lowers the score of documents with old dates, more with age — old KnowledgeBase Tuning documentation (configuration/overview) -->

| Setting                    | Track                 | What it does                                                                                                                                                                                                           | When to change it                                                                                                                                                                       |
| -------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Document Score Range**   | `0%` to `100%`        | The document score window: which share of the retrieved documents, by score, is kept. For example, `0.8` (80 %) keeps the top-scoring 80 % and drops the lowest-scoring 20 %. The smaller the value, the stricter the cut. | Lower it when irrelevant documents come back. Keep it high and limit the count with **Max Documents per Seek** instead.                                                                 |
| **Max Documents per Seek** | `Unlimited` to `30`   | The most documents one Seek hands to the LLM. The left end of the track is `Unlimited`, so moving the handle all the way left removes the limit.                                                                       | Set it when more documents come back than an answer needs. Around 4 to 5 documents usually works well. Too low a limit can leave out the document that holds the answer, so check it on the Seek tab after the change. |
| **Document Date Penalty**  | `0%` to `100%`        | Lowers the score of documents that carry old dates. The higher the value, the bigger the penalty, and it grows with a document's age.                                                                                  | Raise it when outdated versions of a document keep winning over the current one. Keep it low when the age of your documents says nothing about their accuracy.                           |

### Expansion Window and Snippet size

These sliders decide how much text around a match reaches the LLM: they are what the help paragraph means by "adjust snippet size". Which one the section shows follows the **KnowledgeBase Type** you chose in KnowledgeBase Connection.

- **Expansion Window. How many chunks to grab before and after the target chunk.** is shown when KnowledgeBase Type is `NeuralSeek KB`. Its track runs from `1` to `10`: when a chunk of a document matches, this many neighbouring chunks of the same document before and after it come with it.
- **Snippet size** is shown in the same place for the other KnowledgeBase Types. Its help text reads: "Use this setting to window relevant details in a document that do not specifically mention the user question, but apply to it." The track runs from `100` to `1000`, or from `100` to `2000` when the type is `Watson Discovery`, `Watson Discovery (CP4D)`, `Virtual KB` or `No KnowledgeBase`.

![Screenshot pending: KnowledgeBase Tuning with a KnowledgeBase Type other than NeuralSeek KB, showing the Snippet size slider](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/knowledgebase-tuning@kb-pinecone--snippet-size.png — Neural Config > Default Config / Answer Generation > Edit Configuration, KnowledgeBase Type set to Pinecone (unsaved), KnowledgeBase Tuning expanded: crop the Snippet size slider with its 100–1000 track and number box. Why: the capture only expanded KnowledgeBase Tuning with NeuralSeek KB selected. -->

<!-- UNCONFIRMED: Snippet size is the character count passed to the KnowledgeBase as the passage size, generally best around 500 — old KnowledgeBase Tuning documentation (configuration/overview) -->

**Snippet size** is a character count: the length of the passage taken from each matching document. Around `500` usually works well.

Widen either setting when the right document is found but the answer misses a detail that sits next to the matched text, such as a condition in the following paragraph. Narrow it when answers pick up unrelated material from around the match, or when the prompt grows too long.

### KnowledgeBase Query Cache (minutes)

**KnowledgeBase Query Cache (minutes)** caches KnowledgeBase queries for the number of minutes you set, so a repeated query can be served from the cache instead of searching the knowledge base again. The track runs from `Disabled` at the left end to `6000` at the right; with the handle on `Disabled`, the number box reads `0` and nothing is cached.

Use it when the same questions arrive again and again against content that rarely changes. Keep it at `Disabled`, or short, when your documents change during the day: a cached result can be older than your latest content.

This cache is separate from the answer caches in [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/). [Caching](/seek/caching/) explains how the caches work together.

### Max Raw Score and Reset Score

<!-- UNCONFIRMED: Max Raw Score is the highest all-time document score NeuralSeek has seen from the KnowledgeBase, used to calculate a 100% document score; NeuralSeek maintains it — old KnowledgeBase Tuning documentation (configuration/overview) and a value change observed between two captures -->

**Max Raw Score** is a read-only box. It holds the highest raw document score NeuralSeek has seen from your knowledge base, which NeuralSeek uses as the reference for a 100 % document score. NeuralSeek maintains the value, so it can change without anyone editing it.

**Reset Score**, the icon button beside the box, resets **Max Raw Score**.

### mAIstro Post-KB Agent

![The mAIstro Post-KB Agent dropdown open, with Disabled selected and an agent listed below it](/img/neural-config/knowledgebase-tuning--options-maistro-post-kb-agent.png)

**mAIstro Post-KB Agent** picks a [mAIstro](/maistro/overview/) agent that runs after the KnowledgeBase search, on the retrieved documents. The list holds:

| Option                | What choosing it does                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `Disabled`            | No agent runs; the KnowledgeBase results go on as retrieved.                                                            |
| The name of an agent  | That agent processes the retrieved documents on every Seek. The list shows the mAIstro agents offered for this step.   |

Selecting an agent changes what the answer is built from: the same question can come back citing different documents, and framed differently. What a given agent does depends on how you build it.

<!-- UNCONFIRMED: the post-KB agent works on the documents before the LLM writes the answer — the route's gap list -->

The agent works on the results before the LLM writes the answer.

## Limits and interactions

- **KnowledgeBase Type decides the passage slider.** Expansion Window appears with `NeuralSeek KB`; every other type shows Snippet size in its place. Switching the type in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) switches the slider.
- **The query cache is not the answer cache.** [KnowledgeBase Query Cache (minutes)](#knowledgebase-query-cache-minutes) keeps KnowledgeBase query results; the answer caches are set in Intent Matching & Cache. When a Seek keeps returning outdated content, check both.
- **Retrieval first, then the answer.** When the top document under a Seek answer is correct and complete but the answer is still wrong, the fix is in generation: [Prompt Engineering](/configuration/neural-config/prompt-engineering/) or [Tuning answers](/seek/tuning/). How retrieved passages are re-ranked against the answer is covered in [Semantic model tuning](/configuration/semantic-model/).

## FAQ

### Irrelevant documents keep reaching the answer. What do I change?

Follow the section's own advice: set **Max Documents per Seek**, or lower **Document Score Range**. Change one of them, save, ask the same question on the Seek tab, and read the documents below the answer before you touch the other.

### Why don't I see Expansion Window?

Expansion Window is shown when **KnowledgeBase Type** in KnowledgeBase Connection is `NeuralSeek KB`. With any other type, the section shows **Snippet size** in the same place.

### How do I turn off the KnowledgeBase query cache?

Move **KnowledgeBase Query Cache (minutes)** to its left end, `Disabled`, and save. The number box reads `0`.

## Related

- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
- [Tuning answers](/seek/tuning/)
- [Caching](/seek/caching/)
- [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/)
- [Semantic model tuning](/configuration/semantic-model/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/)
