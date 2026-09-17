---
title: "Elasticsearch vector model"
description: "Learn to configure environments, create API keys, set up machine learning, download models, and verify data embeddings seamlessly with NeuralSeek's ElasticSearch Vector Search guide."
---

## Overview 

This guide provides step-by-step instructions on configuring Vector search with ElasticSearch. It includes logging into the environments, creating keys for API access, setting up a machine learning instance, downloading necessary models, creating source and destination indices, and ingesting data to generate text embeddings. The guide also covers manual data loading steps and utilizing client helper functions for data ingestion. It concludes with verifying the data and content embeddings in the destination index.

## Log into Environments

Begin by logging in to your IBM Cloud account

- **To provision in IBM Cloud**:, 
    - Navigate to **Databases for ElasticSearch**.
    - Select the **Platinum Database Edition**.
- Otherwise, provision within Elastic Cloud as normal.

There are two environments to work from.

- **ElasticSearch Cloud** console. Notice the icons in the top right corner. 
- **Kibana** console
    - Users may be taken directly to the Kibana console after creating a deployment. If not, navigate there by selecting Open on the deployment page from the ElasticSearch Cloud console. 

![es_deploy_click_to_kibana](/img/knowledge/elasticsearch-vector-model/es_deploy_click_to_kibana.png)
![es_kibana_console](/img/knowledge/elasticsearch-vector-model/es_kibana_console.png)

## Creating Keys

- Select the circle icon in the top right of the Kibana screen. 
- Select `Connection Details`
- Here, you will see the **ElasticSearch endpoint** and the **Cloud ID**.
- Select **Create and Manage API Keys**. 
- To create a new API key, click **Create API Key**.
    - Add a unique name.
    - Select the type as **User API Key**.
    - Click **Create API Key** button at the bottom of the dialog.

![es_connection_details](/img/knowledge/elasticsearch-vector-model/ES_connection_details.png)
![es_manage_keys](/img/knowledge/elasticsearch-vector-model/ES_manage_api_keys.png)
![es_create_api_key](/img/knowledge/elasticsearch-vector-model/ES_create_api_key.png)

:::tip
Save these values in a safe place for later use. 
:::

## Create a Machine Learning Instance

Elastic requires a machine learning instance to run the NLP models required for vectorizing the data for indexing. 

- Navigate to the Home screen of your ElasticSearch instance.
- Navigate to the newly created deployment and select **Manage**.
- On the side menu, select **Edit**.
- Scroll down to the **Machine Learning Instances** section.
- Select **Add Capacity**.
- Select 4 GB RAM.
- Click **Save** at the bottom of the page. 

![ES_edit_deploy](/img/knowledge/elasticsearch-vector-model/ES_edit_deploy.png)
![ES_add_ML_RAM](/img/knowledge/elasticsearch-vector-model/ES_add_ML_RAM.png)
![ES_save_ML_add](/img/knowledge/elasticsearch-vector-model/ES_save_ML_add.png)

## Download Models

<details>
<summary>Download ELSER model</summary>

- In Kibana, click the menu icon in the top left and navigate to **Analytics > Machine Learning > Trained Models**.
- Click the **Download** button under the Actions column
    - Choose the recommended `".elser_model_2_linux-x86_64"` model
    - It may take some time for the download to finish. 
- Click the **Deploy** link that shows up when the mouse is hovered over the downloaded model.
- Leave the default settings on the Dialog column and select **Start**.
- The State column will show **Deployed** when successfully done. 

![ES_download_trained_model](/img/knowledge/elasticsearch-vector-model/ES_kibana_trained_model.png)

</details>

<details>
<summary>Download A Text Embedding Model</summary>

It is recommended to use **Eland** to upload and download the desired model to ElasticSearch.

- Run this command to install the Eland Python client with PyTorch: `python -m pip install 'eland[pytorch]'`
- Run this script to download the model from Hugging Face, convert it to TorchScript format, and upload to the Elasticsearch cluster:

```
    eland_import_hub_model
    --cloud-id <cloud-id> \
    -u <username> -p <password> \
    --hub-model-id elastic
    distilbert-base-cased-finetuned-conll03-english \
    --task-type ner
```

- Specify the **Elastic Cloud identifier** using the TLS setting with a downloaded cert from **IBM Cloud -> Database for Elasticsearch -> Overview tab**.
- Provide authentication details to access your cluster.
- Specify the **identifier** for the model in the Hugging Face model hub.
- Specify the **NLP task type** as `"text_embedding"`.

:::tip
It is recommended to use the `intflost/multilingual-e5-base` Hugging Face model to start. 

It may take time for the model to auto-start, up to a few hours.
:::


</details>

## Create Source Index and Upload Data

Indices can be created by either manually loading data using the _bulk API, or by using a client helper function which will create the index and load the data.

![kibana_dev_console](/img/knowledge/elasticsearch-vector-model/ES_kibana_dev_console.png)

<details>
<summary>Manual Data Load Steps</summary>

- Navigate to Kibana console.
- From the side menu, select **Management > Dev Tools** to launch the dev console.
- Delete any code that appears.
- To create the source index, enter the following code:

```
    PUT /search-gs-docs-src
    {
    "mappings": {
        "properties": {
        "title": { 
            "type": "text" 
        },
        "content": { 
            "type": "text" 
        },
        "source": { 
            "type": "text" 
        },
        "url": { 
            "type": "text" 
        },
        "public_record": { 
            "type": "boolean" 
        }
        }
    }
    }

```

- Hit the **run** icon.
- Prepare the data for bulk ingestion by manually converting the data and using the dev console to load it by entering the following code:

```
    POST _bulk
    { "index" : { "_index" : "search-gs-docs-src", "_id" : "1" } }
    { "title" : "Top 3 Best Practices to Secure Your Gainsight PX Subscription",
    "content" : "We should all protect what has been entrusted…”,
    "url" : "https://support.gainsight.com/...",
    "source" : "docs”,
    “public_record”:true,
    “objectID”: “https://support.gainsight.com/...”
    }
    { "index" : { "_index" : "search-gs-docs-src", "_id" : "2" } }
    { "title" : "Using PX with Content Security Policy",
    "content" : "This article describes the steps to allow a Content Security Policy…”,
    "url" : "https://support.gainsight.com/...",
    "source" : "docs”,
    “public_record”:true,
    “objectID”: “https://support.gainsight.com/...”
    }
    …
```

</details>

<details>
<summary>Utilizing Client Helper Function Steps</summary>

- Enter the following code to utilize the client helper function to create the index and load the data:

```
    'use strict'

    require('array.prototype.flatmap').shim()
    const { Client } = require('@elastic/elasticsearch')
    const client = new Client({
    cloud: { id: '<cloud_id>'},
    auth: { apiKey: '<api_key>' }
    })
    const dataset = require('./gainsight_documentation_data/gainsight-en-federated.json')

    // Create and load the source index
    async function run () {
    await client.indices.create({
        index: 'search-gs-docs-src',
        operations: {
        mappings: {
            properties: {
            title: { type: 'text' },
            content: { type: 'text' },
            url: { type: 'text' },
            source: { type: 'text' },
            public_record: { type: 'boolean' },
            objectID: { type: 'text' }
            }
        }
        }
    }, { ignore: [400] })

    const operations = dataset.flatMap(doc => [{ index: { _index: 'search-gs-docs-src' } }, doc])

    const bulkResponse = await client.bulk({ refresh: true, operations })

    if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0]
        if (action[operation].error) {
            erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: action[operation].error,
            operation: operations[i * 2],
            document: operations[i * 2 + 1]
            })
        }
        })
        console.log(erroredDocuments)
    }

    const count = await client.count({ index: 'search-gs-docs-src' })
    console.log(count)
    }

    run().catch(console.log)
```

- Use the **Cloud ID** and **API Key**.
- Enter the following commands to run this script:
    - `npm i @elastic/elasticsearch`
    - `npm i array.prototype.flatmap`
    - `node data_load.js`

</details>

Once the data is loaded, either manually or programmatically, verify that it appears properly in the index.

- Navigate to the Kibana console.
- Navigate to **Search > Content > Indices**.
- Open the `search-gs-docs-src` index.
- Open the **Documents** tab to see the data for verification.

## Create destination Index

Create a destination index using the same schema as the source index. Add a field to store the content embeddings. 

- Enter the following code, then hit the **run** icon.

```
    PUT /search-gs-docs-dest
    {
    "mappings": {
        "properties": {
        "content_embedding": { 
            "type": "sparse_vector" 
        },
        "title": { 
            "type": "text" 
        },
        "content": { 
            "type": "text" 
        },
        "source": { 
            "type": "text" 
        },
        "url": { 
            "type": "text" 
        },
        "public_record": { 
            "type": "boolean" 
        }
        }
    }
    }
```
## Ingest the Data to Generate Text Embeddings

- Create an ingest pipeline with an inference processor. Enter the following code:

```
    PUT _ingest/pipeline/my-content-embedding-pipeline
    {
    "processors": [
        {
        "inference": {
            "model_id": ".elser_model_2_linux-x86_64",
            "input_output": [ 
            {
                "input_field": "content",
                "output_field": "content_embedding"
            }
            ]
        }
        }
    ]
    }
```

- Click the **run** icon.

- Ingest the data through the inference index pipeline to create the text embeddings. Enter the following code into the dev console:

```
    POST _reindex?wait_for_completion=false
    {
    "source": {
        "index": "search-gs-docs-src",
        "size": 50 
    },
    "dest": {
        "index": "search-gs-docs-dest",
        "pipeline": "my-content-embedding-pipeline"
    }
    }
```

- To get the name of the pipeline with the model loaded, navigate to **Kibana > Machine Learning > Trained Models**.
- Expand the Deployed model.
- Navigate to the **Pipelines** tab to view the `my-content-embesddings-pipeline` created in the above step. 

:::tip
To confirm the task was run successfully, run the following command using the **task ID** produced in the response from the previous command:
`GET _tasks/<task_id>`.
:::

- Verify the content embeddings are in the new destination index.
    - Navigate to Kibana.
    - Navigate to **Search > Content > Indices**.
    - Open the `search-gs-docs-dest` index.
    - Open the **Documents** tab to see the data.

## Map a Field

Models compatible with ElasticSearch NLP generate dense vectors as output, so the `dense_vector` field type for the index is suitable for storing. This field type must be configured with the same number of dimensions using the `dims` option. 

- Enter the following code into the dev console to create an index mapping that defines field containing the model output. 
```
    PUT my-index
    {
    "mappings": {
        "properties": {
        "my_embeddings.predicted_value": { 
            "type": "dense_vector", 
            "dims": 384 
        },
        "my_text_field": { 
            "type": "text" 
        }
        }
    }
    }
```

- `my_embeddings.predicted_value` is equal to the name of the field containing the embeddings generated by the model.
- The `"type"` field must be `"dense_vector"`.
- The `"dims"` field contains the number of dimensions of the embeddings produced by the model. Be sure that this number is configured in the `dense_vector` field. 
- The `"my_text_field"` field is equal to the name of the field from which to create the dense vector representation.
- The `"type"` field is `text`. 

## Test the Semantic Search

<details>
<summary>ELSER Model</summary>

Test the semantic search using the `text_expansion` query by providing the query text and the ELSER Model ID. 

- Enter the following code into the dev console:

```
        GET search-gs-docs-dest/_search
    {
    "query":{
        "text_expansion":{
            "content_embedding":{
                "model_id":".elser_model_2_linux-x86_64",
                "model_text":"Put sample query here"
            }
        }
    }
    }
```

- The `content_embedding` field contains the generated ELSER output. 

</details>

<details>
<summary>Dense Vector Model</summary>

The dense vector models allow users to query rank features with a kNN search. In the `knn` clause, users will provide the name of the dense vector field. In the `query_vector_builder` clause, add the model ID and the query text.

- Enter the following code into the dev console:

```
    GET my-index/_search
    {
    "knn": {
        "field": "my_embeddings.predicted_value",
        "k": 10,
        "num_candidates": 100,
        "query_vector_builder": {
        "text_embedding": {
            "model_id": "sentence-transformers__msmarco-minilm-l-12-v3",
            "model_text": "the query string"
        }
        }
    }
    }
```

</details>

## Connect NeuralSeek to Elasticsearch

- Navigate to your IBM Cloud account.
- Open the NeuralSeek service instance.
- Navigate to the **Configure** screen.
- Save your current setting by clicking the **Download Settings** button at the bottom of the screen.
- Open the **KnowledgeBase Connection** accordion and update the following fields. 
    - Set KnowledgeBase Type to `ElasticSeach`
    - Set the **ElasticSearch Endpoint**.
    - Set the **ElasticSearch Private API Key**.
    - Set the **ElasticSearch Index Name** to the destination index. In this case, `search-gs-docs-dest`. 
    - Set the **Curation Data Field** to `content`.
    - Set the **Documentation Name Field** to `title`.
    - Set the **Link Field** to `url`.
- Click the **Save** button at the bottom of the page.

![ES_download_NS_settings](/img/knowledge/elasticsearch-vector-model/ES_download_NS_settings.png)
![ES_NS_settings](/img/knowledge/elasticsearch-vector-model/ES_NS_settings.png)

## Enable Vector Search in NeuralSeek

In the NeuralSeek Configure screen, open the **Hybrid and Vector Search Settings** accordion to update the following fields.

- Set Elastic Query Type to `Hybrid`. 
    - This will allow for both **Lucene** (exact match) and **Vector** (semantic) searching to achieve a more robust response. 
- Set the **Model ID** to `".elser_model_2_linux-x86_64"`
- Set the **Embedding Field** to `content_embedding`
- Set the **Use the Elastic ELSER Model** field to `True` for ELSER Model Use, or set to `False` to allow NeuralSeek to expect JSON format for a kNN search query. 
- Click **Save** at the bottom of the screen. 

![ES_hybrid_NS_settings](/img/knowledge/elasticsearch-vector-model/ES_hybrid_NS_settings.png)

:::caution[If using 'IBM Databases for ElasticSearch']

With Hybrid search, the KnnScoreDocQuery was created by a different reader. To fix this, enter the following code into the Kibana dev console:
```
    PUT /<INDEX_NAME>/_settings
    {
        "index" : {
            "highlight.weight_matches_mode.enabled" : "false"
        }
    }
```
:::
