---
title: "Multi-LLM"
description: "A NeuralSeek instance can run several LLMs at once: each model is a card in LLM Details, each card claims the LLM Functions it performs, a function ticked on two cards is load-balanced across them, and a function no card claims is disabled with no fallback."
---

## What is it

Multi-LLM is running more than one large language model on a single NeuralSeek instance. There is no separate screen for it: it is what the **LLM Details** section of the **Edit Configuration** dialog does when it holds more than one card.

Each card is one model NeuralSeek may call, and each card carries its own set of **LLM Functions** — the twenty jobs a model can be given, from **Seek** and **Translate** to **Image Generation** and **maistro**. Which model does which job is decided by ticking those boxes, card by card, so several cards are several models dividing the work between them.

Two neighbouring topics are easy to confuse with this one. **Multimodal** is one model handling more than one kind of media — see [Multimodal LLM configuration](/configuration/multimodal/). **Supported LLMs** is the catalogue of models you can connect at all — see [Supported LLMs](/configuration/supported-llms/). Multi-LLM is neither: it is how several models, multimodal or not, share the work on one instance.

## Why it matters

Models are not interchangeable, and one model doing everything is often the wrong trade. Running several lets you split the work along the lines that matter:

- **Capability.** Not every model can do every function. A function a model cannot perform is greyed out on its card, so the only way to get that function is to add a model that has it.
- **Cost.** Bulk background work — categorization, example generation, intent creation — can go to a smaller model while customer-facing answers go to a stronger one.
- **Throughput.** A function ticked on two cards is load-balanced across both models instead of depending on one.

The same mechanism carries a trap that outweighs those gains if you miss it: a function no card claims is not routed anywhere. It is switched off.

## When to use it

Add a second model when:

- A function needs a capability your current model lacks — images, audio, table understanding, or a language your model does not cover.
- You want bulk background work kept apart from the model that writes answers.
- You want the same function served by two models, load-balanced.
- You want to trial a new model on one function before moving the rest over.

Do **not** reach for it when:

- You want failover. The screen describes load-balancing, not failover, and says nothing about what happens when one of the load-balanced models is unreachable. Treat a second card as extra capacity, not as a standby.
- You only need one model to read images as well as text. That is [Multimodal LLM configuration](/configuration/multimodal/) — one card, not two.

## How it works

Open **Neural Config**, click the **Default Config** node, then **Edit Configuration**, and expand the **LLM Details** accordion. Every control named below lives in that one section and is documented control by control on [LLM Details](/configuration/neural-config/llm-details/); NeuralSeek's own hosted models are on [Managed LLM Details](/configuration/neural-config/managed-llm/). This page explains what happens when there is more than one card.

### The rule the screen states

The **LLM Details** section states the multi-LLM rules itself, in the paragraph beside **Add an LLM**:

> You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled.

![The LLM Details section of the Edit Configuration dialog: the Add an LLM button, the paragraph stating the load-balancing and no-fallback rules, and the tops of two model cards](/img/neural-config/llm-details-panel.png)

Read as rules, that paragraph says four things:

1. **At least one card.** An instance always needs one model.
2. **Shared functions are load-balanced.** A function ticked on more than one card is spread across those cards.
3. **Capability limits are unselectable.** A function a model cannot perform is greyed out on that model's card; you cannot tick it there.
4. **No card means no function.** A function ticked on no card has no fallback: that function of NeuralSeek is disabled.

The fourth rule is the one that costs people. The section shows no warning for a function nobody has ticked — you only find out by reading every card's checkboxes.

What a disabled function looks like from the outside — an error or a feature that silently does nothing — is not stated on the screen.

### Adding a second model

**Add an LLM** is how a model gets onto the instance. It opens the **Add an LLM** dialog: a **Platform** dropdown (the provider, or **NeuralSeek** for a managed model), an **LLM Selection** dropdown (the model from that provider), an **LLM Notes** panel describing the chosen model, and **Cancel** / **Add** at the bottom.

![The Add an LLM dialog with Platform set to Amazon Bedrock and LLM Selection set to Nova Pro; the LLM Notes panel lists the functions the model does not support, its languages, Model Code, inputs and outputs and Context Window, above Cancel and Add](/img/neural-config/add-an-llm-panel.png)

<!-- UNCONFIRMED: Add appends the chosen model as a new card in LLM Details — Add was not pressed in the capture -->

**Add** adds the chosen model as a new card. The screen shows no maximum number of cards and marks no card as primary: cards are peers, and what distinguishes them is which functions each one has ticked.

Read **LLM Notes** before you add. Its "This LLM does not support: …" line lists the **LLM Functions** that will be greyed out on the new card. In the dialog above, Amazon Bedrock's Nova Pro lists "Table Understanding, System AI, Image Generation, Image Edits, Video, Speech, Music, Speech to Text" — so it can take over text work such as **Seek** or **Translate**, but it cannot be the card that covers **Image Generation**. That line is how you pick a second model that covers a function the first one cannot.

The providers and models on offer are listed on [Supported LLMs](/configuration/supported-llms/); managed models (Platform **NeuralSeek**) and the extra detail their notes carry are on [Managed LLM Details](/configuration/neural-config/managed-llm/).

### Dividing the work: LLM Functions per card

Every card has an **LLM Functions** group with the same twenty checkboxes, in this order on screen: **Seek**, **PII Detection**, **Conversation Generation**, **Entity Extraction**, **Slot Filling**, **Categorization**, **Example Generation**, **Intent Creation**, **Translate**, **Fallback Language Id**, **Fallback Sentiment**, **Table Understanding**, **System AI**, **Image Generation**, **Image Edits**, **Video**, **Speech**, **Music**, **Speech to Text** and **maistro**. What each function is used for is covered on [LLM Details](/configuration/neural-config/llm-details/).

![The Seek checkbox in a card's LLM Functions group, unticked](/img/neural-config/llm-details--seek.png)

Ticking a box claims that function for the card's model. Tick **Seek** on one card and that model answers Seek questions; tick **Seek** on two cards and Seek is load-balanced between them. A box that stays greyed out on a card is a function that model cannot perform — you cannot claim it there, only on a card whose model supports it.

**Enable All** and **Disable All**, two icons beside the **LLM Functions** label, tick or clear the boxes of that one card, not of the whole section. Use **Disable All** with care: if that card is the only one holding a function, clearing it leaves the function with no model.

A practical way to divide the work is to go function by function rather than card by card: for each of the twenty functions you rely on, make sure at least one card ticks it, and decide deliberately whether a second card should share it.

### Load balancing and Load Balancing Weight

A function ticked on two or more cards is load-balanced across them — "NeuralSeek will load-balance across them for the selected functions that have multiple LLM's". Load balancing is per function, not per card: two cards can share **Translate** while each keeps other functions to itself, so one card can be the sole owner of one function and a load-balanced partner on another.

![The Translate checkbox in a card's LLM Functions group — a function that can be ticked on two cards at once](/img/neural-config/llm-details--translate.png)

Each card shows a **Weight:** line near its foot, with a value and a pencil icon beside it. The section also contains a **Load Balancing Weight** dialog, with a range running from `1` to `100` and **Cancel** / **Update** buttons.

<!-- UNCONFIRMED: the pencil beside Weight: opens the Load Balancing Weight dialog — the dialog is part of the section but was not shown open in the capture -->

The pencil beside **Weight:** opens **Load Balancing Weight**, where you set the card's weight.

![Screenshot needed — the Load Balancing Weight dialog](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/llm-details--load-balancing-weight.png — Neural Config > Default Config > Edit Configuration > LLM Details > the pencil beside "Weight:" on any card: the open Load Balancing Weight dialog with its 1–100 range and the Cancel / Update footer. Why: the reader otherwise has only the closed "Weight: 100" row to go on. -->

The screen does not say how the weight divides traffic: whether it is a percentage or a relative share, and whether it applies per function or across all of a card's functions. Until that is documented, do not size a split on a precise reading of the number.

Nothing on the screen describes failover. If one of two load-balanced models is unreachable, the section does not say whether the other picks up its share — do not plan a second card as a standby.

### Removing or changing a card safely

Three controls on each card matter when you rearrange models. Their full description is on [LLM Details](/configuration/neural-config/llm-details/).

![The header of a model card: an info icon at the left, the card name with the provider logo, and the Copy icon at the right](/img/neural-config/llm-details--managed-gpt.png)

<!-- UNCONFIRMED: Copy duplicates the card so the same model can be reused with different function assignments — migration gap audit ("Copy LLM — duplicate a model card to reuse it with different settings"); Copy was not clicked in the capture -->

- **Copy**, the icon at the top right of the card header, duplicates the card. A copy is a safer place to trial a different function split than the card that is currently carrying a function.
- **Test**, the button at the foot of the card, beside **Delete**. The screen gives no text on what it checks.
- **Delete** removes the card. Before you click it, read the card's **LLM Functions**: every function that this card alone ticks is about to have "no fallback" and be disabled.

The safe order when you move a function from one model to another is: tick it on the new card first, then clear it on the old one (or delete the old card). The other way round leaves a gap in which the function has no model.

### Pinning an agent step to one card (LLM ID)

Function routing decides which card serves a function in general. A mAIstro agent can bypass that for a single step and call one specific card by its **LLM ID** — the identifier shown as `LLM ID:` at the foot of each card, with a pencil beside it.

![The foot of two model cards side by side, both with Translate ticked: each shows its LLM ID and Weight 100 with a pencil, and Delete and Test buttons](/img/neural-config/embedding-models.png)

In NTL, the `LLM` step takes a `modelCard` parameter. Set it to a card's **LLM ID** — for example `modelCard: "my-card-id"` — to point that step at that card; the step accepts the ID exactly as the card shows it and runs without error. An ID that matches no card does **not** fail the step either: it still runs and returns an answer, with no error.

Which model serves a step with an unknown ID is not shown, so check the ID against the card before you rely on it: a typo does not surface as an error.

## FAQ

### Can I run more than one LLM on one instance?

Yes. **LLM Details** is a list of cards, and **Add an LLM** adds another one. The screen requires at least one card and shows no maximum.

### What happens when the same function is ticked on two cards?

NeuralSeek load-balances that function across both cards — "NeuralSeek will load-balance across them for the selected functions that have multiple LLM's". Each card shows a **Weight:**, and the **Load Balancing Weight** dialog takes a value from `1` to `100`; how the weight divides traffic is not explained on the screen.

### What happens if no card has a function ticked?

That function is disabled. In the screen's own words, "there is no fallback and that function of NeuralSeek will be disabled". Nothing else picks up the work, and the section shows no warning.

### Is a second LLM a failover for the first one?

The screen describes load-balancing only, not failover, and says nothing about what happens when a load-balanced model is unreachable. Plan a second card as extra capacity and as a way to divide work, not as a standby.

### Why is a function greyed out on one card but available on another?

Because the models differ: "Features that an LLM are not capable of will be unselectable". The **LLM Notes** panel in the **Add an LLM** dialog lists them before you add a model, on its "This LLM does not support: …" line. See [Supported LLMs](/configuration/supported-llms/) for what each model can do.

### Can an agent use one specific model?

Yes. The NTL `LLM` step's `modelCard` parameter takes a card's **LLM ID**, which points that one step at that card instead of leaving it to function routing. An ID that matches no card does not fail the step, so double-check it.
