---
title: "Getting documents in"
description: "Content reaches the knowledge base NeuralSeek answers from in several ways — among them the Data Loader, SharePoint Online sync, a mAIstro agent of your own, or an index you already run and connect — and this page helps you choose."
---

NeuralSeek answers from a knowledge base, and there are two ways to give it one. You can load content into the knowledge base NeuralSeek manages for you: the files you upload or sync are stored by NeuralSeek and listed in the [Knowledgebase Manager](/knowledge/document-manager/). Or you can connect an index you already run — Elasticsearch, a vector store, a search service — and keep filling it with your own tools while NeuralSeek queries it. The loading paths are not tied to the managed knowledge base: the Data Loader and the SharePoint connector can also write into an index you run. This page names each path, says when it fits, and links to the page that does the work.

## How documents reach the knowledge base

The managed knowledge base is under **KnowledgeBase** in the top navigation. Its **Knowledgebase Manager** page lists what has been loaded, and the line "Need to add more content to your knowledgebase?" ends in **Go to Document Loader**, the in-console way to add files.

![The Knowledgebase Manager, with the Document Count, the Go to Document Loader link and the Documents table](/img/knowledge/default.png)

### Upload files with the Data Loader

**Go to Document Loader** opens the **NeuralSeek Data Loader**, which hands the files you drop on it to the [mAIstro](/maistro/overview/) template you pick in **Loader mAIstro Template**, so one **Load** can fill the NeuralSeek knowledge base or another store such as an Elasticsearch index; the steps and the example templates are on [Loading documents](/knowledge/load/).

![The NeuralSeek Data Loader page: the instructions panel, the drop zone, Loader mAIstro Template and Load](/img/knowledge/go-to-document-loader--neuralseek-data-loader.png)

### Sync SharePoint Online in the background

When the content lives in SharePoint Online and keeps changing, uploading it by hand goes stale. The SharePoint Online Background Connector — the **SharePoint** item under **API's & Integration** — indexes SharePoint documents, pages and lists "directly into the NeuralSeek managed Knowledge Base — or into an Elasticsearch index", and "runs in the background and keeps the KB up to date incrementally".

![The SharePoint Online Background Connector with its four steps](/img/admin-tools/sharepoint.png)

You set it up in four steps — **1 · Connection & Authentication**, **2 · Site Collections**, **3 · Sync Target** and **4 · Schedule & Controls** — on [SharePoint sync](/integrations/sharepoint-sync/).

### Load from your own mAIstro agent

Because the Data Loader runs mAIstro templates, an agent of your own can load content too — as one step in a larger automation, or with your own cleansing before the text is stored; the two-node pattern is on [Build your own loader template](/knowledge/load/#build-your-own-loader-template), and the nodes that write to each store are on [mAIstro knowledge base nodes](/maistro/ntl/integrations/knowledgebases/).

### Connect an index you already have

If your documents are already in a search index or vector store that you fill yourself, nothing has to go through NeuralSeek. In [Neural Config](/configuration/neural-config/), open the **Default Config** node, and in **Edit Configuration** expand [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/). Set **KnowledgeBase Type** to the store you run; NeuralSeek then retrieves from it at question time.

![KnowledgeBase Type and KnowledgeBase Language in the KnowledgeBase Connection section of Neural Config](/img/neural-config/knowledgebase-connection--knowledgebase-type.png)

**NeuralSeek KB** is the option for the knowledge base NeuralSeek manages, the one the loading paths above fill; the SharePoint connector describes it as the type that "feeds your managed Knowledge Base directly — the same destination used by the Data Loader." Most of the other types connect a store you run and fill yourself. The full list of types is on [Supported knowledge bases](/knowledge/supported-knowledgebases/), and the steps on [Connect a knowledge base](/knowledge/connect-a-kb/).

### Check what was loaded

For content in the NeuralSeek knowledge base, open **KnowledgeBase**: the **Knowledgebase Manager** shows the **Document Count** and lists each record in the **Documents** table. For an index you connected, ask a question in [Seek](/seek/overview/) instead — [Connect a knowledge base](/knowledge/connect-a-kb/) ends with that check.

## When to use each path

- A one-off set of files — upload them with the Data Loader.
- Content in SharePoint Online that changes — set up the SharePoint connector, so new and edited pages reach the knowledge base without anyone uploading them.
- An index or vector store you already run and fill — set **KnowledgeBase Type** to it and connect it.
- Loading as part of your own automation — build a mAIstro agent; the loader templates are agents, so you can start from one of the examples.

## FAQ

### Do I need to upload anything if my documents are already in Elasticsearch or another vector store?

No. Set **KnowledgeBase Type** to that store and connect it ([Connect a knowledge base](/knowledge/connect-a-kb/)). NeuralSeek queries your index directly.

### How do I keep SharePoint content up to date?

Use the SharePoint Online Background Connector. It runs on a schedule in the background and updates the knowledge base incrementally ([SharePoint sync](/integrations/sharepoint-sync/)).

### Can the Data Loader write somewhere other than the NeuralSeek knowledge base?

Yes. Where the files go depends on the template you pick in **Loader mAIstro Template**. The `ex_ElasticSearch_Loader` example writes to an Elasticsearch index; a template of your own can write to any store a mAIstro node can reach.

### Where do I check what has been loaded?

Under **KnowledgeBase**, on the Knowledgebase Manager page ([Knowledgebase Manager](/knowledge/document-manager/)).

## Related

- [Loading documents](/knowledge/load/)
- [SharePoint sync](/integrations/sharepoint-sync/)
- [Connect a knowledge base](/knowledge/connect-a-kb/)
- [Supported knowledge bases](/knowledge/supported-knowledgebases/)
- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
- [Knowledgebase Manager](/knowledge/document-manager/)
- [The managed knowledge base](/knowledge/managed-knowledgebase/overview/)
- [mAIstro knowledge base nodes](/maistro/ntl/integrations/knowledgebases/)
