---
title: "Supported knowledge bases"
description: "NeuralSeek's KnowledgeBase Type selector offers fifteen stores — Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, ElasticSearch, watsonx Discovery, OpenSearch, Kendra, Bedrock, Pinecone, Milvus, Postgres, Virtual KB, NeuralSeek KB, No KnowledgeBase and ChromaDB — and this page lists them with the retrieval features each is known to support."
---

## What is it

A reference page listing every store NeuralSeek can use as its knowledge base, exactly as the
**KnowledgeBase Type** selector in Neural Config names them, and — where the previous
documentation recorded it — which retrieval features each store supports. It is a list and a
capability matrix, not a setup guide: nothing is configured here. The connection itself is made
in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/), and several
stores have their own setup page.

## Why it matters

The store you connect decides which retrieval features exist for you afterwards. Relevance
tuning, dynamic filter querying, full document retrieval and external embedding model support are
properties of the knowledge base, not of NeuralSeek, so a setting documented elsewhere in these
docs can be absent on your instance simply because the store behind it does not offer that
feature. Reading the list before you connect is cheaper than discovering the gap after your
content is indexed.

## When to use it

- You are about to connect a knowledge base and want to know which stores are on offer and what
  you are committing to.
- A feature described on another page (dynamic filters, vector search, your own embedding model)
  does not appear on your instance and you need to know whether the store is the reason.
- You are comparing two stores you could realistically run.

Do not use this page as connection instructions. The fields for each store live on
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/), and the
end-to-end walkthrough is [Connect a knowledge base](/knowledge/connect-a-kb/).

## How it works

### Where the type is chosen

The store is picked with the **KnowledgeBase Type** dropdown, inside the **KnowledgeBase
Connection** section of the **Edit Configuration** dialog in
[Neural Config](/configuration/neural-config/). **KnowledgeBase Language** and **Notes** sit in the
same section. The connection fields shown below the dropdown change with the type selected, which
is why the per-store fields are documented on
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) rather than
here.

![KnowledgeBase Connection section: the KnowledgeBase Type dropdown reading NeuralSeek KB, KnowledgeBase Language reading English, and the Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

The list on this page is that dropdown's option list, captured from the running product. Your own
selector is the authoritative list for the build you run.

### Every KnowledgeBase Type on the selector

Opening **KnowledgeBase Type** shows the first six values; the menu scrolls. The full list, in
screen order, is:

`Watson Discovery` · `Watson Discovery (CP4D)` · `Elastic AppSearch` · `ElasticSearch` ·
`watsonx Discovery` · `OpenSearch` · `Kendra` · `Bedrock` · `Pinecone` · `Milvus` · `Postgres` ·
`Virtual KB` · `NeuralSeek KB` · `No KnowledgeBase` · `ChromaDB`

![The KnowledgeBase Type option list open, showing Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, ElasticSearch, watsonx Discovery and the top of OpenSearch before the menu scrolls](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

Every type is connected on the same page; a few also have a page of their own.

| KnowledgeBase Type        | Connection fields                                                                | Own page                                                                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Watson Discovery`        | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | —                                                                                                                                                    |
| `Watson Discovery (CP4D)` | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | —                                                                                                                                                    |
| `Elastic AppSearch`       | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | —                                                                                                                                                    |
| `ElasticSearch`           | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/), [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/) |
| `watsonx Discovery`       | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/)                                                                        |
| `OpenSearch`              | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | —                                                                                                                                                    |
| `Kendra`                  | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | —                                                                                                                                                    |
| `Bedrock`                 | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | —                                                                                                                                                    |
| `Pinecone`                | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | [Pinecone](/knowledge/pinecone/)                                                                                                                     |
| `Milvus`                  | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | —                                                                                                                                                    |
| `Postgres`                | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | —                                                                                                                                                    |
| `Virtual KB`              | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | [Virtual KB](/seek/virtual-kb/)                                                                                                                      |
| `NeuralSeek KB`           | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | [Managed knowledge base](/knowledge/managed-knowledgebase/overview/)                                                                                 |
| `No KnowledgeBase`        | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | —                                                                                                                                                    |
| `ChromaDB`                | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) | —                                                                                                                                                    |

Three things about this list are worth knowing before you compare it with older material.

- **The screen spelling is the one to use.** The selector says `Kendra` and `Bedrock`, not "Amazon
  Kendra" and "Amazon Bedrock", and `Watson Discovery (CP4D)` rather than "Watson Discovery on
  CP4D".
- **Coveo is not on the list.** Earlier drafts of these docs named Coveo as a supported store; the
  captured option list does not offer it.
- **`ChromaDB` is on the list and nowhere else in these docs.** Nothing beyond its name is known
  from the capture, so it has no capability row below.

`NeuralSeek KB` was the value selected on the captured instance. Of the other types, only the
`NeuralSeek KB` connection fields were on screen during the capture: what `Virtual KB` and
`No KnowledgeBase` change about retrieval is not shown by the selector itself.

<!-- UNCONFIRMED: "Virtual KB — a mAIstro agent acting as the knowledge base" and "No KnowledgeBase — mAIstro only, with no retrieval step" — from the previous documentation and this route's gap audit; the Virtual KB and No KnowledgeBase accordion fields were not captured -->

The previous documentation described `Virtual KB` as a mAIstro agent standing in for a knowledge
base (see [Virtual KB](/seek/virtual-kb/)) and `No KnowledgeBase` as running mAIstro with no
retrieval step at all.

### What each store supports

Each row is a store; each column is a retrieval feature that either exists for that store or does
not. No captured screen shows a per-type capability — only the `NeuralSeek KB` field set was open —
so the whole matrix is carried over from the previous documentation and has not been re-checked
against the running product. Six types were never in that matrix —
`Watson Discovery (CP4D)`, `Postgres`, `Virtual KB`, `NeuralSeek KB`, `No KnowledgeBase` and
`ChromaDB` — and their rows are shown with a dash: their cells have not been documented anywhere,
and none have been invented here.

<!-- UNCONFIRMED: every cell of the nine documented rows below, including the Kendra footnote — carried over verbatim from the previous MkDocs documentation (ui/integrate/integrations/supported_knowledgebases/supported_knowledgebases.md); no capture of the running product confirms any of them -->

| KnowledgeBase Type                                                                            | Supported Search Types | Query Filters | Document Prioritization (Re-Sort) | Relevance Tuning | Dynamic Filter Querying | Full Document Retrieval | External Embedding Model Support |
| --------------------------------------------------------------------------------------------- | ---------------------- | ------------- | --------------------------------- | ---------------- | ----------------------- | ----------------------- | -------------------------------- |
| [Watson Discovery](https://cloud.ibm.com/docs/discovery-data?topic=discovery-data-about)      | Lucene                 | ✓             | ✓                                 | ✓                | ✓                       | ✓                       | ✗                                |
| `Watson Discovery (CP4D)`                                                                     | —                      | —             | —                                 | —                | —                       | —                       | —                                |
| [Elastic AppSearch](https://www.elastic.co/guide/en/app-search/current/index.html)            | Lucene                 | ✓             | ✓                                 | ✓                | ✗                       | ✓                       | ✗                                |
| [ElasticSearch](https://www.elastic.co/elasticsearch)                                         | Lucene, Vector, Hybrid | ✓             | ✓                                 | ✗                | ✓                       | ✓                       | ✗                                |
| [watsonx Discovery](https://cloud.ibm.com/docs/discovery-data?topic=discovery-data-about)     | Lucene, Vector, Hybrid | ✓             | ✓                                 | ✓                | ✓                       | ✓                       | ✗                                |
| [OpenSearch](https://opensearch.org/)                                                         | Lucene                 | ✓             | ✓                                 | ✗                | ✗                       | ✗                       | ✗                                |
| [Kendra](https://aws.amazon.com/kendra/)                                                      | Vector (Managed)       | ✓             | ✓                                 | ✗                | ✓\*                     | ✗                       | ✗                                |
| [Bedrock](https://aws.amazon.com/bedrock/)                                                    | Vector (Managed)       | ✓             | ✓                                 | ✗                | ✗                       | ✓                       | ✗                                |
| [Pinecone](https://www.pinecone.io/product/)                                                  | Vector                 | ✓             | ✓                                 | ✗                | ✗                       | ✓                       | ✓                                |
| [Milvus](https://milvus.io/docs/overview.md)                                                  | Vector                 | ✓             | ✓                                 | ✗                | ✗                       | ✓                       | ✓                                |
| `Postgres`                                                                                    | —                      | —             | —                                 | —                | —                       | —                       | —                                |
| `Virtual KB`                                                                                  | —                      | —             | —                                 | —                | —                       | —                       | —                                |
| `NeuralSeek KB`                                                                               | —                      | —             | —                                 | —                | —                       | —                       | —                                |
| `No KnowledgeBase`                                                                            | —                      | —             | —                                 | —                | —                       | —                       | —                                |
| `ChromaDB`                                                                                    | —                      | —             | —                                 | —                | —                       | —                       | —                                |

\* Kendra offers selective filtering support. See [Dynamic filters](/seek/dynamic-filters/) for
the operators NeuralSeek can send.

— means "not documented", not "not supported". Confirming a row means connecting that store and
reading the KnowledgeBase Connection and KnowledgeBase Tuning sections it exposes, which is a
configuration change and has not been done for these docs.

The feature columns mean the following.

<!-- UNCONFIRMED: the four column definitions below are the old page's glossary for the matrix columns; no captured screen defines these terms — kept as explanation only -->

- **Supported Search Types** — which of Lucene (keyword), vector and hybrid retrieval the store
  can perform. This is the column that decides whether the vector and hybrid behaviour described
  elsewhere in these docs applies to you.
- **Relevance Tuning** — the store can boost a result when the query contains terms matching a
  chosen attribute, so a match on a field you care about outranks a match anywhere else.
- **Dynamic Filter Querying** — NeuralSeek can build a filter from the request at query time and
  narrow the search before the LLM sees anything. How the filters are written is on
  [Dynamic filters](/seek/dynamic-filters/).
- **Vector search** — the store matches on numeric representations of meaning rather than on
  exact keywords, so a loosely worded question can still retrieve the right passage. A hybrid
  store does both. See [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/).
- **External Embedding Model Support** — the store can be fed embeddings from a model you choose
  instead of its own, for both indexing and query time. The model is then assigned on
  [Embedding models](/configuration/neural-config/embedding-models/).

### How to choose

The recommendations below follow the matrix above, so they carry the same caveat: they are the
previous documentation's guidance for a new deployment, not a support contract. Check your own
instance before committing.

<!-- UNCONFIRMED: the four recommendations below are derived from the unconfirmed matrix and the previous documentation's "How to choose" guidance; no capture backs them -->

- **You need relevance tuning.** Watson Discovery, watsonx Discovery or Elastic AppSearch.
- **You need dynamic filter queries.** Watson Discovery, watsonx Discovery or ElasticSearch;
  Kendra supports a subset of filters.
- **You need vector search.** ElasticSearch for document-oriented vector search; Milvus or
  Pinecone for a scalable vector database; Kendra or Bedrock for managed vector search where the
  chunking, embedding and indexing choices are handled for you. Setup guides:
  [Pinecone](/knowledge/pinecone/),
  [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/).
- **You want to bring your own embedding model.** Pinecone or Milvus, then assign the model on
  [Embedding models](/configuration/neural-config/embedding-models/). Changing an embedding model
  means re-embedding the content, so decide this before you index.

## FAQ

**Which knowledge bases can NeuralSeek connect to?**

The fifteen values of the **KnowledgeBase Type** selector on the captured build: Watson
Discovery, Watson Discovery (CP4D), Elastic AppSearch, ElasticSearch, watsonx Discovery,
OpenSearch, Kendra, Bedrock, Pinecone, Milvus, Postgres, Virtual KB, NeuralSeek KB, No
KnowledgeBase and ChromaDB. The option list follows the version you are running, so the selector
in **KnowledgeBase Connection** on your own instance is the authoritative list.

**Is Coveo supported?**

It is not on the captured **KnowledgeBase Type** option list. If your build offers it, the
selector on your instance will show it; these docs do not describe it.

**Can I run NeuralSeek without a knowledge base at all?**

`No KnowledgeBase` is a selectable **KnowledgeBase Type** on the captured build. What it removes
from the retrieval flow is not described by the selector itself; the previous documentation said
it runs mAIstro with no retrieval step.

**What is Virtual KB?**

A selectable **KnowledgeBase Type** whose connection fields were not captured for these docs. The
previous documentation described it as a mAIstro agent standing in for a knowledge base; see
[Virtual KB](/seek/virtual-kb/).

**Which store supports vector search, or my own embedding model?**

From the previous documentation's matrix — not re-checked against the product — ElasticSearch,
watsonx Discovery, Kendra, Bedrock, Pinecone and Milvus list vector search among their search
types, and Pinecone and Milvus are the two marked as accepting an external embedding model. The
per-store pages ([Pinecone](/knowledge/pinecone/),
[Elasticsearch vector model](/knowledge/elasticsearch-vector-model/),
[Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/)) are where to
confirm before you index.
