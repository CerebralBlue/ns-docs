---
title: "Supported LLMs"
description: "Which language models NeuralSeek can use is decided by the Add an LLM dialog in LLM Details on your own instance, not by a fixed list; this page explains how to read that list, what a Managed model card is, and where each model's settings live."
---

## What is it

In NeuralSeek, a model is "supported" when it can be added as a card in the **LLM Details**
section of a configuration and ticked for the functions it is allowed to perform. The list of
platforms and models you can add is not published as a table here: it is the **Add an LLM**
dialog on your own instance, which is instance-specific and changes as NeuralSeek adds
providers. This page tells you where that list is, how to read the cards it produces, and which
page holds the per-model settings — see [LLM Details](/configuration/neural-config/llm-details/)
for those.

The page is an orientation page, not a settings screen. Nothing on it is a control you change.

## Why it matters

An LLM in NeuralSeek is not one global choice. Each model card carries an **LLM Functions**
grid, and the models you connect decide which parts of the product work at all. The **LLM
Details** section states the rule in its own help text:

> You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them
> for the selected functions that have multiple LLM's. Features that an LLM are not capable of
> will be unselectable. If you do not provide an LLM for a function, there is no fallback and
> that function of NeuralSeek will be disabled.

So "is my model supported?" is really two questions: can it be added at all (the dialog answers
that), and which functions can it be ticked for once added (the card answers that).

## When to use it

Read this page when you are:

- choosing a provider before connecting anything, and want to know where the real list is;
- looking at a greyed-out function checkbox and wondering whether another model would enable it;
- deciding between a NeuralSeek-hosted `Managed` card and a model on your own account — see
  [Managed LLM Details](/configuration/neural-config/managed-llm/);
- spreading functions across several models, which is covered by
  [Multi-LLM](/configuration/multi-llm/);
- planning image work, which is covered by
  [Multimodal LLM configuration](/configuration/multimodal/);
- running a model on your own infrastructure — see
  [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/).

Do not use this page as an inventory of what your instance can select right now. Open
**Add an LLM** for that.

## How it works

Everything described here sits in one place: **Neural Config**, click the **Default Config /
Answer Generation** node, then **Edit Configuration**; in the dialog's accordion, expand
**LLM Details**.

![The collapsed LLM Details accordion header in the Edit Configuration dialog — the row to click](/img/neural-config/edit-configuration-edit--add-an-llm.png)

### Where the model list lives

Expanding **LLM Details** shows the **Add an LLM** button on the left, the help paragraph quoted
above beside it, and one card per model already on the instance.

![The LLM Details section expanded: the Add an LLM button, the load-balancing and no-fallback paragraph, and the Managed GPT and Managed gpt-image cards with their LLM Functions, LLM ID and Weight rows](/img/neural-config/llm-details-panel.png)

- **Add an LLM** opens the `Add an LLM` dialog, whose footer is **Cancel** and **Add**. This
  dialog is the catalogue: the platforms and models it offers are the ones your instance
  supports. It was not opened when this page was captured, so its contents are not reproduced
  here — open it on your instance to see them. How to fill it in and what happens next is on
  [LLM Details](/configuration/neural-config/llm-details/).
- **LLM Functions** is the checkbox grid on every card. "Features that an LLM are not capable
  of will be unselectable" is visible in the capture: on the `Managed gpt-image` card every box
  except **Image Generation** and **Image Edits** is greyed, while on `Managed GPT` most boxes
  are selectable. A greyed box is the product telling you that model cannot do that job, not a
  permission you are missing. The twenty functions themselves are listed on
  [LLM Details](/configuration/neural-config/llm-details/).
- **LLM ID:** is the identifier at the foot of each card. The instance captured for this page
  carried four cards — `Managed GPT` (`ns-gpt-5`), `Managed gpt-image` (`ns-gpt-image`),
  `Translate` (`translate-ns`) and `gpt-oss-20b` (`gpt-oss-20b-ns`). These are the models on
  that one instance, not a list of what NeuralSeek supports; a card whose name starts with
  `Managed` is one NeuralSeek hosts, described on
  [Managed LLM Details](/configuration/neural-config/managed-llm/).

### What this page does not know

The platform list inside **Add an LLM** was not captured, so the page cannot say which platforms
the dialog names today, nor whether any particular provider is present or absent from it.

![Screenshot needed — the Add an LLM dialog with its platform list open](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config > Default Config / Answer Generation > Edit Configuration > LLM Details > click "Add an LLM" — the open dialog with its platform dropdown expanded so every platform name is legible; then Cancel.
     Why: the platform list is the only fact this page exists to give and it lives nowhere else on the screen. -->

<!-- UNCONFIRMED: the provider list below (Amazon Bedrock, Azure Cognitive Services, Cloudflare, Google Vertex AI, HuggingFace, OpenAI, together.ai, watsonx.ai, plus any generic OpenAI-compatible endpoint) — the last published old-docs list; the Add an LLM dialog was not opened in this capture, and the route's gap audit says the list is stale -->

For orientation only, the last published list named Amazon Bedrock, Azure Cognitive Services,
Cloudflare, Google Vertex AI, HuggingFace, OpenAI, together.ai and watsonx.ai, plus any generic
OpenAI-compatible endpoint. Treat every name as "was offered at some point": providers have been
added since and the dialog on your instance is the only current answer. The previous site also
carried a per-model table for each provider with notes on how each model behaved in NeuralSeek;
those tables are not reproduced here because the models they describe are several generations
behind what the dialog offers.

Two more statements come from the previous site and were not checked against the product:

<!-- UNCONFIRMED: "LLM choice is available with NeuralSeek's BYOLLM (bring your own Large Language Model) plan; all other plans default to NeuralSeek's curated LLM" — old-docs prose; no plan control is on the captured screen -->

- Adding your own model was described as part of the BYOLLM (bring your own Large Language
  Model) plan, with other plans defaulting to NeuralSeek's curated model. If **Add an LLM** is
  not on your screen, your plan is the first thing to check.

<!-- UNCONFIRMED: "Some LLMs can take up to 30 seconds and longer to generate a full response; use caution with a virtual agent platform that imposes a strict timeout" — old-docs prose; no timing was probed -->

- Some models were noted to take 30 seconds or longer for a full response, which matters when a
  virtual agent platform in front of NeuralSeek enforces a strict timeout.

### Per-model settings are elsewhere

This page has no controls of its own. Once a model is a card, everything about it is configured
on the card, and the card is documented on
[LLM Details](/configuration/neural-config/llm-details/): **Connection Info** and its
**LLM Languages**, the **LLM Functions** grid with **Enable All** / **Disable All**, the
**Weight:** row that sets the card's share of load-balanced traffic, and the **Test** and
**Delete** buttons. Splitting one function across two cards is on
[Multi-LLM](/configuration/multi-llm/); the image functions are on
[Multimodal LLM configuration](/configuration/multimodal/); the `Managed` cards are on
[Managed LLM Details](/configuration/neural-config/managed-llm/).

## FAQ

### Is my model supported?

Open **Edit Configuration** → **LLM Details** → **Add an LLM** on your own instance. The dialog
lists the platforms and models available to you, and that list is the only current one. This
page cannot list them for you: the dialog was not captured, and the previously published list
is out of date.

### What is a "Managed" model?

A card NeuralSeek hosts for you. On the captured instance its **Connection Info** holds only
**LLM Languages** — there is no key or endpoint to enter. The instance shows two of them,
`Managed GPT` and `Managed gpt-image`, alongside `Translate` and `gpt-oss-20b`. What the managed cards offer and how they are versioned is on
[Managed LLM Details](/configuration/neural-config/managed-llm/).

### Why is a function greyed out on my model?

Because that model cannot do that job. In the product's words, "Features that an LLM are not
capable of will be unselectable." The `Managed gpt-image` card shows it: only **Image Generation**
and **Image Edits** can be ticked. To enable the function, add a model that has it.

### Do I need one model that does everything?

No. Several cards can each claim functions; where two cards tick the same function NeuralSeek
"will load-balance across them", and a function no card ticks is disabled — "there is no
fallback". Pick models per function, then check that every function you rely on is ticked on at
least one card. The details are on [Multi-LLM](/configuration/multi-llm/).
