---
title: "Elasticsearch vector model"
description: "Connect NeuralSeek to an Elasticsearch index that holds embeddings: set KnowledgeBase Type to ElasticSearch, enter the endpoint, API key and index, map the index fields, then set Elastic Query Type to Vector with the model and embedding field the index was built with."
---

When your content already lives in an Elasticsearch index that carries embeddings, you can have
Seek search it by meaning rather than by keyword. This page covers the NeuralSeek side of that
setup, all of it in the **Edit Configuration** dialog of
[Neural Config](/configuration/neural-config/): select `ElasticSearch` as the knowledge base,
connect to the index, map its fields, and switch the query type to `Vector` with the model and
field that hold the embeddings. What the four query types do, and when each fits, is explained on
[Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/).

## Before you begin

Read the warning the product shows at the top of **Hybrid & Vector Search Settings** before you
plan the change:

> ElasticSearch can provide Lucene, Hybrid, and pure Vector search. For most usecases Lucene
> search is best. Depending on your settings, Vector and Hybrid searches may amplify
> hallucinations by bringing back similar but corporatley-different documentation, adding
> confusion to the LLM - especially with searches based on part number, version, or product
> name... Do not casually enable Vector search.

Vector search compares meaning, so it can find a passage that answers a question in different
words. It can also bring back a passage that looks similar but is about another product or
version. If your users ask about part numbers, versions or product names, keep keyword (`Lucene`)
search and test `Vector` against real questions before you switch.

The index itself is built in Elastic's tools, not in NeuralSeek. Check each step against Elastic's
documentation for your version:

<!-- UNCONFIRMED: Elasticsearch can run on IBM Cloud Databases for Elasticsearch or on Elastic Cloud; Kibana's Connection Details shows the endpoint and is where the API key is created — old NeuralSeek docs page -->

1. A deployment and credentials: Elasticsearch on IBM Cloud Databases for Elasticsearch or on
   Elastic Cloud. In Kibana, Connection Details shows the endpoint, and you create an API key
   there. Both go into NeuralSeek in the next section.

<!-- UNCONFIRMED: vectorising needs a machine-learning node; ELSER is deployed from Kibana > Machine Learning > Trained Models, or a text-embedding model is imported with Eland — old NeuralSeek docs page -->

2. A deployed model: embedding needs a machine-learning node on the deployment. Deploy ELSER
   from Kibana's Machine Learning > Trained Models page, or import a text-embedding model with
   Elastic's Eland client. Note the model's ID.

<!-- UNCONFIRMED: an ingest pipeline with an inference processor writes the embeddings into a destination index with an embeddings field; the source is reindexed through it; a dense vector field's dims must equal the model's output size; a text_expansion or kNN query in Kibana tests it — old NeuralSeek docs page -->

3. An index with embeddings: a destination index with an embeddings field, filled by an ingest
   pipeline whose inference processor runs the model on your text. Reindex your documents
   through it (for a dense vector field, the dimension count must match the model's output
   size), then run a text-expansion (ELSER) or kNN query in Kibana to check it returns sensible
   documents.

Before you change the knowledge base type of a working configuration, keep a copy of it with
[Backup and restore](/configuration/backup-restore/).

## Select ElasticSearch and connect to the index

1. In **Neural Config**, open the configuration (for example **Default Config**) to open the
   **Edit Configuration** dialog, then expand **KnowledgeBase Connection**.
2. In **KnowledgeBase Type**, pick `ElasticSearch`. `Elastic AppSearch`, just above it in the
   list, is a different type with different fields.

   ![The KnowledgeBase Type list open below the current value NeuralSeek KB, showing Watson Discovery, Watson Discovery (CP4D), Elastic AppSearch and ElasticSearch; KnowledgeBase Language reads English beside it](/img/neural-config/knowledgebase-connection--options-knowledgebase-type.png)

   Once `ElasticSearch` is selected, the connection fields appear directly below the type. The
   full list of types, and **KnowledgeBase Language** beside it, are described on
   [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

3. In **ElasticSearch Endpoint**, enter the URL of your Elasticsearch deployment. The empty field
   shows the placeholder `https://myElasticAppSearchEndpoint.com`; replace it with your own
   endpoint.
4. In **ElasticSearch Private API Key**, enter the key NeuralSeek authenticates with. The field is
   masked; select **Show password** to check what you typed.
5. In **ElasticSearch Index Name**, enter the index Seek searches (placeholder `kbase`). For vector
   search, name the index that holds the embeddings field, not a source index without them.

## Map the index fields

The field grid below the connection tells NeuralSeek which field of each document plays which
role. Each control is described in full on
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/); this is what
to set for an embeddings index.

![The field-mapping grid of KnowledgeBase Connection with ElasticSearch selected: Curation Data Field, Link Field, Document Name Field, Additional Payload Field, Include additional Payload Field inside LLM context, Attribute sources inside LLM Context by Document Name, Return the full document instead of passages, Filter Field, Static Default Filter Value, the Re-Sort values list with its Priority and Value or RegExp table, and the Enable Advanced Schema button](/img/neural-config/knowledgebase-connection@kb-elastic-panel.png)

1. In **Curation Data Field**, **Link Field** and **Document Name Field**, pick the index fields
   that hold the passage text, the document's URL and its title. A field name already shown comes
   from a previously connected index; replace it with the matching field of yours.
2. Optionally, pick one more field in **Additional Payload Field** and decide in **Include
   additional Payload Field inside LLM context** whether it is passed to the LLM too. Set
   **Attribute sources inside LLM Context by Document Name** to `Enabled` to introduce each
   passage to the LLM with its document name, which helps some LLMs keep track of which source
   said what; `Disabled` passes the passages without names.
3. Leave **Return the full document instead of passages (only enable this if all of your
   documents are short)** on `Disabled` unless every document in the index is short, as its label
   says.
4. If requests filter the index, set **Filter Field**, and **Static Default Filter Value (when no
   runtime filter is passed)** for requests that carry no filter of their own.
5. To push certain results up, use **Re-Sort values list.**: "Enter a prioritized list of values
   you want to re-rank above other results, regardless of KB score." Pick the **Re-Sort Field**,
   then add rows of Priority and **Value or RegExp**.

**Enable Advanced Schema**, at the foot of the section, is covered on
[KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/).

## Switch the query type to Vector

**Hybrid & Vector Search Settings** is its own section of the **Edit Configuration** dialog,
between **KnowledgeBase Tuning** and **LLM Details**. It is shown when **KnowledgeBase Type** is
`ElasticSearch`.

1. Expand **Hybrid & Vector Search Settings**.
2. In **Elastic Query Type**, pick `Vector`. The other query types, `Lucene`, `Hybrid` and
   `Semantic`, are described on
   [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/).

   ![Hybrid & Vector Search Settings with Elastic Query Type on Vector: Use NeuralSeek configured embedding models? reading False, Use the Elastic ELSER model? reading True, Model Id with the placeholder .elser_model_1, and Embedding Field with the placeholder ml.tokens and its ELSER v1 and v2 help text](/img/neural-config/knowledgebase-connection@kb-es-vector-panel.png)

3. Set **Use NeuralSeek configured embedding models?** (`False` in the form above). It decides
   whether the model deployed in Elasticsearch or one of NeuralSeek's own
   [embedding models](/configuration/neural-config/embedding-models/) turns the question into a
   vector; the query vector has to come from the same model that embedded the index.
   [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/) explains the
   choice.
4. Set **Use the Elastic ELSER model?**. `True`, shown above, matches an index built with Elastic's
   ELSER model and shows **Model Id** and **Embedding Field**.

   <!-- UNCONFIRMED: set Use the Elastic ELSER model to False for a kNN (dense-vector) model — old NeuralSeek docs page, NeuralSeek Configuration > Hybrid and Vector Search Settings -->

   If you imported a dense-vector (kNN) text-embedding model with Eland instead, set it to
   `False`.
5. In **Model Id**, enter the ID of the model deployed in Elasticsearch, exactly as Elastic lists
   it. The empty field shows the placeholder `.elser_model_1`.
6. In **Embedding Field**, enter the index field that holds the embeddings, the field your ingest
   pipeline writes to. The help text reads: "For ELSER v1 this is typicaly "ml.tokens", and for
   ELSER v2 "content_embedding"".

**Model Id** and **Embedding Field** must match what built the index: a different model, or a
field without embeddings, leaves vector search nothing to compare against.

## Check KnowledgeBase Tuning and save

Changing the type also changes **KnowledgeBase Tuning**, the section directly above **Hybrid &
Vector Search Settings**.

![Edit Configuration scrolled to the end of KnowledgeBase Connection: the collapsed KnowledgeBase Tuning section, Hybrid & Vector Search Settings open with Elastic Query Type on Lucene, and the Propose Changes and Save buttons at the foot of the dialog](/img/neural-config/knowledgebase-connection@kb-elastic.png)

1. Expand **KnowledgeBase Tuning**. With `ElasticSearch`, it shows **Snippet size** where the
   NeuralSeek KB shows Expansion Window: "Snippet size. Use this setting to window relevant
   details in a document that do not specifically mention the user question, but apply to it.",
   on a range from 100 to 1000. Adjust it as described on
   [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).
2. Select **Save** to apply the configuration, or **Propose Changes** to keep it for review.
   Nothing in the dialog applies until you do;
   [Using the Neural Config page](/configuration/neural-config/using-this-page/) explains the
   difference.

## Verify

1. In Seek, ask a question your index can answer, phrased differently from the document's own
   wording.
2. Check that the answer cites sources from your index.
3. Ask a few questions about specific part numbers, versions or product names, and compare the
   answers with **Elastic Query Type** on `Lucene`. If `Vector` brings back similar but wrong
   documents, switch back.

## Troubleshooting

- **A field list shows only "Loading data..."**: check the connection fields, **ElasticSearch
  Endpoint**, **ElasticSearch Private API Key** and **ElasticSearch Index Name**.
- **Answers mix up products or versions after the switch**: this is the case the screen's warning
  describes. Set **Elastic Query Type** back to `Lucene`, or compare `Hybrid` on
  [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/).

## FAQ

### Where do I switch Elasticsearch to vector search?

In **Neural Config**, open the configuration, expand **Hybrid & Vector Search Settings** and set
**Elastic Query Type** to `Vector`. The section is shown when **KnowledgeBase Type** in
**KnowledgeBase Connection** is `ElasticSearch`.

### Should I use Vector instead of Lucene?

Usually not. The screen's own advice is "For most usecases Lucene search is best", and Vector and
Hybrid searches may bring back similar but different documents, especially for part numbers,
versions or product names: "Do not casually enable Vector search." Compare answers to real
questions before and after the switch.

### What goes in Embedding Field?

The name of the index field that holds the embeddings. The help text gives the usual values:
"ml.tokens" for ELSER v1 and "content_embedding" for ELSER v2.

### Why does KnowledgeBase Tuning show Snippet size instead of Expansion Window?

The tuning section follows the **KnowledgeBase Type**: Expansion Window belongs to the NeuralSeek
KB, and with `ElasticSearch` the section shows **Snippet size**. See
[KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/).

## Related

- [Hybrid, vector and semantic search](/knowledge/hybrid-vector-semantic-search/)
- [KnowledgeBase Connection](/configuration/neural-config/knowledgebase-connection/)
- [Embedding models](/configuration/neural-config/embedding-models/)
- [KnowledgeBase Tuning](/configuration/neural-config/knowledgebase-tuning/)
- [Supported knowledge bases](/knowledge/supported-knowledgebases/)
- [Connect a knowledge base](/knowledge/connect-a-kb/)
- [Using the Neural Config page](/configuration/neural-config/using-this-page/)
- [Backup and restore](/configuration/backup-restore/)
