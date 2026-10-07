---
title: "LLM Details"
description: "LLM Details is the Neural Config section where you add language models as cards and tick, on each card, the LLM Functions that model performs — a function no card has ticked is disabled, with no fallback."
---

**LLM Details** decides which language model does which job in NeuralSeek. Each model you add becomes a card, and each card carries the same list of **LLM Functions** — Seek, translation, PII detection, image generation and so on. Ticking a function on a card sends that work to the card's model. Use this section when you first set up an instance, when you want a different model to take over one job, or when a feature stops working and you need to check whether any model still covers it.

## Where to find it

Open **Neural Config**, select the **Default Config / Answer Generation** node on the routing tree, select **Edit Configuration**, and expand **LLM Details** — the third section, after **KnowledgeBase Connection** and **KnowledgeBase Tuning**. The section's other neighbours are listed on [Neural Config](/configuration/neural-config/).

![The Configuration: Default Config dialog with LLM Details expanded under KnowledgeBase Connection and KnowledgeBase Tuning: the Add an LLM button and the rules beside it](/img/neural-config/llm-details--dialog-top--crop.png)

Changes to a card take effect only after you select **Save** or **Propose Changes** at the foot of the dialog; what each does is on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

## Settings

### Add an LLM

To add a model, select **Add an LLM**, choose the provider and the model in the dialog that opens, and select **Add**. The model appears as a new card in the section.

![The Add an LLM dialog: Platform set to Amazon Bedrock and LLM Selection set to Nova Pro, with the model's LLM Notes on the right, including the functions it does not support, and Cancel and Add in the footer](/img/neural-config/add-an-llm-panel.png)

The providers and their models are listed on [Supported LLMs](/configuration/supported-llms/); the models NeuralSeek hosts for you are on [Managed LLM Details](/configuration/neural-config/managed-llm/). If you run a model yourself, see [Self-hosting an LLM](/configuration/administration/self-hosting-an-llm/). Before you add a model, read the dialog's notes: the "This LLM does not support" line lists the functions that will be greyed out on its card.

The text beside the button states the rules the whole section follows:

> You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled.

In practice: keep at least one card; give a function to two cards when you want them to share it (see [Multi-LLM](/configuration/multi-llm/)); and before you remove a function from a card, make sure another card has it ticked, or that feature stops working.

### The card header and Copy

Each card is titled with the model's name, for example **Managed GPT**.

![The header of the Managed GPT card: an info icon at the left, the model name with the provider logo, and the Copy icon at the top right](/img/neural-config/llm-details--managed-gpt.png)

<!-- UNCONFIRMED: Copy duplicates the card, so the same model can run with different functions or a different weight — migration gap audit ("Copy LLM — duplicate a model card"); the screen names the icon only "Copy" -->

**Copy** duplicates the card. Use it when you want the same model on a second card — for example to give it a different set of functions or a different weight.

### Connection Info and LLM Languages

**Connection Info** is a sub-section inside each card. On a card for a model NeuralSeek hosts, it holds one setting, **LLM Languages**.

![The Connection Info sub-section of a card, expanded: a chip reading 187 with a clear icon, the Enabled Languages dropdown, and the LLM Languages label under it](/img/neural-config/llm-details--llm-languages.png)

<!-- UNCONFIRMED: a card for a model on your own provider account also takes its connection settings under Connection Info (API or access key, secret, endpoint, region, project id — the provider decides which apply) — previous Neural Config overview; no such card was on the captured screen -->

For a model on your own provider account, **Connection Info** is also where the card's connection settings go — the key, endpoint, region or project the provider needs. Which fields a provider needs is on [Supported LLMs](/configuration/supported-llms/).

**LLM Languages** sets the languages this model is used for. Open the **Enabled Languages** dropdown to tick or untick languages; the chip in front of it shows how many are selected. The list runs from Abkhazian to Zulu. Untick a language when you do not want this model used for it; how NeuralSeek handles the language of a question is on [Language](/configuration/language/).

![The Enabled Languages list open on a card: a scrolling checklist starting with Abkhazian and Afar, both ticked](/img/neural-config/llm-details--options-llm-languages.png)

### LLM Functions

**LLM Functions** is the grid of checkboxes that assigns work to the card's model. Tick a function to send that work to this model; untick it to take the work away. **Enable All** and **Disable All** tick or untick every selectable function on that card only.

![The LLM Functions grids of two cards: on Managed GPT most text functions are selectable while Table Understanding and the media functions are greyed out; on Managed gpt-image only Image Generation and Image Edits are selectable](/img/neural-config/llm-details--llm-functions--crop.png)

A greyed-out checkbox is a function the model cannot perform — "Features that an LLM are not capable of will be unselectable." In the image above, the **Managed GPT** card cannot take **Table Understanding** or the media functions, and the **Managed gpt-image** card can take only **Image Generation** and **Image Edits**. To get a greyed-out function, tick it on a card whose model supports it, or add such a model.

Every card lists the same twenty functions, in this order:

| Function                    | What it covers                                                     |
| --------------------------- | ------------------------------------------------------------------ |
| **Seek**                    | Generating answers — see [Seek](/seek/overview/)                   |
| **PII Detection**           | [PII detection](/governance/pii-detection/)                        |
| **Conversation Generation** | —                                                                  |
| **Entity Extraction**       | [Entity extraction](/governance/entity-extraction/)                |
| **Slot Filling**            | —                                                                  |
| **Categorization**          | [Intent categorization](/governance/intent-categorization/)        |
| **Example Generation**      | —                                                                  |
| **Intent Creation**         | [Intent categorization](/governance/intent-categorization/)        |
| **Translate**               | Translation — see [Language](/configuration/language/)             |
| **Fallback Language Id**    | Language identification — see [Language](/configuration/language/) |
| **Fallback Sentiment**      | [Sentiment](/governance/sentiment/)                                |
| **Table Understanding**     | [Table Understanding](/knowledge/table-understanding/)             |
| **System AI**               | —                                                                  |
| **Image Generation**        | Media — see [Multimodal](/configuration/multimodal/)               |
| **Image Edits**             | Media — see [Multimodal](/configuration/multimodal/)               |
| **Video**                   | Media — see [Multimodal](/configuration/multimodal/)               |
| **Speech**                  | Media — see [Multimodal](/configuration/multimodal/)               |
| **Music**                   | Media — see [Multimodal](/configuration/multimodal/)               |
| **Speech to Text**          | Media — see [Multimodal](/configuration/multimodal/)               |
| **maistro**                 | Agents — see [mAIstro](/maistro/overview/)                         |

The **maistro** box on a model card is written in lower case; the **mAIstro** box on an embedding card is a different setting, covered on [Embedding models](/configuration/neural-config/embedding-models/).

### LLM ID, Weight and Delete

Each card ends with two values you can edit, each with an **Edit Name** pencil:

![The LLM ID and Weight row of two cards: ns-gpt-5 and ns-gpt-image, each with Weight 100 and an Edit Name pencil beside both values](/img/neural-config/llm-details--llm-id-weight--crop.png)

- **LLM ID** — the card's identifier in this configuration, for example `ns-gpt-5` on Managed GPT. It is also the value an NTL `LLM` step takes in `modelCard` (below).
- **Weight** — the card's share when it handles a function together with other cards. How weights divide the work is on [Multi-LLM](/configuration/multi-llm/).

<!-- UNCONFIRMED: the pencil beside LLM ID opens the Edit Card ID dialog and the pencil beside Weight opens the Load Balancing Weight dialog (a 1 to 100 scale), each with Cancel and Update — both dialogs are in the captured screen, but neither was opened -->

To change either value, select its **Edit Name** pencil: the one beside **LLM ID** opens **Edit Card ID**, and the one beside **Weight** opens **Load Balancing Weight**, which runs from 1 to 100. Select **Update** to apply the new value.

![The Load Balancing Weight dialog: the help text about weighting cards enabled for the same language and function, a slider from 1 to 100 with its number box, and Cancel / Update](/img/neural-config/llm-details--load-balancing-weight.png)

An NTL `LLM` step accepts a card's **LLM ID** in its `modelCard` parameter (see [Generate data](/maistro/ntl/generate-data/)). This one-step agent, given the Managed GPT card's ID:

```text
{{ LLM | prompt: "Reply with the word OK." | modelCard: "ns-gpt-5" }}
```

ran without error and returned:

```text
OK
```

When you rename a card's **LLM ID**, update every agent that names it.

<!-- UNCONFIRMED: Delete removes the card from the configuration; Test runs a test completion against the model to verify its credentials and does not save the configuration — previous Neural Config overview -->

**Delete** removes the card from the configuration. Every function that only this card had ticked is disabled until another card takes it. **Test** sends a test call to the model to check its connection; it does not save the configuration, so select **Save** afterwards to keep your changes.

## Limits and interactions

- **At least one card.** The section requires at least one LLM.
- **No fallback.** A function no card has ticked is disabled — NeuralSeek does not borrow another model for it. Check the other cards' **LLM Functions** before you untick a function, select **Disable All**, or delete a card.
- **Shared functions are load-balanced.** When two or more cards tick the same function, NeuralSeek spreads that function across them, and each card's **Weight** sets its share. Planning a split is covered on [Multi-LLM](/configuration/multi-llm/).
- **What a model can do is fixed by the model.** Greyed-out functions cannot be ticked on that card; add a model that supports them.
- **Embedding models are separate.** Embedding cards use the same card buttons but sit in their own section with their own functions; see [Embedding models](/configuration/neural-config/embedding-models/).

## FAQ

### Why can't I tick some functions on a card?

The model on that card cannot perform them. Functions an LLM is not capable of are unselectable, and they match the "This LLM does not support" line in the model's notes in **Add an LLM**. Tick the function on a card whose model supports it.

### What happens if no model has a function ticked?

That function of NeuralSeek is disabled. There is no fallback to another model, so a feature can stop working after you untick a box or delete a card.

### Can two models handle Seek?

Yes. Tick **Seek** on both cards and NeuralSeek load-balances answers between them; each card's **Weight** sets its share. See [Multi-LLM](/configuration/multi-llm/).

## Related

- [Supported LLMs](/configuration/supported-llms/) — the providers and models you can add
- [Managed LLM Details](/configuration/neural-config/managed-llm/) — the models NeuralSeek hosts
- [Multi-LLM](/configuration/multi-llm/) — sharing functions across several models
- [Multimodal](/configuration/multimodal/) — the image, video, speech and music functions
- [Embedding models](/configuration/neural-config/embedding-models/) — the embedding cards
- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — Save and Propose Changes
