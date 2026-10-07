---
title: "Managed KnowledgeBase overview"
description: "The managed KnowledgeBase is the knowledge base NeuralSeek hosts for you: set KnowledgeBase Type to NeuralSeek KB, load documents with the Data Loader, and review them in the Knowledgebase Manager."
---

The managed KnowledgeBase is a knowledge base that NeuralSeek hosts inside your instance. You switch it on by setting **KnowledgeBase Type** to `NeuralSeek KB`, fill it with the documents you load, and see its contents on the **KnowledgeBase** screen. Use it when you want [Seek](/seek/overview/) to answer from your content without running and connecting a search index of your own.

![The Knowledgebase Manager, with the Document Count badge, the Go to Document Loader link, the search bar and the Documents table](/img/knowledge/default.png)

## How the managed KnowledgeBase works

Three parts work together: one setting in Neural Config tells NeuralSeek to search its own store, a loader puts documents into that store, and the Knowledgebase Manager (see [Document Manager](/knowledge/document-manager/)) shows what is in it. A retrieval setting in KnowledgeBase Tuning applies only to this store.

### Turning it on: KnowledgeBase Type

The store Seek searches is chosen in [Neural Config](/configuration/neural-config/): open the **Default Config** node, and in **Edit Configuration** expand [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/). Set **KnowledgeBase Type** to `NeuralSeek KB`, then save the configuration (saving and proposing changes are covered in [Using the Neural Config page](/configuration/neural-config/using-this-page/)).

![KnowledgeBase Connection with KnowledgeBase Type set to NeuralSeek KB, the KnowledgeBase Language list and the Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

With `NeuralSeek KB` selected, the section holds only **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**. There is no endpoint, API key, index name or field mapping to fill in, because the store is part of NeuralSeek; the external types ask for those details instead. The SharePoint connector describes the same destination in its own words: "**NeuralSeek KB** (default) feeds your managed Knowledge Base directly — the same destination used by the Data Loader."

**KnowledgeBase Language** is the language your content is written in. It describes the documents; it does not choose the language answers are given in, which is set under [Language](/configuration/language/). The full list of languages is on the KnowledgeBase Connection page.

### What it holds: the Knowledgebase Manager

Select **KnowledgeBase** in the top navigation to open the **Knowledgebase Manager**, whose **Document Count** badge is the quickest check that a load reached the store; how to read the **Documents** table and search, page through and delete records is covered in [Document Manager](/knowledge/document-manager/).

### How documents get in

Under the **Document Count**, the Knowledgebase Manager asks "Need to add more content to your knowledgebase?" and links to **Go to Document Loader**. That link opens the NeuralSeek Data Loader, where you drop files, choose a **Loader mAIstro Template** — a [mAIstro](/maistro/overview/) template that reads each file and writes it to its destination — and select **Load**. The example template `ex_neuralseek_KB_upload` is the one that fills the managed KnowledgeBase: it reads each file and writes it with the `nsKbAddDocument` node, the same node the SharePoint connector uses for its NeuralSeek target. The steps are in [Loading documents](/knowledge/load/).

The [SharePoint connector](/integrations/sharepoint-sync/) can also index site content straight into the managed KnowledgeBase; its sync templates use the `nsKbAddDocument` node for the NeuralSeek target. For every way of getting content in, see [Getting documents in](/knowledge/ingestion-overview/).

### Retrieval tuning that only applies to the managed KnowledgeBase

When **KnowledgeBase Type** is `NeuralSeek KB`, [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) shows a slider labelled **Expansion Window. How many chunks to grab before and after the target chunk.** With any other type, the same place holds **Snippet size** instead.

![KnowledgeBase Tuning with the Expansion Window slider, 1 to 10, in the right column under Max Documents per Seek](/img/neural-config/knowledgebase-tuning--document-score-range.png)

The slider runs from `1` to `10`. When a chunk of a document matches the question, NeuralSeek also takes that many neighbouring chunks before and after it. If answers miss context that sits just around the matching passage, try a wider window.

## When to use the managed KnowledgeBase

**KnowledgeBase Type** offers 16 values. `NeuralSeek KB` is the managed KnowledgeBase; most of the others connect a store you run.

![The open KnowledgeBase Type list, starting with Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch and ElasticSearch](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

- Choose `NeuralSeek KB` when your content is files or pages you can load yourself and you do not want to stand up, secure and map an index. You load documents through the Data Loader or the SharePoint connector and manage them in the Knowledgebase Manager.
- Choose an index you run — `Watson Discovery`, `Watson Discovery (CP4D)`, `Elastic AppSearch`, `ElasticSearch`, `watsonx Discovery`, `OpenSearch`, `Kendra`, `Bedrock`, `IBM CAS`, `Pinecone`, `Milvus`, `Postgres` or `ChromaDB` — when your content is already indexed there, is kept current by another pipeline, or must stay in a cluster you control. Each of these asks for its own connection details and field mapping. Compare them in [Supported knowledge bases](/knowledge/supported-knowledgebases/) and set one up with [Connect a knowledge base](/knowledge/connect-a-kb/).
- Choose `Virtual KB` when retrieval should be done by a mAIstro agent instead of a store; see [Virtual KB](/seek/virtual-kb/).
- Choose `No KnowledgeBase` when Seek should search no store at all.

:::note[Under review]
This page says every external type asks for its own field mapping, while Connect a knowledge base says most store forms do. Which external types ask for a field mapping is being checked.
:::

## FAQ

**Do I need my own Elasticsearch or vector database to use NeuralSeek?**
No. Set **KnowledgeBase Type** to `NeuralSeek KB`; the KnowledgeBase Connection section then asks for no connection details, and you add content with the Data Loader.

**Where do I see what is in the managed KnowledgeBase?**
Select **KnowledgeBase** in the top navigation. The Knowledgebase Manager shows the **Document Count** and the **Documents** table; Document Manager explains how to search and delete records.

**Why does the same page appear several times in the Documents table?**

<!-- UNCONFIRMED: the repeated rows are parts of one source document — inferred from the shared Record ID prefix and Document Title, not stated on screen -->

Each row is a record, not a whole source. Rows that share a Record ID prefix and a Document Title, and differ only in the `::0`, `::1` … suffix, are numbered parts of the same source.

**Does KnowledgeBase Language translate my answers?**
No. It describes the language of the content in the knowledge base. The language answers are given in is set under Language.

## Related

- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)
- [Document Manager](/knowledge/document-manager/)
- [Loading documents](/knowledge/load/)
- [Getting documents in](/knowledge/ingestion-overview/)
- [Supported knowledge bases](/knowledge/supported-knowledgebases/)
- [Connect a knowledge base](/knowledge/connect-a-kb/)
