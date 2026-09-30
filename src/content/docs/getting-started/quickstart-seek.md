---
title: "Quickstart: Seek"
description: "Ask your first question on the NeuralSeek Seek page and read what comes back: the generated answer, the KnowledgeBase sources behind it, and the scores that say how far to trust it."
---

## What is it

This quickstart takes you from the NeuralSeek Home page to your first grounded answer. You open the **Seek** page, type a question, press **Seek**, and read the result: the generated answer, the list of KnowledgeBase documents it was built from, and a table of scores and timings for that one question.

Every deeper topic — tuning, caching, curation, personalization — has its own page. This one covers only what you need for the first answer, and links out for the rest.

## Why it matters

An answer on its own does not tell you whether it is safe to show to a user. The Seek page puts the answer next to the sources it came from and the scores NeuralSeek calculated for it, so you can check it rather than trust it. That makes a first question the quickest test of whether your instance is set up well enough to answer the questions your users will ask.

For how Seek fits with the KnowledgeBase, mAIstro and curation, read [Core concepts](/getting-started/concepts/) first or alongside this page.

## When to use it

- You have just connected a KnowledgeBase and want to see an answer come back.
- You want to try a question your users actually ask and see which documents answer it.
- You are learning the console and want to know what each part of the Seek page shows.

It is the wrong page when you already get answers and want to improve them — go to [Tuning answers](/seek/tuning/) — or when you want to test a multi-turn conversation, which [Conversational context](/seek/conversational-context/) covers.

## How it works

Seek answers from the KnowledgeBase your instance is connected to. If no KnowledgeBase is connected, there is nothing to answer from: set one up in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) first.

### Open Seek from Home

![Home page, Get more value from NeuralSeek: the tile "Trace answers back to their sources and train question-to-source relevancy on the Seek tab"](/img/home/default--get-more-value-from-neuralseek.png)

The navbar runs along the top of every console page. **Seek** is its third item, after **Home** and **Neural Config**. Select it to open the Seek page.

On the Home page there is a second way in: under **Get more value from NeuralSeek**, the tile "Trace answers back to their sources and train question-to-source relevancy on the **Seek** tab" links to the same page.

### Ask a question

![Seek page: the question box, the English language selector, the Seek, Personalize and Filter buttons, and the Session Options panel with Provenance, Streaming and Configuration set to Current](/img/home/seek.png)

The toolbar across the top of the Seek page holds everything you need to ask:

1. Type your question in the search box at the left of the toolbar. The × at its right end clears it.
2. Check the language dropdown next to it — it shows **English** when English is selected. It sets the language of the question.
3. Press **Seek** (the button with the magnifier icon). The answer appears below the toolbar.

Two more buttons sit at the right of the toolbar. You do not need either for a first question:

- **Personalize** opens a **Personalize** dialog with **Clear** and **Save** buttons. It passes details about the user asking, so the answer can be tailored — see [Personalization](/seek/personalization/).
- **Filter** (the funnel icon) opens a **Filter** dialog with **Clear** and **Save** buttons. It narrows which KnowledgeBase documents the question is answered from — see [Dynamic filters](/seek/dynamic-filters/).

### Session Options

![Screenshot needed — the Seek page's Session Options panel on its own](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/home/seek--session-options.png — Seek page, the Session Options panel to the right of the answer (User ID, Session, Session Turns, Provenance, Streaming, Configuration). Why: the panel has six controls and today it is only visible inside the full-page viewport image above. -->

The **Session Options** panel sits to the right of the answer. For a first question you can leave it as it is. What each row is for:

- **User ID:** — a text box for an optional identifier of the user asking. Leave it empty for a first question.
- **Session:** — the identifier of the conversation this question belongs to. It is read-only.
- **Session Turns:** — how many turns the current session has had. It is read-only. [Conversational context](/seek/conversational-context/) explains how a session carries context from one question to the next.
<!-- UNCONFIRMED: Provenance highlights which parts of the answer came from the KnowledgeBase — hand-verified earlier draft of seek/overview (2026-09-02); the capture shows the highlights but no help text for the toggle -->
- **Provenance:** — an **On** / **Off** toggle. With it on, the answer text is highlighted to show which passages were drawn from the KnowledgeBase; the sources under the answer carry matching coloured markers.
<!-- UNCONFIRMED: Streaming on = the answer arrives word by word, off = all at once — hand-verified earlier draft of seek/overview (2026-09-02); no help text on screen -->
- **Streaming:** — an **On** / **Off** toggle. On, the answer is written out as it is generated; off, it appears all at once when it is complete.
<!-- UNCONFIRMED: Configuration "Current" runs the question against the settings as they stand in Neural Config — hand-verified earlier draft of seek/overview (2026-09-02); the option list was not captured -->
- **Configuration:** — a dropdown that selects which saved configuration answers the question. **Current** uses your settings as they stand in Neural Config; the Neural Config screen itself is mapped in [Configuration overview](/configuration/overview/).

### Read the answer

![Seek page after a question: the Answer panel with provenance highlights and thumbs-up and thumbs-down icons, Session Options, the Sentiment gauge, the detail table with Statistical Details, and the KnowledgeBase Context list of sources](/img/home/seek--knowledgebase-context.png)

After you press **Seek**, the page fills in from top to bottom.

The **Answer** panel holds the generated answer, with thumbs-up and thumbs-down icons at its lower right for feedback on the answer. Below **Session Options**, a **Sentiment** gauge runs from Negative to Positive.

Under the answer, a table gives one row per measurement, in this order:

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

The three percentages are read together: **Semantic Match** is about the answer against its sources, **KnowledgeBase Confidence** and **KnowledgeBase Coverage** are about what the KnowledgeBase found. [Seek overview](/seek/overview/) goes through each row in more depth.

The **Statistical Details** button in the **Semantic Analysis** row opens **Semantic Score Details**, the breakdown behind the Semantic Match score: **Semantic Match %**, **Source Jumps**, **Standard Deviation**, **Top Source Coverage**, **Total Coverage**, **Normalized Answer Length**, **Longest Phrase**, **Unattributed Key Terms**, **Unattributed Terms**, **Unattributed Numbers** and **Removed Sentences**. **Close** returns to the page. What each figure means and how to tune the score is on [Semantic model](/configuration/semantic-model/).

The last section, **KnowledgeBase Context**, lists the documents the answer came from: one row per source, with its URL, a percentage and a chevron that expands the row. This is where you check that the answer came from the documents you expected. To act on an answer — edit it, or train which source answers which question — see [Curation](/seek/curation/).

### Next steps

- [Core concepts](/getting-started/concepts/) — how Seek, the KnowledgeBase, mAIstro and curation fit together.
- [Seek overview](/seek/overview/) — the Seek page in full.
- [Tuning answers](/seek/tuning/) — what to change when answers are weak.
- [Caching](/seek/caching/) — why a repeated question can come back instantly and identically.
- [Curation](/seek/curation/) — editing and training answers after they are generated.
- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) — the documents Seek answers from.

## FAQ

### Where do I ask my first question?

On the **Seek** page, the third item in the console navbar. Type the question in the question box at the top, check that the language dropdown shows the language you are asking in, and press **Seek**.

### How can I tell where the answer came from?

Look at **KnowledgeBase Context** at the bottom of the page. It lists each source document the answer was built from, with a percentage, and each row expands. With **Provenance** on in **Session Options**, the answer text itself is also highlighted.

### Do I need Personalize or Filter for a first answer?

No. Both open optional dialogs. **Personalize** passes details about the user asking ([Personalization](/seek/personalization/)); **Filter** narrows which documents are searched ([Dynamic filters](/seek/dynamic-filters/)). A plain question needs neither.

### What does Statistical Details show?

It opens **Semantic Score Details**, the breakdown behind the **Semantic Match** score — **Semantic Match %**, **Source Jumps**, **Standard Deviation**, the coverage figures, answer length, the longest matching phrase and the unattributed terms and numbers. [Semantic model](/configuration/semantic-model/) explains how they combine.

### My answer came back with a low score. What now?

Check **KnowledgeBase Results** and **KnowledgeBase Coverage** first: if few results came back, or coverage is low, the KnowledgeBase may not hold documents on the subject. Then see [Tuning answers](/seek/tuning/) and your [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).
