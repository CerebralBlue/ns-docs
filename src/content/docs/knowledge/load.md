---
title: "Loading documents"
description: "Effortlessly load documents into your Knowledgebase with NeuralSeek's Data Loader. Simplify data import to Elastic, databases, or REST services using mAIstro templates."
---

## Overview

![dataloader](/img/knowledge/load/load.png)

**What is it?**

- The Data Loader uses mAIstro to iterate and load documents. This lets you easily load data to a Knowledgebase like Elastic, a database, or a REST service... The possibilities are endless.

**Why is it important?**

- mAIstro may not always function independently; user-provided data in the form of documents is sometimes needed to achieve desired results. The Data Loader simplifies and accelerates the process of importing these documents, eliminating the need for multiple tasks in mAIstro.

**How does it work?**

- First, the user must save a mAIstro template that takes advantage of the Local Document node, the Data Loader is used to run that template quickly.

- Navigate to the Load tab on the NeuralSeek homepage, where you will be taken to the Data Loader page. 

- Once there, simply add whichever file you want to load into mAIstro, then underneath the "Loader mAIstro template" heading, click the blue Load button. Depending on the file size, the upload may take a while. Some supported files are .docx, .doc, .pdf, .txt, .csv, .json, and .xlsx.

- Once the upload is complete, the output results can be found by clicking the "Explore Inspector" button in the top right corner, represented by a bug icon.

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Loader template selector — which mAIstro template processes the upload
  - Loader Logs — what happened to each uploaded document
  - Confirm the current supported-format list, including whether images and OCR are covered
-->
