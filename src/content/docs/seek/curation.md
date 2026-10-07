---
title: "Answer curation"
description: "Use Curate to review the intents NeuralSeek builds from your users' questions, correct their answers, add example questions and intents, upload curated Q&A in bulk, and export intents to your virtual agent."
---

Every question asked through [Seek](/seek/overview/) lands in an intent: a group of questions with the same meaning, together with the answers NeuralSeek gave to them. **Curate** is where you review those intents and decide which answer your users should get. Use it to spot intents that are answered with little confidence, correct an answer so that your approved text is stored for the intent, add the phrasings people actually use, file intents in the right category, load question-and-answer pairs you wrote elsewhere, and send selected intents to your [virtual agent](/integrations/virtual-agents/). To open it, select **Admin Tools** > **Curate**.

## Read the intent table

Each row of the table is one intent. Read it before you change anything: the columns tell you how often the intent is answered well and where a curator has already worked.

![The Curate table: the toolbar with Add Intent, Filter and Load Q&A, ten intents with their Q&A counts, Coverage % and Confidence % charts, and the pager](/img/curate/default.png)

- **Category** — the category the intent is filed under. Select it (its tooltip reads `<category> (Click to Edit)`) to move the intent to another category; see [Move an intent to another category](#move-an-intent-to-another-category). Categories themselves are defined in [Intent categorization](/governance/intent-categorization/).
- **Intent** — the intent's name. Select the **Intent** header to sort the table by name.
- **Q&A** — two counts: the upper number is how many example questions the intent groups, the lower number how many answers are stored for it. An intent showing 11 over 5 holds eleven example questions and five answers.

<!-- UNCONFIRMED: the charts show how the intent's answers were distributed across scores; Coverage % = how much the KnowledgeBase contributed to the answer, Confidence % = how likely the answer is to satisfy the user — old Curate page -->

- **Coverage %** and **Confidence %** — a small chart per row on a 0–100 axis, showing where the intent's answers scored. Coverage reflects how much of the answer the KnowledgeBase supported; confidence reflects how likely the answer is to satisfy the person who asked. On the confidence chart, peaks near 100 are green and peaks near 0 orange or red, so a red peak near 0 marks an intent to review first.
- **Governance** — the **View Governance for this intent** icon. Governance reporting is described in [Governance](/governance/overview/).

Icons next to an intent's name flag what has happened to it. Hover over one to read its tooltip:

| Tooltip | What it tells you |
| --- | --- |
| This intent has edited answers. | A curator has corrected at least one of its answers. |
| This intent has new answers. | The intent has new answers; the **New** filter lists these intents. |
| This intent has PII in it. | One of its questions contained personal data, which is masked in the stored question. Inside the intent, that question is marked "This question has PII in it." and its answer "This answer was formed from a question with PII in it." See [PII detection](/governance/pii-detection/). |

To move through a long list:

1. Set **Items per page:** to `10`, `25`, `50`, `100` or `300`.
2. Use **Previous page** and **Next page**, or pick a page number from the list next to them. The pager also shows how many intents match, for example "1–10 of 54 items".

Which intent a new question is grouped into is decided by the intent-matching settings in [Intent Matching & Cache Configuration](/configuration/neural-config/intent-matching-caching/).

## Find intents with search and Filter

When the table spans many pages, narrow it to the intents that need attention.

<!-- UNCONFIRMED: typing a keyword in the toolbar's search box narrows the list of intents — old Curate page ("Searching the intent") -->

To look for an intent by keyword, select the magnifier icon on the toolbar and type in the search box.

To filter by status or category:

1. Select **Filter** on the toolbar.
2. In each status row, choose a tab. **All** ignores that status, the middle tab keeps only the intents that have it, and the right tab keeps only the intents that do not:
   - **All** · **Edited** · **Not Edited**
   - **All** · **Flagged** · **Not Flagged**
   - **All** · **Out-of-Date** · **Current**
   - **All** · **New** · **Not New**
   - **All** · **PII** · **Not PII**
   - **All** · **Flow** · **Not Flow**
3. To limit the list to some categories, open **Category Filter** and select the checkbox of each category you want to see. The list shows your own categories.
4. Close the dialog.

![The Filter dialog: six status rows set to All and the Category Filter list open with one checkbox per category](/img/curate/filter-panel.png)

The table updates as soon as you choose a tab. A status filter also applies inside an intent: with **Edited** selected, an intent shows only its edited answers, not the answers nobody changed.

![With Edited selected, the table behind the Filter dialog is down to three intents](/img/curate/edited.png)

## Review an intent: notes, examples and answers

Expand an intent to see the questions it groups and the answers stored for it, and to annotate it for the next curator.

![Placeholder: an expanded intent in Curate, with Notes, the Examples list and the Answers list](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/curate/intent-expanded.png — Admin Tools > Curate > select a row's expand chevron: Notes:, the Examples heading with Add Examples / Generate Examples / Remove Auto-Generated Examples, and the Answers list with an answer marked Edited. Why: no capture shows an open intent, and readers need to see where the example and answer controls are -->

1. Select the chevron at the start of the intent's row.
2. To leave a note for the next curator, select the text next to **Notes:**, type your note, and select **Save**.
3. Review the questions under **Examples**. These are the questions that match the intent. To add the phrasings your users actually use:
   - **Add Examples** opens a dialog where you type your own example questions; select **Save** to add them.
   - **Generate Examples** has NeuralSeek generate more example questions for the intent.
   - **Remove Auto-Generated Examples** deletes the examples NeuralSeek generated.
4. Review the list under **Answers**: the answers stored for this intent, one per row.

At the top of the Answers list, the **Run a mAIstro agent or seek for this intent.** switch decides what answers a question that matches this intent. Off, it shows **Seek**: the question is answered by Seek, as usual. Switch it on to have a [mAIstro](/maistro/overview/) agent answer this intent instead.

## Correct an answer

When an answer is wrong, incomplete or in the wrong tone, correct it so that your approved text is the answer for that intent.

<!-- UNCONFIRMED: an answer is edited by selecting it, changing its text in the Edit Answer dialog and saving — old Curate page ("Editing the Answer"); the Edit Answer dialog exists on the screen but was not opened -->

1. In the **Answers** list, select the answer.
2. Change its text and select **Save**.

The corrected answer ends with the marker **Edited**, and the intent shows the "This intent has edited answers." icon. An edited answer is the one your curators approved, and Seek can serve it when a later question matches the intent; the conditions under which stored answers are reused are explained in [Caching](/seek/caching/).

You can format an edited answer with Markdown. Curate shows it rendered: an answer stored as `choose **Forgot password**` appears in the Answers list as "choose Forgot password", and Seek returns the Markdown as written.

## Add an intent by hand

Add an intent when you already know a question your users will ask and the answer they should get, before anyone has asked it.

1. Select **Add Intent** on the toolbar.
2. Leave **Run a mAIstro agent or seek for this intent.** at **Seek** to answer the intent with Seek, or switch it on to answer it with a mAIstro agent.
3. In **Intent Name**, type a name for the intent.
4. In **Example question**, type one question the intent should match.
5. In **Answer**, type the answer to store for it.
6. Select **Save**.

![The Add Intent dialog: the Seek / mAIstro switch, Intent Name, Example question and Answer, and Save](/img/curate/add-intent-panel.png)

Add more phrasings of the question afterwards with **Add Examples** or **Generate Examples** (see [Review an intent](#review-an-intent-notes-examples-and-answers)).

## Move an intent to another category

When an intent was filed in the wrong category, move it:

1. In the intent's row, select its category (the tooltip reads `<category> (Click to Edit)`). The **Edit Category:** dialog opens with the intent's name in its title.
2. In **Update the category**, choose the category the intent belongs in. The list holds the categories already defined for your instance.
3. Select **Save**.

![The Edit Category dialog with the Update the category list and the note "Add new categories on the Configure tab."](/img/curate/refunds-panel.png)

The dialog only moves an intent between existing categories. As it says, "Add new categories on the Configure tab": you create categories in Neural Config, as described in [Intent categorization](/governance/intent-categorization/). To move several intents at once, use **Edit Category** on the selection bar (see [Act on several intents at once](#act-on-several-intents-at-once)).

## Upload curated Q&A in bulk with Load Q&A

When your experts have written questions and answers outside NeuralSeek, or you have edited Q&A you downloaded from Curate, upload them as a file instead of typing each one.

The **Q&A Upload** screen states the rules:

- "You can either upload new Q&A pairs, or edit existing ones you have downloaded from the Curate tab."
- "Do not mix downloaded and new Q&A pairs in the same file."
- "If you upload new Q&A pairs, the answers for the questions will become edited answers in NeuralSeek and will train future language generations for similar questions."
- "Input files must retain these column titles at a minimum, but you may add additional payload columns."

To upload a file:

1. Select **Load Q&A** on the toolbar. The **Q&A Upload** screen opens.
2. For new Q&A pairs, select **template** to download the template, a CSV file (`qa.csv`), and fill it in, keeping its column titles. Add your own payload columns if you need them.
   <!-- UNCONFIRMED: the template's minimum columns are question and answer, one question per row, and the upload accepts CSV and XLSX files — old Curate page ("Uploading Q/A Files", title CSV/XLSX) -->
   Put one question and its answer on each row.
3. Set **Improve my answers (send each answer out to Seek)** to **No** or **Yes**. With **Yes**, each answer in the file is sent out to Seek.
4. Drag the file onto **Drag and drop files here or click to upload**, or select that area and pick the file.
5. Select **Submit**. It stays unavailable until a file is added. **Cancel** leaves the screen without uploading.

![The Q&A Upload screen: Submit and Cancel, the upload rules with the template link, the Improve my answers switch set to No, and the Drag and drop files here or click to upload area](/img/curate/load-q-a.png)

Before a large upload, try a file with a handful of rows and check the resulting intents in the table.

## Act on several intents at once

Select intents with the checkbox at the start of their rows to act on all of them together. A selection bar appears and counts the intents you selected.

![Placeholder: the Curate selection bar with one intent selected](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/curate/selection-bar.png — Admin Tools > Curate > select one row's checkbox: the selection bar with its counter, Edit Category, Export to Watson Assistant Actions and Cancel. Why: the bar only appears after a selection, so readers cannot find it from the default screen -->

1. Select the checkbox of each intent you want to act on.
2. Choose an action:
   - **Edit Category** moves every selected intent to one category.
   - **Export to Watson Assistant Actions** exports the selected intents to build your virtual agent. The format the export writes is set in Neural Config by **Virtual Agent Type** (see [Platform Preferences](/configuration/neural-config/platform-preferences/)); how to train a virtual agent from Curate is covered in [Training virtual agents](/integrations/training-virtual-agents/).
3. Select **Cancel** to clear the selection.

## Verify your curation

1. Open **Filter** and select **Edited**. The intents you corrected are listed, each showing only its edited answers.
2. On the **Seek** tab, ask one of the intent's example questions exactly as it appears under **Examples**. When the question matches the intent, the answer is your edited text. If it still gets a newly generated answer, check the intent's examples and the settings in [Intent Matching & Cache Configuration](/configuration/neural-config/intent-matching-caching/).
3. Ask the same question in other words. A phrasing that does not match the intent can get a newly generated answer instead of your edited one. If people ask it that way, add it to the intent with **Add Examples**, and review the matching settings in [Intent Matching & Cache Configuration](/configuration/neural-config/intent-matching-caching/).

## FAQ

### Why does an intent show two numbers in the Q&A column?

The upper number counts the example questions grouped in the intent; the lower number counts the answers stored for it.

### Where do I create a new category for intents?

Not in Curate. The **Edit Category:** dialog lists only existing categories and says "Add new categories on the Configure tab." Categories are created in Neural Config; see [Intent categorization](/governance/intent-categorization/).

### What happens to the answers I upload with Load Q&A?

For new Q&A pairs, the upload screen says the answers "will become edited answers in NeuralSeek and will train future language generations for similar questions." They are treated like answers a curator corrected by hand.

### How do I see only the answers I have corrected?

Select **Filter** > **Edited**. The table narrows at once to the intents with edited answers, and inside each intent only the edited answers stay visible.

## Related

- [Caching](/seek/caching/) — how stored and edited answers are reused.
- [Intent categorization](/governance/intent-categorization/) — define the categories intents are filed under.
- [Intent Matching & Cache Configuration](/configuration/neural-config/intent-matching-caching/) — how a question is matched to an intent.
- [Training virtual agents](/integrations/training-virtual-agents/) — export curated intents to a virtual agent.
- [PII detection](/governance/pii-detection/) — how personal data in questions is found and masked.
- [Feedback](/integrations/feedback/) — collect ratings on the answers your users receive.
- [Governance overview](/governance/overview/) — reporting on intents, answers and their sources.
- [Seek overview](/seek/overview/) — how Seek answers the questions that Curate groups into intents.
- [mAIstro overview](/maistro/overview/) — build the agents an intent can be answered by.
