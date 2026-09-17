---
title: "Supported knowledge bases"
description: "Explore advanced knowledge base integrations with features like relevance tuning, dynamic filters, and vector search. Connect with top platforms like Watson Discovery, ElasticSearch, and Amazon Kendra."
---

## Common Features

### Relevance Tuning
This feature allows users to increase the response of a result when a query contains terms that match the attribute. 

- We recommend connecting to **Watson Discovery**, **watsonx Discovery**, or **Elastic AppSearch** to utilize this feature. 

### Dynamic Filter Query
This feature allows for users to apply filters to their queries based on specific criteria in order to refine their search results.

- We recommend connecting to **Watson Discovery** or **watsonx Discovery** to utilize this feature. 
    
### Vector Search
This feature utilizes numerical representations of data, known as vectors, to conduct searches and identify relevance. In traditional leucine searches, documents are indexed based on keywords and queries are matched to documents containing those exact keywords. Vector searching utilizes semantic relationships to find related objects in the documentation that share similarity. This approach is ideal for broad or fuzzy queries, and improves the depth and breadth of searching and querying different types of data.

- We recommend connecting to **ElasticSearch** for document-oriented vector search. 
- We recommend connecting to **Milvus** or **Pinecone** for flexible, and scalable data handling with high-performance vector search. 
- Additonally, we recommend **Amazon Kendra** or **Amazon Bedrock** for managed vector search to aid in data chunking, embeddings, and indexing algorithm choices. 

### External Embedding Model Support
This feature utilizes an external embedding model to create vector embedding for indexing content. Upon query, the embedding model creates embeddings for that query, and uses them to query the database for similar vector embeddings for answer generation. 

- We recommend connecting to **Pinecone** or **Milvus** to utilize this feature. 

## KnowledgeBase Capabilities
:::note[Features Chart]

| KnowledgeBase   | Supported Search Types  | Query Filters  | Document Prioritization  (Re-Sort) | Relevance Tuning  | Dynamic Filter Querying  | Full Document Retrieval  | External Embedding Model Support  |
| -------------- | ---------------------- | -------------- | --------------------- | ---------------- | ------------------- | --------------------- | ------------------------------ |
| [Watson Discovery](https://cloud.ibm.com/docs/discovery-data?topic=discovery-data-about) | Lucene | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| [watsonx Discovery](https://cloud.ibm.com/docs/discovery-data?topic=discovery-data-about) | Lucene, Vector, Hybrid | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| [Elastic AppSearch](https://www.elastic.co/guide/en/app-search/current/index.html) | Lucene | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| [ElasticSearch](https://www.elastic.co/elasticsearch) | Lucene, Vector, Hybrid | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| [Amazon Kendra](https://aws.amazon.com/kendra/) | Vector (Managed) | ✓ | ✓ | ✗ | *✓ | ✗ | ✗ |
| [Amazon Bedrock](https://aws.amazon.com/bedrock/) | Vector (Managed) | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| [OpenSearch](https://opensearch.org/) | Lucene | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| [Pinecone](https://www.pinecone.io/product/) | Vector | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ |
| [Milvus](https://milvus.io/docs/overview.md) | Vector | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ |

*Kendra offers selective filtering support. Refer to the [Dynamic Filters Operator Reference](/guides/data/dynamic_filters/#operator_reference) for information on Amazon Kendra supported filters. 
:::

<!-- STILL TO DOCUMENT ON THIS PAGE:
  - Six KB types missing from the support matrix: Watson Discovery on CP4D, Postgres, Coveo, Virtual KB, NeuralSeek KB, and No KnowledgeBase
-->
