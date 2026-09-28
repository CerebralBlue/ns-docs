---
title: "watsonx Assistant"
description: "Connect IBM watsonx Assistant to NeuralSeek by uploading the Watson Custom OpenAPI file as a custom extension, authenticating with a NeuralSeek API key, and starting from the NeuralSeek Starter Kit action."
---

## What is it

The watsonx Assistant integration lets an assistant built in IBM watsonx Assistant call NeuralSeek from its **Actions**. You set it up from two screens under **API's & Integration** in the NeuralSeek console:

- **Watson Custom Extension** — step-by-step instructions for building a NeuralSeek custom extension in watsonx Assistant, the API key to authenticate it, and the OpenAPI files to download.
- **Watson Logs** — the setup for sending watsonx Assistant's logs back to NeuralSeek, so NeuralSeek can monitor the curated intents you deployed there.

Both are instruction screens. Nothing on them is saved as a setting: the controls are links, a copyable code box and download buttons. The work itself happens in watsonx Assistant.

## Why it matters

watsonx Assistant handles the conversation — intents, actions, channels — while NeuralSeek answers from your KnowledgeBase. The custom extension is the bridge: once it is in place, an action can pass the user's question to NeuralSeek and use the answer in its reply, instead of you writing and maintaining an answer for every question by hand. The **NeuralSeek Starter Kit** action gives you a working starting point rather than an empty action.

Round-trip logging closes the loop in the other direction. Answers you curated in NeuralSeek and deployed as intents in watsonx Assistant can go stale when the source documents change; with the assistant's logs flowing back, NeuralSeek can tell you which of those intents need an update.

## When to use it

- **Use it** when your virtual agent runs on watsonx Assistant and you want its actions to answer from your NeuralSeek KnowledgeBase.
- **Add Watson Logs** once you deploy NeuralSeek-curated intents to watsonx Assistant and want to be told when they drift from the documents they came from.
- **For streamed answers** in watsonx Assistant, build on this same custom extension and follow [watsonx Assistant streaming](/integrations/watsonx-assistant-streaming/), which also uses the **Watson Custom OpenAPI File**.
- **Not this page** if your assistant runs elsewhere: see [AWS Lex](/integrations/virtual-agents/aws-lex/), [Kore.ai](/integrations/virtual-agents/kore-ai/) or the [virtual agents overview](/integrations/virtual-agents/). To call NeuralSeek from your own code rather than from an assistant, see [REST and Console API](/integrations/rest-and-console-api/).

## How it works

Open **API's & Integration** in the top navigation (it is also the first item of the **Admin Tools** menu). The integrations are listed in the side navigation; **Watson Custom Extension** and **Watson Logs** sit next to each other, below **Teams Extension**.

### Connect watsonx Assistant with the custom extension

![The Custom Extension screen: the side navigation with Watson Custom Extension selected, the eight numbered steps, step 3 with the Watson Custom OpenAPI file link; the Full OpenAPI Spec File and Watson Custom OpenAPI File buttons are cut off at the bottom edge](/img/admin-tools/watson-custom-extension.png)

Click **Watson Custom Extension** in the side navigation. The screen's heading is **Custom Extension**, and its intro reads: "Use the custom extension to call NeuralSeek within Watson Assistant's "Actions" framework." (The screen uses the older name, Watson Assistant; the steps below quote it where they quote the screen.)

Before you start, create a NeuralSeek API key under [API keys](/configuration/administration/api-keys/) — step 5 needs it. Then, in watsonx Assistant:

1. On the "Integrations" tab, click "Build Custom Extension", then "Next".
2. Name the extension "NeuralSeek" and give it a brief description. Click "Next".
3. Upload your NeuralSeek **Watson Custom OpenAPI file**. Click "Next", then "Finish".
4. On the new "NeuralSeek" extension tile that appears, click "Add", "Add", then "Next".
5. On the authentication screen, select "API key auth" and enter your NeuralSeek API key.
6. Click "Next", "Finish", then "Close".
7. On the "Actions" tab, click "Create Action". Choose Quick Start, then select the NeuralSeek Starter Kit.
8. Open your action and connect it to the extension you created in the previous steps.

In step 3, **Watson Custom OpenAPI file** is a link on the screen: it points to `neuralseek.json?format=wa`, a file served by your own NeuralSeek console. Download it from there (or with the **Watson Custom OpenAPI File** button below the steps) and upload it into watsonx Assistant.

In step 5, the screen shows a code box with a **Copy to clipboard** button. The box shows the placeholder `[ Generate an API Key ]` — do not paste that text into watsonx Assistant. Copy the key you created under **API Keys** instead, and paste it into watsonx Assistant's "API key auth" field.

### Download the OpenAPI files

Below the eight steps, the screen has two download buttons. Pick the file that matches what you are building:

| Button                         | What it is                                                                     | When to use it                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Watson Custom OpenAPI File** | The OpenAPI file that step 3 uploads into watsonx Assistant's custom extension | Building the watsonx Assistant custom extension — this is the one to use here                                   |
| **Full OpenAPI Spec File**     | The full OpenAPI specification of the NeuralSeek API                           | Other API clients and tools that import a standard OpenAPI file, when you need more than the extension's subset |

<!-- UNCONFIRMED: the Full OpenAPI Spec File describes every NeuralSeek endpoint and suits other API clients, while the Watson Custom file is the subset/format watsonx Assistant's custom-extension importer accepts — inferred from the button names; the screen does not say, and neither file's contents were checked -->

The screen itself only ties the **Watson Custom OpenAPI File** to watsonx Assistant (step 3); it does not describe the full spec further. If you are unsure, use the Watson Custom file for watsonx Assistant, and the full spec for everything else.

![The two download buttons below the steps: Full OpenAPI Spec File and Watson Custom OpenAPI File](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/admin-tools/watson-custom-extension--downloads.png — API's & Integration > Watson Custom Extension, scrolled down: the Full OpenAPI Spec File and Watson Custom OpenAPI File buttons, which are cut off at the bottom of the viewport image -->

### Round-trip logging with Watson Logs

**Watson Logs** is the entry right below **Watson Custom Extension** in the side navigation. It opens the setup for round-trip logging from watsonx Assistant: watsonx Assistant sends its logs back to NeuralSeek, which then watches how your NeuralSeek-curated intents are used and warns you when one may need an update because the documents behind it changed in your KnowledgeBase. The Kore.ai version of the same screen describes it as: "NeuralSeek will monitor the usage of NeuralSeek-curated intents … and will inform you of any curated intents that may need to be updated, based on changes to relevant documents in the connected KnowledgeBase."

<!-- UNCONFIRMED: Watson Logs holds the round-trip logging setup for watsonx Assistant, on the same pattern as LexV2 Logs and KoreAI Logs — inferred from the side-navigation label and the sibling log screens; the Watson Logs screen itself is not yet documented -->

Follow the steps on the **Watson Logs** screen to connect your assistant. The other virtual-agent log screens work the same way — see [AWS Lex](/integrations/virtual-agents/aws-lex/) (**LexV2 Logs**) and [Kore.ai](/integrations/virtual-agents/kore-ai/) (**KoreAI Logs**) — and [Logging](/governance/logging/) explains round-trip logging in general.

![The Watson Logs screen with its round-trip logging setup steps](/img/_placeholder.svg)

<!-- SCREENSHOT: /in-watsonlog not captured — API's & Integration > Watson Logs: the whole screen, its setup steps, code boxes and any download button -->

## FAQ

### Which OpenAPI file do I upload to watsonx Assistant?

The **Watson Custom OpenAPI File**. Step 3 of the **Custom Extension** screen uploads it into watsonx Assistant's "Build Custom Extension" flow; you can get it from the link in that step or from the button of the same name below the steps.

### What authentication does the extension use?

"API key auth", with a NeuralSeek API key (step 5). Create the key under [API keys](/configuration/administration/api-keys/) and paste it into watsonx Assistant. The code box on the screen shows the placeholder `[ Generate an API Key ]`, not a key.

### Is there a ready-made action I can start from?

Yes. On watsonx Assistant's "Actions" tab, click "Create Action", choose Quick Start and select the NeuralSeek Starter Kit (step 7). Then open the action and connect it to the NeuralSeek extension you built (step 8).

### How do I know when a curated answer I deployed to watsonx Assistant is out of date?

Set up round-trip logging on the **Watson Logs** screen. With watsonx Assistant's logs flowing back, NeuralSeek monitors your NeuralSeek-curated intents and flags the ones that may need an update when the relevant documents in your KnowledgeBase change. See [Logging](/governance/logging/).

### What is the Full OpenAPI Spec File for?

It downloads the full OpenAPI specification of the NeuralSeek API. The screen does not say more; it is the file to reach for when a tool other than watsonx Assistant's custom extension needs a description of the API. For watsonx Assistant itself, use the **Watson Custom OpenAPI File**.
