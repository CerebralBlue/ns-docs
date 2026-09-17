---
title: "Table understanding"
description: "Unlock seamless table data extraction with NeuralSeek's Table Understanding. Optimize document queries effortlessly, though note it requires 1 seek query per table."
---

**What is it?**

- Table Extraction, also known as `Table understanding`, pre-processes your documents to extract and parse table data into a format suitable for conversational queries. Since this preparation process is both **costly** and **time-consuming**, this feature is opt-in and will consume 1 seek query for every table preprocessed. Also, it should be noted that Web Crawl Collections are not eligible for table understanding, as the recrawl interval will cause excessive computing usage. Table preparation time takes several minutes per page.

**Why is it important?**

- Being able to understand data in tabular structure in documents and generating answers is an important capability for NeuralSeek in order to better find the relevant data for answering.

**How does it work?**

- To find table extraction, open up your instance of NeuralSeek and head over to the `Configure`.
- Select Table understanding

:::caution[Note for users of lite/trial plans]
To be able to access and use this feature you will have to contact cloud@cerebralblue.com with details of your opportunity and use case to be eligible.
:::

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Guidance is stale: re-crawl and re-load now re-process and cost, but the docs still say crawls are ineligible
-->
