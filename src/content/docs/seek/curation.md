---
title: "Answer curation"
description: "The Curate screen lists the intents NeuralSeek groups user questions into, with their example questions and answers; there you filter and recategorise intents, add examples, upload Q&A pairs in bulk and export intents to a virtual agent."
---

## What is it

Every question NeuralSeek answers is filed under an **intent**: a group of questions that ask
the same thing in different words, together with the answers given to them. The **Curate**
screen (`/curate`, reached from **Admin Tools** in the top navigation) is where those intents
live. It shows one row per intent with its category, how many example questions and answers it
holds, how well the KnowledgeBase covered it, how confident the answers were, and icons that flag
edited answers, new answers and personal data.

From the same screen you can open an intent to read and extend its example questions and
answers, create an intent by hand with **Add Intent**, narrow the list with **Filter**, move
intents between categories, upload question/answer pairs in bulk with **Load Q&A**, and export
selected intents to the virtual agent your instance is configured for.

## Why it matters

Curate is the feedback side of Seek. Generated answers are only as good as the documents behind
them, and the table puts a **Coverage %** and a **Confidence %** chart beside every intent, so
the intents that scored low stand out (what each score measures is described under
[The Curate table](#the-curate-table)). Those are the intents to look at — either in the source
documents or by curating the answer.

A curated answer is reusable. Answers you edit are marked **Edited**, and NeuralSeek can serve an
edited answer verbatim instead of generating a new one; the threshold for that is the **Edited
answer cache** setting, explained on [Caching](/seek/caching/). The **Q&A Upload** screen states
the training side directly: uploaded pairs "will become edited answers in NeuralSeek and will
train future language generations for similar questions."

The same table also carries the governance signals a reviewer needs before an answer goes out:
which intents contain personal data, which have answers nobody has reviewed yet, and which are
out of date.

## When to use it

- Reviewing what users actually ask, and spotting intents with low coverage or low confidence.
- Correcting or rewriting an answer a subject-matter expert should own.
- Seeding many approved question/answer pairs at once, from a spreadsheet, before go-live.
- Finding intents that contain personal data, or answers that need review.
- Exporting intents to a virtual agent (Watson Assistant, Lex and the other supported types).

Curate is the wrong place to fix missing or wrong source material: if an intent scores low
coverage, the cure is in the [KnowledgeBase documents](/knowledge/document-manager/), and edited
answers are not refreshed when the documents change. It is also not where categories are created — the
Edit Category dialog says so itself: "Add new categories on the Configure tab."

## How it works

The examples below come from the playground instance captured for this page, which holds 52
intents in six categories (`Other`, `Billing`, `Refunds`, `Technical Support`,
`API & Integrations`, `Account Access`). Your categories and intents will differ.

### The Curate table

![The Curate table with the pointer on the pencil icon beside Refunds-Update_payment_method, showing the tooltip "This intent has edited answers."; columns Category, Intent, Q&A, Coverage %, Confidence % and Governance](/img/curate/edited-icon.png)

Each row is one intent. The columns are:

- **Category** — the intent's category, shown as a button. Its tooltip reads, for example,
  "Refunds (Click to Edit)", and clicking it opens the [Edit Category](#edit-category) dialog.
- **Intent** — the intent name, in the form `<Category>-<subject>` (for example
  `Refunds-Update_payment_method` or `Other-neuralseek`). Long names are cut short with `...`;
  hover for the full name. Click the **Intent** column header to sort the table by name.
- **Q&A** — two speech bubbles. The white one with a "?" counts the intent's example questions;
  the blue one counts its answers. `Other-neuralseek` shows `11` and `5`, and expanding it lists
  11 examples and 5 answers.
- **Coverage %** — a small distribution chart on a 0 / 25 / 50 / 75 / 100 axis, drawn in shades
  of blue.
- **Confidence %** — the same 0–100 chart, drawn in green for scores near 100 and through yellow
  and orange to red for scores near 0.
- **Governance** — an icon per row, named **View Governance for this intent**. It opens the
  Governance page filtered to that intent, so you can see its confidence, coverage and other
  metrics.

**Coverage %** shows how much of an answer the KnowledgeBase supplied — the darker the blue, the
more documentation was referenced. **Confidence %** shows how likely the answer is to satisfy the
user. The height of a peak shows how many answers fell at that score, and hovering the chart shows
how the scores moved over time.

Icons after the intent name flag its state. Hover one to read its tooltip:

| Icon      | Tooltip                         |
| --------- | ------------------------------- |
| Pencil    | This intent has edited answers. |
| Clipboard | This intent has new answers.    |
| ID card   | This intent has PII in it.      |

Inside an expanded intent the same check is made per item: an example can carry "This question
has PII in it." and an answer "This answer was formed from a question with PII in it."

![The Curate table sorted by the Intent column: the Intent header is highlighted with an up-arrow and the rows run alphabetically from Account_Access-factor_authentication](/img/curate/intent.png)

The chevron at the start of each row expands the intent (see
[Inside an intent](#inside-an-intent-notes-examples-and-answers)). The checkbox beside it, and
the select-all checkbox in the header, select intents for the
[bulk actions](#bulk-actions-and-export).

### Searching, paging and the gear menu

![The Curate screen: toolbar with the search magnifier, the gear icon, Add Intent, Filter and Load Q&A; ten intent rows; the pager at the bottom showing Items per page 10, 1–10 of 52 items, 1 of 6 pages and the previous/next arrows](/img/curate/default.png)

The toolbar above the table holds, from left to right: the search box (magnifier icon), a gear
icon, and the **Add Intent**, **Filter** and **Load Q&A** buttons. Type in the search box to
narrow the table to matching intents.

Below the table:

- **Items per page:** — `10` (the default shown), `25`, `50`, `100` or `300`. Next to it the
  screen counts the rows, for example "1–10 of 52 items".
- A page-number selector ("of 6 pages" on the captured instance; the count follows your data).
- **Previous page** and **Next page** — the previous arrow is disabled on page 1.

#### Deleting user data

Erasing stored user data — for example to answer a GDPR or CCPA erasure request — is
destructive and cannot be undone, so it is described here and not demonstrated.

On the Curate screen, the gear icon in the toolbar is the entry point for bulk deletion. Its menu
offers **Delete all data**, **Delete all analytics** and **Delete all unEdited Answers**.

For a scripted erasure, the REST API has **DELETE /user_data**, listed in the API reference's
**User Data** group as "Delete all user data". See
[REST & Console APIs](/integrations/rest-and-console-api/) for authentication and the rest of
the reference.

### Filtering intents

![The Filter dialog: six rows of All / option / opposite tabs, all set to All, and the Category Filter list expanded with checkboxes for Other, Billing, Refunds, Technical Support and API & Integrations](/img/curate/filter-panel.png)

**Filter** (the funnel button in the toolbar) opens a dialog titled "Filter". It has six rows of
tabs; each row starts at **All** and offers a pair of opposites:

| Row | Tabs                                   |
| --- | -------------------------------------- |
| 1   | **All** · **Edited** · **Not Edited**   |
| 2   | **All** · **Flagged** · **Not Flagged** |
| 3   | **All** · **Out-of-Date** · **Current** |
| 4   | **All** · **New** · **Not New**         |
| 5   | **All** · **PII** · **Not PII**         |
| 6   | **All** · **Flow** · **Not Flow**       |

Below the tabs, **Category Filter** expands into a checkbox list of your categories — on the
captured instance `Other`, `Billing`, `Refunds`, `Technical Support`, `API & Integrations` and
`Account Access`. Several can be ticked at once.

There is no Apply button: a tab takes effect as soon as you select it. With **Edited** selected,
the table behind the dialog drops to the three intents that have edited answers:

![The Filter dialog with the Edited tab selected; behind it the table shows 1–3 of 3 items, the three intents with edited answers](/img/curate/edited.png)

**Flow** shows the intents answered by a mAIstro agent; **Not Flow** shows the intents answered by
Seek (see the toggle under [Inside an intent](#inside-an-intent-notes-examples-and-answers)).

### Inside an intent: Notes, Examples and Answers

![An expanded intent: Notes with "Click here to add notes.", the Examples header with Add Examples, Remove Auto-Generated Examples and Generate Examples, one example question, the "Run a mAIstro agent or seek for this intent." toggle set to Seek, and an answer with an Edited badge](/img/curate/intent-row-expanded.png)

Click the chevron at the start of a row to expand the intent. The expanded row has three parts.

**Notes:** — followed by the clickable text "Click here to add notes." Click it to open the
**Notes:** dialog, write your note and click **Save** (or **Cancel**).

**Examples** — the example questions grouped under the intent, each with an ⓘ icon before it
and a copy icon after it. Click the ⓘ icon to see whether the example is auto-generated or a
question a user asked. The header carries three actions:

- **Add Examples** — opens the Add Examples dialog: "Add additional examples, one question per
  line.", a text box, and **Cancel** / **Save**.
- **Remove Auto-Generated Examples** — removes the generated examples and keeps only the
  questions users actually asked. Treat it as a deletion.
- **Generate Examples** — generates a batch of example questions for the intent.

![The Add Examples dialog: "Add additional examples, one question per line." above an empty multi-line text box, with Cancel and Save](/img/curate/add-examples-panel.png)

**Answers** — the answers the intent serves, each with an ⓘ icon before it. An answer that a
person has edited carries an **Edited** badge. Above the answers is the toggle **Run a mAIstro
agent or seek for this intent.**, which reads **Seek** while it is off — the default on every
intent captured. Switch it on to answer the intent with a [mAIstro](/maistro/overview/)
agent instead of Seek: the answer is replaced by a dropdown of the available agents — a default
list, plus any agent of yours that contains a Seek node.

#### Dialogs for answers, conversations and intents

The Curate page also carries the dialogs below:

| Dialog                              | Buttons                         | What it does                                                                                                          |
| ----------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Edit Answer**                     | Cancel · Save                   | Edit the answer Seek serves for the intent.                                                                           |
| **Edit Conversation**               | Cancel · Save                   | Edit a conversation. <!-- UNCONFIRMED: read from the dialog title only; the opener was not found -->                 |
| **Enhance Conversation**            | Cancel · **Enhance**            | Enhance a conversation. <!-- UNCONFIRMED: read from the dialog title only; the opener was not found -->              |
| **Rename Intent**                   | Cancel · **Rename**             | Rename the intent to match your needs.                                                                                |
| (untitled confirmation)             | Cancel · **Confirm Delete**     | Confirm a deletion. Destructive.                                                                                      |
| **Delete and Regenerate Responses** | Cancel · **Confirm Regenerate** | Delete the answers Seek currently serves for the intent and generate new ones. Destructive.                          |
| **User Agents**                     | —                               | Pick the mAIstro agent an intent or category runs, so you can build your own workflow for it.                         |

Deleting or regenerating cannot be rolled back, so treat **Confirm Delete** and
**Confirm Regenerate** as final.

### Add Intent

![The Add Intent dialog: the "Run a mAIstro agent or seek for this intent." toggle set to Seek, then the Intent Name, Example question and Answer fields, and a Save button](/img/curate/add-intent-panel.png)

**Add Intent** in the toolbar creates an intent by hand, with its first question and answer. The
dialog has:

- **Run a mAIstro agent or seek for this intent.** — the same toggle as inside an intent; off,
  reading **Seek**, when the dialog opens. Switched on, the **Answer** box is
  replaced by a dropdown of the available agents.
- **Intent Name** — the name the intent will be listed under.
- **Example question** — the first example question.
- **Answer** — the answer to serve, in a multi-line box.
- **Save** — creates the intent.

Use it for questions you know will come and whose answer is already settled. Whether Seek then
serves that answer depends on the **Edited answer cache** setting: in the probes run for this
page, edited answers were not returned for their own example questions (see the last FAQ entry
below).

### Edit Category

![The Edit Category dialog for Refunds-Update_payment_method: the Update the category dropdown set to Refunds, the line "Add new categories on the Configure tab.", and Cancel and Save](/img/curate/refunds-panel.png)

Click an intent's category in the **Category** column to move it to another category. The
dialog is titled with the intent name ("Edit Category: Refunds-Update_payment_method") and holds:

- **Update the category** — a dropdown of your existing categories. On the captured instance:
  `Other`, `Billing`, `Refunds`, `Technical Support`, `API & Integrations`, `Account Access`.
- The line "Add new categories on the Configure tab." — categories are created in Neural Config,
  not here; see the [Neural Config overview](/configuration/overview/).
- **Cancel** and **Save**.

![The Update the category dropdown open, listing Other, Billing, Refunds (checked), Technical Support, API & Integrations and Account Access](/img/curate/refunds--options-update-the-category.png)

To recategorise several intents at once, select them and use **Edit Category** in the bulk
toolbar (next section).

### Bulk actions and export

![Screenshot needed — the Curate bulk toolbar with one intent selected](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/curate/bulk-toolbar.png — Curate with one row checkbox ticked; crop the toolbar showing "1 item selected", Edit Category, the two icon buttons, Export to Watson Assistant Actions and Cancel -->

Tick the checkbox of one or more rows to bring up the bulk-action toolbar. Its counter reads
**0 item selected** when nothing is selected, as written on screen. It holds:

- **Edit Category** — recategorise all selected intents at once (the same choice as the
  [Edit Category](#edit-category) dialog).
- Two icon buttons without a text label; one of them is **Download to CSV** (below).
- **Export to Watson Assistant Actions** — not pressed when this page was captured (see below).
- **Cancel** — clears the selection.

**Download to CSV** downloads the selected intents as a CSV with these columns:

`ID`, `Question`, `QuestionExamplesUser`, `QuestionExamples`, `score`, `kbCoverage`, `Answer`,
`AnswerID`, `Edited`, `OOS`, `Rating`, `TotalRatings`, `timestamp`, `category`, `intent`, `pii`,
`maistro`, `flag`

You can edit the file and load it back through [Load Q&A](#loading-qa-in-bulk).

The export button's label matches the **Virtual Agent Type** setting in Neural Config >
[Platform Preferences](/configuration/neural-config/platform-preferences/), whose help text reads
"When using the Curate tab to auto-buld a virtual agent, what format should be written to." On
the captured instance that setting is `Watson Assistant Actions`, the same words as the button.
The other options are `AWS Lex V2`, `Kore.ai`, `Cognigy`, `Watson Assistant Dialog`,
`Azure Knowledge Base` and `None / Webpage HTML`. Whether the button's label changes with the
setting was not checked; per the help text, the setting decides the format Curate writes, so set
it before exporting. Importing the export into your virtual agent is covered in
[Training virtual agents](/integrations/training-virtual-agents/).

![The Virtual Agent Type setting in Platform Preferences, set to Watson Assistant Actions, with its help text](/img/neural-config/platform-preferences--virtual-agent-type.png)

### Loading Q&A in bulk

![The Q&A Upload screen: Submit (disabled) and Cancel buttons, four instruction lines with a template link, the "Improve my answers (send each answer out to Seek)" toggle set to No, and the "Drag and drop files here or click to upload" area](/img/curate/load-q-a--q-a-upload.png)

**Load Q&A** in the toolbar opens a full screen headed **Q&A Upload**. It is for curating many
pairs outside NeuralSeek and loading them in one go — either new pairs, or ones you downloaded
from Curate and edited. The screen's own instructions:

- "You can either upload new Q&A pairs, or edit existing ones you have downloaded from the Curate
  tab."
- "Do not mix downloaded and new Q&A pairs in the same file."
- "If you upload new Q&A pairs, the answers for the questions will become edited answers in
  NeuralSeek and will train future language generations for similar questions. Please use this
  template."
- "Input files must retain these column titles at a minimum, but you may add additional payload
  columns."

The controls:

- **template** — a link that downloads the CSV template (`qa.csv`).
- **Improve my answers (send each answer out to Seek)** — a toggle, **No** by default and **Yes**
  when on. Turn it on when the uploaded answers have not been approved by a subject-matter expert
  and you want each one run through Seek.
- **Drag and drop files here or click to upload** — the drop area; clicking it opens the file
  picker (**Choose File**).
- **Submit** — sends the file. It is disabled until a file has been added.
- **Cancel** — leaves the screen without uploading.

CSV and Excel (XLSX) files are accepted. The file uses the same columns as a
[Download to CSV](#bulk-actions-and-export) export; at a minimum it needs `Question` and
`Answer`, and any further columns (category, intent, …) travel as payload.

Try a file of 5–10 rows first, check the result in the table, then upload the rest. Since new
pairs become edited answers that NeuralSeek may serve verbatim, only upload answers you would be
happy to see sent to a user as written.

## FAQ

### How do I see the questions and answers inside an intent?

Click the chevron at the start of the intent's row. The row expands into **Notes:**, the
**Examples** list (with **Add Examples**, **Remove Auto-Generated Examples** and **Generate
Examples**) and the **Answers** list.

### What do the two numbers in the Q&A column mean?

The white bubble with a "?" counts the intent's example questions and the blue bubble counts its
answers. `11` over `5` means 11 example questions and 5 answers.

### Can an intent be answered by a mAIstro agent instead of Seek?

The screen offers it: both the **Add Intent** dialog and every expanded intent carry the toggle
**Run a mAIstro agent or seek for this intent.**, which is off (**Seek**) by default. Switched on, the
answer is replaced by a dropdown of the available agents (a default list plus your own agents that
contain a Seek node).

### How do I upload many Q&A pairs at once?

Click **Load Q&A**, download the **template**, fill it in, drop the file on **Drag and drop files
here or click to upload**, optionally turn on **Improve my answers (send each answer out to
Seek)**, and click **Submit**. New pairs become edited answers. Keep new pairs and pairs you
downloaded from Curate in separate files.

### Why does the export button say "Watson Assistant Actions"?

On the captured instance the label matches the **Virtual Agent Type** in Neural Config >
[Platform Preferences](/configuration/neural-config/platform-preferences/), whose help text says
it decides the format Curate writes when building a virtual agent. Whether the label follows a
change to that setting was not checked; change the setting before exporting to a different
virtual agent.

### I edited an answer — why does Seek still generate a new one?

An edited answer is served in place of a generated one only when the **Edited answer cache**
threshold is met — at least that many different edited answers must exist for the question, and
`Disabled` turns the cache off. On the instance captured for [Caching](/seek/caching/) the
threshold is `3`. On the captured instance, asking an intent's own example question through the
NeuralSeek MCP's `seek` tool (input: "How can I change the card on file?", an intent with one
edited answer — below that threshold) returned a generated answer, not the edited one:

```text
The documentation does not cover how to change a card on file.
```

The cause was not established: besides the threshold, the MCP `seek` path on that instance may
answer from the documentation KnowledgeBase rather than from the Curate intents.
