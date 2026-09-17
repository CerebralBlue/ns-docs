---
title: "Pinecone setup"
description: "Unlock seamless integration with Pinecone as your knowledge base using our step-by-step guide. Learn to configure, upload documents via Node.js, and master its key functionalities."
---

## Overview
This guide provides step-by-step instructions for configuring Pinecone as the knowledge base and using it along with the embedding model. Additionally, a technical explanation of how this configuration works is provided. An example Node.js script for uploading documents to the Pinecone index is also included. 

While this guide focuses on Pinecone, it is worth noting that you can also use Milvus as an alternative vector database.


## Prerequisites

- Ensure you have Node.js installed.

## Steps

### 1. Create a Pinecone Account

- Go to [Pinecone](https://www.pinecone.io/) and create a new account.

### 2. Create a New Index in Pinecone

- Navigate to the dashboard and create a new index.
  - Depending on the embedding model you plan to use, choose the appropriate vector size:
    - `text-embedding-ada-002`: Vector size 1536
    - `text-embedding-3-small`: Vector size 1536
    - `text-embedding-3-large`: Vector size 3072
    - `infloat-e5-small-v2`: Vector size 384

    ![Add Index](/img/knowledge/pinecone/index.png)

### 3. Configure NeuralSeek

#### 3.1. Configure the Knowledge Base Connection

- Access the **NeuralSeek** platform.
- Go to the **Configure** tab and set up the knowledge base connection:
  - Knowledge Base Type: `Pinecone`
  - Knowledge Base Language: `English`
  - Pinecone Index Name: `docs`
  - Pinecone Index Namespace: `ns1`
  - Pinecone API Key: `your-pinecone-api-key`
  - Curation Data Field: `text`
  - Document Name Field: `title`
  - Filter Field: `title`
  - Link Field: `link`
  - Attribute Resources: `enabled`

  ![Configure Knowledge Base Connection](/img/knowledge/pinecone/kb-pine.png)

#### 3.2. Add an Embedding Model

- Go to the **Embedding Models** section and add a new embedding:

  - Choose the platform (either `Azure`, `NeuralSeek`, or `OpenAI`).
  - Select the appropriate embedding model:
    - For `OpenAI` and `Azure`:
      - `text-embedding-ada-002`: Vector size 1536
      - `text-embedding-3-small`: Vector size 1536
      - `text-embedding-3-large`: Vector size 3072
    - For `NeuralSeek`:
      - `infloat-e5-small-v2`

![Add Embedding Model 1](/img/knowledge/pinecone/embedding.png)

![Add Embedding Model 2](/img/knowledge/pinecone/embedding2.png)

  

### 4. Add Documents to Pinecone Index via Node.js Script

#### 4.1. Install Required Packages

```bash
npm install axios fs path @pinecone-database/pinecone @langchain/openai
```

```node
import axios from "axios";
import fs from "fs";
import path from "path";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

const folder = "./docs";

const pc = new Pinecone({
  apiKey: "your-pinecone-api-key", // Replace with your Pinecone API key
});

var kb = {};
var ids = [];

const openaiAPIKey = "your-openai-api-key"; // Replace with your OpenAI API key

kb.importFiles = async (model, pineconeIndex, pineconeNamespace) => {
  var pineconeData = [];

  let fileList = fs.readdirSync(folder);
  var vectors = null;
  for (const file of fileList) {
    const data = JSON.parse(fs.readFileSync(path.join(folder, file)));

    if (model == "infloat-e5-small-v2") {
      const embeddings = await axios.post("http://url.com", {
        text: data.text,
      });
      vectors = embeddings.data;
    } else if (
      model == "text-embedding-ada-002" ||
      model == "text-embedding-3-small" ||
      model == "text-embedding-3-large"
    ) {
      var embedV2 = new OpenAIEmbeddings({
        openAIApiKey: openaiAPIKey,
        modelName: model,
      });

      vectors = await embedV2.embedQuery(data.text);
    } else {
      throw new Error(`Unsupported model "${model}"`);
    }

    const id = data.title;
    const metadata = {
      text: data.text,
      title: data.title,
      link: data.source_link,
    };
    const values = vectors;
    var record = { id, values, metadata };
    pineconeData.push(record);
    ids.push(id);
  }
  const index = pc.index(pineconeIndex);

  await index.namespace(pineconeNamespace).upsert(pineconeData);
};

kb.fetchRecords = async (recordIds) => {
  const index = pc.index("docs");
  const result = await index.namespace("ns1").fetch(ids);
};

kb.emptyQuery = async (dimensions, ns, indexName) => {
  const index = pc.index(indexName);

  const queryResponse = await index.namespace(ns).query({
    vector: new Array(dimensions).fill(0),
    topK: 1,
    includeMetadata: true,
  });

  console.log(queryResponse);
};

kb.describeIndex = async (indexName) => {
  var index = await pc.describeIndex(indexName);
  var dimension = index.dimension;
  console.log(`Dimensions: ${dimension}`);
};

kb.query = async (ns, indexName, text) => {
  const index = pc.index(indexName);

  // Staging is returning 384 dimensions/vectors.
  const embeddings = await axios.post("http://url.com", {
    text: text,
  });
  const id = "Test";
  const metadata = { text: text };
  const values = embeddings.data;
  var record = { id, values, metadata };

  const queryResponse = await index.namespace(ns).query({
    vector: record.values,
    topK: 10,
    includeMetadata: true,
  });

  console.log(queryResponse);
};

kb.filterQuery = async (ns, indexName, text, filter) => {
  const index = pc.index(indexName);

  const embeddings = await axios.post("http://url.com", {
    text: text,
  });
  const id = "Test";
  const metadata = { text: text };
  const values = embeddings.data;
  var record = { id, values, metadata };

  const queryResponse = await index.namespace(ns).query({
    vector: record.values,
    filter: {
      contents: { $eq: filter },
    },
    topK: 11,
    includeMetadata: true,
  });

  console.log(queryResponse);
};

kb.getEmbedding = async (embedModel, query) => {
  var res = await embedModel.embedQuery(query);
  console.log(res);
};

var embedV2 = new OpenAIEmbeddings({
  openAIApiKey: "your-openai-api-key",
  modelName: "text-embedding-3-small",
});

await kb.importFiles("text-embedding-3-small", "docs", "ns1");
```

### 4.2. Create and Run the Script
Create a file named upload-documents.js and add the following script:

```bash
    node upload-documents.js
```

### 5. Save Configuration
Save all the configurations made in NeuralSeek.


### 6. Test the Integration
Go to the Seek tab in NeuralSeek and perform a search to verify if the integration works.

Additionally, you can test the setup using Maistro.


## Technical Explanation: How Pinecone and NeuralSeek Work Together

## Pinecone

Pinecone is a vector database that provides efficient similarity search and retrieval capabilities. In the context of NeuralSeek, Pinecone serves as the knowledge base where all documents and their vector embeddings are stored. Key functionalities include:

### Indexing
- Pinecone indexes vector embeddings of documents, making them easily searchable.

### Querying
- It processes search queries by comparing query vectors with stored document vectors to find the most similar matches.

### Scalability
- Pinecone can handle large volumes of data and provides quick search responses, making it suitable for extensive knowledge bases.

## NeuralSeek Embedding Model

NeuralSeek uses sophisticated embedding models to generate vector representations of text data. The `infloat-e5-small-v2` model, in particular, transforms text into a 384-dimensional vector, capturing the semantic meaning of the text. Key functionalities include:

### Text Embeddings
- Converts text data into dense vector representations that capture semantic information.

### Similarity Matching
- Compares query vectors with document vectors to find the most relevant answers.

### Contextual Understanding
- Leverages multiple layers to understand and generate contextually accurate responses.

## Integration Workflow

1. **Data Ingestion**: Documents are ingested and processed to generate vector embeddings using NeuralSeek’s embedding model.
2. **Indexing**: The generated vector embeddings are stored in Pinecone, where they are indexed for efficient search and retrieval.
3. **Query Processing**: When a query is entered, NeuralSeek converts the query text into a vector using the embedding model.
4. **Search and Retrieval**: The query vector is compared with document vectors in Pinecone to find the most relevant matches.
5. **Response Generation**: The most relevant documents are retrieved from Pinecone, and NeuralSeek formulates a response based on the retrieved data.

## Benefits of This Configuration

### Efficiency
- Combining Pinecone’s efficient vector search capabilities with NeuralSeek’s powerful embeddings ensures quick and accurate responses.

### Scalability
- Pinecone can scale to handle large data volumes, while NeuralSeek’s embeddings maintain high performance.

### Accuracy
- NeuralSeek’s contextual embeddings improve the accuracy of responses, providing relevant and precise information.


### Troubleshooting

::::caution[Issue: Model Not Providing Accurate Responses]
:::tip[Solution]
Verify the model parameters and ensure that the content in the knowledge base is up-to-date.
:::

::::

::::caution[Issue: Upload Errors]
:::tip[Solution]
Ensure that file formats are correct and data integrity is maintained.
:::

::::

::::caution[Issue: Integration Issues]
:::tip[Solution]
Recheck the linkage between the model and the knowledge base, and verify that synchronization is correctly configured.
:::

::::
