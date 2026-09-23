---
title: "Embedding models"
description: "The Embedding Models section of Edit Configuration lists one card per embedding model and assigns each model to KB Search, mAIstro or Vector Intent."
---

## What is it

**Embedding Models** is a section of the **Edit Configuration** dialog in Neural Config. An
embedding model turns text into vectors — the numbers NeuralSeek compares when it looks for
documents by meaning rather than by keyword, when an agent needs vector recall, and when a
question is matched against stored intents.

The section is a list of cards, one per model, under an **Add an Embedding** button. On the
instance captured for this page there is exactly one card, `e5-small-v2`, whose **Embed ID:** is
`infloat-e5-small-v2`, and it is assigned all three embedding functions.

## Why it matters

Embedding models are instance-wide plumbing, not a per-question setting. The product prints its
own warning beside **Add an Embedding**:

> Add embedding models for use in NeuralSeek. Use caution when switching between models in an
> active instance, as all existing vectors will need to be recomputed for the new model - which
> will incur time and expense.

Every vector already stored for your knowledge base, your agents or your intents was produced by
the model that was active when it was written. A new model does not re-interpret those vectors;
they have to be rebuilt, and rebuilding costs both time and embedding calls.

## When to use it

Come to this section when you are:

- Adding an embedding model before connecting a vector store that needs one — see
  [Pinecone setup](/knowledge/pinecone/) and
  [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/).
- Deciding which model does retrieval (**KB Search**), which serves agents (**mAIstro**) and
  which matches intents (**Vector Intent**) once more than one model is configured.
- Reading or renaming a model's **Embed ID:** so that references to it stay stable.

This is not where generation models live. A model that writes an answer, translates, extracts
entities or runs an agent's prompt is configured on
[LLM Details](/configuration/neural-config/llm-details/), the section directly above this one.

## How it works

![The Edit Configuration dialog scrolled to Embedding Models: two LLM cards from LLM Details at the top, then the Embedding Models header, the Add an Embedding button with its caution text, and the single e5-small-v2 card](/img/neural-config/embedding-models.png)

### Where the section lives

Open Neural Config (`/configure`), click a configuration node in the routing tree — on the
captured instance, **Default Config** / **Answer Generation** — and choose **Edit Configuration**.
The dialog opens titled `Configuration: Default Config` and lists its sections as accordion
headers. **Embedding Models** is the fourth header, directly below **LLM Details**; click it to
expand the section inline. Several sections can be open at once, so the one above does not close.

![The Embedding Models accordion header, collapsed, with its chevron at the right](/img/neural-config/edit-configuration-edit--add-an-embedding.png)

Nothing you change here is applied until the dialog itself is saved. **Save** and **Propose
Changes** at the foot of the dialog are described on
[Using this page](/configuration/neural-config/using-this-page/).

### Add an Embedding

![The expanded Embedding Models section: the Add an Embedding button, the caution paragraph beside it, and the e5-small-v2 card with Connection Info, Embedding Functions, Embed ID, Delete and Test](/img/neural-config/embedding-models-panel.png)

**Add an Embedding** is the blue button at the top of the section, with the caution paragraph
quoted above beside it. It opens an **Add an Embedding** dialog whose footer has **Cancel** and
**Add**.

:::note
The dialog was not opened during the capture this page is written from, so what it asks for and
the list of models or platforms it offers are not documented here. The one model present on the
captured instance is `e5-small-v2`; whether it is the default a new instance starts with was not
checked.
:::

A model added here does not appear in **LLM Details**, and a model added there does not appear
here: the two sections keep separate lists.

### The model card and its Embedding Functions

Each model is one card. Reading `e5-small-v2` from top to bottom:

![The header of the e5-small-v2 card: an info icon at the left, the model name with a provider logo, and the Copy icon at the top right](/img/neural-config/embedding-models--e5-small-v2.png)

- The header carries the model's display name — `e5-small-v2` — with an info button at the left
  and **Copy** at the top right.

![The body of the e5-small-v2 card: Connection Info collapsed, the Embedding Functions heading with the Enable All and Disable All icons, the three ticked checkboxes KB Search, mAIstro and Vector Intent, and the Embed ID row reading infloat-e5-small-v2 with a pencil at its right](/img/neural-config/embedding-models--maistro.png)

- **Connection Info** — a collapsed sub-accordion holding the model's connection settings. It was
  not expanded on this card during the capture, so its fields are not listed here.
- **Embedding Functions** — the group of jobs this model is allowed to do, with **Enable All**
  and **Disable All** as the two icons beside the heading; they tick or clear the three boxes on
  the card you click them on. The group holds exactly three checkboxes and nothing else:
  - **KB Search** — vector retrieval against the knowledge base.
  - **mAIstro** — embeddings requested by agents.
  - **Vector Intent** — the model that computes the vectors behind intent matching.
    [Intent matching and caching](/configuration/neural-config/intent-matching-caching/) owns the
    tolerance and the rebuild of stored intent vectors.

  The screen gives no help text for any of the three; the label is the whole explanation. All
  three are ticked on the single model of the captured instance. With several models configured,
  these checkboxes are how you split the three jobs between them.

- **Embed ID:** — the model's identifier, `infloat-e5-small-v2` here, with a pencil beside it
  whose accessible name is **Edit Name**. The display name at the top of the card and the
  **Embed ID:** underneath are two different values.
- **Delete** — the red trash-can button at the foot of the card (its accessible name is
  `Delete trash-can`); it removes the model.
- **Test** — the blue button beside Delete. The screen gives no text on what it checks, and it
  was not clicked for this page.

**Connection Info**, **Copy**, **Enable All**, **Disable All**, **Edit Name**, **Delete** and
**Test** are the same card chrome as on an LLM card, and
[LLM Details](/configuration/neural-config/llm-details/) describes them in full.

:::caution[mAIstro is not maistro]
The **mAIstro** checkbox on an embedding card — spelled with capital `AI` — belongs to
**Embedding Functions**. An LLM card in **LLM Details** has a lower-case `maistro` checkbox in
its **LLM Functions** group, visible at the top of the viewport image above. They are different
controls on different cards: one chooses which model embeds text for agents, the other which
model runs agent prompts.
:::

### Matching the model to the index

A vector index belongs to the model that built it. That is what the caution paragraph means in
practice: changing the model on an instance that already holds vectors makes those vectors
unusable until they are recomputed, and recomputing costs both time and embedding calls.

<!-- UNCONFIRMED: an external vector index must be created with the vector size of the embedding model NeuralSeek will query it with — from the Pinecone setup page's vector-size list, not shown on the Embedding Models screen -->

The same rule reaches outside NeuralSeek when the vectors live in a store you created yourself:
an external index is created with a fixed vector size, so it has to match the model that queries
it. [Pinecone setup](/knowledge/pinecone/) lists the vector size per model
(`infloat-e5-small-v2` is 384);
[Elasticsearch vector model](/knowledge/elasticsearch-vector-model/) covers the Elasticsearch
side. The **Embedding Models** screen does not display a dimension anywhere, so take the number
from the store's setup page.

## FAQ

**What happens if I switch embedding models on a running instance?**

The product warns before you do it: "all existing vectors will need to be recomputed for the new
model - which will incur time and expense". Plan the switch as a re-index, not as a setting
change.

**What do KB Search, mAIstro and Vector Intent control?**

They are the three jobs an embedding model can be assigned under **Embedding Functions**:
knowledge-base retrieval, embeddings for agents, and intent matching. There are no others, and
the screen offers no help text beyond the labels. On the captured instance the single model has
all three ticked.

**Is the mAIstro checkbox the same as maistro on an LLM card?**

No. **mAIstro** is one of the three **Embedding Functions** on an embedding card; `maistro` is
one of the **LLM Functions** on an LLM card in
[LLM Details](/configuration/neural-config/llm-details/). Ticking one does not tick the other.

**Can I run more than one embedding model?**

The section is a list of cards and **Add an Embedding** adds another, so the screen is built for
it. The captured instance has one card, so a second was not observed; with two, the **KB
Search**, **mAIstro** and **Vector Intent** checkboxes on each card decide which model does which
job.

**Where do I see the model's identifier, and can I change it?**

**Embed ID:** at the bottom of the card shows it — `infloat-e5-small-v2` on the captured
instance — and the pencil beside it (**Edit Name**) is the rename control. The heading at the
top of the card is the display name, which is not the same value.
