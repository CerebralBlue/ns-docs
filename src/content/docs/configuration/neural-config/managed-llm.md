---
title: "Managed LLM Details"
description: "A managed LLM is a model NeuralSeek provides: in the Add an LLM dialog you choose Platform NeuralSeek, pick the model under LLM Selection, read its LLM Notes, and its card in LLM Details asks only for LLM Languages under Connection Info."
---

## What is it

A managed LLM is a language model that NeuralSeek provides for you. You add it the same way as any other model — with the **Add an LLM** button in the **LLM Details** section of Neural Config — but under **Platform** you choose **NeuralSeek** instead of an outside provider such as OpenAI or Amazon Bedrock. You then pick the model under **LLM Selection**, for example **Managed GPT**.

Once added, a managed model is a card in **LLM Details**, like any other model. What sets it apart is on that card: its **Connection Info** holds only the **LLM Languages** list, with no key, endpoint or region to fill in.

This page covers what is specific to managed models. The parts every model card shares — **LLM Functions**, **LLM Languages**, **LLM ID**, weight, **Test** and **Delete** — are explained once on [LLM Details](/configuration/neural-config/llm-details/). The list of platforms you can choose from is on [Supported LLMs](/configuration/supported-llms/).

## Why it matters

- **There is nothing to connect.** On every managed card on the screen, **Connection Info** contains a single control, **LLM Languages**. You do not need an account with the model's provider to get a working model into your configuration.
- **You can judge the model before you add it.** The **LLM Notes** panel of the **Add an LLM** dialog states the model's provider, what it is for, the functions it does not support, how many languages it supports, its **Model Code**, its **Inputs** and **Outputs**, its **Context Window** and its **Seek Multiplier**.
- **The card cannot be set up to do what the model cannot do.** The LLM Details help text says so: "Features that an LLM are not capable of will be unselectable." On a managed card, the functions its notes list as unsupported are exactly the **LLM Functions** that are greyed out.

## When to use it

- You want a model working in your configuration without arranging a provider account, key or endpoint of your own.
- You want a general-purpose text model for Seek, mAIstro and the other text functions — **Managed GPT** is one.
- You need a model for one specific job, such as image generation and image edits (**Managed gpt-image**, see [Multimodal LLM configuration](/configuration/multimodal/)) or translation (the **Translate** card, see [Language handling](/configuration/language/)).

It is the wrong choice when the model must run on your own provider account — for data-residency, contract or cost reasons — or when you need a specific model you choose yourself. The notes for **Managed GPT**, for example, say it is "pinned to the latest GPT flagship model", so the model behind it is not fixed by you. In those cases choose that provider under **Platform** instead; the platforms are listed on [Supported LLMs](/configuration/supported-llms/).

## How it works

### Add a managed model: Platform NeuralSeek

On the **Neural Config** screen, click the **Default Config** node, open the configuration dialog (`Configuration: Default Config`), expand **LLM Details** and press **Add an LLM**. The **Add an LLM** dialog opens on top of the configuration dialog.

![The Add an LLM dialog over the Configuration: Default Config dialog, with NeuralSeek selected under Platform, Managed GPT selected under LLM Selection, the OpenAI / Managed GPT notes on the right, and Cancel and Add at the bottom](/img/neural-config/add-an-llm@llm-ns-managed.png)

The dialog has two fields on the left and the model's notes on the right:

- **Platform** — who provides the model. Choose **NeuralSeek** for a managed model. Every other entry is an outside provider; the full list is on [Supported LLMs](/configuration/supported-llms/).
- **LLM Selection** — the model within the platform. With **Platform** set to **NeuralSeek**, **LLM Selection** lists the models NeuralSeek provides; select one to read its notes on the right. The screen above shows **Managed GPT** selected.

<!-- UNCONFIRMED: the NeuralSeek LLM Selection list also offers gpt-5-mini, gpt-oss-120b/20b, Managed Claude Opus/Sonnet/Haiku, gpt-4o-mini-tts, gpt-image and Translate — from the route's gap audit in the migration map; the open list was never captured -->

The list is not limited to **Managed GPT**: the cards further down this page — **Managed gpt-image**, **Translate** and **gpt-oss-20b** — are further models of the same kind, and the list on your screen is the authority on which ones are offered.

With **NeuralSeek** selected, the dialog asks for nothing else — no key, endpoint or region. That is not what makes a managed model different, though: the dialog shows only **Platform** and **LLM Selection** for other platforms too. The difference shows up on the card, described below.

At the bottom, **Cancel** closes the dialog without adding anything. **Add** is there to put the selected model on a new card in **LLM Details**. The configuration dialog behind it has its own **Propose Changes** and **Save** buttons in its footer; how changes in that dialog are kept is on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Read the LLM Notes before you add

The right half of the dialog describes the model selected under **LLM Selection**. Read it before pressing **Add**: it tells you which jobs the model can take on and which will still need another card.

![The Add an LLM dialog with Platform NeuralSeek and LLM Selection Managed GPT: the OpenAI / Managed GPT notes list the unsupported functions, 187 languages, Model Code ns-gpt-5, text and image inputs, text output, Context Window 1000000, Seek Multiplier 4.5 and a small capability and creativity chart](/img/neural-config/add-an-llm@llm-ns-managed-panel.png)

For **Managed GPT** the panel reads, top to bottom:

- **Heading** — `OpenAI / Managed GPT`, with the OpenAI logo: the provider behind the model, then the model's name. So a managed model names its underlying provider even though you chose **NeuralSeek** under **Platform**.
- **LLM Notes:** — what the model is for. For **Managed GPT**: "This mananaged model is pinned to the latest GPT flagship model for coding, reasoning, and agentic tasks across domains."
- **This LLM does not support:** — the functions the model cannot perform. For **Managed GPT**: "Table Understanding, Image Generation, Image Edits, Video, Speech, Music, Speech to Text". These are the **LLM Functions** you will find greyed out on its card.
- **Languages** — "This LLM supports 187 languages." The same number appears on the card's **LLM Languages** control.
- **Model Code** — the model's identifier, `ns-gpt-5` for **Managed GPT**. It matches the **LLM ID** printed on the card once the model is added (`LLM ID: ns-gpt-5`).
- **Inputs** and **Outputs** — icons for what the model accepts and returns. **Managed GPT** shows text and image as inputs and text as output.
- **Context Window** — `1000000` for **Managed GPT**: the amount of input the model accepts in one request.
- **Seek Multiplier** — `4.5` for **Managed GPT**. The screen does not say what this value means. The notes shown for models on other platforms, such as OpenAI or Amazon Bedrock, have no **Seek Multiplier** line.
- **Capability/Creativity chart** — a small chart of the model's capability and creativity; for **Managed GPT** it reads capability `20` and creativity `15`. The screen does not explain the scale, so use it to compare models side by side rather than as an absolute measure.

These values describe **Managed GPT**. Each managed model has its own notes; select it under **LLM Selection** to read them.

### Managed model cards in LLM Details

After a managed model is added, it is a card in **LLM Details**. The LLM Details help paragraph applies to it as to any card: "You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled."

![The LLM Details section open: the Add an LLM button, the help paragraph, and the Managed GPT and Managed gpt-image cards, each with Connection Info expanded and showing only LLM Languages with a 187 Enabled Languages chip](/img/neural-config/llm-details-panel.png)

The card's title is the model's name with the provider's logo. The card does not print its platform.

![The head of the Managed GPT card: an info icon, the name Managed GPT with the OpenAI logo, and the Copy icon](/img/neural-config/llm-details--managed-gpt.png)

**Connection Info** is where a managed card differs. It holds only **LLM Languages**: an **Enabled Languages** dropdown with a chip counting the languages enabled for the model. There is no API key, endpoint or region field. The picture below is the control as it appears on the **Managed GPT** card, with its `187` chip and the dropdown closed. How languages are handled across NeuralSeek is on [Language handling](/configuration/language/).

![The LLM Languages control of the Managed GPT card: a 187 chip in front of the closed Enabled Languages dropdown](/img/neural-config/add-an-llm@llm-ns-managed--llm-languages.png)

Below it, **LLM Functions** (with **Enable All** and **Disable All**) lists the jobs the card can take. On a managed card, the functions its notes list as unsupported are greyed out and cannot be ticked. The cards on the screen show four models, each set up differently — an example of what an instance can hold, not a default:

| Card                  | LLM ID           | LLM Languages | LLM Functions on the card                                                                                                                                                                                                                              |
| --------------------- | ---------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Managed GPT**       | `ns-gpt-5`       | `187`         | **Table Understanding** and every media function (Image Generation, Image Edits, Video, Speech, Music, Speech to Text) are greyed out, matching its notes. The text functions are selectable; here only **System AI** is ticked.                        |
| **Managed gpt-image** | `ns-gpt-image`   | `187`         | Only **Image Generation** and **Image Edits** can be ticked, and both are; every other function is greyed out. A media-only card — see [Multimodal LLM configuration](/configuration/multimodal/).                                                     |
| **Translate**         | `translate-ns`   | `96`          | Only **Translate** can be ticked, and it is; every other function is greyed out. Its **Connection Info** holds only **LLM Languages**, like the other managed cards. A translation-only card — see [Language handling](/configuration/language/). |
| **gpt-oss-20b**       | `gpt-oss-20b-ns` | `187`         | A text model: most text functions are ticked (Seek, PII Detection, Entity Extraction, Categorization, Example Generation, Intent Creation, Translate, Fallback Language Id, Fallback Sentiment, maistro); Conversation Generation, Slot Filling, Table Understanding, System AI and the media functions are greyed out. |

A function can be selectable on a card without being ticked. On the **Managed GPT** card, for example, **Translate** is available but not ticked, so that card is not used for translation; on the screen, translation is ticked on the **Translate** card and on **gpt-oss-20b**.

![The Translate function on the Managed GPT card: selectable, not ticked](/img/neural-config/llm-details--translate.png)

The rest of the card is the same for every model and is described on [LLM Details](/configuration/neural-config/llm-details/): the **LLM ID** (which matches the **Model Code** from the notes), **Weight** (`100` on each card on the screen; how weight shares the load is on [Multi-LLM](/configuration/multi-llm/)), and the **Copy**, **Delete** and **Test** buttons.

## FAQ

### What is a managed LLM?

A model NeuralSeek provides. In **LLM Details**, press **Add an LLM**, choose **NeuralSeek** under **Platform** and pick the model under **LLM Selection** — for example **Managed GPT**. Its card needs no API key: **Connection Info** holds only **LLM Languages**.

### Do I need an API key or a provider account for a managed LLM?

No field asks for one. On the managed cards — **Managed GPT**, **Managed gpt-image**, **Translate** and **gpt-oss-20b** — **Connection Info** holds only the **LLM Languages** list. To use a model on your own provider account, choose that provider under **Platform** instead; see [Supported LLMs](/configuration/supported-llms/).

### How do I know what a managed model can do before adding it?

Select it under **LLM Selection** and read the notes on the right of **Add an LLM**: what the model is for, the functions it does not support, how many languages it supports, its **Model Code**, its **Inputs** and **Outputs**, and its **Context Window**.

### Why can't I tick Image Generation on the Managed GPT card?

Because **Managed GPT** does not support it. Its notes say "This LLM does not support: Table Understanding, Image Generation, Image Edits, Video, Speech, Music, Speech to Text", and functions a model cannot perform are unselectable on its card. For image generation and image edits, use a card that supports them, such as **Managed gpt-image** — see [Multimodal LLM configuration](/configuration/multimodal/).

### What is the Seek Multiplier?

A value in the notes of a managed model — `4.5` for **Managed GPT**. The notes for models on other platforms do not show it, and the screen does not explain what it means. Ask NeuralSeek support if you need to know how it applies to you.

### Which ID do I use to call a managed model from an agent?

The **LLM ID** on its card, which is the same as the **Model Code** in its notes — `ns-gpt-5` for **Managed GPT**. The NTL `LLM` node has a `modelCard` parameter that overrides the default model for one step; whether it takes this exact identifier is not confirmed on this page. How card IDs are used is on [LLM Details](/configuration/neural-config/llm-details/).
