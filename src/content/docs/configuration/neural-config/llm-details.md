---
title: "LLM Details"
description: "LLM Details is the section of the Edit Configuration dialog where each model NeuralSeek may call is a card, and where you tick which of the twenty LLM functions that model performs, set its LLM ID and its load-balancing weight."
---

## What is it

**LLM Details** is the third section of the **Edit Configuration** dialog on the **Neural Config** screen. It holds one card per model NeuralSeek is allowed to call, and on each card the list of jobs — the **LLM Functions** — that model may be used for.

The section states its own rules in the paragraph next to the **Add an LLM** button:

> You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled.

Those sentences are the whole model of this screen: at least one card; several cards may share a function; a box the model cannot do is greyed out; and a function nobody is assigned to stops working.

## Why it matters

Almost everything in NeuralSeek that generates text, translates, classifies or produces an image goes through a model card here. The checkboxes on a card are therefore not preferences — they are the on/off switches for those features. A function with no model behind it does not fall back to another model; it is disabled until a card claims it.

The same cards are where cost and capability are divided: which model answers a Seek, which one does the cheap bulk work such as categorization, and which one handles images.

## When to use it

- You are configuring a new instance and need at least one model before anything else works.
- A capability you expect — translation, image generation, PII detection — is unavailable, and you want to see whether any card is ticked for it.
- You want a second model to share the load on a function, or to take one job away from an expensive model.
- You are retiring a model, renaming its id, or testing that its connection still works.

## How it works

### Where the section lives and its rules

Open **Neural Config**, click the **Default Config** node on the routing tree, then **Edit Configuration**. The dialog `Configuration: Default Config` opens with its sections as an accordion; **LLM Details** is the third header, after **KnowledgeBase Connection** and **KnowledgeBase Tuning**. The other sections are listed on [Neural Config options](/configuration/neural-config/).

![The Edit Configuration dialog with the LLM Details section expanded: the Add an LLM button on the left, the paragraph stating the load-balancing and no-fallback rules, and the top of the first two model cards](/img/neural-config/llm-details.png)

Expanding **LLM Details** shows three things:

- **Add an LLM** — a button that opens an `Add an LLM` dialog with **Cancel** and **Add**. This is where a model is chosen and its connection details are supplied. The dialog was not opened for this page, so the list of platforms it offers is not shown here; the models NeuralSeek can talk to are the subject of [Supported LLMs](/configuration/supported-llms/), adding an image-capable model is on [Multimodal LLM configuration](/configuration/multimodal/), and running several models at once is on [Multi-LLM](/configuration/multi-llm/).
- The paragraph quoted above.
- The model cards, side by side. The instance the screenshots come from carries four: `Managed GPT`, `Managed gpt-image`, `Translate` and `gpt-oss-20b`.

### A model card

Every model is one card, and every card has the same parts. Reading `Managed GPT` from top to bottom:

![The header of the Managed GPT card: an info icon at the left, the card name with the provider logo, and the Copy icon at the right](/img/neural-config/llm-details--managed-gpt.png)

<!-- UNCONFIRMED: Copy duplicates the card so the same model can be used twice under different function assignments or a different weight — the migration gap audit ("Copy LLM — duplicate a model card to reuse it with different settings"); Copy was never clicked in the capture -->

- The header carries the model's name and **Copy** at the top right. Copy duplicates the card, which is the quickest way to run the same model twice under different function assignments or a different weight.
- **Connection Info** — a sub-accordion holding the card's connection settings. On all four NeuralSeek-managed cards captured here it contains a single control, the language list. What it shows for a model connected to your own provider account was not captured.

![The Connection Info sub-section of a card, expanded: a chip reading 187 with a clear button, the Enabled Languages dropdown, and the LLM Languages label under it](/img/neural-config/llm-details--llm-languages.png)

- **LLM Languages** — the label under the language control. The control is a dropdown named **Enabled Languages** with a count chip in front of it: the number of languages enabled for that model, `187` on `Managed GPT`, `Managed gpt-image` and `gpt-oss-20b`, `96` on `Translate`. Opening it shows a checklist of languages running from `Abkhazian` to `Zulu`. Language behaviour across the instance is covered on [Language support](/configuration/language/).

![The Enabled Languages list open: a scrolling checklist starting Abkhazian, Afar, Afrikaans, Akan, Albanian, Amharic, every visible box ticked](/img/neural-config/llm-details--options-llm-languages.png)

- **LLM Functions** — the group of twenty checkboxes, with **Enable All** and **Disable All** as two icon controls beside the group's label. They apply to the card you click them on, not to the section. The functions themselves are the next section.
- **LLM ID:** — the identifier that refers to this card, shown as text (`LLM ID: ns-gpt-5`) with an **Edit Name** pencil beside it. On the captured instance the four values are `ns-gpt-5`, `ns-gpt-image`, `translate-ns` and `gpt-oss-20b-ns`. The pencil opens an `Edit Card ID` dialog with **Cancel** and **Update**.
- **Weight:** — the card's load-balancing weight, `Weight: 100` on every card here, with its own **Edit Name** pencil. That one opens the `Load Balancing Weight` dialog, whose range is drawn from `1` to `100`, again with **Cancel** and **Update**. Both pencils carry the accessible name **Edit Name**, so a screen reader announces the weight control as "Edit Name" too.
- **Delete** — the red trash-can button at the foot of the card (its accessible name is `Delete trash-can`). There is no "Remove" on this screen; Delete is the per-card removal. Deleting a card takes with it every function that card was the only one ticked for — see the no-fallback rule below.
- **Test** — the blue button beside Delete. The screen gives no text on what it checks; it was not clicked for this page.

**Connection Info**, **Copy**, **Test**, **Delete**, **Enable All**, **Disable All** and **Edit Name** work the same way on the embedding cards described on [Embedding models](/configuration/neural-config/embedding-models/).

The **LLM ID:** is the value an agent can use to pin a step to one card. The NTL `LLM` node has a `modelCard` parameter for it; `ntl://reference` describes it as:

```text
modelCard | llm | — | Override the default LLM model
```

The reference does not say which value the parameter takes, so whether it is the card's **LLM ID:** exactly as shown (`ns-gpt-5`) is not confirmed here.

### LLM Functions — the twenty checkboxes

Under **LLM Functions** each card carries the same twenty checkboxes. In screen order they are: **Seek**, **PII Detection**, **Conversation Generation**, **Entity Extraction**, **Slot Filling**, **Categorization**, **Example Generation**, **Intent Creation**, **Translate**, **Fallback Language Id**, **Fallback Sentiment**, **Table Understanding**, **System AI**, **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music**, **Speech to Text** and **maistro**.

Two spellings to keep apart: the lower-case **maistro** box on a model card is this page's control; the **mAIstro** checkbox on an embedding card belongs to [Embedding models](/configuration/neural-config/embedding-models/).

![The LLM Details panel: the Add an LLM button, the rules paragraph, and the Managed GPT and Managed gpt-image cards in full — each with its Connection Info, its LLM Functions grid of ticked, clear and greyed-out boxes with the Enable All and Disable All icons beside the label, the LLM ID and Weight rows whose pencils open Edit Card ID and Load Balancing Weight, and the top edge of the Delete and Test buttons cut off by the crop](/img/neural-config/llm-details-panel.png)

A checkbox is in one of three states, and each says something different:

- **Ticked** — this model performs that job.

  ![The System AI checkbox on the Managed GPT card, ticked](/img/neural-config/llm-details--system-ai.png)

- **Clear** — the model could do the job but is not assigned to it.
- **Greyed out** — the model is not capable of it. The only explanation the screen gives is the paragraph's sentence, "Features that an LLM are not capable of will be unselectable." No tooltip was captured on a greyed box.

The four cards on the captured instance divide the work between them:

| Card                | Ticked                                                                                                                                                                                         | Greyed out                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Managed GPT`       | **System AI**                                                                                                                                                                                  | **Table Understanding**, **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music**, **Speech to Text** |
| `Managed gpt-image` | **Image Generation**, **Image Edits**                                                                                                                                                          | every other function                                                                                                |
| `Translate`         | **Translate**                                                                                                                                                                                  | every other function                                                                                                |
| `gpt-oss-20b`       | **Seek**, **PII Detection**, **Entity Extraction**, **Categorization**, **Example Generation**, **Intent Creation**, **Translate**, **Fallback Language Id**, **Fallback Sentiment**, **maistro** | **Conversation Generation**, **Slot Filling**, **Table Understanding**, **System AI** and the six media functions   |

Three things the table shows. **Translate** is the only function ticked on two cards (`Translate` and `gpt-oss-20b`), so it is the only load-balanced function on this instance. **Seek** is ticked on exactly one card. **Conversation Generation** and **Slot Filling** are ticked on none — clear on `Managed GPT`, greyed out everywhere else — which by the paragraph's rule means those two functions are disabled on this instance.

The six media functions — **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music** and **Speech to Text** — are the subject of [Multimodal LLM configuration](/configuration/multimodal/).

### Load balancing and the no-fallback rule

Two rules govern what happens once more than one card exists, both from the paragraph at the top of the section:

- **Tick the same function on two cards and NeuralSeek "will load-balance across them"** for that function. **Weight:** decides each card's share: the `Load Balancing Weight` dialog behind its pencil runs from `1` to `100`, and every card on the captured instance sits at `100`. How the weights combine when several models share the work is covered on [Multi-LLM](/configuration/multi-llm/).
- **Tick a function on no card and that function is off.** In the product's words, "there is no fallback and that function of NeuralSeek will be disabled." Deleting a card, or clicking **Disable All** on the only card that held a function, is enough to do it. No warning was observed when this happens, so check the function grid on the remaining cards before you delete one.

![Screenshot needed — the Load Balancing Weight dialog](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config > Default Config > Edit Configuration > LLM Details > the pencil beside "Weight:" on any card — the open Load Balancing Weight dialog with its 1–100 range and the Cancel / Update footer.
     Why: the dialog was never opened in the capture; the reader has only the closed "Weight: 100" row to go on. -->

### Not on this screen

The following are asked about by the migration gap audit or the older overview but appear on no captured state of this section. They are listed so a reader knows they are not simply omitted; none is verified.

<!-- UNCONFIRMED: every item in this list — the Add an LLM platform list (dialog never opened), Model Code, Context Window, Seek Multiplier, Input / Output modalities, "additional LLMs default to opted out of everything except mAIstro" (migration gap audit); the Managed LLM version picker and the bring-your-own connection fields API/Access Key, Secret/Zen Key, Endpoint, Region, Project Id (old Neural Config overview). Not on any snapshot of this capture. -->

- The platform list inside **Add an LLM**.
- Per-model fields the gap audit names — a Model Code, a Context Window, a Seek Multiplier, and Input / Output modalities. If they exist, they are inside `Add an LLM` or in the **Connection Info** of a bring-your-own card; on the four managed cards **Connection Info** holds only **LLM Languages**.
- Connection fields for a model on your own provider account (an API or access key, an endpoint, a region, a project id).
- A version picker for the managed models — see [Managed LLM](/configuration/neural-config/managed-llm/).
- What a newly added card is ticked for by default.

## FAQ

### What happens if no model is assigned to a function?

That function stops working. The section says it plainly: "If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled." NeuralSeek does not borrow another model to cover the gap.

### Why are some function checkboxes greyed out?

Because the model cannot do that job — "Features that an LLM are not capable of will be unselectable." On the image model captured here every text function is greyed out, and on the text models the media functions are. A greyed-out box is a statement about the model, not about your permissions.

### How do I split traffic between two models?

Tick the same function on both cards; NeuralSeek then load-balances across them for that function. Set each card's share with the pencil beside **Weight:**, which opens the `Load Balancing Weight` dialog and accepts a value from `1` to `100`.

### Where do I find the identifier for a model, and can an agent use it?

On the card, as **LLM ID:** — for example `ns-gpt-5` or `gpt-oss-20b-ns`. The **Edit Name** pencil beside it opens the `Edit Card ID` dialog (**Cancel** / **Update**) to change it. The NTL `LLM` node's `modelCard` parameter overrides the default model for one step; whether it takes this exact id is not confirmed on this page.

### What is the number on the chip next to Enabled Languages?

It is the count of languages enabled for that model under **LLM Languages**. Three of the captured cards show `187`; the `Translate` card shows `96`.

### Where do I add a model from my own provider?

With **Add an LLM** at the top of the section. Its dialog (**Cancel** / **Add**) was not captured for this page; the platforms it offers are on [Supported LLMs](/configuration/supported-llms/).
