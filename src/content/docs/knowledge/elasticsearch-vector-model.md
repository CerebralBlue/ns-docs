---
title: "Elasticsearch vector model"
description: "Use an Elasticsearch index that holds embeddings as NeuralSeek's knowledge base: set KnowledgeBase Type to ElasticSearch, fill the connection and field-mapping settings, then set Elastic Query Type to Vector with the model and embedding field the index was built with."
---

## What is it

This page covers the NeuralSeek side of vector search on Elasticsearch. Once your Elasticsearch
index holds embeddings, three parts of **Neural Config** connect Seek to it:

- **KnowledgeBase Connection**, with **KnowledgeBase Type** set to `ElasticSearch`: where the
  index is, how NeuralSeek authenticates, and which index fields hold the text, link and title.
- **Hybrid & Vector Search Settings**, a section that appears only for Elasticsearch-based
  types: **Elastic Query Type** set to `Vector`, plus the model and the index field that hold
  the embeddings.
- **KnowledgeBase Tuning**, which shows different controls once the type is `ElasticSearch`.

The Elasticsearch side (the deployment, the model and the index) is built in Elastic's own
tools; this page outlines it only so you know what must exist before you connect.

## Why it matters

Keyword (Lucene) search finds documents that share words with the question. Vector search
compares meaning, so it can bring back a passage that answers the question in different words.

It can also make answers worse, and the screen says so directly above **Elastic Query Type**:

> ElasticSearch can provide Lucene, Hybrid, and pure Vector search. For most usecases Lucene
> search is best. Depending on your settings, Vector and Hybrid searches may amplify
> hallucinations by bringing back similar but corporatley-different documentation, adding
> confusion to the LLM - especially with searches based on part number, version, or product
> name... Do not casually enable Vector search.

So treat `Vector` as a deliberate choice for a specific kind of content, tested against real
questions, not as an upgrade over `Lucene`.

## When to use it

- Your content already lives in Elasticsearch, and the index carries an embeddings field built
  by a model you can name.
- Users phrase questions differently from the documents, and keyword search keeps missing
  passages that do answer them.

When it is the wrong tool:

- Questions turn on part numbers, versions or product names. The screen's warning above names
  exactly these cases; keep **Elastic Query Type** on `Lucene`.
- You want keyword and vector search combined, or an Elasticsearch semantic query. Those are the
  other query types; see
  [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/).
- You have no Elasticsearch index and no other reason to run one. The other knowledge base types
  on [Supported knowledge bases](/knowledge/supported-knowledgebases/) need less setup.

## How it works

The order is: build the index in Elasticsearch, select `ElasticSearch` in NeuralSeek and connect,
map the index fields, then switch **Elastic Query Type** to `Vector` and name the model and the
embeddings field.

### Before you start: the Elasticsearch side

None of this happens in NeuralSeek. Check each step against Elastic's documentation for your
version.

<!-- UNCONFIRMED: Elasticsearch can run on IBM Cloud "Databases for Elasticsearch" or on Elastic Cloud, and Kibana's Connection Details shows the endpoint, with Create API Key (a user API key) making the key NeuralSeek uses — old NeuralSeek docs page -->

1. Deployment and credentials: run Elasticsearch on IBM Cloud Databases for Elasticsearch
   or on Elastic Cloud. In Kibana, Connection Details shows the endpoint, and you create a user
   API key there. These two values go into NeuralSeek in the next section.

<!-- UNCONFIRMED: vectorising needs machine-learning capacity on the deployment, and the ELSER model is downloaded and deployed from Kibana's Machine Learning > Trained Models (a text-embedding model can be imported with Elastic's Eland client instead) — old NeuralSeek docs page -->

2. A deployed model: embedding runs on machine-learning capacity in the deployment. Download
   and deploy ELSER from Kibana's Trained Models page, or import a text-embedding model with
   Elastic's Eland client. Note the model's ID; NeuralSeek asks for it.

<!-- UNCONFIRMED: the embeddings are written by an ingest pipeline with an inference processor into a destination index that has an embeddings field, the source index is reindexed through it, and the index's Documents tab shows whether the embeddings are filled; a dense vector field's dimension count must equal the model's output size — old NeuralSeek docs page -->

3. An index with embeddings: create a destination index with an embeddings field, and an
   ingest pipeline whose inference processor runs the model on your text field and writes the
   result into it. Reindex your documents through the pipeline, then open the index's Documents
   tab to check that every document has embeddings. For a dense vector field, the dimension
   count must match the model's output size.

<!-- UNCONFIRMED: a text_expansion (ELSER) or kNN (dense vector) query run in Kibana confirms the index answers before NeuralSeek is connected — old NeuralSeek docs page -->

4. A test query: run a text-expansion query (ELSER) or a kNN query (dense vectors) against
   the index in Kibana. If it returns sensible documents, NeuralSeek has something to search.

Before you change the knowledge base type on a working configuration, take a copy of it with
[Backup and restore](/configuration/backup-restore/). If you run IBM Cloud Databases for
Elasticsearch and plan to try the hybrid query type, read the known error and its fix on
[Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/).

### Select ElasticSearch as the KnowledgeBase Type

In **Neural Config**, open the configuration (for example **Default Config**), then the
**KnowledgeBase Connection** section of the dialog. Pick `ElasticSearch` in **KnowledgeBase
Type**.

![The KnowledgeBase Type list open with ElasticSearch ticked below Watson Discovery, Watson Discovery (CP4D) and Elastic AppSearch; KnowledgeBase Language reads English beside it. The ElasticSearch Endpoint, Private API Key and Index Name fields sit directly below this row once the list is closed.](/img/neural-config/knowledgebase-connection@kb-elastic--options-knowledgebase-type.png)

`ElasticSearch` and `Elastic AppSearch` are separate types with different fields; this page is
about `ElasticSearch`. The full list of types, and **KnowledgeBase Language** and **Notes** beside
the type, are described on
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

Shown when **KnowledgeBase Type** is `ElasticSearch`, three fields tell NeuralSeek where the index
is:

- **ElasticSearch Endpoint**: the URL of your Elasticsearch deployment. The empty field shows the
  placeholder `https://myElasticAppSearchEndpoint.com` (it reads "AppSearch" on this type too);
  replace it with your own endpoint.
- **ElasticSearch Private API Key**: the key NeuralSeek authenticates with. The field is masked;
  the **Show password** eye button reveals what you typed.
- **ElasticSearch Index Name**: the index Seek searches (placeholder `kbase`). For vector search,
  name the index that holds the embeddings field, not a raw source index without them.

### Map the index fields

The field grid below the connection fields tells NeuralSeek which field of each document plays
which role, and how much of each document the LLM receives. All of these are shown when
**KnowledgeBase Type** is `ElasticSearch`.

![The field-mapping grid of KnowledgeBase Connection for ElasticSearch: Curation Data Field, Link Field, Document Name Field, Additional Payload Field, Include additional Payload Field inside LLM context, Attribute sources inside LLM Context by Document Name, Return the full document instead of passages, Filter Field, Static Default Filter Value, the Re-Sort values list with its Priority / Value or RegExp table, and the red Enable Advanced Schema button](/img/neural-config/knowledgebase-connection@kb-elastic-panel.png)

**Curation Data Field**, **Link Field** and **Document Name Field** pick the index fields that
hold the passage text, the document's URL and its title. When one of these lists is opened, it
shows the current field name and a _Loading data..._ entry, so the list appears to be filled from
the fields of the connected index. Do not take the names you see in a fresh form as defaults to
keep: choose the fields your own index uses.

The remaining mapping controls are the same for every knowledge base type and are described on
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/):

- **Additional Payload Field** and **Include additional Payload Field inside LLM context**: one
  extra index field to fetch, and whether it is passed to the LLM too.
- **Attribute sources inside LLM Context by Document Name**: `Enabled` or `Disabled`.
- **Filter Field** and **Static Default Filter Value (when no runtime filter is passed)**: the
  field filters apply to, and the value used when a request carries no filter of its own.
- **Re-Sort values list.**: the screen's help reads "Enter a prioritized list of values you want
  to re-rank above other results, regardless of KB score." You choose the **Re-Sort Field** and
  fill a table of Priority and **Value or RegExp** rows.
- **Enable Advanced Schema**: the red button at the bottom of the section.

![The Return the full document instead of passages dropdown, closed, reading Disabled](/img/neural-config/knowledgebase-connection@kb-elastic--options-return-the-full-document-instead-of-pass.png)

**Return the full document instead of passages (only enable this if all of your documents are
short)** has two options:

- `Disabled`: NeuralSeek works with passages from the matching documents.
- `Enabled`: NeuralSeek hands over each matching document whole.

The label carries the only guidance the screen gives: enable it only if every document in the
index is short. Long documents returned whole take up the room that passages from several
documents would otherwise share.

### Turn on vector search: Elastic Query Type = Vector

**Hybrid & Vector Search Settings** is its own section of the dialog, below **KnowledgeBase
Tuning**. It opens with the warning quoted in [Why it matters](#why-it-matters). Set **Elastic
Query Type** to `Vector`.

![Hybrid & Vector Search Settings with Elastic Query Type on Vector: Use NeuralSeek configured embedding models? reading False, Use the Elastic ELSER model? reading True, Model Id with the placeholder .elser_model_1, and Embedding Field with the placeholder ml.tokens and its ELSER v1 / v2 help text](/img/neural-config/knowledgebase-connection@kb-es-vector-panel.png)

The values seen in **Elastic Query Type** are `Lucene`, `Hybrid`, `Semantic` and `Vector`. This
page covers `Vector`;
[Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/) explains each
query type and when to pick it. With `Vector`, four more fields appear:

- **Use NeuralSeek configured embedding models?**: shown as `False` in the form above, which
  leaves the query vector to the model in your Elastic deployment. The screen's own example for
  the `Semantic` type describes the other setting: "Enable "Use NeuralSeek configured embedding
  models" and NeuralSeek computes the query vector at search time." The index must then have been
  embedded with that same model, so decide this when you build the index.
- **Use the Elastic ELSER model?**: shown as `True`, the setting that matches an index built with
  Elastic's ELSER model, which is what the placeholders in the next two fields assume.
- **Model Id**: the ID of the model deployed in Elasticsearch, exactly as Elastic lists it. The
  empty field shows the placeholder `.elser_model_1`.
- **Embedding Field**: the index field that holds the embeddings. The help text under it reads:
  "Embedding Field. For ELSER v1 this is typicaly "ml.tokens", and for ELSER v2
  "content_embedding"". Use the field your ingest pipeline writes to.

**Model Id** and **Embedding Field** must match what built the index. A different model, or a
field without embeddings, leaves vector search nothing to compare against.

![The header of an embedding model card in the Embedding Models section: the model name e5-small-v2 between an info icon and a copy icon](/img/neural-config/embedding-models--e5-small-v2.png)

The models NeuralSeek itself can embed with are the cards in the **Embedding Models** section of
the same dialog; [Embedding models](/configuration/neural-config/embedding-models/) describes
them, including how a card is marked for knowledge base search.

Nothing in the dialog applies until you press **Save** or **Propose Changes** at its foot;
[Using the Neural Config page](/configuration/neural-config/using-this-page/) explains the
difference. After saving, ask Seek a question the index can answer and check that the cited
sources come from your index.

### KnowledgeBase Tuning looks different on ElasticSearch

Changing the type also changes **KnowledgeBase Tuning**, the collapsed section directly above
**Hybrid & Vector Search Settings**.

![Edit Configuration scrolled to the end of KnowledgeBase Connection: the collapsed KnowledgeBase Tuning section, Hybrid & Vector Search Settings open with Elastic Query Type on Vector, and the Propose Changes and Save buttons at the foot of the dialog](/img/neural-config/knowledgebase-connection@kb-es-vector.png)

With the NeuralSeek KB, the tuning section shows **Expansion Window**. With `ElasticSearch`, as
with the other external types, it shows Snippet size instead: "Snippet size. Use this setting to
window relevant details in a document that do not specifically mention the user question, but
apply to it.", on a range from 100 to 1000. See
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) for the section's
settings.

## FAQ

### Where do I switch Elasticsearch to vector search?

In **Neural Config**, open the configuration and go to **Hybrid & Vector Search Settings**, then
set **Elastic Query Type** to `Vector`. The section only appears when **KnowledgeBase Type** in
**KnowledgeBase Connection** is an Elasticsearch-based type such as `ElasticSearch`; see
[Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/) for which types
show it.

### Should I use Vector instead of Lucene?

Usually not. The screen's own advice is that "For most usecases Lucene search is best", and that
Vector and Hybrid searches may amplify hallucinations, especially with part numbers, versions or
product names: "Do not casually enable Vector search." Compare answers to real questions before
and after the switch.

### What goes in Embedding Field?

The name of the index field that holds the embeddings, which is the field your ingest pipeline
writes to. The help text on the screen gives the usual values: "ml.tokens" for ELSER v1 and
"content_embedding" for ELSER v2.

### When should I return full documents instead of passages?

Only if every document in the index is short, as the label of **Return the full document instead
of passages (only enable this if all of your documents are short)** says. Otherwise leave it on
`Disabled`.

### Why does KnowledgeBase Tuning show Snippet size instead of Expansion Window?

**Expansion Window** belongs to the NeuralSeek KB. With `ElasticSearch` and the other external
types, the section shows Snippet size instead. See
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

### The field dropdowns only show "Loading data...". What is wrong?

The mapping lists appear to be filled from the connected index, so check the connection first:
**ElasticSearch Endpoint**, **ElasticSearch Private API Key** and **ElasticSearch Index Name**.
