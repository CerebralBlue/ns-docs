---
title: "Supported knowledge bases"
description: "Which knowledge base stores NeuralSeek can retrieve from, and which retrieval features — relevance tuning, dynamic filter querying, vector search, external embedding models — each store supports."
---

:::caution[Unverified]
The capability matrix on this page is carried over from the previous documentation and has not
been re-checked against a running instance. The authoritative list for your build is the
**KnowledgeBase Type** selector on your own instance — see
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).
:::

## What is it

A reference page listing the knowledge base stores NeuralSeek can retrieve documents from, and
which retrieval features each store supports. It is a capability matrix, not a setup guide and
not a console screen: there is nothing to configure here. The connection itself is made in Neural
Config, and each store has its own setup page.

## Why it matters

The store you connect decides which retrieval features exist for you afterwards. Relevance
tuning, dynamic filter querying, full document retrieval and external embedding model support are
properties of the knowledge base, not of NeuralSeek — so a setting documented elsewhere in these
docs can simply be absent on your instance because the store behind it does not support that
feature. Reading the matrix before you connect is cheaper than discovering the gap after your
content is indexed.

## When to use it

- You are about to connect a knowledge base and want to know what you are committing to.
- A feature described on another page (dynamic filters, vector search, your own embedding model)
  does not appear on your instance and you need to know whether the store is the reason.
- You are comparing two stores you could realistically run.

Do not use this page as connection instructions. The fields for each store live on
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/), and the
end-to-end walkthrough is [Connect a knowledge base](/knowledge/connect-a-kb/).

## How it works

### Where the knowledge base type is set

The store is chosen in [Neural Config](/configuration/neural-config/), with the
**KnowledgeBase Type** selector inside the **KnowledgeBase Connection** section of a
configuration; **KnowledgeBase Language** sits beside it. Which connection fields the section
shows depends on the type selected — that is why the per-store fields are documented on
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) rather than
here.

![KnowledgeBase Connection section of the Edit Configuration dialog, with the KnowledgeBase Type selector reading NeuralSeek KB](/img/neural-config/kb-connection.png)

### What the matrix covers

Each row is a store NeuralSeek can retrieve from; each column is a retrieval feature that either
exists for that store or does not.

<!-- UNCONFIRMED: the whole nine-row capability matrix below, including the Kendra footnote — carried over verbatim from the previous MkDocs documentation (ui/integrate/integrations/supported_knowledgebases/supported_knowledgebases.md); no capture of the running product confirms any cell -->

| KnowledgeBase                                                                              | Supported Search Types | Query Filters | Document Prioritization (Re-Sort) | Relevance Tuning | Dynamic Filter Querying | Full Document Retrieval | External Embedding Model Support |
| ------------------------------------------------------------------------------------------ | ---------------------- | ------------- | --------------------------------- | ---------------- | ----------------------- | ----------------------- | -------------------------------- |
| [Watson Discovery](https://cloud.ibm.com/docs/discovery-data?topic=discovery-data-about)     | Lucene                 | ✓             | ✓                                 | ✓                | ✓                       | ✓                       | ✗                                |
| [watsonx Discovery](https://cloud.ibm.com/docs/discovery-data?topic=discovery-data-about)    | Lucene, Vector, Hybrid | ✓             | ✓                                 | ✓                | ✓                       | ✓                       | ✗                                |
| [Elastic AppSearch](https://www.elastic.co/guide/en/app-search/current/index.html)           | Lucene                 | ✓             | ✓                                 | ✓                | ✗                       | ✓                       | ✗                                |
| [ElasticSearch](https://www.elastic.co/elasticsearch)                                        | Lucene, Vector, Hybrid | ✓             | ✓                                 | ✗                | ✓                       | ✓                       | ✗                                |
| [Amazon Kendra](https://aws.amazon.com/kendra/)                                               | Vector (Managed)       | ✓             | ✓                                 | ✗                | ✓\*                     | ✗                       | ✗                                |
| [Amazon Bedrock](https://aws.amazon.com/bedrock/)                                             | Vector (Managed)       | ✓             | ✓                                 | ✗                | ✗                       | ✓                       | ✗                                |
| [OpenSearch](https://opensearch.org/)                                                         | Lucene                 | ✓             | ✓                                 | ✗                | ✗                       | ✗                       | ✗                                |
| [Pinecone](https://www.pinecone.io/product/)                                                  | Vector                 | ✓             | ✓                                 | ✗                | ✗                       | ✓                       | ✓                                |
| [Milvus](https://milvus.io/docs/overview.md)                                                  | Vector                 | ✓             | ✓                                 | ✗                | ✗                       | ✓                       | ✓                                |

\* Kendra offers selective filtering support. See [Dynamic filters](/seek/dynamic-filters/) for
the operators NeuralSeek can send.

The four feature columns mean the following.

- **Relevance Tuning** — the store can boost a result when the query contains terms matching a
  chosen attribute, so a match on a field you care about outranks a match anywhere else.
- **Dynamic Filter Querying** — NeuralSeek can build a filter from the request at query time and
  narrow the search before the LLM sees anything. How the filters themselves are written is on
  [Dynamic filters](/seek/dynamic-filters/).
- **Vector Search** — the store matches on numeric representations of meaning rather than on
  exact keywords, so a broad or loosely worded question can still retrieve the right passage.
  Lucene search matches indexed keywords; a hybrid store does both. See
  [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/).
- **External Embedding Model Support** — the store can be fed embeddings from a model you choose
  instead of its own, for both indexing and query time. The model is then assigned on
  [Embedding models](/configuration/neural-config/embedding-models/).

The "Supported Search Types" column tells you which of Lucene, vector and hybrid retrieval the
store can perform, and is the column that decides whether the vector and hybrid behaviour
described elsewhere in these docs applies to you.

### Knowledge base types that are not in the matrix

The matrix predates several connection types that the product offers. These are known to be
missing from it, and are documented — where they are documented at all — on their own pages;
their capability rows have deliberately not been invented here.

<!-- UNCONFIRMED: the six types listed below come from this route's gap audit in scripts/migration-map.json, not from a capture; the KnowledgeBase Type option list has never been opened -->

- Watson Discovery on CP4D
- Postgres
- Coveo
- Virtual KB — a mAIstro agent acting as the knowledge base; see [Virtual KB](/seek/virtual-kb/)
- NeuralSeek KB — the built-in store, and the value the captured instance was running
- No KnowledgeBase — mAIstro only, with no retrieval step

Only `NeuralSeek KB` is confirmed as a selectable value, because it is the one the captured
instance had selected. To see the full list for your build, open the **KnowledgeBase Type**
selector on your own instance.

### How to choose

The recommendations below are guidance for a new deployment, not a support contract — check the
matrix, and your own instance, before committing.

- **You need relevance tuning.** Watson Discovery, watsonx Discovery or Elastic AppSearch.
- **You need dynamic filter queries.** Watson Discovery or watsonx Discovery; Amazon Kendra
  supports a subset of filters.
- **You need vector search.** ElasticSearch for document-oriented vector search; Milvus or
  Pinecone for a scalable, high-throughput vector database; Amazon Kendra or Amazon Bedrock for
  managed vector search where the chunking, embedding and indexing choices are handled for you.
  Setup guides: [Pinecone](/knowledge/pinecone/),
  [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/).
- **You want to bring your own embedding model.** Pinecone or Milvus, then assign the model on
  [Embedding models](/configuration/neural-config/embedding-models/). Changing an embedding model
  means re-embedding the content, so decide this before you index.

## FAQ

**Which knowledge bases can NeuralSeek connect to?**

The stores in the matrix above, plus the types listed under "Knowledge base types that are not in
the matrix". The authoritative list for your build is always the **KnowledgeBase Type** selector
in **KnowledgeBase Connection** on your own instance, because the option list follows the version
you are running.

**Which store should I pick for vector search?**

ElasticSearch for document-oriented vector search, Milvus or Pinecone for a scalable vector
database, and Amazon Kendra or Amazon Bedrock if you would rather the chunking and indexing be
managed for you. All four are listed in the matrix with "Vector" among their supported search
types.

**Which stores support dynamic filter queries?**

Watson Discovery, watsonx Discovery and ElasticSearch in the matrix; Amazon Kendra supports a
subset of the filter operators. See [Dynamic filters](/seek/dynamic-filters/).

**Can I use my own embedding model?**

With Pinecone or Milvus, yes — those are the two stores the matrix marks as supporting an
external embedding model. The model is selected on
[Embedding models](/configuration/neural-config/embedding-models/), and switching it later
requires the content to be re-embedded.

**Can I run NeuralSeek without a knowledge base at all?**

There is a "No KnowledgeBase" type for running mAIstro without a retrieval step, but it has not
been confirmed against the product for these docs — the **KnowledgeBase Type** option list was
not captured. Check the selector on your instance before planning around it.
