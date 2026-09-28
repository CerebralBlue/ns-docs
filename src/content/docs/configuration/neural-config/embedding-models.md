---
title: "Embedding models"
description: "The Embedding Models section of Edit Configuration adds embedding models from AWS, Azure, NeuralSeek, OpenAI or watsonx.ai and assigns each one to KB Search, mAIstro or Vector Intent."
---

## What is it

**Embedding Models** is a section of the **Edit Configuration** dialog in Neural Config. An
embedding model turns text into vectors: lists of numbers that let NeuralSeek compare pieces of
text by meaning rather than by exact words.

The section shows one card per embedding model, under an **Add an Embedding** button. The button
opens a dialog where you pick a **Platform** and a model from **Embedding Selection**, with a
**Model Notes** panel beside them describing the model you picked. Each card then says which
NeuralSeek functions use that model, under **Embedding Functions**: **KB Search**, **mAIstro**
and **Vector Intent**.

## Why it matters

Embedding models are instance-wide plumbing, not a per-question setting. Every vector NeuralSeek
has already stored was produced by the model that was active when it was written. The section
prints its own warning beside **Add an Embedding**:

> Add embedding models for use in NeuralSeek. Use caution when switching between models in an
> active instance, as all existing vectors will need to be recomputed for the new model - which
> will incur time and expense.

So picking a model is cheap on a new instance and expensive on a busy one. Treat a switch as a
re-index you plan for, not a setting you try out.

## When to use it

Come to this section when you want to:

- Add an embedding model from a provider you already use (for example an OpenAI or watsonx.ai
  account) before you build up vectors.
- Split the work between models once there is more than one card: which model serves
  **KB Search**, which serves **mAIstro** and which serves **Vector Intent**.
- Check a model's identifier (**Embed ID:**) or its vector size (**Default Model Dimensions**)
  before connecting something that depends on it.

This is not where generation models live. A model that writes answers, translates, extracts
entities or runs an agent's prompt is configured in
[LLM Details](/configuration/neural-config/llm-details/), the section directly above this one.

## How it works

### The Embedding Models section

Open **Neural Config**, click a configuration node in the routing tree (for example **Default
Config**), and the **Edit Configuration** dialog opens with its sections as accordion headers.
**Embedding Models** sits below **LLM Details** and above **Company / Organization
Preferences**. Click the header to expand it inline; other open sections stay open, which is why
the bottom of the LLM cards can still show above it.

![The expanded Embedding Models section below the last LLM cards: the Add an Embedding button with the caution paragraph beside it, and one embedding card with Connection Info, Embedding Functions and Embed ID](/img/neural-config/embedding-models-panel.png)

At the top of the section is the blue **Add an Embedding** button with the caution paragraph
quoted above beside it. Below it, each embedding model already added to this configuration has
its own card. Nothing you change here takes effect until the whole dialog is saved (see
[Saving the change](#saving-the-change)).

### Adding an embedding model

**Add an Embedding** opens a dialog of the same name on top of **Edit Configuration**. It has two
dropdowns on the left, a **Model Notes** panel on the right and **Cancel** / **Add** at the
bottom.

![The Add an Embedding dialog open over the Edit Configuration dialog, with Propose Changes and Save still visible at the foot of Edit Configuration](/img/neural-config/add-an-embedding.png)

The dialog has these fields:

![The Add an Embedding dialog: Platform set to AWS, Embedding Selection set to cohere.embed-english-v3, and the Model Notes panel headed AWS / cohere.embed-english-v3 with Model Code, Default Model Dimensions and Max Input Tokens](/img/neural-config/add-an-embedding-panel.png)

- **Platform** — the provider that hosts the embedding model. The list has five options, in this
  order: `AWS`, `Azure`, `NeuralSeek`, `OpenAI`, `watsonx.ai`. The dialog opens on `AWS`, the
  first entry; that is the list's order, not a recommendation. Choose the provider whose account
  or hosting you intend to use; the platform decides which models the next dropdown offers.
- **Embedding Selection** — the model itself. Its list depends on the platform you chose: with
  `AWS`, for example, it shows `cohere.embed-english-v3`. The catalogue changes with the
  platform, so open the dropdown after choosing a platform to see what that provider offers.
- **Model Notes:** — a read-only panel headed `<Platform> / <model>` (for example
  `AWS / cohere.embed-english-v3`). It describes the selected model in a sentence or two, then
  gives its **Model Code** (the provider's identifier for the model), its **Default Model
  Dimensions** (how many numbers each vector has) and its **Max Input Tokens** (the most text
  the model embeds in one piece). Compare **Default Model Dimensions** with any vector index the
  model has to work with before you add it.
- **Cancel** — closes the dialog without adding anything.
- **Add** — confirms the platform and model you selected.

<!-- UNCONFIRMED: Add creates a new card for the selected model in the Embedding Models section — inferred from the button label and the section's purpose; the result of pressing Add is not shown on screen -->

After **Add**, the new model is expected to appear as its own card in the section. Which
**Embedding Functions** a new card starts with is not shown before you add it, so check its
checkboxes afterwards.

### An embedding card

Each model is one card. Its title row carries an information icon at the left, the model's name
in the middle (for example, a card named `e5-small-v2`) and a **Copy** icon at the top right.

![The title row of an embedding card: an information icon at the left, the model name e5-small-v2, and the Copy icon at the top right](/img/neural-config/embedding-models--e5-small-v2.png)

The card holds these controls, top to bottom:

- **Copy** — the icon at the top right of the title row. What it copies is not labelled on the
  card.
- **Connection Info** — a collapsible row under the title. An embedding card's **Connection
  Info** is its own control; this page does not describe its fields, and they are not documented
  as matching the **Connection Info** on an LLM card.
- **Embedding Functions** and **Embed ID:** — described in the next section.
- **Delete** (with a trash-can icon) and **Test** — two buttons at the foot of the card, the same
  pair an LLM card in [LLM Details](/configuration/neural-config/llm-details/) has. **Delete** is
  the red button; before you use it on a model that already holds vectors, keep the recompute
  warning above in mind. What **Test** checks is not labelled on the card.

### Assigning a model to KB Search, mAIstro or Vector Intent

The middle of the card decides what the model is used for.

![The body of an embedding card: Connection Info collapsed, the Embedding Functions heading with its Enable All and Disable All icons, the KB Search, mAIstro and Vector Intent checkboxes, and the Embed ID row with a pencil icon](/img/neural-config/embedding-models--maistro.png)

**Embedding Functions** is the group heading. The two icons beside it are named **Enable All**
and **Disable All**; by their names, they tick or clear all three checkboxes on that card at
once. The three checkboxes are the only functions an embedding model can serve.

<!-- UNCONFIRMED: the meaning of KB Search, mAIstro and Vector Intent — from their labels only; the screen gives no help text, and the Vector Intent ↔ Vector Similarity connection is inferred from the names -->

- **KB Search** — the model that embeds text for knowledge-base search. For an Elasticsearch
  knowledge base, **Use NeuralSeek configured embedding models?** is the setting that points
  vector search at these models; it is explained in
  [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/). Vector stores
  you run yourself are covered in
  [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/).
- **mAIstro** — the model that embeds text for mAIstro agents. It is spelled `mAIstro` here; an
  LLM card in [LLM Details](/configuration/neural-config/llm-details/) has a different checkbox
  spelled `maistro`, in its **LLM Functions** group. They are separate controls on separate
  cards: one picks an embedding model, the other picks a generation model, and ticking one does
  not tick the other.
- **Vector Intent** — the model that embeds questions for intent matching.
  [Intent Matching & Cache](/configuration/neural-config/intent-matching-caching/) has an
  **Intent Match Tolerance** option called `Vector Similarity`; judging by the names, that is
  where these vectors are used.

With a single card, that model serves every function you tick on it. With several cards, the
checkboxes are how you split the jobs, for example one model for **KB Search** and another for
**Vector Intent**. Whether a function with no card ticked is switched off is not stated on this
screen, so keep each function ticked on at least one card unless you mean to change it.

**Embed ID:** at the bottom of the card shows the model's identifier (for example
`infloat-e5-small-v2`, as the screen spells it). It is a separate value from the card's title.
The pencil beside it is **Edit Name**.

<!-- UNCONFIRMED: Edit Name opens a dialog titled Edit Card ID with Cancel and Update — the dialog exists in the page's markup, but which control opens it is not shown -->

The page also holds an **Edit Card ID** dialog, with **Cancel** and **Update**, which is likely
where **Edit Name** lets you change the identifier.

### Saving the change

The section has no save button of its own. Changes to cards, checkboxes and identifiers are kept
in the **Edit Configuration** dialog until you use **Propose Changes** or **Save** at its foot;
[Using the Neural Config page](/configuration/neural-config/using-this-page/) explains both.

Before you save a model switch on a configuration that is already in use, remember the warning at
the top of the section: every existing vector has to be recomputed for the new model, which takes
time and costs money.

<!-- UNCONFIRMED: vectors of different dimension counts cannot be compared, so an index must be queried with a model of the same dimension count — derived from the Default Model Dimensions line and the recompute warning; no such rule is stated on screen -->

The same applies outside NeuralSeek: two models with different dimension counts produce vectors
that cannot be compared, and a vector index you create yourself has a fixed vector size, so match
it to the **Default Model Dimensions** of the model that will query it.

## FAQ

**How do I add an embedding model?**

In **Edit Configuration**, expand **Embedding Models** and click **Add an Embedding**. Pick a
**Platform**, pick the model in **Embedding Selection**, read **Model Notes**, then click **Add**.
Tick the **Embedding Functions** the new card should serve and save the configuration.

**Which platforms can an embedding model come from?**

The **Platform** list offers `AWS`, `Azure`, `NeuralSeek`, `OpenAI` and `watsonx.ai`. The models
available under **Embedding Selection** depend on the platform you choose.

**What happens if I switch embedding models on a live instance?**

The section warns that "all existing vectors will need to be recomputed for the new model - which
will incur time and expense." Plan a switch as a re-index of what you already have, not as a quick
setting change.

**How do I use one model only for intent matching?**

On that model's card, tick **Vector Intent** and clear **KB Search** and **mAIstro** under
**Embedding Functions**. Keep **KB Search** and **mAIstro** ticked on another card if those
functions still need a model.

**Is the mAIstro checkbox the same as maistro on an LLM card?**

No. **mAIstro** is one of the three **Embedding Functions** on an embedding card and chooses an
embedding model; `maistro` is one of the **LLM Functions** on an LLM card in
[LLM Details](/configuration/neural-config/llm-details/) and chooses a generation model. They are
separate settings, and ticking one does not tick the other.

**Where do I see a model's vector size?**

Select the model in the **Add an Embedding** dialog and read **Default Model Dimensions** in
**Model Notes**, next to **Model Code** and **Max Input Tokens**.
