---
title: "Supported knowledge bases"
description: "The KnowledgeBase Type selector in Neural Config lists sixteen knowledge bases — Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, ElasticSearch, watsonx Discovery, OpenSearch, Kendra, Bedrock, IBM CAS, Pinecone, Milvus, Postgres, Virtual KB, NeuralSeek KB, No KnowledgeBase and ChromaDB — and the connection form each one opens decides which retrieval controls, such as filters, re-sorting, full-document return and hybrid or vector search, you can set."
---

NeuralSeek answers from the knowledge base you pick with **KnowledgeBase Type**, the first field of [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/). This page compares the sixteen types the selector offers: what each one's connection form asks for, and which retrieval controls — field mapping, filters, re-sorting, full-document return, hybrid or vector search — it gives you. Use it to choose a store and gather its connection details before you switch. What each field means is on KnowledgeBase Connection; the end-to-end walkthrough is [Connect a knowledge base](/knowledge/connect-a-kb/).

## Where to find it

1. Open [Neural Config](/configuration/neural-config/).
2. In the routing tree, select **Default Config / Answer Generation**. The **Configuration: Default Config** dialog opens.
3. Expand **KnowledgeBase Connection**. **KnowledgeBase Type** sits at the top, beside **KnowledgeBase Language**, with **Notes** below them.

![The top of KnowledgeBase Connection: KnowledgeBase Type reading NeuralSeek KB, KnowledgeBase Language reading English, and the Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

**KnowledgeBase Language** and **Notes** stay the same whatever type you pick. Everything below them is the connection form of the selected type, and it changes as soon as you pick another one. The new store is used only once you save the dialog; how **Save** and **Propose Changes** differ is on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

## Settings

### KnowledgeBase Type

The selector lists sixteen types. The menu scrolls after the first four.

![The KnowledgeBase Type list open: Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch and ElasticSearch at the top of a scrolling menu](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

In screen order:

| KnowledgeBase Type        | What it connects to                                                               | Setup page                                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Watson Discovery`        | An IBM Watson Discovery project, signed in with an API key                        | —                                                                                                                                                  |
| `Watson Discovery (CP4D)` | A Watson Discovery project on Cloud Pak for Data, signed in with user and password | —                                                                                                                                                  |
| `Elastic AppSearch`       | An Elastic App Search engine                                                      | —                                                                                                                                                  |
| `ElasticSearch`           | An Elasticsearch index                                                            | [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/), [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/) |
| `watsonx Discovery`       | An IBM watsonx Discovery index                                                    | [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/)                                                                      |
| `OpenSearch`              | An OpenSearch index                                                               | —                                                                                                                                                  |
| `Kendra`                  | An Amazon Kendra index                                                            | —                                                                                                                                                  |
| `Bedrock`                 | An Amazon Bedrock knowledge base                                                  | —                                                                                                                                                  |
| `IBM CAS`                 | A vector store in IBM CAS, reached through the CAS API                            | —                                                                                                                                                  |
| `Pinecone`                | A Pinecone index                                                                  | [Pinecone](/knowledge/pinecone/)                                                                                                                   |
| `Milvus`                  | A Milvus collection                                                               | —                                                                                                                                                  |
| `Postgres`                | A Postgres table with an embedding column                                         | —                                                                                                                                                  |
| `Virtual KB`              | A mAIstro agent that supplies the documents                                       | [Virtual KB](/seek/virtual-kb/)                                                                                                                    |
| `NeuralSeek KB`           | NeuralSeek's built-in knowledge base, filled with the documents you load          | [Managed knowledge base](/knowledge/managed-knowledgebase/overview/), [Loading documents](/knowledge/load/)                                        |
| `No KnowledgeBase`        | No store                                                                          | —                                                                                                                                                  |
| `ChromaDB`                | A ChromaDB collection                                                             | —                                                                                                                                                  |

### Connection fields per store

Each type opens its own connection form under **Notes**. Collect these values before you switch, so the form is never left half-filled.

| KnowledgeBase Type        | Connection fields                                                                                                                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Watson Discovery`        | **Discovery Service Url**, **Discovery API Key**, **Discovery Project ID**                                                                                                                                                         |
| `Watson Discovery (CP4D)` | **Discovery Service Url**, **Discovery User Name**, **Discovery Password**, **Discovery Auth URL**, **Discovery Project ID**                                                                                                       |
| `Elastic AppSearch`       | **Elastic AppSearch Endpoint**, **AppSearch Private API Key**, **AppSearch Engine Name**                                                                                                                                           |
| `ElasticSearch`           | **ElasticSearch Endpoint**, **ElasticSearch Private API Key**, **ElasticSearch Index Name**                                                                                                                                        |
| `watsonx Discovery`       | **watsonx Discovery Endpoint**, **watsonx Discovery Private API Key** (with a **Generate Key** button beside it), **watsonx Discovery Index Name**                                                                                  |
| `OpenSearch`              | **OpenSearch Endpoint**, **OpenSearch Username**, **OpenSearch Password**, **OpenSearch Index Name**                                                                                                                               |
| `Kendra`                  | **Kendra Index ID**, **AWS Region**, **AWS Role Access Key**, **AWS Role Secret Access Key**                                                                                                                                       |
| `Bedrock`                 | **Bedrock Knowledgebase ID**, **AWS Region**, **AWS Access Key ID**, **AWS Secret Access Key**, **Bedrock Search Type**                                                                                                            |
| `IBM CAS`                 | **CAS API Base URL**, **CAS Bearer Token**, **Vector Store**, plus a certificate (see [Certificates and TLS connections](#certificates-and-tls-connections))                                                                        |
| `Pinecone`                | **Pinecone.io Index Name**, **Pinecone.io Index Namespace**, **Pinecone.io API Key**                                                                                                                                               |
| `Milvus`                  | **Milvus Host:Port**, **Milvus Collection name**, **(Optional) Milvus Database name**, an optional connection token, plus a certificate                                                                                            |
| `Postgres`                | **Postgres Host:Port**, **Postgres Database name**, **Postgres Username**, **Postgres Password**, **Postgres table name or FQN e.g. schema.tablename**, **Distance Metric**, **Embedding column name**, plus a certificate          |
| `ChromaDB`                | **ChromaDB Database**, **ChromaDB Tenant**, **ChromaDB API Key**, **ChromaDB Collection**                                                                                                                                          |
| `Virtual KB`              | **mAIstro Virtual KB agent**                                                                                                                                                                                                       |
| `NeuralSeek KB`           | None — the form holds only **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**                                                                                                                                        |
| `No KnowledgeBase`        | None — the form holds only **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**                                                                                                                                        |

![KnowledgeBase Connection with Watson Discovery (CP4D) selected: Discovery Service Url, Discovery User Name, Discovery Password, Discovery Auth URL and Discovery Project ID, followed by the first field-mapping dropdowns](/img/neural-config/knowledgebase-connection@kb-type-watson-discovery-cp4d-panel.png)

What sets some of these forms apart:

- **The two Watson Discovery types differ only in sign-in.** `Watson Discovery` uses **Discovery API Key**; `Watson Discovery (CP4D)` replaces it with **Discovery User Name** and **Discovery Password**, and adds **Discovery Auth URL**, the address it authenticates against.
- **`watsonx Discovery` has a key button.** **Generate Key** sits beside **watsonx Discovery Private API Key**.
- **Kendra and Bedrock use different AWS key names.** Kendra asks for **AWS Role Access Key** and **AWS Role Secret Access Key**, Bedrock for **AWS Access Key ID** and **AWS Secret Access Key**. Bedrock also has a **Bedrock Search Type** dropdown, which shows `Default` when you pick the type.
- **Postgres reads vectors from a column you name.** **Embedding column name** suggests `embedding` as a hint only — type the name of the column that holds your vectors — and **Distance Metric** shows `Cosine Distance (recommended)` — the product's own recommendation.
- **Milvus takes one token for either credential style.** The optional token field's help reads: "The token can be either an API key or a username and password pair combined with a colon in between." **(Optional) Milvus Database name** shows `default`.
- **`Pinecone` and `Virtual KB` have their own pages.** Index setup is on [Pinecone](/knowledge/pinecone/); choosing the agent for **mAIstro Virtual KB agent** is on [Virtual KB](/seek/virtual-kb/).
- **`NeuralSeek KB` needs no connection details** because the store is part of NeuralSeek; you add content by [loading documents](/knowledge/load/). `No KnowledgeBase` has no connection details either.

![KnowledgeBase Connection with Bedrock selected: Bedrock Knowledgebase ID, AWS Region, AWS Access Key ID, AWS Secret Access Key and Bedrock Search Type reading Default, then Link Field, Document Name Field, Attribute sources inside LLM Context by Document Name and Filter Field](/img/neural-config/knowledgebase-connection@kb-type-bedrock-panel.png)

### Certificates and TLS connections

The `IBM CAS`, `Milvus` and `Postgres` forms have an **Enable One-way TLS Connection** checkbox and a **Choose File** button for a server certificate. The help under the button tells you what the certificate is for:

- `IBM CAS`: "(Optional) Server.pem: Provide the CA certificate used to verify the CAS server. Without it, self-signed certificates are accepted. Choose File then cancel to clear server.pem selection."
- `Milvus` and `Postgres`: "(Optional) Server.pem: Provide the server.pem certificate and ensure the server name matches the CommonName configured in the certificate. Choose File then cancel to clear server.pem selection."

`Milvus` adds a server name box, which shows `localhost`, with the help "(Optional) Server name: Please ensure the server name matches the CommonName configured in the certificate." Set it to the CommonName in your certificate when you upload one.

![KnowledgeBase Connection with Postgres selected: the host, database, user, password and table fields, Distance Metric reading Cosine Distance (recommended), Embedding column name with its embedding hint, and Enable One-way TLS Connection with its Choose File button and help text](/img/neural-config/knowledgebase-connection@kb-type-postgres-panel.png)

### Field mapping and retrieval controls by store

Below the connection fields, thirteen of the types show a field-mapping area: which field of your documents holds the text, the link and the title, and which retrieval controls the store supports. `Virtual KB`, `NeuralSeek KB` and `No KnowledgeBase` have none. What each control does is on KnowledgeBase Connection; this table shows where you find it. ✓ = on that store's form, – = not on it.

| Control                                                                                     | Watson Discovery | Watson Discovery (CP4D) | Elastic AppSearch | ElasticSearch | watsonx Discovery | OpenSearch | Kendra | Bedrock | IBM CAS | Pinecone | Milvus | Postgres | ChromaDB |
| ------------------------------------------------------------------------------------------- | --- | --------- | --------- | ------------- | ----------------- | ---------- | ------ | ------- | ------- | -------- | ------ | -------- | -------- |
| **Curation Data Field**                                                                     | ✓   | ✓         | ✓         | ✓             | ✓                 | ✓          | –      | –       | –       | ✓        | ✓      | ✓        | –        |
| **Link Field**, **Document Name Field**                                                     | ✓   | ✓         | ✓         | ✓             | ✓                 | ✓          | ✓      | ✓       | ✓       | ✓        | ✓      | ✓        | ✓        |
| **Attribute sources inside LLM Context by Document Name**                                   | ✓   | ✓         | ✓         | ✓             | ✓                 | ✓          | ✓      | ✓       | ✓       | ✓        | ✓      | ✓        | ✓        |
| **Additional Payload Field**, **Include additional Payload Field inside LLM context**       | ✓   | ✓         | –         | ✓             | ✓                 | –          | –      | –       | –       | –        | –      | –        | –        |
| **Return the full document instead of passages (only enable this if all of your documents are short)** | ✓   | ✓         | ✓         | ✓             | ✓                 | –          | –      | –       | –       | –        | –      | –        | –        |
| **Preserve the separation of, or combine, document snippets received from the KB source**  | –   | –         | –         | –             | –                 | –          | ✓      | –       | –       | –        | –      | –        | –        |
| **Filter Field**, **Static Default Filter Value (when no runtime filter is passed)**        | ✓   | ✓         | ✓         | ✓             | ✓                 | ✓          | ✓      | ✓       | ✓       | ✓        | ✓      | ✓        | ✓        |
| **Re-Sort values list.**                                                                    | ✓   | ✓         | ✓         | ✓             | ✓                 | ✓          | ✓      | ✓       | ✓       | ✓        | ✓      | ✓        | ✓        |
| **Enable Advanced Schema**                                                                  | ✓   | ✓         | ✓         | ✓             | ✓                 | ✓          | ✓      | ✓       | ✓       | ✓        | ✓      | ✓        | ✓        |
| **Hybrid & Vector Search Settings**                                                         | –   | –         | –         | ✓             | ✓                 | –          | –      | –       | –       | –        | –      | –        | –        |

![The field-mapping area with watsonx Discovery selected: Document Name Field, Additional Payload Field, Include additional Payload Field inside LLM context, Attribute sources inside LLM Context by Document Name, Return the full document instead of passages reading Disabled, Filter Field, Static Default Filter Value, the Re-Sort values list. block with Re-Sort Field and the Priority and Value or RegExp table, and the Enable Advanced Schema button](/img/neural-config/knowledgebase-connection@kb-wxd-panel.png)

The rows that need a word of explanation:

- **Return the full document instead of passages (only enable this if all of your documents are short)** sends whole documents rather than matching passages; its label is the guidance. It shows `Disabled` when you pick a type that has it.
- **Preserve the separation of, or combine, document snippets received from the KB source** is Kendra's own dropdown; it shows `Combined Snippets` when you pick `Kendra`.
- **Filter Field** names the document field retrieval can be filtered on, and **Static Default Filter Value (when no runtime filter is passed)** is the value used when a request carries no filter of its own. Passing a filter with each request is covered on [Dynamic filters](/seek/dynamic-filters/).
- **Re-Sort values list.** is described on screen as "Enter a prioritized list of values you want to re-rank above other results, regardless of KB score." Pick the **Re-Sort Field**, then add rows, each with a **Priority** and a **Value or RegExp**. Every store with a field-mapping area has it, so you can rank chosen documents first on any of them.
- **Hybrid & Vector Search Settings** is not part of this form: for `ElasticSearch` and `watsonx Discovery` it appears as its own section of the dialog, after **KnowledgeBase Tuning**. The query types it offers are on [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/), and setting up vectors on an Elastic index on [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/). That section also decides where the query vector comes from: a model deployed in Elasticsearch, such as ELSER, or — with **Use NeuralSeek configured embedding models?** — a model from [Embedding models](/configuration/neural-config/embedding-models/).

**Enable Advanced Schema** is a button at the foot of every field-mapping area; what it does is covered on KnowledgeBase Connection.

When you pick a type, the three mapping dropdowns show field names typical for that store. Change them to the fields your own documents use.

| KnowledgeBase Type                                                             | Curation Data Field | Link Field            | Document Name Field        |
| ------------------------------------------------------------------------------ | ------------------- | --------------------- | -------------------------- |
| `Watson Discovery`, `Watson Discovery (CP4D)`                                  | `text`              | `metadata.source.url` | `extracted_metadata.title` |
| `Elastic AppSearch`, `ElasticSearch`, `watsonx Discovery`, `OpenSearch`        | `body_content`      | `url`                 | `title`                    |
| `Pinecone`, `Milvus`, `Postgres`                                               | `text`              | `link`                | `title`                    |
| `Kendra`                                                                       | –                   | `Default`             | `Default`                  |
| `Bedrock`                                                                      | –                   | `link`                | `title`                    |
| `IBM CAS`                                                                      | –                   | `docpath`             | `filename`                 |
| `ChromaDB`                                                                     | –                   | empty                 | empty                      |

### KnowledgeBase Tuning follows the store

The type you pick also changes the next section of the dialog, [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/). With `NeuralSeek KB` it offers "Expansion Window. How many chunks to grab before and after the target chunk."; with any other type it offers "Snippet size. Use this setting to window relevant details in a document that do not specifically mention the user question, but apply to it." Revisit that section after you switch stores.

## FAQ

### Which knowledge bases can NeuralSeek search?

The sixteen values of **KnowledgeBase Type**: `Watson Discovery`, `Watson Discovery (CP4D)`, `Elastic AppSearch`, `ElasticSearch`, `watsonx Discovery`, `OpenSearch`, `Kendra`, `Bedrock`, `IBM CAS`, `Pinecone`, `Milvus`, `Postgres`, `Virtual KB`, `NeuralSeek KB`, `No KnowledgeBase` and `ChromaDB`.

### Which stores let me choose hybrid or vector search?

`ElasticSearch` and `watsonx Discovery`. They are the only types that add the **Hybrid & Vector Search Settings** section, where you choose how the index is queried. `Pinecone`, `Milvus`, `Postgres` and `ChromaDB` are vector databases by nature and have no query-type setting.

### Can I make certain documents rank above the rest?

Yes, on every store with a field-mapping area. Use **Re-Sort values list.**: pick the **Re-Sort Field**, then list the values or regular expressions to rank first, in priority order.

### What should I have ready before I switch to another store?

The values in the store's row of [Connection fields per store](#connection-fields-per-store), and the names of the fields in your documents that hold the text, the link and the title, for the mapping dropdowns.

## Related

- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) — every field of the section explained
- [Connect a knowledge base](/knowledge/connect-a-kb/) — connecting a store step by step
- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) — the section that follows the store
- [Hybrid, vector & semantic search](/knowledge/hybrid-vector-semantic-search/) — query types for ElasticSearch and watsonx Discovery
- [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/) — setting up vectors on an Elastic index
- [Pinecone](/knowledge/pinecone/) — setting up a Pinecone index
- [Embedding models](/configuration/neural-config/embedding-models/) — the models NeuralSeek can use to compute vectors
- [Dynamic filters](/seek/dynamic-filters/) — passing a filter with each request
- [Managed knowledge base](/knowledge/managed-knowledgebase/overview/) — the built-in NeuralSeek KB
- [Virtual KB](/seek/virtual-kb/) — answering from an mAIstro agent
