---
title: "Managed LLM Details"
description: "A managed LLM is a model NeuralSeek provides: in the Add an LLM dialog you choose Platform NeuralSeek, pick the model under LLM Selection, read its LLM Notes, and its card in LLM Details asks only for LLM Languages under Connection Info."
---

A managed LLM is a language model that NeuralSeek provides for you. You add it like any other model, with **Add an LLM** in the [LLM Details](/configuration/neural-config/llm-details/) section of Neural Config, but under **Platform** you choose **NeuralSeek** instead of an outside provider. Its card then needs no credentials: **Connection Info** holds only the **LLM Languages** list. This page covers what is specific to managed models. The controls every card shares are explained on LLM Details, and the platforms you can choose from are listed on [Supported LLMs](/configuration/supported-llms/).

Choose a managed model when you want a working model without arranging a provider account, key or endpoint of your own. It is the wrong choice when the model must run on your own provider account, for data-residency, contract or cost reasons, or when you need to fix the exact model version yourself. In those cases choose that provider under **Platform** instead.

<!-- UNCONFIRMED / TODO for SME: availability of managed LLMs by deployment and plan — reportedly not offered on on-prem (Flex) installs, and possibly limited for partner / IBM plans. Nothing captured or in the repo states this: reference/deployment.md only says Flex is a bring-your-own-LLM plan, and the plan matrix on reference/plans-and-platforms.md is itself UNCONFIRMED. Confirm before documenting. -->

## Where to find it

Open **Neural Config** and select the **Default Config** node (**Answer Generation**) on the routing tree. In the **Configuration: Default Config** dialog, expand **LLM Details** and select **Add an LLM**, then choose **NeuralSeek** under **Platform**. The other sections of the dialog are listed on [Neural Config](/configuration/neural-config/).

![The Configuration: Default Config dialog with LLM Details expanded: the Add an LLM button and its help paragraph](/img/neural-config/llm-details--dialog-top--crop.png)

The help paragraph beside **Add an LLM** applies to managed models as to any other: "You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled."

A new card is kept only when you select **Save** or **Propose Changes** at the foot of the configuration dialog. [Using the Neural Config page](/configuration/neural-config/using-this-page/) explains the difference.

## Settings

### Platform and LLM Selection

![The Add an LLM dialog with NeuralSeek selected under Platform and Managed GPT under LLM Selection; on the right, the LLM Notes for Managed GPT: the heading OpenAI / Managed GPT, the purpose line, the unsupported functions, 187 languages, Model Code ns-gpt-5, text and image Inputs, text Outputs, Context Window 1000000, Seek Multiplier 4.5 and a small capability and creativity chart; Cancel and Add at the bottom](/img/neural-config/add-an-llm@llm-ns-managed-panel.png)

| Setting           | What it does                                                                                                                                                      | When to change it                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Platform**      | Who provides the model. **NeuralSeek** makes it a managed model. Every other entry is an outside provider; the full list is on [Supported LLMs](/configuration/supported-llms/). | Choose **NeuralSeek** first; the **LLM Selection** list follows the platform.                         |
| **LLM Selection** | The model within the platform. With **Platform** set to **NeuralSeek**, it lists the models NeuralSeek provides, for example **Managed GPT**.                    | Select each candidate in turn and read its notes on the right before you add one.                     |

**Platform** and **LLM Selection** are all the dialog asks for. Select **Add** to add the model as a new card in **LLM Details**.

### LLM Notes

The right half of **Add an LLM** describes the model selected under **LLM Selection**. Read it before you select **Add**: it tells you which jobs the model can take on and which will still need another card.

For **Managed GPT** the panel reads, top to bottom:

| Item                          | For Managed GPT                                                                                                                 | What it tells you                                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Heading                       | `OpenAI / Managed GPT`, with the OpenAI logo                                                                                    | The provider behind the model, then the model's name. A managed model names its underlying provider even though the platform is NeuralSeek. |
| **LLM Notes:**                | "This mananaged model is pinned to the latest GPT flagship model for coding, reasoning, and agentic tasks across domains."      | What the model is for. Here, the model behind the name follows the latest GPT flagship rather than a version you pick.                   |
| Unsupported functions         | "This LLM does not support: Table Understanding, Image Generation, Image Edits, Video, Speech, Music, Speech to Text"            | The **LLM Functions** that will be greyed out on its card. Plan another card for these jobs.                                              |
| Languages                     | "This LLM supports 187 languages."                                                                                              | The same number appears on the card's **LLM Languages** control.                                                                          |
| **Model Code**                | `ns-gpt-5`                                                                                                                      | The model's identifier. It matches the **LLM ID** on the card once the model is added (`LLM ID: ns-gpt-5`).                                |
| **Inputs** and **Outputs**    | Inputs: text and image icons. Outputs: a text icon                                                                              | What the model accepts and what it returns.                                                                                               |
| **Context Window**            | `1000000`                                                                                                                       | How much input the model can take into account in one request.                                                                            |
| **Seek Multiplier**           | `4.5`                                                                                                                           | A value NeuralSeek states for the model. The notes give it without a definition; ask NeuralSeek support if it matters for your choice.    |
| Capability/Creativity chart   | capability `20`, creativity `15`                                                                                                | A small chart of the model's capability and creativity. Use it to compare one model's notes with another's.                               |

These values describe **Managed GPT**. Each managed model has its own notes; select it under **LLM Selection** to read them.

### Managed model cards

Once added, a managed model is a card in **LLM Details**. The card's title is the model's name with its provider's logo, so you recognise a managed card by its name and its **Connection Info**. The **LLM ID** at the foot of the card equals the **Model Code** from the notes.

The rest of the card works the same way for every model and is described on [LLM Details](/configuration/neural-config/llm-details/): the **LLM ID** and its pencil, the **Weight** (how weight shares the load across cards is on [Multi-LLM](/configuration/multi-llm/)), and the **Copy**, **Delete** and **Test** buttons.

### Connection Info: LLM Languages

**Connection Info** is where a managed card differs from a card on an outside provider. It holds only **LLM Languages**: an **Enabled Languages** dropdown with a chip counting the languages enabled for the model, `187` on the **Managed GPT** card. You do not enter an API key, endpoint or region. How NeuralSeek handles languages overall is on [Language handling](/configuration/language/).

![The LLM Languages control of the Managed GPT card: a 187 chip in front of the closed Enabled Languages dropdown](/img/neural-config/add-an-llm@llm-ns-managed--llm-languages.png)

### LLM Functions on a managed card

Below **Connection Info**, **LLM Functions** (with **Enable All** and **Disable All**) lists the jobs the card can take. On a managed card the functions its notes list as unsupported are greyed out and cannot be ticked, which is what the help paragraph means by "Features that an LLM are not capable of will be unselectable". A function can be selectable without being ticked; only ticked functions are sent to that card.

![The LLM Functions grids of two managed cards: Managed GPT with Table Understanding and the media functions greyed out and only System AI ticked, and Managed gpt-image with only Image Generation and Image Edits selectable and ticked](/img/neural-config/llm-details--llm-functions--crop.png)

For example, a configuration might hold these four managed cards, each set up for a different job. They illustrate how cards can be set up, not defaults:

| Card                  | LLM ID           | LLM Languages | LLM Functions on the card                                                                                                                                                                                                       |
| --------------------- | ---------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Managed GPT**       | `ns-gpt-5`       | `187`         | **Table Understanding** and every media function (**Image Generation**, **Image Edits**, **Video**, **Speech**, **Music**, **Speech to Text**) are greyed out, matching its notes. The text functions are selectable; only **System AI** is ticked. |
| **Managed gpt-image** | `ns-gpt-image`   | `187`         | Only **Image Generation** and **Image Edits** can be ticked, and both are. A media-only card; see [Multimodal LLM configuration](/configuration/multimodal/).                                                                     |
| **Translate**         | `translate-ns`   | `96`          | Only the **Translate** function can be ticked, and it is. A translation-only card; see [Language handling](/configuration/language/).                                                                                          |
| **gpt-oss-20b**       | `gpt-oss-20b-ns` | `187`         | A text model with most text functions ticked, from Seek to maistro. Conversation Generation, Slot Filling, **Table Understanding**, **System AI** and the media functions are greyed out.                                          |

On the **Managed GPT** card above, **Translate** is selectable but not ticked, so translation goes to the cards that have it ticked: **Translate** and **gpt-oss-20b**.

## FAQ

### Do I need an API key or a provider account for a managed LLM?

No. On a managed card, **Connection Info** holds only **LLM Languages**. To use a model on your own provider account instead, choose that provider under **Platform**; see [Supported LLMs](/configuration/supported-llms/).

### Why can't I tick Image Generation on the Managed GPT card?

Because **Managed GPT** does not support it. Its notes say "This LLM does not support: Table Understanding, Image Generation, Image Edits, Video, Speech, Music, Speech to Text", and functions a model cannot perform are unselectable on its card. For image generation and image edits, add a card that supports them, such as **Managed gpt-image**; see [Multimodal LLM configuration](/configuration/multimodal/).

### Which model is behind Managed GPT?

Its notes name OpenAI as the provider and say the model "is pinned to the latest GPT flagship model". The model behind the name therefore follows OpenAI's current flagship rather than a version you choose. If you need a fixed model version, add it from its provider under **Platform**.

### What is the Seek Multiplier?

A value shown in a managed model's notes, `4.5` for **Managed GPT**. The notes do not define it; ask NeuralSeek support how it applies to you.

### How do I find a managed model's ID?

Read the **LLM ID** at the foot of its card. It equals the **Model Code** in the model's notes, `ns-gpt-5` for **Managed GPT**. How card IDs are used and renamed is on [LLM Details](/configuration/neural-config/llm-details/).

## Related

- [LLM Details](/configuration/neural-config/llm-details/): the card controls every model shares
- [Supported LLMs](/configuration/supported-llms/): every platform under **Platform**
- [Multi-LLM](/configuration/multi-llm/): load-balancing across cards with weights
- [Multimodal LLM configuration](/configuration/multimodal/): image, video and speech functions
- [Language handling](/configuration/language/): languages and translation
- [Using the Neural Config page](/configuration/neural-config/using-this-page/): saving and proposing changes
- [Plans and platforms](/reference/plans-and-platforms/): what each plan and deployment includes
