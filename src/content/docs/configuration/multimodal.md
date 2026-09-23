---
title: "Multimodal LLM configuration"
description: "NeuralSeek records which model can produce or transform media through six checkboxes on each LLM Details card — Image Generation, Image Edits, Video, Speech, Music and Speech to Text — and greys out the ones a model cannot do."
---

## What is it

Multimodal configuration is the part of **LLM Details** (Neural Config → Default Config → Edit Configuration) that deals with media rather than text. Every model card in that section carries the same twenty **LLM Functions** checkboxes; six of them are media functions: **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music** and **Speech to Text**. A ticked box assigns that media job to the model; a greyed-out box means the model is not capable of it and the box cannot be selected.

This page explains how to read those six boxes, what a greyed box means for the instance as a whole, and where a model with media capabilities is added. The rest of the card — the other fourteen functions, weights, identifiers, **Enable All** and **Disable All** — is documented on [LLM Details](/configuration/neural-config/llm-details/).

## Why it matters

The section's own rule is short and has no exceptions. In the product's words: "You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled."

For media that has two consequences. A model that cannot generate images will never be asked to, because its **Image Generation** box cannot be ticked. And if no card on the instance has a given media function ticked, that function is simply off — there is no default model behind it, and nothing on this screen warns you.

## When to use it

- You are adding a model so that NeuralSeek can generate or edit images, and you need to know where the capability shows up once the card exists.
- A media feature is not working and you want to check whether any card actually claims it.
- You are reviewing an instance and want to know, per model, what media it is allowed to produce.

Not the page for text-only work: if every model on the instance is used for Seek answers, translation and mAIstro prompts, none of the six media boxes matters and [LLM Details](/configuration/neural-config/llm-details/) covers what you need. It also does not cover reading images as input — see the FAQ.

## How it works

### Which model card can handle media

Open **LLM Details** and look at the **LLM Functions** grid of each card. The six media checkboxes sit in the last rows, after **System AI** and before **maistro**. Each is in one of three states: ticked (this model does that job), clear (it could, but is not assigned), or greyed out (it cannot).

![The LLM Details panel with the Add an LLM button, the rules paragraph, and the Managed GPT and Managed gpt-image cards side by side — on Managed GPT the six media checkboxes are greyed out, on Managed gpt-image Image Generation and Image Edits are ticked and everything else is greyed](/img/neural-config/llm-details-panel.png)

On the captured instance the four cards read like this:

| Card                | Image Generation | Image Edits | Video      | Speech     | Music      | Speech to Text |
| ------------------- | ---------------- | ----------- | ---------- | ---------- | ---------- | -------------- |
| `Managed GPT`       | greyed out       | greyed out  | greyed out | greyed out | greyed out | greyed out     |
| `Managed gpt-image` | **ticked**       | **ticked**  | greyed out | greyed out | greyed out | greyed out     |
| `Translate`         | greyed out       | greyed out  | greyed out | greyed out | greyed out | greyed out     |
| `gpt-oss-20b`       | greyed out       | greyed out  | greyed out | greyed out | greyed out | greyed out     |

So `Managed gpt-image` (LLM ID `ns-gpt-image`) is the only card that produces media, and it does two things: **Image Generation** and **Image Edits**. On `Managed gpt-image` every non-media function is greyed out in turn — it is a media-only card. **Video**, **Speech**, **Music** and **Speech to Text** are greyed on all four cards, so by the no-fallback rule those four functions are disabled on this instance. The greyed boxes look like this on `Managed GPT`:

![The Image Generation checkbox on the Managed GPT card, greyed out](/img/neural-config/llm-details--image-generation.png)
![The Image Edits checkbox on the Managed GPT card, greyed out](/img/neural-config/llm-details--image-edits.png)

Two things the screen does not tell you. It does not say which product surface calls each media function — the label is all there is. And it has no checkbox for image _input_: the six functions describe what a model can produce or transform, not what it can read. Whether a model's ability to look at a picture is recorded anywhere on its card was not visible on the captured instance.

Because the boxes are shared with the owner page, the mechanics — **Enable All** / **Disable All**, load balancing when two cards tick the same function, and the `Weight: 100` share — are on [LLM Details](/configuration/neural-config/llm-details/) and [Multi-LLM](/configuration/multi-llm/).

### Adding a model with media capabilities

A model card exists only after it is added, so the entry point for any multimodal setup is the blue **Add an LLM** button at the top-left of the **LLM Details** section, beside the rules paragraph.

![The Edit Configuration dialog for Default Config with the LLM Details section expanded: the blue Add an LLM button and the rules paragraph above the first two cards, and the Propose Changes and Save footer](/img/neural-config/llm-details.png)

**Add an LLM** opens a dialog of the same name with **Cancel** and **Add** buttons. The dialog was not opened in this capture, so which platforms and models it lists — and whether a particular vision or image model is among them — is documented on [LLM Details](/configuration/neural-config/llm-details/) and [Supported LLMs](/configuration/supported-llms/), not here. Once the card exists, its media capabilities are whatever the six boxes allow: tick the ones you want the model to serve.

Each card also has a **Test** button next to **Delete**. It checks the model's connection; it was never pressed in this capture, so what a successful result looks like is not confirmed.

<!-- UNCONFIRMED: the old page's walkthrough named "OpenAI GPT-4o" as the example model to choose, said its connection detail is an API Key, and said the Test button "turns green" on success — the dialog and a third-party card's connection fields are on no captured screen (the managed cards show only LLM Languages under Connection Info). Old docs, verbatim page. -->

The older walkthrough for this page chose GPT-4o in the dialog, entered an API key as its connection detail and pressed **Test** until the button turned green; none of that was reproduced here.

Changes to the section take effect when the configuration is saved. **Save** and **Propose Changes** in the dialog footer, and the **Version Information** prompt that asks for a name for the saved version, are covered on [Using this page](/configuration/neural-config/using-this-page/).

### Sending an image to a model from mAIstro

Ticking a media box makes the capability available; using it happens elsewhere. The NTL reference documents an `images` parameter on the `LLM` node, described as "Images to include with the prompt", alongside a `modelCard` parameter that picks the card. The node's syntax, as the `ntl://reference` resource returned it:

```text
{{ LLM | prompt: "Your prompt here" | cache: "true" | images: "" | modelCard: "" | stream: "false" | maxTokens: "" | minTokens: "" | temperatureMod: "" | toppMod: "" | freqpenaltyMod: "" | timeout: "" }}
```

The previous version of this page carried a worked example that builds on that node. It is kept here as background only: no part of it was captured or run in this pass, and the node names and snippets should be checked against [Upload data](/maistro/ntl/upload-data/) and the [NTL overview](/maistro/ntl-overview/) before use.

<!-- UNCONFIRMED: the whole mAIstro walkthrough below — the "Upload data" search, the Upload a File action, the Local Document node and its `<< name: img, prompt: true, desc: Enter image file name >>` snippet, the Set Variable node, the Send to LLM node with the prompt "What is this a picture of?" and the image reference `<< name: img, prompt:false >>`, the Evaluate prompt for the file name. Old docs, verbatim page; nothing from mAIstro was in this capture. -->

1. In mAIstro, search the left pane for "Upload data" and choose "Upload a File"; the uploaded image appears as a Local Document node whose dropdown lists your uploaded files.
1. Optionally add a Set Variable node so the image can be reused under a name of your choosing.
1. Add a Send to LLM node with a prompt such as `What is this a picture of?`, reference the uploaded image in its image field, and pick a model that can read images.
1. Press Evaluate; you are asked for the image file name (with extension) and the agent returns a description.

## FAQ

### How do I know whether a model can generate or edit images?

Open its card under **LLM Details** and look at **Image Generation** and **Image Edits** in the **LLM Functions** grid. If the boxes are selectable — clear or ticked — the model can do them; if they are greyed out it cannot, per the section's rule that "features that an LLM are not capable of will be unselectable". On the captured instance only `Managed gpt-image` has them ticked.

### Why are Video, Speech, Music and Speech to Text greyed out on every card?

None of the four models on that instance supports them, so the boxes cannot be ticked on any card. By the no-fallback rule a function that no card claims is disabled for the whole instance; adding a model that supports one of them is the only way to turn it on.

### Where do I add GPT-4o or another multimodal model?

Through **Add an LLM** at the top of **LLM Details**. The dialog's platform and model choices were not captured for this page; see [LLM Details](/configuration/neural-config/llm-details/) and [Supported LLMs](/configuration/supported-llms/). After the card is added, tick the media functions you want it to serve.

### Is there a setting for reading images (image input)?

Not as a checkbox on this screen. The six media functions are about producing or transforming media — generating and editing images, video, speech, music, and transcribing speech. Whether a model's ability to read an image is shown anywhere on its card is not confirmed from the captured instance; the NTL `LLM` node does accept an `images` parameter, which is where a picture is attached to a prompt.

### How do I actually send an image to the model?

From a mAIstro agent: upload the file, then pass it to the `LLM` node through its `images` parameter with a model card that can read it. The step-by-step example on this page comes from the previous documentation and has not been re-verified; treat it as a starting point and check the node reference.

### Does ticking Image Generation on two cards split the work?

The section's rule says NeuralSeek "will load-balance across them for the selected functions that have multiple LLM's", so yes, the same way as any other function. How the **Weight** values decide each card's share is on [Multi-LLM](/configuration/multi-llm/). On the captured instance no media function is ticked on more than one card.
