---
title: "LLM Details"
description: "LLM Details is the section of the Edit Configuration dialog where each model NeuralSeek may call is added as a card, and where you set which of the twenty LLM functions that model is allowed to perform, its LLM ID and its load-balancing weight."
---

## What is it

**LLM Details** is a section of the **Edit Configuration** dialog on the **Neural Config** screen. It holds one card per model NeuralSeek is allowed to call, and on each card the list of jobs — **LLM Functions** — that model may be used for.

The section states its own rules in a paragraph next to the **Add an LLM** button:

> You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled.

Those three sentences are the whole model of this screen: at least one card, several cards share a function, and a function nobody is assigned to stops working.

## Why it matters

Almost every part of NeuralSeek that generates text, translates, classifies or produces an image goes through a model card here. The checkboxes on a card are therefore not preferences — they are the on/off switches for those features. A function with no model behind it does not fall back to another model; it is disabled, quietly, until a card claims it.

The same cards are also where cost and capability are decided: which model answers a Seek, which model does the cheap bulk work such as categorization, and which model handles images.

## When to use it

- You are configuring a new instance and need at least one model before anything else works.
- A capability you expect — translation, image generation, PII detection — is unavailable, and you need to see whether any model is assigned to it.
- You want a second model to share the load on a function, or to take one job away from an expensive model.
- You are retiring a model, renaming its id, or testing that its connection still works.

## How it works

Open **Neural Config**, click the **Default Config** node, then **Edit Configuration** in the dialog's footer. In the accordion that opens, expand **LLM Details**. (The accordion sections and the route to them are described on [Configuration overview](/configuration/overview/).)

![The LLM Details section of the Edit Configuration dialog, expanded: the Add an LLM button, the paragraph explaining load balancing and the no-fallback rule, and the first two model cards with their Connection Info sub-sections open](/img/neural-config/llm-details.png)

### Adding a model

- **LLM Details** — the accordion header. Expanding it shows **Add an LLM**, the paragraph quoted above, and the existing cards side by side.
- **Add an LLM** — opens an `Add an LLM` dialog with **Cancel** and **Add**. This is where the model itself is chosen and its connection details are supplied. For the providers and models NeuralSeek can talk to, see [Supported LLMs](/configuration/supported-llms/); for a worked example of adding an image-capable model, see [Multimodal LLM configuration](/configuration/multimodal/).

![Screenshot needed — the Add an LLM dialog with its model list](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config > Default Config > Edit Configuration > LLM Details > Add an LLM — the open dialog showing the model catalogue and the connection fields for one model, with its Cancel / Add footer.
     Why: the dialog has never been captured, and the list of models it offers is the first thing a reader setting up an instance needs to see. -->

<!-- UNCONFIRMED: adding a model asks for the connection details for that provider — for GPT-4o, the API Key — and a successful Test turns the button green — old Multimodal LLM configuration page; the Add an LLM dialog was not opened in the capture this page was written from -->

The older Multimodal guide describes the dialog as asking for the connection details of the chosen provider — for GPT-4o, the API key — and says a successful **Test** turns the button green. That has not been re-checked against the current product.

### A model card

Every model is one card, and the cards sit in a row inside the section. The instance the screenshots come from carries four: `Managed GPT`, `Managed gpt-image`, `Translate` and `gpt-oss-20b`.

The card header holds the model's name and **Copy**, which duplicates the card — the quickest way to run the same model twice under different function assignments or a different weight.

Inside the card:

- **Connection Info** — a sub-accordion holding the card's connection settings. On all four NeuralSeek-managed cards captured here it contains a single control, the language list below; what it shows for a model you connect to your own provider account was not captured.
- **LLM Languages** — the label under the language control; the control itself is a listbox with a count chip and a combobox named **Enabled Languages**. The chip is the number of languages enabled for that model: `187` on three of the captured cards and `96` on the `Translate` card. Language behaviour across the instance is covered on [Language support](/configuration/language/).
- **LLM ID:** — the identifier that refers to this card, shown as text with an **Edit Name** control beside it. On the captured instance the values are `ns-gpt-5`, `ns-gpt-image`, `translate-ns` and `gpt-oss-20b-ns`. The control opens an `Edit Card ID` dialog with **Cancel** and **Update**.
- **Weight:** — the card's load-balancing weight, `100` on every card here, with its own **Edit Name** control. It opens the `Load Balancing Weight` dialog, whose range runs from `1` to `100`, with **Cancel** and **Update**. (Both controls carry the accessible name **Edit Name**, so a screen reader announces the weight control as "Edit Name" as well.)
- **Delete** — the trash-can button at the foot of the card. It removes the model, and with it every function that model was the only card for.
- **Test** — checks the card's connection.

**Copy**, **Connection Info**, **Test**, **Delete**, **Enable All** and **Disable All** work the same way on the embedding cards described in [Embedding models](/configuration/neural-config/embedding-models/).

### LLM Functions — what a model is allowed to do

Under **LLM Functions**, each card carries twenty checkboxes, plus **Enable All** and **Disable All** beside the group's label. In screen order the functions are: **Seek**, **PII Detection**, **Conversation Generation**, **Entity Extraction**, **Slot Filling**, **Categorization**, **Example Generation**, **Intent Creation**, **Translate**, **Fallback Language Id**, **Fallback Sentiment**, **Table Understanding**, **System AI**, **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music**, **Speech to Text** and **maistro** (spelled in lower case on this control, unlike **mAIstro** elsewhere in the product).

A checkbox in one of three states tells you three different things: ticked means this model performs that job, clear means it could but is not assigned, and greyed out means the model is not capable of it — "Features that an LLM are not capable of will be unselectable."

![Screenshot needed — the LLM Functions grid on a model card, showing ticked, clear and greyed-out checkboxes](/img/_placeholder.svg)

<!-- SCREENSHOT: Neural Config > Default Config > Edit Configuration > LLM Details — one text model's card cropped to the LLM Functions group: the Enable All / Disable All controls and the twenty checkboxes, with the media functions visibly greyed out.
     Why: the difference between a clear checkbox and a disabled one is the central idea of this section and is purely visual. -->

The four cards on the captured instance divide the work between them:

| Card               | Functions ticked                                                                                                                                                | Greyed out                                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `Managed GPT`      | **System AI**                                                                                                                                                   | **Table Understanding**, **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music**, **Speech to Text**       |
| `Managed gpt-image` | **Image Generation**, **Image Edits**                                                                                                                          | every other function                                                                                                      |
| `Translate`        | **Translate**                                                                                                                                                   | every other function                                                                                                      |
| `gpt-oss-20b`      | **Seek**, **PII Detection**, **Entity Extraction**, **Categorization**, **Example Generation**, **Intent Creation**, **Translate**, **Fallback Language Id**, **Fallback Sentiment**, **maistro** | **Conversation Generation**, **Slot Filling**, **Table Understanding**, **System AI**, and the six media functions |

Read down the table and the division is clear: the text model answers and classifies, the image model does only images, the translation model does only translation, and the general model keeps **System AI** for itself. The media functions — **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music** and **Speech to Text** — are the subject of [Multimodal LLM configuration](/configuration/multimodal/).

**Enable All** and **Disable All** apply to the card you click them on, not to the section.

### Load balancing and the no-fallback rule

Two rules govern what happens once more than one card exists:

- **Tick the same function on two cards and NeuralSeek load-balances across them** for that function. **Weight:** decides the share each card takes; the `Load Balancing Weight` dialog accepts `1` to `100`, and every card on the captured instance sits at `100`, an even split. Running several models at once is covered more broadly on [Multi-LLM](/configuration/multi-llm/).
- **Tick a function on no card and that function is turned off.** In the product's words, "there is no fallback and that function of NeuralSeek will be disabled." Deleting a card, or clicking **Disable All** on the only card that held a function, is enough to do it — nothing warns you that a feature has gone quiet.

Because of the second rule, check the function grid on the remaining cards before you delete one.

## FAQ

### What happens if no model is assigned to a function?

That function stops working. The section says it plainly: "If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled." NeuralSeek does not borrow another model to cover the gap.

### Why are some function checkboxes greyed out?

Because the model cannot do that job — "Features that an LLM are not capable of will be unselectable." On the image model captured here every text function is greyed out, and on the text models the media functions are. A greyed-out box is a statement about the model, not about your permissions.

### How do I split traffic between two models?

Tick the same function on both cards; NeuralSeek then load-balances across them for that function. Set each card's share with **Weight:**, which opens the `Load Balancing Weight` dialog and accepts a value from `1` to `100`.

### Where do I find the identifier for a model?

On the card, as **LLM ID:** — for example `ns-gpt-5` or `gpt-oss-20b-ns`. The **Edit Name** control beside it opens the `Edit Card ID` dialog (**Cancel** / **Update**) if you want to change it.

### What is the number on the chip next to Enabled Languages?

It is the count of languages enabled for that model under **LLM Languages**. Three of the captured cards show `187`; the `Translate` card shows `96`.

### Can I add the same model twice?

Yes — **Copy** in the card header duplicates a card. The copy is an independent card with its own **LLM ID:**, weight and function assignments, which is how one model can be used for two different jobs under different settings.
