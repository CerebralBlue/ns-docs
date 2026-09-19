---
title: "Embedding models"
description: "The Embedding Models section of Edit Configuration lists one card per embedding model and assigns each model to KB Search, mAIstro or Vector Intent."
---

## What is it

**Embedding Models** is a section of the **Edit Configuration** dialog in Neural Config. An
embedding model turns text into vectors, which is what NeuralSeek uses to find documents by
meaning rather than by keyword, to give agents vector recall, and to match a question against
stored intents.

Open it from Neural Config (`/configure`): click a configuration node in the routing tree — for
example **Default Config** / **Answer Generation** — then **Edit Configuration**, then the
**Embedding Models** accordion. It is the fourth section, directly below
[LLM Details](/configuration/neural-config/llm-details/).

The section holds one card per model. On the instance captured for this page there is exactly
one card, `e5-small-v2`.

## Why it matters

Embedding models are instance-wide plumbing, not a per-question setting. The paragraph the
product prints beside **Add an Embedding** is the reason to treat this section carefully:

> Add embedding models for use in NeuralSeek. Use caution when switching between models in an
> active instance, as all existing vectors will need to be recomputed for the new model - which
> will incur time and expense.

Vectors already stored in your knowledge base were produced by the model that was active when
they were written. Swapping the model does not re-interpret them; they have to be rebuilt.

## When to use it

Come to this section when you are:

- Adding an embedding model before connecting a vector store that requires one — see
  [Pinecone setup](/knowledge/pinecone/) and
  [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/).
- Deciding which model does retrieval, which serves agents, and which matches intents, when more
  than one model is configured.
- Reading or renaming a model's **Embed ID:** so that references to it stay stable.

This is not where generation models live. Anything that writes an answer, translates, extracts
entities or runs a mAIstro agent's prompt is configured in
[LLM Details](/configuration/neural-config/llm-details/).

## How it works

![The Embedding Models section of the Edit Configuration dialog, with Add an Embedding and one model card](/img/neural-config/embedding-models.png)

### Adding an embedding model

**Add an Embedding** sits at the top of the section, beside the caution paragraph quoted above.
It opens an **Add an Embedding** dialog with **Cancel** and **Add** buttons.

:::note
The dialog was not opened during the capture this page is written from, so the catalogue of
models NeuralSeek offers is not documented here. The one model present on the captured instance
is `e5-small-v2`.
:::

Nothing in the dialog takes effect until the **Edit Configuration** dialog itself is saved — see
[Using this page](/configuration/neural-config/using-this-page/) for **Save** and
**Propose Changes**.

### An embedding card

Each model is a card. Reading the `e5-small-v2` card top to bottom:

- **Connection Info** — a collapsed sub-accordion holding the model's connection settings. It is
  the same control as on an LLM card and is documented on
  [LLM Details](/configuration/neural-config/llm-details/); it was collapsed in this capture, so
  its fields are not listed here.
- **Embedding Functions** — the group of jobs this model is allowed to do, with **Enable All**
  and **Disable All** beside the heading (again, shared with LLM cards and described on
  [LLM Details](/configuration/neural-config/llm-details/)). Three checkboxes:
  - **KB Search** — vector retrieval against the knowledge base.
  - **mAIstro** — embeddings requested by agents.
  - **Vector Intent** — intent matching. See
    [Intent matching and caching](/configuration/neural-config/intent-matching-caching/), which
    owns the rebuild of stored intent vectors.

  All three are ticked on the single model of the captured instance. With several models
  configured, these checkboxes are how you split the three jobs between them.

- **Embed ID:** — the model's identifier, `infloat-e5-small-v2` here, with an **Edit Name**
  control beside it. The larger text at the top of the card (`e5-small-v2`) is the card's
  display name; the **Embed ID:** is the value underneath it.
- **Delete** and **Test** — the same pair as on an LLM card, documented on
  [LLM Details](/configuration/neural-config/llm-details/).

### Matching the model to the index

A vector index belongs to the model that built it. That is what the caution paragraph means in
practice: changing the model on an instance that already holds vectors makes those vectors
unusable until they are recomputed, and recomputing costs both time and embedding calls.

<!-- UNCONFIRMED: an external vector index must be created with the vector size of the embedding model NeuralSeek will query it with — from the Pinecone setup page's vector-size list, not shown on the Embedding Models screen -->

The same rule reaches outside NeuralSeek when the vectors are stored in a service you created
yourself: an external index is created with a fixed vector size, so it has to match the model
that queries it. [Pinecone setup](/knowledge/pinecone/) lists the vector size per model
(`infloat-e5-small-v2` is 384); [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/)
covers the Elasticsearch side. The **Embedding Models** screen does not display a dimension, so
take the number from the store's setup page.

## FAQ

**What happens if I switch embedding models on a running instance?**

The product warns before you do it: "all existing vectors will need to be recomputed for the new
model - which will incur time and expense". Plan the switch as a re-index, not as a setting
change.

**What do KB Search, mAIstro and Vector Intent control?**

They are the three jobs an embedding model can be assigned in **Embedding Functions**:
knowledge-base retrieval, embeddings for agents, and intent matching. A model with all three
ticked does all three; on the captured instance the single model does.

**Can I run more than one embedding model?**

Yes — the section is a list of cards and **Add an Embedding** adds another. Which model does
which job is then decided per card with the **KB Search**, **mAIstro** and **Vector Intent**
checkboxes.

**Where do I see the model's identifier, and can I change it?**

**Embed ID:** at the bottom of the card shows it (`infloat-e5-small-v2` on the captured
instance), and the **Edit Name** control beside it opens the rename. The heading above the card
body is the display name, which is not the same value.

**Is this the same list as LLM Details?**

No. [LLM Details](/configuration/neural-config/llm-details/) holds generation models and its own
function checkboxes; **Embedding Models** holds vector models and the three embedding functions.
The cards look alike — both have **Connection Info**, **Enable All** / **Disable All**,
**Delete** and **Test** — but a model added in one section does not appear in the other.
