---
title: "KnowledgeBase Tuning"
description: "KnowledgeBase Tuning is the section of Neural Config that shapes what retrieval hands the LLM — how many documents a seek returns, how strictly they are scored, how much text comes with each match, how long results are cached, and whether a mAIstro agent runs over them first."
---

## What is it

**KnowledgeBase Tuning** is the second section of the **Edit Configuration** accordion in Neural Config, under [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/). Where that section decides _which_ store NeuralSeek searches, this one decides _what comes back from it_: a set of sliders over the search results, a read-only score normalisation pair, and a hook for running a mAIstro agent over the retrieved documents before they reach the LLM.

Every control here sits between the knowledge base and generation. None of them changes the documents themselves, and none of them changes the prompt — they change the set of passages the LLM is given to answer from.

## Why it matters

An LLM answer is only as good as the documents handed to it. Too few documents and the answer is thin; too many and the relevant passage competes with noise, the prompt grows, and both cost and latency rise. These sliders are the width of that pipe, and they are the first place to look when an answer is wrong in a way the prompt cannot fix.

They also carry the instance's retrieval cache. A question that has been asked before can be answered from stored search results instead of a fresh query against the knowledge base — a large difference in response time, controlled by one slider on this screen.

## When to use it

- Answers cite documents that have nothing to do with the question.
- The right document is found, but the answer is missing the context that sits just before or after the matched passage.
- Seeks are slow or expensive, and the instance is retrieving more documents than an answer needs.
- The same questions are asked repeatedly and the knowledge base changes rarely, so repeated searches are wasted work.
- Old documents keep outranking newer ones on the same topic.
- Retrieved documents need to be filtered, re-ordered or rewritten by your own logic before the LLM sees them.

## How it works

### Where the section lives

Open **Neural Config**, click the **Default Config** node, then **Edit Configuration** in the dialog's footer. In the accordion that opens, expand **KnowledgeBase Tuning**. The dialog's footer carries **Propose Changes** and **Save** — nothing on this page takes effect until one of them is used.

![The Edit Configuration dialog with the KnowledgeBase Tuning section expanded: its explanatory paragraph, the Document Score Range and Max Documents per Seek sliders, and the start of Document Date Penalty and Expansion Window](/img/neural-config/kb-tuning.png)

The section opens with its own tuning method, which is the shortest description of how these controls are meant to be used:

> Tuning your Knowledgebase is an important part of creating a well performing system. Start by entering a seek on the seek tab, and looking at the documentation in the accordions below the answer. For an answer that is not good - is the top document correct and complete? If not adjust snippet size and use the slider bars to do pushdown KB training on supported KB's. Are you bringing back more than you need (irrelevant docs) - set a max docs per seek or lower document score window.

So the loop is: ask a question on the Seek tab, read the documents behind the answer, and change one slider here. [Tuning answers](/seek/tuning/) walks through that loop from the Seek side.

Note that "snippet size" is named in that paragraph but is not a control in this section — see the FAQ.

### The retrieval sliders

Each setting below is a slider with a **Slider value** box beside it; you can drag the slider or type the number. The two labels at the ends of the track are the range, and they are quoted below exactly as the screen draws them. The values given are the ones on the instance captured for this page, not product defaults.

- **Document Score Range** — range `0%` to `100%`; set to `0.8` here. This is the "document score window" the section paragraph refers to: the band of relevance scores a document must fall in to be used. Narrowing it keeps only the strongest matches. The screen gives no help text for it, and does not explain how the numeric value relates to the percentage scale drawn on the track.
- **Max Documents per Seek** — range `Unlimited` to `30`; set to `2` here. A hard cap on how many documents one seek may return. The left end of the track is the word `Unlimited`, not a number, so the low end of this slider removes the cap rather than setting it to zero. This is the first control the section's own advice points at when a seek brings back irrelevant documents.
- **Document Date Penalty** — range `0%` to `100%`; set to `10` here. A penalty applied on the basis of a document's date, so that older documents rank below newer ones on the same topic. The screen carries no help text explaining the units of the value.
- **Expansion Window. How many chunks to grab before and after the target chunk.** — range `1` to `10`; set to `10` here. The label is the explanation: when a chunk of a document matches, this is how many neighbouring chunks are pulled in with it, so the LLM sees the passage in context rather than a fragment.
  <!-- UNCONFIRMED: Expansion Window applies to the NeuralSeek KB only — the route's gap list; the captured instance is on KnowledgeBase Type "NeuralSeek KB" and no other type was captured, so the screen neither confirms nor denies it -->
- **KnowledgeBase Query Cache (minutes)** — range `Disabled` to `6000`; set to `0` here, which is the `Disabled` end of the track. How long the results of a knowledge base query are reused before the store is searched again. `6000` is the maximum the slider offers, not a default. This is the corporate KnowledgeBase cache described conceptually on [Caching](/seek/caching/); the caches that store _answers_ rather than search results are on [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).

The last three sliders, together with the controls in the next two subsections, sit below the fold of the dialog — scroll the accordion to reach them.

![The lower half of the KnowledgeBase Tuning section: Document Date Penalty, Expansion Window, KnowledgeBase Query Cache (minutes) with its Disabled-to-6000 track, the read-only Max Raw Score box with the Reset Score button, and the mAIstro Post-KB Agent selector](/img/neural-config/llm-details.png)

### Max Raw Score and Reset Score

- **Max Raw Score** — a read-only box showing `0.1` on the instance captured here. It is the highest raw document score the instance has seen, which the product normalises later scores against. It cannot be typed into.
- **Reset Score** — the reset button beside that box. It clears the stored high score, so normalisation starts again from the next seek. Treat it as a change to stored state rather than a display refresh: it discards a value the instance accumulated over every seek it has run.

Resetting is what you do after the content of the knowledge base changes enough that the old high-water mark no longer describes it — for example after a large re-ingest.

### mAIstro Post-KB Agent

At the bottom of the section, **mAIstro Post-KB Agent** is a selector naming a mAIstro agent to run over the retrieved documents after retrieval and before generation. It reads `Disabled` on the instance captured here, which is the only value this capture evidences — the option list was not opened, so this page cannot say which agents are offered or which value is the product default.

This is one of NeuralSeek's pipeline hooks; the family of them (post-KB, post-seek, save and governance agents) is described under [Pipeline hooks](/maistro/ntl/pipeline-hooks/).

### Settings that are not in this section

- Which store is searched, and its connection fields: [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).
- The answer caches and intent matching: [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/).
- Caching as a concept, across both sides: [Caching](/seek/caching/).
- Working through a bad answer from the Seek tab: [Tuning answers](/seek/tuning/).

## FAQ

### My answers pull in irrelevant documents — what do I change first?

Follow the section's own advice: lower **Max Documents per Seek**, or narrow **Document Score Range** so weaker matches fall outside the window. Change one of them, re-run the same question on the Seek tab, and look at the documents behind the answer before changing the other.

### Is the KnowledgeBase query cache on by default?

On the instance captured for this page, **KnowledgeBase Query Cache (minutes)** is `0` — the `Disabled` end of the slider — so no query results are being reused. `6000` is the other end of the range, the maximum the slider offers, not the current or default setting. Check your own instance rather than assuming either number.

### What is Max Raw Score, and why can't I edit it?

It is the highest raw document score this instance has recorded (`0.1` on the instance captured here), used to normalise the scores you see. It is read-only because the product maintains it; the only action available is **Reset Score**, which clears it.

### What does Expansion Window do?

In the screen's own words: "How many chunks to grab before and after the target chunk." When a chunk matches the question, this many neighbouring chunks come with it, so the LLM reads the passage in context. The slider runs from `1` to `10`, and is set to `10` on the instance captured here.

### Where is the snippet size the section's paragraph mentions?

Not in this section. The tuning paragraph tells you to "adjust snippet size", but the captured instance shows no Snippet Size control under **KnowledgeBase Tuning** — how much text comes back per match is shaped here by **Expansion Window**, and the fields that control how documents are read belong with the knowledge base itself; see [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

### Can I make a mAIstro agent filter documents before the LLM sees them?

Yes — that is what **mAIstro Post-KB Agent** is for. It names an agent that runs between retrieval and generation. It reads `Disabled` on the instance captured here, and this capture did not record which agents the selector offers, so check the list on your own instance. See [Pipeline hooks](/maistro/ntl/pipeline-hooks/) for what a post-KB agent can do.
