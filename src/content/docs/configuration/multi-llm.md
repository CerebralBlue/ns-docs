---
title: "Multi-LLM"
description: "A NeuralSeek instance can run several LLMs at once: each model is a card in LLM Details, each card claims the LLM Functions it performs, a function ticked on two cards is load-balanced across them, and a function no card claims is disabled with no fallback."
---

A NeuralSeek instance can run several language models side by side. Each model is a card in the [LLM Details](/configuration/neural-config/llm-details/) section of Neural Config, and each card carries a list of **LLM Functions** — the jobs NeuralSeek hands to a model, such as **Seek**, **Translate** or **Image Generation**. A job goes to every card that has it ticked, load-balanced when more than one card has it; a job no card has ticked is switched off, with no fallback to another model. Use this page when one model cannot do everything you need, when you want cheaper background work kept away from the model that writes answers, or when you want two models to share the load of one job. If you only need one model to handle images as well as text, that is a single card — see [Multimodal LLM configuration](/configuration/multimodal/).

## Before you begin

- You need access to **Neural Config**, and the instance already has at least one model card in **LLM Details**.
- Decide what the new model is for. The providers and models you can add, and what each one cannot do, are on [Supported LLMs](/configuration/supported-llms/); the models NeuralSeek hosts for you are on [Managed LLM Details](/configuration/neural-config/managed-llm/).

## Add a second model

1. Open **Neural Config**, select the **Default Config / Answer Generation** node, select **Edit Configuration**, and expand **LLM Details**.
2. Read the rule set beside **Add an LLM**. It governs everything on this page:

   > You must add at least one LLM. If you add multiple, NeuralSeek will load-balance across them for the selected functions that have multiple LLM's. Features that an LLM are not capable of will be unselectable. If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled.

   ![The LLM Details section: the Add an LLM button and the load-balancing and no-fallback rules beside it, above two model cards — Managed GPT, with System AI ticked and the media functions greyed out, and Managed gpt-image, with Image Generation and Image Edits ticked and the text functions greyed out — each ending in its LLM ID and Weight row](/img/neural-config/llm-details-panel.png)

   <!-- UNCONFIRMED: Add places the chosen model as a new card in LLM Details — Add was not pressed in the capture -->

3. Select **Add an LLM**, choose the platform and the model in the dialog, and select **Add**. The dialog and the models it offers are described on [Supported LLMs](/configuration/supported-llms/).
4. Find the new card in **LLM Details**. Cards are peers: what sets them apart is which functions each one has ticked.
5. Select **Save** in the dialog footer and give the version a name you will recognise. Nothing applies until you save; how saving and version names work is on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

To run the same model a second time with a different set of functions, start from its existing card instead: the **Copy** icon at the top right of each card makes a second card from it.

<!-- UNCONFIRMED: Copy duplicates the card, model and settings included — inferred from the icon's name; Copy was not used in the capture -->

## Give each model its jobs

Every card lists the same twenty **LLM Functions**. What each function covers is on [LLM Details](/configuration/neural-config/llm-details/); the media functions are on [Multimodal LLM configuration](/configuration/multimodal/), and **Translate** and **Fallback Language Id** on [Language handling](/configuration/language/).

1. On each card, tick the functions that model should perform and clear the ones it should not.
2. To start a card from all or nothing, use the two icons beside its **LLM Functions** heading: **Enable All** ticks every function that card's model can perform, and **Disable All** clears them. Both act on that one card only.
3. Go through the functions one by one, not card by card: make sure every function you rely on is ticked on at least one card. A function left unticked on every card is disabled.
4. Select **Save** and name the version.

A greyed-out checkbox is a function that model cannot perform, so you cannot tick it there. In the image above, for example, the **Managed GPT** card has **System AI** ticked and cannot take **Table Understanding** or any media function, while the **Managed gpt-image** card can take only **Image Generation** and **Image Edits**. Together they cover both text and image work; neither could on its own. That is an example arrangement, not a recommendation: split the work by what each model does well and what it costs to run.

## Share a job between two models

When the same function is ticked on two or more cards, NeuralSeek load-balances that function across them. Load balancing is per function: two cards can share **Seek** while each keeps other functions to itself.

1. Tick the function on every card that should share it.
   <!-- UNCONFIRMED: the pencil beside Weight opens the Load Balancing Weight dialog (a 1 to 100 scale), and a card with a higher weight takes a larger share of a shared function — the dialog is part of the section but was not opened in the capture; how weights divide traffic is not stated on the screen -->
2. Set each card's share. The foot of every card shows its **LLM ID** and its **Weight**, each with a pencil icon; select the pencil beside **Weight**, set the value in **Load Balancing Weight**, and select **Update**.

   ![Screenshot pending: the Load Balancing Weight dialog opened from the pencil beside a card's Weight](/img/_placeholder.svg)

   <!-- SCREENSHOT: /img/neural-config/llm-details--load-balancing-weight.png — Neural Config > Default Config / Answer Generation > Edit Configuration > LLM Details > the pencil beside Weight on any card: the open Load Balancing Weight dialog with its 1–100 scale and Cancel / Update. Why: this is the one step on the page the reader cannot see before doing it. -->

3. Select **Save** and name the version.

If you need to compare how two models answer the same question before you split the work between them, use [Model comparison](/governance/analytics/model-comparison/).

The **LLM ID** tells cards apart, and an NTL `LLM` step in a [mAIstro](/maistro/overview/) agent accepts a card's **LLM ID** in its `modelCard` parameter — see [LLM Details](/configuration/neural-config/llm-details/). If you rename a card's **LLM ID**, update every agent that names it.

## Remove a model safely

Deleting a card, or clearing a function on it, takes that work away from the model when you save the version. Any function that only that card had ticked is then disabled — there is no fallback.

1. On the card you want to remove, note every function ticked under **LLM Functions**.
2. For each of them, check that another card has it ticked. If none does, tick it on a card whose model supports it.
3. Select **Delete** on the card.
4. Select **Save** and name the version.

The same check applies when you move a single function from one model to another: before you save, make sure the function is ticked on the new card, then clear it on the old one. If you save with the function cleared on both, it is disabled.

## Verify

<!-- UNCONFIRMED: Test sends a test call to the card's model to check its connection — by the button's name; its result was not captured -->

1. Select **Test** on each card you added or changed to check that its model responds.
2. Ask a question on the [Seek](/seek/overview/) tab. If **Seek** is ticked on no card, Seek is disabled.
3. Use the features that depend on any function you moved — translation, image generation, agents — and confirm they still run.
4. Open **Change Logs** and check that your version name is on the newest row; reading and rolling back versions is covered on [Backup, restore & change logs](/configuration/backup-restore/).

## FAQ

### Can I run more than one LLM on one instance?

Yes. Add a card per model with **Add an LLM** in **LLM Details**. The section requires at least one card; NeuralSeek load-balances any function that is ticked on several cards.

### Is a second model a failover if the first one fails?

Do not count on it. **LLM Details** describes load-balancing across cards, not failover, and states: "If you do not provide an LLM for a function, there is no fallback and that function of NeuralSeek will be disabled." Plan a second card as extra capacity or as a way to divide work, not as a standby.

### Why can't I tick a function on one card when another card allows it?

The models differ. "Features that an LLM are not capable of will be unselectable", so a function stays greyed out on a card whose model cannot perform it. Tick it on a card whose model supports it, or add such a model — [Supported LLMs](/configuration/supported-llms/) shows what each model cannot do before you add it.

### What happens if I untick Seek on every card?

Seek is disabled. No card provides the function, and no other model picks it up.

### Can an agent use one specific model?

An NTL `LLM` step accepts a card's **LLM ID** in its `modelCard` parameter, so an agent can name the card it wants. The parameter is described on [LLM Details](/configuration/neural-config/llm-details/). If you later rename that card's **LLM ID**, update the agent too.

## Related

- [LLM Details](/configuration/neural-config/llm-details/) — every field and function on a model card
- [Supported LLMs](/configuration/supported-llms/) — the platforms and models you can add
- [Managed LLM Details](/configuration/neural-config/managed-llm/) — the models NeuralSeek hosts
- [Multimodal LLM configuration](/configuration/multimodal/) — the image, video, speech and music functions
- [Language handling](/configuration/language/) — Translate, Fallback Language Id and LLM Languages
- [Embedding models](/configuration/neural-config/embedding-models/) — the separate section for embedding cards
- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — Save and version names
- [Model comparison](/governance/analytics/model-comparison/) — compare how two models answer the same question
