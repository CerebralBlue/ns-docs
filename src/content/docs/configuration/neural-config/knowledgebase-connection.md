---
title: "KnowledgeBase Connection"
description: "KnowledgeBase Connection, the first section of Neural Config's Edit Configuration dialog, sets which of sixteen KnowledgeBase Types NeuralSeek retrieves from, the language of that content, the store's connection details, and which document fields become the passage, link and title."
---

**KnowledgeBase Connection** decides where NeuralSeek looks when it answers a question: which store it searches on every Seek, how to sign in to that store, and which fields of the returned documents hold the passage text, the link and the title. Every other retrieval setting acts on what this connection returns, so a wrong type, a bad credential or a mismatched field mapping shows up downstream as empty answers, untitled sources or broken links.

The section changes shape with **KnowledgeBase Type**. Three controls are always there; everything below them belongs to the type you pick.

## Where to find it

Go to **Neural Config**, select the **Default Config** node (Answer Generation) in the routing tree, then select **Edit Configuration**. In the **Configuration: Default Config** dialog, expand **KnowledgeBase Connection**, the first section. The other sections of the dialog are listed in the [Neural Config directory](/configuration/neural-config/).

![The KnowledgeBase Connection section expanded, with KnowledgeBase Type set to NeuralSeek KB, KnowledgeBase Language set to English and an empty Notes box](/img/neural-config/knowledgebase-connection-panel.png)

Changes apply only when you select **Save** or **Propose Changes** at the bottom of the dialog; both are explained in [Using the Neural Config page](/configuration/neural-config/using-this-page/). A category with its own custom configuration has the same section, see [Configuration overview](/configuration/overview/).

## Settings

### KnowledgeBase Type, KnowledgeBase Language and Notes

These three controls appear for every type.

![The top of the section: the KnowledgeBase Type dropdown, the KnowledgeBase Language dropdown and the Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

| Setting                    | What it does                                                                                                         | When to change it                                                        |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **KnowledgeBase Type**     | The store NeuralSeek searches on every Seek. Picking a type replaces the rest of the section with that store's form. | When you connect NeuralSeek to a store for the first time, or move to another one. |
| **KnowledgeBase Language** | The language your KnowledgeBase content is written in.                                                               | When your documents are not in the language currently selected.          |
| **Notes**                  | Free text kept with this connection.                                                                                 | To record why the connection is set up the way it is, for the next administrator. |

**KnowledgeBase Type** offers sixteen options, in this order on screen. Pick yours to see its section below.

![The KnowledgeBase Type dropdown open, showing Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch and ElasticSearch at the top of a scrolling list](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

| Option                    | What it connects to                                  | What it asks for                                           | Details                                                                       |
| ------------------------- | ---------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `Watson Discovery`        | An IBM Watson Discovery project on IBM Cloud         | Service URL, API key, project ID                           | [Watson Discovery](#watson-discovery-and-watson-discovery-cp4d)               |
| `Watson Discovery (CP4D)` | A Watson Discovery project on Cloud Pak for Data     | Service URL, user name and password, auth URL, project ID  | [Watson Discovery (CP4D)](#watson-discovery-and-watson-discovery-cp4d)        |
| `Elastic AppSearch`       | An Elastic App Search engine                         | Endpoint, private API key, engine name                     | [Elastic AppSearch](#elastic-appsearch)                                       |
| `ElasticSearch`           | An Elasticsearch index                               | Endpoint, private API key, index name                      | [ElasticSearch](#elasticsearch-and-watsonx-discovery)                         |
| `watsonx Discovery`       | An index in watsonx Discovery                        | Endpoint, private API key, index name                      | [watsonx Discovery](#elasticsearch-and-watsonx-discovery)                     |
| `OpenSearch`              | An OpenSearch index                                  | Endpoint, user name and password, index name               | [OpenSearch](#opensearch)                                                     |
| `Kendra`                  | An Amazon Kendra index                               | Index ID, AWS region, access key pair                      | [Kendra](#kendra)                                                             |
| `Bedrock`                 | An Amazon Bedrock knowledge base                     | Knowledge base ID, AWS region, access key pair             | [Bedrock](#bedrock)                                                           |
| `IBM CAS`                 | An IBM CAS vector store                              | API base URL, bearer token, vector store                   | [IBM CAS](#ibm-cas)                                                           |
| `Pinecone`                | A Pinecone index                                     | Index name, namespace, API key                             | [Pinecone](#pinecone)                                                         |
| `Milvus`                  | A Milvus collection                                  | Host and port, collection, optional database and token     | [Milvus](#milvus)                                                             |
| `Postgres`                | A Postgres table of embeddings                       | Host and port, database, user, table, distance metric      | [Postgres](#postgres)                                                         |
| `Virtual KB`              | A mAIstro agent that acts as the knowledge base      | The agent                                                  | [Virtual KB](#neuralseek-kb-no-knowledgebase-and-virtual-kb)                  |
| `NeuralSeek KB`           | The NeuralSeek-hosted knowledge base                 | Nothing                                                    | [NeuralSeek KB](#neuralseek-kb-no-knowledgebase-and-virtual-kb)               |
| `No KnowledgeBase`        | No store                                             | Nothing                                                    | [No KnowledgeBase](#neuralseek-kb-no-knowledgebase-and-virtual-kb)            |
| `ChromaDB`                | A ChromaDB collection                                | Database, tenant, API key, collection                      | [ChromaDB](#chromadb)                                                         |

Which store fits your content, and what each one supports, is compared in [Supported KnowledgeBases](/knowledge/supported-knowledgebases/). The end-to-end setup, including the work on the store's side, is in [Connect a KnowledgeBase](/knowledge/connect-a-kb/).

**KnowledgeBase Language** is a full alphabetical list of 185 languages, from `Abkhazian` to `Zulu`. Brazilian Portuguese is spelled `Brazillian Portuguese` in the list, separately from `Portuguese`. This setting describes your content; the language answers are written in is set elsewhere, see [Language](/configuration/language/).

![The KnowledgeBase Language dropdown open, showing Abkhazian, Afar, Afrikaans and Akan at the top of a scrolling list](/img/neural-config/knowledgebase-connection--options-knowledgebase-language.png)

### NeuralSeek KB, No KnowledgeBase and Virtual KB

These three types need no endpoint, key or field mapping.

- **`NeuralSeek KB`** is the [NeuralSeek-hosted knowledge base](/knowledge/managed-knowledgebase/overview/). The section keeps only **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**, because the store is part of NeuralSeek. You load its documents from the KnowledgeBase screen.
- **`No KnowledgeBase`** also keeps only those three controls. Choose it for a configuration that should not search any store.

![KnowledgeBase Connection with KnowledgeBase Type set to No KnowledgeBase: only KnowledgeBase Type, KnowledgeBase Language and Notes are shown](/img/neural-config/knowledgebase-connection@kb-type-no-knowledgebase--knowledgebase-type.png)

- **`Virtual KB`** adds one dropdown, **mAIstro Virtual KB agent**: the mAIstro agent that acts as the knowledge base. What that agent receives and must return is covered in [Virtual KB](/seek/virtual-kb/).

![The mAIstro Virtual KB agent dropdown shown under Notes when KnowledgeBase Type is Virtual KB](/img/neural-config/knowledgebase-connection@kb-virtual--maistro-virtual-kb-agent.png)

### Watson Discovery and Watson Discovery (CP4D)

Both Discovery types point at a Discovery project. They differ in how NeuralSeek signs in: an API key on IBM Cloud, a user name and password on Cloud Pak for Data.

| Setting                  | Type                                         | What to enter                                                                                                    |
| ------------------------ | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Discovery Service Url** | Both                                        | The Discovery instance URL. On IBM Cloud it has the form `https://api.<region>.discovery.watson.cloud.ibm.com/instances/<instance id>`; on CP4D it is your cluster's Discovery API address. |
| **Discovery API Key**    | Watson Discovery                             | The API key of the Discovery instance. Select **Show password** to check what you typed.                        |
| **Discovery User Name**  | Watson Discovery (CP4D)                      | The Cloud Pak for Data user NeuralSeek signs in as.                                                              |
| **Discovery Password**   | Watson Discovery (CP4D)                      | That user's password.                                                                                            |
| **Discovery Auth URL**   | Watson Discovery (CP4D)                      | The Cloud Pak for Data authentication endpoint of your cluster, which ends in `/icp4d-api`.                     |
| **Discovery Project ID** | Both                                         | The Discovery project to search.                                                                                 |

![KnowledgeBase Connection with KnowledgeBase Type set to Watson Discovery (CP4D): Discovery Service Url, Discovery User Name, Discovery Password, Discovery Auth URL and Discovery Project ID above the field-mapping dropdowns](/img/neural-config/knowledgebase-connection@kb-type-watson-discovery-cp4d-panel.png)

Both types continue with the full [field mapping](#field-mapping) block, including the additional payload fields.

### Elastic AppSearch

| Setting                        | What to enter                                                         |
| ------------------------------ | --------------------------------------------------------------------- |
| **Elastic AppSearch Endpoint** | The App Search endpoint URL, for example `https://myElasticAppSearchEndpoint.com`. |
| **AppSearch Private API Key**  | The App Search private API key.                                       |
| **AppSearch Engine Name**      | The engine to search, for example `kbase`.                            |

![KnowledgeBase Connection with KnowledgeBase Type set to Elastic AppSearch: Elastic AppSearch Endpoint, AppSearch Private API Key and AppSearch Engine Name, then the field-mapping dropdowns](/img/neural-config/knowledgebase-connection@kb-type-elastic-appsearch-panel.png)

### ElasticSearch and watsonx Discovery

Both types search an Elasticsearch index; watsonx Discovery reaches it through IBM's managed service.

| Setting                               | Type              | What to enter                                                                    |
| ------------------------------------- | ----------------- | -------------------------------------------------------------------------------- |
| **ElasticSearch Endpoint**            | ElasticSearch     | The Elasticsearch endpoint URL.                                                  |
| **ElasticSearch Private API Key**     | ElasticSearch     | The Elasticsearch API key.                                                       |
| **ElasticSearch Index Name**          | ElasticSearch     | The index to search, for example `kbase`.                                        |
| **watsonx Discovery Endpoint**        | watsonx Discovery | The deployment's endpoint, in the form `https://<id>.databases.appdomain.cloud:<port>`. |
| **watsonx Discovery Private API Key** | watsonx Discovery | The private API key. **Generate Key** sits beside this field.                    |
| **watsonx Discovery Index Name**      | watsonx Discovery | The index to search, for example `kbase`.                                        |

<!-- UNCONFIRMED: Generate Key creates the private API key for the field beside it — inferred from its label and position; the button was never opened in a capture (backlog b73cb1cef8) -->

**Generate Key** is a helper for filling in the private API key next to it.

![Placeholder: the watsonx Discovery connection fields with the Generate Key button](/img/_placeholder.svg)

<!-- SCREENSHOT: /img/neural-config/knowledgebase-connection@kb-wxd--connection.png — Neural Config > Default Config > Edit Configuration > KnowledgeBase Connection with KnowledgeBase Type = watsonx Discovery: crop watsonx Discovery Endpoint, watsonx Discovery Private API Key with Generate Key, and watsonx Discovery Index Name. Why: Generate Key exists only on this type and no crop shows it -->

Both types continue with the full [field mapping](#field-mapping) block. They also add a separate section to the dialog, **Hybrid & Vector Search Settings**, right after **KnowledgeBase Tuning**. It sets whether NeuralSeek runs a Lucene, hybrid or vector query against the index, and it is documented in [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/). For setting up the embedding model in Elasticsearch, see [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/).

![The Edit Configuration dialog with KnowledgeBase Type set to watsonx Discovery: the end of KnowledgeBase Connection, then KnowledgeBase Tuning and an expanded Hybrid & Vector Search Settings section with its Elastic Query Type dropdown, followed by LLM Details](/img/neural-config/knowledgebase-connection@kb-wxd.png)

### OpenSearch

OpenSearch signs in with a user name and password rather than an API key.

| Setting                   | What to enter                                                  |
| ------------------------- | -------------------------------------------------------------- |
| **OpenSearch Endpoint**   | The OpenSearch endpoint URL, for example `https://myOpenSearchEndpoint.com`. |
| **OpenSearch Username**   | The user NeuralSeek signs in as.                               |
| **OpenSearch Password**   | That user's password.                                          |
| **OpenSearch Index Name** | The index to search, for example `kbase`.                      |

![KnowledgeBase Connection with KnowledgeBase Type set to OpenSearch: OpenSearch Endpoint, OpenSearch Username, OpenSearch Password and OpenSearch Index Name above the field-mapping dropdowns](/img/neural-config/knowledgebase-connection@kb-type-opensearch-panel.png)

### Kendra

| Setting                                                                                | What it does                                                                                                                                                  |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kendra Index ID**                                                                    | The ID of the Kendra index to search.                                                                                                                         |
| **AWS Region**                                                                         | The AWS region of the index, for example `us-east-1`.                                                                                                        |
| **AWS Role Access Key**                                                                | The access key of the AWS role NeuralSeek uses.                                                                                                              |
| **AWS Role Secret Access Key**                                                         | The secret that goes with that access key.                                                                                                                   |
| **Preserve the separation of, or combine, document snippets received from the KB source** | Whether the snippets Kendra returns for a document reach the answer merged or kept apart. `Combined Snippets` merges them. Only Kendra has this setting.   |

![KnowledgeBase Connection with KnowledgeBase Type set to Kendra: Kendra Index ID, AWS Region, AWS Role Access Key and AWS Role Secret Access Key, then Link Field, Document Name Field, Attribute sources inside LLM Context by Document Name and the snippet dropdown reading Combined Snippets](/img/neural-config/knowledgebase-connection@kb-type-kendra-panel.png)

### Bedrock

| Setting                      | What it does                                                                |
| ---------------------------- | --------------------------------------------------------------------------- |
| **Bedrock Knowledgebase ID** | The ID of the Bedrock knowledge base to search.                             |
| **AWS Region**               | The AWS region of the knowledge base, for example `us-east-1`.              |
| **AWS Access Key ID**        | The AWS access key NeuralSeek uses.                                         |
| **AWS Secret Access Key**    | The secret that goes with that access key.                                  |
| **Bedrock Search Type**      | The kind of search NeuralSeek asks Bedrock to run, for example `Default`.   |

![KnowledgeBase Connection with KnowledgeBase Type set to Bedrock: Bedrock Knowledgebase ID, AWS Region, AWS Access Key ID, AWS Secret Access Key and Bedrock Search Type reading Default, then Link Field, Document Name Field, Attribute sources inside LLM Context by Document Name and Filter Field](/img/neural-config/knowledgebase-connection@kb-type-bedrock-panel.png)

### IBM CAS

| Setting                           | What it does                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| **CAS API Base URL**              | The base URL of the CAS API, for example `https://cas.example.com/cas/api/v1`.       |
| **CAS Bearer Token**              | The token NeuralSeek sends to the CAS API.                                           |
| **Vector Store**                  | The CAS vector store to search.                                                      |
| **Enable One-way TLS Connection** | Turns on TLS to the CAS server, with an optional certificate upload (**Choose File**). |

The certificate upload explains itself on screen: "(Optional) Server.pem: Provide the CA certificate used to verify the CAS server. Without it, self-signed certificates are accepted. Choose File then cancel to clear server.pem selection." Upload the CA certificate when you want NeuralSeek to verify the server instead of accepting a self-signed certificate.

![KnowledgeBase Connection with KnowledgeBase Type set to IBM CAS: CAS API Base URL, CAS Bearer Token, Vector Store, the Enable One-way TLS Connection checkbox with Choose File and its help text, then Link Field and Document Name Field](/img/neural-config/knowledgebase-connection@kb-type-ibm-cas-panel.png)

### Pinecone

Pinecone asks for **Pinecone.io Index Name**, **Pinecone.io Index Namespace** and **Pinecone.io API Key**, followed by the field mapping. The full setup, from creating the index to mapping its fields, is in [Pinecone](/knowledge/pinecone/).

![KnowledgeBase Connection with KnowledgeBase Type set to Pinecone: Pinecone.io Index Name, Pinecone.io Index Namespace and Pinecone.io API Key, then Curation Data Field, Link Field, Document Name Field and Attribute sources inside LLM Context by Document Name](/img/neural-config/knowledgebase-connection@kb-pinecone-panel.png)

### Milvus

| Setting                             | What it does                                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Milvus Host:Port**                | The Milvus server, as `Hostname:Port`.                                                            |
| **Milvus Collection name**          | The collection to search.                                                                         |
| **(Optional) Milvus Database name** | The database that holds the collection.                                                           |
| Token                               | Labelled "(Optional) The token used for connection. The token can be either an API key or a username and password pair combined with a colon in between." |
| **Enable One-way TLS Connection**   | Turns on TLS to the Milvus server, with an optional `server.pem` upload (**Choose File**).        |
| Server name                         | Labelled "(Optional) Server name: Please ensure the server name matches the CommonName configured in the certificate." |

When you enable TLS, the upload's help text applies: "(Optional) Server.pem: Provide the server.pem certificate and ensure the server name matches the CommonName configured in the certificate. Choose File then cancel to clear server.pem selection."

![KnowledgeBase Connection with KnowledgeBase Type set to Milvus: Milvus Host:Port, Milvus Collection name, the optional database name and token, Enable One-way TLS Connection with Choose File, the optional server name, then Curation Data Field and Link Field](/img/neural-config/knowledgebase-connection@kb-type-milvus-panel.png)

### Postgres

| Setting                                              | What it does                                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Postgres Host:Port**                               | The database server, as `Hostname:Port`.                                                                     |
| **Postgres Database name**                           | The database that holds the table.                                                                           |
| **Postgres Username**                                | The user NeuralSeek signs in as.                                                                             |
| **Postgres Password**                                | That user's password.                                                                                        |
| **Postgres table name or FQN e.g. schema.tablename** | The table of documents and embeddings, as `tablename` or `schema.tablename`.                                 |
| **Distance Metric**                                  | How similarity is measured between the question's embedding and the stored ones. The list marks `Cosine Distance (recommended)`. |
| **Embedding column name**                            | The column that holds the vectors, for example `embedding`.                                                  |
| **Enable One-way TLS Connection**                    | Turns on TLS to the server, with an optional `server.pem` upload; the help text is the same as for Milvus.  |

![KnowledgeBase Connection with KnowledgeBase Type set to Postgres: host and port, database name, user name, password, table name, Distance Metric reading Cosine Distance (recommended), Embedding column name, and Enable One-way TLS Connection with Choose File](/img/neural-config/knowledgebase-connection@kb-type-postgres-panel.png)

### ChromaDB

| Setting                | What it does                         |
| ---------------------- | ------------------------------------ |
| **ChromaDB Database**  | The ChromaDB database.               |
| **ChromaDB Tenant**    | The tenant that owns the database.   |
| **ChromaDB API Key**   | The key NeuralSeek authenticates with. |
| **ChromaDB Collection** | The collection to search.           |

![KnowledgeBase Connection with KnowledgeBase Type set to ChromaDB: ChromaDB Database, ChromaDB Tenant, ChromaDB API Key and ChromaDB Collection, then Link Field, Document Name Field, Attribute sources inside LLM Context by Document Name and Filter Field](/img/neural-config/knowledgebase-connection@kb-type-chromadb-panel.png)

### Field mapping

Every external store, that is every type except `NeuralSeek KB`, `No KnowledgeBase` and `Virtual KB`, follows its connection fields with a mapping block. It tells NeuralSeek which field of your documents is the passage text, which is the link and which is the title. NeuralSeek cites sources with these fields, so a wrong mapping gives answers with untitled sources or no links.

![The field-mapping block on Watson Discovery: Curation Data Field, Link Field, Document Name Field, Additional Payload Field, Include additional Payload Field inside LLM context, Attribute sources inside LLM Context by Document Name reading Enabled, and the full-document dropdown reading Disabled](/img/neural-config/knowledgebase-connection@kb-type-watson-discovery--re-sort-values-list.png)

<!-- UNCONFIRMED: Curation Data Field holds the document body; Link Field is the URL shown below the title or as a link in the Virtual Agent chat bubble; Attribute sources… introduces each passage as "The document 'name' states that: …", which helps some LLMs track sources — from the old Configuration overview page; the screen shows only the labels -->

| Setting                                                                                              | What it does                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Curation Data Field**                                                                              | The field that holds the document body, the text NeuralSeek takes passages from.                                                             |
| **Link Field**                                                                                       | The field that holds the document's URL, shown with the source and served as a link in Virtual Agent replies.                               |
| **Document Name Field**                                                                              | The field that holds the document's title.                                                                                                    |
| **Additional Payload Field**                                                                         | One more field to bring back with each result.                                                                                                |
| **Include additional Payload Field inside LLM context**                                              | Whether that extra field is also put into the context the LLM answers from.                                                                  |
| **Attribute sources inside LLM Context by Document Name**                                            | `Enabled` introduces each passage to the LLM with its document name ("The document '…' states that: …"), which helps some LLMs keep track of which source said what. `Disabled` passes the passages without names. |
| **Return the full document instead of passages (only enable this if all of your documents are short)** | `Enabled` returns each matching document whole instead of its passages; the on-screen guidance is to enable it only when all of your documents are short. `Disabled` keeps passages. |

<!-- UNCONFIRMED: the mapping lists are filled from the connected store's fields, so a list that shows only "Loading data..." points at the connection fields — inferred from the Pinecone and ElasticSearch captures, where an unconnected store showed only the current value and Loading data... -->

The lists offer the fields of your store. If a list shows only `Loading data...`, check the connection fields above it.

Which mapping rows each type shows:

| KnowledgeBase Type        | Curation Data Field | Additional Payload fields | Return the full document… |
| ------------------------- | ------------------- | ------------------------- | ------------------------- |
| `Watson Discovery`        | yes                 | yes                       | yes                       |
| `Watson Discovery (CP4D)` | yes                 | yes                       | yes                       |
| `Elastic AppSearch`       | yes                 | —                         | yes                       |
| `ElasticSearch`           | yes                 | yes                       | yes                       |
| `watsonx Discovery`       | yes                 | yes                       | yes                       |
| `OpenSearch`              | yes                 | —                         | —                         |
| `Kendra`                  | —                   | —                         | —                         |
| `Bedrock`                 | —                   | —                         | —                         |
| `IBM CAS`                 | —                   | —                         | —                         |
| `Pinecone`                | yes                 | —                         | —                         |
| `Milvus`                  | yes                 | —                         | —                         |
| `Postgres`                | yes                 | —                         | —                         |
| `ChromaDB`                | —                   | —                         | —                         |

**Link Field**, **Document Name Field** and **Attribute sources inside LLM Context by Document Name** appear on all thirteen. Kendra adds its snippet setting, described [above](#kendra).

### Filtering, re-sorting and Enable Advanced Schema

The end of every external store's form restricts which documents a Seek can return and pushes chosen documents to the top.

![The end of the form: Filter Field, Static Default Filter Value (when no runtime filter is passed), the Re-Sort values list. heading with its Re-Sort Field and Priority / Value or RegExp table, and the Enable Advanced Schema button](/img/neural-config/knowledgebase-connection@kb-wxd-panel.png)

| Setting                                                          | What it does                                                                                                                       |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Filter Field**                                                 | The metadata field a filter applies to, for example a field that records each document's type.                                    |
| **Static Default Filter Value (when no runtime filter is passed)** | The filter value NeuralSeek applies when a Seek call does not pass a filter of its own. Runtime filters are covered in [Dynamic filters](/seek/dynamic-filters/). |
| **Re-Sort Field**                                                | The field whose values the re-sort list matches.                                                                                   |

**Re-Sort values list.** carries its own help text: "Enter a prioritized list of values you want to re-rank above other results, regardless of KB score." To use it, choose the field in **Re-Sort Field**, then select the light-bulb button (tooltip **Add a new row.**) and fill in **Priority** and **Value or RegExp** for each value. Documents whose field matches a row rank above the rest, whatever their KB score. Use it to put internal content ahead of a general web crawl, for example, without excluding anything.

<!-- UNCONFIRMED: Enable Advanced Schema allows a narrower search based on the Value List inputs — from the old Configuration overview page; the button was never opened in a capture (backlog f5bd07696c) -->

**Enable Advanced Schema** narrows the search based on the value list inputs.

## Limits and interactions

- **Changing KnowledgeBase Type replaces the form.** The fields of the previous type are no longer shown, so fill in the new type's connection and mapping before you save.
- **KnowledgeBase Tuning follows the type.** With `NeuralSeek KB`, [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) shows an Expansion Window setting; with an external store it shows Snippet size instead. How many documents a Seek takes, how they are scored and the query cache are set there as well.
- **Hybrid & Vector Search Settings exists only for ElasticSearch and watsonx Discovery.** It appears as its own section of the dialog once you pick either type.
- **Vector stores and embeddings.** For Pinecone, Milvus, Postgres and ChromaDB, see [Embedding models](/configuration/neural-config/embedding-models/) for the embedding settings.
- **Answer language.** **KnowledgeBase Language** describes the content; the answer language is **Default Output Language** in [Platform Preferences](/configuration/neural-config/platform-preferences/).

## FAQ

### Which KnowledgeBase Types need no connection details?

`NeuralSeek KB` and `No KnowledgeBase` show only **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**. `Virtual KB` adds one choice, the **mAIstro Virtual KB agent**. Every other type asks for its store's address and credentials.

### Where do I choose Lucene, vector or hybrid search?

Only ElasticSearch and watsonx Discovery offer it, in the **Hybrid & Vector Search Settings** section that appears after **KnowledgeBase Tuning** once you pick either type. See [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/).

### Does KnowledgeBase Language change the language of the answer?

No. It states the language of your content. The answer language is **Default Output Language** in [Platform Preferences](/configuration/neural-config/platform-preferences/); [Language](/configuration/language/) explains how the language settings work together.

### Why do my answers show sources without titles or links?

Check **Document Name Field** and **Link Field** in the field mapping. They must name the fields of your index that hold the title and the URL. A field name the list shows after you pick a type, such as `title` or `url`, only works if your index uses that name.

## Related

- [Connect a KnowledgeBase](/knowledge/connect-a-kb/)
- [Supported KnowledgeBases](/knowledge/supported-knowledgebases/)
- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)
- [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/)
- [Virtual KB](/seek/virtual-kb/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/)
