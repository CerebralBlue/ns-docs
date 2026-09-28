---
title: "Multimodal LLM configuration"
description: "Six of the LLM Functions on every LLM Details model card — Image Generation, Image Edits, Video, Speech, Music and Speech to Text — decide which model handles media jobs, and the Add an LLM dialog's LLM Notes show a model's media support before you add it."
---

## What is it

Multimodal configuration is the media side of **LLM Details**, the section of a Neural Config configuration where you add language models and decide what each one is used for. Every model card in that section carries the same grid of **LLM Functions** checkboxes. Six of them are media functions: **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music** and **Speech to Text**. Ticking one assigns that media job to the card's model; a greyed-out box means the model cannot do the job, and the box cannot be selected.

This page covers those six boxes, how to tell a media-capable model from a text-only one, and how to check a model's media support in the **Add an LLM** dialog before you add it. The rest of each card — the text functions, languages, identifiers and buttons — is documented on [LLM Details](/configuration/neural-config/llm-details/).

## Why it matters

The **LLM Details** section states its own rule above the cards: "You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled."

For media, that rule has three consequences:

- A model is never asked to do a media job it cannot do, because the box for that job is greyed out on its card.
- A media function that no card has ticked is off. There is no default model behind it, and the section shows no separate warning.
- If two cards tick the same media function, NeuralSeek shares the work between them.

So whether NeuralSeek can generate an image, edit one or turn speech into text depends entirely on which cards you have and which boxes on them are ticked.

## When to use it

- You want NeuralSeek to generate or edit images, produce speech or transcribe audio, and you need a model that can do it.
- A media step fails or does nothing, and you want to check whether any card actually has that function ticked.
- You are choosing between models in **Add an LLM** and want to know, before adding one, which media jobs it supports.
- You are reviewing a configuration and want to see which model serves which media job.

This is not the page for text-only setups: if your models only answer Seek questions, translate and run mAIstro prompts, none of the six media boxes matters and [LLM Details](/configuration/neural-config/llm-details/) covers what you need. It is also not where a model's ability to _read_ an image is set — there is no card checkbox for that; see [Checking a model's media support before you add it](#checking-a-models-media-support-before-you-add-it).

## How it works

To reach the cards, open **Neural Config**, click the configuration node (for example **Default Config**) and expand **LLM Details** in the configuration dialog. How the dialog, **Save** and **Propose Changes** work is covered on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### The media functions on a model card

Each card's **LLM Functions** grid lists every job NeuralSeek can give a model, with **Enable All** and **Disable All** beside the heading. The six media checkboxes come after **System AI** and before **maistro**. Each box is in one of three states:

- _ticked_ — this card's model serves the job;
- _clear_ — the model can do the job but is not assigned to it;
- _greyed out_ — the model cannot do the job, and the box cannot be ticked.

The greyed boxes below are from a text model's card, which is why none of them can be ticked.

![The Image Generation checkbox on a text model's card, greyed out](/img/neural-config/llm-details--image-generation.png)

**Image Generation** — creating a new image from a prompt.

![The Image Edits checkbox on a text model's card, greyed out](/img/neural-config/llm-details--image-edits.png)

**Image Edits** — changing existing images according to a prompt.

![The Video checkbox on a text model's card, greyed out](/img/neural-config/llm-details--video.png)

**Video** — video work. The card does not say whether this means producing video, reading it, or both (see the Google Vertex AI example under [Checking a model's media support before you add it](#checking-a-models-media-support-before-you-add-it)).

![The Speech checkbox on a text model's card, greyed out](/img/neural-config/llm-details--speech.png)

**Speech** — producing spoken audio from text.

![The Music checkbox on a text model's card, greyed out](/img/neural-config/llm-details--music.png)

**Music** — its own media function, separate from **Speech**. No node in the media section of the NTL reference is dedicated to it, and the card gives no further description.

**Speech to Text** sits directly after **Music** in the same grid and behaves the same way; it has no separate picture here. It covers turning audio into text.

The media section of the NTL reference lists a node for each of these jobs except **Music**. The table pairs each function with the node that does the same job; the card itself does not state which node uses which function.

| LLM function         | NTL node with the same job | What the node takes                                                          |
| -------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| **Image Generation** | `generateImage`            | a prompt and an optional image file name                                     |
| **Image Edits**      | `generateImageEdit`        | a prompt, a name, and the images to edit (base64-encoded image strings)      |
| **Video**            | `generateVideo`            | a prompt and an image to use in the generation                               |
| **Speech**           | `generateSpeech`           | a prompt, instructions, a voice and an audio format                          |
| **Music**            | none listed                | —                                                                            |
| **Speech to Text**   | `speechToText`             | a prompt to prepend to the model input                                       |

What changing a box does follows from the section's rule:

- Tick a media box on a card to make that model serve the job. If it is the only card with the box ticked, it handles every request of that kind.
- Untick it to take the model off the job. If no other card has it ticked, the function is disabled — there is no fallback.
- Tick it on a second card to share the job between both models. The share each card gets is set by its weight; see [Multi-LLM](/configuration/multi-llm/).

**Enable All** and **Disable All** act on the whole grid, text functions included; they are described on [LLM Details](/configuration/neural-config/llm-details/).

### Reading a card: what its model can do

A card greys out whatever its model cannot do, so the pattern of greyed boxes tells you what kind of model it is before you read anything else.

![The LLM Details section: the Add an LLM button and the rules paragraph above two model cards, Managed GPT and Managed gpt-image](/img/neural-config/llm-details-panel.png)

The two cards in the screenshot show the two typical patterns:

- **Managed GPT**, a text model: the text functions are selectable, and all six media boxes — **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music**, **Speech to Text** — are greyed out.
- **Managed gpt-image** (LLM ID `ns-gpt-image`), an image model: **Image Generation** and **Image Edits** are ticked, and every other function, text ones included, is greyed out. It is a media-only card, so it cannot answer Seek questions; a text model has to be on another card for that.

Managed gpt-image is an example of a managed image model card; which cards appear in your configuration depends on the models you have added. In the configuration shown, **Video**, **Speech**, **Music** and **Speech to Text** are greyed out on every card, so by the no-fallback rule those four functions are disabled until a model that supports them is added.

Each card also shows its **LLM ID** and **Weight**. Both belong to [LLM Details](/configuration/neural-config/llm-details/); how weights split a function between cards is on [Multi-LLM](/configuration/multi-llm/).

### Checking a model's media support before you add it

A card only exists after you add a model, so the start of any multimodal setup is the **Add an LLM** button at the top of the **LLM Details** section. It opens the **Add an LLM** dialog, where you pick a **Platform** and an **LLM Selection**. The list of platforms and models is documented on [Supported LLMs](/configuration/supported-llms/) and [Managed LLM Details](/configuration/neural-config/managed-llm/); this page uses the panel on the right of the dialog, **LLM Notes**, which describes the selected model.

![The Add an LLM dialog with Platform NeuralSeek and LLM Selection Managed GPT; the LLM Notes panel says the model does not support Table Understanding, Image Generation, Image Edits, Video, Speech, Music, Speech to Text, and shows Model Code, Inputs and Outputs icons, Context Window and Seek Multiplier](/img/neural-config/add-an-llm@llm-ns-managed-panel.png)

Two parts of **LLM Notes** matter for media:

- **"This LLM does not support:"** names the functions that will be greyed out on the model's card. For **Managed GPT** the list is "Table Understanding, Image Generation, Image Edits, Video, Speech, Music, Speech to Text" — every media function, which is why its card has no media box to tick. A media function missing from this list is one the card will let you tick.
- **Inputs:** and **Outputs:** show, as icons, what the model takes in and gives back. For **Managed GPT** the inputs are Text and Image and the output is Text. This is the only place the screen shows whether a model can read an image; the card has no checkbox for image input, and the six media functions do not cover it.

The other lines — **Model Code**, **Context Window**, **Seek Multiplier** — describe that one model; their values differ from model to model.

A second example shows how the two parts combine. With **Platform** set to Google Vertex AI and **LLM Selection** set to `gemini-3.1-pro-preview`, the does-not-support list is "Table Understanding, Image Generation, Image Edits, Speech, Music, Speech to Text" — **Video** is not on it — and **Inputs:** lists text, image, audio and video while **Outputs:** lists only text.

![The Add an LLM dialog with Platform Google Vertex AI and LLM Selection gemini-3.1-pro-preview; the LLM Notes panel leaves Video out of the does-not-support list and shows text, image, audio and video inputs with a text output](/img/neural-config/add-an-llm@llm-platform-google-vertex-ai-panel.png)

Going by those notes, a card added from this model would leave **Video** selectable. Because the model's only output is text, the notes do not settle whether the **Video** function means making video or reading it.

Press **Add** to create the card, or **Cancel** to close the dialog without adding anything. Then tick the media functions you want the new card to serve and save the configuration.

### Using the media functions from mAIstro

The boxes on a card decide which model serves a media job; the job itself is started elsewhere, usually by a node in a mAIstro agent. The NTL reference groups those nodes in its media section:

```text
## Media (Image, Audio, Video)
### `ffmpeg` — Transform multimedia with ffmpeg. Params: video (document), inputOptions, outputOptions, outputFile
### `generateImage` — Params: prompt (text3), name (text, optional image filename), cache
### `generateImageEdit` — Params: prompt (text3), name, images (images — base64 encoded image strings to use in the edit generation), cache
### `generateSpeech` — Params: prompt (text3), instructions (text3), voice (llmAudioVoice), format (llmAudioFormat), cache
### `generateVideo` — Params: prompt (text3), image (document — an image to use in the generation), cache
### `joinMedia` — Join multimedia files. Params: files, outputFile
### `mergeAudioVideo` — Merge Audio and Video. Params: audio (document, .mp3), video (document, .mp4)
### `ocr` — OCR an image. Params: name (document — the image name)
### `speechToText` — Params: prompt (text — a prompt to prepend to the LLM input), cache
### `videoFrame` — Extract a frame from a video. Params: video (document), frame (default 'last')
```

Node-by-node documentation is on [Multimodal nodes](/maistro/ntl/multimodal/). If one of these nodes does nothing, check under **LLM Details** that a card has the matching function ticked.

<!-- UNCONFIRMED: the mAIstro image-reading walkthrough below — the "Upload data" search and "Upload a File", the Local Document node and its `<< name: img, prompt: true, desc: Enter image file name >>` snippet, the Set Variable node, the Send to LLM node with the prompt "What is this a picture of?" and the image reference `<< name: img, prompt:false >>`, and the Evaluate prompt for the file name. Old docs, verbatim page; no mAIstro screen has been checked against it. -->

Earlier documentation described sending a picture to a model that can read images. Treat it as a starting point and check each node against [Upload data](/maistro/ntl/upload-data/) before relying on it:

1. In mAIstro, search the left pane for "Upload data" and choose "Upload a File". The uploaded image becomes a Local Document node, whose dropdown lists your uploaded files.
1. Optionally add a Set Variable node so the image can be reused under a name of your choosing.
1. Add a Send to LLM node with a prompt such as `What is this a picture of?`, reference the image in its image field, and pick a model whose **Inputs:** include Image.
1. Press Evaluate. You are asked for the image file name, including its extension, and the agent returns a description.

## FAQ

### How do I know whether a model can generate images?

On its card under **LLM Details**, look at **Image Generation** in the **LLM Functions** grid. If the box can be ticked, the model can do it; if it is greyed out, it cannot. Before you add a model, the **Add an LLM** dialog tells you the same thing: if **Image Generation** appears in the **LLM Notes** line "This LLM does not support:", the card will not let you tick it.

### Why are Video, Speech, Music and Speech to Text greyed out?

The card's model cannot do them — in the section's words, "Features that an LLM are not capable of will be unselectable." If they are greyed out on every card, those functions are disabled for the configuration. To turn one on, add a model whose **LLM Notes** do not list it as unsupported, then tick the box on its card.

### What happens if no card has Image Generation ticked?

Image generation is disabled. The section's rule is that "there is no fallback and that function of NeuralSeek will be disabled" — no default model takes over. Tick **Image Generation** on a card whose model supports it, and save the configuration.

### Can a model read images I send it?

Check the **Inputs:** icons in the **Add an LLM** dialog's **LLM Notes** for that model: an Image icon means the model accepts images as input. There is no checkbox for image input on the card — the six media functions cover producing, editing and transcribing media, not reading pictures.

### Two cards both have Image Generation ticked — which one is used?

Both. NeuralSeek "will load-balance across them for the selected functions that have multiple LLM's", the same way as for any text function. Each card's **Weight** sets its share; see [Multi-LLM](/configuration/multi-llm/).
