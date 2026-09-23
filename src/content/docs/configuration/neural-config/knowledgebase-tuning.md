---
title: "KnowledgeBase Tuning"
description: "KnowledgeBase Tuning is the Neural Config section that shapes what retrieval hands the LLM: how many documents a Seek returns, how they are scored, how many neighbouring chunks come with a match, how long query results are cached, and whether a mAIstro agent runs over them first."
---

## What is it

**KnowledgeBase Tuning** is the second section of the **Configuration: Default Config** dialog in Neural Config, directly under [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/). Where that section decides _which_ store NeuralSeek searches, this one decides _what comes back from it_. It holds eight controls: five sliders — **Document Score Range**, **Max Documents per Seek**, **Document Date Penalty**, **Expansion Window**, **KnowledgeBase Query Cache (minutes)** — a read-only **Max Raw Score** box with its **Reset Score** button, and the **mAIstro Post-KB Agent** selector.

Every control sits between the knowledge base and generation. None of them changes the documents themselves and none of them changes the prompt; they change the set of passages the LLM is given to answer from.

## Why it matters

An LLM answer is only as good as the documents handed to it. Too few and the answer is thin; too many and the relevant passage competes with noise, the prompt grows, and cost and latency rise with it. These sliders set the width of that pipe, and they are the first place to look when the documents behind an answer are wrong — the wrong ones, too many of them, or the right one cut off mid-passage.

They also carry the instance's retrieval cache. A question that has been asked recently can be answered from stored query results instead of a fresh search against the knowledge base, controlled by one slider on this screen.

Tuning is the wrong tool when the documents are already right. Open the Seek tab, ask the question, and read the documents in the accordions below the answer: if the correct passage is there, complete, and the answer is still wrong, no slider on this page will fix it. That is a generation problem, and it belongs to [Prompt Engineering](/configuration/neural-config/prompt-engineering/) or to the Answer Engineering controls covered on [Tuning answers](/seek/tuning/). Retrieval tuning answers the question "did the LLM get the right material?", nothing more.

## When to use it

- Answers cite documents that have nothing to do with the question.
- The right document is found, but the answer is missing the context that sits just before or after the matched passage.
- Seeks are slow or expensive because the instance retrieves more documents than an answer needs.
- The same questions are asked repeatedly and the knowledge base changes rarely, so repeated searches are wasted work.
- Old documents keep outranking newer ones on the same topic.
- Retrieved documents need to be filtered, re-ordered or rewritten by your own agent before the LLM sees them.

## How it works

### Where the section lives and how to tune

Open **Neural Config** and click the **Default Config** node in the routing tree. The **Configuration: Default Config** dialog opens as a list of accordion sections; **KnowledgeBase Tuning** is the second one, and clicking its header expands it inline. The dialog's footer carries **Propose Changes** and **Save** — nothing on this page takes effect until one of them is used.

![The Configuration: Default Config dialog with the KnowledgeBase Tuning section expanded below KnowledgeBase Connection: its tuning paragraph and the first four sliders, with Propose Changes and Save in the footer](/img/neural-config/knowledgebase-tuning.png)

The section opens with its own tuning method, which is the shortest description of how these controls are meant to be used:

> Tuning your Knowledgebase is an important part of creating a well performing system. Start by entering a seek on the seek tab, and looking at the documentation in the accordions below the answer. For an answer that is not good - is the top document correct and complete? If not adjust snippet size and use the slider bars to do pushdown KB training on supported KB's. Are you bringing back more than you need (irrelevant docs) - set a max docs per seek or lower document score window.

So the loop is: ask a question on the Seek tab, read the documents behind the answer, change one slider here, save, and ask again. [Tuning answers](/seek/tuning/) walks through that loop from the Seek side.

One thing to know before you look for it: the paragraph says "adjust snippet size", but there is no Snippet Size control in this section or anywhere else in the dialog on the captured build. The eight controls described below are all the section has.

### The retrieval sliders

Each slider has a **Slider value** box to its right: drag the handle or type the number. The two labels at the ends of each track are quoted below exactly as the screen draws them. The values given are the ones on the instance captured for this page, not product defaults. The image is the whole field group — the five sliders on the left and top right, and, below them, the score box and the agent selector described in the next two sections.

![The KnowledgeBase Tuning field group: Document Score Range, Max Documents per Seek, Document Date Penalty, Expansion Window and KnowledgeBase Query Cache (minutes) sliders with their values, the greyed Max Raw Score box with the Reset Score button, and the mAIstro Post-KB Agent selector reading Disabled](/img/neural-config/knowledgebase-tuning--document-score-range.png)

- **Document Score Range** — track `0%` to `100%`; value `0.8`. This is the "document score window" the tuning paragraph refers to: the band of relevance scores a document must fall in to be used. Narrowing it keeps only the stronger matches. The screen carries no help text and does not say how the decimal value maps onto the percentage scale drawn on the track.
  <!-- UNCONFIRMED: at 0.8 the window returns the top-scoring 80% of documents and discards the lowest 20% — the previous MkDocs page for this route; nothing on the captured screen explains the value -->
- **Max Documents per Seek** — track `Unlimited` to `30`; value `2`. A cap on how many documents one Seek may return. The left end of the track is the word `Unlimited`, not a number, so pulling the handle all the way down removes the cap rather than setting it to zero. This is the first control the section's own advice points at when a Seek brings back irrelevant documents. A probe run for this page, meant to count the sources a Seek returns against this cap, came back with no sources at all, so this capture does not verify the cap's effect.
- **Document Date Penalty** — track `0%` to `100%`; value `10`. A penalty applied on the basis of a document's date, so that older documents rank below newer ones on the same topic. The screen carries no help text and does not say what unit the value is in.
- **Expansion Window. How many chunks to grab before and after the target chunk.** — track `1` to `10`; value `10`. The label is the explanation: when a chunk of a document matches, this many neighbouring chunks are pulled in with it, so the LLM sees the passage in context rather than as a fragment.
  <!-- UNCONFIRMED: Expansion Window applies to the NeuralSeek KB only — the route's gap list; the captured instance is on KnowledgeBase Type "NeuralSeek KB" and no other type was captured, so the screen neither confirms nor denies it -->
- **KnowledgeBase Query Cache (minutes)** — track `Disabled` at the left end to `6000` at the right; on the instance captured for this page it reads `0`, with the handle on `Disabled`, so every Seek there runs a fresh KnowledgeBase query. The unit in the label is the point: this is how long a query result is kept before the store is searched again. `6000` is the maximum the track offers, not a default and not the current value. [Caching](/seek/caching/) owns the behaviour of this cache and of the two answer caches; the answer caches themselves sit on [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).

### Max Raw Score and Reset Score

Bottom right of the field group, next to the query-cache slider:

- **Max Raw Score** — a greyed, read-only box showing `0.1` on the instance captured here. It cannot be typed into, and the screen gives no help text for it.
  <!-- UNCONFIRMED: Max Raw Score is the highest all-time document score NeuralSeek has seen from the KB, used internally to calculate a 100% score — the previous MkDocs page for this route; the captured screen shows only the value -->
- **Reset Score** — the circular-arrow button beside the box; its accessible name is **Reset Score**. As the label says, it clears the stored score. It was not pressed during the capture for this page, so whether it takes effect immediately or only on **Save** is not verified here.

### mAIstro Post-KB Agent

Bottom left of the field group, **mAIstro Post-KB Agent** is a selector naming a mAIstro agent to run over the retrieved documents after retrieval and before generation — the place to filter, re-order or rewrite what the knowledge base returned before the LLM reads it. On the instance captured here it reads `Disabled`, and its list offers exactly two entries:

![The mAIstro Post-KB Agent dropdown open, listing Disabled (selected) and ex_postKBAgent](/img/neural-config/knowledgebase-tuning--options-maistro-post-kb-agent.png)

- `Disabled`
- `ex_postKBAgent`

`ex_postKBAgent` is the example agent shipped on the playground; the screen does not say what makes an agent eligible to appear in this list. This is one of NeuralSeek's pipeline hooks; the family of them — post-KB, post-seek, save and governance agents — is described under [Pipeline hooks](/maistro/ntl/pipeline-hooks/).

### Settings that are not in this section

- Which store is searched, and its connection fields: [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).
- The answer caches and intent matching: [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).
- Caching as a concept, across all three caches: [Caching](/seek/caching/).
- Working through a bad answer from the Seek tab: [Tuning answers](/seek/tuning/).
- Changing how the answer is written once the documents are right: [Prompt Engineering](/configuration/neural-config/prompt-engineering/).

## FAQ

### My answers cite irrelevant documents — what do I change first?

Follow the section's own advice: lower **Max Documents per Seek**, or narrow **Document Score Range** so weaker matches fall outside the window. Change one of them, save, re-run the same question on the Seek tab, and look at the documents behind the answer before touching the other.

### Is the KnowledgeBase query cache on?

On the instance captured for this page, **KnowledgeBase Query Cache (minutes)** reads 0 with the handle on **Disabled**, so no query results are being reused. `6000` is the right end of the track, the maximum the slider offers — not the current value and not a default. Check your own instance rather than assuming either number.

### What does Expansion Window do?

In the screen's own words: "How many chunks to grab before and after the target chunk." When a chunk matches the question, this many neighbouring chunks come with it, so the LLM reads the passage in context. The track runs from 1 to 10, and the instance captured here is set to `10`.

### Why can't I edit Max Raw Score?

It is read-only — a greyed box showing `0.1` on the instance captured here. The only action the screen offers for it is **Reset Score**, the button beside it, which clears the stored score.

### Where is the snippet size the tuning paragraph mentions?

Not in this section. The paragraph tells you to "adjust snippet size", but the captured build has no Snippet Size control under **KnowledgeBase Tuning**. How much text comes back per match is shaped here by **Expansion Window**; the fields that decide how documents are read belong with the store itself, on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

### The documents are right but the answer is wrong — is this the page?

No. If the Seek tab shows the correct passage, complete, behind a wrong answer, retrieval has done its job and the problem is generation. Look at [Prompt Engineering](/configuration/neural-config/prompt-engineering/) or the Answer Engineering controls on [Tuning answers](/seek/tuning/) instead.
