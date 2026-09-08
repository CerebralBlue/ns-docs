---
title: "Knowledge Bases"
description: "Search and manage the NeuralSeek KnowledgeBase, or connect to Elasticsearch or Watson Discovery to index, search, retrieve, update, and manage documents and data."
---

## KB Search


Run a query directly against the KnowledgeBase. The options snippet and scoreRange are optional overrides of your configuration and should not normally be set.
:::note[Parameters]

- **query**: The KnowledgeBase search

- **filter**: The KnowledgeBase filter

- **filterField**: Filter Field - metadata field the filter matches against (default: KB config)

- **snippet**: Override the Passage Size

- **scoreRange**: Override the Score Range

- **includePassages**: Include passages in output as kb.passages (passage, score, url, document, id)
:::

---


## NS KB Search


Run a query directly against the NS KnowledgeBase. The options expand lets you bring back text surrounding the matched section.
:::note[Parameters]

- **query**: The KnowledgeBase search

- **filter**: The KnowledgeBase filter

- **filterField**: Filter Field - metadata field the filter matches against (default: KB config)

- **maxDocs**:
    - **text**: Maximum Documents
    - **min**: 1
    - **max**: 30
    - **step**: 1
    - **default**: 5

- **expand**:
    - **text**: Expand the search result
    - **min**: 1
    - **max**: 10
    - **step**: 1
    - **default**: 1
:::

---


## NS KB Add Document


Add a document to the NS Knowledgebase
:::note[Parameters]

- **text**: Document Text

- **title**: Document Title

- **url**: Document URL

- **filter**: Document Filter
:::

---


## ES KB Add Document


Chunk, embed, and index a document into Elasticsearch (dense_vector for kNN search)
:::note[Parameters]

- **text**: Document Text

- **title**: Document Title

- **url**: Document URL

- **filter**: Document Filter

- **docId**: Deterministic document id (overwrite on re-run)

- **esNode**: Elasticsearch node URL

- **esApiKey**: Elasticsearch API key

- **index**: Elasticsearch index name
:::

---


## NS KB Delete Document


Delete a document from the NS Knowledgebase
:::note[Parameters]

- **id**: Document Id
:::

---


## Elastic 


Run an exists, index, get, search, update, delete, create index, delete index or delete by query operation on ElasticSearch
:::note[Parameters]

- **operation**: The Elastic operation

- **payload**: The JSON to send to elastic

- **credentials**: The elastic credentials JSON object. Leave blank if you have configured ElasticSearch as your Seek KB and want to use those. EG:<br>{<br>'node': 'https://fd109b3.us-west-2.aws.found.io',<br> 'auth': {<br>'apiKey': 'cTRlNUZKRUJYncGtN01tUQ=='},<br> 'tls':{<br>'rejectUnauthorized': false<br> }<br> }
:::

---


## Watson Discovery 


Connect to the Watson Discovery api
:::note[Parameters]

- **operation**: The Discovery operation

- **payload**: The JSON to send to Discovery

- **url**: The url. Leave blank if you have configured Discovery as your Seek KB and want to use that url.

- **apiKey**: The apiKey. Leave blank if you have configured Discovery as your Seek KB and want to use that apiKey.
:::
