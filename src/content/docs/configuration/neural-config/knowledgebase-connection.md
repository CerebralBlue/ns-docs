---
title: "KnowledgeBase Connection"
description: "KnowledgeBase Connection is the first section of Neural Config's Edit Configuration dialog, where you pick which of sixteen KnowledgeBase Types NeuralSeek retrieves from, state the language of that content, and fill in the connection and field-mapping settings the chosen store needs."
---

## What is it

**KnowledgeBase Connection** is the first section of the **Edit Configuration** dialog in Neural Config. It tells NeuralSeek which store to search when it answers a question, and how to read the documents that store returns.

Three fields are always there: **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**. Everything else in the section depends on the type you pick. `NeuralSeek KB` and `No KnowledgeBase` add nothing, `Virtual KB` adds one agent picker, and every external store adds its own connection fields followed by a common block of field-mapping, filter and re-sort settings.

## Why it matters

Every other retrieval setting acts on what this connection returns. [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) decides how many documents come back and how they are scored. The LLM only ever sees text that this connection produced. If the wrong store is selected, the credentials are wrong or the field mapping points at the wrong metadata field, nothing downstream can make up for it. Seeks come back empty, cite untitled documents or link to nowhere.

The section also changes shape under you. A walkthrough written for one store does not match what another store shows, so this page goes through each type's fields as the screen shows them.

If your documents already live in the NeuralSeek-hosted knowledge base, you do not need anything here beyond **KnowledgeBase Type** = `NeuralSeek KB`. Loading documents into it is covered in [Connect a knowledge base](/knowledge/connect-a-kb/), not in Neural Config.

## When to use it

- You are setting up a new instance and pointing it at a knowledge base for the first time.
- You are moving from one store to another, for example from `NeuralSeek KB` to your own Elasticsearch index or vector database, or to a mAIstro agent acting as a [Virtual KB](/seek/virtual-kb/).
- Answers cite documents without titles or links, which usually means **Link Field** or **Document Name Field** is mapped to the wrong metadata field.
- You want some documents ranked above others no matter their score (**Re-Sort values list.**).
- Seeks return nothing and you want to confirm which store the configuration is actually querying.

## How it works

### Open the section

Open **Neural Config**, click the **Default Config** node in the routing tree, then **Edit Configuration**. The dialog that opens is titled `Configuration: Default Config`, and **KnowledgeBase Connection** is the first accordion header. Click it to expand the section. The other sections stay collapsed below it, and the [Neural Config directory](/configuration/neural-config/) lists all of them.

![The Configuration: Default Config dialog with the KnowledgeBase Connection accordion expanded: KnowledgeBase Type set to NeuralSeek KB, KnowledgeBase Language set to English, an empty Notes box, the collapsed KnowledgeBase Tuning, LLM Details, Embedding Models, Company / Organization Preferences, Platform Preferences and Corporate Document Filter headers, and the Propose Changes and Save footer](/img/neural-config/knowledgebase-connection-panel.png)

Nothing you change takes effect while the dialog is open. The footer holds **Propose Changes** and **Save**, which are explained on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### The fields every type shows

**KnowledgeBase Type** and **KnowledgeBase Language** sit side by side at the top. Each is a dropdown that shows its current value, with its label underneath. Below them is a wide multi-line **Notes** box. None of the three has help text on screen.

![The three fields at the top of KnowledgeBase Connection: the KnowledgeBase Type dropdown reading NeuralSeek KB, the KnowledgeBase Language dropdown reading English, and the empty Notes box with a resize handle](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

**Notes** is a free-text box with no placeholder. Nothing on the screen says that NeuralSeek reads it, or where a saved note appears afterwards. Treat it as a note kept with the connection settings for the next administrator, for example why the type was changed.

### KnowledgeBase Type — the sixteen options

**KnowledgeBase Type** is the store NeuralSeek queries. It is also the control that decides what the rest of the section shows. Opening it lists sixteen values, in this order:

`Watson Discovery` · `Watson Discovery (CP4D)` · `Elastic AppSearch` · `ElasticSearch` · `watsonx Discovery` · `OpenSearch` · `Kendra` · `Bedrock` · `IBM CAS` · `Pinecone` · `Milvus` · `Postgres` · `Virtual KB` · `NeuralSeek KB` · `No KnowledgeBase` · `ChromaDB`

![The KnowledgeBase Type dropdown open, showing Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, ElasticSearch, watsonx Discovery and the top of OpenSearch, with a scrollbar for the rest of the list](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

The open menu shows about six entries at a time, so scroll to reach `Kendra` and everything after it. Coveo is not on the list. Choosing a type redraws the section right away, with that store's connection fields under **Notes**:

| KnowledgeBase Type        | Connection fields it adds                                                                                                                                                                                         | Covered in                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `Watson Discovery`        | **Discovery Service Url**, **Discovery API Key**, **Discovery Project ID**                                                                                                                                        | [Watson Discovery](#watson-discovery-and-watson-discovery-cp4d)                |
| `Watson Discovery (CP4D)` | **Discovery Service Url**, **Discovery User Name**, **Discovery Password**, **Discovery Auth URL**, **Discovery Project ID**                                                                                       | [Watson Discovery](#watson-discovery-and-watson-discovery-cp4d)                |
| `Elastic AppSearch`       | **Elastic AppSearch Endpoint**, **AppSearch Private API Key**, **AppSearch Engine Name**                                                                                                                          | [Elastic AppSearch and OpenSearch](#elastic-appsearch-and-opensearch)          |
| `ElasticSearch`           | **ElasticSearch Endpoint**, **ElasticSearch Private API Key**, **ElasticSearch Index Name**                                                                                                                       | [ElasticSearch and watsonx Discovery](#elasticsearch-and-watsonx-discovery)    |
| `watsonx Discovery`       | **watsonx Discovery Endpoint**, **watsonx Discovery Private API Key** with **Generate Key**, **watsonx Discovery Index Name**                                                                                      | [ElasticSearch and watsonx Discovery](#elasticsearch-and-watsonx-discovery)    |
| `OpenSearch`              | **OpenSearch Endpoint**, **OpenSearch Username**, **OpenSearch Password**, **OpenSearch Index Name**                                                                                                              | [Elastic AppSearch and OpenSearch](#elastic-appsearch-and-opensearch)          |
| `Kendra`                  | **Kendra Index ID**, **AWS Region**, **AWS Role Access Key**, **AWS Role Secret Access Key**                                                                                                                      | [Kendra and Bedrock](#kendra-and-bedrock)                                      |
| `Bedrock`                 | **Bedrock Knowledgebase ID**, **AWS Region**, **AWS Access Key ID**, **AWS Secret Access Key**, **Bedrock Search Type**                                                                                           | [Kendra and Bedrock](#kendra-and-bedrock)                                      |
| `IBM CAS`                 | **CAS API Base URL**, **CAS Bearer Token**, **Vector Store**, **Enable One-way TLS Connection** and a server certificate upload                                                                                   | [IBM CAS](#ibm-cas)                                                            |
| `Pinecone`                | **Pinecone.io Index Name**, **Pinecone.io Index Namespace**, **Pinecone.io API Key**                                                                                                                              | [Pinecone](/knowledge/pinecone/)                                               |
| `Milvus`                  | **Milvus Host:Port**, **Milvus Collection name**, an optional database name and token, **Enable One-way TLS Connection**, a certificate upload and a server name                                                  | [Vector databases](#pinecone-milvus-postgres-and-chromadb)                     |
| `Postgres`                | **Postgres Host:Port**, **Postgres Database name**, **Postgres Username**, **Postgres Password**, a table name, **Distance Metric**, **Embedding column name**, **Enable One-way TLS Connection**, a certificate upload | [Vector databases](#pinecone-milvus-postgres-and-chromadb)                     |
| `Virtual KB`              | **mAIstro Virtual KB agent**                                                                                                                                                                                      | [Virtual KB](/seek/virtual-kb/)                                                |
| `NeuralSeek KB`           | nothing                                                                                                                                                                                                           | [Connect a knowledge base](/knowledge/connect-a-kb/)                           |
| `No KnowledgeBase`        | nothing                                                                                                                                                                                                           | [below](#neuralseek-kb-no-knowledgebase-and-virtual-kb)                        |
| `ChromaDB`                | **ChromaDB Database**, **ChromaDB Tenant**, **ChromaDB API Key**, **ChromaDB Collection**                                                                                                                         | [Vector databases](#pinecone-milvus-postgres-and-chromadb)                     |

Every type in the table except `Virtual KB`, `NeuralSeek KB` and `No KnowledgeBase` also shows the [field mapping, filter and re-sort block](#field-mapping-filter-and-re-sort). For the setup that happens on the store's side, such as creating the index or the API key, see [Supported knowledge bases](/knowledge/supported-knowledgebases/).

### KnowledgeBase Language

**KnowledgeBase Language** states the language of the documents in the store. Its dropdown is an alphabetical list of 185 languages, from `Abkhazian` to `Zulu`. `Chinese`, `Chinese (Simplified)` and `Chinese (Traditional)` are separate entries. Two entries are spelled oddly, and they are quoted here exactly so you recognise them: `Brazillian Portuguese` and `Interlingua)`.

![The KnowledgeBase Language dropdown open, showing Abkhazian, Afar, Afrikaans, Akan, Albanian and the top of Amharic, with a scrollbar for the rest of the list](/img/neural-config/knowledgebase-connection--options-knowledgebase-language.png)

The screen does not say what else this setting drives. It is not the language answers are written in, which has its own control: **Default Output Language** on [Platform Preferences](/configuration/neural-config/platform-preferences/). How the language settings work together, including translation, is on [Language settings](/configuration/language/).

### NeuralSeek KB, No KnowledgeBase and Virtual KB

These three types add almost nothing to the section.

- **`NeuralSeek KB`** is the NeuralSeek-hosted knowledge base. The section stays at Type, Language and Notes because the store is part of NeuralSeek and needs no credentials. You load documents from the KnowledgeBase screen, not here.
- **`No KnowledgeBase`** also leaves only the three common fields. The field mapping, filter and re-sort block is gone too, so no retrieval settings remain to fill in.

![KnowledgeBase Connection with KnowledgeBase Type set to No KnowledgeBase: only the KnowledgeBase Type, KnowledgeBase Language and Notes fields are shown](/img/neural-config/knowledgebase-connection@kb-type-no-knowledgebase--knowledgebase-type.png)

- **`Virtual KB`** adds a single dropdown, **mAIstro Virtual KB agent**, where you choose the mAIstro agent that acts as the knowledge base. What the agent receives and must return is explained on [Virtual KB](/seek/virtual-kb/).

![The mAIstro Virtual KB agent dropdown that appears under Notes when KnowledgeBase Type is Virtual KB, with no agent selected](/img/neural-config/knowledgebase-connection@kb-virtual--maistro-virtual-kb-agent.png)

### Watson Discovery and Watson Discovery (CP4D)

Both Discovery types ask for the service URL and the project. They differ in how they authenticate.

- **`Watson Discovery`** (IBM Cloud): **Discovery Service Url**, whose placeholder shows the form `https://api.us-south.discovery.watson.cloud.ibm.com/instances/…`, **Discovery API Key** (with a **Show password** eye) and **Discovery Project ID**.
- **`Watson Discovery (CP4D)`** (Cloud Pak for Data): **Discovery Service Url**, **Discovery User Name**, **Discovery Password**, **Discovery Auth URL** and **Discovery Project ID**. It uses a user name and password instead of an API key, and the placeholders show a cluster address for both URLs, for example `https://zen-25-cpd-zen-25.apps.my-cluster-name.com/icp4d-api` for the auth URL.

![KnowledgeBase Connection with KnowledgeBase Type set to Watson Discovery: Discovery Service Url, Discovery API Key and Discovery Project ID, followed by Curation Data Field, Link Field, Document Name Field, Additional Payload Field, Include additional Payload Field inside LLM context and Attribute sources inside LLM Context by Document Name](/img/neural-config/knowledgebase-connection@kb-type-watson-discovery-panel.png)

![KnowledgeBase Connection with KnowledgeBase Type set to Watson Discovery (CP4D): Discovery Service Url, Discovery User Name, Discovery Password, Discovery Auth URL and Discovery Project ID above the field-mapping dropdowns](/img/neural-config/knowledgebase-connection@kb-type-watson-discovery-cp4d-panel.png)

When you pick either type, the mapping dropdowns show `text` for **Curation Data Field**, `metadata.source.url` for **Link Field** and `extracted_metadata.title` for **Document Name Field**. Both types show the full mapping block, including the additional payload fields and **Return the full document instead of passages (only enable this if all of your documents are short)**.

### Elastic AppSearch and OpenSearch

- **`Elastic AppSearch`**: **Elastic AppSearch Endpoint** (placeholder `https://myElasticAppSearchEndpoint.com`), **AppSearch Private API Key** and **AppSearch Engine Name**.
- **`OpenSearch`**: **OpenSearch Endpoint** (placeholder `https://myOpenSearchEndpoint.com`), **OpenSearch Username**, **OpenSearch Password** and **OpenSearch Index Name**. OpenSearch authenticates with a user name and password, not an API key.

![KnowledgeBase Connection with KnowledgeBase Type set to Elastic AppSearch: Elastic AppSearch Endpoint, AppSearch Private API Key and AppSearch Engine Name, then Curation Data Field reading body_content, Link Field reading url, Document Name Field reading title and Attribute sources inside LLM Context by Document Name reading Enabled](/img/neural-config/knowledgebase-connection@kb-type-elastic-appsearch-panel.png)

![KnowledgeBase Connection with KnowledgeBase Type set to OpenSearch: OpenSearch Endpoint, OpenSearch Username, OpenSearch Password and OpenSearch Index Name above the same mapping dropdowns](/img/neural-config/knowledgebase-connection@kb-type-opensearch-panel.png)

For both types the mapping dropdowns show `body_content`, `url` and `title`. `Elastic AppSearch` offers **Return the full document instead of passages (only enable this if all of your documents are short)**. `OpenSearch` does not, and neither type shows the additional payload fields.

### ElasticSearch and watsonx Discovery

- **`ElasticSearch`**: **ElasticSearch Endpoint**, **ElasticSearch Private API Key** and **ElasticSearch Index Name**.
- **`watsonx Discovery`**: **watsonx Discovery Endpoint**, **watsonx Discovery Private API Key** and **watsonx Discovery Index Name**. The private key field is the only one in the whole section with a **Generate Key** button next to it. No other type shows that button. What it generates is not covered on this page.

Both types show the full mapping block, including **Additional Payload Field**, **Include additional Payload Field inside LLM context** and **Return the full document instead of passages (only enable this if all of your documents are short)**. The mapping dropdowns show `body_content`, `url` and `title`.

These two types also add a whole accordion section to the dialog. **Hybrid & Vector Search Settings** appears between **KnowledgeBase Tuning** and **LLM Details**. It holds an **Elastic Query Type** dropdown, which reads `Lucene` when you first pick the type, under this warning from the product: "ElasticSearch can provide Lucene, Hybrid, and pure Vector search. For most usecases Lucene search is best. Depending on your settings, Vector and Hybrid searches may amplify hallucinations by bringing back similar but corporatley-different documentation, adding confusion to the LLM - especially with searches based on part number, version, or product name... Do not casually enable Vector search." No other type shows this section.

![The Edit Configuration dialog with KnowledgeBase Type set to watsonx Discovery: below the Re-Sort table and the Enable Advanced Schema button, a Hybrid & Vector Search Settings section is expanded between KnowledgeBase Tuning and LLM Details, showing the warning about Vector and Hybrid search and the Elastic Query Type dropdown set to Lucene](/img/neural-config/knowledgebase-connection@kb-wxd.png)

The query types and the fields each one adds are covered in [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/) and [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/).

### Kendra and Bedrock

The two AWS stores ask for an AWS region and an access key pair.

- **`Kendra`**: **Kendra Index ID**, **AWS Region** (placeholder `us-east-1`), **AWS Role Access Key** and **AWS Role Secret Access Key**. Kendra is the only type with the dropdown **Preserve the separation of, or combine, document snippets received from the KB source**, which reads `Combined Snippets` when you first pick the type. Its other choices are not listed on this page yet. Its **Link Field** and **Document Name Field** both read `Default`.

![KnowledgeBase Connection with KnowledgeBase Type set to Kendra: Kendra Index ID, AWS Region, AWS Role Access Key and AWS Role Secret Access Key, then Link Field and Document Name Field reading Default, Attribute sources inside LLM Context by Document Name reading Enabled, and the snippets dropdown reading Combined Snippets](/img/neural-config/knowledgebase-connection@kb-type-kendra-panel.png)

- **`Bedrock`**: **Bedrock Knowledgebase ID**, **AWS Region**, **AWS Access Key ID**, **AWS Secret Access Key** and a **Bedrock Search Type** dropdown that reads `Default`. The other search types are not listed on this page yet. The mapping dropdowns show `link` and `title`.

![KnowledgeBase Connection with KnowledgeBase Type set to Bedrock: Bedrock Knowledgebase ID, AWS Region, AWS Access Key ID, AWS Secret Access Key and Bedrock Search Type reading Default, then Link Field, Document Name Field, Attribute sources inside LLM Context by Document Name and Filter Field](/img/neural-config/knowledgebase-connection@kb-type-bedrock-panel.png)

Neither type has a **Curation Data Field**, the additional payload fields or **Return the full document instead of passages (only enable this if all of your documents are short)**.

### IBM CAS

**`IBM CAS`** asks for **CAS API Base URL** (placeholder `https://cas.example.com/cas/api/v1`), **CAS Bearer Token** and a **Vector Store** dropdown, which is empty while the connection fields are blank. Its options are not listed on this page yet. Below them are an **Enable One-way TLS Connection** checkbox and a certificate upload. The upload's help text reads: "(Optional) Server.pem: Provide the CA certificate used to verify the CAS server. Without it, self-signed certificates are accepted. Choose File then cancel to clear server.pem selection." In other words, leave the upload empty only if you accept self-signed certificates.

![KnowledgeBase Connection with KnowledgeBase Type set to IBM CAS: CAS API Base URL, CAS Bearer Token, the Vector Store dropdown, the Enable One-way TLS Connection checkbox with a Choose File control and its Server.pem help text, then Link Field reading docpath and Document Name Field reading filename](/img/neural-config/knowledgebase-connection@kb-type-ibm-cas-panel.png)

The mapping dropdowns show `docpath` for **Link Field** and `filename` for **Document Name Field**. There is no **Curation Data Field**.

### Pinecone, Milvus, Postgres and ChromaDB

The vector databases each ask for their own address, collection and credentials.

- **`Pinecone`**: **Pinecone.io Index Name**, **Pinecone.io Index Namespace** and **Pinecone.io API Key**. The walkthrough, including its mapping lists, is on [Pinecone](/knowledge/pinecone/).
- **`Milvus`**: **Milvus Host:Port** (placeholder `Hostname:Port`), **Milvus Collection name** and **(Optional) Milvus Database name**. There is also an optional token field whose label reads "(Optional) The token used for connection. The token can be either an API key or a username and password pair combined with a colon in between." For TLS, Milvus shows **Enable One-way TLS Connection**, a **Choose File** upload for `server.pem` and an optional server name field. The server name must match the CommonName configured in the certificate.

![KnowledgeBase Connection with KnowledgeBase Type set to Milvus: Milvus Host:Port, Milvus Collection name, the optional database name and token fields, the Enable One-way TLS Connection checkbox with Choose File and the optional server name, then Curation Data Field reading text and Link Field reading link](/img/neural-config/knowledgebase-connection@kb-type-milvus-panel.png)

- **`Postgres`**: **Postgres Host:Port**, **Postgres Database name**, **Postgres Username**, **Postgres Password** and **Postgres table name or FQN e.g. schema.tablename**. It also has a **Distance Metric** dropdown that reads `Cosine Distance (recommended)`, and an **Embedding column name** field showing `embedding`, which names the column that holds the vectors. Like Milvus, it offers **Enable One-way TLS Connection** and a `server.pem` upload. The other distance metrics are not listed on this page yet.

![KnowledgeBase Connection with KnowledgeBase Type set to Postgres: Postgres Host:Port, Postgres Database name, Postgres Username, Postgres Password, the table name field, Distance Metric reading Cosine Distance (recommended), Embedding column name reading embedding, and the Enable One-way TLS Connection checkbox with a Choose File control](/img/neural-config/knowledgebase-connection@kb-type-postgres-panel.png)

- **`ChromaDB`**: **ChromaDB Database**, **ChromaDB Tenant**, **ChromaDB API Key** and **ChromaDB Collection**. It has no **Curation Data Field**, and its **Link Field** and **Document Name Field** start empty.

![KnowledgeBase Connection with KnowledgeBase Type set to ChromaDB: ChromaDB Database, ChromaDB Tenant, ChromaDB API Key and ChromaDB Collection, then empty Link Field and Document Name Field dropdowns, Attribute sources inside LLM Context by Document Name reading Enabled, Filter Field, and the Re-Sort values list heading](/img/neural-config/knowledgebase-connection@kb-type-chromadb-panel.png)

For Pinecone, Milvus and Postgres the mapping dropdowns show `text`, `link` and `title`.

### Field mapping, filter and re-sort

Every external store, which means every type except `Virtual KB`, `NeuralSeek KB` and `No KnowledgeBase`, ends with the same block. It tells NeuralSeek which of your documents' metadata fields hold the body, the link and the title, and it lets you filter and re-rank results.

![The field mapping block for watsonx Discovery: Curation Data Field, Link Field, Document Name Field, Additional Payload Field, Include additional Payload Field inside LLM context, Attribute sources inside LLM Context by Document Name reading Enabled, Return the full document instead of passages reading Disabled, Filter Field, Static Default Filter Value, the Re-Sort values list with its Re-Sort Field and Priority / Value or RegExp table, and the red Enable Advanced Schema button](/img/neural-config/knowledgebase-connection@kb-wxd--re-sort-values-list.png)

<!-- UNCONFIRMED: the purpose of each mapping field (Curation Data Field = document body, Link Field = URL shown under the title and in the Virtual Agent chat bubble, Document Name Field = the title, Attribute sources… wraps each passage in "The document 'name' states that…", Filter Field = the metadata field filtered on, Static Default Filter Value = used when no runtime filter is passed) — from the old Configuration overview page; the screen shows only the labels -->

- **Curation Data Field** is the field that holds the document text.
- **Link Field** is the URL shown with a source.
- **Document Name Field** is the document's title.
- **Additional Payload Field** and **Include additional Payload Field inside LLM context** pick one more metadata field and decide whether it goes into the LLM's context.
- **Attribute sources inside LLM Context by Document Name** (`Enabled` / `Disabled`) decides whether each passage reaches the LLM introduced by its document name, which helps some LLMs keep track of which source said what.
- **Return the full document instead of passages (only enable this if all of your documents are short)** (`Disabled` / `Enabled`) sends whole documents instead of passages. As its label warns, enable it only if every document is short.
- **Filter Field** is the metadata field to filter on, for example a document type. **Static Default Filter Value (when no runtime filter is passed)** is the value used when a Seek call does not pass a filter of its own. Runtime filters are covered in [Dynamic filters](/seek/dynamic-filters/).

Opened before the connection details are filled in, each mapping dropdown holds only its current value and `Loading data...`, so fill in the connection fields first.

The **Re-Sort values list.** heading carries its own help text: "Enter a prioritized list of values you want to re-rank above other results, regardless of KB score." Choose the metadata field in **Re-Sort Field**. Then add rows to the table, whose columns are **Priority** and **Value or RegExp**, with the light-bulb button, whose tooltip reads **Add a new row.**. Use it to rank internal content above a general web crawl, for example, without excluding anything.

**Enable Advanced Schema** is a red button at the bottom of the block. What it opens is not covered on this page.

Which parts of the block each type shows:

| KnowledgeBase Type        | Curation Data Field | Additional Payload fields | Return the full document | Snippet separation | Hybrid & Vector Search Settings |
| ------------------------- | ------------------- | ------------------------- | ------------------------ | ------------------ | ------------------------------- |
| `Watson Discovery`        | yes                 | yes                       | yes                      | —                  | —                               |
| `Watson Discovery (CP4D)` | yes                 | yes                       | yes                      | —                  | —                               |
| `Elastic AppSearch`       | yes                 | —                         | yes                      | —                  | —                               |
| `ElasticSearch`           | yes                 | yes                       | yes                      | —                  | yes                             |
| `watsonx Discovery`       | yes                 | yes                       | yes                      | —                  | yes                             |
| `OpenSearch`              | yes                 | —                         | —                        | —                  | —                               |
| `Kendra`                  | —                   | —                         | —                        | yes                | —                               |
| `Bedrock`                 | —                   | —                         | —                        | —                  | —                               |
| `IBM CAS`                 | —                   | —                         | —                        | —                  | —                               |
| `Pinecone`                | yes                 | —                         | —                        | —                  | —                               |
| `Milvus`                  | yes                 | —                         | —                        | —                  | —                               |
| `Postgres`                | yes                 | —                         | —                        | —                  | —                               |
| `ChromaDB`                | —                   | —                         | —                        | —                  | —                               |

**Link Field**, **Document Name Field**, **Attribute sources inside LLM Context by Document Name**, **Filter Field**, **Static Default Filter Value (when no runtime filter is passed)**, the **Re-Sort values list.** and **Enable Advanced Schema** appear for all thirteen.

### Checking the connection

The section has no test-connection button for any type. The only buttons in it are **Show password**, **Generate Key** (watsonx Discovery only), the file uploads, **Add a new row.** and **Enable Advanced Schema**. To check a connection, save the configuration and ask a question on the Seek tab. If the answer cites documents from your store, with titles and links, the connection and the mapping are working.

The type also changes the next section. With `NeuralSeek KB`, **KnowledgeBase Tuning** holds an Expansion Window setting ("How many chunks to grab before and after the target chunk"). With any other type it holds a Snippet size setting in its place. Both are covered on [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

### Settings that are not in this section

- How many documents retrieval returns, how they are scored, and the query cache: [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).
- Loading documents into the `NeuralSeek KB` store: [Connect a knowledge base](/knowledge/connect-a-kb/).
- The embedding model NeuralSeek uses for vector search: [Embedding Models](/configuration/neural-config/embedding-models/).
- The language answers are written in: **Default Output Language** on [Platform Preferences](/configuration/neural-config/platform-preferences/).
- Saving, proposing and reverting a configuration: [Using the Neural Config page](/configuration/neural-config/using-this-page/).

## FAQ

### Where do I tell NeuralSeek which knowledge base to use?

Go to **Neural Config**, click the **Default Config** node, choose **Edit Configuration**, expand **KnowledgeBase Connection** and set **KnowledgeBase Type**. Then fill in the fields that type adds, and save.

### Which knowledge base types can I pick?

There are sixteen: `Watson Discovery`, `Watson Discovery (CP4D)`, `Elastic AppSearch`, `ElasticSearch`, `watsonx Discovery`, `OpenSearch`, `Kendra`, `Bedrock`, `IBM CAS`, `Pinecone`, `Milvus`, `Postgres`, `Virtual KB`, `NeuralSeek KB`, `No KnowledgeBase` and `ChromaDB`. Coveo is not among them.

### I only see three fields. Where do the endpoint and API key go?

You have a type selected that needs no credentials: `NeuralSeek KB`, `No KnowledgeBase`, or `Virtual KB`, which adds only an agent picker. Pick your store in **KnowledgeBase Type** and its connection fields appear under **Notes** right away, followed by the field-mapping block.

### Is there a button to test the connection?

No. None of the sixteen types shows a test button in this section. Save the configuration, then ask a question on the Seek tab and check that the answer cites documents from your store.

### Does KnowledgeBase Language change the language of the answer?

Not on its own. It states the language of the content in the store. The answer language has its own control, **Default Output Language**, on [Platform Preferences](/configuration/neural-config/platform-preferences/). See [Language settings](/configuration/language/) for how the settings combine.

### Why do my answers show sources without titles or links?

Check **Document Name Field** and **Link Field** in the mapping block. They must name the metadata fields in your index that hold the title and the URL. The values the dropdowns show when you first pick a type, such as `title` and `url`, only work if your index uses those field names.
