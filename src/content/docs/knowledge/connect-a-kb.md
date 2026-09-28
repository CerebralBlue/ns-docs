---
title: "Connect a knowledge base"
description: "Step-by-step walkthrough for admins connecting a knowledge base to NeuralSeek: open KnowledgeBase Connection in Neural Config, pick the KnowledgeBase Type, fill in the store's fields, set the KnowledgeBase Language, save, and confirm with a Seek."
---

## What is it

Connecting a knowledge base means telling NeuralSeek which store it searches when it answers a question. That happens in one place: the **KnowledgeBase Connection** section, the first accordion of the **Configuration: Default Config** dialog, which you reach from the **Default Config** node in Neural Config.

This page is the task walkthrough: reach the section, choose the store, fill in its connection details, set the language, save, and check that answers come back from it. What every field means for every store type is on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/); which types exist and what each supports is on [Supported knowledge bases](/knowledge/supported-knowledgebases/).

## Why it matters

Until a store is connected, Seek has nothing to ground an answer in. Retrieval, the sources listed under an answer and the KB score on every answer all depend on this section pointing at the right store, with the right credentials, in the right language.

This is not the page for loading documents into a store (see [Load documents](/knowledge/load/)). If you want NeuralSeek to host the store rather than connect an external one, select `NeuralSeek KB` here; see [Managed KnowledgeBase](/knowledge/managed-knowledgebase/overview/).

## When to use it

- You are setting up NeuralSeek and it is not yet pointed at your content.
- You are moving from one store to another — from `NeuralSeek KB` to `Pinecone` or `ElasticSearch`, for example.
- Your credentials or index changed and the connection details need updating.
- Your content is not in English and you need to declare its language.
- You want to leave a note on the connection for the next administrator who opens it.

## How it works

![The Configuration: Default Config dialog listing its accordions — KnowledgeBase Connection first, then KnowledgeBase Tuning, LLM Details and the rest — with Propose Changes and Save in the footer](/img/neural-config/edit-configuration-edit.png)

### 1. Open the KnowledgeBase Connection section

1. Open **Neural Config** from the top navigation. It draws your routing tree as a diagram; [Configuration overview](/configuration/overview/) explains how to read it.
1. Click the **Default Config** node (top left of the tree, subtitle `Answer Generation`). A small **Default Configuration** dialog opens with one dropdown, **Action to take on match**, and two footer buttons, **Edit Configuration** and **Save**. Leave the dropdown as it is; this task does not change it.

   ![The Default Configuration dialog: the Action to take on match dropdown reading Answer Generation, with Edit Configuration and Save in the footer](/img/neural-config/default-config-answer-generation-panel.png)

1. Click **Edit Configuration**. The **Configuration: Default Config** dialog opens with fourteen section headers, **KnowledgeBase Connection** first. Expand it.

The path, in short: Neural Config → **Default Config** / `Answer Generation` node → **Edit Configuration** → **KnowledgeBase Connection**.

The other sections of the dialog (KnowledgeBase Tuning, LLM Details and the rest) are not part of this task; how the dialog as a whole works is on [Using the Neural Config page](/configuration/neural-config/using-this-page/). One extra header, **Hybrid & Vector Search Settings**, appears after KnowledgeBase Tuning only when the type is `ElasticSearch` or `watsonx Discovery`; it is covered on [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/).

### 2. Choose the KnowledgeBase Type

**KnowledgeBase Type** is the first decision, and it drives the rest of the section: the value you pick decides which connection fields appear under it. Next to it sits **KnowledgeBase Language**, and under both is the **Notes** box.

![The top of the KnowledgeBase Connection section: the KnowledgeBase Type and KnowledgeBase Language dropdowns side by side above the Notes box](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

The value you find selected is whatever your instance was last saved with — it is not a product default. The dropdown lists sixteen types, in this order (the menu scrolls, so the picture shows only the first few):

![The KnowledgeBase Type dropdown open, showing Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch and ElasticSearch at the top of a scrolling list](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

| Option                    | What selecting it shows in the section                | Where it is covered                                                                |
| ------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `Watson Discovery`        | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |
| `Watson Discovery (CP4D)` | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |
| `Elastic AppSearch`       | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |
| `ElasticSearch`           | Its own connection fields                             | [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/)               |
| `watsonx Discovery`       | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |
| `OpenSearch`              | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |
| `Kendra`                  | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |
| `Bedrock`                 | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |
| `IBM CAS`                 | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |
| `Pinecone`                | Index, namespace, API key and field mappings (step 3) | [Pinecone](/knowledge/pinecone/)                                                   |
| `Milvus`                  | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |
| `Postgres`                | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |
| `Virtual KB`              | One dropdown, **mAIstro Virtual KB agent**            | [Virtual KB](/seek/virtual-kb/)                                                    |
| `NeuralSeek KB`           | Nothing more — only Type, Language and Notes          | [Managed KnowledgeBase](/knowledge/managed-knowledgebase/overview/)                |
| `No KnowledgeBase`        | Nothing more — only Type, Language and Notes          | [Supported knowledge bases](/knowledge/supported-knowledgebases/)                  |
| `ChromaDB`                | Its own connection fields                             | [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) |

With `NeuralSeek KB` the section asks for nothing more: no endpoint, key or index name. `No KnowledgeBase` looks the same — only **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes** remain, and no store is connected at all:

![KnowledgeBase Connection with KnowledgeBase Type set to No KnowledgeBase: only the KnowledgeBase Type and KnowledgeBase Language dropdowns and the Notes box remain](/img/neural-config/knowledgebase-connection@kb-type-no-knowledgebase--knowledgebase-type.png)

Every external store adds its own set of fields under the selector, which is the next step.

### 3. Fill in the store's fields — Pinecone as the example

Switching **KnowledgeBase Type** from `NeuralSeek KB` to `Pinecone` shows what a type switch does: the three shared fields stay at the top, and a block of Pinecone-specific fields appears under them.

![The KnowledgeBase Connection section with KnowledgeBase Type set to Pinecone: empty Pinecone.io Index Name, Pinecone.io Index Namespace and Pinecone.io API Key boxes, then the Curation Data Field, Link Field, Document Name Field and Attribute sources inside LLM Context by Document Name dropdowns](/img/neural-config/knowledgebase-connection@kb-pinecone-panel.png)

For Pinecone the section asks for:

- **Pinecone.io Index Name**, **Pinecone.io Index Namespace** and **Pinecone.io API Key** — where the index is and how to reach it. The three boxes are empty until you fill them in.
<!-- UNCONFIRMED: Curation Data Field / Link Field / Document Name Field map the record keys holding the passage text, the source URL and the document title — from the Pinecone page and the old Pinecone docs; the screen shows only the labels and the values text, link, title -->

- **Curation Data Field**, **Link Field** and **Document Name Field** — which metadata key in your index records holds the passage text, the source link and the document name. In the screenshot they read `text`, `link` and `title`.
- **Attribute sources inside LLM Context by Document Name** — a dropdown that reads `Enabled` in the screenshot.
- **Filter Field** and **Static Default Filter Value (when no runtime filter is passed)** — the metadata field results can be filtered on, and the value used when a request passes no filter of its own.
- **Re-Sort values list.** with its **Re-Sort Field** — "Enter a prioritized list of values you want to re-rank above other results, regardless of KB score."
- **Enable Advanced Schema** — a button at the bottom of the block.

The field-mapping dropdowns (**Curation Data Field**, **Link Field**, **Document Name Field** and the rest) follow the connection fields on most external types. What each of these does, and how to prepare the index, is on [Pinecone](/knowledge/pinecone/). Other external types show a different set of fields; [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/) documents them type by type. Nothing in the section marks a field as required, so check the store's own page for what it cannot work without.

### 4. Set the language and an optional note

**KnowledgeBase Language** declares the language your stored content is written in. It offers the full language list, alphabetical and scrolling:

![The KnowledgeBase Language dropdown open, showing the start of the alphabetical language list with a scrollbar](/img/neural-config/knowledgebase-connection--options-knowledgebase-language.png)

This setting does not translate anything by itself. It is the reference point that **Cross Language** in [Platform Preferences](/configuration/neural-config/platform-preferences/) compares against; that control's help text reads "Translate into the KB language when the KB language is different than the Seek Language. Semantic Scoring is not possible on Cross-language response generation, so it will be automatically disabled." Set the KB language to match your documents, and decide about translation on [Language handling](/configuration/language/).

**Notes** is the multi-line box under the two dropdowns. It is there for every type, is empty until you type in it, and has no help text.

<!-- UNCONFIRMED: Notes is a free-text note stored with the configuration for other administrators to read — inferred from its position in the section; nothing on screen shows where a saved note is displayed afterwards, and the Change Logs screen has no Notes column (backlog 646435c926, 7dcf6ae5cb) -->

Use it for a short operator note about this connection, such as why the type was chosen or when the credentials were last rotated. Where a saved note is shown afterwards is not documented yet.

### 5. Save, then check with a Seek

<!-- UNCONFIRMED: Propose Changes records a proposal for review instead of applying at once — carried from Using the Neural Config page, where it is also unconfirmed; the button has not been observed in use -->

The dialog footer has two buttons, **Propose Changes** and **Save**. Picking a type or typing in a field changes nothing until you commit the dialog: **Save** applies the configuration, and **Propose Changes** is for a change that should be reviewed before it goes live. Both are described on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

![The Configuration: Default Config dialog with KnowledgeBase Type set to Pinecone and the Propose Changes and Save buttons in the footer](/img/neural-config/knowledgebase-connection@kb-pinecone.png)

Whether **Save** checks the connection details against the store is not shown on screen, and the KnowledgeBase Connection section has no "test connection" button for any **KnowledgeBase Type** (the **Test** buttons elsewhere in the dialog belong to the LLM cards in LLM Details). The check is a real question instead:

- **Seek tab.** Ask a question whose answer you know is in the store and confirm that the answer lists a document from it and carries a KB score above zero — see [Seek overview](/seek/overview/).
- **KnowledgeBase tab.** For `NeuralSeek KB`, open the document table and confirm your documents are listed — see [Document manager](/knowledge/document-manager/).

For example, with a knowledge base that holds the NeuralSeek documentation, the question `What is semantic scoring in NeuralSeek?` sent through an MCP client's `seek` tool returns the answer below, followed by two sources. This is the text format of that tool, not the JSON of the REST `/seek` endpoint, whose fields are named differently (`KBscore`, `semanticScore`).

```text
## Answer (confidence: 23/100)

Semantic scoring in NeuralSeek is the **semantic match score** that measures how well an answer aligns with the original documentation, indicating the confidence NeuralSeek has that the response reflects the source material.

*KB score: 100 | Semantic: 23*
```

`KB score: 100` is the part that confirms the connection: a KB score above zero means the store returned documents that match the question. The semantic score (`Semantic: 23`) measures how closely the generated wording follows those documents, so a low value there is a question for [Semantic model tuning](/configuration/semantic-model/), not a sign that the store is disconnected.

If the answer cites nothing from your store and the KB score is `0`, reopen the section and check the connection details, the index name and the field mappings against the store itself.

## FAQ

### Where do I connect my knowledge base?

In Neural Config: click the **Default Config** node, then **Edit Configuration** in the **Default Configuration** dialog. **KnowledgeBase Connection** is the first section of the dialog that opens.

### Which knowledge base types can I pick?

**KnowledgeBase Type** offers sixteen values: `Watson Discovery`, `Watson Discovery (CP4D)`, `Elastic AppSearch`, `ElasticSearch`, `watsonx Discovery`, `OpenSearch`, `Kendra`, `Bedrock`, `IBM CAS`, `Pinecone`, `Milvus`, `Postgres`, `Virtual KB`, `NeuralSeek KB`, `No KnowledgeBase` and `ChromaDB`. Which features each one supports is on [Supported knowledge bases](/knowledge/supported-knowledgebases/).

### Why do I see only three fields in KnowledgeBase Connection?

Because the type is `NeuralSeek KB` or `No KnowledgeBase`. Both show only **KnowledgeBase Type**, **KnowledgeBase Language** and **Notes**. External types such as `Pinecone` add their own fields — see [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

### How do I check that the connection works?

The section has no test button for any store type. Save the configuration, then ask a question on the Seek tab and check that the answer cites a document from your store and carries a KB score above zero.

### What is the Notes box for?

It is a free-text box for a note about the connection, such as why a type was chosen. Where a saved note is shown afterwards is not documented yet.

### Does KnowledgeBase Language translate my documents?

No. It declares the language the documents are already in. Translating a question into the store's language at query time is **Cross Language** in Platform Preferences — see [Language handling](/configuration/language/).
