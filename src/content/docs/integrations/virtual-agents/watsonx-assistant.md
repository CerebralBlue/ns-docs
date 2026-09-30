---
title: "watsonx Assistant"
description: "Connect IBM watsonx Assistant to NeuralSeek by uploading the Watson Custom OpenAPI file as a custom extension with API key auth, and send the assistant's logs back through a log webhook so NeuralSeek can flag curated intents that need updating."
---

## What is it

The watsonx Assistant integration lets an assistant built in IBM watsonx Assistant call NeuralSeek, and lets NeuralSeek watch how the intents you curated are used there. You set it up from two screens under **API's & Integration** in the NeuralSeek console:

- **Watson Custom Extension** — the steps for building a NeuralSeek custom extension in watsonx Assistant, and the OpenAPI files to download for it.
- **Watson Logs** — the steps for connecting watsonx Assistant's log webhook to NeuralSeek, for round-trip monitoring of curated intents.

Both are instruction screens: numbered steps, read-only code boxes with a copy button, and two download buttons. There is no field to fill in and nothing to save; the work itself happens in watsonx Assistant. The screens use the product's older name, Watson Assistant — this page keeps that name wherever it quotes them.

## Why it matters

watsonx Assistant handles the conversation — intents, actions, channels — while NeuralSeek answers from your KnowledgeBase. The custom extension is the bridge between the two: once it is in place, an action can pass the user's question to NeuralSeek and use the answer in its reply, instead of you writing and maintaining an answer for every question by hand. The NeuralSeek Starter Kit action gives you a working starting point rather than an empty action.

Round-trip monitoring closes the loop in the other direction. Answers you curated in NeuralSeek and deployed as intents in watsonx Assistant can go stale when the documents behind them change. With the assistant's conversation logs flowing back, NeuralSeek tracks how those intents are used and tells you which ones may need an update.

## When to use it

- **Use the custom extension** when your virtual agent runs on watsonx Assistant and you want its actions to answer from your NeuralSeek KnowledgeBase.
- Add Watson Logs once you deploy NeuralSeek-curated intents to watsonx Assistant and want to know when they drift from their source documents. It covers both the Actions and the Dialogs frameworks, while the custom extension is described for Actions only.
- For streamed answers in watsonx Assistant, see [watsonx Assistant streaming](/integrations/watsonx-assistant-streaming/).
- Not this page if your assistant runs elsewhere: see [AWS Lex](/integrations/virtual-agents/aws-lex/), [Kore.ai](/integrations/virtual-agents/kore-ai/) or the [virtual agents overview](/integrations/virtual-agents/). To call NeuralSeek from your own code rather than from an assistant, see [REST and Console API](/integrations/rest-and-console-api/).

## How it works

Open **API's & Integration** in the top navigation. The integrations are listed in the side navigation; **Watson Custom Extension** and **Watson Logs** sit next to each other, below **Teams Extension**.

The dark code boxes on both screens each have a **Copy to clipboard** button at their right edge, which copies the box's text. Some boxes hold a placeholder rather than a real value — each section below says which.

### Build the NeuralSeek custom extension in watsonx Assistant

![The Custom Extension screen: the side navigation with Watson Custom Extension selected, the intro sentence, the eight numbered steps with the Watson Custom OpenAPI file link in step 3 and a code box in step 5](/img/admin-tools/watson-custom-extension.png)

Click **Watson Custom Extension** in the side navigation. The screen's heading is **Custom Extension**, and its intro reads: "Use the custom extension to call NeuralSeek within Watson Assistant's "Actions" framework."

Before you start, create a NeuralSeek API key on the [API keys](/configuration/administration/api-keys/) screen — step 5 needs it. The screen then lists eight steps, all carried out in watsonx Assistant:

1. "On the "Integrations" tab of Watson Assistant, click "Build Custom Extension" then "Next"."
2. "Name the extension "NeuralSeek" and give a brief description. Click "Next"."
3. "Upload your NeuralSeek Watson Custom OpenAPI file. Click "Next" then "Finish"."
4. "On the new "NeuralSeek" extension tile that appears, click "Add", "Add", then "Next"."
5. "On the authentication screen, select "API key auth", and enter your api key:"
6. "Click "Next", "Finish", then "Close"."
7. "On the "Actions" tab of Watson Assistant, click "Create Action". Choose Quick Start, then select the NeuralSeek Starter Kit."
8. "Open your action and connect it to the extension you created in the previous steps."

In step 3, **Watson Custom OpenAPI file** is a link. It points to `./neuralseek.json?format=wa`, a file served by your own NeuralSeek console. Download it from there and upload it into watsonx Assistant's "Build Custom Extension" flow, then click "Next" and "Finish".

In step 5, the screen shows a code box with a **Copy to clipboard** button. The box holds the placeholder `[ Generate an API Key ]`, not a key — do not paste that text into watsonx Assistant. On watsonx Assistant's authentication screen, select "API key auth" and enter the NeuralSeek API key you created on the API keys screen.

Steps 7 and 8 give you an action to start from: the NeuralSeek Starter Kit, created through "Create Action" and Quick Start, and then connected to the extension you just built.

### Download the OpenAPI files

![The bottom of the Custom Extension screen, scrolled down: below the eight steps and a separator, the Full OpenAPI Spec File button with a download arrow and the Watson Custom OpenAPI File button with a lightning-bolt icon](/img/admin-tools/full-openapi-spec-file.png)

Below the eight steps, after a separator, the screen has two download buttons:

- **Full OpenAPI Spec File** — the screen gives no description of it beyond its name.
- **Watson Custom OpenAPI File** — it carries the same name as the file step 3 uploads. This is the one to use for the watsonx Assistant custom extension.

Clicking either button downloads a file; nothing else changes on the screen.

<!-- UNCONFIRMED: the Watson Custom OpenAPI File button downloads the same file as the step-3 link (neuralseek.json?format=wa), and the Full OpenAPI Spec File describes the whole NeuralSeek API for other API clients — inferred from the button names; the screen does not say and neither download was opened -->

The screen ties only the Watson Custom file to watsonx Assistant. The full spec is, by its name, the complete OpenAPI description of the API, for tools other than watsonx Assistant's custom extension. For the endpoints themselves, see [REST and Console API](/integrations/rest-and-console-api/).

### Round-trip monitoring with Watson Logs

Click **Watson Logs** in the side navigation, right below **Watson Custom Extension**. The screen's intro reads: "Enable Round-Trip monitoring on deployed NeuralSeek Intents. NeuralSeek will monitor the usage of NeuralSeek-curated intents within both the Actions and Dialogs frameworks of Watson Assistant, and will inform you of any curated intents that may need to be updated, based on changes to relevant documents in the connected KnowledgeBase."

<!-- SCREENSHOT: /img/admin-tools/watson-logs--webhook-setup.png — redact the host and instance id in the URL: box before publishing -->

![The Watson Logs steps 1 to 5: the gear icon in step 1, "Log webhook" in step 2, the Webhook setup box with URL: and Secret code boxes and their copy buttons in step 3, "Subscribe to conversation logs" in step 4, and the Curate-tab icon in step 5](/img/admin-tools/watson-logs--webhook-setup.png)

The steps, carried out in watsonx Assistant:

1. "On the "Environments" tab of your Watson Assistant instance, click on the gear icon (near the upper left, with the Environment name)."
2. "Under "Webhooks", select "Log webhook""
3. "Webhook setup:" — two code boxes, each with a **Copy to clipboard** button:
   - **URL:** — the log endpoint of your NeuralSeek instance, in the form `https://<console host>/logs/watson/<instance id>`. Copy it as shown on your screen and paste it into the log webhook's URL.
   - **Secret** — the box shows the API-key placeholder `[ Generate an API Key ]`, which suggests the secret is a NeuralSeek API key. Copying the box copies only the placeholder; enter a key you created on the [API keys](/configuration/administration/api-keys/) screen instead.
4. "Click the box for "Subscribe to conversation logs""
5. "Validate the connection by triggering an intent via the "Preview" tab in Watson Assistant. You will see a icon appear next to the corresponding Intent on the "Curate" tab in NeuralSeek."

The icon in step 5 is a small round blue icon; the screen does not name it. The Curate tab is where you review and edit curated answers — see [Answer curation](/seek/curation/). [Logging](/governance/logging/) covers round-trip logging in general, and the other virtual-agent log screens follow the same pattern: **LexV2 Logs** for [AWS Lex](/integrations/virtual-agents/aws-lex/) and **KoreAI Logs** for [Kore.ai](/integrations/virtual-agents/kore-ai/).

## FAQ

### Which file do I upload to watsonx Assistant?

The **Watson Custom OpenAPI file** from step 3 of the **Custom Extension** screen. Download it from the link in that step (or with the **Watson Custom OpenAPI File** button below the steps) and upload it in watsonx Assistant's "Build Custom Extension" flow, then click "Next" and "Finish".

### What do I enter on watsonx Assistant's authentication screen?

Select "API key auth" and enter a NeuralSeek API key you created on the [API keys](/configuration/administration/api-keys/) screen (step 5). The code box on the NeuralSeek screen shows only the placeholder `[ Generate an API Key ]`, so do not copy it from there.

### Is there a ready-made action I can start from?

Yes. On watsonx Assistant's "Actions" tab, click "Create Action", choose Quick Start and select the NeuralSeek Starter Kit (step 7). Then open the action and connect it to the NeuralSeek extension you built (step 8).

### How does NeuralSeek know a curated intent I deployed is out of date?

Set up the log webhook from the **Watson Logs** screen: paste the **URL:** and a **Secret** into watsonx Assistant's "Log webhook" and tick "Subscribe to conversation logs". NeuralSeek then monitors your NeuralSeek-curated intents in both the Actions and Dialogs frameworks and flags the ones that may need an update when the relevant documents in your KnowledgeBase change.

### How do I check that round-trip monitoring works?

Trigger an intent in watsonx Assistant's "Preview" tab. An icon then appears next to that intent on the "Curate" tab in NeuralSeek (step 5 of **Watson Logs**).

### What is the Full OpenAPI Spec File for?

The screen does not describe it beyond its name. By that name it is the full OpenAPI specification of the NeuralSeek API, for tools other than watsonx Assistant's custom extension. For watsonx Assistant itself, use the **Watson Custom OpenAPI File**.
