---
title: "Self-hosting an LLM"
description: "The Self-Host an LLM screen in API's & Integration names the two inference servers NeuralSeek supports for running your own model, vLLM and Huggingface TGI, and the model is then connected in Neural Config through Add an LLM with the Generic (OpenAI-compatible) platform."
---

## What is it

**Self-Host an LLM** is a reference screen in NeuralSeek's **API's & Integration** area, listed in its side navigation as **Self-Hosted LLM**. It opens with one line:

> We support both Huggingface TGI and vLLM for self-hosting your LLM of choice.

Below that line are two cards, one per inference server, each with a short description and links to that project's own documentation and source code. vLLM and Huggingface TGI (Text Generation Inference) are open-source servers that you install and run to serve a language model yourself.

The screen links out and nothing more. It has no form, no text box, no connection or endpoint field and no **Save** button: nothing you do on it changes your NeuralSeek configuration. You connect the model afterwards, in **Neural Config**.

## Why it matters

A model you serve yourself runs behind your own endpoint, not on a provider NeuralSeek already knows. NeuralSeek reaches such a model through one entry in the **Platform** list of **Add an LLM**: **Generic (OpenAI-compatible)**. That card's notes name the two servers on this screen directly — it is "for use with the OpenAI-style /v1/chat/completions endpoint of HuggingFace TGI or VLLM".

So the two halves fit together: this screen tells you which servers NeuralSeek supports and where to learn to run them, and the Generic card in LLM Details is where the running server becomes a model NeuralSeek can use. The full list of platforms and models NeuralSeek can call is on [Supported LLMs](/configuration/supported-llms/).

## When to use it

Use this path when the model you want is not offered by a hosted platform on the **Platform** list, or when inference has to run on infrastructure you control.

It is the wrong path when:

- **You want NeuralSeek to run the model for you.** Pick a model NeuralSeek hosts instead — see [Managed LLM](/configuration/neural-config/managed-llm/).
- **Your model is already on a provider in the Platform list** (OpenAI, Amazon Bedrock, watsonx.ai and the others on [LLM Details](/configuration/neural-config/llm-details/)). Pick that platform; you do not need to run a server.
- **Your server cannot answer on an OpenAI-style `/v1/chat/completions` endpoint**, or your model has no chat template in its tokenizer. The Generic card is "only compatible with a /v1/chat/completions endpoint".

<!-- UNCONFIRMED: bringing your own model is limited to BYOLLM plans — the route's gap list ("Self-Hosted LLM (BYOLLM plans only)") and the previously published Supported LLMs page; no plan restriction is shown on the screen -->

Bringing your own model may depend on your NeuralSeek plan; check with your NeuralSeek contact if the **Generic (OpenAI-compatible)** platform is not available to you.

## How it works

### Find the Self-Host an LLM screen

Open **API's & Integration** — it is both a link in the top navigation bar and an item in the **Admin Tools** menu, and either one opens the same side navigation. **Self-Hosted LLM** is the last entry in that side navigation, below **Console API**. The screen it opens is titled **Self-Host an LLM**.

![The Self-Host an LLM screen: the API's & Integration side navigation with Self-Hosted LLM highlighted, the intro line about Huggingface TGI and vLLM, and the vLLM and Huggingface TGI cards](/img/admin-tools/self-hosted-llm.png)

What the screen holds is the intro line, "We support both Huggingface TGI and vLLM for self-hosting your LLM of choice.", and the two cards below. Every link on it opens an external site — the vLLM or Hugging Face project — not a NeuralSeek setting.

### vLLM

![The vLLM card: its one-line description, the Installation, Quickstart and Supported Models links, and the link to the vLLM GitHub repository](/img/admin-tools/self-hosted-llm--vllm.png)

The **vLLM** card describes the server as "a fast and easy-to-use library for LLM inference and serving." It carries four links, all to the vLLM project:

| Link                                     | Opens                                                                    | Use it to                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Installation**                         | `https://vllm.readthedocs.io/en/latest/getting_started/installation.html` | Install vLLM on your own machine or cluster.                     |
| **Quickstart**                           | `https://vllm.readthedocs.io/en/latest/getting_started/quickstart.html`   | Start serving a first model.                                     |
| **Supported Models**                     | `https://vllm.readthedocs.io/en/latest/models/supported_models.html`      | Check whether the model you want can be served by vLLM.          |
| **https://github.com/vllm-project/vllm** | The vLLM source repository on GitHub                                     | Go to the project's source code.                                 |

### Huggingface TGI

![The Huggingface TGI card: its description as a Rust, Python and gRPC server used in production at HuggingFace, and the link to the text-generation-inference GitHub repository](/img/admin-tools/self-hosted-llm--huggingface-tgi.png)

The **Huggingface TGI** card describes Text Generation Inference as "A Rust, Python and gRPC server for text generation inference. Used in production at HuggingFace to power Hugging Chat, the Inference API and Inference Endpoint."

This card has a single link, **https://github.com/huggingface/text-generation-inference**, the project's source repository on GitHub. Unlike the vLLM card it has no separate Installation, Quickstart or model-list links, so look for installation and supported-model information from that repository.

### Choosing between vLLM and Huggingface TGI

NeuralSeek supports both, and the screen does not recommend one over the other. Choose the one whose documentation shows it can serve your model and that fits how your team runs infrastructure — the vLLM **Supported Models** list is the quickest check on that side.

Whichever you pick, two things decide whether NeuralSeek can use the result, both from the **LLM Notes** of the Generic card described next:

- the server must expose an OpenAI-style `/v1/chat/completions` endpoint;
- the model must have a chat template as part of its tokenizer, because that endpoint "abstracts away all the LLM control chars".

### Connect the model: Add an LLM with Generic (OpenAI-compatible)

Once your server is running, add it to NeuralSeek in **Neural Config**: open the configuration's **Edit Configuration** dialog, expand the **LLM Details** section and press **Add an LLM**. The full dialog, including every other platform, is documented on [LLM Details](/configuration/neural-config/llm-details/); this section covers only what matters for a self-hosted model.

<!-- SOURCE: the Add an LLM image and the LLM Notes, Model Code and Context Window values below come from the neural-config capture 202609270311, state add-an-llm@llm-platform-generic-openai-compatible -->

![The Add an LLM dialog with Generic (OpenAI-compatible) as the Platform and OpenAI Chat Completions as the LLM Selection; the LLM Notes panel describes the /v1/chat/completions requirement and shows Model Code GPT-Chat-Completions and Context Window 32768](/img/neural-config/add-an-llm@llm-platform-generic-openai-compatible-panel.png)

- **Platform** — choose **Generic (OpenAI-compatible)**. Do not confuse it with **HuggingFace**, a separate entry on the same list whose **LLM Selection** offers hosted models; a TGI server you run yourself goes through **Generic (OpenAI-compatible)**.
- **LLM Selection** — with Generic chosen, it shows `OpenAI Chat Completions`.
- **LLM Notes** — the panel on the right of the dialog, headed `generic / OpenAI Chat Completions`. It reads: "This model card is for use with the OpenAI-style /v1/chat/completions endpoint of HuggingFace TGI or VLLM. THis endpoint abstracts away all the LLM control chars and requires the model have a chat template as part of its tokenizer. This card is only compatible with a /v1/chat/completions endpoint." It also lists what the card cannot do — "This LLM does not support: Table Understanding, Image Generation, Image Edits, Video, Speech, Music, Speech to Text" — and states "This LLM supports all languages." The card's **Model Code** is `GPT-Chat-Completions` and its **Context Window** is `32768`.
- The dialog ends with two buttons, **Add** and **Cancel**; **Cancel** closes it without adding anything.

<!-- UNCONFIRMED: the Generic card's connection settings (your server's endpoint URL and any key or model name) are entered under the new card's Connection Info in LLM Details — the LLM Details section layout; the Add an LLM dialog shows only Platform and LLM Selection, and a Generic card's Connection Info has not been seen -->

The dialog itself asks only for **Platform** and **LLM Selection**. The address of your server is entered afterwards, on the new card in **LLM Details**, in its connection settings.

On the new card you then pick which **LLM Functions** the self-hosted model performs. The functions in the "does not support" list above are unselectable for it; the LLM Details section says "Features that an LLM are not capable of will be unselectable." If the same function is also ticked on another card, NeuralSeek "will load-balance across them" — see [Multi-LLM](/configuration/multi-llm/) for running several models side by side. The Generic card is also listed with the other models on [Supported LLMs](/configuration/supported-llms/#generic-openai-compatible-your-own-endpoint).

## FAQ

### Which server should I pick, vLLM or Huggingface TGI?

NeuralSeek supports both and the Self-Host an LLM screen does not recommend one. Check vLLM's **Supported Models** list or the TGI repository for the model you want to run. Either way, the server must expose an OpenAI-style `/v1/chat/completions` endpoint and the model needs a chat template in its tokenizer.

### Does NeuralSeek host the model for me?

Not on this path. You install and run vLLM or TGI yourself; the screen only links to those projects' documentation. For models NeuralSeek runs for you, see [Managed LLM](/configuration/neural-config/managed-llm/).

### How does the self-hosted model get into NeuralSeek?

In **Neural Config**, open **LLM Details**, press **Add an LLM**, choose the Platform **Generic (OpenAI-compatible)** with the LLM Selection `OpenAI Chat Completions`, then press **Add**. See [LLM Details](/configuration/neural-config/llm-details/).

### Can I save anything on the Self-Host an LLM screen?

No. The screen has no fields and no **Save** button. It is an intro line and two cards of links to the vLLM and Huggingface TGI projects.

### Which NeuralSeek functions can a self-hosted model serve?

According to the Generic card's **LLM Notes**, it does not support Table Understanding, Image Generation, Image Edits, Video, Speech, Music or Speech to Text, and it supports all languages. In [LLM Details](/configuration/neural-config/llm-details/), functions a model is not capable of are unselectable.

### Can I use a self-hosted model alongside another model?

Yes. If you tick the same function on the self-hosted card and on another card, NeuralSeek load-balances that function across them. See [Multi-LLM](/configuration/multi-llm/).
