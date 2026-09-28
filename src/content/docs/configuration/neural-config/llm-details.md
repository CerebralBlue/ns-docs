---
title: "LLM Details"
description: "LLM Details is the section of the Neural Config Edit Configuration dialog where you add language models as cards, choose which of twenty LLM Functions each model performs, and set its LLM ID, languages and load-balancing weight."
---

## What is it

**LLM Details** is the third section of the **Edit Configuration** dialog on the **Neural Config** screen. It holds one card per model NeuralSeek is allowed to call, and on each card the list of jobs — the **LLM Functions** — that model is used for. New models come in through the **Add an LLM** button at the top of the section.

The section states its own rules in the paragraph next to that button:

> You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled.

Those four sentences are the whole model of this screen: at least one card; several cards may share a function; a box the model cannot do is greyed out; and a function no card is assigned to stops working.

## Why it matters

Almost everything in NeuralSeek that generates text, translates, classifies or produces media goes through a model card here. The checkboxes on a card are therefore not preferences — they are the on/off switches for those features. A function with no model behind it does not fall back to another model; it is disabled until a card claims it.

The cards are also where cost and capability are divided: which model answers a Seek, which one does bulk work such as categorization or example generation, and which one handles images.

## When to use it

- You are setting up an instance and need at least one model before anything else works.
- A capability you expect — translation, image generation, PII detection — is unavailable, and you want to see whether any card is ticked for it.
- You want a second model to share the load on a function, or to take one job away from an expensive model.
- You are retiring a model, renaming its identifier, or checking that its connection still works.

It is the wrong place for choosing which models exist on each provider — that catalogue is on [Supported LLMs](/configuration/supported-llms/) — and for splitting work across several models as a strategy, which is covered on [Multi-LLM](/configuration/multi-llm/).

## How it works

### Open the section

Open **Neural Config**, click the **Default Config** node on the routing tree, then **Edit Configuration**. The dialog `Configuration: Default Config` opens with its sections as an accordion; **LLM Details** is the third header, after **KnowledgeBase Connection** and **KnowledgeBase Tuning**. The other sections are listed on [Neural Config](/configuration/neural-config/).

![The Edit Configuration dialog scrolled to the LLM Details header: the Add an LLM button, the paragraph stating the load-balancing and no-fallback rules, and the top of the Managed GPT and Managed gpt-image cards, with Propose Changes and Save at the foot of the dialog](/img/neural-config/llm-details.png)

Expanding **LLM Details** shows the **Add an LLM** button, the rules paragraph, and the model cards side by side. The configuration shown here carries four cards: `Managed GPT`, `Managed gpt-image`, `Translate` and `gpt-oss-20b`.

The dialog's footer carries **Propose Changes** and **Save**, which act on the whole configuration, this section included; what each does is on [Using this page](/configuration/neural-config/using-this-page/).

### Add an LLM: Platform and LLM Selection

**Add an LLM** opens a dialog of the same name. On the left are two dropdowns; on the right, the **LLM Notes:** panel describes whichever model is selected. The footer has **Cancel** and **Add**, and there is a **Close** × at the top right.

![The Add an LLM dialog: Platform set to Amazon Bedrock and LLM Selection set to Nova Pro on the left; on the right the AWS / Nova Pro notes with the functions it does not support, its languages, Model Code nova-pro, text and image inputs, text output, Context Window 300000 and a capability and creativity chart; Cancel and Add in the footer](/img/neural-config/add-an-llm-panel.png)

- **Platform** — the provider the model runs on. Choosing a platform refills **LLM Selection** with that provider's models. The list offers, in this order: Amazon Bedrock, Azure Cognitive Services, Cloudflare, Generic (OpenAI-compatible), Google Vertex AI, DeepSeek, Perplexity, HuggingFace, NeuralSeek, OpenAI, together.ai, watsonx.ai, xAI, Xiaomi.

  ![The Platform dropdown open on Amazon Bedrock](/img/neural-config/add-an-llm--options-platform.png)

  Two entries behave differently from the rest. **NeuralSeek** lists the models NeuralSeek hosts for you, such as `Managed GPT` — see [Managed LLM](/configuration/neural-config/managed-llm/). **Generic (OpenAI-compatible)** offers `OpenAI Chat Completions`, a card whose notes say it is "only compatible with a /v1/chat/completions endpoint" — the route for a model you host yourself behind HuggingFace TGI or VLLM.

- **LLM Selection** — the model on the chosen platform. Each platform has its own list: for Amazon Bedrock it holds 19 models, starting with `Nova Pro`. The per-platform lists are on [Supported LLMs](/configuration/supported-llms/).

  ![The LLM Selection dropdown open on Nova Pro](/img/neural-config/add-an-llm--options-llm-selection.png)

The dialog itself asks for no key or endpoint — only **Platform** and **LLM Selection**.

<!-- UNCONFIRMED: Add creates a new card in LLM Details, and a model on your own provider account takes its connection settings (API or access key, secret, endpoint, region, project id) under that card's Connection Info — the section layout and the previous Neural Config overview; Add was not pressed and no provider-model card appears on the screens documented here -->

**Add** puts the selected model into **LLM Details** as a new card; **Cancel** leaves the section as it was. For a model on your own provider account, the connection settings — an API or access key, an endpoint, a region or project id, depending on the provider — are entered under the new card's **Connection Info**.

### LLM Notes: what the model can do

The **LLM Notes:** panel is the place to check a model before you add it. Its lines, for the model selected:

![Add an LLM with Platform NeuralSeek and LLM Selection Managed GPT: the OpenAI / Managed GPT notes say the model does not support Table Understanding, Image Generation, Image Edits, Video, Speech, Music and Speech to Text, supports 187 languages, Model Code ns-gpt-5, text and image inputs, text output, Context Window 1000000, Seek Multiplier 4.5, and the capability and creativity chart](/img/neural-config/add-an-llm@llm-ns-managed-panel.png)

- A heading with the model's maker and name (`AWS / Nova Pro`, `OpenAI / Managed GPT`) and a one-paragraph description.
- **This LLM does not support:** — the LLM Functions this model cannot perform. These are exactly the boxes that will be greyed out on its card. For `Managed GPT` the notes list Table Understanding, Image Generation, Image Edits, Video, Speech, Music and Speech to Text, and those seven are the greyed-out boxes on the `Managed GPT` card.
- The languages it supports — "This LLM supports all languages" for most provider models, "This LLM supports 187 languages" for `Managed GPT`.
- **Model Code** — the model's code, for example `nova-pro` or `ns-gpt-5`. On the `Managed GPT` card the same value, `ns-gpt-5`, is the card's **LLM ID:**.
- **Inputs** and **Outputs** — icons for the media the model reads and produces (text, image).
- **Context Window** — the model's context size as the notes give it, for example `300000` for Nova Pro and `1000000` for Managed GPT.
- **Seek Multiplier** — shown for some models only (`4.5` on Managed GPT); it is explained on [Multi-LLM](/configuration/multi-llm/).
- A **Capability/Creativity chart** — two lines plotting the model's capability and creativity scores (Nova Pro: capability 15, creativity 13; Managed GPT: capability 20, creativity 15).

### A model card

Every model is one card, and every card has the same parts. Reading `Managed GPT` from top to bottom:

![The header of the Managed GPT card: an info icon at the left, the card name with the provider logo, and the Copy icon at the right](/img/neural-config/llm-details--managed-gpt.png)

<!-- UNCONFIRMED: Copy duplicates the card so the same model can be used under different function assignments or a different weight — migration gap audit ("Copy LLM — duplicate a model card"); the screen names the control only "Copy" -->

- The header — an info icon, the card name with the provider logo, and **Copy** at the top right. Copy duplicates the card, the quickest way to run the same model twice with different functions or a different weight.
- **Connection Info** — a sub-accordion holding the card's connection settings. On the four NeuralSeek-managed cards it holds one control, the language list.

  ![The Connection Info sub-section of a card, expanded: a chip reading 187 with a clear button, the Enabled Languages dropdown, and the LLM Languages label under it](/img/neural-config/llm-details--llm-languages.png)

- **LLM Languages** — the languages this model is used for. The control is a dropdown named **Enabled Languages** with a count chip in front of it: `187` on `Managed GPT`, `Managed gpt-image` and `gpt-oss-20b`, `96` on `Translate`. Opening it shows a checklist of languages from `Abkhazian` to `Zulu`; on `Managed GPT` all 187 are ticked. The ticked languages are the ones the card is enabled for, and the chip counts them. How languages are handled across the instance is on [Language support](/configuration/language/).

  ![The Enabled Languages list open on the Managed GPT card: a scrolling checklist starting Abkhazian, Afar, every visible box ticked](/img/neural-config/llm-details--options-llm-languages.png)

- **LLM Functions** — the twenty checkboxes, with **Enable All** and **Disable All** as two icon controls beside the group's label. They apply to the card you click them on, not to the whole section. The functions are the next section.
- **LLM ID:** — the identifier of this card, shown as text (`LLM ID: ns-gpt-5`) with an **Edit Name** pencil beside it. The four cards here carry `ns-gpt-5`, `ns-gpt-image`, `translate-ns` and `gpt-oss-20b-ns`. The pencil opens the **Edit Card ID** dialog, with **Cancel** and **Update**.
- **Weight:** — the card's load-balancing weight, `Weight: 100` on every card here, with its own **Edit Name** pencil that opens the **Load Balancing Weight** dialog (see [Load balancing](#load-balancing-and-the-no-fallback-rule) below). Both pencils carry the accessible name **Edit Name**, so a screen reader announces the weight control as "Edit Name" too.
- **Delete** — the red trash-can button at the foot of the card. It removes the card, and with it every function that card was the only one ticked for.
- **Test** — the blue button beside **Delete**.

<!-- UNCONFIRMED: Test runs a test call against the model to check its connection and credentials, and does not save the configuration — previous Neural Config overview ("Run a test completion against the LLM, verifying the credentials. This does not 'save'") -->

**Test** sends a test call to the model to check that its connection works; it does not save the configuration.

**Connection Info**, **Copy**, **Test**, **Delete**, **Enable All**, **Disable All** and **Edit Name** work the same way on the embedding cards described on [Embedding models](/configuration/neural-config/embedding-models/).

The **LLM ID:** is the natural handle for pointing an agent at one card. The NTL `LLM` node has a `modelCard` parameter that `ntl://reference` describes as "Override the default LLM model"; the reference does not say which value it expects, so whether it takes the **LLM ID:** exactly as shown (`ns-gpt-5`) is not confirmed here.

### LLM Functions: the twenty checkboxes

Under **LLM Functions** each card carries the same twenty checkboxes. In screen order: **Seek**, **PII Detection**, **Conversation Generation**, **Entity Extraction**, **Slot Filling**, **Categorization**, **Example Generation**, **Intent Creation**, **Translate**, **Fallback Language Id**, **Fallback Sentiment**, **Table Understanding**, **System AI**, **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music**, **Speech to Text** and **maistro**.

Tick a box to make this model do that job; untick it to take the job away. Two spellings to keep apart: the lower-case **maistro** box on a model card is this page's control; the **mAIstro** checkbox on an embedding card belongs to [Embedding models](/configuration/neural-config/embedding-models/).

A checkbox is in one of three states, and each says something different. All three examples are from the `Managed GPT` card:

- Ticked — this model performs that job. **System AI** is ticked on `Managed GPT`:

  ![The System AI checkbox on the Managed GPT card, ticked](/img/neural-config/llm-details--system-ai.png)

- Clear — the model can do the job but is not assigned to it. **Seek** is clear on `Managed GPT`:

  ![The Seek checkbox on the Managed GPT card, clear](/img/neural-config/llm-details--seek.png)

- Greyed out — the model cannot do it; the function is on the "This LLM does not support" list in its notes. **Table Understanding** is greyed out on `Managed GPT`:

  ![The Table Understanding checkbox on the Managed GPT card, greyed out](/img/neural-config/llm-details--table-understanding.png)

The four cards shown here divide the work between them:

| Card                | Ticked                                                                                                                                                                                         | Greyed out                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Managed GPT`       | **System AI**                                                                                                                                                                                  | **Table Understanding**, **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music**, **Speech to Text** |
| `Managed gpt-image` | **Image Generation**, **Image Edits**                                                                                                                                                          | every other function                                                                                                 |
| `Translate`         | **Translate**                                                                                                                                                                                  | every other function                                                                                                 |
| `gpt-oss-20b`       | **Seek**, **PII Detection**, **Entity Extraction**, **Categorization**, **Example Generation**, **Intent Creation**, **Translate**, **Fallback Language Id**, **Fallback Sentiment**, **maistro** | **Conversation Generation**, **Slot Filling**, **Table Understanding**, **System AI** and the six media functions    |

Reading the table: **Seek** is answered by exactly one card, `gpt-oss-20b`. **Translate** is ticked on two cards, `Translate` and `gpt-oss-20b`, so it is load-balanced between them — while on `Managed GPT` the same box is left clear:

![The Translate checkbox on the Managed GPT card, clear](/img/neural-config/llm-details--translate.png)

**Conversation Generation** and **Slot Filling** are ticked on no card — clear on `Managed GPT`, greyed out everywhere else — so by the section's own rule those two functions are disabled in this configuration.
The six media functions — **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music** and **Speech to Text** — are covered on [Multimodal LLM configuration](/configuration/multimodal/); **Translate** and **Fallback Language Id** on [Language support](/configuration/language/).

### Load balancing and the no-fallback rule

Two rules govern what happens once more than one card exists, both from the paragraph at the top of the section:

![The LLM Details section: the Add an LLM button, the rules paragraph beside it, and the Managed GPT and Managed gpt-image cards with their Connection Info and LLM Languages](/img/neural-config/llm-details-panel.png)

- Tick the same function on two cards and NeuralSeek "will load-balance across them" for that function. **Weight:** sets each card's share: the pencil beside it opens the **Load Balancing Weight** dialog, whose range runs from `1` to `100`, with **Cancel** and **Update**. Every card here sits at `100`, so no card is favoured. How weights combine across several models is on [Multi-LLM](/configuration/multi-llm/).
- Tick a function on no card and that function is off. In the product's words, "there is no fallback and that function of NeuralSeek will be disabled." Clicking **Delete** on the only card that held a function, or **Disable All** on it, is enough. The screen gives no warning when this happens, so check the grids on the remaining cards before you delete one.

![Screenshot needed — the Load Balancing Weight dialog](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/llm-details--load-balancing-weight.png — Neural Config > Default Config > Edit Configuration > LLM Details > the pencil beside "Weight:" on any card: the open Load Balancing Weight dialog with its 1–100 range and the Cancel / Update footer. Why: the reader otherwise has only the closed "Weight: 100" row to go on. -->

## FAQ

### What happens if no model is assigned to a function?

That function stops working. The section says it plainly: "If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled." NeuralSeek does not borrow another model to cover the gap, and the screen does not warn you — read every card's **LLM Functions** grid.

### Why are some function checkboxes greyed out?

Because the model cannot do that job — "Features that an LLM are not capable of will be unselectable." The greyed boxes match the "This LLM does not support" line in the model's **LLM Notes:** in the **Add an LLM** dialog. A greyed-out box is a statement about the model, not about your permissions; to get that function, tick it on a card whose model supports it.

### How do I split traffic between two models?

Tick the same function on both cards; NeuralSeek then load-balances across them for that function. Set each card's share with the pencil beside **Weight:**, which opens the **Load Balancing Weight** dialog and accepts a value from `1` to `100`. See [Multi-LLM](/configuration/multi-llm/) for splitting strategies.

### Where do I find a model's identifier, and can an agent use it?

On the card, as **LLM ID:** — for example `ns-gpt-5` or `gpt-oss-20b-ns`. The **Edit Name** pencil beside it opens the **Edit Card ID** dialog to change it. The NTL `LLM` node's `modelCard` parameter overrides the default model for one step; whether it takes this exact identifier is not confirmed on this page.

### What is the number on the chip next to Enabled Languages?

The count of languages ticked for that model under **LLM Languages**. Three of the cards shown here read `187`; the `Translate` card reads `96`. Open **Enabled Languages** to see and change the list.

### Which providers can I add a model from?

Those on the **Platform** list in **Add an LLM**: Amazon Bedrock, Azure Cognitive Services, Cloudflare, Generic (OpenAI-compatible), Google Vertex AI, DeepSeek, Perplexity, HuggingFace, NeuralSeek, OpenAI, together.ai, watsonx.ai, xAI and Xiaomi. The models each one offers are on [Supported LLMs](/configuration/supported-llms/).
