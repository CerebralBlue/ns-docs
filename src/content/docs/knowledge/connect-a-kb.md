---
title: "Connect a knowledge base"
description: "Step-by-step walkthrough for admins connecting a knowledge base to NeuralSeek: open the KnowledgeBase Connection section of Neural Config, pick the KnowledgeBase Type, set the KnowledgeBase Language, save, and confirm with a Seek."
---

## What is it

Connecting a knowledge base means telling NeuralSeek which store it should search when it answers a question. That happens in one place: the **KnowledgeBase Connection** section, the first accordion of the configuration dialog that opens from the **Default Config / Answer Generation** node in Neural Config. The dialog's title bar reads **Configuration: Default Config**.

This page is the task walkthrough — reach the section, choose the store, set the language, save, and check that answers come back from it. The meaning of every field for every store type lives on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/); which types support which features is on [Supported knowledge bases](/knowledge/supported-knowledgebases/).

## Why it matters

Until a store is connected, Seek has nothing to ground an answer in. Everything downstream — retrieval, attribution, the KB score on an answer — depends on this section pointing at the right store in the right language.

This is not the page for loading documents (that is the KnowledgeBase tab, see [Load documents](/knowledge/load/)) or for creating API keys and integrating a chatbot (see [API keys](/configuration/administration/api-keys/)). If you want NeuralSeek to host the store for you rather than connect an external one, read [Managed KnowledgeBase](/knowledge/managed-knowledgebase/overview/) first and come back here to select `NeuralSeek KB`.

## When to use it

- You are setting up a new NeuralSeek instance and it has no store yet.
- You are moving from one store to another — from the built-in `NeuralSeek KB` to Elasticsearch or Pinecone, for example.
- Your content is not in English and you need to declare its language so that cross-language handling can work.
- You want to leave a note with the configuration for the next administrator who opens it.

## How it works

![The Configuration: Default Config dialog with the KnowledgeBase Connection accordion open, showing KnowledgeBase Type, KnowledgeBase Language and Notes, and the Propose Changes and Save footer](/img/neural-config/knowledgebase-connection.png)

### Open the KnowledgeBase Connection section

Three clicks reach the section:

1. Open **Neural Config** from the top navigation. It draws the instance's routing tree as a diagram — see [Configuration overview](/configuration/overview/) for how the tree is read.
1. Click the **Default Config / Answer Generation** node. A panel for that node opens, with an **Edit Configuration** button under its settings.
1. Click **Edit Configuration**. The **Configuration: Default Config** dialog opens with **KnowledgeBase Connection** as its first accordion, already expanded.

![The KnowledgeBase Connection accordion body: the KnowledgeBase Type dropdown reading NeuralSeek KB, the KnowledgeBase Language dropdown reading English, and the empty Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

The section holds three fields on the playground instance: **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**. Other accordions in the same dialog (KnowledgeBase Tuning, LLM Details and the rest) are not part of this task; the dialog itself — including how it is saved — is described on [Using the Edit Configuration dialog](/configuration/neural-config/using-this-page/).

### Choose the store

**KnowledgeBase Type** is the first decision and it drives everything below it: the value you pick decides which connection fields the section shows next. On the playground it reads `NeuralSeek KB`.

![The KnowledgeBase Type dropdown open, showing the first six of its fifteen options — Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch, ElasticSearch, watsonx Discovery, OpenSearch — with a scrollbar for the rest](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

The dropdown lists fifteen types, in this order (the menu scrolls, so the picture shows only the first six):

- `Watson Discovery`
- `Watson Discovery (CP4D)`
- `Elastic AppSearch`
- `ElasticSearch`
- `watsonx Discovery`
- `OpenSearch`
- `Kendra`
- `Bedrock`
- `Pinecone`
- `Milvus`
- `Postgres`
- `Virtual KB`
- `NeuralSeek KB`
- `No KnowledgeBase`
- `ChromaDB`

With `NeuralSeek KB` selected there is nothing else to fill in: NeuralSeek hosts the store, so no endpoint, key or index name is asked for, and the section shows only the three fields above. Any other type adds its own set of connection fields (endpoint, credentials, index, field mappings) under the selector. Those field sets are documented per type on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/), and the feature-by-type comparison is on [Supported knowledge bases](/knowledge/supported-knowledgebases/). Setup guides exist for some stores: [Pinecone](/knowledge/pinecone/), [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/), [Virtual KB](/seek/virtual-kb/) and [Managed KnowledgeBase](/knowledge/managed-knowledgebase/overview/) for `NeuralSeek KB`.

### Set the language and add notes

**KnowledgeBase Language** declares the language the stored content is written in. On the playground it reads `English`. The dropdown offers the same language list you meet elsewhere in the console (`Abkhazian` through `Zulu`, including regional variants such as `Chinese (Simplified)` and `Chinese (Traditional)`); the [Language handling](/configuration/language/) page covers the list and how the pieces fit together.

![The KnowledgeBase Language dropdown open, showing the start of the alphabetical language list — Abkhazian, Afar, Afrikaans, Akan, Albanian, Amharic — with a scrollbar](/img/neural-config/knowledgebase-connection--options-knowledgebase-language.png)

This setting does not translate anything by itself. It is the reference point that **Cross Language** in Platform Preferences compares against; that control's own help text describes it as "Translate into the KB language when the KB language is different than the Seek Language", and notes that semantic scoring is disabled for cross-language answers. Set the KB language to match the documents, and decide about translation on [Language handling](/configuration/language/).

**Notes** is the multi-line box under the two dropdowns. It is empty on the playground and has no help text.

<!-- UNCONFIRMED: Notes is a free-text note stored with the configuration for other administrators to read — inferred from the label; nothing on screen shows where it is displayed afterwards -->

Use it for what the label suggests: a short operator note about this connection, such as why the type was chosen or when it was last changed.

### Save and check the connection

The dialog footer has two buttons: **Propose Changes** and **Save**. What each one does, and what happens after you click it, is described on [Using the Edit Configuration dialog](/configuration/neural-config/using-this-page/).

There is no "test connection" button in the KnowledgeBase Connection section for `NeuralSeek KB`. The **Test** buttons elsewhere in the dialog belong to the LLM cards in LLM Details, not to the store. The check is a real question:

- **Seek tab.** Ask a question whose answer you know is in the store and confirm the answer cites a document from it — see [Seek overview](/seek/overview/).
- **KnowledgeBase tab.** Open the document table and confirm documents are listed — see [Document manager](/knowledge/document-manager/).

On the playground, asking `What is NeuralSeek?` through the MCP `seek` tool came back with an answer and two sources from the connected `NeuralSeek KB`, each carrying a `url`, a `score` and an `excerpt`. The first source, via the MCP:

```json
{"url": "https://documentation.neuralseek.com/ui/seek/", "score": 100, "excerpt": "Dynamic Filters (././guides/data/dynamic_filters) KnowledgeBase Tuning (././guides/data/tuning_guide) Virtual KnowledgeBase (././guides/data/virtual_kb) Training Virtual Agents (././guides/integration…"}
```

That is the MCP tool's response shape; the REST `/seek` endpoint returns `url` and `document` fields instead and no `sources` array. Either way, a source pointing at one of your documents is the confirmation that the connection works.

## FAQ

### Where do I connect my knowledge base?

In Neural Config: click the **Default Config / Answer Generation** node, then **Edit Configuration**, and the **KnowledgeBase Connection** accordion is the first section of the dialog — it opens expanded.

### Which knowledge base types can I pick?

**KnowledgeBase Type** offers fifteen values: `Watson Discovery`, `Watson Discovery (CP4D)`, `Elastic AppSearch`, `ElasticSearch`, `watsonx Discovery`, `OpenSearch`, `Kendra`, `Bedrock`, `Pinecone`, `Milvus`, `Postgres`, `Virtual KB`, `NeuralSeek KB`, `No KnowledgeBase` and `ChromaDB`. Which features each one supports is on [Supported knowledge bases](/knowledge/supported-knowledgebases/).

### Why do I see only three fields in KnowledgeBase Connection?

Because the type is `NeuralSeek KB`: NeuralSeek hosts that store, so there is no endpoint or credential to enter and the section shows only **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**. Other types add their own fields — see [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

### Is there a "test connection" button?

Not for `NeuralSeek KB` on the captured screen. Save the configuration, then ask a question on the Seek tab and check that the answer cites a document from your store. Whether other store types show a test control has not been captured.

### Does KnowledgeBase Language translate my documents?

No. It declares the language the documents are already in. Translating a question into the store's language at query time is **Cross Language** in Platform Preferences — see [Language handling](/configuration/language/).
