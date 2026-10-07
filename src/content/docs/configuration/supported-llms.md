---
title: "Supported LLMs"
description: "The language models NeuralSeek supports are the ones offered by the Add an LLM dialog in Neural Config's LLM Details section — 14 platforms including xAI, DeepSeek, Perplexity, Xiaomi and NeuralSeek's own managed models — and each model's LLM Notes state what it cannot do before you add it."
---

A model is supported by NeuralSeek when you can pick it in the **Add an LLM** dialog. The dialog
is the catalogue: you choose a **Platform** (where the model is served from), then a model in
**LLM Selection**, and the **LLM Notes** panel tells you what that model can and cannot do before
you add it. This page covers the dialog itself; everything about a model once it is added — its
languages, functions, weight, test and delete — is on
[LLM Details](/configuration/neural-config/llm-details/).

## Where to find it

In **Neural Config**, click the **Default Config / Answer Generation** node to open **Edit
Configuration**, expand **LLM Details**, and select **Add an LLM**. The button sits beside the
section's help text, with one card per model already added below it. How the dialog works and
how its changes are saved is covered on
[Using the Neural Config page](/configuration/neural-config/using-this-page/).

![The Configuration: Default Config dialog with LLM Details expanded under KnowledgeBase Connection and KnowledgeBase Tuning: the Add an LLM button, the help paragraph, and the Managed GPT and Managed gpt-image cards with their LLM Languages and LLM Functions checkboxes](/img/neural-config/llm-details.png)

The help text explains why the models you add matter:

> You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them
> for the selected functions that have multiple LLM's. Features that an LLM are not capable of
> will be unselectable. If you do not provide an LLM for a function, there is no fallback and
> that function of NeuralSeek will be disabled.

So "is my model supported?" is two questions: can it be added (the **Platform** and **LLM
Selection** lists answer that), and what can it do once added (its **LLM Notes** answer that).

## Settings

The **Add an LLM** dialog has two dropdowns on the left — **Platform** and **LLM Selection** — the
read-only **LLM Notes** panel on the right, and **Cancel** and **Add** in the footer. It opens on
the first entry of each list, **Amazon Bedrock** and `Nova Pro`; that is the top of the lists, not
a recommendation.

### Platform

**Platform** is the provider the model is served from. Picking a platform refills **LLM
Selection** with that provider's models, selects the first one, and switches **LLM Notes** to it.
Pick the provider that serves the model you want, or **NeuralSeek** for the models NeuralSeek
provides.

The list offers 14 platforms, in this order. The second column is the model **LLM Selection**
shows first after you pick the platform — the top of its list, not a default or a recommendation.
The other columns come from that model's **LLM Notes**.

| Platform                    | LLM Selection shows       | LLM Notes heading                 | Model Code             | Inputs → Outputs                 | Context Window |
| --------------------------- | ------------------------- | --------------------------------- | ---------------------- | -------------------------------- | -------------- |
| Amazon Bedrock              | `Nova Pro`                | AWS / Nova Pro                    | `nova-pro`             | Text, Image → Text               | 300000         |
| Azure Cognitive Services    | `gpt-5.6-sol`             | OpenAI / gpt-5.6-sol              | `azuregpt-5.6-sol`     | Text, Image → Text               | 1000000        |
| Cloudflare                  | `kimi-k2.7-code`          | Moonshot AI / kimi-k2.7-code      | `kimi-k2.7-code-cf`    | Text → Text                      | 262100         |
| Generic (OpenAI-compatible) | `OpenAI Chat Completions` | generic / OpenAI Chat Completions | `GPT-Chat-Completions` | Text, Image → Text               | 32768          |
| Google Vertex AI            | `gemini-3.1-pro-preview`  | Google / gemini-3.1-pro-preview   | `gemini-3.1-pro-preview` | Text, Image, Audio, video → Text | 1000000        |
| DeepSeek                    | `deepseek-v4-pro`         | DeepSeek / deepseek-v4-pro        | `ds-deepseek-v4-pro`   | Text, Image → Text               | 1000000        |
| Perplexity                  | `perplexity-router`       | Perplexity / perplexity-router    | `perplexity-router`    | Text, Image → Text               | 1000000        |
| HuggingFace                 | `gpt-oss-120b`            | OpenAI / gpt-oss-120b             | `gpt-oss-120b`         | Text → Text                      | 131072         |
| NeuralSeek                  | `Managed GPT`             | OpenAI / Managed GPT              | `ns-gpt-5`             | Text, Image → Text               | 1000000        |
| OpenAI                      | `ggpt-6-astra`            | OpenAI / ggpt-6-astra             | `azuregpt-6-astra`     | Text, Image → Text               | 1000000        |
| together.ai                 | `Minimax M3`              | Minimax / Minimax M3              | `Minimax-M3-together`  | Text → Text                      | 524288         |
| watsonx.ai                  | `gpt-oss-120b`            | OpenAI / gpt-oss-120b             | `gpt-oss-120b-watsonxga` | Text → Text                    | 131072         |
| xAI                         | `grok-code-fast-1`        | xAI / grok-code-fast-1            | `grok-code-fast-1`     | Text → Text                      | 256000         |
| Xiaomi                      | `mimo-v2.6-pro`           | Xiaomi / mimo-v2.6-pro            | `mimo-v2.6-pro`        | Text, Image, video → Text        | 1000000        |

The **LLM Notes** heading names the model's maker, which is not always the platform: Cloudflare
opens on a Moonshot AI model, together.ai on a Minimax model, and Azure Cognitive Services,
HuggingFace and watsonx.ai on OpenAI models. The platform is where the model is served from; the
heading is who built it. Model names and codes are copied as the dialog spells them.

#### xAI, DeepSeek, Perplexity and Xiaomi

![The Add an LLM dialog with xAI as the Platform and grok-code-fast-1 as the LLM Selection; LLM Notes shows the xAI / grok-code-fast-1 heading, the functions it does not support, and Context Window 256000](/img/neural-config/add-an-llm@llm-platform-xai-panel.png)

Picking **xAI** opens **LLM Selection** on `grok-code-fast-1`, which its notes describe as "A
speedy and economical reasoning model that excels at agentic coding." It does not support Table
Understanding, System AI, Image Generation, Image Edits, Video, Speech, Music or Speech to Text.
**Perplexity** opens on `perplexity-router`, which "lets you target major LLM providers thru
perplexity". **DeepSeek** opens on `deepseek-v4-pro` and **Xiaomi** on `mimo-v2.6-pro`; their
inputs and context windows are in the table above.

#### Generic (OpenAI-compatible): a model you serve yourself

Pick **Generic (OpenAI-compatible)** when you run the model yourself. Its **LLM Selection** opens
on `OpenAI Chat Completions`, and the notes state what the endpoint must provide:

> This model card is for use with the OpenAI-style /v1/chat/completions endpoint of HuggingFace
> TGI or VLLM. THis endpoint abstracts away all the LLM control chars and requires the model have
> a chat template as part of its tokenizer. This card is only compatible with a
> /v1/chat/completions endpoint.

![The Add an LLM dialog with Generic (OpenAI-compatible) as the Platform and OpenAI Chat Completions as the LLM Selection; LLM Notes describes the /v1/chat/completions requirement and shows Context Window 32768](/img/neural-config/add-an-llm@llm-platform-generic-openai-compatible-panel.png)

It fits a model behind a `/v1/chat/completions` endpoint whose tokenizer has a chat template; an
endpoint without either does not work with this card. Running the model itself is covered on
[Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/).

#### NeuralSeek: the managed models

The **NeuralSeek** platform lists the models NeuralSeek provides. It opens **LLM Selection** on `Managed GPT`, which its notes describe as
"pinned to the latest GPT flagship model for coding, reasoning, and agentic tasks across domains".
Its notes give 187 languages, Model Code `ns-gpt-5`, Context Window 1000000 and a **Seek
Multiplier** of 4.5.

![The Add an LLM dialog with NeuralSeek as the Platform and Managed GPT as the LLM Selection; LLM Notes shows OpenAI / Managed GPT, 187 languages, Model Code ns-gpt-5, Context Window 1000000 and Seek Multiplier 4.5](/img/neural-config/add-an-llm@llm-ns-managed-panel.png)

The managed models are documented on
[Managed LLM Details](/configuration/neural-config/managed-llm/).

### LLM Selection

**LLM Selection** is the model on the chosen platform. Its list depends entirely on **Platform**,
and each pick updates **LLM Notes**.

These are the lists the dialog offered for four platforms, in the order shown and spelled as on
screen. For the other platforms, open the dropdown in your own console — providers add and retire
models, so the dialog is always the current answer.

| Platform                 | LLM Selection options |
| ------------------------ | --------------------- |
| Amazon Bedrock           | `Nova Pro`, `Nova Lite`, `Nova Micro`, `Claude Fable 5.1`, `Claude 5 Opus`, `Claude 4.8 Opus`, `Claude 5 Sonnet`, `Claude 4.6 Sonnet`, `Claude 4.5 Sonnet`, `Claude 4.5 Haiku`, `Jurassic-2 Mid`, `Jurassic-2 Ultra`, `Mistral-7B-Instruct`, `Mixtral-8x7B-Instruct`, `Mistral-large`, `Mistral-small`, `Titan Text G1 - Express`, `llama-3-2-90b-vision-instruct`, `llama-3-2-11b-vision-instruct` |
| Azure Cognitive Services | `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5-chat-latest`, `gpt-4o-mini-tts`, `chatgpt-image`, `sora-2`, `sora-2-pro`, `gpt-4.1` |
| OpenAI                   | `ggpt-6-astra`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-flare`, `ggpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5-chat-latest`, `gpt-5-mini`, `gpt-5-nano`, `gpt-4o-mini-tts`, `sora-2`, `sora-2-pro`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-flare`, `gpt-4.1`, `gpt-4.1-mini`, `gpt-4.1-nano` |
| watsonx.ai               | `gpt-oss-120b`, `gpt-oss-20b`, `Mistral-large`, `mistral-medium-2505`, `mistral-small-3-1-24b-instruct-2503`, `mistral-small-24b-instruct-2501`, `llama-3-2-90b-vision-instruct`, `llama-3-2-11b-vision-instruct`, `llama-4-scout`, `llama-4-maverick`, `llama-3-405b-instruct`, `elyza-japanese-llama-2-7b-instruct`, `jais-13b-chat`, `granite-4-h-small`, `granite-3-3-8b-instruct`, `granite-3-2-8b-instruct`, `granite-guardian-3-2b`, `granite-guardian-3-8b`, `granite-vision-3-2-2b` |

The OpenAI dropdown shows `ggpt-6-astra`, `gpt-image-2.5-sunburst` and `gpt-image-2.5-flare`
twice each; the list above reproduces it as displayed.

![The Add an LLM dialog with OpenAI as the Platform and ggpt-6-astra as the LLM Selection; LLM Notes shows OpenAI / ggpt-6-astra, Model Code azuregpt-6-astra and Context Window 1000000](/img/neural-config/add-an-llm@llm-platform-openai-panel.png)

A list mixes text models with media models — `chatgpt-image`, `gpt-image-2.5-sunburst`, `sora-2`,
`gpt-4o-mini-tts` — so choose by what **LLM Notes** says the model supports, not by its name.
Image, video, speech and music functions are covered on
[Multimodal LLM configuration](/configuration/multimodal/).

### LLM Notes

**LLM Notes** is the read-only panel on the right of the dialog. It describes the model selected
in **LLM Selection** and changes with every pick. Read it before you select **Add**: it is where
you see what a model cannot do.

![The Add an LLM dialog with Amazon Bedrock and Nova Pro selected: LLM Notes shows the AWS / Nova Pro heading, a description, the functions the model does not support, its language support, Model Code nova-pro, the Inputs and Outputs icons, Context Window 300000 and the capability and creativity chart](/img/neural-config/add-an-llm-panel.png)

Top to bottom, the panel shows:

| Line                             | What it tells you |
| -------------------------------- | ----------------- |
| Heading                          | Maker / model, for example `AWS / Nova Pro` or `xAI / grok-code-fast-1`. |
| **LLM Notes:**                   | One or two sentences describing the model. |
| **This LLM does not support:**   | The NeuralSeek functions this model cannot perform — for `Nova Pro`: Table Understanding, System AI, Image Generation, Image Edits, Video, Speech, Music, Speech to Text. These are the **LLM Functions** checkboxes that will be unselectable on the model's card. Lists differ: `kimi-k2.7-code` (Cloudflare) and `Minimax M3` (together.ai) also cannot do Conversation Generation or Slot Filling. |
| Language support                 | Either "This LLM supports all languages." or a count, such as "This LLM supports 187 languages." for `Managed GPT`. Which languages a model uses is set on its card — see [Language handling](/configuration/language/). |
| **Model Code:**                  | The model's identifier, for example `nova-pro`. For `Managed GPT` it is `ns-gpt-5`, the same value its card shows as **LLM ID:**. |
| **Inputs:** / **Outputs:**       | Icons for what the model accepts and returns: Text, Image, Audio, and the word "video" where the model accepts it. `Nova Pro` takes Text and Image and returns Text. |
| **Context Window:**              | The model's context window as a number, for example `300000` or `32768`. |
| **Seek Multiplier:**             | Shown on some models, for example `Managed GPT` (`4.5`). See [Managed LLM Details](/configuration/neural-config/managed-llm/). |
| Capability / creativity chart    | A small chart plotting the model's capability and creativity against a midpoint. |

### Cancel and Add

To add the model, select **Add**; it adds the model selected in **LLM Selection** to **LLM
Details**. To leave without adding anything, select **Cancel**.

<!-- UNCONFIRMED: Add creates a new model card in LLM Details — inferred from the LLM Details layout and the previous site; Add was not pressed when the dialog was documented -->

The model then appears as a card alongside the ones already configured, and its notes carry over
to the card. The `Managed GPT` card in the LLM Details image under
[Where to find it](#where-to-find-it) shows how:

- its **LLM Functions** checkboxes for Table Understanding, Image Generation, Image Edits, Video,
  Speech, Music and Speech to Text are unselectable — exactly the "does not support" list in its
  **LLM Notes**;
- its **LLM Languages** field under **Connection Info** shows `187`, the count its notes gave;
- its **LLM ID:** is `ns-gpt-5`, the **Model Code** from its notes.

What you set on the card — languages, functions, weight, and the **Test** and **Delete** buttons —
is documented on [LLM Details](/configuration/neural-config/llm-details/).

## Limits and interactions

- **No fallback.** A function with no model behind it is disabled. To get a function your first
  model cannot perform, add a second model that supports it — see
  [Multi-LLM](/configuration/multi-llm/).
- **Load balancing.** When several models are selected for the same function, NeuralSeek
  load-balances across them.
- **The lists change.** Providers release and retire models, so the dialog in your console is the
  current list; the tables on this page show what it offered when it was documented.

<!-- UNCONFIRMED: "Some LLMs can take up to 30 seconds and longer to generate a full response; use caution with a virtual agent platform that imposes a strict timeout" — previous site; response times were not measured -->

- **Response time.** Some models can take 30 seconds or longer to generate a full response. If a
  virtual agent platform in front of NeuralSeek enforces a strict timeout, test the model you
  pick against it before going live.

## FAQ

### Does NeuralSeek support xAI (Grok)?

Yes. **xAI** is on the **Platform** list of the **Add an LLM** dialog, and picking it opens **LLM
Selection** on `grok-code-fast-1`. DeepSeek, Perplexity and Xiaomi are on the list too.

### Where is the complete list of supported models?

In the **Add an LLM** dialog in your console: pick each **Platform** and open **LLM Selection**.
This page reproduces the full lists for Amazon Bedrock, Azure Cognitive Services, OpenAI and
watsonx.ai and the first model of every other platform.

### Why is a function greyed out on my model's card?

The model cannot perform it. The functions after "This LLM does not support:" in its **LLM
Notes** are the ones that are unselectable on its card. Add a second model that supports the
function; a function no model covers is disabled, with no fallback.

### Can I use a model I host myself?

Yes, if it is served behind an OpenAI-style `/v1/chat/completions` endpoint and its tokenizer has
a chat template: pick **Generic (OpenAI-compatible)**. See
[Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/).

### Why don't I see Add an LLM?

<!-- UNCONFIRMED: "LLM choice is available with NeuralSeek's BYOLLM (bring your own Large Language Model) plan; all other plans default to NeuralSeek's curated LLM" — previous site; no plan control appears on the LLM Details screen -->

Choosing a model requires the BYOLLM (bring your own Large Language Model) plan; other plans use
NeuralSeek's curated model. If the button is missing from **LLM Details**, check your plan.

## Related

- [LLM Details](/configuration/neural-config/llm-details/) — the cards a model becomes once added
- [Managed LLM Details](/configuration/neural-config/managed-llm/) — the models on the NeuralSeek platform
- [Multi-LLM](/configuration/multi-llm/) — several models on one configuration
- [Multimodal LLM configuration](/configuration/multimodal/) — image, video, speech and music models
- [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/) — running your own model
- [Language handling](/configuration/language/) — which languages a model's card uses
- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — opening Edit Configuration and saving changes
- [Embedding models](/configuration/neural-config/embedding-models/) — the sibling dialog for embedding models
