---
title: 'Answer curation'
description: 'The Curate tab is where you review and correct the intents and answers NeuralSeek generated from your KnowledgeBase — and an answer you edit there becomes training.'
---

## What is it

Curate is where you review and correct what NeuralSeek has learned. NeuralSeek trains off the
documentation in your KnowledgeBase; Curate shows you the intents it generated from that
documentation, the questions grouped under each one, and the answers being served — and lets you
change them.

An answer you edit here becomes training. It teaches the model the style and content you want for
that intent, and it can be cached and served directly without going back to the LLM.

## Why it matters

When an answer is wrong, the first move is to look at the documentation behind it. Curate is
where that inspection happens, and where the correction gets recorded once you have made it.

Two things it does that are hard to do anywhere else:

- **Cost.** Serving a curated answer from a pool of approved responses is cheaper than generating
  a fresh one every time.
- **Staleness.** NeuralSeek monitors the source documents and compares them against the answers
  generated from them, so an answer whose source has changed gets flagged instead of quietly
  going out of date.

Curate fixes answers one at a time. If many answers are wrong the cause is upstream — what the
KnowledgeBase is returning — and [tuning](/seek/tuning/) is the tool for that. A hand-edited
answer also stops tracking the document it came from, which is a cost worth paying deliberately
rather than by accident.

## When to use it

- After bootstrapping an instance, to review what was generated before anyone else sees it.
- When a specific answer is wrong and you want to fix it rather than retune the whole instance.
- To bulk-load Q&A pairs a subject-matter expert has written outside NeuralSeek.
- To find intents holding personally identifiable information (PII), or intents whose underlying
  documentation has moved on.

## How it works

Open **Curate** from the **Admin Tools** menu in the top nav. The table has six columns:

| Column | What it shows |
| --- | --- |
| **Intent** | A collection of questions sharing the same intent, prefixed by its type — `FAQ`, for example — followed by the subject area. Everything falls under the `Others` category by default; you can define your own categories in the configuration. Status indicators here surface new answers, personally identifiable information (PII), out-of-date underlying data, [round-trip logging](/governance/logging/) results, and merge/unmerge actions. |
| **Q&A** | How many questions (white dialog icon) and answers (blue dialog icon) the intent holds. |
| **Coverage %** | How much the KnowledgeBase contributed to the answer. High means NeuralSeek found everything it needed. |
| **Confidence %** | How likely the answer is to satisfy the user — high means it is well grounded in the documentation. |
| **Category** | The intent's category, editable in place. |
| **Governance** | Opens the governance view for that intent. |

Above the table sit search, a settings gear, **Add Intent**, **Filter** and **Load Q&A**. Below it,
a pager with an items-per-page selector.

### Reading the trend graphs

Two graphs sit behind those percentages.

**Coverage** counts the citations and reference material used to answer a question. Zero means no
relevant documentation exists; 100% means the topic is comprehensively documented. It is shown in
shades of blue — the darker the shade, the more documentation was referenced.

**Confidence** is how sure NeuralSeek is of its own answer. High confidence means the answer is
well cited; low confidence suggests the source material is ambiguous or contradicts itself. Green
is high, red is low.

The two are independent, and both matter for data governance. An accurate answer can have low
coverage and high confidence. An inaccurate one can have high coverage and low confidence,
because several sources disagreed.

**Slope** is volume: the height shows how many hits landed in that bucket. If every answer scored
99% except one at 20%, the slope is tall at 99% and barely visible at 20%. Hover the graph to see
how it moved over time — a confidence drop from 83% to 22% within five minutes is the kind of
thing this surfaces.

![Screenshot needed — the Coverage and Confidence trend graphs on an intent, with the hover detail showing a change over time](/img/_placeholder.svg)

<!-- SCREENSHOT: Curate tab, an intent row's Coverage and Confidence graphs, with the hover
     tooltip open on a point where confidence dropped. Needs an instance whose history actually
     contains a drop — that is the hard part of this capture.
     Why: colour intensity, slope height and the time-series hover are three encodings in one
     small graphic — the shape is the information, and prose cannot substitute for it. -->

### Questions and answers under an intent

Select the `⌄` arrow beside an intent name to expand its example questions and their generated
answers.

Example questions are coloured by origin: **black** ones were actually submitted by a user, and
**gray** ones were generated by NeuralSeek, which produces similar-meaning questions alongside
each one it receives. You can add your own example questions too, with **Add Examples**. **Generate Examples** creates
more automatically, and **Remove Auto-Generated Examples** clears the generated ones while leaving
the questions real users asked.

You can also attach **Notes** to an intent, to keep additional information with it.

### Searching and filtering

Intents can run to many pages. The search box at the top narrows by keyword.

The filter button is more precise: filter to intents that were edited, that gained a new answer,
that are flagged, or where out-of-date data was found.

### Editing an answer

Select the answer, change it, and save. It is then marked `Edited`.

Edited answers do two things beyond fixing that one response: they become training for the
underlying LLM, teaching it the style and content you want for that intent, and they are eligible
for independent caching, so they can be served straight to the user without another generation
call — see [Caching](/seek/caching/), and [Tuning answers](/seek/tuning/) for the setting that
switches it on.

<details>
<summary>Formatting edited answers</summary>

Edited answers can be styled with
[Markdown](https://www.markdownguide.org/cheat-sheet/), subject to what the assistant or agent
supports (see [Virtual agents](/integrations/virtual-agents/)) and to the delivery channel —
Slack, Facebook, WhatsApp and so on.

Supported elements typically include **bold**, _italic_, `inline code` and hyperlinks.

```md
This is a **bold** word, this is an _italic_ word, and here is a [link to a website](https://example.com).
```

</details>

### Deleting questions and answers

Select the `circle with i` icon on a question or answer and choose **Remove**.

:::caution
Removal cannot be rolled back.
:::

The gear icon at the top offers three bulk operations: **Delete all data**, **Delete all
analytics**, and **Delete all unEdited Answers** — for resetting an instance and starting over.

### Intent operations

Selecting one or more intents replaces the toolbar with an action bar showing the count and the
operations available. **Cancel** clears the selection. The export action is labelled with whatever
**Virtual Agent Type** is configured in Platform Preferences — **Export to Watson Assistant
Actions**, for instance.

| Operation | What it does |
| --- | --- |
| **Edit category** | Change the intent's category. |
| **Download to CSV** | Export as `ID,question,score,kbCoverage,answer,category,intent,pii`. |
| **Generate Conversation** | Turn the intent into a conversation rather than a single question and answer, giving NeuralSeek more context to generate from. |
| **Flag** | Mark it so you can find it again quickly. |
| **Rename** | Rename the intent. |
| **Delete** | Delete the selected intents. |
| **Backup** | Back up an intent for later recovery. The backup file is binary, not text. |
| **Merge** | Appears only when two or more intents are selected; merges all their questions and answers into one. |
| **Export to _\<Virtual Agent Type\>_** | Exports the selection in the format set by **Virtual Agent Type** in Neural Config > Platform Preferences. |

### Uploading Q&A files (CSV/XLSX)

NeuralSeek ingests Q&A pairs directly from CSV or Excel, which is usually faster than curating in
the UI when a subject-matter expert has already written the answers. You can upload new pairs or
edit existing ones.

1. Download the template from the Curate tab with **Load Q&A**.
2. Fill in `question` and `answer` at minimum. Additional payload fields are optional — add
   columns such as tags or category.
3. Drag and drop, or select, the file on the Q&A Upload screen.
4. To run the answers through Seek and improve them on the way in, check **Yes** on **Improve my
   answers**.
5. Select **Submit**.

:::tip
- Keep new and existing Q&A pairs in separate files — do not mix them.
- One question per row.
- Answers should be SME-approved, or run through Seek with **Improve my answers**.
- Test with 5–10 rows before a bulk upload.
- Use UTF-8 encoding for CSVs.
:::

## Guides

Guides that relate to the Curate tab and the curation of answers:

- [Tuning answers](/seek/tuning/)
- [Training virtual agents](/integrations/training-virtual-agents/)

## FAQ

### Does editing an answer change anything beyond that answer?

Yes. Edited answers train the underlying model on the style and content you want for that intent,
and they can be cached and served without a generation call. They also always report a Semantic
Score of 100%.

### How do I find answers whose documentation has changed?

Use the filter button and filter on out-of-date data. NeuralSeek compares generated answers
against their source documents continuously, so those intents are already marked.

### What is the difference between Coverage % and Confidence %?

Coverage is about your documentation: how many documents or sections discuss the subject at all.
Confidence is about the answer: how likely the information used in it is to be correct. They move
independently — an accurate answer can have low coverage and high confidence, and an inaccurate
one can have high coverage and low confidence because several sources disagreed.

### Can I upload answers from a spreadsheet?

Yes. Download the template with **Load Q&A**, fill in at least the `question` and `answer`
columns, and upload it on the Q&A Upload screen. Test with 5–10 rows before a bulk upload.

### Can I get the curated answers back out?

Yes — **Download to CSV** on an intent exports
`ID,question,score,kbCoverage,answer,category,intent,pii`. **Backup** also exists, but produces a
binary file meant for restoring rather than reading.

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Notes on an intent — where the control is, and whether it takes plain text or Markdown
  - Delete user data — the bulk GDPR/CCPA erasure path
  - Delete and Regenerate Responses for an intent
  - Enhance Conversation — improve a stored conversation with the LLM
  - User Agents modal in the Curate context
  - Add Intent > mAIstro toggle — an intent answered by an agent instead of by Seek
-->
