---
title: "KnowledgeBase Connection"
description: "Point NeuralSeek at your knowledge base — the connection fields for each supported store, and what reaches the LLM context."
---

:::note[Draft]
This page is part of the new documentation structure and its content is being prepared.
:::

This page is brand new for the restructured docs.

## To document on this page

- Watson Discovery on CP4D — adds an Auth URL field
- watsonx Discovery — endpoint, private key, index, plus the Generate Key helper
- OpenSearch — endpoint, username, password, index (not an API key)
- Kendra — index ID, AWS region, role access key and secret
- Bedrock — KB ID, region, keys, and the Bedrock Search Type dropdown
- Milvus — host, collection, database, token, one-way TLS, server name
- Postgres — pgvector as the store: table, distance metric, embedding column
- Coveo — org ID, search token, and attribute sources in LLM context
- Virtual KB (config side) — pick a mAIstro agent to act as the knowledge base
- NeuralSeek KB — the built-in option
- No KnowledgeBase — run mAIstro-only with no retrieval
- Advanced Schema: which payload fields reach the prompt, not just the API response
- Combine / separate snippets — merge a document's passages or keep them apart

