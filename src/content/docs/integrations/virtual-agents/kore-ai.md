---
title: "Kore.ai"
description: "KoreAI Logs sets up round-trip monitoring for a Kore.ai bot: a Dialog Task fired on the End of Task event posts the conversation context to NeuralSeek, which then flags curated intents whose source documents have changed."
---

## What is it

**KoreAI Logs** is the NeuralSeek screen that sets up round-trip monitoring for a bot built on Kore.ai. You open it from **API's & Integration** in the top navigation, then **KoreAI Logs** in the side navigation.

The screen does not store any setting in NeuralSeek. It is a numbered set of instructions that you follow inside the Kore.ai bot builder, with three boxes you copy values from: the URL Kore.ai posts to, the API key it authenticates with, and the request body it sends. When you finish, Kore.ai reports every completed task to NeuralSeek.

## Why it matters

Answers that NeuralSeek generated can be curated into intents and deployed in your bot (see [Answer curation](/seek/curation/)). Those intents are fixed text: when the documents behind them change in the KnowledgeBase, the bot keeps giving the old answer. The screen describes the purpose in its own words:

> NeuralSeek will monitor the usage of NeuralSeek-curated intents leveraging KoreAI event Tasks, and will inform you of any curated intents that may need to be updated, based on changes to relevant documents in the connected KnowledgeBase.

Without round-trip monitoring, finding a stale intent means re-reading every curated answer against the current documents by hand.

## When to use it

- You have deployed NeuralSeek-curated intents in a Kore.ai bot and want to know when one of them needs updating.
- You want the Kore.ai conversation context of each completed task sent to NeuralSeek for monitoring.

When it is the wrong tool:

- **Answering questions inside the bot.** The integration screens offer only round-trip logging for Kore.ai; there is no Kore.ai fallback template or extension screen. To have NeuralSeek answer a question from Kore.ai, call it through the [REST and Console APIs](/integrations/rest-and-console-api/).
- **Other bot platforms.** AWS Lex has its own screens, including **LexV2 Logs** — see [AWS Lex](/integrations/virtual-agents/aws-lex/). The platforms NeuralSeek supports are compared on [Virtual agents](/integrations/virtual-agents/).

For round-trip logging in general, see [Logging](/governance/logging/).

## How it works

### What KoreAI Logs does

![The KoreAI Logs screen under API's & Integration: the intro text and the first numbered steps](/img/admin-tools/koreai-logs.png)

Select **KoreAI Logs** in the side navigation of **API's & Integration**. The screen headed **KoreAI Logs** opens with this introduction:

> Enable Round-Trip monitoring on deployed NeuralSeek Intents. NeuralSeek will monitor the usage of NeuralSeek-curated intents leveraging KoreAI event Tasks, and will inform you of any curated intents that may need to be updated, based on changes to relevant documents in the connected KnowledgeBase.

Round-trip monitoring for Kore.ai works through an event task. You build a Dialog Task in Kore.ai whose only job is to call NeuralSeek, then attach it to Kore.ai's 'End of Task' event. From then on:

- every time a task in the bot completes, Kore.ai runs your Dialog Task;
- the Dialog Task sends a **POST** request to your NeuralSeek instance's logging URL;
- the request carries a header named `apiKey` holding a NeuralSeek API key, and a JSON body with the Kore.ai `context` of the conversation;
- NeuralSeek uses what it receives to monitor your curated intents against the documents in the connected KnowledgeBase.

Below the introduction the screen lists 17 numbered steps. They are reproduced in the next section, grouped by what they do.

### Set up round-trip monitoring with a Dialog Task and an event

![Screenshot needed — KoreAI Logs, steps 9 to 12 with the three code boxes](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/admin-tools/koreai-logs--code-boxes.png — API's & Integration > KoreAI Logs, scrolled down so steps 9 to 12 and their three code boxes (URL, apiKey value, body) with the Copy to clipboard buttons are visible. Why: the viewport capture stops at step 9, and these are the values the reader copies. -->

Keep the **KoreAI Logs** screen open in one tab and the Kore.ai bot builder in another. Labels in quotes below are Kore.ai's, as the NeuralSeek screen names them.

#### Create the Dialog Task

1. In Kore.ai, open 'Dialog Tasks' in the side panel, under 'Conversational Skills'.
2. Click 'Create Dialog'. Give the dialog a name (for example `NeuralSeek RTM`) and a description (for example `NeuralSeek Logs`), then click 'Proceed'.
3. Drag the 'Bot Action' option from the side panel onto the '+' icon below your intent.
4. Drag the 'Service' option from the side panel onto the '+' icon inside the Bot Action.
5. Click the Service node to open the right side panel.

#### Configure the REST service

6. Set the Service Type to Custom Service and the Sub Type to REST.
7. Click 'Define Request' below Request Definition.
8. Change the Request Type from GET to POST.
9. Copy the instance URL into the URL field. The first code box on the **KoreAI Logs** screen holds it, with a **Copy to clipboard** button. The URL has the form `https://<console host>/logs/lex/<instance id>`; the screen shows the full value for your instance, so copy it from there rather than typing it.
10. Click 'Headers' and create a key named `apiKey`. Copy the second code box into its value. The box on the screen reads `[ Generate an API Key ]`: create a key on the API Keys screen (see [API keys](/configuration/administration/api-keys/)) and use it as the value.
11. Click 'Body' and select `application/json` from the drop-down.
12. Copy the third code box into the body. It holds:

    ```text
    "{ "context": {{JSON.stringify(context)}} }"
    ```

    The `{{JSON.stringify(context)}}` expression is filled in on the Kore.ai side, so the body NeuralSeek receives carries the Kore.ai conversation `context`.

13. Validate the connection with the 'Test' option in the top right of Kore.ai.
14. Click 'Save' in the top right corner.

#### Trigger it on End of Task

15. Back out of the Dialog Task and open 'Intelligence', then 'Events', in the Kore.ai side panel.
16. Click 'End of Task', select 'Initiate Task', and in the drop-down pick the Dialog Task you just created.
17. The setup is complete. The screen's last step reads "You are set up for KoreAI Logs!"

Because the Dialog Task hangs off 'End of Task', it runs after every completed task in the bot, not only after curated intents.

## FAQ

### Does NeuralSeek answer questions inside my Kore.ai bot?

Not through this screen. The integration screens offer only round-trip logging for Kore.ai (**KoreAI Logs**); there is no Kore.ai fallback template or extension screen. To have Kore.ai ask NeuralSeek a question, call it through the [REST and Console APIs](/integrations/rest-and-console-api/).

### When does Kore.ai send data to NeuralSeek?

On the 'End of Task' event. The Dialog Task you create in the setup is attached to that event with 'Initiate Task', so each completed task in the bot sends one POST request to NeuralSeek.

### How do I authenticate the call?

With a request header named `apiKey` whose value is a NeuralSeek API key. Keys are created on the API Keys screen — see [API keys](/configuration/administration/api-keys/).

### What does Kore.ai send?

A JSON body (`application/json`) with one field, `context`, filled by Kore.ai with `JSON.stringify(context)`: the conversation context at the end of the task.

### What does NeuralSeek do with the logs?

It monitors how your NeuralSeek-curated intents are used and tells you which of them may need updating when the relevant documents in the connected KnowledgeBase change. Curated intents come from [Answer curation](/seek/curation/).
