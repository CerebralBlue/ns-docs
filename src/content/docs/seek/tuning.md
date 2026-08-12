---
title: "Tuning answers"
description: "Enhance your NeuralSeek KnowledgeBase with our comprehensive tuning guide. Learn best practices, auto-generate questions, and improve answer quality with semantic scores and hybrid search methods."
---

## Overview
This guide provides information on improving answers from the connected KnowledgeBase - Your **ground truth**. 

Use this guide to help get started, improve answers, and learn about some best practices.

## Bootstrapping your Agent

NeuralSeek aims to make bulk-tuning easy, offering different methods for Subject-Matter Experts (SMEs) to collaborate and curate answers.

![Click_to_insert](/img/seek/tuning/ns-home.png)

To bootstrap your agent, you may find these options on the home screen.

- Auto-Generate Questions: This will run a query against your connected KnowledgeBase and attempt to generate a list of relevant questions to your subject matter, and then mimics the below option
- Manually Input Questions: Accepts a list of newline-separated questions, and will perform a Seek action with each question. This populates the Curate tab, while also generating a report spreadsheet that can be distributed among SMEs to weigh in on answers and make edits. (you can also export a similar spreadsheet from the Curate tab)

Finally, you can upload the resulting edits via the "Upload Curated Q&A" option. Congratulations! You've quick-tuned your agent to your most important or relevant subjects.

## Improving Answers

There are many ways to improve generated answers. This can include:

- Utilizing Semantic Scores to monitor or block low-quality answers
- Updating or improving documentation - Answers are only as good as the ground truth!
- Controlling the amount of information sent to the LLM and "force" answers from the KnowledgeBase
- Choosing Lucene VS Vector search (we also support a Hybrid mode!)

### Understanding Generated Answers

A common issue with LLMs: giving answers that are irrelevant or inaccurate. NeuralSeek makes it easier to handle these cases.

To reduce low quality answers, start on the Seek tab: Ask a question. 

To help analyze your answers, take a look at the following:

**Review the Semantic Score**

- Is it low? (below 20%) - Perhaps your documentation does not compare well to the question posed, or there is many source jumps / unattributed terms
- Is it high? (above 60%) - If the answer is low quality - does your documentation have conflicting answers, or very similar terminology to the given query?

**Understand the Semantic Analysis text**

- This is meant to offer insight into the scores given - e.g. a lot of terms from many documents, or primarily one source of documentation.

**Review the KB scores**

- Low Coverage - There is not many documents matching the query
- High Coverage - There are many documents matching the query, or few documents that match exactly
- Low Confidence - The source KB thinks we do not have good matches to the query
- High Confidence - The source KB has found good query matches, but may not answer the query directly

**Review the documentation sources**

- Expand the accordions below to see the actual source documentation provided by the KnowledgeBase. This is what is sent to the LLM for language generation.
- Improve the documentation: If the source documentation does not directly answer the question, updating the source content will almost always help.
- Adjust the Document Score Range: This widens, or shrinks, the top % of documents that will be considered.
- Adjust the Snippet Size: This can help narrow passages out of blocks of unrelated text, or widen the scope for large paragraphs that only mention the subject of your query once.
- Narrow the Max Documents per Seek: This can help target only the best scoring/matching documents, and avoid confusing some LLMs with a slew of information.

To give some examples: Here, we've set the maximum allowed documents to one with snippet size set to 2000 (the largest):

![Click_to_insert](/img/seek/tuning/1_doc_2000_snippet_size.png)
![Click_to_insert](/img/seek/tuning/seek_with_1_doc_max.png)

Some things to notice:

- There is only one document result
- The semantic score is high
- If you expand the document accordion - there is a lot of text returned in this passage

In the next example, we've set the maximum allowed documents to three with snippet size set to 400 (relatively small):

![Click_to_insert](/img/seek/tuning/3_doc_400_snippet_size.png)
![Click_to_insert](/img/seek/tuning/seek_with_2_doc_max.png)

We now have:

- One additional document (total of 2)
- A lower semantic score
- More source jumps in the answer

Generally speaking, and for most use cases, it is better to provide a few top quality documents, versus many low quality or unrelated documents, to the LLM for answer generation. Using these settings can help focus or widen the documentation as needed per use-case.

**Replay a Seek**

Users can also go into Logs and pull previous answers by using our Replay feature. This requires enabling Corporate Logging with an instance of Elasticsearch. For more information, refer to our [Replay article](../replay_guide/index.md) section.

### Optimal Settings

For most use-cases, the combination of settings that we get the best results with are close to:

**In KB Tuning:**

- Document Score Range: `0.6 - 0.8`
- Max Documents per Seek: `4 - 5`
- Snippet Size: If your documents are mostly filled with unrelated small paragraphs (2-3 sentences) - like an faq document - then `400 - 600` is appropriate. Note it is always best to break up documents containing unrelated information into multiple documents. If your documents are large reference manuals that contain long passages - use the max snippet size available to you.

**In Answer Engineering:**

- `Answer Verbosity` slider favoring the "Very Concise" side
- Enable `Force Answers from the KnowledgeBase`

**In Governance and Guardrails:**

- `Warning Confidence` around +/- 20%
- `Minimum Confidence` around +/- 10-20%
- `Minimum Text` around 1-3 words
- `Maximum Length` around 20 words

### Improving Source Documentation

One of the best ways to directly improve answer generation! Here's an example:

- A customer had a very large document, with an Acronym and a definition that was near the top of the document. The acronym was used hundreds of times across many pages. The source KB typically returned the paragraph with the most uses (matches) of the acronym, despite the overall snippet not answering the question directly. To improve the results, we split the document by pages, increased the score range and lowered the snippet size, allowing the KB to effortlessly bring back the relevant document passages while enabling the customer to control the amount of documentation fed to the LLM.

Generally speaking, the best practice for source documentation formatting is to have **individual documents that speak directly to the subject you want to answer**.

### Hybrid and Vector Search

NeuralSeek supports Vector searching on some KnowledgeBase platforms. (see the Supported KnowledgeBases page for details)

![Click_to_insert](/img/seek/tuning/hybrid_vector.png)

Vector Similarity searching is finding "similar" words, where Lucene is "exact matching" terms. For example, if you search for `Animal` you could also get results like `Cat, Dog, Mouse, Lizard`. It's not recommended to use only vector search for corporate-based RAG, as the chance of hallucination is incredibly high. For example - a user searches for `8.1.0`. Lucene will bring back only results with the exact term, where vector similarity may also return `8.0.1`, `8.10`, or similar.

Choosing the Hybrid implementation is recommended if using vector similarity - NeuralSeek will boost the Lucene results, offering Vector results as a sort of "fallback". This can help some use cases. Pure vector serach is not reccomended in any RAG pattern as any vector search increases the likelihood of halucinations.

### Answer Variations

Generative AI often times will generate small variations for the same query.

Two ways to combat this:

- Set the "edited" answer cache setting to 1, and edit the answer on the curate tab.
- Set the "normal" answer cache setting to 1. 

Both of these options will cause NeuralSeek to output consistent, identical answers. This also reduces the amount of language generation calls.

:::note
Edited answers always return a Semantic Score of 100%.  
:::

## Filtering Documentation
Many times there is a large amount of documents, or many data sources / types, to manage. Filtering can narrow down results in a large pool of data.

You may filter on any metadata field available from the KB. Simply set the desired field in the KnowledgeBase Connection settings, and pass a value for which to filter in the Seek call. 

For example - Using `metadata.document_type` as the field, and `PDF` as the value, will return only documents with this field set to PDF. Use comma-separated values for an `OR` filter.

:::note[Watson Discovery users]
To filter by Collection ID: Under KnowledgeBase Connection, enable the Advanced Schema, and manually input `collection_id` in the filter field

DQL_Pushdown is also an option for Discovery users - Select this option, and pass [DQL syntax](https://cloud.ibm.com/docs/discovery-data?topic=discovery-data-query-dql-overview) in the filter value on Seek calls.
:::

Another tool to help target the best quality documentation available is to utilize the "Re-Sort values list" option. This allows you to prioritize certain documents over others - maybe use a collection ID to prioritize internal uploaded documentation over a general company website scrape, or perhaps PDFs have more concise data than your DOCX files. **This allows you to prioritize values without entirely excluding other values.**

## Avoiding Timeouts

NeuralSeek has a limited amount of time to generate a response, as well as a context window that the LLM dictates. Sometimes, the LLM generates large answers and cannot finish its thought before the space runs out, we exceed the chatbot platform timeout, or we exceed the KB's timeout. This will occasionally cause the generated answer to have a dangling sentence near the end - NeuralSeek looks for these dangling responses and trims them back to a logical sentence.

Contributing factors can include:

- KnowledgeBase retrieval speed
- LLM generation speed
- Chatbot settings - timeout settings, etc
- Network latency

Some settings that may help:

- Reducing the maximum number of documents returned from the KB
- Using a faster LLM
- Reducing LLM verbosity in the NeuralSeek Configuration
- Increasing the chatbot timeout threshold
- Provisioning services in the same regions

:::note
When adjusting the verbosity setting, for shorter answers change the verbosity setting to "more concise". For longer/more descriptive answers change the verbosity setting to "more verbose".
:::

## KnowledgeBase Translation
It can be challenging to work with multiple languages. For example - you want the LLM to respond in Spanish, but the source documentation is in English. NeuralSeek can solve this: In the Platform Preferences configuration, enable `Translate into KB Language`, and set the desired output language. 

![Click_to_insert](/img/seek/tuning/platform_preferences.png)

This allows NeuralSeek to:

- Accept a question in Spanish (for example)
- Translate to English (source documentation language)
- Perform a KB search in English
- Generate an Answer in English
- Translate the Answer to Spanish

:::caution[For Bring-your-own LLM users]
When using the cross-language feature of NeuralSeek, some LLMs will not excel at this. You will need to use a powerful model like GPT, Llama 70b, or Mixtral.
:::

You can set NeuralSeek's output language to "Match Input" to respond in the same language as the query. Another choice is to have the chatbot control the language returned. Some chatbots support passing the language dynamically as a context variable to the NeuralSeek API. The source of the context variable can be the web browser language or part of the chatbot's URL that tells you the user's language.

Example from watsonx Assistant:

![Click_to_insert](/img/seek/tuning/extension_config.png)

## Using Multiple Data Sources
NeuralSeek allows you to use multiple configurations on-demand, effectively overriding any settings currently in the Configure tab. This is useful if you want to use multiple KB sources, project IDs, or similarly exceed the UI limitations.

![download settings](/img/seek/tuning/download_settings.png)

Simply configure NeuralSeek with the desired parameters, save, and then "Download Settings" as pictured.

This will download a `.dat` file, containing an encoded string of all current settings - including KB details, project IDs, LLMs, etc.

On Seek API calls, set `options.override` to this encoded string - Effectively using these saved settings for this Seek call, ignoring "current" settings in the UI.
