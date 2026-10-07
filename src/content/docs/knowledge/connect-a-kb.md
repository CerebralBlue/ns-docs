---
title: "Connect a knowledge base"
description: "Step-by-step walkthrough for admins connecting a knowledge base to NeuralSeek: open KnowledgeBase Connection in Neural Config, pick the KnowledgeBase Type, fill in the store's fields, set the KnowledgeBase Language, save, and confirm with a Seek."
---

Connecting a knowledge base tells NeuralSeek which store to search when it answers a question. Until one is connected, Seek has nothing to ground an answer in: retrieval, the source documents listed under an answer and the KB score all depend on this setting. You do it in one place, the **KnowledgeBase Connection** section of the root configuration in Neural Config. This page walks through the job end to end: open the section, choose the store, fill in its fields, save, and check that answers come from it. What every field means for every store is on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/); which stores are available and how they compare is on [Supported knowledge bases](/knowledge/supported-knowledgebases/).

## Before you begin

- **Have the store's details at hand.** An external store asks where it is, how to authenticate, and which of its fields hold the passage text, the link and the document title. Collect them from the store's own console first.
- **Decide whether you need an external store at all.** `NeuralSeek KB` is one of the choices: NeuralSeek hosts the store, and you add documents on the KnowledgeBase screen instead of entering connection details. See [Managed KnowledgeBase](/knowledge/managed-knowledgebase/overview/) and [Loading documents](/knowledge/load/).
- **Consider a backup.** Changing the store changes every answer. If you want a way back beyond the saved versions, take one first — see [Backup, restore & change logs](/configuration/backup-restore/).

## Open KnowledgeBase Connection

1. Open **Neural Config**. It shows your routing tree; how to read it is on [Configuration overview](/configuration/overview/).
2. Select the **Default Config** node (subtitle `Answer Generation`). The **Default Configuration** dialog opens. Leave **Action to take on match** as it is; this task does not change it.

   ![The Default Configuration dialog: Action to take on match reading Answer Generation, with Edit Configuration and Save in the footer](/img/neural-config/default-config-answer-generation-panel.png)

3. Select **Edit Configuration**. The **Configuration: Default Config** dialog opens with its configuration sections as an accordion.

   ![The Configuration: Default Config dialog: KnowledgeBase Connection first in the list of sections, with Propose Changes and Save in the footer](/img/neural-config/edit-configuration-edit-panel.png)

4. Expand **KnowledgeBase Connection**, the first section.

These steps change the root configuration, which every question uses unless a category routes it elsewhere. A category with its own Custom Configuration carries a separate copy of these sections; categories and their configurations are covered on [Configuration overview](/configuration/overview/).

## Choose the store and the content language

The top of the section holds three fields that every store shares: **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**.

![The top of the KnowledgeBase Connection section: the KnowledgeBase Type and KnowledgeBase Language dropdowns side by side above the Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

1. Open **KnowledgeBase Type** and pick your store. The value already selected is whatever your configuration was last saved with. The list scrolls and holds sixteen values: `Watson Discovery`, `Watson Discovery (CP4D)`, `Elastic AppSearch`, `ElasticSearch`, `watsonx Discovery`, `OpenSearch`, `Kendra`, `Bedrock`, `IBM CAS`, `Pinecone`, `Milvus`, `Postgres`, `Virtual KB`, `NeuralSeek KB`, `No KnowledgeBase` and `ChromaDB`. The value you pick decides which fields appear under the three shared ones.

   ![The KnowledgeBase Type dropdown open on a scrolling list that starts with Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch and ElasticSearch](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

2. Open **KnowledgeBase Language** and pick the language your documents are written in. The list is long and alphabetical, from `Abkhazian` to `Zulu`, and includes regional variants such as `Chinese (Simplified)` and `Chinese (Traditional)`. This setting declares the language of the content; it does not translate it. How it interacts with the language of the question is on [Language handling](/configuration/language/).

   ![The KnowledgeBase Language dropdown open on the start of the alphabetical list: Abkhazian, Afar, Afrikaans, Akan](/img/neural-config/knowledgebase-connection--options-knowledgebase-language.png)

3. Optionally, type a note in **Notes** — a free-text box, for example why this store was chosen or when its credentials were last rotated.

## Fill in the store's connection and field-mapping settings

What comes next depends on the type you picked.

- **`NeuralSeek KB` or `No KnowledgeBase`** — the section holds only the three shared fields. Go to [Save the configuration](#save-the-configuration). With `NeuralSeek KB`, add your documents on the KnowledgeBase screen ([Loading documents](/knowledge/load/)).
- **`Virtual KB`** — the section asks for the mAIstro agent that acts as the store. See [Virtual KB](/seek/virtual-kb/).
- **Any external store** — a block of store-specific fields appears under **Notes**. Fill it in:

1. Enter where the store is and how to reach it. For `Pinecone`, that is **Pinecone.io Index Name**, **Pinecone.io Index Namespace** and **Pinecone.io API Key**; other stores ask for their own endpoint, credentials and index or collection.
2. Map the store's fields. Most store forms then ask which source field holds the passage text (**Curation Data Field**), the link to the source (**Link Field**) and the title (**Document Name Field**). These decide what NeuralSeek reads as the passage and what it shows as the source of an answer.
3. Review the remaining options of the store's form, such as **Attribute sources inside LLM Context by Document Name** on `Pinecone`. What each one does is on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

As an example, this is the form with **KnowledgeBase Type** set to `Pinecone`, before any connection details are entered:

![The KnowledgeBase Connection section with KnowledgeBase Type set to Pinecone: empty Pinecone.io Index Name, Pinecone.io Index Namespace and Pinecone.io API Key boxes, then the Curation Data Field, Link Field, Document Name Field and Attribute sources inside LLM Context by Document Name dropdowns, with Propose Changes and Save in the dialog footer](/img/neural-config/knowledgebase-connection@kb-pinecone-panel.png)

Two stores have their own walkthroughs: [Pinecone setup](/knowledge/pinecone/) and [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/). With `ElasticSearch` or `watsonx Discovery`, the dialog also adds a **Hybrid & Vector Search Settings** section after KnowledgeBase Tuning, where you choose how the store is queried — see [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/). The fields every store asks for are compared on [Supported knowledge bases](/knowledge/supported-knowledgebases/).

## Save the configuration

Nothing you pick or type in the dialog applies until you save it.

1. Select **Save** in the dialog footer, or **Propose Changes** if the change should be reviewed before it goes live.
2. Complete the save as described on [Using the Neural Config page](/configuration/neural-config/using-this-page/), which covers naming the new version and the difference between the two buttons.

If you close the dialog without saving, the configuration stays as it was.

## Verify the connection with a Seek

1. Open the Seek tab ([Seek overview](/seek/overview/)).
2. Ask a question whose answer you know is in your store.
3. Check that the answer cites a document from your store and that its KB score is above zero.

For example, with a knowledge base that holds the NeuralSeek documentation, the question `What is semantic scoring in NeuralSeek?` comes back with a KB score of 100 and a Semantic score of 25.

The KB score of 100 is the part that confirms the connection: the store returned documents that match the question. The Semantic value measures how closely the generated answer follows those documents, so a low one is a question for [Semantic model tuning](/configuration/semantic-model/), not a sign that the store is disconnected.

If the answer cites nothing from your store and the KB score is 0, reopen **KnowledgeBase Connection** and check the connection details and the field mappings against the store itself. If documents come back but the wrong passages reach the answer, look at [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

## FAQ

### Which knowledge bases can I connect?

Any of the sixteen values in **KnowledgeBase Type**, from `Watson Discovery` and `ElasticSearch` to `Pinecone`, `Milvus`, `Postgres` and `ChromaDB`. What each one asks for is compared on [Supported knowledge bases](/knowledge/supported-knowledgebases/).

### Do I need an external store?

No. Pick `NeuralSeek KB` and NeuralSeek hosts the store for you: the section asks for no connection details, and you load documents on the KnowledgeBase screen. See [Managed KnowledgeBase](/knowledge/managed-knowledgebase/overview/).

### Does KnowledgeBase Language translate my documents?

No. It declares the language the documents are already in. How NeuralSeek handles a question in a different language is on [Language handling](/configuration/language/).

## Related

- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) — every field, store by store
- [Supported knowledge bases](/knowledge/supported-knowledgebases/) — the stores compared
- [Pinecone setup](/knowledge/pinecone/)
- [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/) — saving and versions
- [Loading documents](/knowledge/load/)
