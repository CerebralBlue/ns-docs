---
title: "Hybrid, vector and semantic search"
description: "The Hybrid & Vector Search Settings section of Neural Config, shown only when the KnowledgeBase Type is ElasticSearch or watsonx Discovery, sets the Elastic Query Type — Lucene, Hybrid, Vector or Semantic — and decides whether NeuralSeek or a model deployed in Elasticsearch turns the question into a query vector."
---

When your knowledge base is an Elasticsearch index, NeuralSeek can search it with keywords, with vectors, with both, or with a query body you write yourself. You choose in **Hybrid & Vector Search Settings**, a section of the [Neural Config](/configuration/neural-config/) dialog that appears only for the `ElasticSearch` and `watsonx Discovery` store types. This page explains what each query type does, which fields each one needs, and why keyword search is the right default for most content. For the end-to-end setup of an Elasticsearch index with a vector model, see [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/).

## How hybrid and vector search work in NeuralSeek

NeuralSeek retrieves passages from your index, and the LLM writes its answer from those passages only. The query type decides which passages come back. Keyword (`Lucene`) search matches the words in the question; vector search matches meaning, using embeddings of the question and of your documents. Hybrid search runs both in one query. `Semantic` hands Elasticsearch a query body you write, such as a sparse-vector query against an inference endpoint or a kNN clause.

### Where the section appears

Open **Neural Config** and select the **Default Config** node (**Answer Generation**) in the routing tree. The **Configuration: Default Config** dialog opens. In its **KnowledgeBase Connection** section, set **KnowledgeBase Type** to `ElasticSearch` or `watsonx Discovery`. A **Hybrid & Vector Search Settings** item then appears between [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/) and [LLM Details](/configuration/neural-config/llm-details/); select it to expand it.

**KnowledgeBase Type** and the connection and field-mapping fields each store adds are described on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/). Of the store types **KnowledgeBase Type** offers, only `ElasticSearch` and `watsonx Discovery` add this section; `Elastic AppSearch` and `OpenSearch` do not. To compare the store types, see [Supported knowledge bases](/knowledge/supported-knowledgebases/).

Your changes take effect only once you save them. Select **Save** to apply them, or **Propose Changes** to keep them for review; both are described on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Elastic Query Type

**Elastic Query Type** is the first control in the section, below its help text. The query type you pick decides which other fields the section shows.

![Hybrid & Vector Search Settings expanded with Elastic Query Type set to Hybrid: the help text, then Use NeuralSeek configured embedding models? reading False, Use the Elastic ELSER model? reading True, and the Model Id and Embedding Field boxes with their grey hints](/img/neural-config/knowledgebase-connection@kb-es-hybrid-panel.png)

The query types this page covers:

| Option     | What it does                                                                                                     | Fields it adds                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `Lucene`   | Keyword search on the index's text. The help text calls it the best choice "for most usecases".                 | None — **Elastic Query Type** is the only control in the section                                                     |
| `Hybrid`   | Keyword and vector search in one query, with a slight boost for keyword matches.                                  | **Use NeuralSeek configured embedding models?**, **Use the Elastic ELSER model?**, **Model Id**, **Embedding Field** |
| `Vector`   | "Pure Vector search", in the help text's words: documents match only by the similarity of their embeddings.     | The same four fields as `Hybrid`                                                                                     |
| `Semantic` | Sends the query body you write in **Sparse Vector or KNN syntax**, such as a `sparse_vector` or `knn` query.     | **Sparse Vector or KNN syntax**, with three examples beside it                                                       |

`Hybrid` slightly boosts `Lucene` results, which allows a graceful fallback to `Vector` results when no exact matches are found. A document that contains the question's exact terms gets a small advantage, and a document that matches only by meaning still comes back when nothing matches exactly. The boost is only slight, so exact matches are not guaranteed to rank first, and the help text's caution about part numbers, versions and product names covers `Hybrid` as well as `Vector` (see [When to use each query type](#when-to-use-each-query-type)).

### Hybrid and Vector: where the query vector comes from

`Hybrid` and `Vector` add the same four fields. They decide who turns the question into a query vector — NeuralSeek, or a model deployed in your Elasticsearch cluster — and where that vector is compared in your index.

![Hybrid & Vector Search Settings with Elastic Query Type set to Vector: the same four fields as Hybrid, with Use NeuralSeek configured embedding models? reading False, Use the Elastic ELSER model? reading True, and empty Model Id and Embedding Field boxes](/img/neural-config/knowledgebase-connection@kb-es-vector-panel.png)

- **Use NeuralSeek configured embedding models?** — choose who computes the query vector. With `False`, a model deployed in Elasticsearch does, and the fields below name it. Enable it when you have no model deployed in Elasticsearch: the section's kNN example describes that route as "No model deployment in Elasticsearch required", where "NeuralSeek computes the query vector at search time".
- **Use the Elastic ELSER model?** — whether the Elasticsearch-side model is Elastic's ELSER model. With `True`, the section asks for the ELSER deployment in **Model Id** and **Embedding Field**.
  <!-- UNCONFIRMED: False is for a deployed dense kNN model, and NeuralSeek then expects a JSON kNN search query — from the old Configure page ("The query format is different using ELSER vs deployed KNN models. Select False if not using Elastic's ELSER model.") and the old Elasticsearch vector model page; the False form was not captured -->
  Set it to `False` when the model deployed in Elasticsearch is a dense kNN model rather than ELSER: the two take a different query format, and with `False` NeuralSeek expects a JSON kNN search query.
- **Model Id** — the ID of the model deployed in your Elasticsearch cluster. The grey `.elser_model_1` in the empty box is a hint, not a value; type your own deployment's ID.
- **Embedding Field** — the index field that holds the model's output. Its help text reads: For ELSER v1 this is typicaly "ml.tokens", and for ELSER v2 "content_embedding". The grey `ml.tokens` is also only a hint.

<!-- UNCONFIRMED: with Use NeuralSeek configured embedding models? enabled, NeuralSeek embeds the question with the model configured in Embedding Models — inferred from the control's wording and the Semantic kNN example; the enabled form was not captured -->

When NeuralSeek computes the query vector, it uses the model set in [Embedding Models](/configuration/neural-config/embedding-models/). Whichever side computes it, the question must be embedded with the same model that embedded your documents, or the vectors are not comparable.

### Semantic: write the query body

`Semantic` replaces those four fields with one multi-line box, **Sparse Vector or KNN syntax**. Its full label reads: Sparse Vector or KNN syntax. Replace "example-inference-endpoint" with your inference endpoint in elasticsearch. NeuralSeek sends what you write here to Elasticsearch as the search. Use it when your index was built with an Elasticsearch inference endpoint, or when you want to tune a kNN query yourself.

![Hybrid & Vector Search Settings with Elastic Query Type set to Semantic: the query-body box with its grey sparse_vector template on the left, and the Sparse Vectors and Elasticsearch-deployed kNN examples on the right](/img/neural-config/knowledgebase-connection@kb-es-semantic-panel.png)

The empty box carries this template as a grey hint:

```json
{
  "sparse_vector": {
    "field": "<< semantic_field >>.inference.chunks.embeddings",
    "inference_id": "example-inference-endpoint",
    "query": "<< query >>"
  }
}
```

`<< query >>` marks where the user's question goes. `<< semantic_field >>` marks the field name; the first example below replaces it with `example_field`, so put your own field name there.

Three examples sit beside the box:

1. **Example using Sparse Vectors.** "Replace "example-inference-endpoint" with your inference endpoint name."

   ```json
   {
     "sparse_vector": {
       "field": "example_field.inference.chunks.embeddings",
       "inference_id": "example-inference-endpoint",
       "query": "example query"
     }
   }
   ```

2. **Example using Dense Vectors/kNN with Elasticsearch-deployed model.** "Replace "example-model-id" with your deployed model name." Elasticsearch builds the query vector from the question with the model you name:

   ```json
   {
     "knn": {
       "field": "<< semantic_field >>.inference.chunks.embeddings",
       "k": 22,
       "boost": 3,
       "num_candidates": 100,
       "query_vector_builder": {
         "text_embedding": {
           "model_id": "example-model-id",
           "model_text": "<< query >>"
         }
       }
     }
   }
   ```

3. **Example using Dense Vectors/kNN with NeuralSeek Native embedding.** "No model deployment in Elasticsearch required. Enable "Use NeuralSeek configured embedding models" and NeuralSeek computes the query vector at search time." This query has no `query_vector_builder`, because NeuralSeek supplies the vector:

   ```json
   {
     "knn": {
       "field": "<< semantic_field >>.inference.chunks.embeddings",
       "k": 20,
       "boost": 3,
       "num_candidates": 100
     }
   }
   ```

The setting the third example refers to is the **Use NeuralSeek configured embedding models?** dropdown that `Hybrid` and `Vector` show.

### watsonx Discovery

With **KnowledgeBase Type** set to `watsonx Discovery`, the dialog shows the same **Hybrid & Vector Search Settings** item, in the same place, with the same help text — which still names ElasticSearch — and the same **Elastic Query Type** dropdown.

![The Configuration: Default Config dialog for watsonx Discovery: Hybrid & Vector Search Settings expanded between KnowledgeBase Tuning and LLM Details, showing the help text and Elastic Query Type reading Lucene](/img/neural-config/knowledgebase-connection@kb-wxd.png)

The `Hybrid`, `Vector` and `Semantic` forms above are shown for `ElasticSearch`. Before you rely on one of them with `watsonx Discovery`, check which fields your dialog shows after you pick it.

## When to use each query type

The section's own help text sets the default:

> ElasticSearch can provide Lucene, Hybrid, and pure Vector search. For most usecases Lucene search is best. Depending on your settings, Vector and Hybrid searches may amplify hallucinations by bringing back similar but corporatley-different documentation, adding confusion to the LLM - especially with searches based on part number, version, or product name... Do not casually enable Vector search.

The reason is in how vector search matches. A question about version 4 of a product can retrieve the page for version 3, because the two pages read alike; a keyword search matches the literal `4`. When your documentation holds many near-identical pages that differ only by a model number or version, that difference is exactly what vector search blurs, and the LLM then answers from the wrong page.

Stay on `Lucene` when:

- Questions name part numbers, versions or product names, and the documents for different versions look alike.
- Your index has no embedding field.

Consider `Hybrid` when users ask in their own words and your documents use different vocabulary, so keyword search misses relevant pages. Keyword matches get a slight boost, but the help text's warning covers `Hybrid` too: test it on questions that name versions or part numbers before you rely on it.

Use `Vector` only when keyword matching gives nothing useful for your content. After you save it, test it on questions that name versions or part numbers, and switch back if the answers start citing the wrong version.

Use `Semantic` when your index was built with an Elasticsearch inference endpoint (embeddings under `.inference.chunks.embeddings`), or when you need control over the query itself — your own `k` and `num_candidates` in a kNN query, for example.

If your store is not Elasticsearch or watsonx Discovery, this section does not apply. See [Supported knowledge bases](/knowledge/supported-knowledgebases/) and, for Pinecone, [Pinecone](/knowledge/pinecone/).

:::caution[Hybrid search on IBM Databases for Elasticsearch]
If `Hybrid` search on IBM Databases for Elasticsearch fails with a "KnnScoreDocQuery was created by a different reader" error, set `highlight.weight_matches_mode.enabled` to `false` in the index settings. Run this request in the Kibana dev console, with your index name in place of `<INDEX_NAME>`:

```text
PUT /<INDEX_NAME>/_settings
{
  "index": {
    "highlight.weight_matches_mode.enabled": "false"
  }
}
```

:::

## FAQ

### Why is there no Hybrid & Vector Search Settings section in my configuration?

The section appears only when **KnowledgeBase Type** in **KnowledgeBase Connection** is `ElasticSearch` or `watsonx Discovery`. Other store types, including `OpenSearch` and `Elastic AppSearch`, do not show it.

### Which Elastic Query Type should I start with?

Start with `Lucene`. The help text says "For most usecases Lucene search is best" and warns that `Vector` and `Hybrid` "may amplify hallucinations", most of all for questions about part numbers, versions or product names. Move to `Hybrid` only when keyword search misses relevant documents.

### Do I need an embedding model deployed in Elasticsearch?

Not if NeuralSeek computes the query vector. Enable **Use NeuralSeek configured embedding models?**; the kNN example in `Semantic` mode describes that route as "No model deployment in Elasticsearch required". Your documents must still have been embedded with the same model.

### What do I put in Model Id and Embedding Field?

**Model Id** is the ID of the model deployed in your Elasticsearch cluster. **Embedding Field** is the index field that holds its output; the help text suggests `ml.tokens` for ELSER v1 and `content_embedding` for ELSER v2. The grey text in both boxes is only a hint, so type your own values.

## Related

- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
- [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/)
- [Supported knowledge bases](/knowledge/supported-knowledgebases/)
- [Embedding Models](/configuration/neural-config/embedding-models/)
- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/)
