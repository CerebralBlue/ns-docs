---
title: "Supported LLMs"
description: "The language models NeuralSeek supports are the ones offered by the Add an LLM dialog in Neural Config's LLM Details section — 14 platforms including xAI, DeepSeek, Perplexity, Xiaomi and NeuralSeek's own managed models — and each model's LLM Notes state what it cannot do before you add it."
---

## What is it

A model is supported by NeuralSeek when you can pick it in the **Add an LLM** dialog. The dialog
has two dropdowns — **Platform** (the provider) and **LLM Selection** (the model on that
provider) — and a **LLM Notes** panel describing the model you picked. You open it from the
**LLM Details** section of a configuration.

This page walks through that dialog: the platforms it lists, the models shown for each, and how
to read **LLM Notes**. It does not keep a hand-made model catalogue — the dialog is the
catalogue, and it changes as providers release models. Everything about a model once it is added
(its languages, functions, weight, test and delete) is on
[LLM Details](/configuration/neural-config/llm-details/).

## Why it matters

The models you add decide which parts of NeuralSeek work at all. The **LLM Details** section says
so in its own help text:

> You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them
> for the selected functions that have multiple LLM's. Features that an LLM are not capable of
> will be unselectable. If you do not provide an LLM for a function, there is no fallback and
> that function of NeuralSeek will be disabled.

So "is my model supported?" is two questions: can it be added (the **Platform** and **LLM
Selection** lists answer that), and what can it do once added (its **LLM Notes** answer that,
before you click **Add**). Reading the notes first saves you from adding a model that cannot do
the job you need — for example a text model when you need image generation.

## When to use it

Use this page when you are:

- choosing a provider or model before connecting anything;
- checking whether a provider — xAI, DeepSeek, Perplexity, Xiaomi — is offered;
- wondering why a function checkbox is greyed out on a model card;
- deciding between a model NeuralSeek hosts (the **NeuralSeek** platform, see
  [Managed LLM Details](/configuration/neural-config/managed-llm/)) and one on your own account;
- connecting a model you run yourself through an OpenAI-compatible endpoint — see also
  [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/).

It is the wrong page for:

- per-card settings such as **LLM Languages** or the function checkboxes — see
  [LLM Details](/configuration/neural-config/llm-details/);
- splitting functions across several models — see [Multi-LLM](/configuration/multi-llm/);
- image, video, speech and music functions — see
  [Multimodal LLM configuration](/configuration/multimodal/).

## How it works

![The Add an LLM dialog open over the Edit Configuration dialog: Platform and LLM Selection dropdowns on the left, the LLM Notes panel on the right, Cancel and Add in the footer](/img/neural-config/add-an-llm.png)

### Open Add an LLM

In **Neural Config**, click the **Default Config / Answer Generation** node to open **Edit
Configuration**, then expand the **LLM Details** section. The **Add an LLM** button sits at the
top left, beside the help paragraph quoted above, with one card per model already added below
it.

![The LLM Details section expanded: the Add an LLM button, the help paragraph, and the existing model cards with their LLM Functions checkboxes](/img/neural-config/llm-details-panel.png)

Clicking **Add an LLM** opens the dialog. It holds only two choices — **Platform** and **LLM
Selection** — plus the read-only **LLM Notes** panel, and a footer with **Cancel** and **Add**.

### Platform

**Platform** is the provider the model runs on. Choosing a platform refills **LLM Selection**
with that provider's models and updates **LLM Notes** to the first of them.

![The Platform dropdown in the Add an LLM dialog, showing Amazon Bedrock](/img/neural-config/add-an-llm--options-platform.png)

At the time of writing the list offers 14 platforms, in this order. The second column is the
model **LLM Selection** shows first after you pick the platform — the top of its list, not a
recommendation.

| Platform                    | Model shown first         | **LLM Notes** heading               | Context Window | More                                                                         |
| --------------------------- | ------------------------- | ----------------------------------- | -------------- | ---------------------------------------------------------------------------- |
| Amazon Bedrock              | `Nova Pro`                | AWS / Nova Pro                      | 300000         | Full model list under [LLM Selection](#llm-selection)                        |
| Azure Cognitive Services    | `gpt-5.6-sol`             | OpenAI / gpt-5.6-sol                | 1000000        | Full model list under [LLM Selection](#llm-selection)                        |
| Cloudflare                  | `kimi-k2.7-code`          | Moonshot AI / kimi-k2.7-code        | 262100         |                                                                              |
| Generic (OpenAI-compatible) | `OpenAI Chat Completions` | generic / OpenAI Chat Completions   | 32768          | [Your own endpoint](#generic-openai-compatible-your-own-endpoint)            |
| Google Vertex AI            | `gemini-3.1-pro-preview`  | Google / gemini-3.1-pro-preview     | 1000000        |                                                                              |
| DeepSeek                    | `deepseek-v4-pro`         | DeepSeek / deepseek-v4-pro          | 1000000        |                                                                              |
| Perplexity                  | `perplexity-router`       | Perplexity / perplexity-router      | 1000000        |                                                                              |
| HuggingFace                 | `gpt-oss-120b`            | OpenAI / gpt-oss-120b               | 131072         |                                                                              |
| NeuralSeek                  | `Managed GPT`             | OpenAI / Managed GPT                | 1000000        | [Managed models](#neuralseek-managed-models)                                 |
| OpenAI                      | `ggpt-6-astra`            | OpenAI / ggpt-6-astra               | 1000000        | Full model list under [LLM Selection](#llm-selection)                        |
| together.ai                 | `Minimax M3`              | Minimax / Minimax M3                | 524288         |                                                                              |
| watsonx.ai                  | `gpt-oss-120b`            | OpenAI / gpt-oss-120b               | 131072         | Full model list under [LLM Selection](#llm-selection)                        |
| xAI                         | `grok-code-fast-1`        | xAI / grok-code-fast-1              | 256000         | [Platforms new since the previous list](#platforms-new-since-the-previous-list) |
| Xiaomi                      | `mimo-v2.6-pro`           | Xiaomi / mimo-v2.6-pro              | 1000000        |                                                                              |

The **LLM Notes** heading names the model's maker, which is not always the platform: on
Cloudflare the first model is Moonshot AI's, on together.ai it is Minimax's, and HuggingFace and
watsonx.ai both open on OpenAI's open-weight `gpt-oss-120b`. The platform is where the model is
served from; the heading is who built it.

### LLM Selection

**LLM Selection** is the model on the chosen platform. Its list depends entirely on **Platform**,
and each pick updates **LLM Notes**.

![The LLM Selection dropdown in the Add an LLM dialog, showing Nova Pro](/img/neural-config/add-an-llm--options-llm-selection.png)

These are the lists the dialog offered for four platforms at the time of writing, in the order
they appear. Model names are copied exactly as the dialog spells them. For the other ten
platforms, open the dropdown on your own console — the lists change as providers release and
retire models.

| Platform                 | LLM Selection options                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Amazon Bedrock           | `Nova Pro`, `Nova Lite`, `Nova Micro`, `Claude Fable 5.1`, `Claude 5 Opus`, `Claude 4.8 Opus`, `Claude 5 Sonnet`, `Claude 4.6 Sonnet`, `Claude 4.5 Sonnet`, `Claude 4.5 Haiku`, `Jurassic-2 Mid`, `Jurassic-2 Ultra`, `Mistral-7B-Instruct`, `Mixtral-8x7B-Instruct`, `Mistral-large`, `Mistral-small`, `Titan Text G1 - Express`, `llama-3-2-90b-vision-instruct`, `llama-3-2-11b-vision-instruct`                               |
| Azure Cognitive Services | `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5-chat-latest`, `gpt-4o-mini-tts`, `chatgpt-image`, `sora-2`, `sora-2-pro`, `gpt-4.1`                                                                                                                                                                                                                                                                                       |
| OpenAI                   | `ggpt-6-astra`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-flare`, `ggpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5-chat-latest`, `gpt-5-mini`, `gpt-5-nano`, `gpt-4o-mini-tts`, `sora-2`, `sora-2-pro`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-flare`, `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano`                                                                                                           |
| watsonx.ai               | `gpt-oss-120b`, `gpt-oss-20b`, `Mistral-large`, `mistral-medium-2505`, `mistral-small-3-1-24b-instruct-2503`, `mistral-small-24b-instruct-2501`, `llama-3-2-90b-vision-instruct`, `llama-3-2-11b-vision-instruct`, `llama-4-scout`, `llama-4-maverick`, `llama-3-405b-instruct`, `elyza-japanese-llama-2-7b-instruct`, `jais-13b-chat`, `granite-4-h-small`, `granite-3-3-8b-instruct`, `granite-3-2-8b-instruct`, `granite-guardian-3-2b`, `granite-guardian-3-8b`, `granite-vision-3-2-2b` |

The OpenAI list shows `ggpt-6-astra`, `gpt-image-2.5-sunburst` and `gpt-image-2.5-flare` twice
each; that is how the dropdown displays them.

A list mixes text models with media models — `chatgpt-image`, `gpt-image-2.5-sunburst`,
`sora-2`, `gpt-4o-mini-tts` — so pick by what **LLM Notes** says the model does, not by the
name. Image, video, speech and music models are covered on
[Multimodal LLM configuration](/configuration/multimodal/).

### LLM Notes

**LLM Notes** is the read-only panel on the right of the dialog. It describes the model currently
chosen in **LLM Selection** and changes every time you pick another one. It is the only place
that tells you what a model can do before you add it.

![The Add an LLM dialog with Amazon Bedrock and Nova Pro selected: the LLM Notes panel shows the AWS / Nova Pro heading, a description, the functions the model does not support, its language support, Model Code nova-pro, Inputs and Outputs icons, Context Window 300000 and the capability and creativity chart](/img/neural-config/add-an-llm-panel.png)

Top to bottom, the panel shows:

- A heading — maker / model, for example `AWS / Nova Pro`.
- A description — one or two sentences about the model.
- **This LLM does not support:** — the NeuralSeek functions this model cannot perform. These are
  the checkboxes that will be greyed out on its card once added (see
  [From the dialog to a card](#from-the-dialog-to-a-card)). For `Nova Pro` the list is Table
  Understanding, System AI, Image Generation, Image Edits, Video, Speech, Music, Speech to Text.
- Language support — either "This LLM supports all languages." or a count, such as "This LLM
  supports 187 languages." for `Managed GPT`.
- **Model Code** — the model's identifier, for example `nova-pro`. On a managed model this is the
  same value the card later shows as **LLM ID:**.
- **Inputs** and **Outputs** — icons for what the model accepts and returns. `Nova Pro` shows
  Text and Image in, Text out; `gpt-oss-120b` shows Text in, Text out.
- **Context Window** — how much the model can take in at once, as a number (for example
  `300000`).
- **Seek Multiplier** — shown on some models, such as `Managed GPT` (`4.5`). It is explained on
  [Multi-LLM](/configuration/multi-llm/).
- **Capability/Creativity chart** — a small chart plotting the model's capability and creativity
  scores against a midpoint.

### Platforms new since the previous list

The previously published list named eight platforms plus generic OpenAI-compatible endpoints.
The dialog now also offers **DeepSeek**, **Perplexity**, **NeuralSeek**, **xAI** and **Xiaomi**.

![The Add an LLM dialog with xAI selected as the Platform and grok-code-fast-1 as the LLM Selection; LLM Notes shows the xAI / grok-code-fast-1 heading and Context Window 256000](/img/neural-config/add-an-llm@llm-platform-xai-panel.png)

xAI is on the **Platform** list. Picking it opens **LLM Selection** on `grok-code-fast-1`, whose
notes read "A speedy and economical reasoning model that excels at agentic coding." and list the
same unsupported functions as `Nova Pro`. Perplexity opens on `perplexity-router`, described as
letting you "target major LLM providers thru perplexity".

### NeuralSeek: managed models

The **NeuralSeek** platform is where the models NeuralSeek hosts for you are listed. Picking it
opens **LLM Selection** on `Managed GPT`, which the notes describe as "pinned to the latest GPT
flagship model for coding, reasoning, and agentic tasks across domains".

![The Add an LLM dialog with NeuralSeek as the Platform and Managed GPT as the LLM Selection; LLM Notes shows OpenAI / Managed GPT, 187 languages, Model Code ns-gpt-5, Context Window 1000000 and Seek Multiplier 4.5](/img/neural-config/add-an-llm@llm-ns-managed-panel.png)

More on the managed models is on
[Managed LLM Details](/configuration/neural-config/managed-llm/).

### Generic (OpenAI-compatible): your own endpoint

**Generic (OpenAI-compatible)** is for a model you serve yourself. Its **LLM Selection** opens on
`OpenAI Chat Completions`, and the notes spell out what it expects:

> This model card is for use with the OpenAI-style /v1/chat/completions endpoint of HuggingFace
> TGI or VLLM. THis endpoint abstracts away all the LLM control chars and requires the model have
> a chat template as part of its tokenizer. This card is only compatible with a
> /v1/chat/completions endpoint.

![The Add an LLM dialog with Generic (OpenAI-compatible) as the Platform and OpenAI Chat Completions as the LLM Selection; LLM Notes describes the /v1/chat/completions requirement and shows Context Window 32768](/img/neural-config/add-an-llm@llm-platform-generic-openai-compatible-panel.png)

Use it when your model runs behind a `/v1/chat/completions` endpoint and has a chat template in
its tokenizer; an endpoint without one of those does not fit this card. Running the model itself
is covered on [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/).

### From the dialog to a card

**Cancel** closes the dialog without adding anything. **Add** adds the model you selected to
**LLM Details**.

<!-- UNCONFIRMED: Add creates a new model card in LLM Details — inferred from the LLM Details layout and the previous site; Add was not pressed when the dialog was documented -->

The model then appears there as a card, alongside the ones already configured. The
`Managed GPT` card shows how the notes carry over:

![The Managed GPT card title in LLM Details](/img/neural-config/llm-details--managed-gpt.png)

- its **LLM Functions** checkboxes for Table Understanding, Image Generation, Image Edits, Video,
  Speech, Music and Speech to Text are greyed out — exactly the "does not support" list in its
  **LLM Notes**;
- its **LLM Languages** field under **Connection Info** reads `187`, the count its notes gave;
- its **LLM ID:** is `ns-gpt-5`, the **Model Code** from its notes.

What you set on the card — languages, functions, weight, and the **Test** and **Delete**
buttons — is documented on [LLM Details](/configuration/neural-config/llm-details/). How the
**Edit Configuration** dialog's changes are kept is covered on
[Using this page](/configuration/neural-config/using-this-page/).

## FAQ

### Does NeuralSeek support xAI (Grok)?

Yes. **xAI** is on the **Platform** list of the **Add an LLM** dialog, and picking it opens
**LLM Selection** on `grok-code-fast-1`. DeepSeek, Perplexity and Xiaomi are on the list too.

### Where is the complete list of supported models?

In the **Add an LLM** dialog on your own console: pick each **Platform** and open **LLM
Selection**. This page reproduces the full lists for Amazon Bedrock, Azure Cognitive Services,
OpenAI and watsonx.ai and the first model of every other platform; providers add and retire
models often, so the dialog is always the current answer.

### Why is a function greyed out on my model?

Because that model cannot do that job. The **LLM Details** help text says "Features that an LLM
are not capable of will be unselectable." You can see this coming before you add a model: the
functions listed after "This LLM does not support:" in its **LLM Notes** are the ones greyed out
on its card. To enable the function, add a second model that supports it — a function no model
claims is disabled, with no fallback. See [Multi-LLM](/configuration/multi-llm/).

### What is the NeuralSeek platform?

It lists the models NeuralSeek hosts for you, such as `Managed GPT`, which its notes describe as
pinned to the latest GPT flagship model. Details are on
[Managed LLM Details](/configuration/neural-config/managed-llm/).

### Why don't I see Add an LLM?

<!-- UNCONFIRMED: "LLM choice is available with NeuralSeek's BYOLLM (bring your own Large Language Model) plan; all other plans default to NeuralSeek's curated LLM" — previous site; no plan control appears on the LLM Details screen -->

The previous documentation tied model choice to the BYOLLM (bring your own Large Language Model)
plan, with other plans using NeuralSeek's curated model. If the button is missing from **LLM
Details**, check your plan first.

### Can a model be too slow for my virtual agent?

<!-- UNCONFIRMED: "Some LLMs can take up to 30 seconds and longer to generate a full response; use caution with a virtual agent platform that imposes a strict timeout" — previous site; response times were not measured -->

It can. The previous documentation warned that some models take 30 seconds or longer for a full
response, which matters when a virtual agent platform in front of NeuralSeek enforces a strict
timeout. Test the model you pick against that timeout before going live.
