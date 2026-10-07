---
title: "Seek overview"
description: "The Seek tab answers a test question from your KnowledgeBase and configuration and shows, beside the answer, its session, sentiment, timings, Semantic Match and KnowledgeBase scores, intent, and the source documents it drew on."
---

The **Seek** tab is where you try NeuralSeek before your users do. You ask a question, NeuralSeek answers it from your KnowledgeBase with your current configuration, and the tab shows the answer together with every number behind it: how long each step took, how well the answer is backed by the sources, which intent the question was filed under, and which documents were used. Admins use it to check a KnowledgeBase or configuration change; developers use it to see what an API call will return before they write one. This page names each part of the tab once and links the pages that explain the settings behind it.

## How the Seek tab works

You type a question and select **Seek**. The answer appears with **Session Options** beside it, a statistics table below it, and the list of source documents at the bottom. Everything below the question box belongs to the question you asked last.

### Ask a question

![The Seek tab after a question: the question box with the English language selector and the Seek, Personalize and Filter buttons; the Answer with provenance highlights and rating icons; Session Options with User ID, Session, Session Turns and its New Session icon, Provenance, Streaming and Configuration set to Current; the Sentiment gauge; and the first rows of the statistics table](/img/seek/default.png)

1. Type your question in the search box at the top of the tab.
2. To get the answer in a language other than your configuration's default, pick it in the language selector beside the box. The selector overrides the **Default Output Language** set in Neural Config for the question you ask; [Language handling](/configuration/language/) explains how NeuralSeek deals with questions and answers in other languages.
3. Select **Seek**.

Two buttons beside **Seek** change the question before it is asked:

- **Personalize** opens the **Personalize** dialog, where you describe who is asking — a preferred name, the products they use, and other details — so the answer can be tailored to them. See [Personalization](/seek/personalization/).
- **Filter** (the funnel icon) opens the **Filter** dialog, which limits the search to the documents that match a filter. See [Dynamic filters](/seek/dynamic-filters/) for what to type.

### Session Options

The **Session Options** panel to the right of the answer holds the conversation your test questions belong to and how the answer is displayed.

- **User ID** — the user the question is asked as. Leave it empty, or enter an ID to test as a particular user. NeuralSeek keeps context per conversation, and recognises a conversation by its session or, without one, by its user; [Conversational context](/seek/conversational-context/) explains how.
- **Session** — the code of the current session. It is read-only.
- **Session Turns** — how many turns the current session has had. Ask a second question without starting a new session and the count goes up, so the second question can be read as a follow-up to the first.

<!-- UNCONFIRMED: New Session gives a new session code and drops the earlier turns from the context of the next question — previous documentation page ("revert to a new session with a unique Session ID… by clicking the red arrow next to Session Turns") and the icon's "Reset Context" text; the capture did not select it -->

- **New Session** — the icon beside **Session Turns**. Select it to start a new session and reset the context, so the next question is answered without the earlier ones in mind.

<!-- UNCONFIRMED: Provenance highlights the parts of the answer drawn from the KnowledgeBase, with each phrase's highlight matching its source's marker; Streaming On writes the answer out as it is generated, Off shows it complete — previous documentation page ("Highlight Answer Provenance", "Answer Streaming"); the screen shows the highlights and markers but no help text -->

- **Provenance** — **On** or **Off**. With it on, phrases in the answer are highlighted to show which parts were drawn from the KnowledgeBase, and each source under [KnowledgeBase Context](#knowledgebase-context) starts with a coloured marker that matches its highlights.
- **Streaming** — **On** or **Off**. On, the answer is written out as it is generated; off, it appears all at once when it is complete.
- **Configuration** — the configuration the question is answered with. It shows **Current**. Configurations are edited in [Neural Config](/configuration/neural-config/), and earlier versions are kept as described in [Backup, restore and change logs](/configuration/backup-restore/).

### The answer and its sentiment

The **Answer** panel holds the generated answer. The thumbs-up and thumbs-down icons at its lower right rate the answer; [Implementing feedback](/integrations/feedback/) covers rating answers, including from your own application.

Below **Session Options**, the **Sentiment** gauge runs from **Negative** to **Positive** and shows the sentiment of the exchange. [Sentiment](/governance/sentiment/) explains what is measured and where it is reported.

### The statistics under the answer

![Screenshot pending: the statistics table under the answer, from Time to Agents Run](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/seek/default--statistics.png — Seek tab > ask a question > scroll down > section crop of the whole statistics table (Time through Agents Run), labels and values visible. Why: ten of the fourteen rows are below the fold of the tab's first screenshot. -->

The table under the answer explains how the answer was produced. It starts with when the question was answered and how long it took, then the scores, then the time each step took, and ends with where the question was filed and what the KnowledgeBase and any agents returned. Times are in seconds.

<!-- UNCONFIRMED: KnowledgeBase Confidence is how well the retrieved sources relate to the question; KnowledgeBase Coverage is how much of the question the retrieved sources cover; Agents Run lists the mAIstro agents that ran while answering — previous documentation page and the route's brief (inferred); the screen shows only the labels, percentages, and an empty Agents Run cell -->

| Row                             | What it shows                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Time**                        | When the question was answered.                                                                                                                                                                                                                                                                                                                     |
| **Total Response Time**         | The time taken to answer the question. A **Cached** badge beside it means the answer was served from the answer cache rather than generated again; [Caching](/seek/caching/) explains when that happens.                                                                                                                                             |
| **Semantic Match**              | A percentage for how well the answer is backed by the source documents. [Semantic model tuning](/configuration/semantic-model/) explains how it is computed and which settings move it.                                                                                                                                                             |
| **Semantic Analysis**           | The Semantic Match score explained in words — for example, that the answer jumps between sources, or uses key terms the documentation does not back. It ends with **Statistical Details**.                                                                                                                                                         |
| **KnowledgeBase Confidence**    | A percentage for how well the retrieved documents relate to the question. If it is high while Semantic Match is low, check whether the answer strays from the documents that were found.                                                                                                                                                            |
| **KnowledgeBase Coverage**      | A percentage for how much of the question the retrieved documents cover.                                                                                                                                                                                                                                                                            |
| **KnowledgeBase Response Time** | The time the KnowledgeBase search took.                                                                                                                                                                                                                                                                                                             |
| **Category Selection Time**     | The time spent choosing the category the question is routed to.                                                                                                                                                                                                                                                                                     |
| **Prompt Injection Time**       | The time spent checking the question for prompt injection. See [Prompt injection](/governance/guardrails/prompt-injection/).                                                                                                                                                                                                                       |
| **Scoring Time**                | The time spent computing the semantic score.                                                                                                                                                                                                                                                                                                        |
| **Intent**                      | The intent the question was filed under. The intent name is a link: it opens Curate with that intent searched, where you can review and edit its answers — see [Answer curation](/seek/curation/). [Intent categorization](/governance/intent-categorization/) explains how intents are assigned.                                                   |
| **Category ID / Answer ID**     | The identifiers of the category the question was routed to and of this answer. The answer ID is what you rate from your own application; see [Implementing feedback](/integrations/feedback/).                                                                                                                                                                                                                                                                     |
| **KnowledgeBase Results**       | How many documents the KnowledgeBase returned, and how many of them were then dropped, in the form "_n_, with _n_ filtered by Date Penalty or Score Range". The two settings are **Document Date Penalty** and **Document Score Range** on [KnowledgeBase tuning](/configuration/neural-config/knowledgebase-tuning/).                                                                                             |
| **Agents Run**                  | The [mAIstro](/maistro/overview/) agents that ran while answering. Empty when no agent ran.                                                                                                                                                                                                                         |

A slow **Total Response Time** is usually explained by the rows below it: compare **KnowledgeBase Response Time**, **Category Selection Time**, **Prompt Injection Time** and **Scoring Time** to see which step took the time.

### Statistical Details

![The Semantic Score Details dialog: Semantic Match %, Source Jumps, Standard Deviation, Top Source Coverage, Total Coverage, Normalized Answer Length, Longest Phrase, Unattributed Key Terms, Unattributed Terms, Unattributed Numbers and Removed Sentences, with the Close button](/img/seek/statistical-details-panel.png)

To see the numbers behind the Semantic Match percentage, select **Statistical Details** at the end of the **Semantic Analysis** row. The **Semantic Score Details** dialog lists Semantic Match %, Source Jumps, Standard Deviation, Top Source Coverage, Total Coverage, Normalized Answer Length, Longest Phrase, Unattributed Key Terms, Unattributed Terms, Unattributed Numbers and Removed Sentences. Select **Close** to return to the answer.

What each line means, and which setting to change when one of them drags the score down, is on [Semantic model tuning](/configuration/semantic-model/). To follow the score across many answers instead of one, use [Semantic analytics](/governance/semantic-analytics/).

### KnowledgeBase Context

![KnowledgeBase Context with two source documents, each with its URL, a coloured marker, a percentage and an expand arrow](/img/seek/default--knowledgebase-context.png)

**KnowledgeBase Context**, at the bottom of the tab, lists the source documents the answer drew on: one entry per document, with its URL and a percentage for how strongly it matched. When the answer is weak, this is where to look first — a missing or unexpected document points at the KnowledgeBase content or its tuning rather than at the answer.

<!-- UNCONFIRMED: expanding a KnowledgeBase Context entry shows the passage used from that source document — previous documentation page and the route's gap list; the capture did not expand an entry -->

Select an entry to expand it and read the passage that was used from that document.

## When to use the Seek tab

- After you change the KnowledgeBase or the configuration: ask the questions your users ask and compare the answer, the scores and the sources with what you had before.
- When an answer scores low: read **Semantic Analysis**, open **Statistical Details**, then check **KnowledgeBase Context** to tell a retrieval problem (wrong or missing documents) from a generation problem (the right documents, an answer that strays). [Tuning answers](/seek/tuning/) lists what to change.
- Before you build a conversation flow: keep the same session and ask follow-up questions to see how earlier turns shape the next answer.
- To check a filter or a personalization before your application sends it.

The Seek tab answers one question at a time for one person. It is the wrong tool for:

- Your application's traffic — call Seek from code instead; see [REST and Console APIs](/integrations/rest-and-console-api/).
- Reviewing answers across many questions — use [Answer curation](/seek/curation/) for the answers themselves and [Semantic analytics](/governance/semantic-analytics/) for score trends.
- Multi-step logic around an answer — build it as an agent in [mAIstro](/maistro/overview/).

## FAQ

### Why does the answer show Cached?

The answer was served from the answer cache instead of being generated again, which is why it comes back faster. [Caching](/seek/caching/) explains which answers are cached and for how long.

### How do I start a fresh conversation without earlier questions affecting the answer?

Select the **New Session** icon beside **Session Turns** in **Session Options**, then ask your question. See [Conversational context](/seek/conversational-context/) for how much history a follow-up question carries.

### Where do I see why the Semantic Match score is low?

The **Semantic Analysis** row explains the score in words. Select **Statistical Details** for the figures behind it, and see [Semantic model tuning](/configuration/semantic-model/) for what each one means.

### Can I see which source a phrase in the answer came from?

Turn **Provenance** on in **Session Options**. The answer's phrases are highlighted and each entry under **KnowledgeBase Context** carries a coloured marker; see [Session Options](#session-options).

## Related

- [Quickstart: Seek](/getting-started/quickstart-seek/) — your first question, end to end
- [Conversational context](/seek/conversational-context/)
- [Caching](/seek/caching/)
- [Semantic model tuning](/configuration/semantic-model/)
- [Answer curation](/seek/curation/)
- [Tuning answers](/seek/tuning/)
- [REST and Console APIs](/integrations/rest-and-console-api/)
