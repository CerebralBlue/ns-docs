---
title: "Virtual agents"
description: "NeuralSeek connects to watsonx Assistant, AWS Lex and Kore.ai through setup screens under API's & Integration, which cover fallback search into NeuralSeek and round-trip monitoring of the intents you curate."
---

## What is it

A virtual agent is a chatbot built on a platform such as watsonx Assistant, AWS Lex or Kore.ai. NeuralSeek works alongside it in three ways:

- **Fallback search** — when a user asks something the bot has no intent for, the bot passes the question to NeuralSeek and returns the generated answer.
- **Answer curation** — questions and answers NeuralSeek has already generated are exported from the Curate tab into the bot as its own intents.
- **Round-trip monitoring** — NeuralSeek watches how those curated intents are used in the bot and tells you when changes to the KnowledgeBase mean an intent may need updating.

This page is the overview. Each supported platform has its own page with the step-by-step setup: [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/), [AWS Lex](/integrations/virtual-agents/aws-lex/) and [Kore.ai](/integrations/virtual-agents/kore-ai/).

## Why it matters

A bot only answers what its intents cover. Every question outside them ends in a "sorry, I did not understand" unless something else can answer it. Fallback search gives those questions an answer drawn from your KnowledgeBase, without writing a new intent for each one.

Curated answers go the other way: they sit inside the bot, so they come back immediately and do not cost a generation call. Their weakness is that they stop changing when your documents do. Round-trip monitoring closes that gap by flagging the curated intents whose source documents have changed.

## When to use it

- **Your bot runs on watsonx Assistant, AWS Lex or Kore.ai.** Open the matching setup screen under **API's & Integration** and follow the platform page linked above.
- **Your bot runs on another platform.** Call NeuralSeek from it through the [REST and Console APIs](/integrations/rest-and-console-api/) or a [Webhook](/integrations/webhook/). The listed platforms simply have guided screens; any platform that can call a REST API can use NeuralSeek.
- **You do not have a bot.** You do not need this page — ask questions on the Seek tab or embed the answers in your own application through the API instead.

## How it works

![The API's & Integration screen with the side navigation listing LexV2 Lambda, LexV2 Logs, KoreAI Logs, Watson Custom Extension and Watson Logs, and the AWS Lex V2 Lambda setup steps open](/img/admin-tools/lexv2-lambda.png)

### Which virtual-agent platforms have a setup screen

The setup screens are entries in the side navigation of **API's & Integration**. Each one is a numbered list of steps to follow in the other platform's console, with the values you need to copy — an API key and the address of your instance — shown in copyable boxes.

| Platform          | Answer questions in the bot (fallback search) | Round-trip monitoring (logs) | Setup page                                                     |
| ----------------- | --------------------------------------------- | ---------------------------- | -------------------------------------------------------------- |
| watsonx Assistant | **Watson Custom Extension**                   | **Watson Logs**              | [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/) |
| AWS Lex           | **LexV2 Lambda**                              | **LexV2 Logs**               | [AWS Lex](/integrations/virtual-agents/aws-lex/)               |
| Kore.ai           | —                                             | **KoreAI Logs**              | [Kore.ai](/integrations/virtual-agents/kore-ai/)               |

What each screen sets up:

- **Watson Custom Extension** — "Use the custom extension to call NeuralSeek within Watson Assistant's "Actions" framework." You build a custom extension in watsonx Assistant from the NeuralSeek OpenAPI file the screen offers, then connect an action to it. Details on [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).
  <!-- UNCONFIRMED: Watson Logs sets up round-trip monitoring for watsonx Assistant — the old page's platform table marks watsonx Assistant for round-trip monitoring; the Watson Logs screen itself was not captured. -->
- **Watson Logs** — the watsonx Assistant counterpart of the log screens below. Details on [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/).
- **LexV2 Lambda** — "Use the AWS Lambda archive to send user input that routes to the Lex FallbackIntent to NeuralSeek." You upload the **Lambda Archive** the screen provides as an AWS Lambda function and attach it to your bot's FallbackIntent. Details on [AWS Lex](/integrations/virtual-agents/aws-lex/).
- **LexV2 Logs** — sends your Lex bot's conversation logs to NeuralSeek: a CloudWatch log group records the bot's chats, a Lambda function built from the screen's archive reads it, and an Amazon EventBridge rule runs that function every 15 minutes. Details on [AWS Lex](/integrations/virtual-agents/aws-lex/).
- **KoreAI Logs** — a Kore.ai Dialog Task that calls NeuralSeek, started by the bot's **End of Task** event. Details on [Kore.ai](/integrations/virtual-agents/kore-ai/).

Kore.ai has no fallback-search screen. A Kore.ai bot can still ask NeuralSeek through the [REST API](/integrations/rest-and-console-api/) or a [Webhook](/integrations/webhook/).

### Round-trip monitoring

![The KoreAI Logs screen: its introduction defining round-trip monitoring, followed by the numbered Kore.ai setup steps](/img/admin-tools/koreai-logs.png)

The **KoreAI Logs** screen defines the feature in its introduction:

> "Enable Round-Trip monitoring on deployed NeuralSeek Intents. NeuralSeek will monitor the usage of NeuralSeek-curated intents leveraging KoreAI event Tasks, and will inform you of any curated intents that may need to be updated, based on changes to relevant documents in the connected KnowledgeBase."

It works in three parts:

1. **You curate intents in NeuralSeek and export them to the bot.** This happens on the [Curate](/seek/curation/) tab; see also [Training virtual agents](/integrations/training-virtual-agents/).
   <!-- UNCONFIRMED: Watson Logs covers watsonx Assistant round-trip monitoring — old page's platform table; the Watson Logs screen was not captured. -->
2. **The bot reports back how those intents are used.** That is what the "Logs" screens set up — **LexV2 Logs** ships Lex conversation logs on a 15-minute EventBridge schedule, **KoreAI Logs** calls NeuralSeek at the end of each Kore.ai task, and **Watson Logs** covers watsonx Assistant.
3. **NeuralSeek shows the result on the Curate tab.** The **LexV2 Logs** screen says that after you trigger an intent in the bot, "You will see a icon appear next to the corresponding Intent on the "Curate" tab in NeuralSeek after the next Amazon EventBridge run". A flagged intent is one whose source documents changed in the KnowledgeBase, so its curated answer may be out of date.

Round-trip monitoring is about intents that NeuralSeek curated and you exported to the bot, as the screen's definition says. For the logging NeuralSeek keeps of its own answers, see [Logging](/governance/logging/).

### Fallback search and answer curation

These are the two ways a bot gets its answers from NeuralSeek.

**Fallback search** is a form of retrieval-augmented generation: the bot hands every question it cannot match to NeuralSeek. On AWS Lex that is the FallbackIntent calling the function from **LexV2 Lambda**; on watsonx Assistant it is an action calling the extension from **Watson Custom Extension**. Each answer is generated at the time of the question, so it reflects the KnowledgeBase as it is now.

**Answer curation** exports questions and answers NeuralSeek has already generated into the bot's own format, from the [Curate](/seek/curation/) tab. The bot then answers those questions itself — faster, and without a generation call — but the answers stay as exported until you update them, which is why round-trip monitoring exists. The format Curate writes is chosen with **Virtual Agent Type** in [Platform Preferences](/configuration/neural-config/platform-preferences/); its options include formats for Cognigy and Azure Knowledge Base as well as the three platforms above. Those two platforms have no setup screen under API's & Integration, so curation export is the only guided path for them.

## FAQ

### Which chatbot platforms does NeuralSeek have setup screens for?

watsonx Assistant (**Watson Custom Extension** and **Watson Logs**), AWS Lex (**LexV2 Lambda** and **LexV2 Logs**) and Kore.ai (**KoreAI Logs**). They are in the side navigation of **API's & Integration**; each platform's page walks through its screens: [watsonx Assistant](/integrations/virtual-agents/watsonx-assistant/), [AWS Lex](/integrations/virtual-agents/aws-lex/), [Kore.ai](/integrations/virtual-agents/kore-ai/).

### My platform is not listed — can I still use NeuralSeek?

Yes. Any platform that can make an HTTP call can send questions to NeuralSeek through the [REST and Console APIs](/integrations/rest-and-console-api/) or a [Webhook](/integrations/webhook/). The listed platforms just have guided setup screens.

### What is round-trip monitoring?

NeuralSeek watches how the curated intents you exported to your bot are used, and tells you when changes to the relevant KnowledgeBase documents mean an intent may need to be updated. The bot's usage reaches NeuralSeek through a log setup such as **LexV2 Logs** or **KoreAI Logs**; for watsonx Assistant, see [its page](/integrations/virtual-agents/watsonx-assistant/).

### Where do I see round-trip results?

On the [Curate](/seek/curation/) tab. The **LexV2 Logs** screen says an icon appears next to the corresponding intent there after the next Amazon EventBridge run, which happens every 15 minutes.

### What is the difference between fallback search and answer curation?

Fallback search generates an answer when the question is asked, for questions the bot has no intent for. Answer curation copies answers NeuralSeek already generated into the bot as intents, so they are served without a generation call but need updating when your documents change.
