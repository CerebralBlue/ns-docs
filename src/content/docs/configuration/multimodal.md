---
title: "Multimodal LLM configuration"
description: "Six of the LLM Functions on every LLM Details model card — Image Generation, Image Edits, Video, Speech, Music and Speech to Text — decide which model handles media jobs, and the Add an LLM dialog's LLM Notes show a model's media support before you add it."
---

NeuralSeek sends image, video and audio work to the models in your configuration the same way it sends text work: through the **LLM Functions** you tick on each model card in [LLM Details](/configuration/neural-config/llm-details/). Six of those functions are media jobs — **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music** and **Speech to Text**. This page is for admins who want NeuralSeek, or a mAIstro agent, to create or edit images, produce audio or transcribe speech: it explains which card serves a media job, why a box is sometimes greyed out, and how to check a model's media support before you add it.

## How it works

To reach the model cards, open **Neural Config**, select the **Default Config / Answer Generation** node, select **Edit Configuration**, and expand **LLM Details**. How that dialog is saved or proposed for review is covered on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Media jobs are LLM Functions on a model card

**LLM Details** states its own rule above the cards: "You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled."

![The LLM Details section: the Add an LLM button and the rules paragraph above two model cards, Managed GPT with every media function greyed out and Managed gpt-image with Image Generation and Image Edits ticked](/img/neural-config/llm-details-panel--crop.png)

Every card carries the same **LLM Functions** grid, with **Enable All** and **Disable All** icons beside the heading. The six media functions come after **System AI** and before **maistro**, and each box is in one of three states:

- _ticked_ — the card's model serves that job;
- _clear_ — the model can do the job but is not assigned to it;
- _greyed out_ — the model cannot do the job, and the box cannot be ticked.

The pattern of greyed boxes tells you what kind of model a card holds. The two cards above show the two typical patterns:

- **Managed GPT**, a text-output model: most text functions are selectable (**Table Understanding** is greyed out), and **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music** and **Speech to Text** are all greyed out.
- **Managed gpt-image**, an image model: **Image Generation** and **Image Edits** are ticked, and every other function, text ones included, is greyed out. It cannot answer Seek questions, so a text model has to be on another card for that.

Read from their labels, **Image Generation** creates a new image from a prompt, **Image Edits** changes an existing image, and **Speech to Text** transcribes audio. **Video**, **Speech** and **Music** are media functions a capable model can take on.

What ticking a media box changes follows from the section's rule:

- _Tick it on one card_ and that card's model serves every request of that kind.
- _Untick it on the last card that has it_ and the function is disabled. No other model takes over, so a media step that depends on it stops working.
- _Tick it on a second card_ and NeuralSeek load-balances the job between the two models. Each card's **Weight** sets its share; see [Multi-LLM](/configuration/multi-llm/).

**Enable All** and **Disable All** act on the whole grid, text functions included. The card's **LLM ID**, **Weight** and other controls are documented on [LLM Details](/configuration/neural-config/llm-details/).

### Checking a model's media support before you add it

A card exists only after you add a model, so a media setup starts with the **Add an LLM** button at the top of **LLM Details**. In the dialog it opens, you pick a **Platform** and an **LLM Selection**; the **LLM Notes** panel beside them then describes the selected model. The platforms and models on offer are listed on [Supported LLMs](/configuration/supported-llms/) and [Managed LLM Details](/configuration/neural-config/managed-llm/).

![The Add an LLM dialog with Platform NeuralSeek and LLM Selection Managed GPT; LLM Notes lists Table Understanding, Image Generation, Image Edits, Video, Speech, Music and Speech to Text as unsupported and shows the Inputs and Outputs icons](/img/neural-config/add-an-llm@llm-ns-managed-panel.png)

Two parts of **LLM Notes** answer the media question:

- **"This LLM does not support:"** names the functions that will be greyed out on the model's card. For **Managed GPT** the list is "Table Understanding, Image Generation, Image Edits, Video, Speech, Music, Speech to Text" — every media function, which is why its card offers none of them. A media function missing from this list is one the card will let you tick.
- **Inputs:** and **Outputs:** show, as icons, what the model takes in and gives back. For **Managed GPT** the inputs are text and image and the output is text. Reading an image you send is a different capability from generating one: this model can describe a picture but cannot create one.

The other lines — **Model Code**, **Context Window**, **Seek Multiplier** — describe that one model and vary from model to model.

A second example shows how the two parts combine. With **Platform** set to Google Vertex AI and **LLM Selection** set to gemini-3.1-pro-preview, **Video** is not in the does-not-support list, and **Inputs:** shows text, image, audio and video while **Outputs:** shows text only.

![The Add an LLM dialog with Platform Google Vertex AI and LLM Selection gemini-3.1-pro-preview; LLM Notes leaves Video out of the does-not-support list and shows text, image, audio and video inputs with a text output](/img/neural-config/add-an-llm@llm-platform-google-vertex-ai-panel.png)

Going by those notes, a card added from this model leaves **Video** selectable, while the other five media functions stay greyed out.

To add the model, select **Add**. Then tick the media functions the new card should serve and save the configuration.

### Starting a media job from a mAIstro agent

The boxes on a card decide which model serves a media job; the job itself is usually started by a node in a [mAIstro](/maistro/overview/) agent. The NTL reference groups those nodes under **Media (Image, Audio, Video)**. Five of them match a media function by name:

| LLM function         | NTL node            |
| -------------------- | ------------------- |
| **Image Generation** | `generateImage`     |
| **Image Edits**      | `generateImageEdit` |
| **Video**            | `generateVideo`     |
| **Speech**           | `generateSpeech`    |
| **Speech to Text**   | `speechToText`      |

Each of these nodes takes a `prompt`, and `generateSpeech` also takes a `voice`. Unlike the LLM node, which can name a model card, none of them names a model — so when one fails, check under **LLM Details** that a card has the matching function ticked; without one, that function is disabled. The same reference section also lists `ffmpeg`, `joinMedia`, `mergeAudioVideo`, `ocr` and `videoFrame` for working with media files. Node-by-node documentation is on [Multimodal nodes](/maistro/ntl/multimodal/).

<!-- UNCONFIRMED: the mAIstro image-reading walkthrough — "Upload a File", the Local Document node, the Set Variable node, the Send to LLM node with the prompt "What is this a picture of?", and Evaluate asking for the file name with its extension. Old docs, verbatim page; no mAIstro screen has been checked against it. -->

To have an agent describe a picture, upload the image as a file (see [Upload data](/maistro/ntl/upload-data/)) so it becomes a Local Document node, optionally store it in a variable, then send it with a prompt such as `What is this a picture of?` to a Send to LLM node that uses a model whose **Inputs:** include an image. When you select Evaluate, you are asked for the image file name, including its extension.

## When to use it

- You want NeuralSeek or an agent to generate or edit images, produce speech or transcribe audio, and need to put a model that can do it on a card.
- A media node or feature does nothing, and you want to check whether any card has that function ticked.
- You are choosing a model in **Add an LLM** and want to know which media jobs it supports before you add it.
- You want an agent to read images, and need a model whose **LLM Notes** list image among its inputs.

If your models only answer Seek questions, translate and run text prompts, none of the six media functions matters; [LLM Details](/configuration/neural-config/llm-details/) covers what you need. To spread one function across several models, see [Multi-LLM](/configuration/multi-llm/).

## FAQ

### Why can't I tick Image Generation on my model card?

The card's model cannot generate images — in the section's words, "Features that an LLM are not capable of will be unselectable." Add a model whose **LLM Notes** do not list **Image Generation** under "This LLM does not support:", then tick the box on its card.

### What happens if no card has a media function ticked?

That function is disabled for the configuration. The rule above the cards says "there is no fallback and that function of NeuralSeek will be disabled" — no default model takes over. Tick the function on a card whose model supports it and save the configuration.

### How do I know whether a model can read an image I send it?

In the **Add an LLM** dialog, select the model and look at the **Inputs:** icons in its **LLM Notes**. An image icon there means the model accepts images as input, even when **Image Generation** is greyed out on its card.

### Two cards both have Image Generation ticked — which one is used?

Both. NeuralSeek "will load-balance across them for the selected functions that have multiple LLM's", the same as for a text function. Each card's **Weight** sets its share; see [Multi-LLM](/configuration/multi-llm/).

## Related

- [LLM Details](/configuration/neural-config/llm-details/)
- [Managed LLM Details](/configuration/neural-config/managed-llm/)
- [Supported LLMs](/configuration/supported-llms/)
- [Multi-LLM](/configuration/multi-llm/)
- [Multimodal nodes](/maistro/ntl/multimodal/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/)
