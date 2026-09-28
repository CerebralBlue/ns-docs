---
title: "Supported knowledge bases"
description: "The KnowledgeBase Type selector in Neural Config lists sixteen knowledge bases — Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, ElasticSearch, watsonx Discovery, OpenSearch, Kendra, Bedrock, IBM CAS, Pinecone, Milvus, Postgres, Virtual KB, NeuralSeek KB, No KnowledgeBase and ChromaDB — and the connection form each one opens decides which retrieval controls, such as filters, re-sorting, full-document return and hybrid or vector search, you can set."
---

## What is it

A reference page that lists every knowledge base NeuralSeek can use, exactly as the **KnowledgeBase Type** selector names them, together with what the connection form for each one asks for and which retrieval controls it offers. It is a list and a comparison, not a setup guide: nothing is configured here. The connection itself is made in [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/), and several stores have their own setup page, linked from the table below.

## Why it matters

The store you pick decides which retrieval features exist for you afterwards. Choosing a **KnowledgeBase Type** swaps the whole connection form: a Watson Discovery form has a full-document switch and an extra payload field that a Pinecone form does not, and only ElasticSearch and watsonx Discovery add a **Hybrid & Vector Search Settings** section. A setting described elsewhere in these docs can therefore be missing from your configuration simply because the store behind it does not offer it. Checking this page before you connect is cheaper than finding the gap after your content is indexed.

## When to use it

- You are about to connect a knowledge base and want to know which stores are on offer and what each one will ask you for.
- A control described on another page (a filter field, re-sorting, full-document return, hybrid or vector search) is not on your screen and you want to know whether the store is the reason.
- You are comparing two stores you could realistically run.

Do not use this page as connection instructions. What each field means is on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/), and the end-to-end walkthrough is [Connect a knowledge base](/knowledge/connect-a-kb/).

## How it works

### Where the type is chosen

The store is picked with the **KnowledgeBase Type** dropdown, at the top of the **KnowledgeBase Connection** section of the **Edit Configuration** dialog in [Neural Config](/configuration/neural-config/). **KnowledgeBase Language** and **Notes** sit beside it and are the same for every type. Everything below those three fields changes with the type you select, and that per-type form is what the rest of this page compares.

![KnowledgeBase Connection section: the KnowledgeBase Type dropdown reading NeuralSeek KB, KnowledgeBase Language reading English, and the Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

Picking a type changes the form on screen straight away; the new store is used only once the configuration is saved.

### Every KnowledgeBase Type on the selector

Opening **KnowledgeBase Type** shows the first few values, and the menu scrolls. The list holds sixteen values. In screen order they are:

`Watson Discovery` · `Watson Discovery (CP4D)` · `Elastic AppSearch` · `ElasticSearch` · `watsonx Discovery` · `OpenSearch` · `Kendra` · `Bedrock` · `IBM CAS` · `Pinecone` · `Milvus` · `Postgres` · `Virtual KB` · `NeuralSeek KB` · `No KnowledgeBase` · `ChromaDB`

![The KnowledgeBase Type option list open over the form, showing Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch and ElasticSearch before the menu scrolls](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

The option list follows the NeuralSeek version you run, so the selector on your own instance is the authoritative list. The table points each type to the section below that describes its form, and to a dedicated page where one exists.

| KnowledgeBase Type        | Form described in                                                                   | Own page                                                                                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Watson Discovery`        | [Watson Discovery forms](#watson-discovery-and-watson-discovery-cp4d)               | —                                                                                                                                                    |
| `Watson Discovery (CP4D)` | [Watson Discovery forms](#watson-discovery-and-watson-discovery-cp4d)               | —                                                                                                                                                    |
| `Elastic AppSearch`       | [Elastic AppSearch and OpenSearch](#elastic-appsearch-and-opensearch)               | —                                                                                                                                                    |
| `ElasticSearch`           | [ElasticSearch and watsonx Discovery](#elasticsearch-and-watsonx-discovery)         | [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/), [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/) |
| `watsonx Discovery`       | [ElasticSearch and watsonx Discovery](#elasticsearch-and-watsonx-discovery)         | [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/)                                                                        |
| `OpenSearch`              | [Elastic AppSearch and OpenSearch](#elastic-appsearch-and-opensearch)               | —                                                                                                                                                    |
| `Kendra`                  | [Kendra and Bedrock](#kendra-and-bedrock)                                           | —                                                                                                                                                    |
| `Bedrock`                 | [Kendra and Bedrock](#kendra-and-bedrock)                                           | —                                                                                                                                                    |
| `IBM CAS`                 | [IBM CAS](#ibm-cas)                                                                 | —                                                                                                                                                    |
| `Pinecone`                | [Pinecone](#pinecone)                                                               | [Pinecone](/knowledge/pinecone/)                                                                                                                     |
| `Milvus`                  | [Milvus and Postgres](#milvus-and-postgres)                                         | —                                                                                                                                                    |
| `Postgres`                | [Milvus and Postgres](#milvus-and-postgres)                                         | —                                                                                                                                                    |
| `Virtual KB`              | [Types without a connection form](#virtual-kb-neuralseek-kb-and-no-knowledgebase)   | [Virtual KB](/seek/virtual-kb/)                                                                                                                      |
| `NeuralSeek KB`           | [Types without a connection form](#virtual-kb-neuralseek-kb-and-no-knowledgebase)   | [Managed knowledge base](/knowledge/managed-knowledgebase/overview/)                                                                                 |
| `No KnowledgeBase`        | [Types without a connection form](#virtual-kb-neuralseek-kb-and-no-knowledgebase)   | —                                                                                                                                                    |
| `ChromaDB`                | [ChromaDB](#chromadb)                                                               | —                                                                                                                                                    |

Two things about this list are worth knowing before you compare it with older material:

- The screen spelling is the one to use. The selector says `Kendra` and `Bedrock`, not "Amazon Kendra" and "Amazon Bedrock", and `Watson Discovery (CP4D)` rather than "Watson Discovery on CP4D".
- Coveo is not on the list. Earlier material named Coveo as a supported store, but the **KnowledgeBase Type** selector does not offer it, so it cannot be selected.

### Watson Discovery and Watson Discovery (CP4D)

Both IBM Watson Discovery types ask for the service address and the project to search. They differ only in how they sign in.

- `Watson Discovery` asks for **Discovery Service Url**, **Discovery API Key** and **Discovery Project ID**.
- `Watson Discovery (CP4D)`, Watson Discovery on Cloud Pak for Data, replaces the API key with **Discovery User Name**, **Discovery Password** and **Discovery Auth URL**, and keeps **Discovery Service Url** and **Discovery Project ID**.

![KnowledgeBase Connection with Watson Discovery selected: Discovery Service Url, Discovery API Key and Discovery Project ID, then Curation Data Field reading text, Link Field reading metadata.source.url, Document Name Field reading extracted_metadata.title, Additional Payload Field, Include additional Payload Field inside LLM context and Attribute sources inside LLM Context by Document Name reading Enabled](/img/neural-config/knowledgebase-connection@kb-type-watson-discovery-panel.png)

![KnowledgeBase Connection with Watson Discovery (CP4D) selected: Discovery Service Url, Discovery User Name, Discovery Password, Discovery Auth URL and Discovery Project ID, then Curation Data Field, Link Field, Document Name Field and Additional Payload Field](/img/neural-config/knowledgebase-connection@kb-type-watson-discovery-cp4d-panel.png)

Below the sign-in fields both forms show the full set of shared fields described in [The fields every connection form shares](#the-fields-every-connection-form-shares), including **Additional Payload Field** and **Return the full document instead of passages (only enable this if all of your documents are short)**. When you pick either type, the mapping dropdowns show `text` for **Curation Data Field**, `metadata.source.url` for **Link Field** and `extracted_metadata.title` for **Document Name Field**.

### Elastic AppSearch and OpenSearch

These two search engines each ask for an endpoint, a credential and the engine or index to search.

- `Elastic AppSearch`: **Elastic AppSearch Endpoint**, **AppSearch Private API Key** and **AppSearch Engine Name**.
- `OpenSearch`: **OpenSearch Endpoint**, **OpenSearch Username**, **OpenSearch Password** and **OpenSearch Index Name**.

![KnowledgeBase Connection with Elastic AppSearch selected: Elastic AppSearch Endpoint, AppSearch Private API Key and AppSearch Engine Name, then Curation Data Field reading body_content, Link Field reading url, Document Name Field reading title and Attribute sources inside LLM Context by Document Name reading Enabled](/img/neural-config/knowledgebase-connection@kb-type-elastic-appsearch-panel.png)

![KnowledgeBase Connection with OpenSearch selected: OpenSearch Endpoint, OpenSearch Username, OpenSearch Password and OpenSearch Index Name, then Curation Data Field reading body_content, Link Field reading url, Document Name Field reading title and Attribute sources inside LLM Context by Document Name reading Enabled](/img/neural-config/knowledgebase-connection@kb-type-opensearch-panel.png)

On both forms the mapping dropdowns show `body_content`, `url` and `title` for **Curation Data Field**, **Link Field** and **Document Name Field**. Neither has an **Additional Payload Field**. `Elastic AppSearch` has the **Return the full document instead of passages (only enable this if all of your documents are short)** switch; `OpenSearch` does not.

### ElasticSearch and watsonx Discovery

These two types have the widest forms of all.

- `ElasticSearch`: **ElasticSearch Endpoint**, **ElasticSearch Private API Key** and **ElasticSearch Index Name**.
- `watsonx Discovery`: **watsonx Discovery Endpoint**, **watsonx Discovery Private API Key** with a **Generate Key** button beside it, and **watsonx Discovery Index Name**.

Both show every shared field, including **Additional Payload Field** and **Return the full document instead of passages (only enable this if all of your documents are short)**, with `body_content`, `url` and `title` in the three mapping dropdowns. They are also the only two types that add a section to the **Edit Configuration** dialog: **Hybrid & Vector Search Settings** appears right after **KnowledgeBase Tuning**.

![The Edit Configuration dialog with ElasticSearch selected, scrolled to the foot of the connection form: the Enable Advanced Schema button, then the KnowledgeBase Tuning header and the expanded Hybrid & Vector Search Settings section with its warning text and Elastic Query Type reading Lucene](/img/neural-config/knowledgebase-connection@kb-elastic.png)

### Hybrid & Vector Search Settings

This section is where you choose how the Elastic index is searched, with the **Elastic Query Type** dropdown. The values seen on the form are `Lucene`, `Hybrid`, `Semantic` and `Vector`. The section opens with this warning:

> ElasticSearch can provide Lucene, Hybrid, and pure Vector search. For most usecases Lucene search is best. Depending on your settings, Vector and Hybrid searches may amplify hallucinations by bringing back similar but corporatley-different documentation, adding confusion to the LLM - especially with searches based on part number, version, or product name... Do not casually enable Vector search.

With **Elastic Query Type** set to `Hybrid`, the section adds **Use NeuralSeek configured embedding models?**, **Use the Elastic ELSER model?**, **Model Id** and **Embedding Field**. The help text under **Embedding Field** says that for ELSER v1 this is typically `ml.tokens`, and for ELSER v2 `content_embedding`.

![Hybrid & Vector Search Settings with Elastic Query Type set to Hybrid: Use NeuralSeek configured embedding models? reading False, Use the Elastic ELSER model? reading True, Model Id and Embedding Field](/img/neural-config/knowledgebase-connection@kb-es-hybrid-panel.png)

What each query type does and which fields it shows is on [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/). Setting up vector search on an Elastic index is on [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/), and the embedding models themselves are added in [Embedding models](/configuration/neural-config/embedding-models/). No other type shows this section.

### Kendra and Bedrock

The two AWS services ask for the index or knowledge base to search, the region and a key pair.

- `Kendra`: **Kendra Index ID**, **AWS Region**, **AWS Role Access Key** and **AWS Role Secret Access Key**. It is the only type with the dropdown **Preserve the separation of, or combine, document snippets received from the KB source**, which reads `Combined Snippets` when you pick the type. Its **Link Field** and **Document Name Field** both read `Default`.
- `Bedrock`: **Bedrock Knowledgebase ID**, **AWS Region**, **AWS Access Key ID**, **AWS Secret Access Key** and a **Bedrock Search Type** dropdown reading `Default`. Its **Link Field** reads `link` and its **Document Name Field** reads `title`.

![KnowledgeBase Connection with Kendra selected: Kendra Index ID, AWS Region, AWS Role Access Key and AWS Role Secret Access Key, then Link Field and Document Name Field reading Default, Attribute sources inside LLM Context by Document Name, and the snippets dropdown reading Combined Snippets](/img/neural-config/knowledgebase-connection@kb-type-kendra-panel.png)

![KnowledgeBase Connection with Bedrock selected: Bedrock Knowledgebase ID, AWS Region, AWS Access Key ID, AWS Secret Access Key and Bedrock Search Type reading Default, then Link Field reading link, Document Name Field reading title, Attribute sources inside LLM Context by Document Name and Filter Field](/img/neural-config/knowledgebase-connection@kb-type-bedrock-panel.png)

Neither form has a **Curation Data Field**, an **Additional Payload Field** or the full-document switch. Both keep **Filter Field** and the **Re-Sort values list.**

### IBM CAS

`IBM CAS` asks for **CAS API Base URL** and **CAS Bearer Token**, and has a **Vector Store** dropdown. An **Enable One-way TLS Connection** checkbox sits beside them, with a **Choose File** button for an optional certificate. The help text under it reads: "(Optional) Server.pem: Provide the CA certificate used to verify the CAS server. Without it, self-signed certificates are accepted."

![KnowledgeBase Connection with IBM CAS selected: CAS API Base URL, CAS Bearer Token, the Vector Store dropdown, Enable One-way TLS Connection with a Choose File button and its help text, then Link Field reading docpath, Document Name Field reading filename, Attribute sources inside LLM Context by Document Name and Filter Field](/img/neural-config/knowledgebase-connection@kb-type-ibm-cas-panel.png)

The mapping dropdowns show `docpath` for **Link Field** and `filename` for **Document Name Field**. There is no **Curation Data Field**, no **Additional Payload Field** and no full-document switch; **Filter Field** and the **Re-Sort values list.** are present. These docs have no dedicated IBM CAS page yet, so the form is all there is to go on.

### Pinecone

`Pinecone` asks for **Pinecone.io Index Name**, **Pinecone.io Index Namespace** and **Pinecone.io API Key**.

![KnowledgeBase Connection with Pinecone selected: Pinecone.io Index Name, Pinecone.io Index Namespace and Pinecone.io API Key, then Curation Data Field reading text, Link Field reading link, Document Name Field reading title and Attribute sources inside LLM Context by Document Name reading Enabled](/img/neural-config/knowledgebase-connection@kb-pinecone-panel.png)

Its mapping dropdowns show `text`, `link` and `title` for **Curation Data Field**, **Link Field** and **Document Name Field**. It has **Filter Field** and the **Re-Sort values list.**, but no **Additional Payload Field** and no full-document switch. The full setup is on [Pinecone](/knowledge/pinecone/).

### Milvus and Postgres

Both are databases you reach by host and port, and both offer a one-way TLS connection.

- `Milvus`: **Milvus Host:Port**, **Milvus Collection name**, **(Optional) Milvus Database name** (the box reads `default`), and an optional connection token. The token's help text says it "can be either an API key or a username and password pair combined with a colon in between." **Enable One-way TLS Connection** comes with a **Choose File** button for the server certificate and an optional server name (the box reads `localhost`); the help text says the server name must match the CommonName configured in the certificate.
- `Postgres`: **Postgres Host:Port**, **Postgres Database name**, **Postgres Username**, **Postgres Password**, **Postgres table name or FQN e.g. schema.tablename**, a **Distance Metric** dropdown reading `Cosine Distance (recommended)`, and **Embedding column name**, which reads `embedding`. **Enable One-way TLS Connection** and the certificate upload follow.

![KnowledgeBase Connection with Milvus selected: Milvus Host:Port, Milvus Collection name, the optional database name reading default, the optional token, Enable One-way TLS Connection with a Choose File button, the optional server name reading localhost, then Curation Data Field reading text and Link Field reading link](/img/neural-config/knowledgebase-connection@kb-type-milvus-panel.png)

![KnowledgeBase Connection with Postgres selected: Postgres Host:Port, Postgres Database name, Postgres Username, Postgres Password, the table name field, Distance Metric reading Cosine Distance (recommended), Embedding column name reading embedding, and Enable One-way TLS Connection with a Choose File button](/img/neural-config/knowledgebase-connection@kb-type-postgres-panel.png)

Both show `text`, `link` and `title` for **Curation Data Field**, **Link Field** and **Document Name Field**, and both have **Filter Field** and the **Re-Sort values list.** Neither has an **Additional Payload Field** or the full-document switch.

### ChromaDB

`ChromaDB` asks for **ChromaDB Database**, **ChromaDB Tenant**, **ChromaDB API Key** and **ChromaDB Collection**.

![KnowledgeBase Connection with ChromaDB selected: ChromaDB Database, ChromaDB Tenant, ChromaDB API Key and ChromaDB Collection, then empty Link Field and Document Name Field dropdowns, Attribute sources inside LLM Context by Document Name reading Enabled, Filter Field and the Re-Sort values list heading](/img/neural-config/knowledgebase-connection@kb-type-chromadb-panel.png)

Unlike the other stores, its **Link Field** and **Document Name Field** start empty, so you pick those fields yourself. There is no **Curation Data Field**, no **Additional Payload Field** and no full-document switch; **Filter Field** and the **Re-Sort values list.** are present. These docs have no dedicated ChromaDB page yet.

### Virtual KB, NeuralSeek KB and No KnowledgeBase

Three types open no connection form at all.

- `Virtual KB` adds a single dropdown, **mAIstro Virtual KB agent**: the mAIstro agent that serves as the knowledge base. How that works is on [Virtual KB](/seek/virtual-kb/).
- `NeuralSeek KB` shows nothing below **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**. It is NeuralSeek's own knowledge base, described under [Managed knowledge base](/knowledge/managed-knowledgebase/overview/).
- `No KnowledgeBase` also shows only those three fields.

![The mAIstro Virtual KB agent dropdown, empty, shown when KnowledgeBase Type is Virtual KB](/img/neural-config/knowledgebase-connection@kb-virtual--maistro-virtual-kb-agent.png)

![KnowledgeBase Connection with No KnowledgeBase selected: only KnowledgeBase Type, KnowledgeBase Language and Notes, with the other Edit Configuration sections collapsed below](/img/neural-config/knowledgebase-connection@kb-type-no-knowledgebase-panel.png)

None of the three has **Filter Field** or a **Re-Sort values list.** The type also changes one control in **KnowledgeBase Tuning**: with `NeuralSeek KB` selected it shows **Expansion Window** ("How many chunks to grab before and after the target chunk."), and with every other type it shows **Snippet size** instead. See [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

<!-- UNCONFIRMED: "No KnowledgeBase runs with no retrieval step, for flows that do not answer from documents" — from the previous MkDocs documentation and this route's gap audit; the form shows only that no connection fields appear -->

The previous documentation described `No KnowledgeBase` as running with no retrieval step at all, for flows that do not answer from documents.

### The fields every connection form shares

Every type that opens a connection form (all except the three above) ends with the same block of field mappings and result controls. Which of the optional ones appear is what separates the stores in [What each store's form shows](#what-each-stores-form-shows).

![The lower half of a connection form: Document Name Field, Additional Payload Field, Include additional Payload Field inside LLM context, Attribute sources inside LLM Context by Document Name reading Enabled, Return the full document instead of passages reading Disabled, Filter Field, Static Default Filter Value, the Re-Sort values list block with Re-Sort Field and its Priority and Value or RegExp table, and the Enable Advanced Schema button](/img/neural-config/knowledgebase-connection@kb-wxd--re-sort-values-list.png)

- **Curation Data Field**, **Link Field** and **Document Name Field**: dropdowns that map fields of your documents. **Link Field** and **Document Name Field** are on every form; **Curation Data Field** is not (see the table below).
- **Additional Payload Field** and **Include additional Payload Field inside LLM context**: only on the Watson Discovery, ElasticSearch and watsonx Discovery forms.
- **Attribute sources inside LLM Context by Document Name**: on every form, reading `Enabled` when you pick a type.
- **Return the full document instead of passages (only enable this if all of your documents are short)**: reads `Disabled` when you pick a type. As its label warns, turn it on only when every document is short.
- **Filter Field** and **Static Default Filter Value (when no runtime filter is passed)**: on every form. How a filter is sent at run time is on [Dynamic filters](/seek/dynamic-filters/).
- **Re-Sort values list.**: the form describes it as "Enter a prioritized list of values you want to re-rank above other results, regardless of KB score." Pick the **Re-Sort Field**, then add rows to the table, each with a **Priority** and a **Value or RegExp**.
- **Enable Advanced Schema**: a button at the foot of every connection form. What it opens is not documented yet.

What each mapping field is for, and how to choose its value, is on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

### What each store's form shows

The table is read straight off each type's connection form: ✓ means the control is on that store's form, — means it is not.

| KnowledgeBase Type        | Curation Data Field | Additional Payload Field | Return the full document instead of passages | Filter Field | Re-Sort values list. | Hybrid & Vector Search Settings |
| ------------------------- | ------------------- | ------------------------ | -------------------------------------------- | ------------ | -------------------- | ------------------------------- |
| `Watson Discovery`        | ✓                   | ✓                        | ✓                                            | ✓            | ✓                    | —                               |
| `Watson Discovery (CP4D)` | ✓                   | ✓                        | ✓                                            | ✓            | ✓                    | —                               |
| `Elastic AppSearch`       | ✓                   | —                        | ✓                                            | ✓            | ✓                    | —                               |
| `ElasticSearch`           | ✓                   | ✓                        | ✓                                            | ✓            | ✓                    | ✓                               |
| `watsonx Discovery`       | ✓                   | ✓                        | ✓                                            | ✓            | ✓                    | ✓                               |
| `OpenSearch`              | ✓                   | —                        | —                                            | ✓            | ✓                    | —                               |
| `Kendra`                  | —                   | —                        | —                                            | ✓            | ✓                    | —                               |
| `Bedrock`                 | —                   | —                        | —                                            | ✓            | ✓                    | —                               |
| `IBM CAS`                 | —                   | —                        | —                                            | ✓            | ✓                    | —                               |
| `Pinecone`                | ✓                   | —                        | —                                            | ✓            | ✓                    | —                               |
| `Milvus`                  | ✓                   | —                        | —                                            | ✓            | ✓                    | —                               |
| `Postgres`                | ✓                   | —                        | —                                            | ✓            | ✓                    | —                               |
| `Virtual KB`              | —                   | —                        | —                                            | —            | —                    | —                               |
| `NeuralSeek KB`           | —                   | —                        | —                                            | —            | —                    | —                               |
| `No KnowledgeBase`        | —                   | —                        | —                                            | —            | —                    | —                               |
| `ChromaDB`                | —                   | —                        | —                                            | ✓            | ✓                    | —                               |

Read this way, query filters and re-sorting are on all thirteen stores that open a connection form, and full-document return is on the Watson Discovery, Elastic AppSearch, ElasticSearch and watsonx Discovery forms only.

### What the previous documentation rated

The previous documentation also rated nine stores on search type, relevance tuning, dynamic filter querying and external embedding models. No connection form shows these as controls, so that table is kept here as it was published, for comparison only. For `ElasticSearch` and `watsonx Discovery`, the search types available are the ones **Elastic Query Type** offers, described in [Hybrid & Vector Search Settings](#hybrid--vector-search-settings).

<!-- UNCONFIRMED: every cell of the table below, the column meanings in the paragraph above it, the Kendra footnote and the Full Document Retrieval ticks mentioned after it — carried over from the previous MkDocs documentation (supported_knowledgebases.md); no connection form shows these capabilities -->

In that table, search types means which of keyword (Lucene), vector and hybrid retrieval the store performs; relevance tuning means the store can boost a result when the query matches a chosen attribute; dynamic filter querying means NeuralSeek can build a filter from the request at query time; external embedding model support means the store can take embeddings from a model you choose instead of its own.

| KnowledgeBase Type | Supported search types | Relevance tuning | Dynamic filter querying | External embedding models |
| ------------------ | ---------------------- | ---------------- | ----------------------- | ------------------------- |
| Watson Discovery   | Lucene                 | Yes              | Yes                     | No                        |
| Elastic AppSearch  | Lucene                 | Yes              | No                      | No                        |
| ElasticSearch      | Lucene, Vector, Hybrid | No               | Yes                     | No                        |
| watsonx Discovery  | Lucene, Vector, Hybrid | Yes              | Yes                     | No                        |
| OpenSearch         | Lucene                 | No               | No                      | No                        |
| Kendra             | Vector (managed)       | No               | Partial, see note       | No                        |
| Bedrock            | Vector (managed)       | No               | No                      | No                        |
| Pinecone           | Vector                 | No               | No                      | Yes                       |
| Milvus             | Vector                 | No               | No                      | Yes                       |

Note: the previous documentation said Kendra supports a subset of filters; [Dynamic filters](/seek/dynamic-filters/) lists the operators NeuralSeek can send. It also marked full-document retrieval as supported by Bedrock, Pinecone and Milvus, whose forms have no full-document switch. The seven types not in the table (Watson Discovery (CP4D), IBM CAS, Postgres, Virtual KB, NeuralSeek KB, No KnowledgeBase and ChromaDB) were never rated on these points, which means "not documented", not "not supported".

### How to choose

The recommendations below follow the previous documentation's guidance, so they carry the same caveat as its table: they describe a starting point for a new deployment, not a support commitment. Check the connection form on your own instance before committing.

<!-- UNCONFIRMED: the recommendations below come from the previous MkDocs documentation's "How to choose" guidance and its unconfirmed table; only the store names and page links are checked against the product -->

- If you need relevance tuning, the previous documentation pointed to Watson Discovery, watsonx Discovery or Elastic AppSearch.
- If you need dynamic filter queries, it pointed to Watson Discovery, watsonx Discovery or ElasticSearch, with Kendra supporting a subset of filters.
- If you need vector search, it pointed to ElasticSearch for document-oriented vector search, Milvus or Pinecone for a scalable vector database, and Kendra or Bedrock for managed vector search where chunking, embedding and indexing are handled for you. Setup guides: [Pinecone](/knowledge/pinecone/), [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/).
- If you want to bring your own embedding model, it pointed to Pinecone or Milvus, with the model assigned on [Embedding models](/configuration/neural-config/embedding-models/). Changing an embedding model means re-embedding the content, so decide this before you index.

## FAQ

**Which knowledge bases can NeuralSeek connect to?**

The sixteen values of the **KnowledgeBase Type** selector: Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, ElasticSearch, watsonx Discovery, OpenSearch, Kendra, Bedrock, IBM CAS, Pinecone, Milvus, Postgres, Virtual KB, NeuralSeek KB, No KnowledgeBase and ChromaDB. The option list follows the version you run, so the selector in **KnowledgeBase Connection** on your own instance is the authoritative list.

**Is Coveo supported?**

Coveo is not on the **KnowledgeBase Type** option list, so it cannot be selected as a knowledge base. If a later version adds it, it will appear in that selector.

**Can I run NeuralSeek without a knowledge base?**

`No KnowledgeBase` is a selectable **KnowledgeBase Type**. With it selected, the **KnowledgeBase Connection** section shows only **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**, and there is no **Filter Field** or **Re-Sort values list.** to set.

**Which stores let me filter and re-rank results?**

Every store that opens a connection form, thirteen of the sixteen, has **Filter Field**, **Static Default Filter Value (when no runtime filter is passed)** and the **Re-Sort values list.** The three that do not are `Virtual KB`, `NeuralSeek KB` and `No KnowledgeBase`.

**Which stores have hybrid or vector search settings?**

Only `ElasticSearch` and `watsonx Discovery` add the **Hybrid & Vector Search Settings** section, where **Elastic Query Type** offers `Lucene`, `Hybrid`, `Semantic` and `Vector`. Some other stores carry vector settings in the connection form itself: `Postgres` asks for a **Distance Metric** and an **Embedding column name**, and `IBM CAS` has a **Vector Store** dropdown. Embedding models themselves are managed in [Embedding models](/configuration/neural-config/embedding-models/).

**What do I need to connect IBM CAS or ChromaDB?**

For `IBM CAS`: **CAS API Base URL**, **CAS Bearer Token** and a **Vector Store**, plus an optional CA certificate if you tick **Enable One-way TLS Connection**. For `ChromaDB`: **ChromaDB Database**, **ChromaDB Tenant**, **ChromaDB API Key** and **ChromaDB Collection**; its **Link Field** and **Document Name Field** start empty, so set them yourself.
