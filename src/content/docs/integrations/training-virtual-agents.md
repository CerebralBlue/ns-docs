---
title: "Training virtual agents"
description: "Turn the intents, example questions and answers curated in NeuralSeek's Curate screen into training data for a virtual agent such as watsonx Assistant or AWS Lex, in the format set by Virtual Agent Type."
---

## What is it

Every question NeuralSeek answers is grouped into an intent on the **Curate** screen, with the questions users asked (the examples) and the answers NeuralSeek gave. That is the same shape a virtual agent trains on: an intent, a set of example utterances, and a response. Training a virtual agent from NeuralSeek means using Curate to build that material and then exporting it as a file your virtual agent can import.

The format of the export is not chosen on Curate. It follows the **Virtual Agent Type** setting in Neural Config, which lists Watson Assistant (Actions or Dialog), AWS Lex V2 and several other platforms.

## Why it matters

A virtual agent's classifier is only as good as its example utterances, and writing several phrasings for every intent by hand is slow work that never ends — new questions keep arriving. NeuralSeek already sees those questions in production. Exporting them from Curate moves real user phrasings, and answers you have reviewed, into the virtual agent instead of rebuilding them in a second tool.

It also lets you split the work: the virtual agent handles the intents it has been trained on, and NeuralSeek keeps answering the long tail from the KnowledgeBase.

## When to use it

- Your virtual agent (watsonx Assistant, AWS Lex or another supported type) should answer common questions itself, and NeuralSeek has already collected and answered them.
- You have a set of question/answer pairs written outside NeuralSeek and want them as edited answers, and later as intents in the virtual agent.
- An intent has too few phrasings for the virtual agent to match it reliably.

This page walks through watsonx Assistant and AWS Lex. **Virtual Agent Type** also lists Kore.ai, Cognigy, Azure Knowledge Base and None / Webpage HTML, but the steps for those targets are not described here; if you train one of them, check its own import documentation for what it accepts.

It is the wrong page when you need to **connect** NeuralSeek to the virtual agent so the agent can call it at runtime — that is covered in [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/) and [AWS Lex](/integrations/virtual-agents/aws-lex/). For the day-to-day review of questions and answers (editing, flagging, categories), see [Answer curation](/seek/curation/).

Before exporting, you may want to check answer quality on a batch of questions. The REST API covers it, under the "Test Questions" group: `POST /test` ("Test questions via batch upload") and `GET /getTestResults` ("Get Test Results"). See [REST & Console APIs](/integrations/rest-and-console-api/).

In the console, Home shows an upload button for test questions only on a newly created instance. On any instance you can instead go to [Curate](/seek/curation/) and auto-generate questions or load them with **Load Q&A**.

## How it works

The work happens in four places: Neural Config sets the export format, Curate holds the intents, examples and answers, Curate exports the selected intents, and the virtual agent imports the file.

![The Curate screen: intents with their category, Q&A counts, Coverage % and Confidence %, and the Add Intent, Filter and Load Q&A buttons](/img/curate/default.png)

### Pick the export format — Virtual Agent Type

**Virtual Agent Type** lives in **Neural Config** > **Edit Configuration** > **Platform Preferences**. Its help text reads: "When using the Curate tab to auto-buld a virtual agent, what format should be written to." The options are:

- Watson Assistant Actions
- AWS Lex V2
- Kore.ai
- Cognigy
- Watson Assistant Dialog
- Azure Knowledge Base
- None / Webpage HTML

For watsonx Assistant, choose `Watson Assistant Actions` or `Watson Assistant Dialog` to match how your assistant is built; for Lex, choose `AWS Lex V2`. The examples on this page use `Watson Assistant Actions`. Every other setting in that section is documented in [Platform Preferences](/configuration/neural-config/platform-preferences/).

![Virtual Agent Type in Platform Preferences, set to Watson Assistant Actions](/img/neural-config/platform-preferences--virtual-agent-type.png)

![The Virtual Agent Type option list](/img/neural-config/platform-preferences--options-virtual-agent-type.png)

### Build training utterances — Examples

Expand an intent on Curate (the arrow at the start of its row) to see its **Examples** — the questions that belong to the intent — next to its **Answers**. In the **Q&A** column, the white bubble counts the examples — for instance, an intent named `Other-neuralseek` showing 11. These examples are what the export turns into training utterances, so the more realistic phrasings an intent has, the better the virtual agent can match it.

The **Examples** header carries three actions:

- **Add Examples** opens a dialog: "Add additional examples, one question per line." Type the phrasings your users actually use, one per line, then **Save** (or **Cancel**).
- **Generate Examples** sits next to it and generates a batch of example questions for the intent. **Remove Auto-Generated Examples** removes those generated examples again and keeps only the questions users actually asked.

Curate does not show a required number of examples; check your virtual agent's own guidance for how many utterances an intent needs.

![An expanded intent: Notes, the Examples header with Add Examples, Remove Auto-Generated Examples and Generate Examples, and the Answers list](/img/curate/intent-row-expanded.png)

![The Add Examples dialog: one question per line, with Cancel and Save](/img/curate/add-examples-panel.png)

The full intent row, including notes, answer editing and the mAIstro toggle, is covered in [Answer curation](/seek/curation/).

### Load curated Q&A in bulk — Load Q&A

When the questions and answers are written outside NeuralSeek, **Load Q&A** on the Curate toolbar opens the **Q&A Upload** screen. Its instructions say:

- "You can either upload new Q&A pairs, or edit existing ones you have downloaded from the Curate tab."
- "Do not mix downloaded and new Q&A pairs in the same file."
- "If you upload new Q&A pairs, the answers for the questions will become edited answers in NeuralSeek and will train future language generations for similar questions."
- "Input files must retain these column titles at a minimum, but you may add additional payload columns."

The **template** link downloads `qa.csv`, the file whose column titles you must keep. Drop your file on "Drag and drop files here or click to upload", decide on **Improve my answers (send each answer out to Seek)** (a toggle that reads "No" when off), and press **Submit** — it stays disabled until a file is chosen.

CSV and Excel (XLSX) files are accepted. The file uses the same columns as a Curate **Download to CSV** export (`ID`, `Question`, `QuestionExamplesUser`, `QuestionExamples`, `score`, `kbCoverage`, `Answer`, `AnswerID`, `Edited`, `OOS`, `Rating`, `TotalRatings`, `timestamp`, `category`, `intent`, `pii`, `maistro`, `flag`); at a minimum it needs `Question` and `Answer`. See [Loading Q&A in bulk](/seek/curation/#loading-qa-in-bulk).

Uploaded pairs become intents with edited answers on Curate, and from there they export like any other intent.

![Q&A Upload: Submit, Cancel, the template link, the Improve my answers (send each answer out to Seek) toggle, and the Load Q&A drop zone](/img/curate/load-q-a--q-a-upload.png)

### Export from Curate — Export to Watson Assistant Actions

Tick the checkbox of one or more intents (the box in the header row selects the whole page). A selection toolbar replaces the normal one: a counter ("0 item selected" when nothing is ticked), **Edit Category**, two icon buttons, **Export to Watson Assistant Actions** and **Cancel**.

<!-- UNCONFIRMED: that Export to Watson Assistant Actions downloads the selected intents in the Virtual Agent Type format — inferred from the Virtual Agent Type help text; the button was never clicked. Also: the button label follows the type (e.g. "Export to AWS Lex V2"), and the export file is actions.json for Actions and a .zip for Lex — old docs page -->

The help text of **Virtual Agent Type** says it sets the format Curate writes when building a virtual agent, so **Export to Watson Assistant Actions** is expected to write the selected intents in that format. With the type set to `Watson Assistant Actions`, the button carries that name.

According to earlier documentation, the button label changes with the type (for example "Export to AWS Lex V2"), the Watson Assistant Actions export is a file named `actions.json`, and the AWS Lex export is a `.zip`.

![Screenshot needed — Curate selection toolbar with Export to Watson Assistant Actions](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/curate/bulk-toolbar.png — Curate with one or more intents ticked; crop the selection toolbar showing the item counter, Edit Category, the icon buttons, Export to Watson Assistant Actions and Cancel. Why: the toolbar only exists while rows are selected and was never captured. -->

### Import into watsonx Assistant or AWS Lex

The last step happens in the virtual agent, not in NeuralSeek, so this page does not show its screens. Today's Curate toolbar has search, a settings gear, Add Intent, Filter and the upload button — there is no "Import Base …" button on it, so the base-import steps that earlier documentation describes are either gone or have moved.

<!-- UNCONFIRMED: the Watson Actions / Watson Dialog / AWS Lex (Bot Merge Import, Bot Import Only) import procedures and the "Import Base Watson Assistant Dialog" / "Import Base AWS Lex V2" buttons — old docs page; third-party screens and no such button in the capture -->

What earlier documentation describes:

- _watsonx Assistant, as Actions._ In the assistant, open Actions, the settings gear, then the "Upload/Download" tab; upload the exported file and confirm "Upload and replace". The exported actions then appear in the assistant's action list with their example questions.
- _watsonx Assistant, as Dialogs._ Uploading a dialog to Watson Assistant replaces the existing dialog, so the old flow first downloaded the assistant's dialog JSON and loaded it into NeuralSeek as a base ("Import Base Watson Assistant Dialog"). The export then merged the curated intents into that base. Whenever the dialog changed in Watson Assistant, the base had to be loaded again, or newer dialog content would be lost.
- _AWS Lex, Bot Merge Import._ Export the existing bot from the AWS Lex console, load it into NeuralSeek as a base ("Import Base AWS Lex V2"), export the merged .zip from Curate, import it in Lex as a new bot, then Build. The new bot holds both the original intents and the NeuralSeek ones.
- _AWS Lex, Bot Import Only._ Export the selected intents from Curate and import the .zip in Lex as a new bot, then Build. The bot holds only the NeuralSeek intents.

Check the import screen of your virtual agent before you upload, since a replace-style import overwrites what is there. The connection itself — how the virtual agent calls NeuralSeek at runtime — is set up in [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/) and [AWS Lex](/integrations/virtual-agents/aws-lex/).

## FAQ

### How do I choose between Watson Assistant Actions, Watson Assistant Dialog and AWS Lex?

Set **Virtual Agent Type** in Neural Config > Edit Configuration > Platform Preferences. Curate writes its export in the format selected there; see [Platform Preferences](/configuration/neural-config/platform-preferences/).

### How many example questions does an intent need?

Curate shows no required number. Follow your virtual agent's guidance, and use **Add Examples** for the phrasings your users actually use. **Generate Examples** adds a batch of generated phrasings; **Remove Auto-Generated Examples** takes them out again and leaves only real user questions.

### Can I train with Q&A I wrote outside NeuralSeek?

Yes. Use **Load Q&A** on Curate with the **template** file. New pairs become edited answers in NeuralSeek, and you can then select those intents and export them.

### Where do I test a batch of questions before training?

The REST API reference lists `POST /test` ("Test questions via batch upload") and `GET /getTestResults` ("Get Test Results") under "Test Questions" — see [REST & Console APIs](/integrations/rest-and-console-api/). In the console, Home offers a test-question upload only on a newly created instance; otherwise use [Curate](/seek/curation/) to auto-generate questions or load them.

### Will the export overwrite my existing bot?

That depends on how the virtual agent imports it, not on NeuralSeek. Earlier documentation describes Watson Assistant's "Upload and replace" and a separate merge flow for AWS Lex; check the import screen of your agent before uploading.
