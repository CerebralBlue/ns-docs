---
title: "Hybrid, vector and semantic search"
description: "The Hybrid & Vector Search Settings section of Edit Configuration, shown only when the KnowledgeBase Type is ElasticSearch or watsonx Discovery, sets the Elastic Query Type — Lucene, Hybrid, Vector or Semantic — and decides whether NeuralSeek or a model deployed in Elasticsearch turns the question into a query vector."
---

## What is it

**Hybrid & Vector Search Settings** is a section of the **Edit Configuration** dialog in Neural Config. It chooses how NeuralSeek searches an Elasticsearch index: with a plain keyword query, with vectors, with both, or with a query body you write yourself. Its one always-visible control is **Elastic Query Type**, which sets the query type: `Lucene`, `Hybrid`, `Vector` or `Semantic`. Each type other than `Lucene` adds the fields that kind of search needs.

The section exists only when the **KnowledgeBase Type** is `ElasticSearch` or `watsonx Discovery`. With any other store selected it is not in the dialog at all.

## Why it matters

The query type decides which passages come back, and the LLM writes its answer from those passages alone. The section's own help text is blunt about the risk:

> ElasticSearch can provide Lucene, Hybrid, and pure Vector search. For most usecases Lucene search is best. Depending on your settings, Vector and Hybrid searches may amplify hallucinations by bringing back similar but corporatley-different documentation, adding confusion to the LLM - especially with searches based on part number, version, or product name... Do not casually enable Vector search.

A vector search matches on meaning, so a question about version 4 of a product can retrieve the page for version 3 because the two read alike. A keyword search matches the literal `4`. When your documentation is full of near-identical pages that differ by a model number, that difference is the one that matters, and it is the one vector search blurs.

## When to use it

Change **Elastic Query Type** away from `Lucene` when:

- Users ask in their own words and your documents use different vocabulary, so keyword matches miss relevant pages.
- Your index already holds embeddings — ELSER tokens, dense vectors, or a `semantic_text` field with an inference endpoint — and you want NeuralSeek to use them.
- You need full control of the Elasticsearch query, for example a `knn` clause with your own `k` and `num_candidates` (use `Semantic`).

Stay on `Lucene` when:

- Questions name part numbers, versions or product names, and the documents for different versions look alike.
- Your index has no embedding field. Vector and hybrid modes need one.
- Your store is not Elasticsearch or watsonx Discovery. The section does not exist for other stores; see [Supported knowledge bases](/knowledge/supported-knowledgebases/).

## How it works

### Where the section appears

Open **Neural Config**, click the **Default Config** node in the routing tree, and open **Edit Configuration**. Set **KnowledgeBase Type** in the first section, **KnowledgeBase Connection**, to `ElasticSearch` or `watsonx Discovery`. A **Hybrid & Vector Search Settings** header then appears between **KnowledgeBase Tuning** and **LLM Details**. Click it to expand it.

![The KnowledgeBase Type dropdown open over the KnowledgeBase Connection section, listing Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch and ElasticSearch, with ElasticSearch ticked](/img/neural-config/knowledgebase-connection@kb-elastic--options-knowledgebase-type.png)

**KnowledgeBase Type** lists sixteen stores. Only two of them show this section: `ElasticSearch` and `watsonx Discovery`. The other fourteen do not: `Watson Discovery`, `Watson Discovery (CP4D)`, `Elastic AppSearch`, `OpenSearch`, `Kendra`, `Bedrock`, `IBM CAS`, `Pinecone`, `Milvus`, `Postgres`, `Virtual KB`, `NeuralSeek KB`, `No KnowledgeBase` and `ChromaDB`. `OpenSearch` and `Elastic AppSearch` are close relatives of Elasticsearch, but they still do not get the section.

The connection fields that `ElasticSearch` adds to **KnowledgeBase Connection**, such as the endpoint, API key, index name and field mappings, belong to that section. They are described on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/), and the Elasticsearch-side setup is on [Elasticsearch vector model](/knowledge/elasticsearch-vector-model/).

Changes are not applied while the dialog is open. Use **Save** or **Propose Changes** in the dialog's footer, both described on [Using the Neural Config page](/configuration/neural-config/using-this-page/).

### Elastic Query Type

**Elastic Query Type** is a dropdown below the help text. In the screenshot below it reads `Lucene`, and with `Lucene` it is the only control in the section.

![The Edit Configuration dialog scrolled to the Hybrid & Vector Search Settings section, expanded below KnowledgeBase Tuning: the help text warning about Vector and Hybrid search, then the Elastic Query Type dropdown reading Lucene, with LLM Details collapsed below](/img/neural-config/knowledgebase-connection@kb-elastic.png)

| Option     | What it does                                                                                                          | Fields it adds                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Lucene`   | Keyword search on the index's text. The help text calls it the best choice "for most usecases".                        | None                                                                                                               |
| `Hybrid`   | Keyword and vector search in one query: `Lucene` results get a slight boost, and `Vector` results fill in when nothing matches exactly. | **Use NeuralSeek configured embedding models?**, **Use the Elastic ELSER model?**, **Model Id**, **Embedding Field** |
| `Vector`   | "Pure Vector search", in the help text's words: matching on embeddings only.                                          | The same four fields as `Hybrid`                                                                                   |
| `Semantic` | Sends a query body you write, such as a `sparse_vector` query against an inference endpoint or a `knn` clause. | **Sparse Vector or KNN syntax**, plus three worked examples                                                        |

`Hybrid` combines the two searches in one query. NeuralSeek describes it this way:

> A combined search query that slightly boosts Lucene results, allowing for graceful fallback to Vector results if no exact matches are found. The weighting of this boost cannot be changed.

So a document that matches the question's exact terms ranks first, and a document that only matches by meaning still comes back when no exact match exists. There is no weighting control in the section: the boost is fixed.

### Hybrid

Choose `Hybrid` and four fields appear under **Elastic Query Type**. In the screenshot, the two dropdowns read `False` and `True` and the two text boxes are empty.

![Hybrid & Vector Search Settings with Elastic Query Type set to Hybrid: Use NeuralSeek configured embedding models? reading False, Use the Elastic ELSER model? reading True, an empty Model Id box with the hint .elser_model_1, and an empty Embedding Field box with the hint ml.tokens and its ELSER v1/v2 help text](/img/neural-config/knowledgebase-connection@kb-es-hybrid-panel.png)

- **Use NeuralSeek configured embedding models?** decides who turns the question into a query vector. It reads `False` in the screenshot: the vector comes from a model deployed in your Elasticsearch cluster, which the next three fields name.
- **Use the Elastic ELSER model?** says whether that Elasticsearch-side model is Elastic's ELSER model. It reads `True` in the screenshot, and pairs with the two fields below.
- **Model Id** is the ID of the model deployed in Elasticsearch. The grey `.elser_model_1` in the empty box is a hint, not a value. Type your deployment's model ID.
- **Embedding Field** is the index field that holds the embeddings. Its help text reads: For ELSER v1 this is typicaly "ml.tokens", and for ELSER v2 "content_embedding". The grey `ml.tokens` is again only a hint.

<!-- UNCONFIRMED: with Use NeuralSeek configured embedding models? = True, NeuralSeek embeds the question itself with the Embedding Models configuration — inferred from the Semantic example text "Enable "Use NeuralSeek configured embedding models" and NeuralSeek computes the query vector at search time"; the True form (and whether Model Id / Embedding Field stay visible) was not seen on screen -->

Set **Use NeuralSeek configured embedding models?** to `True` to have NeuralSeek embed the question itself, with the models in [Embedding Models](/configuration/neural-config/embedding-models/); there, the **KB Search** checkbox marks which model does knowledge-base retrieval. The Semantic examples describe this route as "NeuralSeek Native embedding. No model deployment in Elasticsearch required", where "NeuralSeek computes the query vector at search time". Either way, the question must be embedded with the same model that built the index's vectors, or the two will not be comparable. The fields shown with `True` are not illustrated on this page.

<!-- UNCONFIRMED: setting Use the Elastic ELSER model? to False makes NeuralSeek expect JSON for a kNN search query — from the old Elasticsearch vector model page; the False form was not seen on screen -->

Set **Use the Elastic ELSER model?** to `False` if you query a dense-vector (kNN) model rather than ELSER. The fields shown for that choice are not illustrated on this page either.

<!-- UNCONFIRMED: on IBM Databases for Elasticsearch, Hybrid search can fail with "KnnScoreDocQuery was created by a different reader" and is fixed by setting index.highlight.weight_matches_mode.enabled to false — from the old Elasticsearch vector model page -->

:::caution[Hybrid search on IBM Databases for Elasticsearch]
If `Hybrid` search on IBM Databases for Elasticsearch fails with a "KnnScoreDocQuery was created by a different reader" error, set `highlight.weight_matches_mode.enabled` to `false` in the index settings (`PUT /<INDEX_NAME>/_settings`) from the Kibana dev console.
:::

### Vector

`Vector` shows the same four fields as `Hybrid`: **Use NeuralSeek configured embedding models?**, **Use the Elastic ELSER model?**, **Model Id** and **Embedding Field**. The fields work the same way. The difference is the search: no keyword query runs, so a question matches documents only by the similarity of their embeddings.

![Hybrid & Vector Search Settings with Elastic Query Type set to Vector: the same four fields as Hybrid — Use NeuralSeek configured embedding models? False, Use the Elastic ELSER model? True, and empty Model Id and Embedding Field boxes](/img/neural-config/knowledgebase-connection@kb-es-vector-panel.png)

This is the mode the help text warns about most directly ("Do not casually enable Vector search"). Use it only when keyword matching gives nothing useful for your content. Test it on the questions that name versions or part numbers before you save it.

### Semantic

`Semantic` replaces the four fields with a single query-body box, labelled **Sparse Vector or KNN syntax**. Its full label reads: Sparse Vector or KNN syntax. Replace "example-inference-endpoint" with your inference endpoint in elasticsearch. NeuralSeek sends what you write here as the search. Three worked examples sit beside the box.

![Hybrid & Vector Search Settings with Elastic Query Type set to Semantic: the query-body box with a grey sparse_vector template on the left, and on the right the "Example using Sparse Vectors" and "Example using Dense Vectors/kNN with Elasticsearch-deployed model" code samples](/img/neural-config/knowledgebase-connection@kb-es-semantic-panel.png)

The empty box shows this template as a grey hint:

```json
{
  "sparse_vector": {
    "field": "<< semantic_field >>.inference.chunks.embeddings",
    "inference_id": "example-inference-endpoint",
    "query": "<< query >>"
  }
}
```

The template contains two placeholders. `<< query >>` stands where the search text goes; the screen's own sparse-vector example puts `"query": "example query"` in that spot. `<< semantic_field >>` stands for the field name. In that same example it is replaced by `example_field`. The screen does not say where NeuralSeek takes the field name from, so write your own field name if you are unsure.

The three examples, as the screen gives them:

- **Example using Sparse Vectors.** "Replace "example-inference-endpoint" with your inference endpoint name." It is the template above, filled in with `example_field` and `example query`.
- **Example using Dense Vectors/kNN with Elasticsearch-deployed model.** "Replace "example-model-id" with your deployed model name." Elasticsearch builds the query vector from the question with the model you name:

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

- **Example using Dense Vectors/kNN with NeuralSeek Native embedding.** "No model deployment in Elasticsearch required. Enable "Use NeuralSeek configured embedding models" and NeuralSeek computes the query vector at search time." There is no `query_vector_builder` here, because NeuralSeek supplies the vector:

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

The third example asks you to enable **Use NeuralSeek configured embedding models?**, but in `Semantic` mode that dropdown is not in the section. It appears only under `Hybrid` and `Vector`. This page does not show whether a value set there carries over to `Semantic`.

`Semantic` is the mode for an index built with Elasticsearch's inference endpoints, where the embeddings sit under `.inference.chunks.embeddings`. It is also the mode for a kNN query tuned by hand. Unlike `Hybrid` and `Vector`, it has no fixed ELSER fields: the query body carries everything.

### watsonx Discovery

With **KnowledgeBase Type** set to `watsonx Discovery`, **KnowledgeBase Connection** asks for a **watsonx Discovery Endpoint**, a **watsonx Discovery Private API Key** and a **watsonx Discovery Index Name**, followed by the same field mappings as `ElasticSearch`: **Curation Data Field**, **Link Field**, **Document Name Field**, **Additional Payload Field** and the rest. Those fields are described on [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

![The KnowledgeBase Connection fields for watsonx Discovery: Document Name Field reading title, an empty Additional Payload Field, Attribute sources inside LLM Context by Document Name reading Enabled, Return the full document instead of passages reading Disabled, Filter Field, the Re-Sort values list table, Static Default Filter Value and the Enable Advanced Schema button](/img/neural-config/knowledgebase-connection@kb-wxd-panel.png)

Below them, the dialog shows the same **Hybrid & Vector Search Settings** section as for `ElasticSearch`. The help text is the same, and it still names ElasticSearch. **Elastic Query Type** is the same dropdown; for `watsonx Discovery` the screen shows it reading `Lucene`, the only control in the section, as in the [Elastic Query Type](#elastic-query-type) screenshot above.

The `Hybrid`, `Vector` and `Semantic` forms above are shown as they appear for `ElasticSearch`. For `watsonx Discovery`, this page shows only the `Lucene` form. Check your own screen before assuming the other forms look the same.

## FAQ

### Which Elastic Query Type should I start with?

Start with `Lucene`. The section's own help text says "For most usecases Lucene search is best". It warns that `Vector` and `Hybrid` "may amplify hallucinations", most of all for questions about part numbers, versions or product names. Move to `Hybrid` or `Vector` only when keyword search misses relevant documents, and check the results on questions where exact terms matter.

### Why is there no Hybrid & Vector Search Settings section in my configuration?

The section appears only when **KnowledgeBase Type** in **KnowledgeBase Connection** is `ElasticSearch` or `watsonx Discovery`. None of the other fourteen stores shows it, including `OpenSearch` and `Elastic AppSearch`. Vector search on other stores is configured with that store; see [Supported knowledge bases](/knowledge/supported-knowledgebases/).

### How does Hybrid combine keyword and vector results, and can I change the weighting?

`Hybrid` sends one combined query that slightly boosts `Lucene` (exact-match) results and falls back to `Vector` results when nothing matches exactly. The weighting of that boost cannot be changed; the section has no control for it.

### Do I need an embedding model deployed in Elasticsearch?

Not necessarily. Setting **Use NeuralSeek configured embedding models?** to `True` makes NeuralSeek compute the query vector with the model from [Embedding Models](/configuration/neural-config/embedding-models/). The screen's kNN example says "No model deployment in Elasticsearch required" for that case. The documents in the index must still have been embedded with the same model. With `False`, you name a model deployed in Elasticsearch in **Model Id**.

### What do I put in Model Id and Embedding Field?

**Model Id** is the ID of the model deployed in your Elasticsearch cluster. **Embedding Field** is the index field that holds its output. The screen suggests `ml.tokens` for ELSER v1 and `content_embedding` for ELSER v2. The grey text in both boxes is only a hint, so type your own values.

### Does Semantic mode use the "Use NeuralSeek configured embedding models?" setting?

The screen does not show it. The kNN example in `Semantic` mode tells you to enable **Use NeuralSeek configured embedding models?**, but that dropdown appears only under `Hybrid` and `Vector`. If you rely on NeuralSeek to compute the vector in `Semantic` mode, check your search results after saving.
