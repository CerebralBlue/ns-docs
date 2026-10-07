---
title: "Loading documents"
description: "The Data Loader hands each file you drop on it to a mAIstro loader template, which reads the file and writes it to the NeuralSeek knowledge base, an Elasticsearch index or any other store a mAIstro node can reach."
---

The Data Loader is the console page for loading files by hand. It does not store files itself: it hands each file to a [mAIstro](/maistro/overview/) template, and that template decides how the file is read, how it is processed and where the result is written. The same page can therefore fill the [NeuralSeek knowledge base](/knowledge/managed-knowledgebase/overview/), an Elasticsearch index, a database or a REST service — what changes is the template you pick. Use it for a set of files you want to load once; for content that keeps changing, or for loading as part of a larger automation, [Getting documents in](/knowledge/ingestion-overview/) compares the other paths.

## Before you begin

- **The Load permission.** Loading changes the content an instance answers from. The **Load** permission covers it — "Load and manage knowledge content." Permissions are granted on [Users and permissions](/configuration/administration/users-and-permissions/).
- **A loader template.** A loader template is a saved mAIstro template that has a Local Document (`doc`) node set to NeuralSeek Document Loader (`nsDocLoader`); that node is how the dropped file enters the template. The example templates listed under [Choose a loader template](#choose-a-loader-template) already read the file through NeuralSeek Document Loader, so you can load your first files without building one.

## Open the Data Loader

1. In the top navigation, select **KnowledgeBase**. The [Knowledgebase Manager](/knowledge/document-manager/) opens.
2. On the line "Need to add more content to your knowledgebase?", select **Go to Document Loader**.

The **NeuralSeek Data Loader** page opens. While it is open, the top navigation also shows a **Data Loader** item, which brings you back to it.

![The Data Loader page: the instructions panel on the left, the NeuralSeek Data Loader panel with the drop zone, Loader mAIstro Template and Load, and the Explore Inspector icon at the top right](/img/data-loader/default.png)

The bug icon at the top right is **Explore Inspector**, covered under [Verify the load](#verify-the-load).

## Load files

1. Drop your files on **Drag and drop files here or click to upload**, or select it to choose the files.
2. In **Loader mAIstro Template**, select the template that should process them. The template decides where the files end up — see [Choose a loader template](#choose-a-loader-template).
3. Select **Load**. **Load** is unavailable until you have added files.

![The NeuralSeek Data Loader panel: the drop zone, the Loader mAIstro Template list and the Load button](/img/data-loader/default--neuralseek-data-loader.png)

<!-- UNCONFIRMED: accepted file types .docx, .doc, .pdf, .txt, .csv, .json and .xlsx — the previous version of this page; the drop zone lists no formats -->

Supported files include .docx, .doc, .pdf, .txt, .csv, .json and .xlsx. What happens to a file's content still depends on the template: a template written for PDFs, such as `ex_PDF_Analyze_Load`, processes a PDF page by page.

## Choose a loader template

**Loader mAIstro Template** lists the loader templates you can run. To use a template of your own, the instructions on the Data Loader page ask you to save it in mAIstro and then select it here. Every example template starts with `ex_`. Check which template is selected before each load: it decides where your files go.

![The open Loader mAIstro Template list with the five example templates](/img/data-loader/default--options-loader-maistro-template.png)

| Template                     | What it does                                                                                                                                                                                                                                                                   | Where the result goes                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `ex_neuralseek_KB_upload`    | "An example of how to load a document to the NeuralSeek KB." Reads each file and adds its text as one document, titled with the file name.                                                                                                                                     | The NeuralSeek knowledge base              |
| `ex_ElasticSearch_Loader`    | "Divide documents into sections and upload them to Elasticsearch for search." Creates the index, splits each file into sections of 3,000 tokens and indexes each section with the file name. This is the "ElasticSearch Loader" the instructions panel points to.             | The Elasticsearch index `neuralseek`                                                     |
| `ex_OCR_Cleanse_and_Load`    | "Enhance OCR text accuracy and load the cleaned data into Elasticsearch." Splits each file into sections of 2,000 tokens and has an LLM clean each section of OCR errors — tables, multi-column layouts — keeping the paragraph structure and adding nothing, then indexes it. | The Elasticsearch index `neuralseek`                                                     |
| `ex_PDF_Analyze_Load`        | "Extract and interpret tables/images in PDFs using multimodal models, then index the result." Reads a PDF one page at a time, sends each page's text and image to an LLM that describes images and explains charts, then splits the result into sections and indexes them.   | The Elasticsearch index `neuralseek`                                                     |
| `ex_Large_Document_Analyzer` | "Iterate through a large text to find and extract relevant sections." Reads the file in sections of 10,000 tokens, has an LLM analyse each one (procedural steps, conditions, dependencies) and returns the combined analysis as text.                                         | Returned as text — use it as a model for processing steps, not to load files |

The three Elasticsearch templates write with the mAIstro `elastic` node and pass it no credentials.

<!-- UNCONFIRMED: an elastic node with blank credentials uses the Elasticsearch configured as the instance's knowledge base — old prose, maistro/ntl/integrations/knowledgebases.md ("Leave blank if you have configured ElasticSearch as your Seek KB") -->

Without credentials, the `elastic` node uses the Elasticsearch configured as your instance's knowledge base, so these templates load into that cluster and need an Elasticsearch knowledge base to be [connected](/knowledge/connect-a-kb/) first. The nodes that write to knowledge bases are described on [mAIstro knowledge base nodes](/maistro/ntl/integrations/knowledgebases/).

## Build your own loader template

When none of the examples writes where you need — a database, a REST service, another knowledge base — build a template of your own in mAIstro. The pattern has two parts:

1. A Local Document (`doc`) node set to NeuralSeek Document Loader (`nsDocLoader`). The `doc` node reads a local document; set this way, it reads the file dropped on the Data Loader. See [Upload Data](/maistro/ntl/upload-data/) for the node.
2. The node that writes to your store, fed with the text the first node read.

`ex_neuralseek_KB_upload` is the whole pattern in two lines:

```text
{{ doc | name: "nsDocLoader" }}=>{{ variable | name: "docText" }}
{{ nsKbAddDocument | text: "<< name: docText >>" | title: "<< name: doc.name >>" }}
```

The first line reads the file and keeps its text in the variable `docText`; the second adds that text to the NeuralSeek knowledge base, titled with the file name. The shortest path to your own template is to copy an example and replace its write step. If the file needs work before it is stored, put it between the two steps, as `ex_OCR_Cleanse_and_Load` does with its LLM cleaning step. Save the template in [mAIstro](/maistro/overview/), then select it in **Loader mAIstro Template**.

## Verify the load

Where to look depends on where the template writes.

- In the NeuralSeek knowledge base (`ex_neuralseek_KB_upload`, or your own template using the same write node): select **KnowledgeBase** in the top navigation. In the [Knowledgebase Manager](/knowledge/document-manager/), **Document Count** has gone up and the **Documents** table lists the new documents under their file names.
- In an Elasticsearch index (`ex_ElasticSearch_Loader`, `ex_OCR_Cleanse_and_Load`, `ex_PDF_Analyze_Load`): the documents are in the index `neuralseek` of the Elasticsearch your instance is connected to, not in the Knowledgebase Manager. If your knowledge base settings point NeuralSeek at that index, ask a question the new files answer in [Seek](/seek/overview/).

<!-- UNCONFIRMED: a load's output appears in Explore Inspector — the previous version of this page; Explore Inspector was not opened in a capture -->

The output of a load can be opened from **Explore Inspector**, the bug icon at the top right of the Data Loader page.

<!-- UNCONFIRMED: Loader Logs reports what happened to each uploaded document — the route's gap list; the area is empty before a load and no load was captured -->

**Loader Logs**, below the loader panel, fills in once a load runs and reports the result for each uploaded document.

## Troubleshooting

- **Load stays unavailable.** No files have been added yet. Drop them on **Drag and drop files here or click to upload** first.
- **Your template is not in Loader mAIstro Template.** Follow the steps the Data Loader's instructions give: build the template in mAIstro with a Local Document node set to NeuralSeek Document Loader, save it, then select it in **Loader mAIstro Template**. Compare it with an example template that does the same job.

## FAQ

### Where do the loaded files end up?

Wherever the template you select in **Loader mAIstro Template** writes them. `ex_neuralseek_KB_upload` adds them to the NeuralSeek knowledge base; `ex_ElasticSearch_Loader`, `ex_OCR_Cleanse_and_Load` and `ex_PDF_Analyze_Load` index them into the Elasticsearch index `neuralseek`; a template of your own can write to any store a mAIstro node reaches.

### Can I load into a database or a REST service?

Yes, with a template of your own: a Local Document node set to NeuralSeek Document Loader, followed by the node that writes to that database or service. See [Build your own loader template](#build-your-own-loader-template).

### Does the Data Loader run OCR on scanned files?

The processing depends on the template you select. `ex_OCR_Cleanse_and_Load` cleans text that has already been through OCR, fixing errors in tables and multi-column layouts. `ex_PDF_Analyze_Load` sends each PDF page's text and image to a multimodal LLM, so it can describe images and explain charts. For a template of your own, mAIstro also has an `ocr` node.

## Related

- [Getting documents in](/knowledge/ingestion-overview/) — every way content reaches a knowledge base, and when to use each
- [Knowledgebase Manager](/knowledge/document-manager/) — check and manage what has been loaded
- [NeuralSeek knowledge base](/knowledge/managed-knowledgebase/overview/) — the knowledge base `ex_neuralseek_KB_upload` writes to
- [Connect a knowledge base](/knowledge/connect-a-kb/) — connect the Elasticsearch the example Elasticsearch templates load into
- [mAIstro overview](/maistro/overview/) — build and save templates
- [Upload Data](/maistro/ntl/upload-data/) — the Local Document node
- [Users and permissions](/configuration/administration/users-and-permissions/) — grant the Load permission
