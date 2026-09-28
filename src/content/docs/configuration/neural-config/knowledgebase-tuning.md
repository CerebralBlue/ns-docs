---
title: "KnowledgeBase Tuning"
description: "KnowledgeBase Tuning is the Neural Config section that shapes what retrieval hands the LLM: how many documents a Seek uses, how they are scored and dated, how much text around a match comes with it, how long query results are cached, and whether a mAIstro agent processes them first."
---

## What is it

**KnowledgeBase Tuning** is the second section of the **Configuration: Default Config** dialog in Neural Config, directly under [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/). KnowledgeBase Connection decides _which_ store NeuralSeek searches; KnowledgeBase Tuning decides _what comes back from it_ and reaches the LLM.

The section holds:

- five sliders, each with a number box: **Document Score Range**, **Max Documents per Seek**, **Document Date Penalty**, **KnowledgeBase Query Cache (minutes)**, and either **Expansion Window** or **Snippet size**, depending on your **KnowledgeBase Type**;
- a read-only **Max Raw Score** box with a **Reset Score** button beside it;
- the **mAIstro Post-KB Agent** dropdown.

None of these controls edits your documents or the prompt. They change the set of passages the LLM is given to answer from.

## Why it matters

An answer can only be as good as the documents behind it. With too few, the answer is thin; with too many, the relevant passage competes with noise and the prompt grows. The controls in this section are the first place to look when the documents behind an answer are wrong: the wrong ones, too many of them, stale ones, or the right one cut off mid-passage.

This section is the wrong tool when the documents are already right. Ask the question on the Seek tab and read the documents in the accordions below the answer. If the correct passage is there, complete, and the answer is still wrong, retrieval has done its job and no control here will fix it. That is a generation problem: look at [Prompt Engineering](/configuration/neural-config/prompt-engineering/) or at [Tuning answers](/seek/tuning/).

## When to use it

- Answers cite documents that have nothing to do with the question.
- The right document is found, but the answer misses a detail that sits next to the matched passage.
- Older documents keep winning over newer ones on the same topic.
- The same questions arrive again and again against a knowledge base that rarely changes.
- You want your own mAIstro agent to process the retrieved documents before the LLM sees them.

Use a different section when the problem is elsewhere:

- Which store is searched, and its connection fields: [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).
- The answer caches and intent matching: [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/). How all the caches relate: [Caching](/seek/caching/).
- How the answer is written once the documents are right: [Prompt Engineering](/configuration/neural-config/prompt-engineering/).

## How it works

### The section's own guidance

Open **Neural Config** and click the **Default Config** node in the routing tree. The **Configuration: Default Config** dialog lists its sections as accordions; click **KnowledgeBase Tuning** to expand it. The dialog's footer carries **Propose Changes** and **Save**, which are described on [Using this page](/configuration/neural-config/using-this-page/).

![The Configuration: Default Config dialog with KnowledgeBase Tuning expanded under KnowledgeBase Connection, showing the section's help paragraph, the first sliders, and the Propose Changes and Save footer](/img/neural-config/knowledgebase-tuning-panel.png)

The section opens with its own instructions:

> Tuning your Knowledgebase is an important part of creating a well performing system. Start by entering a seek on the seek tab, and looking at the documentation in the accordions below the answer. For an answer that is not good - is the top document correct and complete? If not adjust snippet size and use the slider bars to do pushdown KB training on supported KB's. Are you bringing back more than you need (irrelevant docs) - set a max docs per seek or lower document score window.

So the test surface is the Seek tab: ask a question, open the accordions below the answer, and check whether the top document is correct and complete. Change one control here, save, and ask the same question again. [Tuning answers](/seek/tuning/) walks through that loop from the Seek side.

Each slider has a number box to its right: drag the handle or type a value. The track end labels below are quoted as the screen draws them. The screen states no default for any of these controls, so the values in the images are examples, not recommendations.

### Document Score Range and Max Documents per Seek

![The KnowledgeBase Tuning field group: Document Score Range, Max Documents per Seek, Document Date Penalty, Expansion Window, KnowledgeBase Query Cache (minutes), the greyed Max Raw Score box with the Reset Score button, and the mAIstro Post-KB Agent dropdown](/img/neural-config/knowledgebase-tuning--document-score-range.png)

These two controls are the section's answer to "bringing back more than you need (irrelevant docs)".

**Document Score Range** is the "document score window" of the help paragraph. Its track runs from `0%` to `100%`, and the number box beside it holds a decimal, such as `0.8`. The screen does not say how the decimal relates to the percentage track, nor how the window is applied to the scores of the retrieved documents. What the help paragraph does say is when to move it: when irrelevant documents come back, "lower document score window".

**Max Documents per Seek** has a track that runs from `Unlimited` at the left end to `30` at the right. The left end is the word `Unlimited`, not a number, so pulling the handle all the way left removes the limit rather than setting it to zero. The help paragraph's advice for irrelevant documents is to "set a max docs per seek".

![The Max Documents per Seek slider: Unlimited at the left end, 30 at the right, with its number box](/img/neural-config/knowledgebase-tuning--max-documents-per-seek.png)

The Seek response does not report how many documents the limit let through: there is no document count in the answer. Check the effect on the Seek tab instead. Ask the same question before and after the change, count the documents in the accordions below the answer, and make sure the document that holds the answer is still among them. A limit set too low can leave that document out.

### Document Date Penalty

![The Document Date Penalty slider: 0% to 100%, with its number box](/img/neural-config/knowledgebase-tuning--document-date-penalty.png)

**Document Date Penalty** has a track from `0%` to `100%` and a number box that holds a whole number. The screen carries no help text for it, and does not state the unit of the box: the value `10` in the image puts the handle at the right-hand end of the track, so the box does not read as a percentage.

<!-- UNCONFIRMED: Document Date Penalty lowers the score of older documents so newer ones rank higher — background notes for this route; no help text on screen -->

Raise it when outdated versions of a document keep winning over the current one, and leave it low when the age of your documents says nothing about their accuracy. Which date of a document it reads is not shown on the screen.

### Expansion Window and Snippet size

![The Expansion Window slider, shown when KnowledgeBase Type is NeuralSeek KB: 1 to 10, with its number box](/img/neural-config/knowledgebase-tuning--expansion-window-how-many-chunks-to-grab.png)

This slot holds one of two sliders, depending on the **KnowledgeBase Type** chosen in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/). Both decide how much text around a match reaches the LLM; they are what the help paragraph means by "adjust snippet size".

- **Expansion Window. How many chunks to grab before and after the target chunk.** Shown when **KnowledgeBase Type** is `NeuralSeek KB`. The track runs from `1` to `10`. The label is the control's own help text: when a chunk of a document matches, this many neighbouring chunks before and after it come with it.
- **Snippet size. Use this setting to window relevant details in a document that do not specifically mention the user question, but apply to it.** Shown in the same place for every other KnowledgeBase Type: ElasticSearch, watsonx Discovery, Pinecone, Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, OpenSearch, Kendra, Bedrock, IBM CAS, Milvus, Postgres, ChromaDB, Virtual KB and No KnowledgeBase. The track runs from `100` to `1000`, or from `100` to `2000` when the type is `Watson Discovery`, `Watson Discovery (CP4D)`, `Virtual KB` or `No KnowledgeBase`. The screen does not state the unit.

![Screenshot needed — KnowledgeBase Tuning with a KnowledgeBase Type other than NeuralSeek KB, showing the Snippet size slider](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/knowledgebase-tuning@kb-pinecone--snippet-size.png — Neural Config > Default Config node > Configuration: Default Config, KnowledgeBase Type set to Pinecone (unsaved), KnowledgeBase Tuning expanded: crop the Snippet size slider with its 100–1000 track and number box. -->

Widen either one when the right document is found but the answer misses a detail next to the matched text, such as a condition in the following paragraph. Narrow it when answers pick up unrelated material from around the match, or when prompts grow too long.

### KnowledgeBase Query Cache (minutes)

![The KnowledgeBase Query Cache (minutes) slider: Disabled at the left end, 6000 at the right, with its number box](/img/neural-config/knowledgebase-tuning--knowledgebase-query-cache-minutes.png)

**KnowledgeBase Query Cache (minutes)** has a track from `Disabled` at the left end to `6000` at the right, and its value is in minutes. With the handle on `Disabled` the number box reads `0`. `6000` is the top of the track, not a default.

<!-- UNCONFIRMED: the query cache keeps a KnowledgeBase query result for the set number of minutes, so a later Seek needing the same material skips the search; what it stores is not described on screen — the Caching page (seek/caching), itself marked unconfirmed there -->

Keep it at `Disabled` or short when your documents change during the day, because a cached result can be older than your latest content. This cache is separate from the answer caches in [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/); [Caching](/seek/caching/) explains how they work together.

### Max Raw Score and Reset Score

Both controls sit to the right of **KnowledgeBase Query Cache (minutes)** in the field-group image above.

- **Max Raw Score** is a greyed, read-only box holding a long decimal. You cannot type into it and the screen gives no help text. NeuralSeek maintains the value: it can change between two visits to the dialog without anyone editing it, so do not read meaning into a particular number.
  <!-- UNCONFIRMED: Max Raw Score is the highest raw document score seen from the KnowledgeBase, used to normalise document scores to 100% — the route's gap list in the migration map; the screen shows only the value -->
- **Reset Score** is the icon button beside the box. This page does not describe its effect.

### mAIstro Post-KB Agent

![The mAIstro Post-KB Agent dropdown open: Disabled, selected, and one agent listed below it](/img/neural-config/knowledgebase-tuning--options-maistro-post-kb-agent.png)

**mAIstro Post-KB Agent** runs a mAIstro agent over the retrieved documents before they reach the LLM. The dropdown lists:

- `Disabled`: no agent runs, and the retrieval results go to the LLM unchanged.
- Agent names: the chosen agent processes the retrieved documents on each Seek. The list in the image shows one agent below `Disabled`; yours lists agents from your own account.

Selecting an agent changes what the answer is built from. The same question asked with an agent selected, and then with `Disabled`, comes back with different cited sources, lower document scores and a differently framed answer. What any particular agent does depends on how you write it. For writing such an agent, start from [Pipeline hooks](/maistro/ntl/pipeline-hooks/).

## FAQ

### My answers cite irrelevant documents — what do I change first?

Follow the section's own advice: set **Max Documents per Seek**, or lower **Document Score Range**. Change one of them, save, ask the same question on the Seek tab, and read the documents below the answer before touching the other.

### Why don't I see Expansion Window?

It depends on the **KnowledgeBase Type** in KnowledgeBase Connection. Expansion Window is shown when the type is `NeuralSeek KB`; every other type shows **Snippet size** in the same place.

### How do I check what Max Documents per Seek did?

On the Seek tab. The answer does not report how many documents were used, so ask the question and count the documents in the accordions below the answer, before and after the change.

### Can I edit Max Raw Score?

No. The box is read-only and NeuralSeek maintains its value, which can change on its own. **Reset Score** is the button beside it.

### What does a mAIstro Post-KB Agent change?

It processes the retrieved documents before the LLM sees them. With an agent selected, the same question can come back citing different sources, with different document scores and a different answer. `Disabled` passes the retrieval results through unchanged.

### The documents are right but the answer is wrong — is this the section?

No. If the Seek tab shows the correct passage, complete, behind a wrong answer, the problem is in generation. Look at [Prompt Engineering](/configuration/neural-config/prompt-engineering/) or [Tuning answers](/seek/tuning/).
