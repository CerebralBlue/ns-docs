---
title: "Training virtual agents"
description: "Train a virtual agent such as watsonx Assistant or AWS Lex from NeuralSeek's Curate tab: set the export format with Virtual Agent Type, give each intent enough example questions, load curated Q&A in bulk, export the selected intents and import the file in the virtual agent's console."
---

The intents NeuralSeek builds in [Curate](/seek/curation/) — each one a group of example questions with the answers NeuralSeek generated or you edited — can train a [virtual agent](/integrations/virtual-agents/) directly. You choose the format your virtual agent imports, make sure every intent has enough good example questions and approved answers, select the intents, export them, and load the file in the virtual agent's own console. The virtual agent then answers those questions itself, without a call to NeuralSeek. Use this when a set of frequent questions has stable answers you have reviewed; for questions the virtual agent cannot match, connect it to NeuralSeek for fallback search instead, as described on the per-platform pages.

## Before you begin

- Access to **Curate**, under **Admin Tools** in the top navigation, and to [Neural Config](/configuration/neural-config/using-this-page/) if the export format needs changing.
- A virtual agent to import into. Connecting it to NeuralSeek is covered per platform: fallback search and round-trip logging on [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/) and [AWS Lex](/integrations/virtual-agents/aws-lex/), round-trip logging on [Kore.ai](/integrations/virtual-agents/kore-ai/).

## Choose the format Curate exports

Curate writes its export in the format set by **Virtual Agent Type** in the **Platform Preferences** section of the Default Config, so set it to the platform your virtual agent runs on before you export — the options, the **Embed links into returned responses for Virtual Agent Types that support it.** switch and how to save the change are on [Platform Preferences](/configuration/neural-config/platform-preferences/).

## Give each intent enough example questions

<!-- UNCONFIRMED: watsonx Assistant generally needs five or more example questions per intent for a confident match — old Training virtual agents page -->

A virtual agent recognises an intent from its example questions, so check each intent's **Q&A** count on Curate and give it at least five example questions before you export it to watsonx Assistant, using **Add Examples**, **Generate Examples** and **Remove Auto-Generated Examples** as described on [Answer curation](/seek/curation/).

## Load curated Q&A in bulk

To bring in question and answer pairs you already have outside NeuralSeek, select **Load Q&A** on Curate and upload a file built from the template; the **Q&A Upload** screen, its file rules, the **Improve my answers (send each answer out to Seek)** switch and **Submit** are described on [Answer curation](/seek/curation/).

## Export the selected intents

1. On **Curate**, tick the intents you want the virtual agent to learn — only those whose answers you have reviewed.
2. In the selection bar, select the export button, which names the format it writes (**Export to Watson Assistant Actions** when **Virtual Agent Type** is `Watson Assistant Actions`), and save the downloaded file.

The selection bar and its **Cancel** are described on [Answer curation](/seek/curation/).

## Import the file into your virtual agent

The import happens in the virtual agent's console, not in NeuralSeek. The console steps below describe each platform's own screens and may differ in your version of it; check the platform's documentation if a menu has moved.

<!-- UNCONFIRMED: watsonx Assistant Actions import path (Actions > settings gear > Upload/Download > Upload > Upload and replace), the actions.json file name, and that Upload and replace replaces the assistant's existing actions with the uploaded file — old Training virtual agents page; no capture shows the watsonx Assistant console -->

- **watsonx Assistant, actions**: open **Actions**, select the settings (gear) icon, go to the **Upload/Download** tab, upload the exported file, and confirm with **Upload and replace**. The exported actions then appear in the actions list with the example questions from Curate. **Upload and replace** replaces the assistant's existing actions, and the exported file holds only the intents you selected in Curate, so download the current actions from the same tab before you upload.

<!-- UNCONFIRMED: watsonx Assistant dialog upload (Dialog > Options > Upload / Download) replaces the whole existing dialog — old Training virtual agents page; no capture shows the watsonx Assistant console -->

- **watsonx Assistant, dialog**: open **Dialog** > **Options** > **Upload / Download** and upload the file. Uploading a dialog replaces the existing dialog contents, so keep a download of the current dialog before you upload.

<!-- UNCONFIRMED: the AWS Lex V2 export is a zip imported via Bots > Actions > Import with a bot name, COPPA and IAM settings, then Build, and the imported bot does not contain existing intents from AWS — old Training virtual agents page; no capture shows the AWS console -->

- **AWS Lex V2**: in the Amazon Lex console, go to **Bots** > **Actions** > **Import**, enter a bot name, choose the exported zip file, set the COPPA and IAM permission options, and select **Import**. Open the imported bot and select **Build** before you test it. The imported bot contains only the intents you exported from Curate, not the intents of your existing Lex bots.

Once the curated intents are live in the virtual agent, their answers stay as exported until you export again. Round-trip monitoring sends the virtual agent's logs back to NeuralSeek so that Curate can flag intents whose source documents have changed; it is set up on the [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/), [AWS Lex](/integrations/virtual-agents/aws-lex/) and [Kore.ai](/integrations/virtual-agents/kore-ai/) pages.

## Troubleshooting

- **The export button names a different platform from yours.** The export follows **Virtual Agent Type**. Change it in [Platform Preferences](/configuration/neural-config/platform-preferences/), save, and return to Curate.
- **The virtual agent matches an intent only on exact wording.** The intent has too few example questions. Add or generate examples in Curate and export the intent again.
- **The virtual agent gives an outdated answer.** Exported answers do not update themselves. Edit the answer in Curate, export the intent again, and set up round-trip monitoring so Curate tells you the next time an answer goes stale.

## FAQ

### Why does the export button say "Watson Assistant Actions" when my bot is on AWS Lex?

Curate writes the format set by **Virtual Agent Type** in Neural Config > **Platform Preferences**. Set it to `AWS Lex V2`, save, and export from Curate again.

### Can I load curated answers in bulk instead of editing them one by one?

Yes. Select **Load Q&A** on Curate and upload a file built from the template. The answers in a file of new pairs become edited answers in NeuralSeek. Details are on [Answer curation](/seek/curation/).

### Where do I connect the virtual agent to NeuralSeek itself?

On the per-platform pages. [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/) and [AWS Lex](/integrations/virtual-agents/aws-lex/) cover fallback search — the virtual agent asking NeuralSeek the questions it cannot match — and the logs used for round-trip monitoring. [Kore.ai](/integrations/virtual-agents/kore-ai/) covers round-trip logging.

### Should I export curated intents or use fallback search?

Usually both. Exported intents answer your most frequent questions inside the virtual agent, with answers you approved and no generation call. Fallback search covers everything else with an answer generated from your KnowledgeBase at the time of the question. The [virtual agents overview](/integrations/virtual-agents/) compares the two.

## Related

- [Answer curation](/seek/curation/) — intents, example questions, edited answers and Load Q&A in full
- [Platform Preferences](/configuration/neural-config/platform-preferences/) — Virtual Agent Type and the link settings
- [Virtual agents](/integrations/virtual-agents/) — which platforms NeuralSeek connects to, and round-trip monitoring
- [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/) · [AWS Lex](/integrations/virtual-agents/aws-lex/) · [Kore.ai](/integrations/virtual-agents/kore-ai/)
- [Intent categorization](/governance/intent-categorization/) — the categories intents are grouped by
