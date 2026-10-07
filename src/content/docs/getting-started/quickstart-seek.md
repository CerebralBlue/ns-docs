---
title: "Quickstart: Seek"
description: "Ask your first question on the NeuralSeek Seek page and read what comes back: the generated answer, the KnowledgeBase sources behind it, and the scores that say how far to trust it."
---

This quickstart takes you to your first grounded answer in NeuralSeek. You open the **Seek** page, type a question, press **Seek**, and read the result: the generated answer, the list of KnowledgeBase documents it was built from, and a table of scores and timings for that one question. Use it when you have just connected a KnowledgeBase, or when you want to see which of your documents answer a question your users actually ask.

An answer on its own does not tell you whether it is safe to show to a user. The Seek page puts the answer next to the sources it came from and the scores NeuralSeek calculated for it, so you can check it rather than trust it. For deeper topics, see [Tuning answers](/seek/tuning/), [Caching](/seek/caching/), [Curation](/seek/curation/) and [Personalization](/seek/personalization/). For how Seek fits with the KnowledgeBase, mAIstro and curation, see [Core concepts](/getting-started/concepts/).

## Before you begin

Seek answers from the KnowledgeBase your instance is connected to. If no KnowledgeBase is connected, there is nothing to answer from: set one up in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) first.

## Step 1: Open Seek

Select **Seek** in the navbar at the top of any console page.

![The console navbar with Seek selected](/img/home/navbar.png)

## Step 2: Ask a question

![Seek page: the question box, the English language selector, the Seek, Personalize and Filter buttons, the answer, and the Session Options panel](/img/home/seek.png)

1. Type your question in the search box. The × at its right end clears it.
2. Check the language dropdown next to it — it shows **English** when English is selected. It sets the language of the question.
3. Press **Seek**. The answer appears below the toolbar.

You do not need the other two toolbar buttons for a first question:

- **Personalize** passes details about the user asking, so the answer can be tailored — see [Personalization](/seek/personalization/).
- **Filter** narrows which KnowledgeBase documents the question is answered from — see [Dynamic filters](/seek/dynamic-filters/).

### Session Options

![The Session Options panel: User ID, Session, Session Turns, Provenance and Streaming toggles, and the Configuration dropdown set to Current](/img/home/seek--session-options--crop.png)

The **Session Options** panel sits to the right of the answer. For a first question you can leave it as it is:

- **User ID:** — an optional identifier of the user asking. Leave it empty for a first question.
- **Session:** — the identifier of the conversation this question belongs to. It is read-only.
- **Session Turns:** — how many turns the current session has had. It is read-only. [Conversational context](/seek/conversational-context/) explains how a session carries context from one question to the next.
<!-- UNCONFIRMED: Provenance highlights which parts of the answer came from the KnowledgeBase — hand-verified earlier draft of seek/overview (2026-09-02); the capture shows the highlights but no help text for the toggle -->
- **Provenance:** — with it on, the answer text is highlighted to show which passages were drawn from the KnowledgeBase; the sources under the answer carry matching coloured markers.
<!-- UNCONFIRMED: Streaming on = the answer arrives word by word, off = all at once — hand-verified earlier draft of seek/overview (2026-09-02); no help text on screen -->
- **Streaming:** — with it on, the answer is written out as it is generated; off, it appears all at once when it is complete.
<!-- UNCONFIRMED: Configuration "Current" runs the question against the settings as they stand in Neural Config — hand-verified earlier draft of seek/overview (2026-09-02); the option list was not captured -->
- **Configuration:** — selects which saved configuration answers the question. **Current** uses your settings as they stand in Neural Config; see [Configuration overview](/configuration/overview/).

## Step 3: Read the answer

The **Answer** panel holds the generated answer. Use the thumbs-up and thumbs-down icons at its lower right to give feedback on it. Below **Session Options**, a **Sentiment** gauge runs from Negative to Positive.

![The scores table under a Seek answer, from Time to Agents Run, and the KnowledgeBase Context list of source URLs with their percentages](/img/home/seek--answer-details--crop.png)

Under the answer, a table gives one row per measurement:

<!-- UNCONFIRMED: meaning of the Semantic Match, KnowledgeBase Confidence and KnowledgeBase Coverage percentages — hand-verified earlier draft of seek/overview (2026-09-02); the screen shows only the labels and values -->

| Row | What it shows |
| --- | --- |
| **Time** | When the answer was generated, with the time zone. |
| **Total Response Time** | How long the whole answer took, in seconds. |
| **Semantic Match** | A percentage for how closely the answer matches its source documents. |
| **Semantic Analysis** | A sentence explaining what moved the Semantic Match score, and the **Statistical Details** button. |
| **KnowledgeBase Confidence** | A percentage for how much the KnowledgeBase results can be relied on. |
| **KnowledgeBase Coverage** | A percentage for how much of the KnowledgeBase covers the subject of the question. |
| **KnowledgeBase Response Time** | How long the KnowledgeBase took to return results, in seconds. |
| **Category Selection Time** | How long choosing a category took, in seconds. |
| **Prompt Injection Time** | How long the prompt-injection check took, in seconds. |
| **Scoring Time** | How long scoring the answer took, in seconds. |
| **Intent** | The intent the question was matched to, as a link that opens it in Curate. |
| **Category ID / Answer ID** | The identifiers of the category and of this answer. |
| **KnowledgeBase Results** | How many results the KnowledgeBase returned, and how many of them were filtered by Date Penalty or Score Range. |
| **Agents Run** | The mAIstro agents that ran while answering, each as a link into mAIstro. |

Read the three percentages together: **Semantic Match** is about the answer against its sources, **KnowledgeBase Confidence** and **KnowledgeBase Coverage** are about what the KnowledgeBase found. [Seek overview](/seek/overview/) goes through each row in more depth.

To see the breakdown behind the Semantic Match score, select **Statistical Details**. It opens **Semantic Score Details**: **Semantic Match %**, **Source Jumps**, **Standard Deviation**, **Top Source Coverage**, **Total Coverage**, **Normalized Answer Length**, **Longest Phrase**, **Unattributed Key Terms**, **Unattributed Terms**, **Unattributed Numbers** and **Removed Sentences**. What each figure means and how to tune the score is on [Semantic model](/configuration/semantic-model/).

The last section, **KnowledgeBase Context**, lists the documents the answer came from: one row per source, with its URL, a percentage and a chevron that expands the row. This is where you check that the answer came from the documents you expected. To act on an answer — edit it, or train which source answers which question — see [Curation](/seek/curation/).

## Next steps

- [Seek overview](/seek/overview/) — the Seek page in full.
- [Tuning answers](/seek/tuning/) — what to change when answers are weak.
- [Caching](/seek/caching/) — why a repeated question can come back instantly and identically.
- [Curation](/seek/curation/) — editing and training answers after they are generated.
- [Conversational context](/seek/conversational-context/) — testing a multi-turn conversation.

## FAQ

### How can I tell where the answer came from?

Look at **KnowledgeBase Context** at the bottom of the page. It lists each source document the answer was built from, with a percentage, and each row expands. With **Provenance** on in **Session Options**, the answer text itself is also highlighted.

### Do I need Personalize or Filter for a first answer?

No. **Personalize** passes details about the user asking ([Personalization](/seek/personalization/)); **Filter** narrows which documents are searched ([Dynamic filters](/seek/dynamic-filters/)). A plain question needs neither.

### What does Statistical Details show?

It opens **Semantic Score Details**, the breakdown behind the **Semantic Match** score — **Semantic Match %**, **Source Jumps**, **Standard Deviation**, the coverage figures, answer length, the longest matching phrase and the unattributed terms and numbers. [Semantic model](/configuration/semantic-model/) explains how they combine.

### My answer came back with a low score. What now?

Check **KnowledgeBase Results** and **KnowledgeBase Coverage** first: if few results came back, or coverage is low, the KnowledgeBase may not hold documents on the subject. Then see [Tuning answers](/seek/tuning/) and your [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

## Related

- [Core concepts](/getting-started/concepts/)
- [Seek overview](/seek/overview/)
- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
- [Semantic model](/configuration/semantic-model/)
