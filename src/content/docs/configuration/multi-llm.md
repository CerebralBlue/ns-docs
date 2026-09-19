---
title: "Multi-LLM"
description: "A NeuralSeek instance can run several LLMs at once: each model is a card in LLM Details, each card claims the functions it is allowed to perform, two cards sharing a function are load-balanced, and a function no card claims is disabled with no fallback."
---

## What is it

Multi-LLM is running more than one large language model on a single NeuralSeek instance. There is no separate screen for it: it is what the **LLM Details** section of the **Edit Configuration** dialog does when it holds more than one card.

Each card is one model NeuralSeek may call, and each card carries its own set of **LLM Functions** — the twenty jobs a model can be given, from **Seek** and **Translate** to **Image Generation** and **maistro**. Which model does which job is decided by ticking those boxes, so an instance with four cards is really four models dividing the work between them.

The section states the rules itself, in the paragraph beside **Add an LLM**:

> You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled.

Two neighbouring topics are easy to confuse with this one. **Multimodal** is one model handling more than one kind of media — see [Multimodal LLM configuration](/configuration/multimodal/). **Supported LLMs** is the catalogue of models you can connect at all — see [Supported LLMs](/configuration/supported-llms/). Multi-LLM is neither: it is how several models, multimodal or not, coexist on one instance.

## Why it matters

Models are not interchangeable, and paying one model to do everything is usually the wrong trade. Running several lets you split the work along the lines that matter:

- **Cost.** Bulk internal work — categorization, example generation, intent creation — can go to a small cheap model while answers go to a stronger one.
- **Capability.** Image generation, translation and table understanding are not offered by every model. A capability a model does not have is greyed out on its card, so the only way to get it is to add a model that has it.
- **Throughput.** Two models ticked for the same function share that traffic instead of queueing behind one endpoint.

The same mechanism carries a trap that costs more than any of those gains: a function no card claims is not routed anywhere. It is switched off.

## When to use it

Add a second (or fourth) model when:

- One function needs a capability your current model lacks — images, audio, or a language your model does not cover.
- You want cheap bulk work separated from the model that writes customer-facing answers.
- A single model endpoint is the bottleneck and you want the same function served by two models.
- You are trialling a replacement model on one function before moving the rest of them over.

Do **not** reach for it when:

- You want failover. The screen describes load-balancing, not failover, and says nothing about what happens when one of the load-balanced models is unreachable. Treat a second card as extra capacity, not as a standby.
- You only need one model to read images as well as text. That is [Multimodal LLM configuration](/configuration/multimodal/) — one card, not two.

## How it works

Open **Neural Config**, click the **Default Config** node, then **Edit Configuration**, and expand the **LLM Details** accordion. Every control described below lives on that one section and is documented in full on [LLM Details](/configuration/neural-config/llm-details/); this page explains what happens when there is more than one card.

![The LLM Details section of the Edit Configuration dialog: the Add an LLM button, the paragraph describing load balancing and the no-fallback rule, and the first two model cards](/img/neural-config/llm-details.png)

### What multi-LLM means here

Adding a model is one control — **Add an LLM** — and it appends another card to the row. There is no limit stated on the screen and no "primary" card: the cards are peers, and what distinguishes them is which **LLM Functions** each one has ticked.

The captured instance is a good illustration, because it uses four models as four specialists rather than as four copies of each other:

| Card                | Functions ticked                                                                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Managed GPT`       | **System AI**                                                                                                                                                                                    |
| `Managed gpt-image` | **Image Generation**, **Image Edits**                                                                                                                                                            |
| `Translate`         | **Translate**                                                                                                                                                                                    |
| `gpt-oss-20b`       | **Seek**, **PII Detection**, **Entity Extraction**, **Categorization**, **Example Generation**, **Intent Creation**, **Translate**, **Fallback Language Id**, **Fallback Sentiment**, **maistro** |

Read that table as a division of labour: the general-purpose model answers Seek questions and runs the classification work, a dedicated image model owns both image functions, a translation model owns translation, and one card is reserved for **System AI**.

Capability limits show up as unselectable boxes rather than as errors. On all four captured cards **Table Understanding**, **Video**, **Speech**, **Music** and **Speech to Text** are disabled — no model connected here can do those jobs, so those functions cannot be assigned at all until a model that supports them is added.

### Load balancing and weights

A function ticked on two cards is load-balanced across both. On the captured instance **Translate** is the one function in that position: both the `Translate` card and `gpt-oss-20b` claim it, so translation traffic is spread over the two, while every other function belongs to exactly one card.

Each card carries a **Weight:** value that decides its share. All four captured cards sit at `100`, so no card is favoured; the `Load Balancing Weight` dialog that the control opens accepts a value from `1` to `100`. The screen does not say whether that number is a percentage or a relative share, so the safe reading is comparative: a card at a higher number than its partner takes more of the traffic. The control, its dialog and the rest of the card — **Test**, **Delete**, **Copy**, **LLM ID:** — are documented on [LLM Details](/configuration/neural-config/llm-details/).

One consequence worth planning for: load-balancing is per function, not per card. Two cards can share **Seek** while each keeps a different set of other functions to itself, and a single card can be both a solo owner of one function and a load-balanced partner on another — which is exactly what `gpt-oss-20b` is on the captured instance.

### No fallback

This is the sentence to take away from the whole page: **a function with no card ticked is disabled**, and nothing takes over for it.

The paragraph on the screen is explicit — "If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled." So the failure is silent. Delete the only card that had **PII Detection** ticked and PII detection stops happening; there is no second model waiting to pick it up, and the console does not stand in the way.

Two habits keep you out of it:

- **Before deleting or re-ticking a card, read its function list.** The functions it alone owns are the ones about to switch off. **Copy** duplicates a card, which is a safer way to experiment than editing the card that is currently carrying a function.
- **When a feature is "missing", audit the cards first.** A capability that never appears — translation, image generation, entity extraction — is far more often an unticked box than a broken integration.

Which model is actually serving a given request is not shown on this screen. To see behaviour across models after the fact, use [Model Comparison](/governance/seek-model-comparison/) and [Cost Insights](/governance/seek-cost-insights/).

## FAQ

### Can I run more than one LLM on one instance?

Yes. **LLM Details** is a list of cards and **Add an LLM** appends another one; the captured instance runs four. The screen requires at least one and states no maximum.

### What happens when the same function is ticked on two cards?

NeuralSeek load-balances that function across both cards — "NeuralSeek will load-balance across them for the selected functions that have multiple LLM's". Each card's **Weight:** decides its share, on a scale from `1` to `100`.

### What happens if no card is ticked for a function?

That function is disabled. In the screen's own words, "there is no fallback and that function of NeuralSeek will be disabled" — nothing else picks up the work and no error is raised at configuration time.

### Can I use a cheap model for Seek and a stronger one for agents?

Yes — that is what the per-card function checkboxes are for. Tick **Seek** on one card and **maistro** on another and the two jobs go to different models. The captured instance splits Seek, translation, image work and **System AI** across four cards.

### Is a second LLM a failover for the first one?

The screen only describes load-balancing, not failover, and nothing on it says what happens when a load-balanced model is unreachable. Plan a second card as extra capacity and as a way to divide work; do not rely on it as a standby.

### Why is a checkbox greyed out on one card but available on another?

Because the models differ: "Features that an LLM are not capable of will be unselectable". A function greyed out on every card — as **Video**, **Speech**, **Music**, **Speech to Text** and **Table Understanding** are on the captured instance — means no connected model supports it. See [Supported LLMs](/configuration/supported-llms/) for what each model can do.
